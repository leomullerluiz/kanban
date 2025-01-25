import { useState } from "react";
import Delete from "../icons/Delete";
import { Id, Task } from "../types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
    task: Task;
    deleteTask: (id: Id) => void;
    updateTask: (id: Id, content: string) => void;
}

function TaskCard(props: Props) {
    const { task, deleteTask, updateTask } = props;

    const [mouseIsOver, setMouseIsOver] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task,
        },
        disabled: editMode,
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }

    const toggleEditMode = () => {
        setEditMode(!editMode);
        setMouseIsOver(false);
    }

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="flex bg-blue-700 w-full rounded-md p-2 gap-2 text-left items-center border-2 border-white cursor-grab min-h-[100px] h-[100px] relative opacity-30"
            />
        );
    }

    if (editMode) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                className="flex bg-blue-700 w-full rounded-md p-2 gap-2 text-left items-center border-2 border-white cursor-grab min-h-[100px] h-[100px] relative">
                <textarea
                    className="h-[90%] w-full resize-none border-none rounded-md bg-transparent p-2 focus:outline-none"
                    value={task.content}
                    autoFocus
                    placeholder="Task content"
                    onBlur={toggleEditMode}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && e.shiftKey) {
                            toggleEditMode();
                        }
                    }}
                    onChange={(e) => updateTask(task.id, e.target.value)}
                >

                </textarea>
            </div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="flex bg-blue-600 border-blue-600 w-full rounded-md p-2 gap-2 text-left items-center border-2 hover:border-white cursor-grab min-h-[100px] h-[100px] relative task"
            onMouseEnter={() => setMouseIsOver(true)}
            onMouseLeave={() => setMouseIsOver(false)}
            onClick={toggleEditMode}
        >
            <p
                className="my-auto h-[90%] w-full text-white overflow-y-auto overflow-x-hidden whitespace-pre-wrap"
            >
                {task.content}
            </p>

            {mouseIsOver &&
                <button
                    className="stroke-white absolute right-2 top-1/2 -translate-y-1/2 p-2 opacity-60 hover:opacity-100"
                    onClick={() => deleteTask(task.id)}
                >
                    <Delete />
                </button>
            }
        </div>
    )
}

export default TaskCard
