"use server"

import prisma from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"

// 1. Get and Sync User
export async function syncUser() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { user: null }
    }

    try {
        const dbUser = await prisma.user.upsert({
            where: { id: user.id },
            update: {},
            create: {
                id: user.id,
                email: user.email!,
            }
        })
        return { user: dbUser }
    } catch (error) {
        console.error("Error syncing user:", error)
        return { user: null }
    }
}

// 2. Fetch Data (by Year and Month to cover the Calendar logic)
export async function getMonthAgenda(year: number, month: number) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const dateKeyPrefix = `${year}-${String(month).padStart(2, "0")}`

    const events = await prisma.event.findMany({
        where: { userId: user.id, dateKey: { startsWith: dateKeyPrefix } },
        orderBy: { timeStart: "asc" }
    })

    const tasks = await prisma.task.findMany({
        where: { userId: user.id, dateKey: { startsWith: dateKeyPrefix } },
        orderBy: { createdAt: "asc" }
    })

    return { events, tasks }
}

// 3. Create Event
export async function createEvent(title: string, dateKey: string, timeStart: string, timeEnd: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    await syncUser()

    return await prisma.event.create({
        data: {
            title,
            timeStart,
            timeEnd,
            dateKey,
            userId: user.id,
        }
    })
}

// 4. Create Task
export async function createTask(title: string, dateKey: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    await syncUser()

    return await prisma.task.create({
        data: {
            title,
            dateKey,
            userId: user.id
        }
    })
}

// 5. Toggle Task completion
export async function toggleTaskComplete(taskId: string, completed: boolean) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    return await prisma.task.update({
        where: { id: taskId, userId: user.id },
        data: { completed }
    })
}

// 6. Delete Event
export async function deleteEvent(eventId: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    return await prisma.event.delete({
        where: { id: eventId, userId: user.id }
    })
}

// 7. Delete Task
export async function deleteTask(taskId: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    return await prisma.task.delete({
        where: { id: taskId, userId: user.id }
    })
}

// 8. Edit Event
export async function updateEvent(eventId: string, title: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    return await prisma.event.update({
        where: { id: eventId, userId: user.id },
        data: { title }
    })
}

// 9. Edit Task
export async function updateTask(taskId: string, title: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    return await prisma.task.update({
        where: { id: taskId, userId: user.id },
        data: { title }
    })
}
