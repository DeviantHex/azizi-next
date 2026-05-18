<template>
  <main class="admin-shell">
    <section class="admin-hero" aria-labelledby="admin-title">
      <div>
        <p class="eyebrow">The Azizi Firm</p>
        <h1 id="admin-title">Admin Command Center</h1>
        <p class="hero-copy">Publish insight, review new case leads, and keep attorney profiles current from one secured workspace.</p>
      </div>
      <div class="hero-card" aria-live="polite">
        <span>Signed In</span>
        <strong>{{ user?.email || 'Loading…' }}</strong>
        <VBtn variant="outlined" color="white" :loading="loading" @click="logout">Logout</VBtn>
      </div>
    </section>

    <VContainer class="admin-panel">
      <VAlert v-if="pageError" class="mb-4" type="error" variant="tonal" closable @click:close="pageError = ''">
        {{ pageError }}
      </VAlert>

      <VRow class="metric-row">
        <VCol cols="12" md="4">
          <VSheet class="metric-card" rounded="xl">
            <span>Published Articles</span>
            <strong>{{ blogs.length }}</strong>
          </VSheet>
        </VCol>
        <VCol cols="12" md="4">
          <VSheet class="metric-card accent" rounded="xl">
            <span>Client Leads</span>
            <strong>{{ leads.length }}</strong>
          </VSheet>
        </VCol>
        <VCol cols="12" md="4">
          <VSheet class="metric-card" rounded="xl">
            <span>Team Profiles</span>
            <strong>{{ team.length }}</strong>
          </VSheet>
        </VCol>
      </VRow>

      <VCard class="workspace-card" rounded="xl">
        <VTabs v-model="tab" class="admin-tabs" color="primary" show-arrows>
          <VTab value="blogs">Blogs</VTab>
          <VTab value="leads">Leads</VTab>
          <VTab value="profile">My Profile</VTab>
          <VTab value="team">Add Team</VTab>
        </VTabs>

        <VWindow v-model="tab">
          <VWindowItem value="blogs">
            <section class="workspace-section" aria-labelledby="blogs-heading">
              <div class="section-heading">
                <div>
                  <p class="eyebrow">Content Desk</p>
                  <h2 id="blogs-heading">Blog Manager</h2>
                </div>
                <VBtn color="primary" :loading="savingBlog" @click="submitBlog">{{ editingBlogId ? 'Save Blog' : 'Post Blog' }}</VBtn>
              </div>

              <VRow>
                <VCol cols="12" lg="7">
                  <VForm class="editor-form" @submit.prevent="submitBlog">
                    <VTextField v-model="blogForm.title" label="Title" name="blog-title" autocomplete="off" :rules="[required]" />
                    <VFileInput v-model="blogForm.imageFile" accept="image/*" label="Header Image" name="blog-image" :rules="editingBlogId ? [] : [requiredFile]" />
                    <VTextField v-model="blogForm.headerImg" label="Existing Image URL" name="blog-image-url" type="url" autocomplete="off" hint="Used when editing without uploading a replacement image." persistent-hint />
                    <ClientOnly><LazyTextEditor v-model="blogForm.content" /></ClientOnly>
                    <div class="form-actions">
                      <VBtn type="submit" color="primary" :loading="savingBlog">{{ editingBlogId ? 'Save Blog' : 'Post Blog' }}</VBtn>
                      <VBtn v-if="editingBlogId" variant="text" @click="resetBlogForm">Cancel Edit</VBtn>
                    </div>
                  </VForm>
                </VCol>
                <VCol cols="12" lg="5">
                  <div v-if="loadingBlogs" class="empty-state">Loading articles…</div>
                  <div v-else-if="!blogs.length" class="empty-state">No articles yet. Publish the first firm update.</div>
                  <VList v-else class="admin-list" lines="three">
                    <VListItem v-for="blog in blogs" :key="blog.id" class="admin-list-item">
                      <template #prepend>
                        <VAvatar rounded="lg" size="64"><VImg :src="blog.headerImg" alt="Blog header image" /></VAvatar>
                      </template>
                      <VListItemTitle>{{ blog.title }}</VListItemTitle>
                      <VListItemSubtitle>{{ formatDate(blog.createdDate) }}</VListItemSubtitle>
                      <template #append>
                        <div class="list-actions">
                          <VBtn size="small" variant="tonal" @click="editBlog(blog)">Edit</VBtn>
                          <VBtn size="small" color="error" variant="tonal" :loading="deletingBlogId === blog.id" @click="deleteBlog(blog)">Delete</VBtn>
                        </div>
                      </template>
                    </VListItem>
                  </VList>
                </VCol>
              </VRow>
            </section>
          </VWindowItem>

          <VWindowItem value="leads">
            <section class="workspace-section" aria-labelledby="leads-heading">
              <div class="section-heading">
                <div>
                  <p class="eyebrow">Intake</p>
                  <h2 id="leads-heading">Contact Submissions</h2>
                </div>
                <VBtn variant="outlined" :loading="loadingLeads" @click="fetchLeads">Refresh Leads</VBtn>
              </div>
              <div v-if="loadingLeads" class="empty-state">Loading leads…</div>
              <div v-else-if="!leads.length" class="empty-state">No contact submissions are available.</div>
              <VExpansionPanels v-else class="lead-panels" variant="accordion">
                <VExpansionPanel v-for="lead in leads" :key="lead.id">
                  <VExpansionPanelTitle>
                    <div class="lead-title">
                      <strong>{{ lead.name }}</strong>
                      <span>{{ lead.email }} · {{ lead.phone }}</span>
                    </div>
                    <span class="lead-date">{{ formatDate(lead.createdDate) }}</span>
                  </VExpansionPanelTitle>
                  <VExpansionPanelText>
                    <p>{{ lead.caseDescription || 'No case description provided.' }}</p>
                    <div class="lead-actions">
                      <VBtn :href="`mailto:${lead.email}`" color="primary" variant="tonal">Email Lead</VBtn>
                      <VBtn :href="`tel:${lead.phone}`" variant="outlined">Call Lead</VBtn>
                    </div>
                  </VExpansionPanelText>
                </VExpansionPanel>
              </VExpansionPanels>
            </section>
          </VWindowItem>

          <VWindowItem value="profile">
            <section class="workspace-section narrow" aria-labelledby="profile-heading">
              <div class="section-heading">
                <div>
                  <p class="eyebrow">Attorney Record</p>
                  <h2 id="profile-heading">My Profile</h2>
                </div>
                <VBtn color="primary" :loading="savingProfile" @click="saveProfile">Save Profile</VBtn>
              </div>
              <VForm class="editor-form" @submit.prevent="saveProfile">
                <VTextField v-model="profileForm.name" label="Name" name="profile-name" autocomplete="name" />
                <VTextField v-model="profileForm.title" label="Title" name="profile-title" autocomplete="organization-title" />
                <VTextField v-model="profileForm.email" label="Email" name="profile-email" type="email" autocomplete="email" />
                <VTextField v-model="profileForm.phone" label="Phone" name="profile-phone" type="tel" autocomplete="tel" />
                <VTextField v-model="profileForm.photoUrl" label="Photo URL" name="profile-photo" type="url" autocomplete="off" />
                <VTextarea v-model="profileForm.description" label="Description" name="profile-description" autocomplete="off" rows="5" />
                <VCombobox v-model="profileForm.education" label="Education" name="profile-education" multiple chips autocomplete="off" hint="Press Enter after each credential." persistent-hint />
                <VBtn type="submit" color="primary" :loading="savingProfile">Save Profile</VBtn>
              </VForm>
            </section>
          </VWindowItem>

          <VWindowItem value="team">
            <section class="workspace-section narrow" aria-labelledby="team-heading">
              <div class="section-heading">
                <div>
                  <p class="eyebrow">Access</p>
                  <h2 id="team-heading">Add Team Member</h2>
                </div>
                <VBtn color="primary" :loading="creatingTeam" @click="createTeamMember">Create Member</VBtn>
              </div>
              <VForm class="editor-form" @submit.prevent="createTeamMember">
                <VTextField v-model="teamForm.passkey" label="Registration Passkey" name="team-passkey" type="password" autocomplete="off" :rules="[required]" />
                <VTextField v-model="teamForm.name" label="Name" name="team-name" autocomplete="name" :rules="[required]" />
                <VTextField v-model="teamForm.title" label="Title" name="team-title" autocomplete="organization-title" :rules="[required]" />
                <VTextField v-model="teamForm.email" label="Email" name="team-email" type="email" autocomplete="email" :rules="[required]" />
                <VTextField v-model="teamForm.password" label="Temporary Password" name="team-password" type="password" autocomplete="new-password" :rules="[required]" />
                <VTextField v-model="teamForm.phone" label="Phone" name="team-phone" type="tel" autocomplete="tel" :rules="[required]" />
                <VTextField v-model="teamForm.photoUrl" label="Photo URL" name="team-photo" type="url" autocomplete="off" />
                <VTextarea v-model="teamForm.description" label="Description" name="team-description" autocomplete="off" rows="5" :rules="[required]" />
                <VCombobox v-model="teamForm.education" label="Education" name="team-education" multiple chips autocomplete="off" />
                <VBtn type="submit" color="primary" :loading="creatingTeam">Create Member</VBtn>
              </VForm>
            </section>
          </VWindowItem>
        </VWindow>
      </VCard>
    </VContainer>
  </main>
