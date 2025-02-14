import React from 'react';

interface WeightSelectorProps {
    minWeight: number;
    maxWeight: number;
    selectedWeight: number;
    onChange: (weight: number) => void;
}

export const WeightSelector: React.FC<WeightSelectorProps> = ({
    minWeight,
    maxWeight,
    selectedWeight,
    onChange
}) => {
    // Generate weight options from min to max
    const weightOptions = Array.from(
        { length: maxWeight - minWeight + 1 },
        (_, i) => minWeight + i
    );

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-darkGray">Select Weight (g)</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {weightOptions.map((weight) => (
                    <label
                        key={weight}
                        className={`
                            relative flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer
                            transition-all duration-200 ease-in-out
                            ${selectedWeight === weight
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-gray-200 hover:border-primary/50'
                            }
                        `}
                    >
                        <input
                            type="radio"
                            name="weight"
                            value={weight}
                            checked={selectedWeight === weight}
                            onChange={() => onChange(weight)}
                            className="sr-only"
                        />
                        <span className="text-lg font-medium text-darkGray">{weight}g</span>
                    </label>
                ))}
            </div>
        </div>
    );
};
