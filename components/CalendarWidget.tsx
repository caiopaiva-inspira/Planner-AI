import React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CalendarProps {
    selectedDate: number
    onSelectDate: (day: number) => void
    dotsOnDays: number[]
    currentMonth: { month: number; year: number }
    onPrevMonth: () => void
    onNextMonth: () => void
}

const MONTH_NAMES = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
]

const WEEKDAYS = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"]

export default function CalendarWidget({
    selectedDate,
    onSelectDate,
    dotsOnDays,
    currentMonth,
    onPrevMonth,
    onNextMonth,
}: CalendarProps) {
    // Mock simple calendar generation for current month
    // In a real app we'd compute exactly how many days and starting weekday
    const daysInMonth = new Date(currentMonth.year, currentMonth.month, 0).getDate()
    const firstDay = new Date(currentMonth.year, currentMonth.month - 1, 1).getDay()

    const blanks = Array.from({ length: firstDay }, (_, i) => i)
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

    const isToday = (day: number) => {
        const today = new Date()
        return (
            day === today.getDate() &&
            currentMonth.month === today.getMonth() + 1 &&
            currentMonth.year === today.getFullYear()
        )
    }

    return (
        <div className="bg-white dark:bg-[#1C1C1E] rounded-[20px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] dark:shadow-none dark:border dark:border-[#2C2C2E]">
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={onPrevMonth}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-[#2C2C2E] rounded-lg transition-colors"
                >
                    <ChevronLeft size={20} className="text-[#111111] dark:text-white" />
                </button>
                <h2 className="font-bold text-[16px] text-[#111111] dark:text-white">
                    {MONTH_NAMES[currentMonth.month - 1]} {currentMonth.year}
                </h2>
                <button
                    onClick={onNextMonth}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-[#2C2C2E] rounded-lg transition-colors"
                >
                    <ChevronRight size={20} className="text-[#111111] dark:text-white" />
                </button>
            </div>

            <div className="grid grid-cols-7 gap-y-4 gap-x-1">
                {WEEKDAYS.map((day) => (
                    <div
                        key={day}
                        className="text-center font-medium tracking-[0.08em] uppercase text-[11px] text-[#8E8E93] dark:text-[#636366] mb-2"
                    >
                        {day}
                    </div>
                ))}

                {blanks.map((blank) => (
                    <div key={`blank-${blank}`} />
                ))}

                {days.map((day) => {
                    const selected = selectedDate === day
                    const hasDot = dotsOnDays.includes(day)
                    const today = isToday(day)

                    return (
                        <div key={day} className="flex flex-col items-center justify-center">
                            <button
                                onClick={() => onSelectDate(day)}
                                className={`w-10 h-10 rounded-[10px] flex items-center justify-center text-[15px] font-medium transition-all duration-200
                  ${selected
                                        ? "bg-black text-white dark:bg-white dark:text-black"
                                        : "text-[#111111] dark:text-[#F2F2F7] hover:bg-[#F2F2F7] dark:hover:bg-[#2C2C2E]"
                                    }
                  ${today && !selected ? "ring-1 ring-inset ring-brand-blue" : ""}
                `}
                            >
                                {day}
                            </button>
                            <div
                                className={`w-1 h-1 rounded-full mt-1 ${hasDot ? "bg-[#C7C7CC] dark:bg-[#636366]" : "bg-transparent"
                                    }`}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
