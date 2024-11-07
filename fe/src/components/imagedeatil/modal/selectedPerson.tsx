import { Authority } from "@/types/auth";
import { MdOutlineClear } from "react-icons/md";

interface SelectedPeopleProps {
    people: Authority[];
    onRemove: (id: number) => void;
}

export function SelectedPeople({ people, onRemove }: SelectedPeopleProps) {
    return (
        <div className="flex flex-col gap-2">
            {people.map((person) => (
                <div
                    key={person.id}
                    className="flex items-center justify-between ps-3 py-1 rounded-full border border-blue-400"
                >
                    <span className="text-sm">
                        {person.name} / {person.department}
                    </span>
                    <button
                        onClick={() => onRemove(person.id)}
                        className="hover:text-blue-300"
                    >
                        <MdOutlineClear />
                    </button>
                </div>
            ))}
        </div>
    );
}
