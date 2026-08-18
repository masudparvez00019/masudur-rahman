import { connectToDB } from "../mongodb"
import { TutorialTopic, TutorialContent } from "../models/tutorial"
import mongoose from "mongoose"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth-options"
import { remark } from "remark"
import remarkGfm from "remark-gfm"
import { toString } from "mdast-util-to-string"
import { visit } from "unist-util-visit"
import { unstable_cache } from "next/cache"

// Cache configurations
const CACHE_TAGS = {
  TOPICS: 'tutorial-topics',
  CONTENT: 'tutorial-content',
  TOPIC_WITH_TUTORIALS: 'topics-with-tutorials'
}

// Cache durations (in seconds)
const CACHE_REVALIDATE = {
  TOPICS: 3600, // 1 hour
  CONTENT: 1800, // 30 minutes
  LONG: 86400 // 24 hours
}

// Cached function to get tutorial topics
const getCachedTutorialTopics = unstable_cache(
  async (includeUnpublished: boolean = false) => {
    await connectToDB()

    const query = includeUnpublished ? {} : { isPublished: true }

    const topics = await TutorialTopic.find(query).sort({ order: 1 }).lean()

    // Count tutorials for each topic
    const topicsWithCount = await Promise.all(
      topics.map(async (topic) => {
        const tutorialQuery = includeUnpublished ? { topic: topic._id } : { topic: topic._id, isPublished: true }

        const count = await TutorialContent.countDocuments(tutorialQuery)
        return {
          ...topic,
          tutorialCount: count,
          _id: topic._id.toString(),
        }
      }),
    )

    return topicsWithCount
  },
  ['tutorial-topics'],
  {
    revalidate: CACHE_REVALIDATE.TOPICS,
    tags: [CACHE_TAGS.TOPICS]
  }
)

// Cached function to get topics with tutorials
const getCachedTopicsWithTutorials = unstable_cache(
  async (includeUnpublished: boolean = false) => {
    await connectToDB()

    const topicQuery = includeUnpublished ? {} : { isPublished: true }
    const topics = await TutorialTopic.find(topicQuery).sort({ order: 1 }).lean()

    const topicsWithTutorials = await Promise.all(
      topics.map(async (topic) => {
        const tutorialQuery = includeUnpublished ? { topic: topic._id } : { topic: topic._id, isPublished: true }

        const tutorials = await TutorialContent.find(tutorialQuery).sort({ order: 1 }).select("_id title slug").lean()

        return {
          ...topic,
          _id: topic._id.toString(),
          tutorials: tutorials.map((t) => ({
            ...t,
            _id: t._id.toString(),
          })),
        }
      }),
    )

    return topicsWithTutorials
  },
  ['topics-with-tutorials'],
  {
    revalidate: CACHE_REVALIDATE.TOPICS,
    tags: [CACHE_TAGS.TOPIC_WITH_TUTORIALS]
  }
)

// Topic Management
export async function getTutorialTopics(includeUnpublished = false) {
  return await getCachedTutorialTopics(includeUnpublished)
}

export async function getTopicsWithTutorials(includeUnpublished = false) {
  return await getCachedTopicsWithTutorials(includeUnpublished)
}

// Cache invalidation functions
export async function revalidateTutorialCache() {
  const { revalidateTag } = await import('next/cache')
  
  revalidateTag(CACHE_TAGS.TOPICS)
  revalidateTag(CACHE_TAGS.CONTENT)
  revalidateTag(CACHE_TAGS.TOPIC_WITH_TUTORIALS)
}

export async function getTutorialTopicBySlug(slug: string, includeUnpublished = false) {
  await connectToDB()

  const query = includeUnpublished ? { slug } : { slug, isPublished: true }

  const topic = await TutorialTopic.findOne(query).lean()

  if (!topic) return null

  return {
    ...topic,
    _id: topic._id.toString(),
  }
}

export async function createTutorialTopic(data: any, userId: string) {
  await connectToDB()

  // Check if slug already exists
  const existingTopic = await TutorialTopic.findOne({ slug: data.slug })
  if (existingTopic) {
    throw new Error("A topic with this slug already exists")
  }

  // Get the highest order value
  const highestOrder = await TutorialTopic.findOne({}).sort({ order: -1 }).select("order").lean()

  const order = highestOrder ? highestOrder.order + 1 : 0

  const topic = new TutorialTopic({
    ...data,
    order,
    createdBy: new mongoose.Types.ObjectId(userId),
  })

  await topic.save()
  return topic
}

export async function updateTutorialTopic(id: string, data: any) {
  await connectToDB()

  // Check if slug already exists for another topic
  if (data.slug) {
    const existingTopic = await TutorialTopic.findOne({
      slug: data.slug,
      _id: { $ne: id },
    })

    if (existingTopic) {
      throw new Error("A topic with this slug already exists")
    }
  }

  const topic = await TutorialTopic.findByIdAndUpdate(id, { $set: data }, { new: true })

  if (!topic) {
    throw new Error("Topic not found")
  }

  return topic
}

