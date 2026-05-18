<template>
  <main class="admin-shell">
    <VContainer class="admin-panel">
      <VAlert v-if="pageError" class="mb-4" type="error" variant="tonal" closable @click:close="pageError = ''">
        {{ pageError }}
      </VAlert>

      <VCard class="workspace-card" rounded="xl">
        <VTabs v-model="tab" class="admin-tabs" color="primary" show-arrows>
          <VTab value="blogs">Blogs</VTab>
          <VTab value="leads">Leads</VTab>
        </VTabs>

        <VWindow v-model="tab">
          <VWindowItem value="blogs">
            <section class="workspace-section" aria-labelledby="blogs-heading">
              <div class="section-heading">
                <div>
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
                    <div class="content-editor">
                      <label for="blog-content">Blog Content</label>
                      <VTextarea
                        id="blog-content"
                        v-model="blogForm.content"
                        name="blog-content"
                        autocomplete="off"
                        rows="14"
                        auto-grow
                        persistent-hint
                        hint="Write plain text or paste HTML. Headings, paragraphs, links, lists, and other HTML are supported."
                      />
                      <VExpansionPanels v-if="blogForm.content" variant="accordion">
                        <VExpansionPanel>
                          <VExpansionPanelTitle>Preview Blog Content</VExpansionPanelTitle>
                          <VExpansionPanelText>
                            <article class="blog-preview" v-html="blogForm.content" />
                          </VExpansionPanelText>
                        </VExpansionPanel>
                      </VExpansionPanels>
                    </div>
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
                          <VBtn size="small" variant="tonal" aria-label="Edit Blog" title="Edit Blog" icon @click="editBlog(blog)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M0 0h24v24H0z" fill="none" />
                              <path fill="currentColor" d="M5 21h14c1.1 0 2-.9 2-2v-7h-2v7H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2" />
                              <path fill="currentColor" d="M7 13v3c0 .55.45 1 1 1h3c.27 0 .52-.11.71-.29l9-9a.996.996 0 0 0 0-1.41l-3-3a.996.996 0 0 0-1.41 0l-9.01 8.99A1 1 0 0 0 7 13m10-7.59L18.59 7L17.5 8.09L15.91 6.5zm-8 8l5.5-5.5l1.59 1.59l-5.5 5.5H9z" />
                            </svg>
                          </VBtn>
                          <VBtn size="small" color="error" variant="tonal" aria-label="Delete Blog" title="Delete Blog" icon :loading="deletingBlogId === blog.id" @click="deleteBlog(blog)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M0 0h24v24H0z" fill="none" />
                              <path fill="currentColor" d="M8 9h8v10H8z" opacity=".3" />
                              <path fill="currentColor" d="m15.5 4l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM8 9h8v10H8z" />
                            </svg>
                          </VBtn>
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
                  <h2 id="leads-heading">Contact Submissions</h2>
                </div>
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

const router = useRouter()
const route = useRoute()
const { user, loading } = useAuth()

const tab = computed({
  get: () => typeof route.query.tab === 'string' ? route.query.tab : 'blogs',
  set: value => router.replace({ query: { ...route.query, tab: value } }),
})

const required = (v: string) => !!v || 'Field is required'
const requiredFile = (v: File | File[] | undefined) => !!v || 'Field is required'

const blogs = ref<BlogRecord[]>([])
const leads = ref<LeadRecord[]>([])
const pageError = ref('')
const loadingBlogs = ref(false)
const loadingLeads = ref(false)
const savingBlog = ref(false)
const deletingBlogId = ref('')
const editingBlogId = ref('')
const sessionChecked = ref(false)
const hasServerSession = ref(false)

const blogForm = reactive({ title: '', content: '', headerImg: '', imageFile: undefined as File | undefined })

watchEffect(() => {
  if (!loading.value && sessionChecked.value && !user.value && !hasServerSession.value) {
    router.push('/login')
  }
})

useHead({ title: 'Admin | The Azizi Firm' })

onMounted(async () => {
  await checkServerSession()
  await Promise.all([fetchBlogs(), fetchLeads()])
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

const checkServerSession = async () => {
  try {
    await $fetch('/api/form/all', { query: { limit: 1 } })
    hasServerSession.value = true
  } catch {
    hasServerSession.value = false
  }
  sessionChecked.value = true
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
  if (!blogForm.title) {
    await handleError(null, 'Enter a blog title before posting.')
    return
  }
  if (!blogForm.content.trim()) {
    await handleError(null, 'Enter blog content before posting.')
    return
  }
  if (!editingBlogId.value && !blogForm.imageFile) {
    await handleError(null, 'Choose a header image before posting.')
    return
  }
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

.workspace-card {
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 24px 80px rgba(15, 23, 42, 0.12);
}

.admin-panel {
  max-width: 1440px;
  padding-top: 40px;
  padding-bottom: 72px;
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

.content-editor {
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    color: #334155;
    font-size: 0.875rem;
    font-weight: 700;
  }
}

.blog-preview {
  display: flex;
  flex-direction: column;
  gap: 14px;
  color: #0f172a;
  line-height: 1.65;
  overflow-wrap: anywhere;
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
  .section-heading {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 600px) {
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
