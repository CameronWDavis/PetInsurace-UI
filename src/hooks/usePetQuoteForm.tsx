import { useDispatch, useSelector } from 'react-redux';
import type {PetQuoteFields} from "../types.ts";
import {updateField} from "../features/petQuoteSlice.ts";

export const usePetQuoteForm = () => {
  const formData = useSelector((state: { petQuote: PetQuoteFields }) => state.petQuote);
  const dispatch = useDispatch();

  const updateForm = <T extends keyof PetQuoteFields>(field: T, value: PetQuoteFields[T]) => {
    dispatch(updateField({ field, value }));
  };

  return {
    formData,
    updateForm,
  };
};