import { db } from '~/server/utils/firebase-admin'
import { sanitizeHtml } from '~/server/utils/sanitize'
import { Timestamp } from 'firebase-admin/firestore'

export default defineEventHandler(async (event) => {
  const user = event.context.auth
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)
  const { title, headerImg, content } = body

  if (!title || headerImg === undefined || !content) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
  }

  const sanitizedContent = sanitizeHtml(content)
  const sanitizedTitle = sanitizeHtml(title)

  const blog = {
    title: sanitizedTitle,
    content: sanitizedContent,
    headerImg,
    createdBy: user.uid,
    createdDate: Timestamp.now(),
    updatedDate: Timestamp.now(),
  }

  const result = await db.collection('blogs').add(blog)

  return { message: 'Blog created', id: result.id }
})
