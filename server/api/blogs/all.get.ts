import { db } from '~/server/utils/firebase-admin'
import type { Blog, TeamMember } from '~/server/utils/types'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { page, limit, userData } = query

  let blogsRef = db.collection('blogs').orderBy('createdDate', 'desc') as any
  if (limit) blogsRef = blogsRef.limit(parseInt(limit as string))
  if (page) blogsRef = blogsRef.offset(parseInt(page as string) * (limit ? parseInt(limit as string) : 10))

  const blogs = await blogsRef.get()
  const data: Blog[] = []

  for (const blog of blogs.docs) {
    const blogData = { ...blog.data(), id: blog.id } as Blog
    if (userData === 'true' || userData === 'short') {
      const tmSnap = await db.collection('team').doc(blogData.createdBy as string).get()
      if (tmSnap.exists) {
        const tm = { ...tmSnap.data(), uid: tmSnap.id } as TeamMember
        blogData.createdBy = userData === 'short'
          ? { name: tm.name, photoUrl: tm.photoUrl } as any
          : tm as any
      }
    }
    data.push(blogData)
  }

  return { blogs: data }
})