export async function deleteTutorialTopic(id: string) {
  await connectToDB()

  // Check if there are any tutorials under this topic
  const tutorialCount = await TutorialContent.countDocuments({ topic: id })
  if (tutorialCount > 0) {
    throw new Error("Cannot delete topic with existing tutorials")
  }

  const result = await TutorialTopic.findByIdAndDelete(id)
  if (!result) {
    throw new Error("Topic not found")
  }

  return { success: true }
}

export async function updateTopicOrder(topicIds: string[]) {
  await connectToDB()

  const updates = topicIds.map((id, index) => ({
    updateOne: {
      filter: { _id: id },
      update: { $set: { order: index } },
    },
  }))

  await TutorialTopic.bulkWrite(updates)
  return { success: true }
}

// Tutorial Content Management
export async function getTutorialsByTopic(topicId: string, includeUnpublished = false) {
  await connectToDB()

  const query = includeUnpublished ? { topic: topicId } : { topic: topicId, isPublished: true }

  const tutorials = await TutorialContent.find(query).sort({ order: 1 }).lean()

  return tutorials.map((tutorial) => ({
    ...tutorial,
    _id: tutorial._id.toString(),
    topic: tutorial.topic.toString(),
    createdBy: tutorial.createdBy.toString(),
    lastUpdatedBy: tutorial.lastUpdatedBy ? tutorial.lastUpdatedBy.toString() : undefined,
    previousTutorial: tutorial.previousTutorial ? tutorial.previousTutorial.toString() : undefined,
    nextTutorial: tutorial.nextTutorial ? tutorial.nextTutorial.toString() : undefined,
  }))
}

export async function getTutorialBySlug(topicSlug: string, tutorialSlug: string, includeUnpublished = false) {
  await connectToDB()

  const topic = await TutorialTopic.findOne({ slug: topicSlug })
  if (!topic) return null

  const query = includeUnpublished
    ? { topic: topic._id, slug: tutorialSlug }
    : { topic: topic._id, slug: tutorialSlug, isPublished: true }

  const tutorial = await TutorialContent.findOne(query).lean()

  if (!tutorial) return null

  // Get previous and next tutorials if they exist
  let previousTutorial = null
  let nextTutorial = null

  if (tutorial.previousTutorial) {
    previousTutorial = await TutorialContent.findById(tutorial.previousTutorial).select("title slug").lean()
  }

  if (tutorial.nextTutorial) {
    nextTutorial = await TutorialContent.findById(tutorial.nextTutorial).select("title slug").lean()
  }

  return {
    ...tutorial,
    _id: tutorial._id.toString(),
    topic: tutorial.topic.toString(),
    createdBy: tutorial.createdBy.toString(),
    lastUpdatedBy: tutorial.lastUpdatedBy ? tutorial.lastUpdatedBy.toString() : undefined,
    previousTutorial: previousTutorial
      ? {
          ...previousTutorial,
          _id: previousTutorial._id.toString(),
        }
      : null,
    nextTutorial: nextTutorial
      ? {
          ...nextTutorial,
          _id: nextTutorial._id.toString(),
        }
      : null,
  }
}

export async function createTutorial(data: any, userId: string) {
  await connectToDB()

  // Check if slug already exists for this topic
  const existingTutorial = await TutorialContent.findOne({
    topic: data.topic,
    slug: data.slug,
  })

  if (existingTutorial) {
    throw new Error("A tutorial with this slug already exists in this topic")
  }

  // Get the highest order value for this topic
  const highestOrder = await TutorialContent.findOne({ topic: data.topic }).sort({ order: -1 }).select("order").lean()

  const order = highestOrder ? highestOrder.order + 1 : 0

  // Calculate read time (rough estimate: 200 words per minute)
  const wordCount = data.content.split(/\s+/).length
  const readTime = Math.ceil(wordCount / 200)

  const tutorial = new TutorialContent({
    ...data,
    order,
    readTime,
    createdBy: new mongoose.Types.ObjectId(userId),
  })

  await tutorial.save()

  // Update previous and next tutorials if needed
  if (order > 0) {
    await updateTutorialNavigation(data.topic)
  }

  return tutorial
}

export async function updateTutorial(id: string, data: any, userId: string) {
  await connectToDB()

  // Check if slug already exists for another tutorial in this topic
  if (data.slug && data.topic) {
    const existingTutorial = await TutorialContent.findOne({
      topic: data.topic,
      slug: data.slug,
      _id: { $ne: id },
    })

    if (existingTutorial) {
      throw new Error("A tutorial with this slug already exists in this topic")
    }
  }

  // Calculate read time if content is updated
  if (data.content) {
    const wordCount = data.content.split(/\s+/).length
    data.readTime = Math.ceil(wordCount / 200)
  }

  // Set last updated by
  data.lastUpdatedBy = new mongoose.Types.ObjectId(userId)

  const tutorial = await TutorialContent.findByIdAndUpdate(id, { $set: data }, { new: true })

  if (!tutorial) {
    throw new Error("Tutorial not found")
  }

  // Update navigation if order changed
  if (data.order !== undefined) {
    await updateTutorialNavigation(tutorial.topic)
  }

  return tutorial
}

