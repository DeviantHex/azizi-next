import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import { getStorage } from 'firebase-admin/storage'
import serviceAccount from '../../service-account.json'

const config = useRuntimeConfig()

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount as any),
    projectId: config.firebaseProjectId || config.public.firebaseProjectId,
    storageBucket: `${config.public.firebaseStorageBucket}`,
  })
}

export const db = getFirestore()
export const auth = getAuth()
export const storage = getStorage()