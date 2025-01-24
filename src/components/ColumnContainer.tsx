import Delete from "../icons/Delete";
import { Column, Id } from "../types";

interface Props {
    column: Column;
    deleteColumn: (id: Id) => void;
}

function ColumnContainer(props: Props) {
    const { column, deleteColumn } = props;
    return (
        <div className="bg-blue-950 w-[350px] h-[500px] rounded-md flex flex-col gap-2 p-2 ">
            <div className="flex justify-between bg-blue-900 rounded-md cursor-grab p-4 ">
                <div className="flex gap-2 items-center">
                    <p className="font-bold text-white">{column.title}</p>
                </div>
                <button
                    onClick={() => deleteColumn(column.id)}
                    className="cursor-pointer p-2 bg-blue-950 rounded-md hover:bg-blue-800"
                >
                    <Delete />
                </button>
            </div>
            <div className="flex flex-grow">
                content
            </div>
            <div>Footer</div>
        </div>
    )
}

export default ColumnContainer
