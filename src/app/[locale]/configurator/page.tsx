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
import { useStep } from "@/app/context/StepContext";


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
  const t = useTranslations("");
  const tConfig = useTranslations("configurator.validation");

  const steps = [
    { id: 1, name: t("configurator.steps.weight") },
    { id: 2, name: t("configurator.steps.profiles") },
    { id: 3, name: t("configurator.steps.dimensions") },
    { id: 4, name: t("configurator.steps.preciousMetal") },
    { id: 5, name: t("configurator.steps.stones") },
    { id: 6, name: t("configurator.steps.groovesAndEdges") },
    { id: 7, name: t("configurator.steps.engraving") },
  ];

  const { currentStep, setCurrentStep } = useStep();
  // Initialize configurator state from cart when component mounts
  useEffect(() => {
    if (cart.items.length > 0) {
      const selectedItem = cart.items.find(item => item.id === cart.selectedItemId);
      if (selectedItem?.configuration) {
        setConfiguratorState(selectedItem.configuration);
        setCurrentStep(1);
      } else {
        setConfiguratorState(initialConfiguratorState);
      }
    }
  }, [cart.selectedItemId]);

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
    // Scroll to top smoothly
    window.scrollTo({ top: 50, behavior: 'smooth' });
    
    // Check if current step is valid before proceeding
    if (!canProceedToNext()) {
      toast.error(t("configurator.completeStepBeforeProceeding"));
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
          setActiveTab("grooves"); // Reset tab state

          // Select next item
          const nextItem = cart.items[currentIndex + 1];
          selectCartItem(nextItem.id);
        }
      }
    } else {
      // Move to next step
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    // Scroll to top smoothly
    window.scrollTo({ top: 50, behavior: 'smooth' });
    if(activeTab === "edges") {
      setActiveTab("grooves");
      return;
    }
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  console.log(configuratorState,"qokla configuratorState")
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
          configuratorState.dimensions.ringSizeSystem !== "" &&
          configuratorState.dimensions.ringSize !== ""
        );
      case 4:
        return (
          configuratorState.preciousMetal.colorType !== "" &&
          configuratorState.preciousMetal.colors.length > 0 &&
          configuratorState.preciousMetal.shape !== null
        );
      case 5:
        const specialSettingTypes = [
            'Cross American',
            'Cross pave',
            'Tensionring',
            'Tensionring (diagonal)',
            'Eye (Vertical)',
            'Eye horizontal',
            'Eye diagonal',
            'Side American',
            'Side pave'
        ];

        // For Free Stone Spreading, we only need to check if there's more than 1 stone
        if (configuratorState.stoneSettings.settingType === "Free Stone Spreading") {
          return Number(configuratorState?.stoneSettings?.stones?.length) >= 1;
        }
        if (configuratorState.stoneSettings.settingType === "No stone") {
          return true;
        }

        return (
          configuratorState.stoneSettings.settingType !== "" &&
          configuratorState.stoneSettings.stoneType !== "" &&
          configuratorState.stoneSettings.stoneSize !== "" &&
          configuratorState.stoneSettings.stoneQuality !== "" &&
          // Position validation - skip for settings that don't need position
          ([
            'Cross American', 'Cross pave', 'Cross Channel',
            'Side American', 'Side pave',
            'Tensionring', 'Tensionring (Diagonal)',
            'Eye (Vertical)', 'Eye (Horizontal)', 'Eye (Diagonal)'
          ].includes(configuratorState.stoneSettings.settingType) || 
           configuratorState.stoneSettings.position !== "") &&

          // Number of stones validation - skip for settings that don't need it
          ([
            'Cross American', 'Cross pave', 'Tensionring',
            'Tensionring (diagonal)', 'Eye (Vertical)',
            'Eye horizontal', 'Eye diagonal',
            'Side American', 'Side pave'
          ].includes(configuratorState.stoneSettings.settingType) || 
           configuratorState.stoneSettings.numberOfStones > 0)
        );
      case 6:
        if (activeTab === "grooves") {
          return true;
        } else {
          console.log(configuratorState.groovesAndEdges?.leftEdge?.width,"left width")
          console.log(configuratorState.groovesAndEdges?.rightEdge?.width,"right width")
          const leftEdge = configuratorState.groovesAndEdges.leftEdge;
          const rightEdge = configuratorState.groovesAndEdges.rightEdge;

          // Helper function to check if an edge is valid
          const isEdgeValid = (edge: typeof leftEdge) => {
            // Type must be explicitly set (not empty string)
            if (edge.type === "") return false;
            // If type is none, it's valid
            if (edge.type === "none") return true;
            // For any other type, width must be defined
            return edge.width !== undefined;
          }

          return isEdgeValid(leftEdge) && isEdgeValid(rightEdge);
        }

      case 7:
        return true;
      default:
        return false;
    }
  };

  const isStepComplete = (step: number) => {
    // Check if the step's required data is filled
    switch (step) {
      case 1:
        return configuratorState.weight > 0;
      case 2:
        return configuratorState.selectedProfile !== null;
      case 3:
        return (
          configuratorState.dimensions.profileWidth > 0 &&
          configuratorState.dimensions.profileHeight > 0 &&
          configuratorState.dimensions.ringSizeSystem !== "" &&
          configuratorState.dimensions.ringSize !== ""
        );
      case 4:
        return (
          configuratorState.preciousMetal.colorType !== "" &&
          configuratorState.preciousMetal.colors.length > 0 &&
          configuratorState.preciousMetal.shape !== null
        );
      case 5:
        // Stone step is optional
        return true;
      case 6:
        // Grooves and edges step is optional
        return true;
      case 7:
        // Engraving step is optional
        return true;
      default:
        return false;
    }
  };

  const hanldeCellClick = (stepId: number) => {
    if (isStepComplete(stepId)) {
      // Allow navigation to any previously completed step
      setCurrentStep(stepId);
    } else if (stepId === currentStep + 1) {
      // Allow moving forward only if the current step is complete
      if (canProceedToNext()) {
        setCurrentStep(stepId);
      } else {
        toast.error(t("configurator.completeStepBeforeProceeding"));
      }
    } else {
      // If trying to jump forward to an uncompleted step, show an error
      toast.error(t("configurator.completeStepBeforeProceeding"));
    }
  };

  return (
    <div className="container mx-auto min-h-screen px-4 pt-32 pb-8">
      <h1 className="text-2xl text-primary font-bold mb-6">
        {tConfig("configurator")}
      </h1>
      {cart.items.length > 0 ? (
        <div className="flex flex-col">
          <div className="md:py-6 py-4 px-3 md:px-6 ">
            <ul className="flex flex-wrap gap-3">
              {steps?.map((step) => (
                <li
                  key={step.id}
                  className={`flex p-3 rounded-lg cursor-pointer border font-medium ${
                    currentStep === step.id
                      ? "bg-gold text-primary"
                      : "bg-gray-100 text-darkGray hover:bg-gray-200"
                  }`}
                  // onClick={() => hanldeCellClick(step.id)}
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
              <div className="flex-1 bg-white p-3 md:p-6 rounded-lg shadow-lg mb-8">
                {currentStep === 1 && (
                  <>
                    {(() => {
                      const selectedProduct = cart.items.find(
                        (item) => item.id === cart.selectedItemId
                      );
                      if (!selectedProduct) return null;

                      const weightRange = selectedProduct.product.weight
                        .split("-")
                        .map(Number);
                      const [minWeight, maxWeight] = weightRange;

                      return (
                        <WeightSelector
                          minWeight={minWeight}
                          maxWeight={maxWeight}
                          weight={weightRange.length === 1 ? selectedProduct.product.weight : null}
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
                  {t("configurator.navigation.previousStep")}
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
                    ? t("configurator.navigation.nextStep")
                    : cart.selectedItemId ===
                      cart.items[cart.items.length - 1]?.id
                    ? t("configurator.navigation.complete")
                    : t("configurator.navigation.nextRing")}
                </button>
              </div>
            </div>

            {/* Right side - Ring Preview */}
            <div className="w-full lg:w-1/3 mt-4 lg:mt-0">
              <div className="lg:sticky lg:top-4">
                <div className="bg-white py-6 px-3 rounded-lg shadow-lg">
                  <div className="space-y-4">
                    {/* Cart Items Preview */}
                    <div className="flex flex-col justify-between bg-white  h-64 lg:h-96 px-3">
                      <>
                        <h3 className="text-lg font-medium text-darkGray mb-4">
                          {t("configurator.cart.ringsInCart")}
                        </h3>
                        <div className="space-y-4 overflow-y-auto h-[270px] p-1">
                          {cart.items.map((item, index) => (
                            <div
                              key={`${item?.id}-${index}`}
                              className={`p-4 rounded-lg cursor-pointer transition-all ${
                                cart.selectedItemId === item.id
                                  ? " border-2 border-gold shadow-lg"
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
                                       {steps[currentStep - 1].name}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                      <div className="flex justify-between items-center pt-6">
                        <p className="text-lg font-medium text-darkGray">
                          {t("orderConfirmation.total")}:
                        </p>
                        
                          {cart.total === 0 ? (
                            <p className="text-darkGray text-sm text-right">Qmimi kalkulohet pasi te zgjidhet pesha</p>
                          ) : (
                            <p className="text-lg font-medium text-darkGray">{cart.total + " €"}</p>
                          )}
                        
                      </div>
                    </div>
                  </div>
                  
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
          <h1 className="text-lightGray text-xl">{t("configurator.noProducts")}</h1>
          <p className="text-lightGray mt-3">{t("configurator.noProductsDescription")}</p>
        </div>
      )}
    </div>
  );
}