</template>

<script setup lang="ts">
type FirestoreDate = { _seconds?: number, seconds?: number } | string | number | Date | null | undefined

interface BlogRecord {
  id: string
  title: string
  content: string
  headerImg: string
  createdDate?: FirestoreDate
}

interface LeadRecord {
  id: string
  name: string
  email: string
  phone: string
  caseDescription: string
  createdDate?: FirestoreDate
}

interface TeamRecord {
  uid: string
  name: string
  title: string
  email: string
  phone: string
  photoUrl: string
  description: string
  education: string[]
}

const router = useRouter()
const route = useRoute()
const { user, loading, logout } = useAuth()

const tab = computed({
  get: () => typeof route.query.tab === 'string' ? route.query.tab : 'blogs',
  set: value => router.replace({ query: { ...route.query, tab: value } }),
})

const required = (v: string) => !!v || 'Field is required'
const requiredFile = (v: File | File[] | undefined) => !!v || 'Field is required'

const blogs = ref<BlogRecord[]>([])
const leads = ref<LeadRecord[]>([])
const team = ref<TeamRecord[]>([])
const pageError = ref('')
const loadingBlogs = ref(false)
const loadingLeads = ref(false)
const loadingTeam = ref(false)
const savingBlog = ref(false)
const savingProfile = ref(false)
const creatingTeam = ref(false)
const deletingBlogId = ref('')
const editingBlogId = ref('')

