import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { Ico } from "../components/Icons.jsx";
import { queueKey } from "../auth.js";
import { BulkDM, InFollow, InstallHint } from "./Tools.jsx";
import { PostsFeed, AutoComments, AutoDMPanel } from "./Social.jsx";
import Connect from "./Connect.jsx";
import {
  CREATOR,
  WEEKLY,
  CONVERSATIONS,
  AUTOMATIONS,
  POSTS,
  PRODUCTS,
  ACCOUNTS,
  PEAK_SLOTS,
  inr,
  compact,
} from "../data.js";

const NAV = [
  { id: "home", label: "Home", icon: "home" },
  { id: "posts", label: "Posts", icon: "file" },
  { id: "inbox", label: "Priority inbox", icon: "inbox", badge: "4" },
  { id: "auto", label: "Auto DM", icon: "chat" },
  { id: "comments", label: "Auto comments", icon: "hash" },
  { id: "bulkdm", label: "Bulk DM", icon: "send" },
  { id: "export", label: "InFollow export", icon: "users" },
  { id: "schedule", label: "Bulk scheduler", icon: "cal" },
  { id: "studio", label: "AI Studio", icon: "spark" },
  { id: "store", label: "Affiliate store", icon: "bag" },
  { id: "channels", label: "Connect accounts", icon: "settings" },
];

export default function Workspace({ user, onLogout, onSaveUser, toast }) {
  const [page, setPage] = useState("home");
  const [open, setOpen] = useState(false);
  const go = (id) => {
    setPage(id);
    setOpen(false);
  };

  return (
    <div className="shell">
      <aside className={"side" + (open ? " open" : "")}>
        <div className="brand" style={{ padding: "4px 8px" }}>
          <img src={logo} alt="" />
          SarvamAI
        </div>
        <nav>
          {NAV.map((n) => (
            <button
              key={n.id}
              className={"nav-item" + (page === n.id ? " active" : "")}
              onClick={() => go(n.id)}
            >
              <Ico name={n.icon} size={16} />
              {n.label}
              {n.badge && <span className="badge">{n.badge}</span>}
            </button>
          ))}
        </nav>
        <div className="side-user">
          <div className="avatar">{(user.name || "A")[0]}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 750, fontSize: 13 }}>{user.name}</div>
            <div style={{ color: "var(--faint)", fontSize: 11 }}>{user.handle || CREATOR.handle}</div>
          </div>
        </div>
      </aside>
      <div className="main">
        <header className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button className="btn btn-ghost btn-sm mobile-toggle" onClick={() => setOpen((v) => !v)}>
              <Ico name="menu" size={16} />
            </button>
            <h2>{NAV.find((n) => n.id === page)?.label}</h2>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <span className={"pill " + (user.channels?.ig?.connected ? "live" : "muted")}>
              IG {user.channels?.ig?.connected ? user.channels.ig.handle : "not connected"}
            </span>
            <span className={"pill " + (user.channels?.fb?.connected ? "fb" : "muted")}>
              FB {user.channels?.fb?.connected ? user.channels.fb.handle : "not connected"}
            </span>
            <span className={"pill " + (user.channels?.yt?.connected ? "yt" : "muted")}>
              YT {user.channels?.yt?.connected ? user.channels.yt.handle : "not connected"}
            </span>
            <InstallHint toast={toast} />
            <button className="btn btn-ghost btn-sm" onClick={onLogout}>
              <Ico name="logout" size={14} /> Log out
            </button>
          </div>
        </header>
        <div className="page">
          {page === "home" && <Home go={go} user={user} />}
          {page === "inbox" && <Inbox toast={toast} />}
          {page === "auto" && <AutoDM toast={toast} />}
          {page === "bulkdm" && <BulkDM toast={toast} user={user} />}
          {page === "export" && <InFollow toast={toast} user={user} />}
          {page === "schedule" && <Scheduler toast={toast} user={user} />}
          {page === "studio" && <Studio toast={toast} />}
          {page === "store" && <Store toast={toast} user={user} />}
          {page === "channels" && <Channels user={user} onSaveUser={onSaveUser} toast={toast} />}
        </div>
      </div>
    </div>
  );
}

