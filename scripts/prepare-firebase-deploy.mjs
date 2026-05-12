import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

const projectRoot = process.cwd()
const serverDir = join(projectRoot, '.output', 'server')
const envPath = join(projectRoot, '.env')
const serverEnvPath = join(serverDir, '.env')
const serverEntryPath = join(serverDir, 'index.mjs')
const serverPackagePath = join(serverDir, 'package.json')

if (!existsSync(serverDir)) {
  throw new Error('Missing .output/server. Run a Nuxt build before preparing Firebase deploy output.')
}

if (!existsSync(envPath)) {
  throw new Error('Missing root .env file. Cannot prepare server runtime env for Firebase deploy.')
}

const envContent = readFileSync(envPath, 'utf8')
const pickedEnvLines = envContent
  .split(/\r?\n/)
  .filter((line) => line.startsWith('NUXT_RECAPTCHA_SECRET_KEY=') || line.startsWith('NUXT_PASSKEY='))

if (pickedEnvLines.length < 2) {
  throw new Error('Expected NUXT_RECAPTCHA_SECRET_KEY and NUXT_PASSKEY in .env.')
}

mkdirSync(serverDir, { recursive: true })
writeFileSync(serverEnvPath, `${pickedEnvLines.join('\n')}\n`)

for (const staleFile of ['api.mjs', 'nitro-server.mjs']) {
  const stalePath = join(serverDir, staleFile)
  if (existsSync(stalePath)) {
    rmSync(stalePath, { force: true })
  }
}

const serverEntry = readFileSync(serverEntryPath, 'utf8')
if (!serverEntry.includes(' as api ') && !serverEntry.includes('export const api = onRequest')) {
  throw new Error('Expected Nitro Firebase output to expose an api function entrypoint. Check nitro.firebase.serverFunctionName.')
}

const serverPackage = JSON.parse(readFileSync(serverPackagePath, 'utf8'))
serverPackage.main = 'index.mjs'
writeFileSync(serverPackagePath, `${JSON.stringify(serverPackage, null, 2)}\n`)

const installResult = spawnSync('yarn', ['install', '--production', '--ignore-engines', '--no-bin-links'], {
  cwd: serverDir,
  stdio: 'inherit',
})

if (installResult.status !== 0) {
  throw new Error(`Failed to prepare .output/server dependencies (exit ${installResult.status ?? 'unknown'}).`)
}
