import { db } from '~/server/utils/firebase-admin'
import type { TeamMember } from '~/server/utils/types'

export default defineEventHandler(async (event) => {
  const team = await db.collection('team').get()
  const data: TeamMember[] = []
  team.forEach(doc => data.push({ ...doc.data(), uid: doc.id } as TeamMember))
  return { data }
})
