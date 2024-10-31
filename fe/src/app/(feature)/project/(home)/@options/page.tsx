"use client";

import React, { Suspense } from "react";
import SelectOptions from "@/components/project/select-options";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SelectOptions />
    </Suspense>
  );
};

export default Page;