const blogForm = reactive({ title: '', content: '', headerImg: '', imageFile: undefined as File | undefined })
const profileForm = reactive({ name: '', title: '', email: '', phone: '', photoUrl: '', description: '', education: [] as string[] })
const teamForm = reactive({ passkey: '', name: '', title: '', email: '', password: '', phone: '', photoUrl: '', description: '', education: [] as string[] })

watchEffect(() => {
  if (!loading.value && !user.value) {
    router.push('/login')
  }
})

useHead({ title: 'Admin | The Azizi Firm' })

onMounted(async () => {
  await Promise.all([fetchBlogs(), fetchLeads(), fetchTeam()])
})

watch(user, (currentUser) => {
  if (currentUser) fillProfileFromTeam()
})

const showAlert = async (message: string, type: 'success' | 'danger' = 'success') => {
  const { createAlert } = await import('mosha-vue-toastify')
  createAlert(message, { type, timeout: 2600, position: 'top-center' })
}

const handleError = async (err: any, fallback: string) => {
  const message = err?.data?.statusMessage || err?.message || fallback
  pageError.value = message
  await showAlert(message, 'danger')
}

const fetchBlogs = async () => {
  loadingBlogs.value = true
  try {
    const res = await $fetch<{ blogs: BlogRecord[] }>('/api/blogs/all', { query: { userData: 'short' } })
    blogs.value = res.blogs || []
  } catch (err) {
    await handleError(err, 'Could not load blogs.')
  }
  loadingBlogs.value = false
}

const fetchLeads = async () => {
  loadingLeads.value = true
  try {
    const res = await $fetch<{ forms: LeadRecord[] }>('/api/form/all', { query: { limit: 50 } })
    leads.value = res.forms || []
  } catch (err) {
    await handleError(err, 'Could not load leads.')
  }
  loadingLeads.value = false
}

