import { readdir, readFile, stat } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('.', import.meta.url))
const workspaceRoot = resolve(root, '../..')
const campaign = 'core_content_cluster_0727'
const canonicalUploadUrl = 'https://previewship.com/guides/upload-html-file'
const retiredUploadUrl = 'https://previewship.com/guides/upload-html-file-to-website'

const requiredFiles = [
  'README.md',
  'PUBLISHING-CALENDAR.md',
  'PUBLICATION-LEDGER.csv',
  'CAPTURE-PRIVACY.json',
  'UTM-LINKS.md',
  'METRICS-REVIEW.md',
  'CONTENT-PLAYBOOK.md',
  'devto/01-upload-html-file-to-website.md',
  'devto/02-native-artifact-or-preview-url.md',
  'medium/01-preview-vs-production-hosting.md',
  'spanish/01-claude-code-to-public-url.md',
  'spanish/02-vscode-to-public-url.md',
  'spanish/03-cursor-mcp-to-public-url.md',
  'spanish/04-publish-html-file-to-web.md',
  'linkedin-x/01-english-posts.md',
  'linkedin-x/02-spanish-posts.md',
  'reddit/README.md',
  'hackernews/README.md',
  'youtube/README.md',
  'distribution/README.md',
  'newsletter/01-product-update.md',
  'indiehackers/README.md',
  'images/README.md',
  'videos/README.md',
  'videos/PLATFORM-COPY.md',
  'videos/SPANISH-FOCUSED-SHORTS.md',
  'videos/UTM-VIDEO-LINKS.md',
  'videos/output/html-file-to-live-url.mp4',
  'videos/output/claude-artifact-to-preview-url.mp4',
  'videos/output/preview-vs-production-hosting.mp4',
  'videos/output/es-code-to-public-url.mp4',
  'videos/output/es-cursor-mcp-url.mp4',
  'videos/output/es-claude-artifact-preview.mp4',
  'videos/output/es-vscode-deploy.mp4',
  'videos/covers/html-file-to-live-url.png',
  'videos/covers/claude-artifact-to-preview-url.png',
  'videos/covers/preview-vs-production-hosting.png',
  'videos/covers/es-code-to-public-url.png',
  'videos/covers/es-cursor-mcp-url.png',
  'videos/covers/es-claude-artifact-preview.png',
  'videos/covers/es-vscode-deploy.png',
  'videos/captions/html-file-to-live-url.srt',
  'videos/captions/claude-artifact-to-preview-url.srt',
  'videos/captions/preview-vs-production-hosting.srt',
  'videos/captions/es-code-to-public-url.srt',
  'videos/captions/es-cursor-mcp-url.srt',
  'videos/captions/es-claude-artifact-preview.srt',
  'videos/captions/es-vscode-deploy.srt',
  'videos/captures/console-new-preview-redacted.png',
  'videos/captures/publish-success-redacted.png',
  'videos/captures/live-preview.png',
]

const publishDirectories = [
  'devto/',
  'medium/',
  'spanish/',
  'linkedin-x/',
  'reddit/',
  'hackernews/',
  'youtube/',
  'distribution/',
  'newsletter/',
  'indiehackers/',
  'videos/',
]

const optimizedImages = [
  'images/optimized/html-file-live-url-1200x630.png',
  'images/optimized/native-artifact-or-preview-url-1200x630.png',
  'images/optimized/preview-vs-production-hosting-1200x630.png',
  'images/optimized/es-code-to-public-url-1200x630.png',
]

const evidenceImages = [
  'videos/captures/console-new-preview-redacted.png',
  'videos/captures/publish-success-redacted.png',
  'videos/captures/live-preview.png',
]

const canonicalUploadFiles = [
  'README.md',
  'UTM-LINKS.md',
  'videos/PLATFORM-COPY.md',
  'videos/UTM-VIDEO-LINKS.md',
]

const failures = []
const trackedDestinations = new Map()
let validatedLedgerRows = 0
const retiredEvidenceImages = [
  'console-new-preview.png',
  'publish-success.png',
]
let privacyManifest = null
try {
  privacyManifest = JSON.parse(await readFile(join(root, 'CAPTURE-PRIVACY.json'), 'utf8'))
} catch {
  failures.push('缺少或无法读取截图隐私清单：CAPTURE-PRIVACY.json')
}

