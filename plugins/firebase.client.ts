import { getApps, initializeApp } from 'firebase/app'
import { getAuth, onIdTokenChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'

export default defineNuxtPlugin({
  name: 'firebase-client',
  setup() {
    const config = useRuntimeConfig().public

    const app = getApps()[0] || initializeApp({
      apiKey: config.firebaseApiKey,
      authDomain: config.firebaseAuthDomain,
      projectId: config.firebaseProjectId,
      storageBucket: config.firebaseStorageBucket,
      messagingSenderId: config.firebaseMessagingSenderId,
      appId: config.firebaseAppId,
      measurementId: config.firebaseMeasurementId,
    })

    const userState = useState<any>('firebase-user', () => null)
    const loadingState = useState('firebase-loading', () => true)
    const fbAuth = getAuth(app)

    onIdTokenChanged(fbAuth, (u: any) => {
      userState.value = u
      loadingState.value = false
      if (u) {
        u.getIdToken().then((token: string) => {
          $fetch('/api/auth/session', {
            method: 'POST',
            body: { idToken: token },
          })
        })
      } else {
        $fetch('/api/auth/logout', { method: 'POST' })
      }
    })

    return {
      provide: {
        fbAuth,
        fbSignIn: signInWithEmailAndPassword,
        fbSignOut: signOut,
      },
    }
  },
})
