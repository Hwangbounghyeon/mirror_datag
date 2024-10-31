import { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";

interface FilterRow {
    id: string;
    logic: "and" | "or";
    field: string;
    operator: string;
    values: string[];
}

const FilterComponent = ({ onDone }: { onDone?: () => void }) => {
    const [filterRows, setFilterRows] = useState<FilterRow[]>([
        {
            id: Date.now().toString(),
            logic: "and",
            field: "",
            operator: "is",
            values: [],
        },
    ]);

    const isRowComplete = (row: FilterRow) => {
        return row.field !== "" && row.operator !== "" && row.values.length > 0;
    };

    useEffect(() => {
        const lastRow = filterRows[filterRows.length - 1];
        if (isRowComplete(lastRow)) {
            setFilterRows([
                ...filterRows,
                {
                    id: Date.now().toString(),
                    logic: "and",
                    field: "",
                    operator: "is",
                    values: [],
                },
            ]);
        }
    }, [filterRows]);

    const fields = ["Ops", "Design", "Design Status", "Ops Status"];
    const operators = ["is", "is not"];
    const values = ["Filtered", "Done", "Osval", "Mari"];

    return (
        <div className="p-3 space-y-2 min-w-[600px]">
            {filterRows.map((row, index) => (
                <div key={row.id} className="flex items-center space-x-2">
                    <div className="flex-shrink-0 w-20">
                        {index === 0 ? (
                            <span className="text-sm text-gray-500"></span>
                        ) : (
                            <select
                                className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md"
                                value={row.logic}
                                onChange={(e) => {
                                    const newRows = [...filterRows];
                                    newRows[index].logic = e.target.value as
                                        | "and"
                                        | "or";
                                    setFilterRows(newRows);
                                }}
                            >
                                <option value="and">And</option>
                                <option value="or">Or</option>
                            </select>
                        )}
                    </div>

                    <div className="flex-1 flex items-center space-x-2">
                        <select
                            className="flex-1 px-2 py-1.5 text-sm border border-gray-200 rounded-md bg-white"
                            value={row.field}
                            onChange={(e) => {
                                const newRows = [...filterRows];
                                newRows[index].field = e.target.value;
                                setFilterRows(newRows);
                            }}
                        >
                            <option value="">Select field</option>
                            {fields.map((field) => (
                                <option key={field} value={field}>
                                    {field}
                                </option>
                            ))}
                        </select>

                        <select
                            className="w-24 px-2 py-1.5 text-sm border border-gray-200 rounded-md bg-white"
                            value={row.operator}
                            onChange={(e) => {
                                const newRows = [...filterRows];
                                newRows[index].operator = e.target.value;
                                setFilterRows(newRows);
                            }}
                        >
                            {operators.map((op) => (
                                <option key={op} value={op}>
                                    {op}
                                </option>
                            ))}
                        </select>

                        <div className="flex-1 relative">
                            <div className="flex flex-col px-2 py-1.5 border border-gray-200 rounded-md bg-white">
                                <select
                                    className="border-none focus:outline-none text-sm"
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (
                                            value &&
                                            !row.values.includes(value)
                                        ) {
                                            const newRows = [...filterRows];
                                            newRows[index].values = [
                                                ...newRows[index].values,
                                                value,
                                            ];
                                            setFilterRows(newRows);
                                        }
                                        e.target.value = "";
                                    }}
                                >
                                    <option value="">Select value</option>
                                    {values
                                        .filter((v) => !row.values.includes(v))
                                        .map((value) => (
                                            <option key={value} value={value}>
                                                {value}
                                            </option>
                                        ))}
                                </select>
                                <div className="flex flex-col gap-1">
                                    {row.values.map((value) => (
                                        <span
                                            key={value}
                                            className="inline-flex items-center justify-between px-2 py-1 bg-gray-100 rounded-md text-xs"
                                        >
                                            {value}
                                            <button
                                                onClick={() => {
                                                    const newRows = [
                                                        ...filterRows,
                                                    ];
                                                    newRows[index].values =
                                                        newRows[
                                                            index
                                                        ].values.filter(
                                                            (v) => v !== value
                                                        );
                                                    setFilterRows(newRows);
                                                }}
                                                className="hover:bg-gray-200 rounded-full w-4 h-4 flex items-center justify-center"
                                            >
                                                <span className="text-gray-400 me-1">
                                                    ×
                                                </span>
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                if (filterRows.length > 1) {
                                    setFilterRows(
                                        filterRows.filter((_, i) => i !== index)
                                    );
                                }
                            }}
                            className="p-1 hover:bg-gray-100 rounded-full"
                        >
                            <IoCloseOutline className="text-gray-400" />
                        </button>
                    </div>
                </div>
            ))}

            <div className="flex justify-end pt-3">
                <button
                    onClick={onDone}
                    className="px-4 py-1.5 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                >
                    Done
                </button>
            </div>
        </div>
    );
};

export default FilterComponent;
