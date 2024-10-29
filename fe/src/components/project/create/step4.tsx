// components/DepartmentSearch.tsx
import { Input } from "@nextui-org/react";
import { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";

interface Department {
  id: number;
  name: string;
  selected: boolean;
}

export default function DepartmentSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Department[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department[]>(
    []
  );
  const searchRef = useRef<HTMLDivElement>(null);

  const departments = [
    { id: 1, name: "Department A", selected: false },
    { id: 2, name: "Department B", selected: false },
    { id: 3, name: "Department C", selected: false },
    { id: 4, name: "Marketing Department", selected: false },
    { id: 5, name: "Sales Department", selected: false },
  ];

  useEffect(() => {
    if (searchTerm) {
      // 이미 선택된 부서를 제외한 결과 필터링
      const filtered = departments
        .filter(
          (dept) =>
            dept.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !selectedDepartment.some((selected) => selected.id === dept.id)
        )
        .slice(0, 5);
      setSearchResults(filtered);
      setIsSearching(true);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchTerm, selectedDepartment]); // selectedDepartment 의존성 추가

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearching(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDepartmentSelect = (dept: Department) => {
    setSelectedDepartment((prev) => [dept, ...prev]);
    setSearchTerm("");
    setIsSearching(false);
  };

  return (
    <div className="w-full flex flex-col justify-center">
      <h1 className="text-[20px] mb-3">
        추가적으로 프로젝트에 접근 허용할 부서를 골라 주세요
      </h1>
      <div className="relative" ref={searchRef}>
        <div className="min-w-[400px] w">
          <Input
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            label="Search"
            isClearable
            radius="lg"
            classNames={{
              base: "w-w-full",
              label: "text-black/50 dark:text-white/90",
              input: [
                "bg-transparent",
                "text-black/90 dark:text-white/90",
                "placeholder:text-default-700/50 dark:placeholder:text-white/60",
              ],
              innerWrapper: "bg-transparent",
              inputWrapper: [
                "shadow-xl",
                "bg-default-200/50",
                "dark:bg-default/60",
                "backdrop-blur-xl",
                "backdrop-saturate-200",
                "hover:bg-default-200/70",
                "dark:hover:bg-default/70",
                "group-data-[focus=true]:bg-default-200/50",
                "dark:group-data-[focus=true]:bg-default/60",
                "!cursor-text",
              ],
            }}
            placeholder="Type to search..."
            startContent={<FaSearch />}
          />
        </div>

        {isSearching && searchResults.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-600 border border-gray-300 dark:border-gray-800 rounded-lg shadow-lg">
            {searchResults.map((dept) => (
              <div
                key={dept.id}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-950 cursor-pointer"
                onClick={() => handleDepartmentSelect(dept)}
              >
                {dept.name}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6">
        {selectedDepartment.map((dept) => (
          <div
            className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-950"
            onClick={() =>
              setSelectedDepartment((prev) =>
                prev.filter((selected) => selected.id !== dept.id)
              )
            }
            key={dept.id}
          >
            {dept.name}
          </div>
        ))}
      </div>
    </div>
  );
}
