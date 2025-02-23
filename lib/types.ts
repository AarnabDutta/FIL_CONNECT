export type User = {
  id: string
  username: string
  email: string
  status: "active" | "warned" | "blocked"
  reportCount: number
  createdAt: Date
}

export type Post = {
  id: string
  userId: string
  title: string
  content: string
  status: "pending" | "approved" | "rejected"
  createdAt: Date
  author: {
    username: string
    email: string
  }
}

export type Report = {
  id: string
  targetType: "post" | "comment" | "user"
  targetId: string
  reporterId: string
  reason: string
  status: "pending" | "resolved" | "dismissed"
  createdAt: Date
  reporter: {
    username: string
  }
  target: {
    username?: string
    title?: string
  }
}

