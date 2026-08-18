import { revalidateTag } from 'next/cache'

// Cache invalidation utility for tutorials
export async function invalidateTutorialCache() {
  // Revalidate all tutorial-related cache tags
  revalidateTag('tutorial-topics')
  revalidateTag('tutorial-content')
  revalidateTag('topics-with-tutorials')
}

// Cache invalidation for specific operations
export async function invalidateTopicsCache() {
  revalidateTag('tutorial-topics')
  revalidateTag('topics-with-tutorials')
}

export async function invalidateContentCache() {
  revalidateTag('tutorial-content')
}
