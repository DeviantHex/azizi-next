import { db } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  const user = event.context.auth
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'No blog id provided' })
  }

  const blogRef = db.collection('blogs').doc(id as string)
  const blog = await blogRef.get()
  if (!blog.exists) {
    throw createError({ statusCode: 404, statusMessage: 'Blog not found' })
  }

  await blogRef.delete()

  return { message: 'Blog deleted' }
})