const fetchTeam = async () => {
  loadingTeam.value = true
  try {
    const res = await $fetch<{ data: TeamRecord[] }>('/api/team/all')
    team.value = res.data || []
    fillProfileFromTeam()
  } catch (err) {
    await handleError(err, 'Could not load team members.')
  }
  loadingTeam.value = false
}

const fillProfileFromTeam = () => {
  const member = team.value.find(t => t.uid === user.value?.uid)
  if (!member) return
  Object.assign(profileForm, {
    name: member.name || '',
    title: member.title || '',
    email: member.email || user.value?.email || '',
    phone: member.phone || '',
    photoUrl: member.photoUrl || '',
    description: member.description || '',
    education: member.education || [],
  })
}

const readFileAsBase64 = async (file: File) => {
  const reader = new FileReader()
  return await new Promise<string>((resolve, reject) => {
    reader.onload = () => resolve((reader.result as string).split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const uploadImage = async (file: File) => {
  const base64 = await readFileAsBase64(file)
  const storageRes: any = await $fetch('/api/storage/upload', {
    method: 'POST',
    body: { file: base64, filename: `${Date.now()}-${file.name}`, mimeType: file.type },
  })
  return storageRes.urls[0]
}

const submitBlog = async () => {
  if (!blogForm.title || !blogForm.content || (!editingBlogId.value && !blogForm.imageFile)) return
  savingBlog.value = true
  try {
    const headerImg = blogForm.imageFile ? await uploadImage(blogForm.imageFile) : blogForm.headerImg
    if (editingBlogId.value) {
      await $fetch('/api/blogs/update', { method: 'POST', query: { id: editingBlogId.value }, body: { title: blogForm.title, content: blogForm.content, headerImg } })
      await showAlert('Blog updated successfully')
    } else {
      await $fetch('/api/blogs/create', { method: 'POST', body: { title: blogForm.title, content: blogForm.content, headerImg } })
      await showAlert('Blog created successfully')
    }
    resetBlogForm()
    await fetchBlogs()
  } catch (err) {
    await handleError(err, 'Could not save blog.')
  }
  savingBlog.value = false
}

const editBlog = (blog: BlogRecord) => {
  editingBlogId.value = blog.id
  blogForm.title = blog.title
  blogForm.content = blog.content
  blogForm.headerImg = blog.headerImg
  blogForm.imageFile = undefined
  tab.value = 'blogs'
}

const deleteBlog = async (blog: BlogRecord) => {
  if (!confirm(`Delete “${blog.title}”? This cannot be undone.`)) return
  deletingBlogId.value = blog.id
  try {
    await $fetch(`/api/blogs/${blog.id}`, { method: 'DELETE' })
    await showAlert('Blog deleted')
    await fetchBlogs()
  } catch (err) {
    await handleError(err, 'Could not delete blog.')
  }
  deletingBlogId.value = ''
}

const resetBlogForm = () => {
  editingBlogId.value = ''
  blogForm.title = ''
  blogForm.content = ''
  blogForm.headerImg = ''
  blogForm.imageFile = undefined
}

const saveProfile = async () => {
  savingProfile.value = true
  try {
    await $fetch('/api/team/update', { method: 'POST', body: { ...profileForm } })
    await showAlert('Profile updated')
    await fetchTeam()
  } catch (err) {
    await handleError(err, 'Could not update profile.')
  }
  savingProfile.value = false
}

const createTeamMember = async () => {
  creatingTeam.value = true
  try {
    await $fetch('/api/team/register', { method: 'POST', body: { ...teamForm } })
    await showAlert('Team member created')
    Object.assign(teamForm, { passkey: '', name: '', title: '', email: '', password: '', phone: '', photoUrl: '', description: '', education: [] })
    await fetchTeam()
  } catch (err) {
    await handleError(err, 'Could not create team member.')
  }
  creatingTeam.value = false
}

const formatDate = (value?: FirestoreDate) => {
  if (!value) return 'No Date'
  let date: Date
  if (typeof value === 'object' && !(value instanceof Date)) {
    const seconds = value._seconds || value.seconds
    date = seconds ? new Date(seconds * 1000) : new Date()
  } else {
    date = new Date(value as any)
  }
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}
</script>

<style scoped lang="scss">
.admin-shell {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(180, 83, 9, 0.16), transparent 34rem),
    linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%);
  color: #0f172a;
  overflow-x: hidden;
}

.admin-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 420px);
  gap: 32px;
  align-items: end;
  padding: clamp(48px, 7vw, 96px) clamp(20px, 6vw, 88px) 28px;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 62%, #1e40af 100%);
  color: white;
  position: relative;
  isolation: isolate;

  &::after {
    content: '';
    position: absolute;
    inset: auto 7% -42px auto;
    width: 220px;
    height: 220px;
    border: 1px solid rgba(255, 255, 255, 0.22);
    border-radius: 999px;
    z-index: -1;
  }

  h1 {
    max-width: 820px;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: clamp(2.4rem, 7vw, 5.8rem);
    line-height: 0.88;
    letter-spacing: -0.06em;
    text-wrap: balance;
  }
}

