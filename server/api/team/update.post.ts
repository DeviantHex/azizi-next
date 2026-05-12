import { auth, db } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  const user = event.context.auth
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const fields = await readBody(event)
  if (fields.uid) {
    throw createError({ statusCode: 400, statusMessage: 'Cannot update user id' })
  }

  const keysAllowed = ['name', 'email', 'description', 'phone', 'photoUrl', 'title', 'education']
  const disallowed = Object.keys(fields).filter(k => !keysAllowed.includes(k))
  if (disallowed.length) {
    throw createError({ statusCode: 400, statusMessage: `Cannot edit: ${disallowed.join(', ')}` })
  }

  const toUpdate: Record<string, any> = {}
  Object.keys(fields).forEach(k => {
    if (fields[k] !== undefined) toUpdate[k] = fields[k]
  })

  if (toUpdate.email) {
    if (!toUpdate.email.includes('@') || !toUpdate.email.includes('.')) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid email' })
    }
    await auth.updateUser(user.uid, { email: toUpdate.email })
  }
  if (toUpdate.phone) {
    if (!toUpdate.phone.startsWith('+')) {
      throw createError({ statusCode: 400, statusMessage: 'Incorrect phone format' })
    }
    if (toUpdate.phone.length < 6) {
      throw createError({ statusCode: 400, statusMessage: 'Phone must be at least 6 characters' })
    }
    await auth.updateUser(user.uid, { phoneNumber: toUpdate.phone })
  }
  if (toUpdate.name) {
    if (toUpdate.name.length < 2) {
      throw createError({ statusCode: 400, statusMessage: 'Name must be at least 2 characters' })
    }
    await auth.updateUser(user.uid, { displayName: toUpdate.name })
  }
  if (toUpdate.photoUrl) {
    if (toUpdate.photoUrl === '') {
      throw createError({ statusCode: 400, statusMessage: 'Photo URL cannot be empty' })
    }
    await auth.updateUser(user.uid, { photoURL: toUpdate.photoUrl })
  }

  await db.collection('team').doc(user.uid).update(toUpdate)

  return { message: 'Team member updated', updatedKeys: Object.keys(toUpdate) }
})
