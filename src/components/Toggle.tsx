import { useState } from 'react';
import './Toggle.css';
import type {PetQuoteFields} from "../types.ts"; // We'll add this below

export function ToggleSwitch({ field, initialValue = false, updateForm, className = "", ...props }: { field: keyof PetQuoteFields, initialValue: boolean, updateForm: (update: Partial<PetQuoteFields>) => void, className: string} & React.HTMLAttributes<HTMLDivElement>) {
  const [isOn, setIsOn] = useState(initialValue);

  const toggle = () => {
    const newValue = !isOn;
    setIsOn(newValue);
    updateForm({ [field]: newValue });
  };

  return (
    <label className="switch" >
      <input type="checkbox" checked={isOn} onChange={toggle} />
      <span className={`slider ${className}`} {...props}/>
    </label>
  );
}