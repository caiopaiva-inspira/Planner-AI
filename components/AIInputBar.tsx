"use client"

import React from "react"
import { Sparkles, Send } from "lucide-react"

export default function AIInputBar({ onSubmit, isLoading }: { onSubmit: (text: string) => void, isLoading?: boolean }) {
    const [text, setText] = React.useState("")

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (!text.trim() || isLoading) return
        onSubmit(text)
        setText("")
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                // Allow shift+enter to add a new line natively in textarea
                return
            }
            // Just enter without shift submits
            e.preventDefault()
            handleSubmit()
        }
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#F5F5F7]/80 dark:bg-black/80 backdrop-blur-md z-40 max-w-[640px] mx-auto border-t border-transparent dark:border-[#2C2C2E]/50">
            <form
                onSubmit={handleSubmit}
                className="flex items-center bg-white dark:bg-[#1C1C1E] rounded-full p-[10px] pr-[12px] pl-[18px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-none dark:border dark:border-[#2C2C2E]"
            >
                <Sparkles size={16} className="text-[#8E8E93] dark:text-[#636366] shrink-0" />

                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    rows={1}
                    placeholder="Peça para a IA incluir ou alterar algo na agenda..."
                    className="flex-1 bg-transparent border-none outline-none px-3 text-[15px] text-[#111111] dark:text-[#F2F2F7] placeholder:text-[#8E8E93] dark:placeholder:text-[#636366] min-h-[40px] max-h-[120px] py-[10px] resize-none disabled:opacity-50"
                    style={{ scrollbarWidth: "none" }}
                    onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = "40px";
                        target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
                    }}
                />

                <button
                    type="submit"
                    disabled={!text.trim() || isLoading}
                    className="w-10 h-10 rounded-full bg-black dark:bg-white flex items-center justify-center shrink-0 disabled:opacity-50 transition-opacity"
                >
                    {isLoading ? (
                        <div className="w-4 h-4 rounded-full border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black animate-spin" />
                    ) : (
                        <Send size={18} className="text-white dark:text-black ml-0.5" />
                    )}
                </button>
            </form>
        </div>
    )
}
