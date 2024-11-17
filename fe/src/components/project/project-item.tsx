"use client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { PiNotebookFill } from "react-icons/pi"; // description logo
import { BsPersonLinesFill } from "react-icons/bs"; //department logo
import { IoIosCube } from "react-icons/io"; // model logo
import ProjectItemInfoCard from "./project-item-infocard";
import { ProjectType } from "@/types/projectType";
import { useRouter } from "next/navigation";

dayjs.extend(relativeTime);

interface ProjectCardProps {
    project: ProjectType;
}

export function ProjectItem({ project }: ProjectCardProps) {
    const router = useRouter();
    const timeAgo = dayjs(project.updated_at).fromNow();

    return (
        <div
            onClick={() => router.push(`/project/${project.project_id}`)}
            className="
      hover:shadow-md cursor-pointer hover:scale-[101%] transition-all active:scale-[99%] duration-100
      rounded-lg w-full bg-slate-200 dark:bg-slate-800 mb-3 p-6 shadow-sm "
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold">
                        {project.project_name}
                    </h2>
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
                    <span className="text-sm text-gray-600">
                        Edit on {timeAgo}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
                <ProjectItemInfoCard
                    title={"Description"}
                    description={project.description}
                    Icon={PiNotebookFill}
                />

                <ProjectItemInfoCard
                    title={"Department"}
                    description={`${project.department}`}
                    Icon={BsPersonLinesFill}
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
