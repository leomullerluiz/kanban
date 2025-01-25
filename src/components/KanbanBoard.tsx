import { useMemo, useState } from "react"
import Plus from "../icons/Plus"
import { Column, Id, Task } from "../types"
import ColumnContainer from "./ColumnContainer";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";

function KanbanBoard() {
    const [columns, setColumns] = useState<Column[]>([]);
    const columnsId = useMemo(() => columns.map((column) => column.id), [columns]);
    const [tasks, setTasks] = useState<Task[]>([]);

    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const createNewTask = (columnId: Id) => {
        const newTask: Task = {
            id: generateId(),
            columnId,
            content: `Task ${tasks.length + 1}`
        }
        setTasks([...tasks, newTask]);
    }

    const deleteTask = (id: Id) => {
        const filteredTasks = tasks.filter((task) => task.id !== id);
        setTasks(filteredTasks);
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

    const updateTask = (id: Id, content: string) => {
        const newTasks = tasks.map((task) => {
            if (task.id !== id) return task;
            return { ...task, content };
        })
        setTasks(newTasks);
    }

    const deleteColumn = (id: Id) => {
        const filteredColumns = columns.filter((column) => column.id !== id);
        setColumns(filteredColumns);
        const newTasks = tasks.filter((task) => task.columnId !== id);
        setTasks(newTasks);
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

        if (event.active.data.current?.type === "Task") {
            setActiveTask(event.active.data.current.task);
            return;
        }

    }

    const onDragOver = (event: DragOverEvent) => {
        console.log("DRAG OVER", event);
        const { active, over } = event;
        if (!over) return;

        const activeColumnId = active.id;
        const overColumnId = over.id;

        if (activeColumnId === overColumnId) return;

        const isActiveTask = active.data.current?.type === "Task";
        const isOverTask = over.data.current?.type === "Task";

        if (!isActiveTask) return;

        if (isActiveTask && isOverTask) {
            setTasks(tasks => {
                const activeTaskIndex = tasks.findIndex((task) => task.id === active.id);
                const overTaskIndex = tasks.findIndex((task) => task.id === over.id);

                tasks[activeTaskIndex].columnId = tasks[overTaskIndex].columnId;

                return arrayMove(tasks, activeTaskIndex, overTaskIndex);
            });
        }

        const isOverAColumn = over.data.current?.type === "column";

        if (isActiveTask && isOverAColumn) {
            setTasks(tasks => {
                const activeTaskIndex = tasks.findIndex((task) => task.id === active.id);

                tasks[activeTaskIndex].columnId = overColumnId;

                return arrayMove(tasks, activeTaskIndex, activeTaskIndex);
            });
        }

    }

    const onDragEnd = (event: DragEndEvent) => {
        console.log("DRAG END", event);

        setActiveColumn(null);
        setActiveTask(null);

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
                <DndContext
                    sensors={sensors}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    onDragOver={onDragOver}
                >
                    <div className="flex gap-4">
                        <SortableContext items={columnsId} >
                            {columns.map((column) => (
                                <ColumnContainer
                                    key={column.id}
                                    column={column}
                                    deleteColumn={deleteColumn}
                                    updateColumn={updateColumn}
                                    createNewTask={createNewTask}
                                    updateTask={updateTask}
                                    deleteTask={deleteTask}
                                    tasks={tasks.filter((task) => task.columnId === column.id)}
                                />
                            ))}
                        </SortableContext>

                    </div>
                    {/*Todo: create a component only for overlay*/}
                    {createPortal(<DragOverlay>
                        {activeColumn && (
                            <ColumnContainer
                                column={activeColumn}
                                deleteColumn={deleteColumn}
                                updateColumn={updateColumn}
                                createNewTask={createNewTask}
                                updateTask={updateTask}
                                deleteTask={deleteTask}
                                tasks={tasks.filter((task) => task.columnId === activeColumn.id)}

                            />
                        )}
                        {
                            activeTask && (
                                <TaskCard
                                    task={activeTask}
                                    deleteTask={deleteTask}
                                    updateTask={updateTask}
                                />
                            )
                        }
                    </DragOverlay>,
                        document.body)}
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
