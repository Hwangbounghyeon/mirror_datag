import { StepProps } from "@/types/projectType";
import { Input, Textarea } from "@nextui-org/react";
import { memo } from "react";

const Step3 = ({ handleMove, projectItem, setProjectItem }: StepProps) => {
  return (
    <div className="flex flex-col item-center max-w-[700px] w-[90%] flex-wrap md:flex-nowrap ">
      <Input
        isRequired
        defaultValue={`${projectItem.name || ""}`}
        type="text"
        name="name"
        className="mb-5"
        label="Project Name"
        radius="md"
        size="md"
        onChange={(e) => {
          setProjectItem((prev) => ({ ...prev, name: e.target.value || "" }));
        }}
      />

      <Textarea
        isRequired
        minRows={2}
        className="mb-5"
        defaultValue={`${projectItem.name || ""}`}
        label="Project Description"
        radius="md"
        size="md"
        name="description"
        onChange={(e) => {
          setProjectItem((prev) => ({
            ...prev,
            description: e.target.value || "",
          }));
        }}
      />

      <button
        disabled={
          projectItem.name.length === 0 || projectItem.description.length === 0
        }
        onClick={() => {
          if (handleMove) {
            handleMove(4);
          }
        }}
      >
        Next
      </button>
    </div>
  );
};

export default memo(Step3);
