import { useMemo, useState } from "react"
import Plus from "../icons/Plus"
import { Column, Id, Task } from "../types"
import ColumnContainer from "./ColumnContainer";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

function KanbanBoard() {
    const [columns, setColumns] = useState<Column[]>([]);
    const columnsId = useMemo(() => columns.map((column) => column.id), [columns]);
    const [tasks, setTasks] = useState<Task[]>([]);

    const [activeColumn, setActiveColumn] = useState<Column | null>(null);

    const createNewTask = (columnId: Id) => {
        const newTask: Task = {
            id: generateId(),
            columnId,
            content: `Task ${tasks.length + 1}`
        }
        setTasks([...tasks, newTask]);
    }


    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {
            distance: 10, //Active when the pointer is within 10px of the sensor
        }
    }))

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

    const updateColumn = (id: Id, title: string) => {
        const newColumns = columns.map((column) => {
            if (column.id !== id) return column;
            return { ...column, title };
        })
        setColumns(newColumns);
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

    const onDragEnd = (event: DragEndEvent) => {
        console.log("DRAG END", event);
        const { active, over } = event;
        if (!over) return;

        const activeColumnId = active.id;
        const overColumnId = over.id;

        if (activeColumnId === overColumnId) return;

        setColumns((columns) => {
            const activeColumnIndex = columns.findIndex((column) => column.id === activeColumnId);
            const overColumnIndex = columns.findIndex((column) => column.id === overColumnId);

            return arrayMove(columns, activeColumnIndex, overColumnIndex);
        })
    }

    return (
        <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
            <div className="m-auto flex gap-2">
                <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
                    <div className="flex gap-4">
                        <SortableContext items={columnsId} >
                            {columns.map((column) => (
                                <ColumnContainer
                                    key={column.id}
                                    column={column}
                                    deleteColumn={deleteColumn}
                                    updateColumn={updateColumn}
                                    createNewTask={createNewTask}
                                    tasks={tasks.filter((task) => task.columnId === column.id)}
                                />
                            ))}
                        </SortableContext>

                    </div>
                    {createPortal(<DragOverlay>
                        {activeColumn && (
                            <ColumnContainer
                                column={activeColumn}
                                deleteColumn={deleteColumn}
                                updateColumn={updateColumn}
                                createNewTask={createNewTask}
                                tasks={tasks.filter((task) => task.columnId === activeColumn.id)}
                            />
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
