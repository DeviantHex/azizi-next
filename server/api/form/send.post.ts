import { phone } from 'phone'
import { db } from '~/server/utils/firebase-admin'
import { Timestamp } from 'firebase-admin/firestore'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, phone: phoneNumber, email, caseDescription, token } = body

  const config = useRuntimeConfig()
  const resp: any = await $fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    body: `secret=${config.recaptchaSecretKey}&response=${token}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  if (!resp.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid reCAPTCHA' })
  }

  if (!name || !phoneNumber || !email) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
  }

  if (name.trim().length < 2) {
    throw createError({ statusCode: 400, statusMessage: 'Name is too short' })
  }

  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (!emailRegex.test(email.toLowerCase())) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid email' })
  }

  const number = phone(phoneNumber)
  if (!number || !number.isValid) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid phone number' })
  }

  await db.collection('mail').add({
    to: 'aa@theazizifirm.com',
    message: {
      subject: `New form submission from ${name}`,
      text: `Name: ${name}\nPhone: ${phoneNumber}\nEmail: ${email}\nCase Description: ${caseDescription || ''}`,
    },
  })

  await db.collection('forms').add({
    name,
    phone: phoneNumber,
    email,
    caseDescription: caseDescription || '',
    createdDate: Timestamp.now(),
  })

  return { message: 'Form created' }
})
