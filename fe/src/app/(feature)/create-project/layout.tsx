import React from "react";

interface LayoutProps {
  step1: React.ReactNode;
  step2: React.ReactNode;
  step3: React.ReactNode;
  step4: React.ReactNode;
  children: React.ReactNode;
}

const Layout = ({ step1, step2, step3, step4, children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-8">Create a New Project</h1>
        {step1}
        {step2}
        {step3}
        {step4}
      </div>
    </div>
  );
};

export default Layout;
