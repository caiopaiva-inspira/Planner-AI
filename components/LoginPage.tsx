"use client"

import React, { useState } from "react"
import { Sparkles, Eye, EyeOff, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage({ onLogin }: { onLogin: () => void }) {
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isSignUp, setIsSignUp] = useState(false)

    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            if (isSignUp) {
                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                })
                if (signUpError) throw signUpError

                // If we get here, sign up was successful. In a real app we might show "check email" 
                // but if email confirmation is disabled it just works. Let's try logging them in or alerting.
                onLogin()
            } else {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (signInError) throw signInError
                onLogin()
            }
        } catch (err: any) {
            setError(err.message || "Ocorreu um erro ao tentar autenticar.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <div className="w-full max-w-[420px] bg-background">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-12 h-12 bg-black dark:bg-white rounded-xl flex items-center justify-center mb-4">
                        <Sparkles className="text-white dark:text-black" size={24} />
                    </div>
                    <h1 className="font-bold text-[32px] tracking-tight text-primary">Bem-vindo de volta</h1>
                    <p className="text-secondary mt-1">Acesse sua conta para continuar.</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block font-medium tracking-[0.08em] uppercase text-[11px] text-secondary mb-2">
                            E-mail
                        </label>
                        <input
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-transparent border-b border-gray-300 dark:border-[#2C2C2E] pb-2 text-primary focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                            required
                        />
                    </div>

                    <div className="relative">
                        <label className="block font-medium tracking-[0.08em] uppercase text-[11px] text-secondary mb-2">
                            Senha
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-transparent border-b border-gray-300 dark:border-[#2C2C2E] pb-2 text-primary focus:outline-none focus:border-black dark:focus:border-white transition-colors pr-10"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-0 bottom-2 text-secondary hover:text-primary transition-colors"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm mt-2 font-medium bg-red-500/10 p-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-[52px] flex items-center justify-center bg-black dark:bg-white text-white dark:text-black font-medium rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-70"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : (isSignUp ? "Criar Conta" : "Entrar")}
                    </button>
                </form>

                <div className="flex items-center justify-between mt-6 text-sm">
                    <button className="text-secondary underline hover:text-primary transition-colors" type="button">
                        Esqueceu a senha?
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setIsSignUp(!isSignUp)
                            setError(null)
                        }}
                        className="text-secondary underline hover:text-primary transition-colors"
                    >
                        {isSignUp ? "Já tenho uma conta" : "Criar conta"}
                    </button>
                </div>

                <div className="mt-10 mb-6 flex items-center">
                    <div className="flex-1 h-px bg-gray-200 dark:bg-[#2C2C2E]"></div>
                    <span className="px-4 text-[11px] font-medium tracking-[0.08em] uppercase text-secondary">
                        OU CONTINUE COM
                    </span>
                    <div className="flex-1 h-px bg-gray-200 dark:bg-[#2C2C2E]"></div>
                </div>

                <div className="flex flex-col gap-4">
                    <button className="h-[52px] w-full flex items-center justify-center gap-2 border border-gray-200 dark:border-[#2C2C2E] rounded-xl font-medium text-primary hover:bg-gray-50 dark:hover:bg-[#1C1C1E] transition-colors">
                        <span className="font-bold text-lg">G</span> Google
                    </button>
                </div>

                <div className="mt-12 text-center text-sm text-secondary">
                    © {new Date().getFullYear()} Planner AI Inc.
                </div>
            </div>
        </div>
    )
}
