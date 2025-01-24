import { Task } from "../types";

interface Props {
    task: Task;
}
function TaskCard(props: Props) {
    const { task } = props;
    return (
        <div
            className="flex bg-blue-600 w-full rounded-md p-2 gap-2 items-center">
            <p className="text-white">{task.content}</p>
        </div>
    )
}

export default TaskCard
