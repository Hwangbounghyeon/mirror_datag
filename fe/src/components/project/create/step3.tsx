import { StepProps } from "@/types/projectType";

import { AppDispatch, RootState } from "@/store/store";
import { setProjectName, setDescription } from "@/store/create-store";
import { useDispatch, useSelector } from "react-redux";
import { Root } from "postcss";
import { Button } from "@nextui-org/react";

export default function Step3({ handleMove }: StepProps) {
  const dispatch = useDispatch<AppDispatch>();
  const addedAuthUsers = useSelector(
    (state: RootState) => state.project.accesscontrol.users
  );
  const addedAuthDeps = useSelector(
    (state: RootState) => state.project.accesscontrol.departments
  );

  return (
    <div className="max-w-[700px] w-full flex flex-col items-center justify-center">
      <header>
        <h1 className="text-[20px] mb-3">
          추가적으로 프로젝트에 접근 허용할 대상을 골라 주세요.
        </h1>
        <div className="flex flex-row flex-wrap">
          <Button>부서 추가</Button>
          <Button>인원 추가</Button>
        </div>
      </header>

      <section className="w-full flex flex-col">
        <h3 className="text-[14px] text-center">부서 목록</h3>
      </section>
      <section className="w-full flex flex-col">
        <h3 className="text-[14px] text-center">인원 목록</h3>
      </section>
    </div>
  );
}
