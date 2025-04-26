import {
  useLazyGetPreviewQuery,
  useLazyGetQuoteQuery,
} from "../features/petQuoteApi.ts";
import type {
  BooleanKeys,
  NumberKeys,
  PetQuote,
  PetQuoteFields,
  PetQuoteFieldsUpdate,
} from "../types.ts";
import { isEmpty } from "lodash-es";
import { motion } from "framer-motion";
import { usePetQuoteForm } from "../hooks/usePetQuoteForm.tsx";
import "../components/Toggle.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export const QuoteBuilder: React.FC = () => {
  const { formData, updateForm } = usePetQuoteForm();
  const navigate = useNavigate();
  const [lastHovered, setLastHovered] = useState<Record<string, number>>({});
  const [priceDiff, setPriceDiff] = useState<Record<string, number>>({});
  const [
    getQuote,
    { error: quoteError, data: quotes, isLoading: quoteLoading },
  ] = useLazyGetQuoteQuery();
  const [getPreview, { data: previews, isLoading: previewLoading }] =
    useLazyGetPreviewQuery();

  const handleHover = async (updates: Partial<PetQuoteFields>) => {
    setLastHovered(updates as Record<string, number>);
    if (!quotes) {
      return;
    }
    const updatedData = { ...formData, ...updates };
    getPreview(updatedData);
  };

  useEffect(() => {
    if (!!previews && !!quotes && !isEmpty(previews) && !isEmpty(quotes)) {
      setPriceDiff(
        Object.fromEntries(
          Object.entries(previews).map(([name, quote]) => [
            name,
            Math.round((quotes[name] - quote) * 100) / 100,
          ])
        )
      );
    }
  }, [previews, quotes]);

  useEffect(() => {
    if (
      formData.deductible &&
      formData.reimbursementRate &&
      formData.annualLimit >= 0
    ) {
      getQuote(formData);
    }
  }, [getQuote, formData]);

  useEffect(() => {
    const { breed, age, gender, petType } = formData;
    if (![breed, age, gender, petType].every((i) => !!i)) {
      navigate("/");
    }
  }, [formData, navigate]);

  const annualLimits = [3000, 5000, 10000, 0];
  const deductibles = [1000, 500, 200, 100];
  const reimbursementRates = [70, 80, 90];
  const addOns: Record<keyof PetQuoteFieldsUpdate, string> = {
    dental: "Dental Care",
    lab: "Lab and Diagnostic",
    prescription: "Prescription Care",
    emergency: "Emergency Care",
  };

  function fieldIsBoolean(
    field: keyof PetQuoteFieldsUpdate
  ): field is BooleanKeys<PetQuoteFieldsUpdate> {
    return typeof formData[field] === "boolean";
  }

  function fieldIsNumber(
    field: keyof PetQuoteFieldsUpdate
  ): field is NumberKeys<PetQuoteFieldsUpdate> {
    return typeof formData[field] === "number";
  }

  const getPricePicker = <T extends keyof PetQuoteFields>(
    label: string,
    priceArray: number[],
    field: T
  ) => (
    <div className="flex flex-col align-center">
      <label className="mr-2">{label}</label>
      <div className="button-group justify-center">
        {priceArray.map((price) => (
          <button
            key={`${label}-${price}`}
            className={`${
              lastHovered[field] === price &&
              formData[field] !== price &&
              "hovered"
            } ${formData[field] === price && "selected"}`}
            onMouseEnter={() =>
              fieldIsNumber(field) && handleHover({ [field]: price })
            }
            onClick={() => fieldIsNumber(field) && updateForm(field, price)}
          >
            {price || "unlimited"}
          </button>
        ))}
      </div>
    </div>
  );

  const getAddons = () => {
    return (
      <div className="flex flex-col align-center">
        <hr className="mt-4" />
        <div className="toggle-grid">
          {Object.entries(addOns).map(([field, title]) => (
            <div className="toggle-cell" key={field}>
              <span>{title}</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={formData[field]}
                  onChange={() => updateForm(field, !formData[field])}
                  className={`${
                    lastHovered[field] && !formData[field] && "hovered"
                  } ${formData[field] && "selected"}`}
                  onMouseEnter={() =>
                    fieldIsBoolean(field) && handleHover({ [field]: true })
                  }
                />
                <span
                  className={`slider ${
                    lastHovered[field] && !formData[field] && "hovered"
                  } ${formData[field] && "selected"}`}
                  onMouseEnter={() =>
                    fieldIsBoolean(field) && handleHover({ [field]: true })
                  }
                />
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const getPetColumn = () => (
    <div className="mt-4 space-y-4 w-full">
      {getPricePicker("Annual Max Limit:", annualLimits, "annualLimit")}
      {getPricePicker("Annual Deductible:", deductibles, "deductible")}
      {getPricePicker(
        "Reimbursement Rate:",
        reimbursementRates,
        "reimbursementRate"
      )}
    </div>
  );

  const getPriceDiff = (name: string) => {
    const diff = priceDiff?.[name];
    if (!diff) {
      return null;
    }
    return (
      <span className={diff >= 0 ? "add" : "subtract"}>
        {" "}
        {diff > 0 ? `-${Math.abs(diff)}` : `+${Math.abs(diff)}`}{" "}
      </span>
    );
  };

  return (
    <div className="mx-auto bg-[#242424] shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-200">
        How much coverage do you need?
      </h2>
      <div className="mt-4 space-y-4">
        <div className="w-full flex justify-center space-x-6">
          <div>{formData.petType == "dog" ? "🐶 Dog" : "🐱 Cat"}</div>
          <div>Age: {formData.age}</div>
          <div>{formData.gender === "male" ? "♂ Male" : "♀ Female"}</div>
        </div>
        <div>
          <span className="font-bold">Breed </span>
          {formData.breed}
        </div>
        <div
          className={`flex flex-row ${
            quotes ? "justify-between" : "justify-center"
          }`}
        >
          <div className="flex-col items-start">
            <motion.div
              layout
              transition={{ type: "linear", delay: 0.5 }}
              className="w-full"
            >
              {getPetColumn()}
              {getAddons()}
            </motion.div>
          </div>
          {quotes && (
            <motion.div
              key="unique-key"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5, duration: 0.2 }}
              className="flex-1 flex-col items-start"
            >
              <div className="m-4 space-y-4 flex flex-col justify-center items-start">
                {Object.entries(quotes).map(([name, quote]) => (
                  <div
                    key={name}
                    className="bg-white text-black p-4 rounded-md shadow-md w-64"
                  >
                    <div className="w-40 flex flex-col items-start">
                      <span key={name} className="text-lg font-medium">
                        {name}:
                      </span>
                      <div>
                        <span key={name} className="text-xl">
                          {quote}{" "}
                        </span>
                        {!!priceDiff[name] && getPriceDiff(name)}
                        {!!priceDiff[name] && (
                          <span key={name} className="text-xl">
                            {Math.round((quote - priceDiff[name]) * 100) / 100}{" "}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
        <div>
          {quoteError && <p className="text-red-500">Error submitting form</p>}
        </div>
      </div>
    </div>
  );
};
