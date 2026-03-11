export type CalendarDot = { date: number }

export type Event = {
  id: string
  title: string
  timeStart: string
  timeEnd: string
  location: string
  icon: "calendar" | "gym"
}

export type Task = {
  id: string
  title: string
  completed: boolean
}

export type DayData = {
  events: Event[]
  tasks: Task[]
}

export type AgendaData = Record<string, DayData>

export const initialMockData: AgendaData = {
  "2024-03-04": {
    events: [
      {
        id: "e1",
        title: "Reunião de Alinhamento",
        timeStart: "09:00",
        timeEnd: "10:00",
        location: "Google Meet",
        icon: "calendar",
      },
    ],
    tasks: [
      { id: "t1", title: "Responder emails pendentes", completed: true },
      { id: "t2", title: "Preparar pauta da reunião", completed: false },
    ],
  },
  "2024-03-05": {
    events: [
      {
        id: "e2",
        title: "Reunião de Design System",
        timeStart: "14:00",
        timeEnd: "15:00",
        location: "Google Meet",
        icon: "calendar",
      },
      {
        id: "e3",
        title: "Treino Upper Body",
        timeStart: "18:30",
        timeEnd: "20:00",
        location: "Academia Smart",
        icon: "gym",
      },
    ],
    tasks: [
      { id: "t3", title: "Finalizar protótipo do dashboard", completed: true },
      { id: "t4", title: "Revisar documentação do Design System", completed: false },
      { id: "t5", title: "Comprar suplementos", completed: false },
    ],
  },
  "2024-03-07": {
    events: [
      {
        id: "e4",
        title: "Check-in de Projeto",
        timeStart: "14:30",
        timeEnd: "15:30",
        location: "Zoom",
        icon: "calendar",
      },
    ],
    tasks: [{ id: "t6", title: "Enviar relatório semanal", completed: false }],
  },
  "2024-03-11": {
    events: [],
    tasks: [{ id: "t7", title: "Planejamento da sprint", completed: false }],
  },
  "2024-03-19": {
    events: [
      {
        id: "e5",
        title: "Apresentação de Resultados",
        timeStart: "10:00",
        timeEnd: "11:30",
        location: "Google Meet",
        icon: "calendar",
      },
    ],
    tasks: [{ id: "t8", title: "Revisar slides da apresentação", completed: false }],
  },
}
