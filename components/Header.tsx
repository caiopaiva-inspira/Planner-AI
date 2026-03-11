"use client"

import React from "react"
import { Sparkles, Moon, Sun } from "lucide-react"
import { useTheme } from "@/context/ThemeContext"

export default function Header() {
    const { theme, toggleTheme } = useTheme()

    return (
        <header className="fixed top-0 left-0 right-0 h-14 bg-white dark:bg-black z-50 flex items-center justify-between px-4 transition-all duration-200 ease-in-out shadow-[0_1px_3px_rgba(0,0,0,0.06)] dark:shadow-none dark:border-b dark:border-[#2C2C2E] max-w-[640px] mx-auto">
            <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-black dark:text-white" />
                <span className="font-bold text-black dark:text-white tracking-tight">Planner AI</span>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={toggleTheme}
                    className="text-black dark:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#1C1C1E] transition-colors"
                    aria-label="Toggle theme"
                >
                    {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-[#2C2C2E] flex items-center justify-center text-sm font-medium text-black dark:text-white overflow-hidden">
                    JD
                </div>
            </div>
        </header>
    )
}
