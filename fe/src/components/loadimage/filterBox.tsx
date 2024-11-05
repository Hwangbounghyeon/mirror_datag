import { useEffect, useState } from "react";
import { Select, SelectItem, Button } from "@nextui-org/react";
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
                            <span className="text-sm"></span>
                        ) : (
                            <Select
                                size="sm"
                                defaultSelectedKeys={[row.logic]}
                                onChange={(e) => {
                                    const newRows = [...filterRows];
                                    newRows[index].logic = e.target.value as
                                        | "and"
                                        | "or";
                                    setFilterRows(newRows);
                                }}
                            >
                                <SelectItem key="and">And</SelectItem>
                                <SelectItem key="or">Or</SelectItem>
                            </Select>
                        )}
                    </div>
                    <div className="flex-1 flex items-center space-x-2">
                        <Select
                            size="sm"
                            placeholder="Select field"
                            defaultSelectedKeys={row.field ? [row.field] : []}
                            onChange={(e) => {
                                const newRows = [...filterRows];
                                newRows[index].field = e.target.value;
                                setFilterRows(newRows);
                            }}
                            classNames={{
                                base: "max-w-[150px]",
                            }}
                        >
                            {fields.map((field) => (
                                <SelectItem key={field}>{field}</SelectItem>
                            ))}
                        </Select>
                        <Select
                            size="sm"
                            defaultSelectedKeys={[row.operator]}
                            onChange={(e) => {
                                const newRows = [...filterRows];
                                newRows[index].operator = e.target.value;
                                setFilterRows(newRows);
                            }}
                            classNames={{
                                base: "max-w-[100px]",
                            }}
                        >
                            {operators.map((op) => (
                                <SelectItem key={op}>{op}</SelectItem>
                            ))}
                        </Select>
                        <Select
                            size="sm"
                            selectionMode="multiple"
                            placeholder="Select values"
                            selectedKeys={new Set(row.values)}
                            onSelectionChange={(keys) => {
                                const selectedValues = Array.from(
                                    keys as Set<string>
                                );
                                const newRows = [...filterRows];
                                newRows[index].values = selectedValues;
                                setFilterRows(newRows);
                            }}
                        >
                            {values.map((value) => (
                                <SelectItem key={value}>{value}</SelectItem>
                            ))}
                        </Select>
                    </div>
                    <Button
                        isIconOnly
                        radius="full"
                        size="sm"
                        onClick={() => {
                            if (filterRows.length > 1) {
                                setFilterRows(
                                    filterRows.filter((_, i) => i !== index)
                                );
                            } else {
                                setFilterRows([
                                    {
                                        id: Date.now().toString(),
                                        logic: "and",
                                        field: "",
                                        operator: "is",
                                        values: [],
                                    },
                                ]);
                            }
                        }}
                        className="p-1 hover:bg-gray-100 rounded-full"
                    >
                        <IoCloseOutline />
                    </Button>
                </div>
            ))}
            <div className="flex justify-end pt-3 gap-4">
                <Button
                    color="danger"
                    onPress={() => {
                        setFilterRows([
                            {
                                id: Date.now().toString(),
                                logic: "and",
                                field: "",
                                operator: "is",
                                values: [],
                            },
                        ]);
                    }}
                >
                    Reset
                </Button>
                <Button color="primary" onPress={onDone}>
                    Done
                </Button>
            </div>
        </div>
    );
};

export default FilterComponent;
