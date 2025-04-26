import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {PetQuoteFields} from "../types.ts";


type UpdatePayload<K extends keyof PetQuoteFields> = {
    field: K;
    value: PetQuoteFields[K];
};

const initialState: PetQuoteFields = {
    age: 1,
    petType: "",
    gender: "",
    breed: "",
    zipCode: "",
    email: "",
    firstName: "",
    lastName: "",
    mobileNumber: "",
    spayedOrNeutered: false,
    annualLimit: -1,
    deductible: 0,
    reimbursementRate: 0,
    dental: false,
    lab: false,
    prescription: false,
    emergency: false
}

export const petQuoteSlice = createSlice({
    name: "petQuote",
    initialState,
    reducers: {
        updateField: <K extends keyof PetQuoteFields>(
            state: PetQuoteFields,
            action: PayloadAction<UpdatePayload<K>>
        ) => {
            const {field, value} = action.payload;
            state[field] = value;
        },
    },
});

export const {updateField} = petQuoteSlice.actions;