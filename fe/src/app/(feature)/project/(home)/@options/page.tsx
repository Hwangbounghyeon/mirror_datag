import React, { Suspense } from "react";
import SelectOptions from "@/components/project/select-options";
import { Spinner } from "@nextui-org/react";
import { getModels } from "@/app/actions/model";

const Page = async ({
  searchParams,
}: {
  searchParams: {
    page?: string;
    model_name?: string;
  };
}) => {
  const modelRespone = await getModels();
  const model_list_data = modelRespone.data;
  const modelData = model_list_data
    ? Object.values(model_list_data).flat()
    : [];

  return (
    <Suspense
      key={searchParams.model_name || ""}
      fallback={<Spinner size="lg" />}
    >
      <SelectOptions model_list={modelData} />
    </Suspense>
  );
};

export default Page;
