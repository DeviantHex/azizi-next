import { auth } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname
  const method = event.method

  const publicGetPaths = [
    '/api/blogs',
    '/api/blogs/all',
    '/api/team',
    '/api/team/all',
    '/api/form/send',
    '/api/auth/login',
    '/api/auth/logout',
    '/api/auth/session',
    '/api',
  ]

  for (const p of publicGetPaths) {
    if (path === p || path.startsWith(p + '/')) {
      const isWriteMethod = method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE'
      const isBlogApi = path.startsWith('/api/blogs')
      const isFormReadApi = path.startsWith('/api/form') && path !== '/api/form/send'
      const isTeamApi = path.startsWith('/api/team')
      if (isFormReadApi) {
        break
      }
      if (!isWriteMethod || (!isBlogApi && !isTeamApi)) {
        return
      }
    }
  }

  if (!path.startsWith('/api/')) {
    return
  }

  const cookieToken = getCookie(event, '__session')
  const headerToken = getHeader(event, 'authorization')?.replace('Bearer ', '')

  if (!cookieToken && !headerToken) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  try {
    const decoded = await auth.verifyIdToken(cookieToken || headerToken!)
    event.context.auth = decoded
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
})
