import { useTranslations } from 'next-intl';
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
    const t = useTranslations();
    // Generate weight options from min to max
    const weightOptions = Array.from(
        { length: maxWeight - minWeight + 1 },
        (_, i) => minWeight + i
    );

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-darkGray">{t('configurator.weight.title')}</h2>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                {weightOptions.map((weight) => (
                    <button
                        key={weight}
                        onClick={() => onChange(selectedWeight === weight ? 0 : weight)}
                        aria-pressed={selectedWeight === weight}
                        className={`
                            relative flex items-center justify-center p-4 rounded-lg border-2
                            transition-all duration-200 ease-in-out w-full
                            hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50
                            ${selectedWeight === weight
                                ? 'border-primary bg-primary/5 text-primary shadow-sm'
                                : 'border-gray-200 hover:border-primary/30 active:scale-95'
                            }
                        `}
                    >
                        <span className={`text-sm md:text-base lg:text-lg font-medium ${selectedWeight === weight ? 'text-primary' : 'text-darkGray'}`}>
                            {weight}g
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};
