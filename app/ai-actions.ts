"use server"

import { generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"
import { createEvent, createTask, updateEvent, updateTask, deleteEvent, deleteTask, toggleTaskComplete } from "./actions"

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})



export async function processAIText(text: string, currentYear: number, currentMonth: number, currentDay: number, agendaContextText: string) {
  const dataAtualStr = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(currentDay).padStart(2, "0")}`
  
  try {
    const { text: responseText } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt: `
        Você é um assistente de produtividade. Retorne EXATAMENTE um objeto JSON válido e nada mais. Não inclua blocos de markdown ou crases.
        Schema esperado:
        {
          "action": "create" | "update" | "delete" | "complete",
          "type": "event" | "task",
          "id": "string (opcional)",
          "title": "string (opcional)",
          "dateKey": "string YYYY-MM-DD (opcional)",
          "timeStart": "string HH:mm (opcional)",
          "timeEnd": "string HH:mm (opcional)"
        }

        Data atual de hoje: ${dataAtualStr}.
        
        O usuário digitou o seguinte: "${text}"
        
        Contexto dos itens atuais na agenda do usuário:
        ${agendaContextText}
        
        Instruções:
        - Para criar: defina action="create". Preencha title e dateKey. Se for "event", tente extrair timeStart.
        - Para editar: defina action="update". Descubra o "id" correto do item no contexto acima pelo título, e retorne o ID e o novo "title".
        - Para apagar/cancelar: defina action="delete". Encontre o "id" no contexto.
        - Para concluir/marcar feito: defina action="complete". Encontre o "id" no contexto.
      `,
    })

    const cleanText = responseText.replace(/```json/g, "").replace(/```/g, "").trim()
    const object = JSON.parse(cleanText)

    if (object.action === "create") {
      if (!object.title || !object.dateKey) return { success: false, message: "Faltam título ou data para criar." }
      if (object.type === "event") {
        const start = object.timeStart || "12:00"
        const end = object.timeEnd || "13:00"
        await createEvent(object.title, object.dateKey, start, end)
        return { success: true, message: `Evento "${object.title}" criado com sucesso!` }
      } else {
        await createTask(object.title, object.dateKey)
        return { success: true, message: `Tarefa "${object.title}" criada com sucesso!` }
      }
    } 
    else if (object.action === "update") {
      if (!object.id || !object.title) return { success: false, message: "ID ou novo título não encontrados."}
      if (object.type === "event") {
        await updateEvent(object.id, object.title)
      } else {
        await updateTask(object.id, object.title)
      }
      return { success: true, message: `Item atualizado para "${object.title}".` }
    }
    else if (object.action === "delete") {
      if (!object.id) return { success: false, message: "Não encontrei o item na sua agenda para apagar."}
      if (object.type === "event") {
        await deleteEvent(object.id)
      } else {
        await deleteTask(object.id)
      }
      return { success: true, message: "Item apagado da agenda." }
    }
    else if (object.action === "complete") {
      if (!object.id) return { success: false, message: "Não encontrei a tarefa para concluir."}
      if (object.type === "task") {
        await toggleTaskComplete(object.id, true)
        return { success: true, message: "Tarefa marcada como concluída!" }
      }
      return { success: false, message: "Apenas tarefas podem ser concluídas." }
    }

    return { success: false, message: "Ação não compreendida pela IA." }
  } catch (error) {
    console.error("AI Error:", error)
    return { success: false, message: "Não foi possível processar a mensagem. Tente novamente." }
  }
}
