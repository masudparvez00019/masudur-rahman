// Define types of events we want to track
export enum EventType {
    PAGE_VIEW = "page_view",
    COURSE_VIEW = "course_view",
    LESSON_VIEW = "lesson_view",
    QUIZ_ATTEMPT = "quiz_attempt",
    ENROLLMENT = "enrollment",
    PAYMENT = "payment",
    BLOG_VIEW = "blog_view",
    PROJECT_VIEW = "project_view",
    TUTORIAL_VIEW = "tutorial_view",
    CHAT_INTERACTION = "chat_interaction",
    DOWNLOAD = "download",
    SEARCH = "search",
    USER_REGISTRATION = "user_registration",
    USER_LOGIN = "user_login",
  }
  
  export type ResourceType =
    | "course"
    | "lesson"
    | "quiz"
    | "blog"
    | "project"
    | "tutorial"
    | "chat"
    | "user"
    | "search"
    | "other"
  
  export interface AnalyticsEvent {
    eventType: EventType
    userId?: string
    resourceId?: string
    resourceType?: ResourceType
    metadata?: Record<string, any>
    userAgent?: string
    ipAddress?: string
    referrer?: string
    path?: string
    createdAt?: Date
  }
  
  export interface EventCount {
    eventType: string
    count: number
  }
  
  export interface DailyCount {
    date: string
    count: number
  }
  
  export interface UserStats {
    activeUsers: number
    newUsers: number
    dailyActiveUsers: DailyCount[]
  }
  
  export interface RevenueStats {
    totalRevenue: number
    dailyRevenue: {
      date: string
      amount: number
    }[]
  }
  
  export interface ResourceStats {
    topResources: {
      id: string
      title: string
      type: string
      views: number
    }[]
  }
  
  export interface AnalyticsOverview {
    eventCounts: EventCount[]
    userStats: UserStats
    revenueStats: RevenueStats
  }
  