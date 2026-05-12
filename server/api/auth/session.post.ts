export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { idToken } = body

  if (!idToken) {
    throw createError({ statusCode: 400, statusMessage: 'Missing idToken' })
  }

  setCookie(event, '__session', idToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 14,
    path: '/',
  })

  return { success: true }
})
