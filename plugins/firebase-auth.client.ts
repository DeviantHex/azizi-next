export default defineNuxtPlugin({
  name: 'firebase-auth',
  parallel: true,
  async setup() {
    const { getAuth, onIdTokenChanged } = await import('firebase/auth' as string)
    const { getApp } = await import('firebase/app' as string)

    const userState = useState<any>('firebase-user', () => null)
    const loadingState = useState('firebase-loading', () => true)

    const app = getApp()
    const auth = getAuth(app)

    onIdTokenChanged(auth, (u: any) => {
      userState.value = u
      loadingState.value = false
    })

    return {
      provide: {
        auth,
      },
    }
  },
})
