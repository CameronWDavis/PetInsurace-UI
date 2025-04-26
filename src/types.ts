import { z } from 'zod';


const PetTypeSchema = z.enum(['dog', 'cat', '']);
const GenderSchema = z.enum(['male', 'female', '']);
export type PetType = z.infer<typeof PetTypeSchema>;
export type Gender = z.infer<typeof GenderSchema>;

export const PetQuoteFormSchema = z.object({
    petType: PetTypeSchema,
    gender: GenderSchema,
    breed: z.string(),
    age: z.coerce.number().int(),
    spayedOrNeutered: z.boolean(),
    annualLimit: z.coerce.number().int(),
    deductible: z.coerce.number(),
    reimbursementRate: z.number(),
    zipCode: z.optional(z.string()),
    email: z.optional(z.string()),
    firstName: z.optional(z.string()),
    lastName: z.optional(z.string()),
    mobileNumber: z.optional(z.string()),
    dental: z.boolean(),
    lab: z.boolean(),
    prescription: z.boolean(),
    emergency: z.boolean()
});
export type PetQuoteFields = z.infer<typeof PetQuoteFormSchema>;

export type PetQuoteFieldsUpdate = {
  [K in keyof PetQuoteFields]?: PetQuoteFields[K];
};
export type BooleanKeys<T> = {
  [K in keyof T]: T[K] extends boolean ? K : never
}[keyof T]

export type NumberKeys<T> = {
  [K in keyof T]: T[K] extends number ? K : never
}[keyof T]

export interface InsuranceProvider {
    name: string;
    baseRate: number; // Base monthly cost before adjustments
    petTypeFactor: { dog: number; cat: number };
    genderFactor: { male: number; female: number };
    spayNeuterDiscount: number;
    limitFactor: number;
    deductibleFactor: number;
    reimbursementFactor: number;
    dental: number,
    lab: number,
    prescription: number,
    emergency: number
}

export interface PetQuote {
    name: string,
    quote: number
}

export interface PetQuoteResponse {
    quotes: PetQuote[]
}