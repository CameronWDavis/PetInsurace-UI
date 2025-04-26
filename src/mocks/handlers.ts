import {http, HttpResponse} from 'msw'
import {type InsuranceProvider, type PetQuoteFields, PetQuoteFormSchema, PetQuoteResponse} from "../types.ts";

const providers: InsuranceProvider[] = [
    {
        name: 'PawShield',
        baseRate: 45,
        petTypeFactor: {dog: 1.2, cat: 1.0},
        genderFactor: {male: 1.1, female: 1.0},
        spayNeuterDiscount: 0.92,
        limitFactor: 0.08,
        deductibleFactor: 0.06,
        reimbursementFactor: 1.0,
        dental: 1.05,
        lab: 1.087,
        prescription: 1.032,
        emergency: 1.0
    },
    {
        name: 'FurryCare',
        baseRate: 50,
        petTypeFactor: {dog: 1.15, cat: 0.95},
        genderFactor: {male: 1.05, female: 1.02},
        spayNeuterDiscount: 0.90,
        limitFactor: 0.09,
        deductibleFactor: 0.07,
        reimbursementFactor: 0.98,
        dental: 1.08,
        lab: 1.1,
        prescription: 1.06,
        emergency: 1.0
    },
    {
        name: 'TailGuard',
        baseRate: 55,
        petTypeFactor: {dog: 1.25, cat: 1.05},
        genderFactor: {male: 1.08, female: 1.0},
        spayNeuterDiscount: 0.88,
        limitFactor: 0.1,
        deductibleFactor: 0.05,
        reimbursementFactor: 1.02,
        dental: 1.0,
        lab: 1.0,
        prescription: 1.0,
        emergency: 1.0
    },
    {
        name: 'WhiskerSafe',
        baseRate: 40,
        petTypeFactor: {dog: 1.1, cat: 0.9},
        genderFactor: {male: 1.03, female: 1.0},
        spayNeuterDiscount: 0.95,
        limitFactor: 0.07,
        deductibleFactor: 0.08,
        reimbursementFactor: 1.05,
        dental: 1.2,
        lab: 1.2,
        prescription: 1.2,
        emergency: 1.1
    }
];


function getPetInsuranceQuote(params: PetQuoteFields, provider: InsuranceProvider): number {
    console.log("getting pet insurance with params", params)
    const baseCost = provider.baseRate * provider.petTypeFactor[params.petType || "dog"] * provider.genderFactor[params.gender || "male"];
    const spayNeuterAdjustment = params.spayedOrNeutered ? provider.spayNeuterDiscount : 1.0;
    // if limit is 0 it is unlimited, charge more.
    const limitAdjustment = 1 + ((params.annualLimit || 20000) / 10000) * provider.limitFactor;
    const deductibleAdjustment = 1 - (params.deductible / 1000) * provider.deductibleFactor;
    const reimbursementAdjustment = params.reimbursementRate / 100 * provider.reimbursementFactor;
    const dentalAdjustment = params.dental ? provider.dental : 1.0;
    const labAdjustment = params.lab ? provider.lab : 1.0;
    const prescriptionAdjustment = params.prescription ? provider.prescription : 1.0;
    const emergencyAdjustment = params.emergency ? provider.emergency : 1.0;

    const finalQuote = baseCost * spayNeuterAdjustment * limitAdjustment * deductibleAdjustment * reimbursementAdjustment * dentalAdjustment * labAdjustment * prescriptionAdjustment * emergencyAdjustment;
    return Math.round(finalQuote * 100) / 100; // Round to 2 decimal places
}


export const handlers = [
    http.post<
        never,
        PetQuoteFields,
        PetQuoteResponse,
        '/api/quotes'
    >('/api/quotes', async ({request}) => {

        const parseResult = PetQuoteFormSchema.safeParse(await request.json());
        if (!parseResult.success) {
            console.error('Invalid request:', parseResult.error);
        }
        console.log("Parsed result", parseResult)
        const quoteRequest: PetQuoteFields | undefined = parseResult?.data;

        const petQuoteReponse: PetQuoteResponse = {
            quotes: quoteRequest ? providers.map(p => ({name: p.name, quote: getPetInsuranceQuote(quoteRequest, p)})) : []
        }
        return HttpResponse.json(petQuoteReponse);
    }),
]