import { useSortable } from "@dnd-kit/sortable";
import Delete from "../icons/Delete";
import { Column, Id } from "../types";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

interface Props {
    column: Column;
    deleteColumn: (id: Id) => void;
    updateColumn: (id: Id, title: string) => void;
}

function ColumnContainer(props: Props) {

    const { column, deleteColumn, updateColumn } = props;

    const [editMode, setEditMode] = useState(false);

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: column.id,
        data: {
            type: "column",
            column,
        },
        disabled: editMode,
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="bg-blue-950 border-cyan-600 border-2 w-[350px] h-[500px] rounded-md flex flex-col gap-2 p-2 opacity-60 "
            >
            </div>
        )
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-blue-950 w-[350px] h-[500px] rounded-md flex flex-col gap-2 p-2 ">
            <div
                {...attributes}
                {...listeners}
                onClick={() => setEditMode(true)}
                className="flex justify-between bg-blue-900 rounded-md cursor-grab p-4 ">
                <div className="flex gap-2 items-center">
                    <p className="font-bold text-base text-white">
                        {!editMode && column.title}
                        {editMode &&
                            <input
                                autoFocus
                                onBlur={() => setEditMode(false)}
                                onKeyDown={(e) => {
                                    if (e.key !== "Enter") return;
                                    setEditMode(false);
                                }}
                                onChange={(e) => updateColumn(column.id, e.target.value)}
                                type="text"
                                className="bg-blue-950 p-2 rounded-md border-none outline-none text-white"
                                value={column.title}
                            />}
                    </p>
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
