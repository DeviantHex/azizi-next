import { db } from '~/server/utils/firebase-admin'
import type { Blog, TeamMember } from '~/server/utils/types'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { id, uid } = query

  if (id && uid) {
    throw createError({ statusCode: 400, statusMessage: 'Both id and uid provided' })
  }
  if (!id && !uid) {
    throw createError({ statusCode: 400, statusMessage: 'No blog id or uid provided' })
  }

  if (id) {
    const blogRef = db.collection('blogs').doc(id as string)
    const blog = await blogRef.get()
    if (!blog.exists) {
      throw createError({ statusCode: 404, statusMessage: 'Blog not found' })
    }
    const data = { ...blog.data(), id: blog.id } as Blog
    const tmRef = db.collection('team').doc(data.createdBy)
    const tmSnap = await tmRef.get()
    if (tmSnap.exists) {
      data.createdBy = { ...tmSnap.data(), uid: tmSnap.id } as any
    }
    return { blog: data }
  }

  const { page, limit } = query
  let blogsRef = db.collection('blogs').where('createdBy', '==', uid as string) as any
  if (limit) blogsRef = blogsRef.limit(parseInt(limit as string))
  if (page) blogsRef = blogsRef.offset(parseInt(page as string) * (limit ? parseInt(limit as string) : 10))

  const creatorSnap = await db.collection('team').doc(uid as string).get()
  if (!creatorSnap.exists) {
    throw createError({ statusCode: 404, statusMessage: 'Team member not found' })
  }
  const teamData = { ...creatorSnap.data(), uid: creatorSnap.id } as TeamMember
  const blogs = await blogsRef.get()
  const data = blogs.docs.map(b => ({ ...b.data(), id: b.id, createdBy: teamData } as Blog))

  return { blogs: data }
})