.eyebrow {
  color: #b45309;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.hero-copy {
  max-width: 680px;
  margin-top: 18px;
  color: rgba(255, 255, 255, 0.78);
  font-size: clamp(1rem, 2vw, 1.25rem);
  line-height: 1.7;
}

.hero-card,
.metric-card,
.workspace-card {
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 24px 80px rgba(15, 23, 42, 0.12);
}

.hero-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
  border-color: rgba(255, 255, 255, 0.2);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(18px);
  min-width: 0;

  span {
    color: rgba(255, 255, 255, 0.68);
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  strong {
    overflow-wrap: anywhere;
  }
}

.admin-panel {
  max-width: 1440px;
  padding-top: 28px;
  padding-bottom: 72px;
}

.metric-row {
  margin-bottom: 22px;
}

.metric-card {
  min-height: 132px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.84);
  backdrop-filter: blur(14px);

  span {
    color: #475569;
    font-weight: 700;
  }

  strong {
    display: block;
    margin-top: 10px;
    color: #1e3a8a;
    font-size: 3rem;
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }

  &.accent strong {
    color: #b45309;
  }
}

.workspace-card {
  overflow: hidden;
  background: rgba(255, 255, 255, 0.92);
}

.admin-tabs {
  border-bottom: 1px solid #e2e8f0;
}

.workspace-section {
  padding: clamp(20px, 4vw, 40px);
}

.workspace-section.narrow {
  max-width: 900px;
}

.section-heading {
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;

  h2 {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: clamp(1.9rem, 4vw, 3rem);
    line-height: 1;
    letter-spacing: -0.04em;
    text-wrap: balance;
  }
}

.editor-form,
.form-actions,
.lead-actions,
.list-actions {
  display: flex;
  gap: 14px;
}

.editor-form {
  flex-direction: column;
}

.form-actions,
.lead-actions,
.list-actions {
  flex-wrap: wrap;
  align-items: center;
}

.admin-list {
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  background: #f8fafc;
}

.admin-list-item {
  border-bottom: 1px solid #e2e8f0;

  &:last-child {
    border-bottom: 0;
  }
}

.empty-state {
  padding: 32px;
  border: 1px dashed #cbd5e1;
  border-radius: 24px;
  background: #f8fafc;
  color: #475569;
  text-align: center;
}

.lead-panels {
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  overflow: hidden;
}

.lead-title {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 4px;

  span {
    color: #475569;
    overflow-wrap: anywhere;
  }
}

.lead-date {
  margin-left: auto;
  color: #64748b;
  font-size: 0.875rem;
  font-variant-numeric: tabular-nums;
}

:deep(.v-btn) {
  min-height: 44px;
  text-transform: none;
  letter-spacing: 0;
  transition-property: background-color, border-color, box-shadow, color, opacity, transform;
  transition-duration: 180ms;
}

:deep(.v-btn:focus-visible),
:deep(.v-field:focus-within) {
  outline: 3px solid rgba(180, 83, 9, 0.34);
  outline-offset: 2px;
}

@media (max-width: 960px) {
  .admin-hero {
    grid-template-columns: 1fr;
  }

  .section-heading {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 600px) {
  .admin-hero {
    padding-inline: 18px;
  }

  .workspace-section {
    padding: 18px;
  }

  .list-actions,
  .lead-actions,
  .form-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .lead-date {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  :deep(.v-btn) {
    transition-duration: 1ms;
  }
}
</style>
