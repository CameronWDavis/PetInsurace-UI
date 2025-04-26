import Breed from '../breed.json'
import {useNavigate} from "react-router";
import {usePetQuoteForm} from "../hooks/usePetQuoteForm.tsx";

export const PetQuoteForm = () => {

    const navigate = useNavigate();
    const { formData, updateForm } = usePetQuoteForm();


    const handleSubmit = async () => {
        await navigate('/build');
    };

    const isReady = (formData.petType && formData.age && formData.gender && formData.breed);

    return (
        <div className="max-w-lg min-w-md mx-auto bg-[#242424] shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-200">Tell Us About Your Pet</h2>

            <div className="mt-4 space-y-4">

                {/* Pet Type */}
                <div className="flex space-x-4">
                    <button className={`default w-1/2 p-2 rounded-md ${formData.petType === "dog" && "selected"}`} onClick={() => updateForm("petType", "dog")}>🐶 Dog</button>
                    <button className={`default w-1/2 p-2 rounded-md ${formData.petType === "cat" && "selected"}`} onClick={() => updateForm("petType", "cat")}>🐱 Cat</button>
                </div>

                {/* Age */}
                <select
                    value={formData.age}
                    onChange={(e) => updateForm("age", Number(e.target.value))}
                    className={`default w-full p-2 rounded-md ${formData.age && "selected"}`}
                >
                    <option value="">Select Age</option>
                    {[...Array(20)].map((_, i) => (
                        <option key={i} value={i + 1}>
                            {i + 1} years
                        </option>
                    ))}
                </select>

                {/* Gender */}
                <div className="flex space-x-4">
                    <button
                        className={`default w-1/2 p-2 rounded-md ${formData.gender === "female" ? "bg-pink-500 text-white selected" : "bg-gray-200"}`}
                        onClick={() => updateForm("gender", "female")}
                    >
                        ♀ Female
                    </button>
                    <button
                        className={`default w-1/2 p-2 rounded-md ${formData.gender === "male" ? "bg-blue-500 text-white selected" : "bg-gray-200"}`}
                        onClick={() => updateForm("gender", "male")}
                    >
                        ♂ Male
                    </button>
                </div>

                {/* Altered */}
                <div className="flex justify-center">
                    <button
                        className={`default w-1/2 p-2 rounded-md ${formData.spayedOrNeutered ? "bg-blue-500 text-white selected" : "bg-gray-200"}`}
                        onClick={() => updateForm("spayedOrNeutered", !formData.spayedOrNeutered)}
                    >
                        {formData.gender && (formData.gender === "male" ? "Neutered" : "Spayed")}
                        {!!formData.gender || "Altered"}
                    </button>
                </div>

                {/* Breed */}

                <select className={`default w-full p-2 rounded-md ${formData.breed && "selected"}`} value={formData.breed} onChange={(e) => updateForm("breed", e.target.value)}>
                    <option value="" disabled>Select Breed</option>
                    {Breed.filter(breed => breed.speciesName.toLowerCase() === formData.petType.toLowerCase())
                        .sort((a, b) => a.friendlySearchName.localeCompare(b.friendlySearchName))
                        .map((opt) => (
                            <option key={`breed-${opt.friendlySearchName}`}
                                    value={opt.friendlySearchName}>{opt.friendlySearchName}</option>
                        ))}
                </select>
                <div>
                    <button
                        className={`default ${isReady && "submit"}`}
                        onClick={handleSubmit}
                        disabled={!isReady}
                    >
                        Build Quote →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PetQuoteForm;
