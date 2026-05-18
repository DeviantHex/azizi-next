import { storage } from '~/server/utils/firebase-admin'

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

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

  if (!mimeType || !ALLOWED_MIME_TYPES.has(mimeType)) {
    throw createError({ statusCode: 400, statusMessage: 'Unsupported file type' })
  }

  const buffer = Buffer.from(file, 'base64')
  if (buffer.byteLength > MAX_UPLOAD_BYTES) {
    throw createError({ statusCode: 413, statusMessage: 'File is too large' })
  }

  const bucket = storage.bucket()
  const safeFilename = filename.split('/').pop()?.replace(/[^a-zA-Z0-9._-]/g, '-')
  if (!safeFilename) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid filename' })
  }
  const ref = bucket.file(`uploads/${Date.now()}-${safeFilename}`)

  await ref.save(buffer, {
    metadata: { contentType: mimeType },
  })

  const [url] = await ref.getSignedUrl({
    action: 'read',
    expires: '03-09-2491',
  })

  return { success: true, message: 'File uploaded successfully', urls: [url] }
})
