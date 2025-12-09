

const SECRET = 'very-unsafe-local-secret-change-me'; 

function base64UrlEncode(input) {
  const bytes = (input instanceof Uint8Array) ? input : new TextEncoder().encode(input);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
  const b64 = btoa(binary);
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(input) {

  input = input.replace(/-/g, '+').replace(/_/g, '/');
  while (input.length % 4) input += '=';
  const bin = atob(input);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function importKey() {
  const keyData = new TextEncoder().encode(SECRET);
  return crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

async function sign(message) {
  try {
    const key = await importKey();
    const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
    return base64UrlEncode(new Uint8Array(sig));
  } catch (err) {

    console.warn('Web Crypto недоступен, используя fallback подпись (небезопасно).', err);
    const fallback = btoa(message).replace(/=+$/, '');
    return fallback;
  }
}

async function verify(message, signature) {
  try {
    const key = await importKey();
    const sigBytes = base64UrlDecode(signature);
    return crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(message));
  } catch (err) {

    return false;
  }
}

export async function createToken(user, expiresInSec = 60 * 60) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: user.id ?? user.username ?? null,
    username: user.username ?? null,
    iat: now,
    exp: now + expiresInSec,
  };

  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const signingInput = `${headerB64}.${payloadB64}`;
  const signature = await sign(signingInput);
  return `${signingInput}.${signature}`;
}

export function decodeToken(token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length < 2) return null;
  try {
    const payloadJson = decodeURIComponent(escape(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))));
    return JSON.parse(payloadJson);
  } catch (err) {
    try {

      const b = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const json = JSON.parse(decodeURIComponent(escape(window.atob(b))));
      return json;
    } catch (e) {
      return null;
    }
  }
}

export async function isTokenValid(token) {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const payload = decodeToken(token);
  if (!payload) return false;
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < now) return false;
  try {
    const signingInput = `${parts[0]}.${parts[1]}`;
    const ok = await verify(signingInput, parts[2]);
    return !!ok;
  } catch {
    return false;
  }
}

export function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}