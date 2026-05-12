export const useAuth = () => {
  const user = useState<any>('firebase-user', () => null)
  const loading = useState('firebase-loading', () => true)
  const nuxtApp = useNuxtApp()

  const login = async (email: string, password: string) => {
    const auth = nuxtApp.$fbAuth as any
    const signIn = nuxtApp.$fbSignIn as any
    const cred = await signIn(auth, email, password)
    const token = await cred.user.getIdToken()
    await $fetch('/api/auth/session', {
      method: 'POST',
      body: { idToken: token },
    })
    return cred
  }

  const logout = async () => {
    const auth = nuxtApp.$fbAuth as any
    const signOut = nuxtApp.$fbSignOut as any
    await signOut(auth)
    await $fetch('/api/auth/logout', { method: 'POST' })
    await navigateTo('/')
  }

  return { user, loading, login, logout }
}
