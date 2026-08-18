import { useEffect, useState } from "react";
import { Ico } from "../components/Icons.jsx";
import { queueKey } from "../auth.js";
import { POSTS } from "../data.js";

export function settingsKey(email) {
  return "sarvamai-set-" + String(email || "guest").toLowerCase();
}

export function loadSettings(email) {
  try {
    return (
      JSON.parse(localStorage.getItem(settingsKey(email))) || {
        autoDmOn: false,
        autoDmKeywords: "LINK, PRICE, WANT, SEND",
        autoDmReply: "Hey {{name}}! Here's the link from that post 💛",
        autoCommentOn: false,
        autoCommentAll: true,
        autoCommentText: "Comment LINK for the details — I’ll DM you 💌",
      }
    );
  } catch {
    return {};
  }
}

export function saveSettings(email, s) {
  localStorage.setItem(settingsKey(email), JSON.stringify(s));
}

export function PostsFeed({ user, toast, go }) {
  const qkey = queueKey(user?.email);
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(qkey);
      if (raw) return JSON.parse(raw);
    } catch {
      /* ignore */
    }
    return POSTS;
  });

  const connected = ["ig", "fb", "yt"].filter((id) => user.channels?.[id]?.connected);

  if (!connected.length) {
    return (
      <div className="card">
        <h3>No accounts connected</h3>
        <p style={{ color: "var(--muted)", margin: "8px 0 14px" }}>
          Buffer laage — first Instagram / Facebook / YouTube connect chey, tarvata posts ikkada kanipistayi.
        </p>
        <button className="btn btn-solid" onClick={() => go("channels")}>
          Connect accounts
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="kicker">Your connected channels</div>
        <h3 style={{ fontFamily: "var(--serif)", fontSize: 26, fontWeight: 400 }}>Posts</h3>
        <p style={{ color: "var(--muted)" }}>
          {connected.map((id) => user.channels[id].handle).join(" · ")}
        </p>
      </div>
      {items
        .filter((p) => p.platforms.some((x) => connected.includes(x)))
        .map((p) => (
          <div className="card" key={p.id} style={{ marginBottom: 10 }}>
            <div className="list-row" style={{ border: 0, padding: 0 }}>
              <div className="thumb sm">{(p.file || "post").split(".").pop()}</div>
              <div style={{ flex: 1 }}>
                <strong>{p.caption}</strong>
                <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 4 }}>
                  {p.file} · {p.when} · {p.hashtags}
                </div>
              </div>
              <div className="mini-plats">
                {p.platforms.map((x) => (
                  <i key={x} className={"dotp " + x}>
                    {x}
                  </i>
                ))}
              </div>
              <span className={"pill " + (p.status === "live" ? "live" : "ok")}>{p.status}</span>
            </div>
          </div>
        ))}
      <button className="btn btn-ghost" onClick={() => go("schedule")}>
        + Schedule more
      </button>
    </>
  );
}

export function AutoComments({ user, toast }) {
  const [s, setS] = useState(() => loadSettings(user?.email));

  useEffect(() => {
    saveSettings(user?.email, s);
  }, [s, user?.email]);

  const igOk = user.channels?.ig?.connected;

  return (
    <>
      <div className="card" style={{ marginBottom: 14, background: "linear-gradient(120deg,#141018,#0c0e14)" }}>
        <div className="kicker">Auto comments · all posts</div>
        <h3 style={{ fontFamily: "var(--serif)", fontSize: 26, fontWeight: 400 }}>
          First comment on every post — automatically
        </h3>
        <p style={{ color: "var(--muted)", maxWidth: 620 }}>
          Enable chesthe scheduled / posted anni IG + FB posts meeda nee first comment paduthundi. Oka sari on
          cheste chalu — prati post ki malli add cheyakkarledu.
        </p>
      </div>
      {!igOk && (
        <p className="auth-error">Connect Instagram first (Channels) — then enable.</p>
      )}
      <div className="card">
        <div className="list-row" style={{ border: 0 }}>
          <div style={{ flex: 1 }}>
            <strong>Enable auto comments</strong>
            <div style={{ color: "var(--muted)", fontSize: 13 }}>Applies to every post in the queue</div>
          </div>
          <button
            className={"switch" + (s.autoCommentOn ? " on" : "")}
            onClick={() => {
              if (!igOk) {
                toast("Connect Instagram first");
                return;
              }
              setS({ ...s, autoCommentOn: !s.autoCommentOn });
              toast(!s.autoCommentOn ? "Auto comments ON for all posts" : "Auto comments off");
            }}
          >
            <i />
          </button>
        </div>
        <div className="list-row">
          <div style={{ flex: 1 }}>
            <strong>All posts</strong>
            <div style={{ color: "var(--muted)", fontSize: 13 }}>New + already scheduled</div>
          </div>
          <button
            className={"switch" + (s.autoCommentAll ? " on" : "")}
            onClick={() => setS({ ...s, autoCommentAll: !s.autoCommentAll })}
          >
            <i />
          </button>
        </div>
        <div className="field">
          <label>Comment text</label>
          <textarea rows={3} value={s.autoCommentText} onChange={(e) => setS({ ...s, autoCommentText: e.target.value })} />
        </div>
        <p style={{ color: s.autoCommentOn ? "var(--ok)" : "var(--faint)", fontWeight: 700 }}>
          {s.autoCommentOn ? "Live · every post gets this comment" : "Off"}
        </p>
      </div>
    </>
  );
}

export function AutoDMPanel({ user, toast }) {
  const [s, setS] = useState(() => loadSettings(user?.email));
  const ready = user.channels?.ig?.connected || user.channels?.fb?.connected;

  useEffect(() => {
    saveSettings(user?.email, s);
  }, [s, user?.email]);

  return (
    <>
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="list-row" style={{ border: 0, padding: 0 }}>
          <div style={{ flex: 1 }}>
            <div className="kicker">Auto DM</div>
            <h3 style={{ fontFamily: "var(--serif)", fontSize: 26, fontWeight: 400 }}>
              {s.autoDmOn ? "Enabled" : "Disabled"}
            </h3>
            <p style={{ color: "var(--muted)" }}>
              Comment lo keywords vaste connected IG / FB account nundi DM velthundi.
            </p>
          </div>
          <button
            className={"switch" + (s.autoDmOn ? " on" : "")}
            onClick={() => {
              if (!ready) {
                toast("Connect Instagram or Facebook first");
                return;
              }
              setS({ ...s, autoDmOn: !s.autoDmOn });
              toast(!s.autoDmOn ? "Auto DM enabled" : "Auto DM disabled");
            }}
          >
            <i />
          </button>
        </div>
      </div>
      {!ready && <p className="auth-error">Connect a channel before enabling Auto DM.</p>}
      <div className="card">
        <div className="field">
          <label>Trigger keywords</label>
          <input value={s.autoDmKeywords} onChange={(e) => setS({ ...s, autoDmKeywords: e.target.value })} />
        </div>
        <div className="field">
          <label>DM reply</label>
          <textarea rows={3} value={s.autoDmReply} onChange={(e) => setS({ ...s, autoDmReply: e.target.value })} />
        </div>
        <p style={{ color: s.autoDmOn ? "var(--ok)" : "var(--faint)", fontWeight: 700 }}>
          {s.autoDmOn ? "Watching comments on all live posts" : "Toggle ON to start"}
        </p>
      </div>
    </>
  );
}
