import React from 'react';
import { GroovesAndEdges, GrooveType, EdgeType, GrooveAlignment, SurfaceType, EdgeSettings } from '@/app/types/configurator';

interface GroovesAndEdgesSelectorProps {
    groovesAndEdges: GroovesAndEdges;
    onUpdateGroovesAndEdges: (settings: GroovesAndEdges) => void;
}

const grooveTypes: GrooveType[] = [
    'V-groove (110°)',
    'U-groove',
    'Convex',
    'Square groove',
    'Carbon-groove',
    'Milgrain',
];

const edgeTypes: EdgeType[] = ['none', 'step', 'carbon', 'milgrain'];
const alignments: GrooveAlignment[] = ['left', 'center', 'right'];
const surfaceTypes: SurfaceType[] = ['Polished', 'Matte', 'Brushed'];

const EdgeSettingsForm: React.FC<{
    edge: EdgeSettings;
    onChange: (edge: EdgeSettings) => void;
    label: string;
}> = ({ edge, onChange, label }) => (
    <div className="space-y-4">
        <h4 className="text-darkGray text-lg font-medium">{label}</h4>
        <div>
            <label className="block text-darkGray text-sm font-medium mb-2">Type</label>
            <div className="grid grid-cols-4 gap-4">
                {edgeTypes?.map((type) => (
                    <div key={type} className="relative">
                        <input
                            type="radio"
                            id={`${label}-${type}`}
                            name={`${label}-type`}
                            value={type}
                            checked={edge.type === type}
                            onChange={() => {
                                onChange({
                                    type,
                                    ...(type !== 'none' && {
                                        width: edge.width || 0.45,
                                        depth: edge.depth || 0.10,
                                        surface: edge.surface || 'Polished'
                                    })
                                });
                            }}
                            className="sr-only"
                        />
                        <label
                            htmlFor={`${label}-${type}`}
                            className={`block cursor-pointer ${edge.type === type ? 'ring-2 ring-primary ring-offset-2' : 'border border-darkGray'} rounded-lg p-2`}
                        >
                            <div className="space-y-2">
                                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                    <img
                                        src={`/images/edges/${type.toLowerCase()}.png`}
                                        alt={type}
                                        className="w-full h-full object-contain p-2"
                                    />
                                </div>
                                <p className="text-sm text-center text-darkGray font-medium capitalize">
                                    {type}
                                </p>
                            </div>
                        </label>
                    </div>
                ))}
            </div>
        </div>

        {edge.type !== 'none' && (
            <>
                <div>
                    <label className="block text-darkGray text-sm font-medium mb-2">Width (mm)</label>
                    <input
                        type="number"
                        value={edge.width}
                        onChange={(e) => onChange({ ...edge, width: parseFloat(e.target.value) })}
                        step="0.01"
                        min="0"
                        className="w-full p-2 border border-darkGray text-darkGray rounded-lg"
                    />
                </div>

                <div>
                    <label className="block text-darkGray text-sm font-medium mb-2">Depth (mm)</label>
                    <input
                        type="number"
                        value={edge.depth}
                        onChange={(e) => onChange({ ...edge, depth: parseFloat(e.target.value) })}
                        step="0.01"
                        min="0"
                        className="w-full p-2 border border-darkGray text-darkGray rounded-lg"
                    />
                </div>

                <div>
                    <label className="block text-darkGray text-sm font-medium mb-2">Surface</label>
                    <select
                        value={edge.surface}
                        onChange={(e) => onChange({ ...edge, surface: e.target.value as SurfaceType })}
                        className="w-full p-2 border border-darkGray text-darkGray rounded-lg"
                    >
                        {surfaceTypes?.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>
            </>
        )}
    </div>
);

export const GroovesAndEdgesSelector: React.FC<GroovesAndEdgesSelectorProps> = ({
    groovesAndEdges,
    onUpdateGroovesAndEdges,
}) => {
    const handleGrooveChange = <T extends keyof GroovesAndEdges['groove']>(
        field: T,
        value: GroovesAndEdges['groove'][T]
    ) => {
        onUpdateGroovesAndEdges({
            ...groovesAndEdges,
            groove: {
                ...groovesAndEdges.groove,
                [field]: value,
            },
        });
    };

    const handleEdgeChange = (side: 'leftEdge' | 'rightEdge', edge: EdgeSettings) => {
        onUpdateGroovesAndEdges({
            ...groovesAndEdges,
            [side]: edge,
        });
    };

    const [activeTab, setActiveTab] = React.useState<'grooves' | 'edges'>('grooves');

    return (
        <div className="space-y-8">
            {/* Tab Switch */}
            <div className="flex justify-center mb-6">
                <div className="inline-flex rounded-lg p-1 bg-gray-100">
                    <button
                        onClick={() => setActiveTab('grooves')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'grooves' ? 'bg-white text-darkGray shadow-sm' : 'text-gray-500 hover:text-darkGray'}`}
                    >
                        Grooves
                    </button>
                    <button
                        onClick={() => setActiveTab('edges')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'edges' ? 'bg-white text-darkGray shadow-sm' : 'text-gray-500 hover:text-darkGray'}`}
                    >
                        Edges
                    </button>
                </div>
            </div>

            {/* Groove Settings */}
            {activeTab === 'grooves' && (
            <div className="space-y-6">
                <h3 className="text-darkGray text-xl font-medium">Groove Settings</h3>
                
                <div>
                    <label className="block text-darkGray text-sm font-medium mb-2">Groove Type</label>
                    <div className="grid grid-cols-3 gap-4">
                        {grooveTypes?.map((type) => (
                            <button
                                key={type}
                                onClick={() => handleGrooveChange('grooveType', type)}
                                className={`p-4 border rounded-lg ${
                                    groovesAndEdges.groove.grooveType === type
                                        ? 'border-primary bg-primary/10'
                                        : 'border-darkGray'
                                }`}
                            >
                                <div className="space-y-2">
                                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                        <img
                                            src={`/images/grooves/${type
                                                .toLowerCase()
                                                .replace('v-groove (110°)', 'v-groove-110')
                                                .replace('u-groove', 'u-groove')
                                                .replace('convex', 'convex-v-groove')
                                                .replace('square groove', 'square-groove')
                                                .replace('carbon-groove', 'carbon')
                                                .replace('milgrain', 'perlage')}.png`}
                                            alt={type}
                                            className="w-full h-full object-contain p-2"
                                        />
                                    </div>
                                    <p className="text-sm text-center text-darkGray font-medium line-clamp-2">{type}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-darkGray text-sm font-medium mb-2">Width (mm)</label>
                    <input
                        type="number"
                        value={groovesAndEdges.groove.width}
                        onChange={(e) => handleGrooveChange('width', parseFloat(e.target.value))}
                        step="0.01"
                        min="0"
                        className="w-full p-2 border border-darkGray text-darkGray rounded-lg"
                    />
                </div>

                <div>
                    <label className="block text-darkGray text-sm font-medium mb-2">Groove Depth (mm)</label>
                    <input
                        type="number"
                        value={groovesAndEdges.groove.depth}
                        onChange={(e) => handleGrooveChange('depth', parseFloat(e.target.value))}
                        step="0.01"
                        min="0"
                        className="w-full p-2 border border-darkGray text-darkGray rounded-lg"
                    />
                </div>

                <div>
                    <label className="block text-darkGray text-sm font-medium mb-2">Surface</label>
                    <select
                        value={groovesAndEdges.groove.surface}
                        onChange={(e) => handleGrooveChange('surface', e.target.value as SurfaceType)}
                        className="w-full p-2 border border-darkGray text-darkGray rounded-lg"
                    >
                        {surfaceTypes?.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-darkGray text-sm font-medium mb-2">Groove Alignment</label>
                    <select
                        value={groovesAndEdges.groove.alignment}
                        onChange={(e) => handleGrooveChange('alignment', e.target.value as GrooveAlignment)}
                        className="w-full p-2 border border-darkGray text-darkGray rounded-lg"
                    >
                        {alignments?.map((alignment) => (
                            <option key={alignment} value={alignment}>
                                {alignment.charAt(0).toUpperCase() + alignment.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            )}

            {/* Edge Settings */}
            {activeTab === 'edges' && (
            <div className="space-y-8">
                <h3 className="text-darkGray text-xl font-medium">Edge Settings</h3>
                
                <EdgeSettingsForm
                    edge={groovesAndEdges.leftEdge}
                    onChange={(edge) => handleEdgeChange('leftEdge', edge)}
                    label="Left Edge"
                />

                <EdgeSettingsForm
                    edge={groovesAndEdges.rightEdge}
                    onChange={(edge) => handleEdgeChange('rightEdge', edge)}
                    label="Right Edge"
                />
            </div>
            )}
        </div>
    );
};
