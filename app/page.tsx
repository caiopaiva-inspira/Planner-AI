"use client"

import React, { useState, useEffect } from "react"
import Header from "@/components/Header"
import LoginPage from "@/components/LoginPage"
import CalendarWidget from "@/components/CalendarWidget"
import AgendaSection from "@/components/AgendaSection"
import AIInputBar from "@/components/AIInputBar"
import AddModal from "@/components/AddModal"
import { Sparkles, Loader2, RefreshCw } from "lucide-react"
import { syncUser, getMonthAgenda, createEvent as createEventServer, createTask as createTaskServer, toggleTaskComplete, deleteEvent as deleteEventServer, deleteTask as deleteTaskServer, updateEvent as updateEventServer, updateTask as updateTaskServer } from "./actions"
import { processAIText } from "./ai-actions"
import { Event, Task } from "@prisma/client"

export type AgendaData = { [dateKey: string]: { events: Event[]; tasks: Task[] } }

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
]

const WEEKDAYS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]

export default function Home() {
  const [view, setView] = useState<"login" | "dashboard">("login") // default as requested demo flow
  const [selectedDay, setSelectedDay] = useState(new Date().getDate())
  const [currentMonth, setCurrentMonth] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear() })
  const [agendaData, setAgendaData] = useState<AgendaData>({})
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isAILoading, setIsAILoading] = useState(false)

  useEffect(() => {
    // Tenta puxar a sessão existente via Supabase quando o app abre
    syncUser().then((res) => {
      if (res.user) setView("dashboard")
      setIsInitializing(false)
    })
  }, [])

  const fetchAgenda = async () => {
    setIsRefreshing(true)
    try {
      const { events, tasks } = await getMonthAgenda(currentMonth.year, currentMonth.month)
      const novoMapeamento: AgendaData = {}
      events.forEach((e: Event) => {
        if (!novoMapeamento[e.dateKey]) novoMapeamento[e.dateKey] = { events: [], tasks: [] }
        novoMapeamento[e.dateKey].events.push(e)
      })
      tasks.forEach((t: Task) => {
        if (!novoMapeamento[t.dateKey]) novoMapeamento[t.dateKey] = { events: [], tasks: [] }
        novoMapeamento[t.dateKey].tasks.push(t)
      })
      setAgendaData(novoMapeamento)
    } catch (e) {
      console.error(e)
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    if (view === "dashboard") {
      fetchAgenda()
    }
  }, [view, currentMonth])

  const handleLogin = () => setView("dashboard")

  const handleToggleTask = async (taskId: string) => {
    let isCompletedNow = false
    setAgendaData((prev) => {
      let nextState = { ...prev }
      for (const dateKey in nextState) {
        if (nextState[dateKey].tasks.some(t => t.id === taskId)) {
          nextState = {
            ...nextState,
            [dateKey]: {
              ...nextState[dateKey],
              tasks: nextState[dateKey].tasks.map(t => {
                if (t.id === taskId) {
                  isCompletedNow = !t.completed
                  return { ...t, completed: isCompletedNow }
                }
                return t
              })
            }
          }
        }
      }
      return nextState
    })

    // Remote update
    await toggleTaskComplete(taskId, isCompletedNow).catch(console.error)
  }

  const handleDeleteEvent = async (eventId: string) => {
    const dateKey = `${currentMonth.year}-${String(currentMonth.month).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`
    setAgendaData(prev => {
      const dayData = prev[dateKey] || { events: [], tasks: [] }
      return {
        ...prev,
        [dateKey]: { ...dayData, events: dayData.events.filter(e => e.id !== eventId) }
      }
    })
    await deleteEventServer(eventId).catch(console.error)
    showToast("Evento excluído.")
  }

  const handleDeleteTask = async (taskId: string) => {
    const dateKey = `${currentMonth.year}-${String(currentMonth.month).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`
    setAgendaData(prev => {
      const dayData = prev[dateKey] || { events: [], tasks: [] }
      return {
        ...prev,
        [dateKey]: { ...dayData, tasks: dayData.tasks.filter(t => t.id !== taskId) }
      }
    })
    await deleteTaskServer(taskId).catch(console.error)
    showToast("Tarefa excluída.")
  }

  const handleEditEvent = async (eventId: string, newTitle: string) => {
    const dateKey = `${currentMonth.year}-${String(currentMonth.month).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`
    setAgendaData(prev => {
      const dayData = prev[dateKey] || { events: [], tasks: [] }
      return {
        ...prev,
        [dateKey]: { ...dayData, events: dayData.events.map(e => e.id === eventId ? { ...e, title: newTitle } : e) }
      }
    })
    await updateEventServer(eventId, newTitle).catch(console.error)
  }

  const handleEditTask = async (taskId: string, newTitle: string) => {
    const dateKey = `${currentMonth.year}-${String(currentMonth.month).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`
    setAgendaData(prev => {
      const dayData = prev[dateKey] || { events: [], tasks: [] }
      return {
        ...prev,
        [dateKey]: { ...dayData, tasks: dayData.tasks.map(t => t.id === taskId ? { ...t, title: newTitle } : t) }
      }
    })
    await updateTaskServer(taskId, newTitle).catch(console.error)
  }

  const handleAddManual = async (type: "event" | "task", title: string, timeStart?: string, timeEnd?: string) => {
    const dateKey = `${currentMonth.year}-${String(currentMonth.month).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`

    if (type === "event") {
      const serverEv = await createEventServer(title, dateKey, timeStart || "12:00", timeEnd || "13:00")
      setAgendaData((prev) => {
        const dayData = prev[dateKey] || { events: [], tasks: [] }
        return {
          ...prev,
          [dateKey]: {
            ...dayData,
            events: [...dayData.events, serverEv]
          }
        }
      })
    } else {
      const serverTask = await createTaskServer(title, dateKey)
      setAgendaData((prev) => {
        const dayData = prev[dateKey] || { events: [], tasks: [] }
        return {
          ...prev,
          [dateKey]: {
            ...dayData,
            tasks: [...dayData.tasks, serverTask]
          }
        }
      })
    }
    showToast(`✓ ${type === "event" ? "Evento" : "Tarefa"} adicionado(a)`)
  }

  const handleAISubmit = async (text: string) => {
    setIsAILoading(true)
    
    // Concatena a agenda atual para o prompt de contexto da inteligência
    const contextList: string[] = []
    for (const [date, data] of Object.entries(agendaData)) {
        data.events.forEach((e: Event) => contextList.push(`[${e.id}] Evento: ${e.title} na data ${date} as ${e.timeStart}`))
        data.tasks.forEach((t: Task) => contextList.push(`[${t.id}] Tarefa: ${t.title} na data ${date} (Concluída: ${t.completed})`))
    }
    const contextText = contextList.join('\n')

    const result = await processAIText(text, currentMonth.year, currentMonth.month, selectedDay, contextText)

    if (result.success) {
      showToast(result.message || "Ação concluída!")
      await fetchAgenda() // Atualiza toda a tela com o banco de dados
    } else {
      showToast(result.message || "Não foi possível processar a mensagem.")
    }
    
    setIsAILoading(false)
  }

  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage(null)
    }, 4000)
  }

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-brand-blue" size={32} />
      </div>
    )
  }

  if (view === "login") {
    return <LoginPage onLogin={handleLogin} />
  }

  const dateKey = `${currentMonth.year}-${String(currentMonth.month).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`
  const selectedDayData = agendaData[dateKey] || { events: [], tasks: [] }

  const dotsOnDays = Object.keys(agendaData).filter((key) => {
    const [y, m] = key.split("-").map(Number)
    if (y !== currentMonth.year || m !== currentMonth.month) return false
    return agendaData[key].events.length > 0 || agendaData[key].tasks.length > 0
  }).map(key => parseInt(key.split("-")[2], 10))

  const selectedDateObj = new Date(currentMonth.year, currentMonth.month - 1, selectedDay)
  const dateLabel = `${WEEKDAYS[selectedDateObj.getDay()]}, ${selectedDay} de ${MONTHS[currentMonth.month - 1]}`

  return (
    <div className="min-h-screen relative max-w-[640px] mx-auto overflow-hidden">
      <Header />

      <main className="pt-[72px] pb-[100px] px-4 min-h-screen overflow-y-auto">
        <div className="flex justify-end items-center -mb-2 mt-2">
          <button
            onClick={fetchAgenda}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#8E8E93] dark:text-[#636366] hover:text-brand-blue dark:hover:text-brand-blue disabled:opacity-50 transition-colors"
          >
            <RefreshCw size={12} className={isRefreshing ? "animate-spin" : ""} />
            {isRefreshing ? "Atualizando..." : "Sincronizar"}
          </button>
        </div>

        <CalendarWidget
          selectedDate={selectedDay}
          onSelectDate={setSelectedDay}
          dotsOnDays={dotsOnDays}
          currentMonth={currentMonth}
          onPrevMonth={() => {
            setCurrentMonth((prev) => {
              if (prev.month === 1) return { month: 12, year: prev.year - 1 }
              return { ...prev, month: prev.month - 1 }
            })
            setSelectedDay(1)
          }}
          onNextMonth={() => {
            setCurrentMonth((prev) => {
              if (prev.month === 12) return { month: 1, year: prev.year + 1 }
              return { ...prev, month: prev.month + 1 }
            })
            setSelectedDay(1)
          }}
        />

        <AgendaSection
          dateLabel={dateLabel}
          events={selectedDayData.events}
          tasks={selectedDayData.tasks}
          onToggleTask={handleToggleTask}
          onOpenAdd={() => setIsAddModalOpen(true)}
          onDeleteEvent={handleDeleteEvent}
          onDeleteTask={handleDeleteTask}
          onEditEvent={handleEditEvent}
          onEditTask={handleEditTask}
        />
      </main>

      <AIInputBar onSubmit={handleAISubmit} isLoading={isAILoading} />

      {toastMessage && (
        <div className="fixed bottom-[80px] left-4 right-4 max-w-[608px] mx-auto z-50 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-4 shadow-lg border border-[#F2F2F7] dark:border-[#2C2C2E] flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center shrink-0">
              <Sparkles size={16} className="text-brand-blue" />
            </div>
            <div className="flex-1 mt-1 text-[14px] text-[#111111] dark:text-[#F2F2F7] leading-relaxed">
              {toastMessage}
            </div>
          </div>
        </div>
      )}

      <AddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddManual}
      />

      {/* Hidden button to go back to login for demo purposes */}
      <button
        onClick={async () => {
          const { createClient } = await import("@/lib/supabase/client")
          const supabase = createClient()
          await supabase.auth.signOut()
          setView("login")
        }}
        className="fixed top-4 right-4 text-xs font-medium text-red-500 hover:text-red-700 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-full transition-colors z-50"
        title="Sair da conta"
      >
        Sair
      </button>
    </div>
  )
}
