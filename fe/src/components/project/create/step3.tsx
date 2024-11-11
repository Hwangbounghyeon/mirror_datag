import { StepProps } from "@/types/projectType";
import { Button, Input, Textarea } from "@nextui-org/react";
import { memo } from "react";

const Step3 = ({ handleMove, projectItem, setProjectItem }: StepProps) => {
  return (
    <div className="flex flex-col item-center max-w-[700px] w-[90%] flex-wrap md:flex-nowrap ">
      <Input
        isRequired
        defaultValue={`${projectItem.project_name || ""}`}
        type="text"
        name="project_name"
        className="mb-5"
        label="Project Name"
        radius="md"
        size="md"
        onChange={(e) => {
          setProjectItem({
            project_name: e.target.value || "",
          });
        }}
      />

      <Textarea
        isRequired
        minRows={2}
        className="mb-5"
        defaultValue={`${projectItem.description || ""}`}
        label="Project Description"
        radius="md"
        size="md"
        name="description"
        onChange={(e) => {
          setProjectItem({
            description: e.target.value || "",
          });
        }}
      />

      <Button
        disabled={
          projectItem.project_name.length === 0 ||
          projectItem.description.length === 0
        }
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

export default memo(Step3);
