import { useEffect, useState } from "react";
import Landing from "./pages/Landing.jsx";
import Auth from "./pages/Auth.jsx";
import Workspace from "./pages/Workspace.jsx";
import { currentSession, clearSession, publicUser, updateUser } from "./auth.js";

export default function App() {
  const [view, setView] = useState("auth");
  const [authMode, setAuthMode] = useState("login");
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const session = currentSession();
    if (session) {
      setUser(publicUser(session));
      setView("app");
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
    setUser(publicUser(u));
    setView("app");
    setToast("Welcome to SarvamAI · IG + FB + YouTube ready");
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
        <Auth
          mode={authMode}
          onMode={setAuthMode}
          onSuccess={success}
          onBack={() => setView("landing")}
        />
      )}
      {view === "app" && user && (
        <Workspace user={user} onLogout={logout} onSaveUser={saveUser} toast={setToast} />
      )}
      {toast && <div className="app-toast">{toast}</div>}
    </>
  );
}
