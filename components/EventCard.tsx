import React, { useState, useEffect, useRef } from "react"
import { Calendar, Dumbbell, ChevronRight, CheckCircle2, Trash2, Pencil } from "lucide-react"
import { Event } from "@prisma/client"

export default function EventCard({ event, onDelete, onEdit }: { event: Event; onDelete?: (id: string) => void; onEdit?: (id: string, title: string) => void }) {
    const [isPast, setIsPast] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editTitle, setEditTitle] = useState(event.title)
    const editInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const checkPast = () => {
            const now = new Date()
            const [year, month, day] = event.dateKey.split("-").map(Number)
            const [hour, minute] = event.timeEnd.split(":").map(Number)
            // Cuidado com timezone, mas para local é perfeito
            const eventEnd = new Date(year, month - 1, day, hour, minute)
            setIsPast(now > eventEnd)
        }

        checkPast()
        // Atualiza a cada 1 minuto para não precisar recarregar a página
        const interval = setInterval(checkPast, 60000)
        return () => clearInterval(interval)
    }, [event.dateKey, event.timeEnd])

    useEffect(() => {
        if (isEditing && editInputRef.current) {
            editInputRef.current.focus()
            editInputRef.current.setSelectionRange(editTitle.length, editTitle.length)
        }
    }, [isEditing, editTitle.length])

    const handleSaveEdit = () => {
        setIsEditing(false)
        if (editTitle.trim() && editTitle.trim() !== event.title && onEdit) {
            onEdit(event.id, editTitle.trim())
        } else {
            setEditTitle(event.title) // reset if empty or unchanged
        }
    }

    return (
        <div className={`group bg-white dark:bg-[#1C1C1E] rounded-2xl p-[14px] px-4 flex items-center mb-2 hover:scale-[1.005] transition-all duration-200 cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.06)] dark:shadow-none dark:border dark:border-[#2C2C2E] ${isPast ? "opacity-60" : ""}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 shrink-0 transition-colors ${isPast ? "bg-green-500/10" : "bg-[#F2F2F7] dark:bg-[#2C2C2E]"}`}>
                {isPast ? (
                    <CheckCircle2 size={20} className="text-green-600 dark:text-green-500" />
                ) : (
                    <>
                        {event.icon === "calendar" && <Calendar size={20} className="text-[#111111] dark:text-[#F2F2F7]" />}
                        {event.icon === "gym" && <Dumbbell size={20} className="text-[#111111] dark:text-[#F2F2F7]" />}
                    </>
                )}
            </div>

            <div className="flex-1 min-w-0"
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
                                setEditTitle(event.title);
                            }
                        }}
                        className="font-bold text-[15px] bg-transparent text-[#111111] dark:text-white border-b border-[#E5E5EA] dark:border-[#3A3A3C] focus:outline-none focus:border-brand-blue dark:focus:border-brand-blue w-full p-0 leading-tight mb-0.5"
                    />
                ) : (
                    <h3 className={`font-bold text-[15px] truncate leading-tight ${isPast ? "text-green-700 dark:text-green-500 line-through decoration-green-500/40" : "text-[#111111] dark:text-white"}`}>
                        {event.title}
                    </h3>
                )}
                <p className={`text-[13px] mt-0.5 truncate ${isPast ? "text-green-600/70 dark:text-green-500/70" : "text-[#8E8E93] dark:text-[#636366]"}`}>
                    {event.timeStart} - {event.timeEnd} • {event.location}
                </p>
            </div>

            <div className="ml-3 shrink-0 flex items-center gap-2">
                {isPast ? (
                    <span className="text-[11px] font-bold uppercase tracking-wider text-green-600 dark:text-green-500 bg-green-500/10 px-2 py-1 rounded-md">Concluído</span>
                ) : (
                    <ChevronRight size={20} className="text-[#8E8E93] dark:text-[#636366]" />
                )}

                {onEdit && !isPast && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsEditing(true);
                        }}
                        className="p-1.5 text-[#8E8E93] dark:text-[#636366] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 dark:hover:bg-[#2C2C2E] rounded-lg"
                        title="Editar evento"
                    >
                        <Pencil size={16} />
                    </button>
                )}

                {onDelete && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(event.id);
                        }}
                        className="p-1.5 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                        title="Deletar evento"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
            </div>
        </div>
    )
}
