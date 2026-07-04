import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type User = { email: string; name: string };
type AuthCtx = {
  user: User | null;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  register: (name: string, email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);
const USERS_KEY = "ast_users";
const SESSION_KEY = "ast_session";

type StoredUser = { email: string; name: string; password: string };

function readUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem(SESSION_KEY);
      if (s) setUser(JSON.parse(s));
    } catch {}
    setReady(true);
  }, []);

  const login: AuthCtx["login"] = (email, password) => {
    const users = readUsers();
    const u = users.find((x) => x.email.toLowerCase() === email.toLowerCase());
    if (!u || u.password !== password) return { ok: false, error: "Invalid email or password" };
    const sess = { email: u.email, name: u.name };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sess));
    setUser(sess);
    return { ok: true };
  };

  const register: AuthCtx["register"] = (name, email, password) => {
    if (!name || !email || password.length < 6)
      return { ok: false, error: "Password must be at least 6 characters" };
    const users = readUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase()))
      return { ok: false, error: "Email already registered" };
    users.push({ name, email, password });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    const sess = { email, name };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sess));
    setUser(sess);
    return { ok: true };
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return (
    <Ctx.Provider value={{ user, login, register, logout }}>
      {ready ? children : null}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be inside AuthProvider");
  return c;
}
