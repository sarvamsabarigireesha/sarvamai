import { useEffect, useState } from "react";
import logo from "../assets/logo.png";

export default function Connect({ user, onSaveUser, onDone, toast }) {
  const [status, setStatus] = useState({ facebook: false, google: false });
  const [busy, setBusy] = useState(false);
  const ch = user.channels || {};

  useEffect(() => {
    fetch("/api/auth/status")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => setStatus({ facebook: false, google: false }));

    const q = new URLSearchParams(window.location.search);
    if (q.get("connected") === "meta" || q.get("connected") === "google") {
      loadOfficial();
      window.history.replaceState({}, "", window.location.pathname);
    }
    const err = q.get("meta_error") || q.get("yt_error");
    if (err) {
      toast(err);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  async function loadOfficial() {
    setBusy(true);
    try {
      const me = await fetch("/api/me").then((r) => r.json());
      if (!me.connected) {
        toast("Official login failed");
        return;
      }
      const channels = { ...(user.channels || {}) };
      if (me.facebook) {
        channels.fb = {
          handle: me.page?.name || me.facebook.name,
          connected: true,
          official: true,
          personal: true,
          id: me.page?.id || me.facebook.id,
        };
      }
      if (me.instagram) {
        channels.ig = {
          handle: me.instagram.handle,
          connected: true,
          official: true,
          id: me.instagram.id,
          followers: me.instagram.followers,
        };
      }
      if (me.youtube) {
        channels.yt = {
          handle: me.youtube.handle,
          connected: true,
          official: true,
          id: me.youtube.id,
        };
      }
      onSaveUser({ channels });
      toast("Official accounts updated");
    } catch {
      toast("Could not read official profile");
    } finally {
      setBusy(false);
    }
  }

  const ready = ["ig", "fb", "yt"].some((id) => ch[id]?.official);

  return (
    <div className="connect-wrap">
      <div className="brand" style={{ marginBottom: 28 }}>
        <img src={logo} alt="" />
        SarvamAI
      </div>
      <div className="kicker">Official login · Buffer-style</div>
      <h1 style={{ fontFamily: "var(--serif)", fontSize: 42, fontWeight: 400, margin: "8px 0 10px" }}>
        Connect Instagram, Facebook & YouTube
      </h1>
      <p className="lede">
        Facebook personal + Page, Instagram Professional, YouTube channel — official windows. Handle type chesi
        fake connect kadu.
      </p>

      <div className="connect-grid">
        <article className="card connect-card fb">
          <div>
            <strong>Facebook personal + Page</strong>
            <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>
              {ch.fb?.official ? `${ch.fb.handle} · official` : "Facebook login — personal profile and pages you manage"}
            </div>
          </div>
          {ch.fb?.official ? (
            <span className="pill live">Official</span>
          ) : (
            <button
              className="btn btn-solid btn-sm"
              disabled={busy}
              onClick={() => {
                if (!status.facebook) return toast("Add META_APP_ID + META_APP_SECRET in Cloudflare");
                window.location.href = "/api/auth/facebook";
              }}
            >
              Continue with Facebook
            </button>
          )}
        </article>

        <article className="card connect-card ig">
          <div>
            <strong>Instagram</strong>
            <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>
              {ch.ig?.official
                ? `${ch.ig.handle} · official`
                : "Must be Professional / Creator, linked to a Facebook Page. Personal IG: switch in IG Settings → Account type."}
            </div>
          </div>
          {ch.ig?.official ? (
            <span className="pill live">Official</span>
          ) : (
            <button
              className="btn btn-solid btn-sm"
              disabled={busy}
              onClick={() => {
                if (!status.facebook) return toast("Add META secrets first");
                window.location.href = "/api/auth/facebook";
              }}
            >
              Connect Instagram via Facebook
            </button>
          )}
        </article>

        <article className="card connect-card yt">
          <div>
            <strong>YouTube channel</strong>
            <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>
              {ch.yt?.official ? `${ch.yt.handle} · official` : "Google account that owns the channel"}
            </div>
          </div>
          {ch.yt?.official ? (
            <span className="pill live">Official</span>
          ) : (
            <button
              className="btn btn-solid btn-sm"
              disabled={busy}
              onClick={() => {
                if (!status.google) return toast("Add GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET in Cloudflare");
                window.location.href = "/api/auth/google";
              }}
            >
              Continue with Google
            </button>
          )}
        </article>
      </div>

      {(!status.facebook || !status.google) && (
        <div className="card" style={{ marginTop: 16 }}>
          <h3>Cloudflare secrets (one time)</h3>
          <ol className="setup-ol">
            <li>
              Meta:{" "}
              <a href="https://developers.facebook.com/apps/" target="_blank" rel="noreferrer">
                developers.facebook.com/apps
              </a>{" "}
              → Business app → Facebook Login + Instagram
              <br />
              Redirect: <code>{typeof location !== "undefined" ? location.origin : ""}/api/auth/callback</code>
              <br />
              Secrets: <code>META_APP_ID</code> <code>META_APP_SECRET</code>
            </li>
            <li>
              Google:{" "}
              <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer">
                Google Cloud credentials
              </a>{" "}
              → OAuth client → YouTube Data API
              <br />
              Redirect: <code>{typeof location !== "undefined" ? location.origin : ""}/api/auth/google/callback</code>
              <br />
              Secrets: <code>GOOGLE_CLIENT_ID</code> <code>GOOGLE_CLIENT_SECRET</code>
            </li>
          </ol>
        </div>
      )}

      <button className="btn btn-gold" style={{ marginTop: 22 }} disabled={!ready} onClick={onDone}>
        {ready ? "Open workspace · load my posts" : "Official connect required"}
      </button>
    </div>
  );
}
