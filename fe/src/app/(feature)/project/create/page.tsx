"use client";
import StepIndicator from "@/components/project/create/step-indicator";
import React, { useState } from "react";
import { ProjectType } from "@/types/projectType";
import { motion, AnimatePresence } from "framer-motion";

import Step1 from "@/components/project/create/step1";
import Step2 from "@/components/project/create/step2";
import Step3 from "@/components/project/create/step3";
import Step4 from "@/components/project/create/step4";

const Page = () => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0); // -1: 왼쪽, 1: 오른쪽

  const [projectItem, setProjectItem] = useState<ProjectType>({
    category: null,
    model: null,
    name: "",
    description: "",
    additional_permission: [],
  });

  const handleMove = (stepNumber: number) => {
    // 이동 방향 설정
    setDirection(stepNumber > step ? 1 : -1);

    if (stepNumber < 1) setStep(1);
    else if (stepNumber > 4) setStep(4);
    else setStep(stepNumber);
  };

  // 슬라이드 애니메이션 variants
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
    }),
  };

  // 애니메이션 전환 설정
  const transition = {
    duration: 0.3,
    type: "tween",
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

        <div className="flex justify-center items-center overflow-x-hidden overflow-y-visible">
          <AnimatePresence initial={false} mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition}
            >
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
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Page;
