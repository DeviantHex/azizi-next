import { db } from '~/server/utils/firebase-admin'
import type { Form } from '~/server/utils/types'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { id } = query
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'No form id provided' })
  }

  const formRef = db.collection('forms').doc(id as string)
  const form = await formRef.get()
  if (!form.exists) {
    throw createError({ statusCode: 404, statusMessage: 'Form not found' })
  }

  return { form: { ...form.data(), id: form.id } as Form }
})
