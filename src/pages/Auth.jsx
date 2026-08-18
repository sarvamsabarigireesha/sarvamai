import { useState } from "react";
import logo from "../assets/logo.png";
import hero from "../assets/hero-creator.jpg";
import { login, signup } from "../auth.js";
import { InstallHint } from "./Tools.jsx";

export default function Auth({ mode, onMode, onSuccess, onBack }) {
  const signupMode = mode === "signup";
  const [error, setError] = useState("");
  const [showMore, setShowMore] = useState(false);

  function submit(e) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.target);
    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      password: fd.get("password"),
      ig: fd.get("ig"),
      fb: fd.get("fb"),
      yt: fd.get("yt"),
    };
    const res = signupMode ? signup(payload) : login(payload);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    onSuccess(res.user);
  }

  return (
    <div className="auth">
      <div className="auth-art">
        <img src={hero} alt="" />
        <div className="veil">
          <div className="brand">
            <img src={logo} alt="" />
            SarvamAI
          </div>
          <div>
            <div className="kicker">Create once. Publish everywhere.</div>
            <h2
              style={{
                fontFamily: "var(--serif)",
                fontSize: 42,
                lineHeight: 1.05,
                fontWeight: 400,
                maxWidth: 480,
              }}
            >
              Instagram, Facebook and YouTube — one login, one queue.
            </h2>
          </div>
        </div>
      </div>
      <div className="auth-panel">
        <form className="auth-card" onSubmit={submit}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <button type="button" className="btn btn-ghost btn-sm" onClick={onBack}>
              ← About SarvamAI
            </button>
            <InstallHint toast={() => {}} />
          </div>
          <h1>{signupMode ? "Create your account" : "Log in"}</h1>
          <p className="lede" style={{ fontSize: 14, marginBottom: 8 }}>
            {signupMode
              ? "Anyone can sign up. Your queue, inbox and channels stay on your account."
              : "Nee email + password tho direct ga workspace ki vellu."}
          </p>

          {signupMode && (
            <div className="field">
              <label>Full name</label>
              <input name="name" required placeholder="Your name" autoComplete="name" />
            </div>
          )}
          <div className="field">
            <label>Email</label>
            <input name="email" type="email" required placeholder="you@gmail.com" autoComplete="email" />
          </div>
          <div className="field">
            <label>Password</label>
            <input name="password" type="password" required placeholder="••••••••" autoComplete={signupMode ? "new-password" : "current-password"} />
          </div>

          {signupMode && (
            <>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowMore((v) => !v)}>
                {showMore ? "Hide channels" : "Add IG / FB / YouTube handles"}
              </button>
              {showMore && (
                <>
                  <div className="field">
                    <label>Instagram</label>
                    <input name="ig" placeholder="@your.handle" />
                  </div>
                  <div className="field">
                    <label>Facebook page</label>
                    <input name="fb" placeholder="Your page name" />
                  </div>
                  <div className="field">
                    <label>YouTube channel</label>
                    <input name="yt" placeholder="Your channel name" />
                  </div>
                </>
              )}
            </>
          )}

          {error && <p className="auth-error">{error}</p>}
          <button className="btn btn-solid btn-wide" type="submit" style={{ marginTop: 8 }}>
            {signupMode ? "Sign up & open workspace" : "Log in"}
          </button>
          <p style={{ marginTop: 16, color: "var(--muted)", fontSize: 13 }}>
            {signupMode ? "Already have an account?" : "New here? Anyone can join."}{" "}
            <button
              type="button"
              style={{ color: "var(--teal)", fontWeight: 800 }}
              onClick={() => {
                setError("");
                onMode(signupMode ? "login" : "signup");
              }}
            >
              {signupMode ? "Log in" : "Create account"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
