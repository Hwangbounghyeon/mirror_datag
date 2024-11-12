"use client";

import React, { useCallback, useState, memo, useEffect, use } from "react";
import StepIndicator from "@/components/project/create/step-indicator";
import useCreateProject from "@/hooks/useCreateProject";
import Step1 from "@/components/project/create/step1";
import Step2 from "@/components/project/create/step2";
import Step3 from "@/components/project/create/step3";
import { useRouter } from "next/navigation";

// Memoize step components
const MemoizedStep1 = memo(Step1);
const MemoizedStep2 = memo(Step2);
const MemoizedStep3 = memo(Step3);

const Page = () => {
  const router = useRouter();
  useEffect(() => {
    router.prefetch("/project");
  }, [router]);

  const [step, setStep] = useState(3);
  const {
    state,
    handleProjectItemChange,
    handleCategoryChange,
    addUser,
    removeUser,
    updateUserAuth,
    addDepartment,
    removeDepartment,
    updateDepartmentAuth,
    clearAccessControl,
    resetState,
  } = useCreateProject();

  const handleMove = useCallback((stepNumber: number) => {
    setStep(stepNumber);
  }, []);

  // Memoize the step rendering logic
  const renderStep = useCallback(() => {
    // 공통 props
    const commonProps = {
      projectItem: state.createProjectItem,
      setProjectItem: handleProjectItemChange,
      handleMove: handleMove,
    };

    // Step에 따라 다른 컴포넌트를 렌더링
    switch (step) {
      case 1:
        return (
          <MemoizedStep1
            {...commonProps}
            category={state.category}
            setCategory={handleCategoryChange}
          />
        );
      case 2:
        return <MemoizedStep2 {...commonProps} />;
      case 3:
        return <MemoizedStep3 {...commonProps} />;
      default:
        return null;
    }
  }, [
    step,
    state.createProjectItem,
    state.category,
    handleProjectItemChange,
    handleMove,
    handleCategoryChange,
  ]);

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
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default memo(Page);