export async function deleteTutorial(id: string) {
  await connectToDB()

  const tutorial = await TutorialContent.findById(id)
  if (!tutorial) {
    throw new Error("Tutorial not found")
  }

  const topicId = tutorial.topic

  await tutorial.deleteOne()

  // Update navigation for remaining tutorials
  await updateTutorialNavigation(topicId)

  return { success: true }
}

export async function updateTutorialOrder(topicId: string, tutorialIds: string[]) {
  await connectToDB()

  const updates = tutorialIds.map((id, index) => ({
    updateOne: {
      filter: { _id: id },
      update: { $set: { order: index } },
    },
  }))

  await TutorialContent.bulkWrite(updates)

  // Update previous and next links
  await updateTutorialNavigation(topicId)

  return { success: true }
}

// Helper function to update previous and next links
async function updateTutorialNavigation(topicId: string) {
  const tutorials = await TutorialContent.find({ topic: topicId }).sort({ order: 1 }).select("_id").lean()

  const ids = tutorials.map((t) => t._id)

  // Update each tutorial with prev and next
  for (let i = 0; i < ids.length; i++) {
    const updates: any = {}

    if (i > 0) {
      updates.previousTutorial = ids[i - 1]
    } else {
      updates.previousTutorial = null
    }

    if (i < ids.length - 1) {
      updates.nextTutorial = ids[i + 1]
    } else {
      updates.nextTutorial = null
    }

    await TutorialContent.findByIdAndUpdate(ids[i], { $set: updates })
  }
}

// Extract table of contents from MDX content
export async function extractTableOfContents(content: string) {
  if (!content || typeof content !== 'string') {
    console.warn("Invalid content provided to extractTableOfContents:", content);
    return [];
  }

  try {
    const headings: Array<{ level: number; text: string; slug: string }> = [];

    const processor = remark()
      .use(remarkGfm)
      .use(() => {
        return (tree) => {
          visit(tree, 'heading', (node) => {
            const text = toString(node);
            // Generate slug directly (no need for rehype-slug)
            const slug = text
              .toLowerCase()
              .replace(/[^\w\s-]/g, '')  // Remove special chars except spaces and hyphens
              .trim()
              .replace(/\s+/g, '-');     // Replace spaces with hyphens

            headings.push({
              level: node.depth,
              text,
              slug,
            });
          });
        };
      });

    await processor.process(content);
    return headings;
  } catch (error) {
    console.error("Error extracting table of contents:", error);
    return [];
  }
}

// Search tutorials
export async function searchTutorials(query: string, includeUnpublished = false) {
  await connectToDB()

  const searchRegex = new RegExp(query, "i")

  const tutorialQuery = includeUnpublished
    ? {
        $or: [
          { title: searchRegex },
          { content: searchRegex },
          { metaDescription: searchRegex },
          { tags: searchRegex },
        ],
      }
    : {
        isPublished: true,
        $or: [
          { title: searchRegex },
          { content: searchRegex },
          { metaDescription: searchRegex },
          { tags: searchRegex },
        ],
      }

  const tutorials = await TutorialContent.find(tutorialQuery).sort({ order: 1 }).populate("topic", "title slug").lean()

  return tutorials.map((tutorial) => ({
    ...tutorial,
    _id: tutorial._id.toString(),
    topic:
      typeof tutorial.topic === "object"
        ? {
            _id: tutorial.topic._id.toString(),
            title: tutorial.topic.title,
            slug: tutorial.topic.slug,
          }
        : tutorial.topic.toString(),
    createdBy: tutorial.createdBy.toString(),
    lastUpdatedBy: tutorial.lastUpdatedBy ? tutorial.lastUpdatedBy.toString() : undefined,
  }))
}

// Check if user has admin access
export async function checkAdminAccess() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user || session.user.isAdmin !== true) {
    return false
  }
  return true
}


export async function getRecentTutorials(limit = 5, includeUnpublished = false) {
  await connectToDB()

  const query = includeUnpublished ? {} : { isPublished: true }

  const tutorials = await TutorialContent.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("topic", "title slug")
    .lean()

  return tutorials.map((tutorial) => ({
    ...tutorial,
    _id: tutorial._id.toString(),
    topic:
      typeof tutorial.topic === "object"
        ? {
            _id: tutorial.topic._id.toString(),
            title: tutorial.topic.title,
            slug: tutorial.topic.slug,
          }
        : tutorial.topic.toString(),
    createdBy: tutorial.createdBy.toString(),
    lastUpdatedBy: tutorial.lastUpdatedBy ? tutorial.lastUpdatedBy.toString() : undefined,
  }))
}
