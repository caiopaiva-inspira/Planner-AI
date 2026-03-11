import React, { useState } from "react"
import { X } from "lucide-react"

interface AddModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (type: "event" | "task", title: string, timeStart?: string, timeEnd?: string) => void
}

export default function AddModal({ isOpen, onClose, onAdd }: AddModalProps) {
    const [type, setType] = useState<"event" | "task">("task")
    const [title, setTitle] = useState("")
    const [timeStart, setTimeStart] = useState("")
    const [timeEnd, setTimeEnd] = useState("")

    if (!isOpen) return null

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim()) return
        onAdd(type, title, timeStart, timeEnd)
        setTitle("")
        setTimeStart("")
        setTimeEnd("")
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl w-full max-w-[400px] shadow-xl overflow-hidden animate-in zoom-in-95 border border-[#F2F2F7] dark:border-[#2C2C2E]">
                <div className="flex items-center justify-between p-4 border-b border-[#F2F2F7] dark:border-[#2C2C2E]">
                    <h3 className="font-bold text-[16px] text-[#111111] dark:text-white">Criar Manualmente</h3>
                    <button onClick={onClose} className="p-1 rounded-full text-[#8E8E93] hover:bg-[#F2F2F7] dark:hover:bg-[#2C2C2E] transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
                    <div className="flex bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-lg p-1">
                        <button
                            type="button"
                            onClick={() => setType("task")}
                            className={`flex-1 text-[13px] font-medium py-1.5 rounded-md transition-all ${type === "task" ? "bg-white dark:bg-[#1C1C1E] text-[#111111] dark:text-white shadow-sm" : "text-[#8E8E93] dark:text-[#636366]"}`}
                        >
                            Tarefa
                        </button>
                        <button
                            type="button"
                            onClick={() => setType("event")}
                            className={`flex-1 text-[13px] font-medium py-1.5 rounded-md transition-all ${type === "event" ? "bg-white dark:bg-[#1C1C1E] text-[#111111] dark:text-white shadow-sm" : "text-[#8E8E93] dark:text-[#636366]"}`}
                        >
                            Evento
                        </button>
                    </div>

                    <input
                        type="text"
                        placeholder={type === "event" ? "Nome do evento" : "O que precisa ser feito?"}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-[#F5F5F7] dark:bg-black border border-transparent focus:border-brand-blue text-[#111111] dark:text-white rounded-lg px-4 py-3 text-[15px] outline-none transition-all placeholder:text-[#8E8E93] dark:placeholder:text-[#636366]"
                        autoFocus
                    />

                    {type === "event" && (
                        <div className="flex gap-3">
                            <input
                                type="time"
                                value={timeStart}
                                onChange={(e) => setTimeStart(e.target.value)}
                                className="w-full bg-[#F5F5F7] dark:bg-black border border-transparent focus:border-brand-blue text-[#111111] dark:text-white rounded-lg px-4 py-3 text-[15px] outline-none transition-all"
                            />
                            <input
                                type="time"
                                value={timeEnd}
                                onChange={(e) => setTimeEnd(e.target.value)}
                                className="w-full bg-[#F5F5F7] dark:bg-black border border-transparent focus:border-brand-blue text-[#111111] dark:text-white rounded-lg px-4 py-3 text-[15px] outline-none transition-all"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={!title.trim()}
                        className="w-full bg-black dark:bg-white text-white dark:text-black font-semibold rounded-lg py-3 mt-2 disabled:opacity-50 transition-opacity"
                    >
                        Adicionar
                    </button>
                </form>
            </div>
        </div>
    )
}
