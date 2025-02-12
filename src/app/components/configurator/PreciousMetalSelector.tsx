import React from 'react';
import { PreciousMetal, ColorType, MetalColor, PolishType, Fineness, ColorConfig, ShapeCategory, ShapeConfig, WaveCount, HeightPercentage } from '@/app/types/configurator';

interface PreciousMetalSelectorProps {
    preciousMetal: PreciousMetal;
    onUpdatePreciousMetal: (preciousMetal: PreciousMetal) => void;
}

const metalColors: MetalColor[] = [
    'yellow gold',
    'white gold',
    'red gold',
    'rose gold',
    'white gold with palladium',
    'Silver / Rhodium plated',
    'Silver / Yellow Gold plated',
    'Silver / red Gold plated',
    'zirconium (black)',
    'zirconium (grey)',
];

const polishTypes: PolishType[] = [
    'Polished',
    'Vertical matte',
    'Horizontal matte',
    'Crossed matte',
    'Sandblasted',
    'Double crossed',
    'Ice matte',
    'Honeycomb',
    'Hammered tight',
    'Hammered wide',
    'Bark cross',
    'Wave',
    'MA3',
    'MA2-2',
    'Hammered tight (polished)',
    'Hammered wide (polished)',
];

const finenessOptions: Fineness[] = ['8K', '9K', '10K', '14K', '18K', '21K', '22K'];

const twoColorShapes: { category: ShapeCategory; variant: string }[] = [
    { category: 'vertical', variant: '1-1' },
    { category: 'vertical', variant: '1-2' },
    { category: 'vertical', variant: '2-1' },
    { category: 'vertical', variant: '3-1' },
    { category: 'vertical', variant: '4-1' },
    { category: 'sine', variant: '1-1' },
    { category: 'diagonal', variant: '1-1' },
    { category: 'segment', variant: '1-1' },
    { category: 'horizontal', variant: '1-1' },
];

const threeColorShapes: { category: ShapeCategory; variant: string }[] = [
    { category: 'vertical', variant: '1-1-1' },
    { category: 'vertical', variant: '2-1-2' },
    { category: 'vertical', variant: '1-2-2' },
    { category: 'vertical', variant: '2-2-1' },
    { category: 'vertical', variant: '1-2-1' },
    { category: 'vertical', variant: '3-1-3' },
    { category: 'vertical', variant: '1-3-1' },
    { category: 'vertical', variant: '1-4-1' },
    { category: 'vertical', variant: '4-1-1' },
    { category: 'vertical', variant: '3-1-1' },
    { category: 'vertical', variant: '2-1-1' },
    { category: 'diagonal', variant: '1-1-1' },
    { category: 'diagonal', variant: '1-2-1' },
    { category: 'vertical', variant: '2-1-2' },
    { category: 'sine', variant: '1-1-1' },
    { category: 'sine', variant: '1-2-1' },
    { category: 'sine', variant: '2-1-2' },
];

const waveCountOptions: WaveCount[] = [2, 3, 4];
const heightPercentageOptions: HeightPercentage[] = [30, 50, 70];

