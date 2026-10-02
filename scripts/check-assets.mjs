import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { readFile, readdir } from 'node:fs/promises'
import { CharacterName } from '../src/composables/characterName.js'
import { TalentName } from '../src/composables/talentName.js'

// 部分历史英雄图片以 .jpg 保存 WebP，浏览器仍可识别；新增资源使用真实格式。
function imageFormat(bytes) {
  if (bytes.subarray(0, 3).equals(Buffer.from([0xFF, 0xD8, 0xFF])))
    return 'jpeg'
  if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])))
    return 'png'
  if (bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP')
    return 'webp'
  return null
}

async function checkAssets(folder, names, extension, formats) {
  assert(names.length > 0, `${folder}: 名单不能为空`)
  assert.equal(new Set(names).size, names.length, `${folder}: 存在重复名称`)
  const directory = new URL(`../public/assets/${folder}/`, import.meta.url)
  for (const name of names) {
    assert(typeof name === 'string' && name.trim() === name && name.length > 0 && !/[\\/]/.test(name), `${folder}: 无效名称 ${name}`)
    const filename = `${name}.${extension}`
    const bytes = await readFile(new URL(encodeURIComponent(filename), directory))
    assert(bytes.length > 100 && formats.includes(imageFormat(bytes)), `${filename}: 文件不是有效的图片格式`)
  }
  const actualFiles = (await readdir(directory)).filter(name => !name.startsWith('.')).sort()
  const expectedFiles = names.map(name => `${name}.${extension}`).sort()
  assert.deepEqual(actualFiles, expectedFiles, `${folder}: 图片目录与随机名单不一致`)
  console.log(`${folder}: ${names.length} 个名称与图片对应，检查通过`)
}

await checkAssets('character', CharacterName.value, 'jpg', ['jpeg', 'webp'])
await checkAssets('talent', TalentName.value, 'png', ['png'])
