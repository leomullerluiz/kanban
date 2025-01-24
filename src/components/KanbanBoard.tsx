import { useMemo, useState } from "react"
import Plus from "../icons/Plus"
import { Column, Id } from "../types"
import ColumnContainer from "./ColumnContainer";
import { DndContext, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

function KanbanBoard() {
    const [columns, setColumns] = useState<Column[]>([]);
    const columnsId = useMemo(() => columns.map((column) => column.id), [columns])

    const [activeColumn, setActiveColumn] = useState<Column | null>(null);

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

    const onDragStart = (event: DragStartEvent) => {
        console.log("DRAG START", event);
        if (event.active.data.current?.type === "column") {
            setActiveColumn(event.active.data.current.column);
            return;
        }
    }

    return (
        <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
            <div className="m-auto flex gap-2">
                <DndContext onDragStart={onDragStart}>
                    <div className="flex gap-4">
                        <SortableContext items={columnsId} >
                            {columns.map((column) => (
                                <ColumnContainer
                                    key={column.id}
                                    column={column}
                                    deleteColumn={deleteColumn}
                                />
                            ))}
                        </SortableContext>

                    </div>
                    {createPortal(<DragOverlay>
                        {activeColumn && (
                            <ColumnContainer column={activeColumn} deleteColumn={deleteColumn} />
                        )}
                    </DragOverlay>, document.body)}
                </DndContext>

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
