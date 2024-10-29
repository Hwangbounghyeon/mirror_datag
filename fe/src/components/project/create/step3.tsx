import { StepProps } from "@/types/projectType";
import { Input } from "@nextui-org/react";
import { memo } from "react";

const Step3 = ({ handleMove, projectItem, setProjectItem }: StepProps) => {
  return (
    <div className="flex flex-col item-center  w-full flex-wrap md:flex-nowrap ">
      <div className="w-full mb-6">
        <Input
          isRequired
          defaultValue={`${
            projectItem.name || `Project_${new Date().toUTCString()}`
          }`}
          type="text"
          name="name"
          label="Project Name"
          className="w-full"
          radius="md"
          size="md"
          onChange={(e) => {
            setProjectItem((prev) => ({ ...prev, name: e.target.value || "" }));
          }}
        />
      </div>

      <div className="mb-6">
        <Input
          isRequired
          defaultValue={`${
            projectItem.description || `Project_${new Date().toUTCString()}`
          }`}
          type="text"
          label="Project Name"
          className="w-full"
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
      </div>

      <div className="mb-6">
        <label className="block text-sm font-bold mb-2">
          Department / Manager
        </label>
        <div className="flex gap-4">
          <Input placeholder="Department A" className="w-full" size="lg" />
          <Input placeholder="Manager 01" className="w-full" size="lg" />
        </div>
      </div>

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
