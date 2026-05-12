import { db } from '~/server/utils/firebase-admin'
import { Timestamp } from 'firebase-admin/firestore'
import { sanitizeHtml } from '~/server/utils/sanitize'

export default defineEventHandler(async (event) => {
  const user = event.context.auth
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const query = getQuery(event)
  const { id } = query
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'No blog id provided' })
  }

  const blogRef = db.collection('blogs').doc(id as string)
  const blog = await blogRef.get()
  if (!blog.exists) {
    throw createError({ statusCode: 404, statusMessage: 'Blog not found' })
  }

  const body = await readBody(event)
  const { title, headerImg, content } = body

  if (!title && headerImg === undefined && !content) {
    throw createError({ statusCode: 400, statusMessage: 'No fields to update' })
  }

  const updateData: Record<string, any> = {}
  if (title) updateData.title = sanitizeHtml(title)
  if (headerImg !== undefined) updateData.headerImg = headerImg
  if (content) updateData.content = sanitizeHtml(content)
  updateData.updatedDate = Timestamp.now()

  await blogRef.update(updateData)

  return { message: 'Blog updated' }
})
