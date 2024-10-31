"use client";

import { DepartmentType } from "@/types/departmentType";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { useForm, Controller } from "react-hook-form";

const inputStyles = {
  input: ["bg-transparent"],
  errorMessage: [
    "font-bold",
    "text-[13px]",
    "dark:text-red-200", // 다크모드에서 에러 메시지 색상도 조정
  ],
};

type SignFormDataType = {
  name: string;
  email: string;
  password: string;
  duty: string;
  location: string;
  department_id: number;
  is_superuser: boolean;
};

interface SignFormProps {
  department_list: DepartmentType[];
}

export const SignForm = ({ department_list }: SignFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignFormDataType>({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      duty: "",
      location: "",
      department_id: 0,
      is_superuser: false,
    },
  });

  const onSubmit = (data: SignFormDataType) => {
    data = { ...data, location: data.location.trim() };
    data = { ...data, duty: data.duty.trim() };
    data = { ...data, name: data.name.trim() };
    console.log(data);
    // 여기에 제출 로직 구현
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-8 min-h-[500px] space-y-6"
    >
      <div className="space-y-4 rounded-md">
        <Controller
          name="name"
          control={control}
          rules={{
            required: "이름은 필수입니다",
            pattern: {
              value: /^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z\s]+$/,
              message: "한글 또는 영문만 입력 가능합니다",
            },
            validate: {
              noTrim: (value) =>
                value.trim() === value || "앞뒤 공백은 허용되지 않습니다",
              noDoubleSpace: (value) =>
                !value.includes("  ") || "연속된 공백은 허용되지 않습니다",
            },
          }}
          render={({ field }) => (
            <Input
              {...field}
              radius="sm"
              type="text"
              label="name"
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
              classNames={inputStyles}
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          rules={{
            required: "이메일은 필수입니다",
            pattern: {
              value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "올바른 이메일 형식이 아닙니다",
            },
          }}
          render={({ field }) => (
            <Input
              {...field}
              radius="sm"
              type="email"
              label="email"
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
              classNames={inputStyles}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          rules={{
            required: "비밀번호는 필수입니다",
            minLength: {
              value: 8,
              message:
                "비밀번호는 최소 8자리 이상의 한글과 알파벳 조합이어야 합니다.",
            },
            pattern: {
              value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
              message: "비밀번호는 알파벳과 숫자만 혼합하여 입력해주세요",
            },
          }}
          render={({ field }) => (
            <Input
              {...field}
              radius="sm"
              type="password"
              label="password"
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
              classNames={inputStyles}
            />
          )}
        />

        <Controller
          name="duty"
          control={control}
          rules={{
            required: "직무는 필수입니다",
            maxLength: {
              value: 50,
              message: "직무는 최대 50글자까지 입력 가능합니다",
            },
            pattern: {
              value: /^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z\s]+$/,
              message: "한글 또는 영문만 입력 가능합니다",
            },
            validate: {
              noTrim: (value) =>
                value.trim() === value || "앞뒤 공백은 허용되지 않습니다",
              noDoubleSpace: (value) =>
                !value.includes("  ") || "연속된 공백은 허용되지 않습니다",
            },
          }}
          render={({ field }) => (
            <Input
              {...field}
              radius="sm"
              type="text"
              label="duty"
              isInvalid={!!errors.duty}
              errorMessage={errors.duty?.message}
              classNames={inputStyles}
            />
          )}
        />

        <Controller
          name="location"
          control={control}
          rules={{
            required: "위치 입력은 필수입니다",
            maxLength: {
              value: 50,
              message: "위치는 최대 50글자까지 입력 가능합니다",
            },
            pattern: {
              value: /^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z\s]+$/,
              message: "한글 또는 영문만 입력 가능합니다",
            },
            validate: {
              noTrim: (value) =>
                value.trim() === value || "앞뒤 공백은 허용되지 않습니다",
              noDoubleSpace: (value) =>
                !value.includes("  ") || "연속된 공백은 허용되지 않습니다",
            },
          }}
          render={({ field }) => (
            <Input
              {...field}
              radius="sm"
              type="text"
              label="location"
              isInvalid={!!errors.location}
              errorMessage={errors.location?.message}
              classNames={inputStyles}
            />
          )}
        />

        <Controller
          name="department_id"
          control={control}
          rules={{ required: "부서 선택은 필수입니다" }}
          render={({ field }) => (
            <Select
              {...field}
              label="department"
              isInvalid={!!errors.department_id}
              errorMessage={errors.department_id?.message}
              classNames={inputStyles}
            >
              {department_list.map((department) => (
                <SelectItem
                  key={department.department_id}
                  value={department.department_id}
                >
                  {department.department_name}
                </SelectItem>
              ))}
            </Select>
          )}
        />
      </div>

      <Button type="submit" className="w-full bg-purple-600 font-bold">
        Sign In
      </Button>
    </form>
  );
};

export default SignForm;