export const PreciousMetalSelector: React.FC<PreciousMetalSelectorProps> = ({
    preciousMetal,
    onUpdatePreciousMetal,
}) => {
    const handleColorTypeChange = (colorType: ColorType) => {
        onUpdatePreciousMetal({
            colorType,
            colors: Array(colorType === 'single' ? 1 : colorType === 'two' ? 2 : 3).fill({
                metalColor: metalColors[0],
                polishType: polishTypes[0],
                fineness: finenessOptions[0],
            }),
        });
    };

    const handleShapeSelect = (category: ShapeCategory, variant: string) => {
        onUpdatePreciousMetal({
            ...preciousMetal,
            shape: {
                category,
                variant,
                ...(category === 'sine' ? { waveCount: 2, heightPercentage: 50 } : {}),
                ...(category === 'diagonal' ? { heightPercentage: 50 } : {}),
            },
        });
    };

    const handleWaveCountChange = (waveCount: WaveCount) => {
        if (preciousMetal.shape?.category === 'sine') {
            onUpdatePreciousMetal({
                ...preciousMetal,
                shape: {
                    ...preciousMetal.shape,
                    waveCount,
                },
            });
        }
    };

    const handleHeightPercentageChange = (heightPercentage: HeightPercentage) => {
        if (preciousMetal.shape?.category === 'sine' || preciousMetal.shape?.category === 'diagonal') {
            onUpdatePreciousMetal({
                ...preciousMetal,
                shape: {
                    ...preciousMetal.shape,
                    heightPercentage,
                },
            });
        }
    };

    const handleColorConfigUpdate = (index: number, updates: Partial<ColorConfig>) => {
        const newColors = [...preciousMetal.colors];
        newColors[index] = { ...newColors[index], ...updates };
        onUpdatePreciousMetal({
            ...preciousMetal,
            colors: newColors,
        });
    };

    return (
        <div className="space-y-8">
            {/* Color Type Selection */}
            <div>
                <h3 className="text-darkGray text-lg font-medium mb-4">Select Color Type</h3>
                <div className="grid grid-cols-3 gap-4">
                    {(['single', 'two', 'three'] as const)?.map((type) => (
                        <button
                            key={type}
                            onClick={() => handleColorTypeChange(type)}
                            className={`p-4 border rounded-lg ${
                                preciousMetal.colorType === type
                                    ? 'border-primary bg-primary/10'
                                    : 'border-darkGray'
                            }`}
                        >
                            <span className="text-darkGray">
                                {type === 'single' ? 'Single Color' : type === 'two' ? 'Two Colors' : 'Three Colors'}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Shape Selection for Two/Three Colors */}
            {(preciousMetal.colorType === 'two' || preciousMetal.colorType === 'three') && (
                <div className="space-y-6">
                    <div>
                        <h3 className="text-darkGray text-lg font-medium mb-4">Select Shape</h3>
                        <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-2 gap-4">
                            {(preciousMetal.colorType === 'two' ? twoColorShapes : threeColorShapes)?.map((shape) => (
                                <button
                                    key={`${shape.category}-${shape.variant}`}
                                    onClick={() => handleShapeSelect(shape.category, shape.variant)}
                                    className={`p-2 border rounded-lg ${
                                        preciousMetal.shape?.category === shape.category &&
                                        preciousMetal.shape?.variant === shape.variant
                                            ? 'border-primary bg-primary/10'
                                            : 'border-darkGray'
                                    }`}
                                >
                                    <div className="aspect-square bg-gray-100 rounded-lg mb-2">
                                        <img
                                            src={`/images/shapes/${preciousMetal.colorType}colors/${shape.category}-${shape.variant}.png`}
                                            alt={`${shape.category} ${shape.variant}`}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <p className="text-sm text-darkGray text-center">
                                        {shape.category} {shape.variant}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Additional Configuration for Sine Waves */}
                    {preciousMetal.shape?.category === 'sine' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-darkGray text-sm font-medium mb-2">Wave Count</label>
                                <select
                                    value={preciousMetal.shape.waveCount}
                                    onChange={(e) => handleWaveCountChange(Number(e.target.value) as WaveCount)}
                                    className="w-full p-2 border border-darkGray text-darkGray rounded-lg"
                                >
                                    {waveCountOptions.map((count) => (
                                        <option key={count} value={count}>
                                            {count} Waves
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-darkGray text-sm font-medium mb-2">Wave Height</label>
                                <select
                                    value={preciousMetal.shape.heightPercentage}
                                    onChange={(e) =>
                                        handleHeightPercentageChange(Number(e.target.value) as HeightPercentage)
                                    }
                                    className="w-full p-2 border border-darkGray text-darkGray rounded-lg"
                                >
                                    {heightPercentageOptions.map((height) => (
                                        <option key={height} value={height}>
                                            {height}%
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Additional Configuration for Diagonal */}
                    {preciousMetal.shape?.category === 'diagonal' && (
                        <div>
                            <label className="block text-darkGray text-sm font-medium mb-2">Diagonal Height</label>
                            <select
                                value={preciousMetal.shape.heightPercentage}
                                onChange={(e) => handleHeightPercentageChange(Number(e.target.value) as HeightPercentage)}
                                className="w-full p-2 border border-darkGray text-darkGray rounded-lg"
                            >
                                {heightPercentageOptions.map((height) => (
                                    <option key={height} value={height}>
                                        {height}%
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            )}

            {/* Color Configuration */}
            {preciousMetal.colors?.map((color, index) => (
                <div key={index} className="space-y-4">
                    <h3 className="text-darkGray text-lg font-medium">
                        {index === 0 ? 'Primary' : index === 1 ? 'Secondary' : 'Tertiary'} Color
                    </h3>
                    <div className='grid grid-cols-2 gap-4'>

                        {/* Metal Color */}
                        <div>
                            <label className="block text-darkGray text-sm font-medium mb-2">Metal Color</label>
                            <select
                                value={color.metalColor}
                                onChange={(e) => handleColorConfigUpdate(index, { metalColor: e.target.value as MetalColor })}
                                className="w-full p-2 border border-darkGray text-darkGray rounded-lg"
                            >
                                {metalColors?.map((color) => (
                                    <option key={color} value={color}>
                                        {color}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Polish Type */}
                        <div>
                            <label className="block text-darkGray text-sm font-medium mb-2">Polish Type</label>
                            <select
                                value={color.polishType}
                                onChange={(e) => handleColorConfigUpdate(index, { polishType: e.target.value as PolishType })}
                                className="w-full p-2 border border-darkGray text-darkGray rounded-lg"
                            >
                                {polishTypes?.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>
                    {/* Fineness */}
                    <div>
                        <label className="block text-darkGray text-sm font-medium mb-2">Fineness</label>
                        <select
                            value={color.fineness}
                            onChange={(e) => handleColorConfigUpdate(index, { fineness: e.target.value as Fineness })}
                            className="w-full p-2 border border-darkGray text-darkGray rounded-lg"
                        >
                            {finenessOptions?.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            ))}
        </div>
    );
};
