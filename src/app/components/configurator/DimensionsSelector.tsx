import React from 'react';
import { useTranslations } from 'next-intl';
import { SelectInput } from '../ui/SelectInput';
import { Dimensions, RingSizeSystem } from '@/app/types/configurator';
import { profileSvg } from './profileSvgs';

interface DimensionsSelectorProps {
    dimensions: Dimensions;
    onUpdateDimensions: (dimensions: Dimensions) => void;
    selectedProfile: string | null;
}

const ringSizeOptions: Record<RingSizeSystem, (string | number)[]> = {
    Universal: Array.from({ length: 31 }, (_, i) => i + 45), // 45 to 75
    UK: [
        'F', 'F½', 'G', 'G½', 'H', 'H½', 'I', 'I½', 'J', 'J½',
        'K', 'K½', 'L', 'L½', 'M', 'M½', 'N', 'N½', 'O', 'O½',
        'P', 'P½', 'Q', 'Q½', 'R', 'R½', 'S', 'S½', 'T', 'T½',
        'U', 'U½', 'V', 'V½', 'W', 'W½', 'X', 'X½', 'Y', 'Y½', 'Z'
    ],
    USA: Array.from({ length: 27 }, (_, i) => (i * 0.5 + 2).toFixed(1))?.map(size => 
        size.endsWith('.0') ? parseInt(size) : parseFloat(size)
    ) // 2 to 15 with half sizes
};

export const DimensionsSelector: React.FC<DimensionsSelectorProps> = ({
    dimensions,
    onUpdateDimensions,
    selectedProfile,
}) => {
    const t = useTranslations();
    const handleChange = <T extends keyof Dimensions>(field: T, value: Dimensions[T]) => {
        if (field === 'ringSizeSystem') {
            // When changing the ring size system, set a default ring size for the new system
            const newSystem = value as RingSizeSystem;
            onUpdateDimensions({
                ...dimensions,
                ringSizeSystem: newSystem,
                ringSize: ringSizeOptions[newSystem][0]
            });
        } else {
            onUpdateDimensions({
                ...dimensions,
                [field]: value,
            });
        }
    };

    return (
        <div className="space-y-6">
            {/* Selected Profile Preview */}
            {selectedProfile && (
                <div className="mb-8">
                    <h3 className="text-darkGray text-lg font-medium mb-4">{t('configurator.dimensions.selectedProfile')}</h3>
                    <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg p-4">
                        <div className="w-full h-full flex items-center justify-center text-darkGray">
                            {profileSvg[selectedProfile]}
                        </div>
                    </div>
                </div>
            )}

            <div className='grid grid-cols-2 gap-4'>
                <SelectInput
                    label={t('configurator.dimensions.profileWidth')}
                    value={dimensions.profileWidth.toString()}
                    onChange={(value) => handleChange('profileWidth', Number(value))}
                    options={[2, 2.5, 3, 3.5, 4, 4.5, 5].map((width) => ({
                        value: width.toString(),
                        label: `${width.toFixed(2)} mm`
                    }))}
                />


                <SelectInput
                    label={t('configurator.dimensions.profileHeight')}
                    value={dimensions.profileHeight.toString()}
                    onChange={(value) => handleChange('profileHeight', Number(value))}
                    options={[1, 1.25, 1.5, 1.75, 2].map((height) => ({
                        value: height.toString(),
                        label: `${height.toFixed(2)} mm`
                    }))}
                />


                <SelectInput
                    label={t('configurator.dimensions.ringSizeSystem')}
                    value={dimensions.ringSizeSystem}
                    onChange={(value) => handleChange('ringSizeSystem', value as RingSizeSystem)}
                    options={(['Universal', 'UK', 'USA'] as const).map((system) => ({
                        value: system,
                        label: system
                    }))}
                />


                <SelectInput
                    label={t('configurator.dimensions.ringSize')}
                    value={dimensions.ringSize.toString()}
                    onChange={(value) => {
                        const parsedValue = dimensions.ringSizeSystem === 'Universal' 
                            ? Number(value)
                            : value;
                        handleChange('ringSize', parsedValue);
                    }}
                    options={ringSizeOptions[dimensions.ringSizeSystem].map((size) => ({
                        value: size.toString(),
                        label: size.toString()
                    }))}
                />

            </div>
        </div>
    );
};
