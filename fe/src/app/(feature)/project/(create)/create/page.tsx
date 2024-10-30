"use client";
import StepIndicator from "@/components/project/create/step-indicator";
import React, { useState } from "react";
import { CreateProjectType } from "@/types/projectType";

import Step1 from "@/components/project/create/step1";
import Step2 from "@/components/project/create/step2";
import Step3 from "@/components/project/create/step3";
import Step4 from "@/components/project/create/step4";

const Page = () => {
  const [step, setStep] = useState(1);

  const [projectItem, setProjectItem] = useState<CreateProjectType>({
    category: null,
    model_name: null,
    project_name: "",
    description: "",
    additional_permission: [],
    is_private: false,
  });

  const handleMove = (stepNumber: number) => {
    // 이동 방향 설정
    if (stepNumber < 1) setStep(1);
    else if (stepNumber > 4) setStep(4);
    else setStep(stepNumber);
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="flex-1 w-full px-3">
        <header className="mt-5 mb-8 font-bold flex flex-col items-center">
          <h1 className="text-[30px]">Create New Project</h1>
          <div>
            <StepIndicator currentStep={step} handleMove={handleMove} />
          </div>
        </header>

        <div className="w-full flex justify-center items-center">
          {step === 1 && (
            <Step1
              projectItem={projectItem}
              setProjectItem={setProjectItem}
              handleMove={handleMove}
            />
          )}
          {step === 2 && (
            <Step2
              projectItem={projectItem}
              setProjectItem={setProjectItem}
              handleMove={handleMove}
            />
          )}
          {step === 3 && (
            <Step3
              projectItem={projectItem}
              setProjectItem={setProjectItem}
              handleMove={handleMove}
            />
          )}
          {step === 4 && <Step4 />}
        </div>
      </div>
    </div>
  );
};

export default Page;
