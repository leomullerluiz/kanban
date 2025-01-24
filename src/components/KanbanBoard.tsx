import { useState } from "react"
import Plus from "../icons/Plus"
import { Column, Id } from "../types"
import ColumnContainer from "./ColumnContainer";

function KanbanBoard() {
    const [columns, setColumns] = useState<Column[]>([]);

    console.log(columns)

    const createNewColumn = () => {
        const columnToAdd: Column = {
            id: generateId(),
            title: `Column ${columns.length + 1}`
        }
        setColumns([...columns, columnToAdd]);
    }

    const deleteColumn = (id: Id) => {
        const filteredColumns = columns.filter((column) => column.id !== id);
        setColumns(filteredColumns);
    }

    const generateId = () => {
        return Math.floor(Math.random() * 100001);
    }

    return (
        <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
            <div className="m-auto flex gap-2">
                <div className="flex gap-4">
                    {columns.map((column) => (
                        <ColumnContainer key={column.id} column={column} deleteColumn={deleteColumn} />
                    ))}
                </div>
                <button
                    onClick={createNewColumn}
                    className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-blue-700 text-white font-bold text-xl flex gap-2 items-center justify-center"
                >
                    <Plus />
                    Add Column
                </button>
            </div>
        </div>
    )
}

export default KanbanBoard