function validateTrackedLinks(name, content) {
  const links = content.match(/https:\/\/previewship\.com\/[^\s<>)\]]+/gu) ?? []
  for (const rawLink of links) {
    if (!rawLink.includes(`utm_campaign=${campaign}`)) {
      continue
    }
    const link = rawLink.replace(/[.,;:'"]+$/u, '')
    const url = new URL(link)
    if (
      !url.searchParams.get('utm_source')
      || !url.searchParams.get('utm_medium')
      || !url.searchParams.get('utm_content')
    ) {
      failures.push(`${name} 的追踪链接缺少 source、medium 或 content：${link}`)
    }
  }
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    if (entry.isDirectory() && entry.name === 'node_modules') {
      continue
    }
    const path = join(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...await walk(path))
    } else {
      files.push(path)
    }
  }
  return files
}

for (const path of requiredFiles) {
  try {
    const info = await stat(join(root, path))
    if (!info.isFile() || info.size === 0) {
      failures.push(`${path} 不是有效文件`)
    }
  } catch {
    failures.push(`缺少必需文件：${path}`)
  }
}

const markdownFiles = (await walk(root)).filter((path) => path.endsWith('.md'))
for (const path of markdownFiles) {
  const name = relative(root, path)
  const content = await readFile(path, 'utf8')

  if (/\b(?:TODO|TBD|PLACEHOLDER|YOUR_LINK)\b/u.test(content) || /\[replace/iu.test(content)) {
    failures.push(`${name} 仍包含占位符`)
  }

  if (content.includes('https://previewship.com/upload-html-file-to-website')) {
    failures.push(`${name} 错误链接到 noindex 广告页`)
  }

  if (content.includes(retiredUploadUrl)) {
    failures.push(`${name} 仍链接到已合并的旧英文 Upload 指南`)
  }

  for (const retiredImage of retiredEvidenceImages) {
    if (content.includes(retiredImage)) {
      failures.push(`${name} 仍引用未去标识化截图：${retiredImage}`)
    }
  }

  const allowedVisibleEmails = new Set(privacyManifest?.allowedVisibleEmails ?? [])
  const emails = content.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/giu) ?? []
  for (const email of emails) {
    if (!allowedVisibleEmails.has(email.toLowerCase())) {
      failures.push(`${name} 包含未批准公开的邮箱地址`)
    }
  }

  if (publishDirectories.some((directory) => name.startsWith(directory))) {
    if (/\b(?:SEO\/GEO|search intent|target queries|rank in search|cited by AI)\b/iu.test(content)) {
      failures.push(`${name} 包含面向内部运营的搜索引擎自述`)
    }
    const previewShipLinks = content.match(/https:\/\/previewship\.com\/[^\s<>)\]]+/gu) ?? []
    for (const link of previewShipLinks) {
      if (!link.includes(`utm_campaign=${campaign}`)) {
        failures.push(`${name} 的发布链接缺少统一 campaign：${link}`)
      }
    }
  }

  const trackedLinks = content.match(/https:\/\/previewship\.com\/[^\s<>)\]]+/gu) ?? []
  for (const rawLink of trackedLinks) {
    if (!rawLink.includes(`utm_campaign=${campaign}`)) {
      continue
    }

    const link = rawLink.replace(/[.,;:'"]+$/u, '')
    const url = new URL(link)
    const source = url.searchParams.get('utm_source')
    const medium = url.searchParams.get('utm_medium')
    const utmContent = url.searchParams.get('utm_content')

    if (!source || !medium || !utmContent) {
      failures.push(`${name} 的追踪链接缺少 source、medium 或 content：${link}`)
      continue
    }
    if (!/^[a-z0-9]+(?:_[a-z0-9]+)*$/u.test(utmContent)) {
      failures.push(`${name} 的 utm_content 必须是小写 snake_case：${utmContent}`)
    }

    const identity = `${source}|${medium}|${campaign}|${utmContent}`
    const destination = `${url.origin}${url.pathname}`
    const knownDestination = trackedDestinations.get(identity)
    if (knownDestination && knownDestination !== destination) {
      failures.push(`${name} 的同一 UTM 素材 ID 指向不同落点：${identity}`)
    } else {
      trackedDestinations.set(identity, destination)
    }
  }
}

for (const name of ['README.md', 'mcp/README.md']) {
  const content = await readFile(join(workspaceRoot, name), 'utf8')
  validateTrackedLinks(name, content)
}

const distributionContent = await readFile(join(root, 'distribution/README.md'), 'utf8')
for (const expectedPath of [
  'https://previewship.com/docs/mcp?utm_source=mcp_directory',
  'https://previewship.com/docs/vscode?utm_source=openvsx',
]) {
  if (!distributionContent.includes(expectedPath)) {
    failures.push(`distribution/README.md 缺少英文渠道正确落点：${expectedPath}`)
  }
}
if (/agent can[^.]+deploy it, verify the returned URL/iu.test(distributionContent)) {
  failures.push('distribution/README.md 错误声称 MCP 部署工具会自行验证页面')
}

const videoConfigContent = await readFile(join(root, 'videos/remotion/src/videos.json'), 'utf8')
for (const retiredImage of retiredEvidenceImages) {
  if (videoConfigContent.includes(`captures/${retiredImage}`)) {
    failures.push(`videos/remotion/src/videos.json 仍引用未去标识化截图：${retiredImage}`)
  }
}
const compositionContent = await readFile(join(root, 'videos/remotion/src/Composition.tsx'), 'utf8')
if (compositionContent.includes('previewship.com/try')) {
  failures.push('videos/remotion/src/Composition.tsx 仍含旧硬编码页脚 previewship.com/try')
}
if (!compositionContent.includes('getLandingDisplayUrl(video.landingUrl)')) {
  failures.push('videos/remotion/src/Composition.tsx 没有展示每条视频的独立落点')
}
const videoDefinitions = JSON.parse(videoConfigContent)
const videoUtmContent = await readFile(join(root, 'videos/UTM-VIDEO-LINKS.md'), 'utf8')
const videoUtmLinks = videoUtmContent.match(/https:\/\/previewship\.com\/[^\s<>)\]]+/gu) ?? []
for (const video of videoDefinitions) {
  const configuredContent = new URL(video.landingUrl).searchParams.get('utm_content')
  const matchingLinks = videoUtmLinks.filter((link) => {
    try {
      return new URL(link.replace(/[.,;:'"]+$/u, '')).searchParams.get('utm_content') === configuredContent
    } catch {
      return false
    }
  })
  if (matchingLinks.length !== 5) {
    failures.push(`${video.id} 的 UTM 清单与 videos.json 不一致：${configuredContent}`)
  }
}

const primaryCtaSections = [
  ['newsletter/01-product-update.md', await readFile(join(root, 'newsletter/01-product-update.md'), 'utf8')],
  ['spanish/04-publish-html-file-to-web.md', await readFile(join(root, 'spanish/04-publish-html-file-to-web.md'), 'utf8')],
  [
    'linkedin-x/02-spanish-posts.md#post-4',
    (await readFile(join(root, 'linkedin-x/02-spanish-posts.md'), 'utf8'))
      .split('## Post 4')[1] ?? '',
  ],
  [
    'youtube/README.md#short-4',
    (await readFile(join(root, 'youtube/README.md'), 'utf8'))
      .split('## Short 4')[1] ?? '',
  ],
]
for (const [name, content] of primaryCtaSections) {
  const trackedLinks = content.match(/https:\/\/previewship\.com\/[^\s<>)\]]+utm_campaign=core_content_cluster_0727[^\s<>)\]]*/gu) ?? []
  if (trackedLinks.length !== 1) {
    failures.push(`${name} 应有且仅有一个主要 CTA，实际为 ${trackedLinks.length}`)
  }
}

