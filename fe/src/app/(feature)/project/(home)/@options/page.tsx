import React, { Suspense } from "react";
import SelectOptions from "@/components/project/select-options";
import { Spinner } from "@nextui-org/react";
import { getDepartments } from "@/lib/constants/department";
import { getModels } from "@/lib/constants/model";

const Page = async () => {
  const [department_list, model_list] = await Promise.all([
    getDepartments(),
    getModels(),
  ]);
  return (
    <Suspense fallback={<Spinner size="lg" />}>
      <SelectOptions
        department_list={department_list}
        model_list={model_list}
      />
    </Suspense>
  );
};

export default Page;
