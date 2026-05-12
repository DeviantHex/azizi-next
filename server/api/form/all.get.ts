import { db } from '~/server/utils/firebase-admin'
import type { Form } from '~/server/utils/types'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { page, limit } = query

  let formsRef = db.collection('forms').orderBy('createdDate', 'desc') as any
  if (limit) formsRef = formsRef.limit(parseInt(limit as string))
  if (page) formsRef = formsRef.offset(parseInt(page as string) * (limit ? parseInt(limit as string) : 10))

  const forms = await formsRef.get()
  const data = forms.docs.map(f => ({ ...f.data(), id: f.id } as Form))

  return { forms: data }
})
