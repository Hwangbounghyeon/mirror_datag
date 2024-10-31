"use client";

import React, { use, useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { DepartmentType } from "@/types/departmentType";
import { Button, Select, SelectItem, Spinner } from "@nextui-org/react";

const mockDptsData: DepartmentType[] = [
  { department_id: 1, department_name: "HR" },
  { department_id: 2, department_name: "Finance" },
  { department_id: 3, department_name: "Engineering" },
  { department_id: 4, department_name: "Marketing" },
  { department_id: 5, department_name: "Sales" },
  { department_id: 6, department_name: "IT" },
  { department_id: 7, department_name: "Customer Service" },
  { department_id: 8, department_name: "Legal" },
  { department_id: 9, department_name: "Operations" },
  { department_id: 10, department_name: "R&D" },
];

const mockModelsData = [
  { model_id: 1, model_name: "Model 1" },
  { model_id: 2, model_name: "Model 2" },
];

const SelectOptions = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);

  const [selectDepartment, setSelectDepartment] = useState<Set<string>>(
    new Set([])
  );
  const [selectModel, setSelectModel] = useState<Set<string>>(new Set([]));

  // URL 쿼리 파라미터 변경 감지 및 상태 업데이트
  useEffect(() => {
    const departmentParam = searchParams.get("department");
    const modelParam = searchParams.get("model");

    if (departmentParam) {
      const departments = departmentParam.split(",");
      setSelectDepartment(new Set(departments));
    } else {
      setSelectDepartment(new Set([]));
    }

    if (modelParam) {
      const models = modelParam.split(",");
      setSelectModel(new Set(models));
    } else {
      setSelectModel(new Set([]));
    }

    setIsLoading(false);
  }, [searchParams]);

  // Select 변경 시 URL 업데이트
  const updateURL = () => {
    const params = new URLSearchParams();

    if (selectDepartment.size > 0) {
      params.set("department", Array.from(selectDepartment).join(","));
    }

    if (selectModel.size > 0) {
      params.set("model", Array.from(selectModel).join(","));
    }

    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ""}`);
  };

  const handleDepartmentChange = (keys: Set<string>) => {
    setSelectDepartment(keys);
  };

  const handleModelChange = (keys: Set<string>) => {
    setSelectModel(keys);
  };

  const reset = () => {
    setSelectDepartment(new Set([]));
    setSelectModel(new Set([]));
    router.push(pathname);
  };

  return (
    <div className="flex flex-row flex-wrap items-center justify-between gap-4">
      {isLoading ? (
        <Spinner color="primary" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            defaultSelectedKeys={selectDepartment}
            selectedKeys={selectDepartment}
            className="w-[200px]"
            label="Department"
            placeholder="Select a department"
            onSelectionChange={(keys) =>
              handleDepartmentChange(keys as Set<string>)
            }
          >
            {mockDptsData.map((dpt) => (
              <SelectItem
                key={dpt.department_id.toString()}
                value={dpt.department_id}
              >
                {dpt.department_name}
              </SelectItem>
            ))}
          </Select>
          <Select
            defaultSelectedKeys={selectModel}
            selectedKeys={selectModel}
            className="w-[200px]"
            label="Model"
            placeholder="Select a model"
            onSelectionChange={(keys) => handleModelChange(keys as Set<string>)}
          >
            {mockModelsData.map((model) => (
              <SelectItem
                key={model.model_id.toString()}
                value={model.model_name}
              >
                {model.model_name}
              </SelectItem>
            ))}
          </Select>
        </div>
      )}
      <div className="flex flex-row gap-3">
        <Button isLoading={isLoading} onClick={updateURL} color="primary">
          Search
        </Button>
        <Button isLoading={isLoading} onClick={reset} color="warning">
          Reset
        </Button>
      </div>
    </div>
  );
};

export default SelectOptions;
