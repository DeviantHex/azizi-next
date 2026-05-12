import { db, auth } from '~/server/utils/firebase-admin'
import { phone } from 'phone'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password, passkey, name, title, description, education, phone: phoneNumber, photoUrl } = body

  const config = useRuntimeConfig()
  if (passkey !== config.passkey) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid passkey' })
  }

  if (!email || !password || !name || !title || !description || !phoneNumber || photoUrl === undefined) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
  }

  if (education && !Array.isArray(education)) {
    throw createError({ statusCode: 400, statusMessage: 'Education must be an array' })
  }

  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (!emailRegex.test(email.toLowerCase())) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid email' })
  }

  if (password.length < 6) {
    throw createError({ statusCode: 400, statusMessage: 'Password must be at least 6 characters' })
  }

  if (name.length < 2) {
    throw createError({ statusCode: 400, statusMessage: 'Name must be at least 2 characters' })
  }

  const number = phone(phoneNumber)
  if (!number || !number.isValid) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid phone number' })
  }

  const createPayload: any = {
    email,
    password,
    displayName: name,
    phoneNumber: number.phoneNumber,
  }
  if (photoUrl && photoUrl !== '') {
    createPayload.photoURL = photoUrl
  }

  const user = await auth.createUser(createPayload)
  const teamMember = {
    name,
    title,
    description,
    education: education ?? [],
    phone: number.phoneNumber,
    email,
    photoUrl,
  }
  await db.collection('team').doc(user.uid).set(teamMember)

  return { success: true, message: 'Team member registered', data: teamMember, uid: user.uid }
})