const spanishArticleImages = new Map([
  ['spanish/02-vscode-to-public-url.md', 'videos/captures/es-vscode.png'],
  ['spanish/03-cursor-mcp-to-public-url.md', 'videos/captures/es-deploy-from-cursor.png'],
  ['spanish/04-publish-html-file-to-web.md', 'images/optimized/es-code-to-public-url-1200x630.png'],
])
for (const [name, expectedAsset] of spanishArticleImages) {
  const content = await readFile(join(root, name), 'utf8')
  if (!content.includes(expectedAsset)) {
    failures.push(`${name} 没有引用与主题匹配的西语资产：${expectedAsset}`)
  }
  if (!/Texto alternativo:\s*\n\s*```text\s*\n\S[^\n]+\n```/u.test(content)) {
    failures.push(`${name} 缺少可发布的西语图片 Alt 文本`)
  }
}

const spanishShortsContent = await readFile(join(root, 'videos/SPANISH-FOCUSED-SHORTS.md'), 'utf8')
for (const durationCopy of ['35,5 segundos', '35,6 segundos', '36,8 segundos']) {
  if (!spanishShortsContent.includes(durationCopy)) {
    failures.push(`videos/SPANISH-FOCUSED-SHORTS.md 缺少与成片一致的时长文案：${durationCopy}`)
  }
}

