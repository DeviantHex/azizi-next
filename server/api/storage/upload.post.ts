import { storage } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  const user = event.context.auth
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)
  const { file, filename, mimeType } = body

  if (!file || !filename) {
    throw createError({ statusCode: 400, statusMessage: 'No file provided' })
  }

  const buffer = Buffer.from(file, 'base64')
  const bucket = storage.bucket()
  const ref = bucket.file(filename)

  await ref.save(buffer, {
    metadata: { contentType: mimeType || 'application/octet-stream' },
  })

  const [url] = await ref.getSignedUrl({
    action: 'read',
    expires: '03-09-2491',
  })

  return { success: true, message: 'File uploaded successfully', urls: [url] }
})
