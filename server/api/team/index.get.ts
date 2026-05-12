import { db } from '~/server/utils/firebase-admin'
import type { TeamMember } from '~/server/utils/types'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { uid } = query

  if (!uid) {
    throw createError({ statusCode: 400, statusMessage: 'No user id provided' })
  }

  const ref = db.collection('team').doc(uid as string)
  const snap = await ref.get()
  if (!snap.exists) {
    throw createError({ statusCode: 404, statusMessage: 'Team member not found' })
  }

  return { data: { ...snap.data(), uid: snap.id } as TeamMember }
})
