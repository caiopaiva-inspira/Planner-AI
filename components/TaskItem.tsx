import React, { useState, useEffect, useRef } from "react"
import { Check, Trash2, Pencil } from "lucide-react"
import { Task } from "@prisma/client"

export default function TaskItem({ task, onToggle, onDelete, onEdit }: { task: Task; onToggle: (id: string) => void; onDelete?: (id: string) => void; onEdit?: (id: string, title: string) => void }) {
    const [isEditing, setIsEditing] = useState(false)
    const [editTitle, setEditTitle] = useState(task.title)
    const editInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isEditing && editInputRef.current) {
            editInputRef.current.focus()
            editInputRef.current.setSelectionRange(editTitle.length, editTitle.length)
        }
    }, [isEditing])

    const handleSaveEdit = () => {
        setIsEditing(false)
        if (editTitle.trim() && editTitle.trim() !== task.title && onEdit) {
            onEdit(task.id, editTitle.trim())
        } else {
            setEditTitle(task.title) // reset if empty or unchanged
        }
    }

    return (
        <div
            onClick={() => onToggle(task.id)}
            className="group bg-white dark:bg-[#1C1C1E] rounded-2xl p-[14px] px-4 flex items-center mb-2 hover:scale-[1.005] transition-all duration-200 cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.06)] dark:shadow-none dark:border dark:border-[#2C2C2E]"
        >
            <div
                className={`w-[22px] h-[22px] shrink-0 rounded-[6px] flex items-center justify-center mr-4 transition-colors ${task.completed
                    ? "bg-black dark:bg-white border-transparent"
                    : "border-[1.5px] border-[#C7C7CC] dark:border-[#636366] bg-transparent"
                    }`}
            >
                {task.completed && <Check size={14} strokeWidth={3} className="text-white dark:text-black" />}
            </div>

            <div className="flex-1 md:pr-4 truncate"
                onDoubleClick={(e) => {
                    if (onEdit) {
                        e.stopPropagation();
                        setIsEditing(true);
                    }
                }}
            >
                {isEditing ? (
                    <input
                        ref={editInputRef}
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={handleSaveEdit}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveEdit();
                            if (e.key === "Escape") {
                                setIsEditing(false);
                                setEditTitle(task.title);
                            }
                        }}
                        className="font-medium text-[15px] bg-transparent text-[#111111] dark:text-white border-b border-[#E5E5EA] dark:border-[#3A3A3C] focus:outline-none focus:border-brand-blue dark:focus:border-brand-blue w-full p-0 leading-tight"
                    />
                ) : (
                    <span
                        className={`text-[15px] font-medium leading-tight truncate block ${task.completed ? "line-through text-[#8E8E93] dark:text-[#636366]" : "text-[#111111] dark:text-[#F2F2F7]"
                            }`}
                    >
                        {task.title}
                    </span>
                )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
                {onEdit && !task.completed && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsEditing(true);
                        }}
                        className="p-1.5 text-[#8E8E93] dark:text-[#636366] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 dark:hover:bg-[#2C2C2E] rounded-lg shrink-0"
                        title="Editar tarefa"
                    >
                        <Pencil size={16} />
                    </button>
                )}

                {onDelete && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(task.id);
                        }}
                        className="p-1.5 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg shrink-0"
                        title="Deletar tarefa"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
            </div>
        </div>
    )
}
