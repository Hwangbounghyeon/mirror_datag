"use client";
import StepIndicator from "@/components/project/create/step-indicator";
import React, { Suspense, useState } from "react";

const Step1 = React.lazy(() => import("@/components/project/create/step1"));
const Step2 = React.lazy(() => import("@/components/project/create/step2"));

const Page = () => {
  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (step === 4) return;
    setStep(step + 1);
  };

  const handleBefore = () => {
    if (step === 1) return;
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="flex-1 w-full px-3">
        <header className="mt-5 mb-8 font-bold flex flex-col items-center">
          <h1 className="text-[30px]">Create New Project</h1>
          <div>
            <StepIndicator currentStep={step} />
          </div>
        </header>

        <div className="flex justify-center items-center">
          <div>
            {step === 1 && (
              <Suspense fallback={<div>Loading...</div>}>
                <Step1 />
              </Suspense>
            )}
            {step === 2 && (
              <Suspense fallback={<div>Loading...</div>}>
                <Step2 />
              </Suspense>
            )}
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 w-full py-4 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 flex justify-around">
          <button
            disabled={step === 1}
            className={`bg-blue-200 font-bold rounded-md text-[20px] w-[100px] h-[35px] ${
              step === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleBefore}
          >
            Before
          </button>
          <button
            className="bg-blue-200 font-bold rounded-md text-[20px] w-[100px] h-[35px]"
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
