import { EventType } from "./types/analytics"

// Client-side analytics utility
export const Analytics = {
  // Track a generic event
  trackEvent: async (eventType: EventType, data: any = {}) => {
    try {
      await fetch("/api/analytics/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventType,
          ...data,
        }),
      })
    } catch (error) {
      console.error("Error tracking event:", error)
    }
  },

  // Helper methods for common events
  trackPageView: (path: string) => {
    return Analytics.trackEvent(EventType.PAGE_VIEW, { path })
  },

  trackCourseView: (courseId: string) => {
    return Analytics.trackEvent(EventType.COURSE_VIEW, {
      resourceId: courseId,
      resourceType: "course",
    })
  },

  trackLessonView: (lessonId: string) => {
    return Analytics.trackEvent(EventType.LESSON_VIEW, {
      resourceId: lessonId,
      resourceType: "lesson",
    })
  },

  trackQuizAttempt: (quizId: string, score: number) => {
    return Analytics.trackEvent(EventType.QUIZ_ATTEMPT, {
      resourceId: quizId,
      resourceType: "quiz",
      metadata: { score },
    })
  },

  trackEnrollment: (courseId: string) => {
    return Analytics.trackEvent(EventType.ENROLLMENT, {
      resourceId: courseId,
      resourceType: "course",
    })
  },

  trackPayment: (courseId: string, amount: number) => {
    return Analytics.trackEvent(EventType.PAYMENT, {
      resourceId: courseId,
      resourceType: "course",
      metadata: { amount },
    })
  },

  trackBlogView: (blogId: string) => {
    return Analytics.trackEvent(EventType.BLOG_VIEW, {
      resourceId: blogId,
      resourceType: "blog",
    })
  },

  trackProjectView: (projectId: string) => {
    return Analytics.trackEvent(EventType.PROJECT_VIEW, {
      resourceId: projectId,
      resourceType: "project",
    })
  },

  trackTutorialView: (tutorialId: string) => {
    return Analytics.trackEvent(EventType.TUTORIAL_VIEW, {
      resourceId: tutorialId,
      resourceType: "tutorial",
    })
  },

  trackSearch: (query: string) => {
    return Analytics.trackEvent(EventType.SEARCH, {
      resourceType: "search",
      metadata: { query },
    })
  },
}
