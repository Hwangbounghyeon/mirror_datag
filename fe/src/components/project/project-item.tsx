// components/ProjectCard.tsx
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { PiNotebookFill } from "react-icons/pi"; // description logo
import { BsPersonLinesFill } from "react-icons/bs"; //department logo
import { AiFillDatabase } from "react-icons/ai"; // data logo
import { IoIosCube } from "react-icons/io"; // model logo
import ProjectItemInfoCard from "./project-item-infocard";
import { ProjectType } from "@/types/projectType";

dayjs.extend(relativeTime);

interface ProjectCardProps {
  project: ProjectType;
}

export function ProjectItem({ project }: ProjectCardProps) {
  const timeAgo = dayjs(project.updated_at).fromNow();

  return (
    <div className="rounded-lg w-full bg-slate-200 dark:bg-slate-800 my-3 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">{project.project_name}</h2>
          <span
            className={`rounded-full px-3 py-1 text-sm ${
              project.is_private
                ? "bg-red-100 text-red-700"
                : "bg-blue-100 text-blue-700"
            } font-bold`}
          >
            {project.is_private ? "Private" : "Public"}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Edit on {timeAgo}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ProjectItemInfoCard
          title={"Description"}
          description={project.description}
          Icon={PiNotebookFill}
        />

        <ProjectItemInfoCard
          title={"Department / Manager"}
          description={`${project.department_name} / ${project.user_name}`}
          Icon={BsPersonLinesFill}
        />

        <ProjectItemInfoCard
          title={"Data"}
          description={`${
            project.data_count > 0 ? `${project.data_count}` : "Emtpy"
          }`}
          Icon={AiFillDatabase}
        />

        <ProjectItemInfoCard
          title={"Model"}
          description={project.model_name}
          Icon={IoIosCube}
        />
      </div>
    </div>
  );
}

export default ProjectItem;
