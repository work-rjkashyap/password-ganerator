// Lightweight Web Crypto helpers for AES-GCM encryption at rest

const STORAGE_KEYS = {
  WRAPPING_JWK: 'crypto_wrapping_jwk_v1',
}

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

export function toB64(buf) {
  const bytes = new Uint8Array(buf)
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin)
}

export function fromB64(b64) {
  const bin = atob(b64)
  const buf = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i)
  return buf.buffer
}

export async function getOrCreateWrappingKey() {
  // Persist JWK in chrome.storage.local
  const jwk = await new Promise((resolve) => {
    try {
      chrome.storage.local.get([STORAGE_KEYS.WRAPPING_JWK], (res) => resolve(res[STORAGE_KEYS.WRAPPING_JWK] || null))
    } catch (e) { resolve(null) }
  })

  if (jwk) {
    try {
      return await crypto.subtle.importKey('jwk', jwk, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt'])
    } catch (e) {
      // fallthrough to regeneration
    }
  }

  const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt'])
  const exported = await crypto.subtle.exportKey('jwk', key)
  try {
    await new Promise((resolve) => chrome.storage.local.set({ [STORAGE_KEYS.WRAPPING_JWK]: exported }, resolve))
  } catch (e) { /* ignore */ }
  return key
}

export async function encryptText(plaintext) {
  const key = await getOrCreateWrappingKey()
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, textEncoder.encode(plaintext))
  return { ivB64: toB64(iv), ctB64: toB64(ct) }
}

export async function decryptText({ ivB64, ctB64 }) {
  const key = await getOrCreateWrappingKey()
  const iv = new Uint8Array(fromB64(ivB64))
  const ct = fromB64(ctB64)
  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct)
  return textDecoder.decode(pt)
}

// Convenience wrappers for history entries
export async function encryptForHistory(plaintext) {
  if (!plaintext) return null
  return encryptText(plaintext)
}

export async function decryptFromHistory(enc) {
  if (!enc || !enc.ivB64 || !enc.ctB64) return ''
  try { return await decryptText(enc) } catch (e) { return '' }
}

export default {
  toB64, fromB64,
  getOrCreateWrappingKey,
  encryptText, decryptText,
  encryptForHistory, decryptFromHistory,
}