function Home({ go, user }) {
  const queued = POSTS.filter((p) => p.status === "scheduled").length;
  return (
    <>
      <div className="card" style={{ marginBottom: 12, background: "linear-gradient(120deg,#10241f,#0c0e14)" }}>
        <div className="kicker">Hey {user?.name?.split(" ")[0] || "creator"} · SarvamAI</div>
        <h3 style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 400, margin: "6px 0 8px" }}>
          Content ready undi. Post + reply ikkada autopilot.
        </h3>
        <p style={{ color: "var(--muted)", maxWidth: 640 }}>
          Reels folder nundi bulk upload — Instagram, Facebook and YouTube ki oka queue. Comments ki Auto DM.
          Nuvvu create cheste chalu.
        </p>
      </div>
      <div className="cards-4">
        <Metric label="Channels" value="3" delta="IG + FB + YouTube" />
        <Metric label="Queued this week" value={String(queued)} delta="Peak slots auto-filled" />
        <Metric label="AI replies today" value="186" delta="You typed 0" />
        <Metric label="Store from DMs" value={inr(12840)} delta="Links sent on autopilot" />
      </div>
      <div className="cards-2" style={{ marginTop: 12 }}>
        <div className="card">
          <h3>This week’s reach</h3>
          <Bars data={WEEKLY} field="reach" />
        </div>
        <div className="card">
          <h3>Needs 30 seconds, not an hour</h3>
          <Row title="12 reels sitting in camera roll" sub="Drop them → auto-spread across IG + FB + YouTube" action="Bulk queue" onClick={() => go("schedule")} />
          <Row title="2 buying-intent DMs" sub="Hot leads — AI can send the store link" action="Inbox" onClick={() => go("inbox")} />
          <Row title="Tonight 7:30 PM · 3 platforms" sub="Same reel → IG Reel + FB Reel + YT Short" action="See queue" onClick={() => go("schedule")} />
          <Row title="Caption missing on drafts" sub="Generate in your voice, Telugu-English mix" action="Studio" onClick={() => go("studio")} />
        </div>
      </div>
      <div className="cards-3" style={{ marginTop: 12 }}>
        <Quick title="Bulk schedule" body="Select 10 videos. Peak hours on Instagram, Facebook and YouTube." cta="Open scheduler" onClick={() => go("schedule")} />
        <Quick title="Bulk DM" body="InSenderBot — one message to your IG + FB lead list." cta="Open Bulk DM" onClick={() => go("bulkdm")} />
        <Quick title="Export followers" body="Type one IG or FB name. Download followers / following CSV." cta="InFollow" onClick={() => go("export")} />
      </div>
    </>
  );
}

function Metric({ label, value, delta }) {
  return (
    <div className="card metric">
      <div className="lbl">{label}</div>
      <div className="num">{value}</div>
      <div className="delta up">{delta}</div>
    </div>
  );
}

function Bars({ data, field }) {
  const max = Math.max(...data.map((d) => d[field]));
  return (
    <div className="bars">
      {data.map((d) => (
        <div className="bar-col" key={d.d}>
          <div className="bar" style={{ height: `${(d[field] / max) * 100}%` }} />
          <span>{d.d}</span>
        </div>
      ))}
    </div>
  );
}

function Row({ title, sub, action, onClick }) {
  return (
    <div className="list-row">
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 13.5 }}>{title}</div>
        <div style={{ color: "var(--muted)", fontSize: 12 }}>{sub}</div>
      </div>
      <button className="btn btn-ghost btn-sm" onClick={onClick}>
        {action}
      </button>
    </div>
  );
}

function Quick({ title, body, cta, onClick }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p style={{ color: "var(--muted)", fontSize: 13.5, marginBottom: 14 }}>{body}</p>
      <button className="btn btn-solid btn-sm" onClick={onClick}>
        {cta}
      </button>
    </div>
  );
}

