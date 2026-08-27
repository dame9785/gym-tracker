type NutritionInputProps = {
  id: string;
  unit: string;
  label: string;
  onChange: (value: number) => void;
};

export default function NutritionInput({ id, label, unit, onChange }: NutritionInputProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </label>

      <input
        id={id}
        type="number"
        min="0"
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-blue-500"
        placeholder="0"
      />

      <p className="mt-1 text-xs text-slate-500">{unit}</p>
    </div>
  );
}
