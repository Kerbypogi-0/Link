export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: number
          title: string
          description: string
          image_url: string
          points: number
          link: string
          conditions: string[]
          section: string
          sort_order: number
        }
        Insert: {
          id?: number
          title: string
          description: string
          image_url: string
          points: number
          link: string
          conditions: string[]
          section: string
          sort_order: number
        }
        Update: {
          id?: number
          title?: string
          description?: string
          image_url?: string
          points?: number
          link?: string
          conditions?: string[]
          section?: string
          sort_order?: number
        }
      }
      users: {
        Row: {
          id: string
          username: string
          points: number
          completed_tasks: number[]
        }
        Insert: {
          id: string
          username: string
          points?: number
          completed_tasks?: number[]
        }
        Update: {
          id?: string
          username?: string
          points?: number
          completed_tasks?: number[]
        }
      }
    }
  }
}