function Inbox({ toast }) {
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState(CONVERSATIONS[0].id);
  const [draft, setDraft] = useState("");
  const [threads, setThreads] = useState(CONVERSATIONS);

  const list = threads.filter((t) => filter === "all" || t.intent === filter);
  const cur = threads.find((t) => t.id === active) || list[0];

  function send() {
    if (!draft.trim() || !cur) return;
    setThreads((prev) =>
      prev.map((t) =>
        t.id === cur.id
          ? {
              ...t,
              preview: draft,
              unread: 0,
              messages: [...t.messages, { from: "me", text: draft, time: "Now" }],
            }
          : t
      )
    );
    setDraft("");
    toast("Reply sent");
  }

  return (
    <div className="inbox" style={{ margin: "-22px" }}>
      <div className="thread-list">
        <div style={{ padding: 12 }} className="tabs">
          {[
            ["all", "All"],
            ["hot", "Buying"],
            ["brand", "Brands"],
            ["warm", "Fans"],
          ].map(([id, l]) => (
            <button key={id} className={"tab" + (filter === id ? " on" : "")} onClick={() => setFilter(id)}>
              {l}
            </button>
          ))}
        </div>
        {list.map((t) => (
          <button
            key={t.id}
            className={"thread" + (cur?.id === t.id ? " active" : "")}
            onClick={() => setActive(t.id)}
          >
            <div className="n">{t.name}</div>
            <div className="tm">{t.time}</div>
            <span className={"pill " + t.intent}>{t.tag}</span>
            <div className="p">{t.preview}</div>
          </button>
        ))}
      </div>
      {cur && (
        <div className="chat">
          <div className="chat-head">
            <div>
              <strong>{cur.name}</strong>
              <div style={{ color: "var(--muted)", fontSize: 12 }}>{cur.handle}</div>
            </div>
            <span className={"pill " + cur.intent}>{cur.tag}</span>
          </div>
          <div className="bubbles">
            {cur.messages.map((m, i) => (
              <div key={i} className={"bubble " + m.from}>
                {m.text}
                <span className="meta">
                  {m.time}
                  {m.auto ? " · Auto DM" : ""}
                </span>
              </div>
            ))}
          </div>
          <div className="composer">
            <input
              className="search"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Write a reply or let AI send the store link…"
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button
              className="btn btn-ghost"
              onClick={() => {
                setDraft("Here's the link from my store — use ANANYA20 for extra off 💛");
                toast("AI draft ready");
              }}
            >
              AI
            </button>
            <button className="btn btn-solid" onClick={send}>
              <Ico name="send" size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AutoDM({ toast }) {
  const [items, setItems] = useState(AUTOMATIONS);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name: "", trigger: "", reply: "", platforms: ["ig", "fb"] });

  function add(e) {
    e.preventDefault();
    setItems([
      {
        id: "a" + Date.now(),
        name: form.name || "New automation",
        trigger: form.trigger || "LINK",
        post: "New reel",
        sent: 0,
        converted: 0,
        active: true,
        platforms: form.platforms,
        reply: form.reply || "Thanks for commenting — here's the link!",
      },
      ...items,
    ]);
    setShow(false);
    setForm({ name: "", trigger: "", reply: "", platforms: ["ig", "fb"] });
    toast("Automation live on IG + FB comments");
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
        <p style={{ color: "var(--muted)", maxWidth: 560 }}>
          Nuvvu reply ivvadaniki time ledu — comment lo LINK / PRICE / WANT vaste, IG and Facebook DMs instant ga
          velthayi.
        </p>
        <button className="btn btn-solid" onClick={() => setShow((v) => !v)}>
          <Ico name="plus" size={16} /> New automation
        </button>
      </div>
      {show && (
        <form className="card" onSubmit={add} style={{ marginBottom: 14 }}>
          <div className="cards-3">
            <div className="field">
              <label>Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Reel — festive haul" />
            </div>
            <div className="field">
              <label>Trigger keywords</label>
              <input value={form.trigger} onChange={(e) => setForm({ ...form, trigger: e.target.value })} placeholder="LINK, PRICE, WANT" />
            </div>
            <div className="field">
              <label>DM reply</label>
              <input value={form.reply} onChange={(e) => setForm({ ...form, reply: e.target.value })} placeholder="Hey {{name}}! Here's the link…" />
            </div>
          </div>
          <button className="btn btn-solid">Arm on Instagram + Facebook</button>
        </form>
      )}
      {items.map((a) => (
        <div className="card" key={a.id} style={{ marginBottom: 10 }}>
          <div className="list-row" style={{ border: 0, padding: 0 }}>
            <div style={{ flex: 1 }}>
              <strong>{a.name}</strong>
              <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>
                Keywords · {a.trigger} · Post: {a.post} · IG + FB
              </div>
              <div style={{ color: "var(--faint)", fontSize: 13, marginTop: 6 }}>{a.reply}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 800 }}>{a.sent}</div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>{a.converted} converted</div>
              <button
                className={"switch" + (a.active ? " on" : "")}
                style={{ marginTop: 8 }}
                onClick={() => {
                  setItems(items.map((x) => (x.id === a.id ? { ...x, active: !x.active } : x)));
                  toast(a.active ? "Paused" : "Resumed");
                }}
              >
                <i />
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function localISO(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function ymd(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function fmtWhen(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return `${days[d.getDay()]} ${pad(d.getDate())} · ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function nextSlots(count, taken) {
  const out = [];
  const day = new Date(2026, 7, 18);
  let guard = 0;
  const floor = new Date(2026, 7, 18, 12, 0, 0);
  while (out.length < count && guard < 80) {
    for (const s of PEAK_SLOTS) {
      const [hh, mm] = s.t.split(":").map(Number);
      const slot = new Date(day);
      slot.setHours(hh, mm, 0, 0);
      if (slot < floor) continue;
      const key = localISO(slot);
      if (taken.has(key)) continue;
      taken.add(key);
      out.push(key);
      if (out.length >= count) break;
    }
    day.setDate(day.getDate() + 1);
    guard += 1;
  }
  return out;
}

function weekDays() {
  return Array.from({ length: 7 }, (_, i) => new Date(2026, 7, 17 + i));
}

function platLabel(list) {
  const map = { ig: "IG", fb: "FB", yt: "YouTube" };
  if (!list.length) return "a platform";
  if (list.length === 3) return "IG + FB + YouTube";
  return list.map((p) => map[p] || p).join(" + ");
}

function Scheduler({ toast, user }) {
  const key = queueKey(user?.email);
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch {
      /* ignore */
    }
    return POSTS;
  });
  const [batch, setBatch] = useState([]);
  const [platforms, setPlatforms] = useState(["ig", "fb", "yt"]);
  const [first, setFirst] = useState("Comment LINK — I’ll DM the store 💌");
  const [tags, setTags] = useState("#hyderabad #reelsindia #telugucreator #shorts");
  const [drag, setDrag] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(items));
  }, [items, key]);

  const connected = ACCOUNTS.map((a) => ({
    ...a,
    handle: user?.channels?.[a.id]?.handle || a.handle,
  }));

  function togglePlat(id) {
    setPlatforms((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  }

  function ingest(fileList) {
    const files = Array.from(fileList || []).filter(
      (f) => /video|image/.test(f.type || "") || /\.(mp4|mov|webm|jpg|png)$/i.test(f.name)
    );
    if (!files.length) {
      toast("Drop mp4 / mov / images");
      return;
    }
    const added = files.map((f) => ({
      id: "b" + Math.random().toString(36).slice(2, 8),
      file: f.name,
      caption: f.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
    }));
    setBatch((b) => [...b, ...added]);
    toast(added.length + " files ready to queue");
  }

  function queueBatch() {
    if (!batch.length) {
      toast("First drop your ready reels");
      return;
    }
    if (!platforms.length) {
      toast("Pick Instagram, Facebook, YouTube — any mix");
      return;
    }
    const taken = new Set(items.filter((p) => p.status === "scheduled").map((p) => p.when.slice(0, 16)));
    const slots = nextSlots(batch.length, taken);
    const fresh = batch.map((b, i) => ({
      id: "p" + Date.now() + i,
      file: b.file,
      caption: b.caption,
      when: slots[i] || "2026-08-21T19:30",
      status: "scheduled",
      type: "Reel",
      platforms: [...platforms],
      hashtags: tags,
      first,
    }));
    setItems((prev) => [...fresh, ...prev]);
    setBatch([]);
    toast(fresh.length + " queued on " + platLabel(platforms));
  }

  function postNow(id) {
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "live", when: localISO(new Date()) } : p))
    );
    const p = items.find((x) => x.id === id);
    toast("Posted now to " + platLabel(p?.platforms || platforms));
  }

  const list = items.filter((p) => filter === "all" || p.platforms.includes(filter) || p.status === filter);
  const days = weekDays();

  return (
    <>
      <div className="cards-4" style={{ marginBottom: 12 }}>
        <Metric label="In queue" value={String(items.filter((p) => p.status === "scheduled").length)} delta="Auto-spread on peak hours" />
        <Metric label="Instagram" value={String(items.filter((p) => p.platforms.includes("ig") && p.status !== "live").length)} delta={connected[0].handle} />
        <Metric label="Facebook" value={String(items.filter((p) => p.platforms.includes("fb") && p.status !== "live").length)} delta={connected[1].handle} />
        <Metric label="YouTube" value={String(items.filter((p) => p.platforms.includes("yt") && p.status !== "live").length)} delta={connected[2].handle} />
      </div>

      <div className="card" style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h3>Bulk queue — Instagram + Facebook + YouTube</h3>
            <p style={{ color: "var(--muted)", fontSize: 13.5 }}>
              Ready unna videos anni okasari drop. Same file → IG Reel, FB Reel, YouTube Short. Peak slots auto.
            </p>
          </div>
          <div className="plat-row">
            {connected.map((a) => (
              <button
                key={a.id}
                type="button"
                className={"plat " + a.id + (platforms.includes(a.id) ? " on" : "")}
                onClick={() => togglePlat(a.id)}
              >
                {a.name}
                <small>{a.handle}</small>
              </button>
            ))}
          </div>
        </div>

        <label
          className={"dropzone" + (drag ? " over" : "")}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            ingest(e.dataTransfer.files);
          }}
        >
          <input
            type="file"
            accept="video/*,image/*,.mp4,.mov,.webm"
            multiple
            hidden
            onChange={(e) => ingest(e.target.files)}
          />
          <strong>Drop a week of original videos here</strong>
          <span>or click to pick many · mp4 / mov · same batch → IG + FB + YouTube Shorts</span>
        </label>

        {!!batch.length && (
          <div className="batch-list">
            {batch.map((b) => (
              <div className="batch-item" key={b.id}>
                <div className="thumb">{b.file.split(".").pop()}</div>
                <input
                  value={b.caption}
                  onChange={(e) =>
                    setBatch(batch.map((x) => (x.id === b.id ? { ...x, caption: e.target.value } : x)))
                  }
                />
                <button className="btn btn-ghost btn-sm" onClick={() => setBatch(batch.filter((x) => x.id !== b.id))}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="cards-2" style={{ marginTop: 8 }}>
          <div className="field">
            <label>Hashtags for this batch</label>
            <input value={tags} onChange={(e) => setTags(e.target.value)} />
          </div>
          <div className="field">
            <label>First comment + Auto DM hook</label>
            <input value={first} onChange={(e) => setFirst(e.target.value)} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="btn btn-solid" onClick={queueBatch}>
            Queue {batch.length || ""} on {platLabel(platforms)}
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => {
              ingest([
                { name: "diwali-look.mp4", type: "video/mp4" },
                { name: "office-to-dinner.mp4", type: "video/mp4" },
                { name: "serum-night-routine.mp4", type: "video/mp4" },
                { name: "yt-shorts-hook.mp4", type: "video/mp4" },
              ]);
            }}
          >
            Load sample batch
          </button>
        </div>
      </div>

      <h3 style={{ margin: "6px 0 10px" }}>This week on IG · FB · YouTube</h3>
      <div className="week">
        {days.map((d) => {
          const key = ymd(d);
          const cell = items.filter((p) => p.when && p.when.slice(0, 10) === key);
          return (
            <div className="week-day" key={key}>
              <div className="wd">
                {d.toLocaleDateString("en-IN", { weekday: "short" })}
                <b>{d.getDate()}</b>
              </div>
              {cell.length ? (
                cell.map((p) => (
                  <div className="slot" key={p.id}>
                    <em>{p.when.slice(11, 16)}</em>
                    <span>{p.file}</span>
                    <div className="mini-plats">
                      {p.platforms.map((x) => (
                        <i key={x} className={"dotp " + x}>
                          {x}
                        </i>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="slot empty">open slot</div>
              )}
            </div>
          );
        })}
      </div>

      <div className="tabs">
        {[
          ["all", "All queue"],
          ["ig", "Instagram"],
          ["fb", "Facebook"],
          ["yt", "YouTube"],
          ["live", "Already live"],
        ].map(([id, l]) => (
          <button key={id} className={"tab" + (filter === id ? " on" : "")} onClick={() => setFilter(id)}>
            {l}
          </button>
        ))}
      </div>

      {list.map((p) => (
        <div className="list-row" key={p.id}>
          <div className="thumb sm">{(p.file || "reel").split(".").pop()}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700 }}>{p.caption}</div>
            <div style={{ color: "var(--muted)", fontSize: 12 }}>
              {p.file} · {fmtWhen(p.when)} · {p.hashtags}
            </div>
          </div>
          <div className="mini-plats">
            {p.platforms.map((x) => (
              <i key={x} className={"dotp " + x}>
                {x === "ig" ? "IG" : x === "fb" ? "FB" : "YT"}
              </i>
            ))}
          </div>
          <span className={"pill " + (p.status === "live" ? "live" : "ok")}>{p.status}</span>
          {p.status !== "live" && (
            <>
              <button className="btn btn-solid btn-sm" onClick={() => postNow(p.id)}>
                Post now
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setItems(items.filter((x) => x.id !== p.id));
                  toast("Removed from queue");
                }}
              >
                Remove
              </button>
            </>
          )}
        </div>
      ))}
    </>
  );
}

const CAP_BANK = [
  "Humidity called. I didn’t pick up — monsoon fits that survive Tank Bund walks.",
  "3 products I actually finish. No shelf decoration. No 12-step theatre.",
  "Stop posting daily. Start posting this one format that converts comments into DMs.",
  "Hyderabad brunch uniform: gold, linen, and sneakers you can actually run for a table in.",
];

function Studio({ toast }) {
  const [topic, setTopic] = useState("monsoon street style in Hyderabad");
  const [out, setOut] = useState(null);

  function gen() {
    const cap = CAP_BANK[Math.floor(Math.random() * CAP_BANK.length)];
    const tags = [
      "#hyderabad",
      "#reelsindia",
      "#indiancreator",
      "#monsoonfit",
      "#streetstyleindia",
      "#telugucreator",
      "#banjarahills",
      "#sarvamai",
    ];
    setOut({
      caption: cap,
      tags: tags.join(" "),
      first: "Comment LINK and I’ll DM the store 💌",
      keywords: "LINK, FIT, WHERE, PRICE",
    });
    toast("Caption pack ready");
  }

  return (
    <div className="cards-2">
      <div className="card">
        <h3>AI captions & hashtags</h3>
        <p style={{ color: "var(--muted)", fontSize: 13.5, marginBottom: 12 }}>
          Time lekunda post cheyali ante caption ikkade generate chesko — Telugu-English mix.
        </p>
        <div className="field">
          <label>What’s the reel?</label>
          <textarea rows={4} value={topic} onChange={(e) => setTopic(e.target.value)} />
        </div>
        <button className="btn btn-solid" onClick={gen}>
          Generate
        </button>
      </div>
      <div className="card">
        <h3>Output</h3>
        {out ? (
          <>
            <p style={{ fontFamily: "var(--serif)", fontSize: 22, lineHeight: 1.25 }}>{out.caption}</p>
            <p style={{ color: "var(--teal)", margin: "12px 0", fontSize: 13 }}>{out.tags}</p>
            <p style={{ color: "var(--muted)", fontSize: 13 }}>First comment · {out.first}</p>
            <p style={{ color: "var(--muted)", fontSize: 13, margin: "8px 0 14px" }}>
              Auto DM keywords · {out.keywords}
            </p>
            <button
              className="btn btn-ghost"
              onClick={() => {
                navigator.clipboard?.writeText(out.caption + "\n\n" + out.tags);
                toast("Copied");
              }}
            >
              Copy pack
            </button>
          </>
        ) : (
          <p style={{ color: "var(--faint)" }}>Generate to see caption, tags, first comment and DM triggers.</p>
        )}
      </div>
    </div>
  );
}

function Store({ toast, user }) {
  const [cat, setCat] = useState("All");
  const cats = ["All", "Beauty", "Fashion", "Tech"];
  const list = PRODUCTS.filter((p) => cat === "All" || p.cat === cat);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div className="kicker">Your storefront</div>
          <p style={{ color: "var(--muted)" }}>Link generate chesi Auto DM lo pettu — nuvvu type cheyakkarledu</p>
        </div>
        <button
          className="btn btn-gold"
          onClick={() => {
            navigator.clipboard?.writeText("https://sarvamai.app/s/" + (user?.handle || "you").replace("@", ""));
            toast("Storefront link copied");
          }}
        >
          Copy store link
        </button>
      </div>
      <div className="tabs">
        {cats.map((c) => (
          <button key={c} className={"tab" + (cat === c ? " on" : "")} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
      </div>
      <div className="prod-grid">
        {list.map((p) => (
          <article className="card prod" key={p.id}>
            <img src={p.img} alt={p.name} />
            <div style={{ color: "var(--muted)", fontSize: 12 }}>
              {p.brand} · {p.cat}
            </div>
            <strong>{p.name}</strong>
            <div style={{ display: "flex", justifyContent: "space-between", margin: "8px 0 12px" }}>
              <span>{inr(p.price)}</span>
              <span className="pill ok">{p.commission}% commission</span>
            </div>
            <button
              className="btn btn-solid btn-wide"
              onClick={() => {
                navigator.clipboard?.writeText(`https://sarvamai.app/r/${p.id}/${(user?.handle || "you").replace("@", "")}`);
                toast("Affiliate link copied · " + p.name);
              }}
            >
              Generate link
            </button>
          </article>
        ))}
      </div>
    </>
  );
}

function Channels({ user, onSaveUser, toast }) {
  const [name, setName] = useState(user.name || "");
  const [ig, setIg] = useState(user.channels?.ig?.handle || user.handle || "");
  const [fb, setFb] = useState(user.channels?.fb?.handle || "");
  const [yt, setYt] = useState(user.channels?.yt?.handle || "");

  function save(e) {
    e.preventDefault();
    const handle = ig.startsWith("@") ? ig : "@" + String(ig || name).replace(/\s+/g, ".").toLowerCase();
    onSaveUser?.({
      name,
      handle,
      channels: {
        ig: { handle, connected: true },
        fb: { handle: fb || name, connected: true },
        yt: { handle: yt || name, connected: true },
      },
    });
    toast("Channels saved on your account");
  }

  return (
    <form className="card" onSubmit={save} style={{ maxWidth: 640 }}>
      <div className="kicker">Your profiles</div>
      <h3 style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 400, marginBottom: 8 }}>
        Connect Instagram, Facebook and YouTube
      </h3>
      <p style={{ color: "var(--muted)", marginBottom: 12 }}>
        Ikkada pettina names Bulk DM, InFollow and scheduler anni use chestayi. Account nidi — vere user ki kanipinchavu.
      </p>
      <div className="field">
        <label>Display name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="field">
        <label>Instagram</label>
        <input value={ig} onChange={(e) => setIg(e.target.value)} placeholder="@your.handle" />
      </div>
      <div className="field">
        <label>Facebook page</label>
        <input value={fb} onChange={(e) => setFb(e.target.value)} placeholder="Your page" />
      </div>
      <div className="field">
        <label>YouTube channel</label>
        <input value={yt} onChange={(e) => setYt(e.target.value)} placeholder="Your channel" />
      </div>
      <button className="btn btn-solid" type="submit">
        Save channels
      </button>
    </form>
  );
}
