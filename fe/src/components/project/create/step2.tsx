import { StepProps } from "@/types/projectType";
import { Button, Input, Textarea } from "@nextui-org/react";
import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { setProjectName, setDescription } from "@/store/create-store";

const Step2 = ({ handleMove }: StepProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { project_name, description } = useSelector(
    (state: RootState) => state.project
  );
  return (
    <div className="flex flex-col item-center max-w-[700px] w-[90%] flex-wrap md:flex-nowrap ">
      <Input
        isRequired
        defaultValue={project_name}
        type="text"
        name="project_name"
        className="mb-5"
        label="Project Name"
        radius="md"
        size="md"
        onChange={(e) => {
          dispatch(setProjectName(e.target.value || ""));
        }}
      />

      <Textarea
        isRequired
        minRows={2}
        className="mb-5"
        defaultValue={description}
        label="Project Description"
        radius="md"
        size="md"
        name="description"
        onChange={(e) => {
          dispatch(setDescription(e.target.value || ""));
        }}
      />

      <Button
        disabled={project_name.length === 0 || description.length === 0}
        onClick={() => {
          if (handleMove) {
            handleMove(3);
          }
        }}
      >
        Next
      </Button>
    </div>
  );
};

export default memo(Step2);
