"use client";

import React, { useContext, useState } from "react";

interface StepContextValue {
    currentStep: number;
    setCurrentStep: (step: number) => void;
}

const StepContext = React.createContext<StepContextValue | undefined>(undefined);

export const useStep = () => {
    const context = useContext(StepContext);
    if (!context) {
        throw new Error("useStep must be used within a StepProvider");
    }
    return context;
}

export const StepProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [currentStep, setCurrentStep] = useState(1);
    
    return (
        <StepContext.Provider value={{ currentStep, setCurrentStep }}>
            {children}
        </StepContext.Provider>
    );
};