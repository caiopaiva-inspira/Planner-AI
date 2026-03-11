import React from "react"
import { Plus } from "lucide-react"
import { Event, Task } from "@prisma/client"
import EventCard from "./EventCard"
import TaskItem from "./TaskItem"

interface AgendaProps {
    dateLabel: string
    events: Event[]
    tasks: Task[]
    onToggleTask: (id: string) => void
    onOpenAdd: () => void
    onDeleteEvent?: (id: string) => void
    onDeleteTask?: (id: string) => void
    onEditEvent?: (id: string, newTitle: string) => void
    onEditTask?: (id: string, newTitle: string) => void
}

export default function AgendaSection({ dateLabel, events, tasks, onToggleTask, onOpenAdd, onDeleteEvent, onDeleteTask, onEditEvent, onEditTask }: AgendaProps) {
    return (
        <div className="mt-8 mb-32">
            <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <h2 className="font-bold text-[20px] text-[#111111] dark:text-white tracking-tight">
                            Controle do Dia
                        </h2>
                        <button onClick={onOpenAdd} className="p-1 rounded-full bg-[#F2F2F7] dark:bg-[#2C2C2E] hover:opacity-80 transition-opacity text-[#111111] dark:text-white" title="Adicionar Manualmente">
                            <Plus size={16} />
                        </button>
                    </div>
                    <span className="text-[13px] text-[#8E8E93] dark:text-[#636366]">
                        {events.length} Evento{events.length !== 1 && 's'} • {tasks.length} Tarefa{tasks.length !== 1 && 's'} ({tasks.filter(t => t.completed).length} concluídas)
                    </span>
                </div>
                <span className="text-[14px] font-medium text-brand-blue">
                    {dateLabel}
                </span>
            </div>

            {events.length > 0 && (
                <div className="mb-6">
                    <label className="block font-medium tracking-[0.08em] uppercase text-[11px] text-[#8E8E93] dark:text-[#636366] mb-3">
                        Eventos
                    </label>
                    <div className="flex flex-col">
                        {events.map((ev) => (
                            <EventCard key={ev.id} event={ev} onDelete={onDeleteEvent} onEdit={onEditEvent} />
                        ))}
                    </div>
                </div>
            )}

            {tasks.length > 0 && (
                <div className="mb-6">
                    <label className="block font-medium tracking-[0.08em] uppercase text-[11px] text-[#8E8E93] dark:text-[#636366] mb-3 mt-4">
                        Tarefas
                    </label>
                    <div className="flex flex-col">
                        {tasks.map((task) => (
                            <TaskItem key={task.id} task={task} onToggle={onToggleTask} onDelete={onDeleteTask} onEdit={onEditTask} />
                        ))}
                    </div>
                </div>
            )}

            {events.length === 0 && tasks.length === 0 && (
                <div className="text-center mt-12 mb-12">
                    <p className="text-[#8E8E93] dark:text-[#636366] text-[15px]">Nenhum compromisso ou tarefa para hoje.</p>
                </div>
            )}
        </div>
    )
}
