"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-hot-toast";
import { initialConfiguratorState, useCart } from "@/app/context/CartContext";
import { ProfileSelector } from "@/app/components/configurator/ProfileSelector";
import { DimensionsSelector } from "@/app/components/configurator/DimensionsSelector";
import { PreciousMetalSelector } from "@/app/components/configurator/PreciousMetalSelector";
import { StoneSelector } from "@/app/components/configurator/StoneSelector";
import { GroovesAndEdgesSelector } from "@/app/components/configurator/GroovesAndEdgesSelector";
import {
  EngravingSelector,
  fontFamilies,
} from "@/app/components/configurator/EngravingSelector";
import { WeightSelector } from "@/app/components/configurator/WeightSelector";
import {
  ConfiguratorState,
  PreciousMetal,
  StoneSettings,
  GroovesAndEdges,
  EngravingSettings,
} from "@/app/types/configurator";
import Image from "next/image";
import { useRouter } from "@/i18n/routing";

export default function ConfiguratorPage() {
  const {
    cart,
    selectCartItem,
    updateConfiguration,
    configuratorState,
    setConfiguratorState,
    activeTab,
    setActiveTab,
  } = useCart();
  const router = useRouter();
  const t = useTranslations("configurator");
  const tConfig = useTranslations("configurator.validation");

  const steps = [
    { id: 1, name: t("steps.weight") },
    { id: 2, name: t("steps.profiles") },
    { id: 3, name: t("steps.dimensions") },
    { id: 4, name: t("steps.preciousMetal") },
    { id: 5, name: t("steps.stones") },
    { id: 6, name: t("steps.groovesAndEdges") },
    { id: 7, name: t("steps.engraving") },
  ];

  const [currentStep, setCurrentStep] = useState(1);
  const [highestStepReached, setHighestStepReached] = useState(1);

  useEffect(() => {
    if (currentStep > highestStepReached) {
      setHighestStepReached(currentStep);
    }
  }, [currentStep, highestStepReached]);

  const handleProfileSelect = (profileId: string) => {
    const newState = {
      ...configuratorState,
      selectedProfile: profileId,
    };
    setConfiguratorState(newState);
    console.log(newState, "qokla");

    // If a cart item is selected, update its configuration
    if (cart.selectedItemId) {
      updateConfiguration(cart.selectedItemId, newState);
    }
  };

  const handleDimensionsUpdate = (
    dimensions: ConfiguratorState["dimensions"]
  ) => {
    const newState = {
      ...configuratorState,
      dimensions,
    };
    setConfiguratorState(newState);

    if (cart.selectedItemId) {
      updateConfiguration(cart.selectedItemId, newState);
    }
  };

  const handlePreciousMetalUpdate = (preciousMetal: PreciousMetal) => {
    const newState = {
      ...configuratorState,
      preciousMetal,
    };
    setConfiguratorState(newState);

    if (cart.selectedItemId) {
      updateConfiguration(cart.selectedItemId, newState);
    }
  };

  const handleStoneSettingsUpdate = (stoneSettings: StoneSettings) => {
    const newState = {
      ...configuratorState,
      stoneSettings,
    };
    setConfiguratorState(newState);

    if (cart.selectedItemId) {
      updateConfiguration(cart.selectedItemId, newState);
    }
  };

  const handleGroovesAndEdgesUpdate = (groovesAndEdges: GroovesAndEdges) => {
    const newState = {
      ...configuratorState,
      groovesAndEdges,
    };
    setConfiguratorState(newState);

    if (cart.selectedItemId) {
      updateConfiguration(cart.selectedItemId, newState);
    }
  };

  const handleEngravingUpdate = (engraving: EngravingSettings) => {
    const newState = {
      ...configuratorState,
      engraving,
    };
    setConfiguratorState(newState);

    // Only update configuration and show toast when text input loses focus
    if (!engraving.isTyping && cart.selectedItemId) {
      updateConfiguration(cart.selectedItemId, newState);
    }
  };

  const handleNextStep = () => {
    if (!canProceedToNext()) {
      toast.error(t("completeStepBeforeProceeding"));
      return;
    }

    // Handle grooves/edges tab switching in step 6
    if (currentStep === 6 && activeTab === "grooves") {
      setActiveTab("edges");
      return;
    }

    // If we're on the last step
    if (currentStep === steps.length) {
      // Check if this is the last item in cart
      if (cart.selectedItemId === cart.items[cart.items.length - 1]?.id) {
        router.push("/checkout");
      } else {
        // Find the next unconfigured item
        const currentIndex = cart.items.findIndex(
          (item) => item.id === cart.selectedItemId
        );
        if (currentIndex !== -1 && currentIndex < cart.items.length - 1) {
          // Reset everything for the next item
          setConfiguratorState(initialConfiguratorState);
          setCurrentStep(1);
          setHighestStepReached(1);
          setActiveTab("grooves"); // Reset tab state

          // Select next item
          const nextItem = cart.items[currentIndex + 1];
          selectCartItem(nextItem.id);
        }
      }
    } else {
      // Move to next step
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return configuratorState.weight > 0;
      case 2:
        return configuratorState.selectedProfile !== null;
      case 3:
        return (
          configuratorState.dimensions.profileWidth > 0 &&
          configuratorState.dimensions.profileHeight > 0 &&
          configuratorState.dimensions.ringSizeSystem !== null &&
          configuratorState.dimensions.ringSize !== null
        );
      case 4:
        return (
          configuratorState.preciousMetal.colorType !== "" &&
          configuratorState.preciousMetal.colors.length > 0 &&
          configuratorState.preciousMetal.shape !== null
        );
      case 5:
        return (
          configuratorState.stoneSettings.settingType !== "" ||
          (configuratorState?.stoneSettings?.numberOfStones > 0 &&
            configuratorState.stoneSettings.stoneType !== "" &&
            configuratorState.stoneSettings.stoneSize !== "" &&
            configuratorState.stoneSettings.stoneQuality !== "" &&
            configuratorState.stoneSettings.spacing !== "" &&
            configuratorState.stoneSettings.position !== "")
        );
      case 6:
        if (activeTab === "grooves") {
          return (
            configuratorState.groovesAndEdges.groove.map(
              (groove) =>
                groove.grooveType !== "" &&
                groove.depth !== 0 &&
                groove.width !== 0 &&
                groove.surface !== ""
            ).length > 0
          );
        } else {
          return (
            configuratorState.groovesAndEdges.leftEdge.type !== "" &&
            configuratorState.groovesAndEdges.rightEdge.type !== "" &&
            configuratorState.groovesAndEdges?.leftEdge?.depth !== 0 &&
            configuratorState.groovesAndEdges?.rightEdge.depth !== 0 &&
            configuratorState.groovesAndEdges?.leftEdge?.width !== 0 &&
            configuratorState.groovesAndEdges?.rightEdge.width !== 0 &&
            configuratorState.groovesAndEdges?.leftEdge?.surface !== "" &&
            configuratorState.groovesAndEdges?.rightEdge.surface !== ""
          );
        }

      case 7:
        return true;
      default:
        return false;
    }
  };

  const hanldeCellClick = (stepId: number) => {
    if (stepId <= highestStepReached) {
      // Allow navigation to any previously completed step
      setCurrentStep(stepId);
    } else if (stepId === currentStep + 1) {
      // Allow moving forward only if the current step is complete
      if (canProceedToNext()) {
        setCurrentStep(stepId);
      } else {
        toast.error(t("completeStepBeforeProceeding"));
      }
    } else {
      // If trying to jump forward to an uncompleted step, show an error
      toast.error(t("completeStepBeforeProceeding"));
    }
  };

  console.log(cart, "qokla cart");
  console.log(configuratorState, "qokla configuratorState");

  return (
    <div className="container mx-auto min-h-screen px-4 pt-32 pb-8">
      <h1 className="text-2xl text-primary font-bold mb-6">
        {tConfig("configurator")}
      </h1>
      {cart.items.length > 0 ? (
        <div className="flex flex-col">
          <div className="py-6 px-6 ">
            <ul className="flex flex-wrap gap-3">
              {steps?.map((step) => (
                <li
                  key={step.id}
                  className={`flex p-3 rounded-lg cursor-pointer border font-medium ${
                    currentStep === step.id
                      ? "bg-gold text-primary"
                      : "bg-gray-100 text-darkGray hover:bg-gray-200"
                  }`}
                  onClick={() => hanldeCellClick(step.id)}
                >
                  {step.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
            {/* Left side - Steps and Configuration */}
            <div className="w-full lg:w-2/3 flex flex-col">
              {/* Steps */}

              {/* Configuration Area */}
              <div className="flex-1 bg-white p-6 rounded-lg shadow-lg mb-8">
                {currentStep === 1 && (
                  <>
                    {(() => {
                      const selectedProduct = cart.items.find(
                        (item) => item.id === cart.selectedItemId
                      );
                      console.log(selectedProduct, "selected");
                      if (!selectedProduct) return null;

                      const weightRange = selectedProduct.product.weight
                        .split("-")
                        .map(Number);
                      const [minWeight, maxWeight] = weightRange;

                      return (
                        <WeightSelector
                          minWeight={minWeight}
                          maxWeight={maxWeight}
                          selectedWeight={configuratorState.weight}
                          onChange={(weight) => {
                            const newState = {
                              ...configuratorState,
                              weight,
                            };
                            setConfiguratorState(newState);
                            if (cart.selectedItemId) {
                              updateConfiguration(
                                cart.selectedItemId,
                                newState
                              );
                            }
                          }}
                        />
                      );
                    })()}
                  </>
                )}
                {currentStep === 2 && (
                  <ProfileSelector
                    selectedProfile={configuratorState.selectedProfile}
                    onSelectProfile={handleProfileSelect}
                  />
                )}
                {currentStep === 3 && (
                  <DimensionsSelector
                    dimensions={configuratorState.dimensions}
                    onUpdateDimensions={handleDimensionsUpdate}
                    selectedProfile={configuratorState.selectedProfile}
                  />
                )}
                {currentStep === 4 && (
                  <PreciousMetalSelector
                    preciousMetal={configuratorState.preciousMetal}
                    onUpdatePreciousMetal={handlePreciousMetalUpdate}
                  />
                )}
                {currentStep === 5 && (
                  <StoneSelector
                    stoneSettings={configuratorState.stoneSettings}
                    onUpdateStoneSettings={handleStoneSettingsUpdate}
                  />
                )}
                {currentStep === 6 && (
                  <GroovesAndEdgesSelector
                    groovesAndEdges={configuratorState.groovesAndEdges}
                    onUpdateGroovesAndEdges={handleGroovesAndEdgesUpdate}
                  />
                )}
                {currentStep === 7 && (
                  <EngravingSelector
                    engraving={configuratorState.engraving}
                    onUpdateEngraving={handleEngravingUpdate}
                  />
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-4 lg:mt-0">
                <button
                  onClick={handlePrevStep}
                  className={`px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-medium transition-colors border ${
                    currentStep > 1
                      ? "bg-gray-100 text-darkGray hover:bg-gray-200"
                      : "bg-gray-50 text-gray-400 cursor-not-allowed"
                  }`}
                  disabled={currentStep === 1}
                >
                  {t("navigation.previousStep")}
                </button>

                <button
                  onClick={handleNextStep}
                  className={`px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-medium transition-colors border ${
                    (currentStep < steps.length && canProceedToNext()) ||
                    currentStep === steps.length
                      ? "bg-gold text-primary hover:bg-gold/90"
                      : "bg-gray-50 text-gray-400 cursor-not-allowed"
                  }`}
                  disabled={!canProceedToNext()}
                >
                  {currentStep < steps.length
                    ? t("navigation.nextStep")
                    : cart.selectedItemId ===
                      cart.items[cart.items.length - 1]?.id
                    ? t("navigation.complete")
                    : t("navigation.nextRing")}
                </button>
              </div>
            </div>

            {/* Right side - Ring Preview */}
            <div className="w-full lg:w-1/3 mt-4 lg:mt-0">
              <div className="lg:sticky lg:top-4">
                <div className="bg-white py-6 px-3 rounded-lg shadow-lg">
                  <div className="space-y-4">
                    {/* Cart Items Preview */}
                    <div className="bg-white overflow-y-auto h-64 lg:h-96 px-3">
                      <h3 className="text-lg font-medium text-darkGray mb-4">
                        {t("cart.ringsInCart")}
                      </h3>
                      <div className="space-y-4">
                        {cart.items.map((item, index) => (
                          <div
                            key={`${item?.id}-${index}`}
                            className={`p-4 rounded-lg cursor-pointer transition-all ${
                              cart.selectedItemId === item.id
                                ? " border-2 border-gold shadow-lg scale-105"
                                : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                            }`}
                            onClick={() => {
                              if (cart.selectedItemId === item.id) {
                                selectCartItem(undefined);
                              } else {
                                console.log(item, "item id");
                                selectCartItem(item?.id);
                                if (item.configuration) {
                                  setConfiguratorState(item.configuration);
                                }
                              }
                            }}
                          >
                            <div className="flex items-center space-x-4 relative">
                              <div
                                className={`w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center transition-all ${
                                  cart.selectedItemId === item.id
                                    ? "ring-2 ring-primary ring-offset-2 rounded-lg"
                                    : ""
                                }`}
                              >
                                <Image
                                  src={String(item?.product.images?.[0])}
                                  alt={item.product.name}
                                  width={100}
                                  height={100}
                                  className="w-full h-full object-contain rounded-lg"
                                />
                              </div>
                              <div className="flex-1 space-y-1">
                                <p className="font-medium text-darkGray capitalize">
                                  {item.product.name}
                                </p>
                                {cart.selectedItemId === item.id && (
                                  <div className="flex items-center space-x-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></div>
                                    <p className="text-sm text-primary font-medium">
                                      Configuring: {steps[currentStep - 1].name}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* <div className="space-y-4 mt-4">
                                    <h3 className="font-semibold text-darkGray">Selected Options:</h3>
                                    
                                    <div className="space-y-1">
                                        <p className="text-darkGray">Profile: {configuratorState.selectedProfile ? `PR ${configuratorState.selectedProfile}` : 'Not selected'}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-darkGray">Dimensions:</p>
                                        <p className="text-darkGray ml-2">• Width: {configuratorState.dimensions.profileWidth} mm</p>
                                        <p className="text-darkGray ml-2">• Height: {configuratorState.dimensions.profileHeight} mm</p>
                                        <p className="text-darkGray ml-2">• Ring Size: {configuratorState.dimensions.ringSize} ({configuratorState.dimensions.ringSizeSystem})</p>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-darkGray">Precious Metal:</p>
                                        <p className="text-darkGray ml-2">• Type: {
                                            configuratorState.preciousMetal.colorType === 'single' ? 'Single Color' :
                                            configuratorState.preciousMetal.colorType === 'two' ? 'Two Colors' : 'Three Colors'
                                        }</p>
                                        {configuratorState.preciousMetal.shape && (
                                            <p className="text-darkGray ml-2">• Shape: {configuratorState.preciousMetal.shape.category} {configuratorState.preciousMetal.shape.variant}</p>
                                        )}
                                        {configuratorState.preciousMetal.shape?.heightPercentage && (
                                            <p className="text-darkGray ml-2">• Diagonal Height: {configuratorState.preciousMetal.shape.heightPercentage}%</p>
                                        )}
                                        {configuratorState.preciousMetal.shape?.waveCount && (
                                            <p className="text-darkGray ml-2">• Diagonal Width: {configuratorState.preciousMetal.shape.waveCount}</p>
                                        )}
                                        {renderColorInfo(configuratorState.preciousMetal)}
                                    </div>

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

                                    <div className="space-y-1">
                                        <p className="text-darkGray">Grooves and Edges:</p>
                                        <div className="ml-2 space-y-2">
                                            <div>
                                                <p className="text-darkGray font-medium">Groove</p>
                                                <p className="text-darkGray">• Type: {configuratorState.groovesAndEdges.groove.grooveType}</p>
                                                <p className="text-darkGray">• Width: {configuratorState.groovesAndEdges.groove.width.toFixed(2)} mm</p>
                                                <p className="text-darkGray">• Depth: {configuratorState.groovesAndEdges.groove.depth.toFixed(2)} mm</p>
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

                                    {configuratorState.engraving.text && (
                                        <div className="space-y-1">
                                            <p className="text-darkGray">Engraving:</p>
                                            <div className="ml-2">
                                                <p className="text-darkGray">• Font: {configuratorState.engraving.fontFamily}</p>
                                                <div className='flex'>
                                                    <p 
                                                        className="text-darkGray me-3"
                                                        style={{ fontFamily: configuratorState.engraving.fontFamily }}
                                                    >
                                                        • Text: 
                                                    </p>
                                                    <p  
                                                        className={` text-darkGray text-center break-words ${fontFamilies.find(f => f.id === configuratorState.engraving.fontFamily)?.className || ''}`}
                                                        style={{ fontFamily: fontFamilies.find(f => f.id === configuratorState.engraving.fontFamily)?.className ? undefined : fontFamilies.find(f => f.id === configuratorState.engraving.fontFamily)?.name }}
                                                    >
                                                        {configuratorState.engraving.text}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-[calc(100vh-280px)] flex-col justify-center items-center">
          <Image
            src="/images/no-items.jpg"
            alt="Empty Cart"
            width={300}
            height={300}
          />
          <h1 className="text-lightGray text-xl">{t("noProducts")}</h1>
          <p className="text-lightGray mt-3">{t("noProductsDescription")}</p>
        </div>
      )}
    </div>
  );
}
