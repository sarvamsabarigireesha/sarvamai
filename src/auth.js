const USERS_KEY = "sarvamai-users";
const SESSION_KEY = "sarvamai-session";

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function listUsers() {
  return read(USERS_KEY, []);
}

export function currentSession() {
  const email = localStorage.getItem(SESSION_KEY);
  if (!email) return null;
  return listUsers().find((u) => u.email === email) || null;
}

export function setSession(email) {
  localStorage.setItem(SESSION_KEY, email);
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function channelsFrom() {
  return {
    ig: { handle: "", connected: false },
    fb: { handle: "", connected: false },
    yt: { handle: "", connected: false },
  };
}

export function signup({ name, email, password, ig, fb, yt }) {
  const users = listUsers();
  const mail = String(email || "").trim().toLowerCase();
  if (!mail || !password) return { ok: false, error: "Email and password required" };
  if (password.length < 4) return { ok: false, error: "Password must be at least 4 characters" };
  if (users.some((u) => u.email === mail)) return { ok: false, error: "Account already exists — log in" };

  const display = String(name || mail.split("@")[0]).trim();
  const handle = "@" + display.toLowerCase().replace(/\s+/g, ".");
  const user = {
    id: "u" + Date.now(),
    name: display,
    email: mail,
    password: String(password),
    handle,
    channels: channelsFrom(),
    onboarded: false,
  };
  users.push(user);
  write(USERS_KEY, users);
  setSession(user.email);
  return { ok: true, user };
}

export function login({ email, password }) {
  const users = listUsers();
  const mail = String(email || "").trim().toLowerCase();
  const user = users.find((u) => u.email === mail);
  if (!user) return { ok: false, error: "No account with this email — create one" };
  if (user.password !== String(password)) return { ok: false, error: "Wrong password" };
  setSession(user.email);
  return { ok: true, user };
}

export function publicUser(user) {
  if (!user) return null;
  const { password, ...rest } = user;
  return rest;
}

export function queueKey(email) {
  return "sarvamai-queue-" + String(email || "guest").toLowerCase();
}

export function hasConnected(user) {
  return !!(
    user?.channels &&
    Object.values(user.channels).some((c) => c && c.connected && c.handle)
  );
}

export function updateUser(email, patch) {
  const users = listUsers();
  const mail = String(email || "").trim().toLowerCase();
  const next = users.map((u) => (u.email === mail ? { ...u, ...patch, email: u.email, id: u.id } : u));
  write(USERS_KEY, next);
  return next.find((u) => u.email === mail) || null;
}
