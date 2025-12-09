const API_BASE = 'https://d19ea6e8af62ba1b.mokky.dev';

async function tryParseJson(response) {
  try { return await response.json(); } catch { return null; }
}

async function registerUser({ username, password }) {
  const url = `${API_BASE}/users`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const body = await tryParseJson(res);
      throw new Error(body?.message || `Registration failed: ${res.status} ${res.statusText}`);
    }

    return await tryParseJson(res) || { username };
  } catch (err) {
   
  }
}

async function loginUser({ username, password }) {
  try {
    const loginRes = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (loginRes.ok) {
      return await tryParseJson(loginRes);
    }
  } catch (_) {}

  const qurl = `${API_BASE}/users?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
  const res = await fetch(qurl);
  if (!res.ok) {
    throw new Error(`Login failed: ${res.status} ${res.statusText}`);
  }
  const data = await tryParseJson(res);
  if (Array.isArray(data) && data.length > 0) return data[0];
  throw new Error('Неверный логин или пароль');
}

export { API_BASE, registerUser, loginUser };