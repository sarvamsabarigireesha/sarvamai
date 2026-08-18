import { useEffect, useState } from "react";
import Landing from "./pages/Landing.jsx";
import Auth from "./pages/Auth.jsx";
import Connect from "./pages/Connect.jsx";
import Workspace from "./pages/Workspace.jsx";
import { currentSession, clearSession, publicUser, updateUser, hasConnected } from "./auth.js";

export default function App() {
  const [view, setView] = useState("auth");
  const [authMode, setAuthMode] = useState("login");
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const session = currentSession();
    if (session) {
      const u = publicUser(session);
      setUser(u);
      setView(hasConnected(u) || u.onboarded ? "app" : "connect");
    } else {
      setView("auth");
      setAuthMode("login");
    }
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  function enter(mode) {
    setAuthMode(mode);
    setView("auth");
  }

  function success(u) {
    const pub = publicUser(u);
    setUser(pub);
    setView(hasConnected(pub) ? "app" : "connect");
    setToast(hasConnected(pub) ? "Welcome back" : "Account created · connect Instagram next");
  }

  function logout() {
    clearSession();
    setUser(null);
    setAuthMode("login");
    setView("auth");
  }

  function saveUser(patch) {
    if (!user) return;
    const next = updateUser(user.email, patch);
    if (next) setUser(publicUser(next));
  }

  return (
    <>
      {view === "landing" && <Landing onEnter={enter} />}
      {view === "auth" && (
        <Auth mode={authMode} onMode={setAuthMode} onSuccess={success} onBack={() => setView("landing")} />
      )}
      {view === "connect" && user && (
        <Connect
          user={user}
          onSaveUser={saveUser}
          toast={setToast}
          onDone={() => {
            saveUser({ onboarded: true });
            setView("app");
          }}
        />
      )}
      {view === "app" && user && (
        <Workspace user={user} onLogout={logout} onSaveUser={saveUser} toast={setToast} />
      )}
      {toast && <div className="app-toast">{toast}</div>}
    </>
  );
}
