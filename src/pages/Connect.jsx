import { useState } from "react";
import logo from "../assets/logo.png";

const NETWORKS = [
  { id: "ig", name: "Instagram", hint: "Business or Creator account", cls: "ig" },
  { id: "fb", name: "Facebook Page", hint: "A page you manage", cls: "fb" },
  { id: "yt", name: "YouTube", hint: "Your channel", cls: "yt" },
];

export default function Connect({ user, onSaveUser, onDone, toast }) {
  const [open, setOpen] = useState(null);
  const [handle, setHandle] = useState("");
  const ch = user.channels || {};

  function start(id) {
    setOpen(id);
    setHandle((ch[id]?.handle || "").replace(/^@/, ""));
  }

  function authorize() {
    if (!handle.trim()) {
      toast("Enter the account name");
      return;
    }
    const h = open === "ig" && !handle.startsWith("@") ? "@" + handle.replace(/\s+/g, "") : handle.trim();
    const next = {
      ...(user.channels || {}),
      [open]: { handle: h, connected: true, connectedAt: new Date().toISOString() },
    };
    onSaveUser({
      channels: next,
      handle: open === "ig" ? h : user.handle,
    });
    toast(NETWORKS.find((n) => n.id === open).name + " connected");
    setOpen(null);
  }

  const ready = NETWORKS.some((n) => ch[n.id]?.connected);

  return (
    <div className="connect-wrap">
      <div className="brand" style={{ marginBottom: 28 }}>
        <img src={logo} alt="" />
        SarvamAI
      </div>
      <div className="kicker">Like Buffer · connect first</div>
      <h1 style={{ fontFamily: "var(--serif)", fontSize: 42, fontWeight: 400, margin: "8px 0 10px" }}>
        Connect your social accounts
      </h1>
      <p className="lede">
        Signup ayyaka ikkada Instagram, Facebook, YouTube connect chey. Tarvata nee posts, Auto DM, comments
        visible avuthayi.
      </p>

      <div className="connect-grid">
        {NETWORKS.map((n) => {
          const c = ch[n.id];
          return (
            <article className={"card connect-card " + n.cls} key={n.id}>
              <div>
                <strong>{n.name}</strong>
                <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>
                  {c?.connected ? c.handle : n.hint}
                </div>
              </div>
              {c?.connected ? (
                <span className="pill live">Connected</span>
              ) : (
                <button className="btn btn-solid btn-sm" onClick={() => start(n.id)}>
                  Connect
                </button>
              )}
            </article>
          );
        })}
      </div>

      {open && (
        <div className="card" style={{ maxWidth: 480, marginTop: 16 }}>
          <h3>Authorize {NETWORKS.find((n) => n.id === open).name}</h3>
          <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 10 }}>
            Official Meta / Google login tarvata ikkada replace avuthundi. Ippudu nee handle confirm chey.
          </p>
          <div className="field">
            <label>Account</label>
            <input value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="@your.handle" />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-solid" onClick={authorize}>
              Authorize
            </button>
            <button className="btn btn-ghost" onClick={() => setOpen(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <button className="btn btn-gold" style={{ marginTop: 22 }} disabled={!ready} onClick={onDone}>
        {ready ? "Open workspace · see my posts" : "Connect at least one account"}
      </button>
    </div>
  );
}
