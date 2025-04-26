export const PetButton = ({petType, onClick, selected = false}: {petType: "cat" | "dog" | "", onClick: () => void, selected: boolean}) => {
    return <button
            className={`w-1/2 p-2 rounded-md ${selected && "selected"}`}
            onClick={onClick}>
            {petType == "dog" ? "🐶 Dog" : "🐱 Cat"}
        </button>
}