const metricsContent = await readFile(join(root, 'METRICS-REVIEW.md'), 'utf8')
if (metricsContent.includes('`utm_medium=referral`')) {
  failures.push('METRICS-REVIEW.md 错把 GitHub/npm medium 统一写成 referral')
}
if (!metricsContent.includes('`utm_medium=repository|package`')) {
  failures.push('METRICS-REVIEW.md 缺少 GitHub/npm 的真实 medium 口径')
}
const calendarContent = await readFile(join(root, 'PUBLISHING-CALENDAR.md'), 'utf8')
for (const [name, content] of [
  ['PUBLISHING-CALENDAR.md', calendarContent],
  ['METRICS-REVIEW.md', metricsContent],
  ['README.md', await readFile(join(root, 'README.md'), 'utf8')],
]) {
  if (!content.includes('PUBLICATION-LEDGER.csv')) {
    failures.push(`${name} 没有引用单一发布账本 PUBLICATION-LEDGER.csv`)
  }
}

const ledgerPath = join(root, 'PUBLICATION-LEDGER.csv')
try {
  const ledgerLines = (await readFile(ledgerPath, 'utf8'))
    .trim()
    .split(/\r?\n/u)
  const expectedHeader = [
    'asset_id',
    'platform',
    'utm_content',
    'status',
    'actual_date',
    'public_url',
    'canonical_url',
    'review_7d',
    'review_14d',
    'review_28d',
  ]
  if (ledgerLines[0] !== expectedHeader.join(',')) {
    failures.push('PUBLICATION-LEDGER.csv 表头不完整或顺序错误')
  }
  const ledgerRows = new Map()
  for (const [index, line] of ledgerLines.slice(1).entries()) {
    const values = line.split(',')
    if (values.length !== expectedHeader.length) {
      failures.push(`PUBLICATION-LEDGER.csv 第 ${index + 2} 行字段数错误`)
      continue
    }
    const row = Object.fromEntries(expectedHeader.map((field, fieldIndex) => [field, values[fieldIndex]]))
    const identity = `${row.platform}|${row.utm_content}`
    if (!row.asset_id || !row.platform || !row.utm_content || !row.canonical_url) {
      failures.push(`PUBLICATION-LEDGER.csv 第 ${index + 2} 行缺少素材身份或主落点`)
    }
    if (!['planned', 'paused', 'published_pending_verification', 'published', 'retired'].includes(row.status)) {
      failures.push(`PUBLICATION-LEDGER.csv 第 ${index + 2} 行状态无效：${row.status}`)
    }
    if (!row.review_7d || !row.review_14d || !row.review_28d) {
      failures.push(`PUBLICATION-LEDGER.csv 第 ${index + 2} 行缺少 7/14/28 天复盘状态`)
    }
    if (row.status === 'published' && (!/^\d{4}-\d{2}-\d{2}$/u.test(row.actual_date) || !row.public_url)) {
      failures.push(`PUBLICATION-LEDGER.csv 第 ${index + 2} 行已发布但缺少实际日期或公开 URL`)
    }
    if (row.status === 'published_pending_verification' && !/^\d{4}-\d{2}-\d{2}$/u.test(row.actual_date)) {
      failures.push(`PUBLICATION-LEDGER.csv 第 ${index + 2} 行待核验发布缺少实际日期`)
    }
    if (ledgerRows.has(identity)) {
      failures.push(`PUBLICATION-LEDGER.csv 重复素材渠道身份：${identity}`)
    } else {
      ledgerRows.set(identity, row)
    }
  }

  const canonicalUtmDocuments = [
    await readFile(join(root, 'UTM-LINKS.md'), 'utf8'),
    videoUtmContent,
  ]
  const canonicalLinks = canonicalUtmDocuments
    .flatMap((content) => content.match(/https:\/\/previewship\.com\/[^\s<>)\]]+/gu) ?? [])
  const canonicalIdentities = new Set()
  for (const rawLink of canonicalLinks) {
    const url = new URL(rawLink.replace(/[.,;:'"]+$/u, ''))
    if (url.searchParams.get('utm_campaign') !== campaign) {
      continue
    }
    const identity = `${url.searchParams.get('utm_source')}|${url.searchParams.get('utm_content')}`
    const canonicalUrl = `${url.origin}${url.pathname}`
    canonicalIdentities.add(identity)
    const ledgerRow = ledgerRows.get(identity)
    if (!ledgerRow) {
      failures.push(`PUBLICATION-LEDGER.csv 缺少 UTM 素材：${identity}`)
    } else if (ledgerRow.canonical_url !== canonicalUrl) {
      failures.push(`PUBLICATION-LEDGER.csv 主落点与 UTM 清单不一致：${identity}`)
    }
  }
  for (const identity of ledgerRows.keys()) {
    if (!canonicalIdentities.has(identity)) {
      failures.push(`PUBLICATION-LEDGER.csv 存在 UTM 清单之外的素材：${identity}`)
    }
  }
  validatedLedgerRows = ledgerRows.size
} catch {
  failures.push('缺少或无法读取单一发布账本：PUBLICATION-LEDGER.csv')
}
if (/menos de (?:30|35) segundos|comparaci[oó]n en 30 segundos/iu.test(spanishShortsContent)) {
  failures.push('videos/SPANISH-FOCUSED-SHORTS.md 仍包含短于实际成片的时长承诺')
}

for (const file of canonicalUploadFiles) {
  const content = await readFile(join(root, file), 'utf8')
  if (!content.includes(canonicalUploadUrl)) {
    failures.push(`${file} 缺少统一的英文 Upload 主落点`)
  }
}

for (const image of optimizedImages) {
  const path = join(root, image)
  try {
    const data = await readFile(path)
    const info = await stat(path)
    const isPng = data.subarray(0, 8).equals(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    )
    if (!isPng) {
      failures.push(`${image} 不是有效 PNG`)
      continue
    }
    const width = data.readUInt32BE(16)
    const height = data.readUInt32BE(20)
    if (width !== 1200 || height !== 630) {
      failures.push(`${image} 尺寸为 ${width}×${height}，应为 1200×630`)
    }
    if (info.size > 1024 * 1024) {
      failures.push(`${image} 超过 1 MiB`)
    }
  } catch {
    failures.push(`缺少优化图片：${image}`)
  }
}

for (const image of evidenceImages) {
  try {
    const data = await readFile(join(root, image))
    const isPng = data.subarray(0, 8).equals(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    )
    const isJpeg = data[0] === 0xff && data[1] === 0xd8 && data.at(-2) === 0xff && data.at(-1) === 0xd9
    if (!isPng && !isJpeg) {
      failures.push(`${image} 不是有效的流程证据图片`)
    }
  } catch {
    failures.push(`缺少流程证据图片：${image}`)
  }
}

if (privacyManifest) {
  for (const image of evidenceImages.slice(0, 2)) {
    const fileName = image.split('/').at(-1)
    const expectedHash = privacyManifest.captures?.[fileName]
    const actualHash = createHash('sha256')
      .update(await readFile(join(root, image)))
      .digest('hex')
    if (!expectedHash || expectedHash !== actualHash) {
      failures.push(`${image} 未通过隐私复核哈希校验，需要重新人工检查邮箱与账号信息`)
    }
  }
}

if (failures.length > 0) {
  console.error('运营素材校验失败：')
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exitCode = 1
} else {
  console.log(`运营素材校验通过：${requiredFiles.length} 个必需文件，${optimizedImages.length} 张发布图片，${evidenceImages.length} 张流程证据图，${validatedLedgerRows} 条发布账本记录，7 条短视频及其封面和字幕。`)
}
