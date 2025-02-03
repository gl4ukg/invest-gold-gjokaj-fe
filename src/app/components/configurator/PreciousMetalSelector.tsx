import React from 'react';
import { PreciousMetal, ColorType, MetalColor, PolishType, Fineness, ColorConfig } from '@/app/types/configurator';

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

const twoColorShapes = Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    image: `/images/two-color-${i + 1}.jpg` // You'll need to add these images
}));

const threeColorShapes = Array.from({ length: 17 }, (_, i) => ({
    id: i + 1,
    image: `/images/three-color-${i + 1}.jpg` // You'll need to add these images
}));

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

    const handleShapeSelect = (shapeId: number) => {
        onUpdatePreciousMetal({
            ...preciousMetal,
            shapeId,
        });
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
                <div>
                    <h3 className="text-darkGray text-lg font-medium mb-4">Select Shape</h3>
                    <div className="grid grid-cols-4 gap-4">
                        {(preciousMetal.colorType === 'two' ? twoColorShapes : threeColorShapes)?.map((shape) => (
                            <button
                                key={shape.id}
                                onClick={() => handleShapeSelect(shape.id)}
                                className={`p-2 border rounded-lg ${
                                    preciousMetal.shapeId === shape.id
                                        ? 'border-primary bg-primary/10'
                                        : 'border-darkGray'
                                }`}
                            >
                                <div className="aspect-square bg-gray-100 rounded-lg mb-2">
                                    {/* Replace with actual image */}
                                    <div className="w-full h-full flex items-center justify-center text-darkGray">
                                        Shape {shape.id}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Color Configuration */}
            {preciousMetal.colors?.map((color, index) => (
                <div key={index} className="space-y-4">
                    <h3 className="text-darkGray text-lg font-medium">
                        {index === 0 ? 'Primary' : index === 1 ? 'Secondary' : 'Tertiary'} Color
                    </h3>
                    
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
