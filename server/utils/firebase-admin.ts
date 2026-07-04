import { cert, getApps, initializeApp, applicationDefault } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import { getStorage } from 'firebase-admin/storage'

const config = useRuntimeConfig()

if (!getApps().length) {
  const appConfig: any = {
    projectId: config.firebaseProjectId || config.public.firebaseProjectId,
    storageBucket: `${config.public.firebaseStorageBucket}`,
  }

  if (config.firebaseServiceAccount) {
    try {
      const serviceAccount = JSON.parse(config.firebaseServiceAccount)
      appConfig.credential = cert(serviceAccount)
    } catch {
      appConfig.credential = applicationDefault()
    }
  } else {
    appConfig.credential = applicationDefault()
  }

  initializeApp(appConfig)
}

export const db = getFirestore()
export const auth = getAuth()
export const storage = getStorage()
