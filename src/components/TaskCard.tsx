import { useState } from "react";
import Delete from "../icons/Delete";
import { Id, Task } from "../types";

interface Props {
    task: Task;
    deleteTask: (id: Id) => void;
}
function TaskCard(props: Props) {
    const { task, deleteTask } = props;

    const [mouseIsOver, setMouseIsOver] = useState(false);

    return (
        <div
            className="flex bg-blue-600 border-blue-600 w-full rounded-md p-2 gap-2 text-left items-center border-2 hover:border-white cursor-grab min-h-[100px] h-[100px] relative"
            onMouseEnter={() => setMouseIsOver(true)}
            onMouseLeave={() => setMouseIsOver(false)}
        >
            {task.content}
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
