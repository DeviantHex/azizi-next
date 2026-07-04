import { phone } from 'phone'
import { db } from '~/server/utils/firebase-admin'
import { Timestamp } from 'firebase-admin/firestore'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, phone: phoneNumber, email, caseDescription, token } = body

  const config = useRuntimeConfig()

  if (!name || !phoneNumber || !email) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
  }

  const cleanName = String(name).trim().slice(0, 120)
  const cleanEmail = String(email).trim().slice(0, 254)
  const cleanDescription = String(caseDescription || '').trim().slice(0, 4000)

  if (cleanName.length < 2) {
    throw createError({ statusCode: 400, statusMessage: 'Name is too short' })
  }

  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (!emailRegex.test(cleanEmail.toLowerCase())) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid email' })
  }

  const number = phone(phoneNumber)
  if (!number || !number.isValid) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid phone number' })
  }

  await db.collection('mail').add({
    to: 'aa@theazizifirm.com',
    message: {
      subject: `New form submission from ${cleanName}`,
      text: `Name: ${cleanName}\nPhone: ${number.phoneNumber}\nEmail: ${cleanEmail}\nCase Description: ${cleanDescription}`,
    },
  })

  await db.collection('forms').add({
    name: cleanName,
    phone: number.phoneNumber,
    email: cleanEmail,
    caseDescription: cleanDescription,
    createdDate: Timestamp.now(),
  })

  return { message: 'Form created' }
})
