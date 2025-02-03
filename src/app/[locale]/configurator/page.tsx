'use client';

import React, { useState } from 'react';
import { ProfileSelector } from '@/app/components/configurator/ProfileSelector';
import { DimensionsSelector } from '@/app/components/configurator/DimensionsSelector';
import { PreciousMetalSelector } from '@/app/components/configurator/PreciousMetalSelector';
import { StoneSelector } from '@/app/components/configurator/StoneSelector';
import { GroovesAndEdgesSelector } from '@/app/components/configurator/GroovesAndEdgesSelector';
import { EngravingSelector } from '@/app/components/configurator/EngravingSelector';
import { ConfiguratorState, PreciousMetal, StoneSettings, GroovesAndEdges, EngravingSettings } from '@/app/types/configurator';

const steps = [
    { id: 1, name: 'Profiles' },
    { id: 2, name: 'Dimensions' },
    { id: 3, name: 'Precious Metal' },
    { id: 4, name: 'Stones' },
    { id: 5, name: 'Grooves / Edges' },
    { id: 6, name: 'Engraving' },
];

export default function ConfiguratorPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [configuratorState, setConfiguratorState] = useState<ConfiguratorState>({
        selectedProfile: null,
        dimensions: {
            profileWidth: 4.0,
            profileHeight: 1.5,
            ringSize: 54,
            ringSizeSystem: 'Universal',
        },
        preciousMetal: {
            colorType: 'single',
            colors: [{
                metalColor: 'yellow gold',
                polishType: 'Polished',
                fineness: '18K'
            }]
        },
        stoneSettings: {
            settingType: 'No stone',
            stoneType: 'Brillant',
            stoneSize: '0.01 ct.',
            stoneQuality: 'G-H/VS-SI',
            numberOfStones: 1,
            spacing: 'Together',
            position: 'Center'
        },
        groovesAndEdges: {
            groove: {
                grooveType: 'V-groove (110°)',
                width: 0.14,
                depth: 0.05,
                surface: 'Polished',
                alignment: 'center'
            },
            leftEdge: {
                type: 'none'
            },
            rightEdge: {
                type: 'none'
            }
        },
        engraving: {
            text: '',
            fontFamily: 'Times New Roman'
        }
    });

    const handleProfileSelect = (profileId: string) => {
        setConfiguratorState((prev) => ({
            ...prev,
            selectedProfile: profileId,
        }));
        setCurrentStep(2); // Automatically move to dimensions step when profile is selected
    };

    const handleDimensionsUpdate = (dimensions: ConfiguratorState['dimensions']) => {
        setConfiguratorState((prev) => ({
            ...prev,
            dimensions,
        }));
    };

    const handlePreciousMetalUpdate = (preciousMetal: PreciousMetal) => {
        setConfiguratorState((prev) => ({
            ...prev,
            preciousMetal,
        }));
    };

    const handleStoneSettingsUpdate = (stoneSettings: StoneSettings) => {
        setConfiguratorState((prev) => ({
            ...prev,
            stoneSettings,
        }));
    };

    const handleGroovesAndEdgesUpdate = (groovesAndEdges: GroovesAndEdges) => {
        setConfiguratorState((prev) => ({
            ...prev,
            groovesAndEdges,
        }));
    };

    const handleEngravingUpdate = (engraving: EngravingSettings) => {
        setConfiguratorState((prev) => ({
            ...prev,
            engraving,
        }));
    };

    const renderColorInfo = (preciousMetal: PreciousMetal) => {
        return preciousMetal.colors?.map((color, index) => (
            <div key={index} className="space-y-1">
                <p className="text-darkGray">
                    {index === 0 ? 'Primary' : index === 1 ? 'Secondary' : 'Tertiary'} Color:
                </p>
                <p className="text-darkGray ml-2">• {color.metalColor}</p>
                <p className="text-darkGray ml-2">• {color.polishType}</p>
                <p className="text-darkGray ml-2">• {color.fineness}</p>
            </div>
        ));
    };

    return (
        <div className="container mx-auto px-4 pt-32 pb-8">
            <div className="flex gap-8">
                {/* Left side - Steps and Configuration */}
                <div className="w-2/3 flex">
                    {/* Steps */}
                    <div className="mb-8">
                        <ul className="space-y-2 d-flex">
                            {steps?.map((step) => (
                                <li
                                    key={step.id}
                                    className={`flex p-4 rounded-lg cursor-pointer ${
                                        currentStep === step.id
                                            ? 'bg-gold text-primary'
                                            : 'bg-gray-100 text-darkGray'
                                    }`}
                                    onClick={() => setCurrentStep(step.id)}
                                >
                                    {step.id}. {step.name}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Configuration Area */}
                    <div className="flex-1 bg-white p-6 rounded-lg shadow-sm">
                        {currentStep === 1 && (
                            <ProfileSelector
                                selectedProfile={configuratorState.selectedProfile}
                                onSelectProfile={handleProfileSelect}
                            />
                        )}
                        {currentStep === 2 && (
                            <DimensionsSelector
                                dimensions={configuratorState.dimensions}
                                onUpdateDimensions={handleDimensionsUpdate}
                                selectedProfile={configuratorState.selectedProfile}
                            />
                        )}
                        {currentStep === 3 && (
                            <PreciousMetalSelector
                                preciousMetal={configuratorState.preciousMetal}
                                onUpdatePreciousMetal={handlePreciousMetalUpdate}
                            />
                        )}
                        {currentStep === 4 && (
                            <StoneSelector
                                stoneSettings={configuratorState.stoneSettings}
                                onUpdateStoneSettings={handleStoneSettingsUpdate}
                            />
                        )}
                        {currentStep === 5 && (
                            <GroovesAndEdgesSelector
                                groovesAndEdges={configuratorState.groovesAndEdges}
                                onUpdateGroovesAndEdges={handleGroovesAndEdgesUpdate}
                            />
                        )}
                        {currentStep === 6 && (
                            <EngravingSelector
                                engraving={configuratorState.engraving}
                                onUpdateEngraving={handleEngravingUpdate}
                            />
                        )}
                    </div>
                </div>

                {/* Right side - Ring Preview */}
                <div className="w-1/3">
                    <div className="sticky top-4">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="aspect-square bg-gray-100 rounded-lg mb-4">
                                {configuratorState.selectedProfile && (
                                    <div className="w-full h-full flex items-center justify-center">
                                        {/* Ring preview will go here */}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-4">
                                <h3 className="font-semibold text-darkGray">Selected Options:</h3>
                                
                                {/* Profile */}
                                <div className="space-y-1">
                                    <p className="text-darkGray">Profile: {configuratorState.selectedProfile ? `PR ${configuratorState.selectedProfile}` : 'Not selected'}</p>
                                </div>

                                {/* Dimensions */}
                                <div className="space-y-1">
                                    <p className="text-darkGray">Dimensions:</p>
                                    <p className="text-darkGray ml-2">• Width: {configuratorState.dimensions.profileWidth} mm</p>
                                    <p className="text-darkGray ml-2">• Height: {configuratorState.dimensions.profileHeight} mm</p>
                                    <p className="text-darkGray ml-2">• Ring Size: {configuratorState.dimensions.ringSize} ({configuratorState.dimensions.ringSizeSystem})</p>
                                </div>

                                {/* Precious Metal */}
                                <div className="space-y-1">
                                    <p className="text-darkGray">Precious Metal:</p>
                                    <p className="text-darkGray ml-2">• Type: {
                                        configuratorState.preciousMetal.colorType === 'single' ? 'Single Color' :
                                        configuratorState.preciousMetal.colorType === 'two' ? 'Two Colors' : 'Three Colors'
                                    }</p>
                                    {configuratorState.preciousMetal.shapeId && (
                                        <p className="text-darkGray ml-2">• Shape: {configuratorState.preciousMetal.shapeId}</p>
                                    )}
                                    {renderColorInfo(configuratorState.preciousMetal)}
                                </div>

                                {/* Stone Settings */}
                                <div className="space-y-1">
                                    <p className="text-darkGray">Stone Settings:</p>
                                    <p className="text-darkGray ml-2">• Setting Type: {configuratorState.stoneSettings.settingType}</p>
                                    {configuratorState.stoneSettings.settingType !== 'No stone' && (
                                        <>
                                            <p className="text-darkGray ml-2">• Stone Type: {configuratorState.stoneSettings.stoneType}</p>
                                            <p className="text-darkGray ml-2">• Size: {configuratorState.stoneSettings.stoneSize}</p>
                                            <p className="text-darkGray ml-2">• Quality: {configuratorState.stoneSettings.stoneQuality}</p>
                                            <p className="text-darkGray ml-2">• Number of Stones: {configuratorState.stoneSettings.numberOfStones}</p>
                                            <p className="text-darkGray ml-2">• Spacing: {configuratorState.stoneSettings.spacing}</p>
                                            <p className="text-darkGray ml-2">• Position: {configuratorState.stoneSettings.position}</p>
                                        </>
                                    )}
                                </div>

                                {/* Grooves and Edges */}
                                <div className="space-y-1">
                                    <p className="text-darkGray">Grooves and Edges:</p>
                                    <div className="ml-2 space-y-2">
                                        <div>
                                            <p className="text-darkGray font-medium">Groove</p>
                                            <p className="text-darkGray">• Type: {configuratorState.groovesAndEdges.groove.grooveType}</p>
                                            <p className="text-darkGray">• Width: {configuratorState.groovesAndEdges.groove.width} mm</p>
                                            <p className="text-darkGray">• Depth: {configuratorState.groovesAndEdges.groove.depth} mm</p>
                                            <p className="text-darkGray">• Surface: {configuratorState.groovesAndEdges.groove.surface}</p>
                                            <p className="text-darkGray">• Alignment: {configuratorState.groovesAndEdges.groove.alignment}</p>
                                        </div>
                                        
                                        <div>
                                            <p className="text-darkGray font-medium">Left Edge</p>
                                            <p className="text-darkGray">• Type: {configuratorState.groovesAndEdges.leftEdge.type}</p>
                                            {configuratorState.groovesAndEdges.leftEdge.type !== 'none' && (
                                                <>
                                                    <p className="text-darkGray">• Width: {configuratorState.groovesAndEdges.leftEdge.width} mm</p>
                                                    <p className="text-darkGray">• Depth: {configuratorState.groovesAndEdges.leftEdge.depth} mm</p>
                                                    <p className="text-darkGray">• Surface: {configuratorState.groovesAndEdges.leftEdge.surface}</p>
                                                </>
                                            )}
                                        </div>

                                        <div>
                                            <p className="text-darkGray font-medium">Right Edge</p>
                                            <p className="text-darkGray">• Type: {configuratorState.groovesAndEdges.rightEdge.type}</p>
                                            {configuratorState.groovesAndEdges.rightEdge.type !== 'none' && (
                                                <>
                                                    <p className="text-darkGray">• Width: {configuratorState.groovesAndEdges.rightEdge.width} mm</p>
                                                    <p className="text-darkGray">• Depth: {configuratorState.groovesAndEdges.rightEdge.depth} mm</p>
                                                    <p className="text-darkGray">• Surface: {configuratorState.groovesAndEdges.rightEdge.surface}</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Engraving */}
                                {configuratorState.engraving.text && (
                                    <div className="space-y-1">
                                        <p className="text-darkGray">Engraving:</p>
                                        <div className="ml-2">
                                            <p className="text-darkGray">• Font: {configuratorState.engraving.fontFamily}</p>
                                            <p 
                                                className="text-darkGray"
                                                style={{ fontFamily: configuratorState.engraving.fontFamily }}
                                            >
                                                • Text: {configuratorState.engraving.text}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}