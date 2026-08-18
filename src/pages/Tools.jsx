import { useEffect, useRef, useState } from "react";
import { Ico } from "../components/Icons.jsx";

const SAMPLE_LEADS = [
  "@priya.m",
  "@rohit.fits",
  "@meerawanders",
  "@karts.hyd",
  "@ananya.fan",
  "@hyd.foodie",
  "@glassskin.club",
  "@banjara.brunch",
];

const FIRST = ["Aarav", "Diya", "Kabir", "Meera", "Rohan", "Saanvi", "Ishaan", "Anaya", "Vihaan", "Myra"];
const LAST = ["Reddy", "Sharma", "Nair", "Patel", "Khan", "Iyer", "Das", "Rao", "Singh", "Fernandes"];

function downloadCsv(name, rows) {
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function BulkDM({ toast, user }) {
  const [plats, setPlats] = useState(["ig", "fb"]);
  const [list, setList] = useState(SAMPLE_LEADS.join("\n"));
  const [msg, setMsg] = useState(
    "Hey {{name}} 👋 new drop is live on my store — comment LINK on the last reel or tap here: sarvamai.app/s/{{me}}"
  );
  const [delay, setDelay] = useState(8);
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState([]);
  const [sent, setSent] = useState(0);
  const stop = useRef(false);

  const targets = list
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  function toggle(id) {
    setPlats((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  }

  async function start() {
    const allowed = plats.filter((p) => user?.channels?.[p]?.connected);
    if (!allowed.length) {
      toast("Connect Instagram / Facebook first — then send");
      return;
    }
    if (!plats.length) {
      toast("Pick Instagram, Facebook, or both");
      return;
    }
    if (!targets.length) {
      toast("Add at least one username");
      return;
    }
    if (!msg.trim()) {
      toast("Write a message");
      return;
    }
    stop.current = false;
    setRunning(true);
    setSent(0);
    setLog([]);
    const me = (user?.handle || "you").replace("@", "");
    for (let i = 0; i < targets.length; i++) {
      if (stop.current) break;
      const handle = targets[i].startsWith("@") ? targets[i] : "@" + targets[i];
      const name = handle.replace("@", "").split(".")[0];
      const text = msg.replaceAll("{{name}}", name).replaceAll("{{me}}", me);
      await new Promise((r) => setTimeout(r, Math.max(2, Number(delay) || 8) * 180));
      if (stop.current) break;
      setSent(i + 1);
      setLog((prev) => [
        {
          id: Date.now() + i,
          handle,
          plats: [...plats],
          text,
          time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        },
        ...prev,
      ]);
    }
    setRunning(false);
    toast(stop.current ? "Campaign paused" : "Bulk DM finished · " + targets.length + " queued");
  }

  return (
    <>
      <div className="card" style={{ marginBottom: 14, background: "linear-gradient(120deg,#1a1408,#0c0e14)" }}>
        <div className="kicker">InSenderBot · Bulk DM</div>
        <h3 style={{ fontFamily: "var(--serif)", fontSize: 26, fontWeight: 400 }}>
          Send one message to many — from your IG + FB
        </h3>
        <p style={{ color: "var(--muted)", maxWidth: 640, marginTop: 6 }}>
          Connected IG / FB nundi list ki message velthundi. Connect lekunda start avvadhu. Real Meta API
          review tarvata live inbox ki paduthundi — ippudu campaign log save avuthundi.
        </p>
      </div>

      <div className="cards-4" style={{ marginBottom: 12 }}>
        <MetricFake label="Recipients" value={String(targets.length)} delta="From your paste / CSV" />
        <MetricFake label="Sent this run" value={String(sent)} delta={running ? "Sending…" : "Idle"} />
        <MetricFake label="Gap" value={delay + "s"} delta="Between each DM" />
        <MetricFake label="From" value={plats.length === 2 ? "IG + FB" : plats[0] === "fb" ? "Facebook" : "Instagram"} delta={user?.handle || "your account"} />
      </div>

      <div className="cards-2">
        <div className="card">
          <h3>Campaign</h3>
          <div className="plat-row" style={{ marginBottom: 10 }}>
            <button type="button" className={"plat ig" + (plats.includes("ig") ? " on" : "")} onClick={() => toggle("ig")}>
              Instagram
              <small>{user?.channels?.ig?.handle || user?.handle}</small>
            </button>
            <button type="button" className={"plat fb" + (plats.includes("fb") ? " on" : "")} onClick={() => toggle("fb")}>
              Facebook
              <small>{user?.channels?.fb?.handle || "Your Page"}</small>
            </button>
          </div>
          <div className="field">
            <label>Usernames — one per line (people you can already message)</label>
            <textarea rows={8} value={list} onChange={(e) => setList(e.target.value)} />
          </div>
          <div className="field">
            <label>Message · use {"{{name}}"}</label>
            <textarea rows={4} value={msg} onChange={(e) => setMsg(e.target.value)} />
          </div>
          <div className="field">
            <label>Seconds between DMs</label>
            <input type="number" min="3" max="60" value={delay} onChange={(e) => setDelay(e.target.value)} />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {!running ? (
              <button className="btn btn-solid" onClick={start}>
                <Ico name="send" size={16} /> Start bulk send
              </button>
            ) : (
              <button
                className="btn btn-ghost"
                onClick={() => {
                  stop.current = true;
                }}
              >
                Pause
              </button>
            )}
            <button
              className="btn btn-ghost"
              onClick={() => {
                setList(SAMPLE_LEADS.join("\n"));
                toast("Sample leads loaded");
              }}
            >
              Load sample leads
            </button>
          </div>
        </div>
        <div className="card">
          <h3>Send log</h3>
          {!log.length && <p style={{ color: "var(--faint)" }}>Start a run to see each DM here.</p>}
          {log.map((row) => (
            <div className="list-row" key={row.id}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <strong>{row.handle}</strong>
                <div style={{ color: "var(--muted)", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {row.text}
                </div>
              </div>
              <div className="mini-plats">
                {row.plats.map((x) => (
                  <i key={x} className={"dotp " + x}>
                    {x}
                  </i>
                ))}
              </div>
              <span className="pill ok">{row.time}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function MetricFake({ label, value, delta }) {
  return (
    <div className="card metric">
      <div className="lbl">{label}</div>
      <div className="num">{value}</div>
      <div className="delta up">{delta}</div>
    </div>
  );
}

function fakePeople(seed, count, kind) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const n = FIRST[(i + seed) % FIRST.length] + " " + LAST[(i * 3 + seed) % LAST.length];
    const handle = "@" + n.toLowerCase().replace(/\s+/g, ".") + (i % 7 === 0 ? i : "");
    out.push({
      name: n,
      handle,
      type: kind,
      followers: (12 + ((i * 97 + seed) % 880)) + "K",
      mutual: i % 4 === 0 ? "Yes" : "No",
    });
  }
  return out;
}

export function InFollow({ toast, user }) {
  const [ig, setIg] = useState((user?.channels?.ig?.handle || "").replace(/^@/, ""));
  const [fb, setFb] = useState(user?.channels?.fb?.handle || "");
  const [kind, setKind] = useState("followers");
  const [busy, setBusy] = useState(false);
  const [rows, setRows] = useState([]);
  const [src, setSrc] = useState("");
  const [notice, setNotice] = useState("");

  function run(platform) {
    const name = platform === "ig" ? ig : fb;
    if (!String(name).trim()) {
      toast("Enter the " + (platform === "ig" ? "Instagram" : "Facebook") + " profile name");
      return;
    }
    if (!user?.channels?.[platform]?.connected) {
      toast("Connect this account first — then export YOUR followers");
      return;
    }
    setBusy(true);
    setSrc("");
    setNotice("");
    setTimeout(() => {
      const seed = name.length + (platform === "ig" ? 3 : 9);
      const people =
        kind === "both"
          ? [...fakePeople(seed, 18, "follower"), ...fakePeople(seed + 11, 18, "following")]
          : fakePeople(seed, kind === "following" ? 24 : 24, kind === "following" ? "following" : "follower");
      setRows(people);
      setSrc(platform);
      setBusy(false);
      setNotice(
        "@" +
          String(name).replace(/^@/, "") +
          " — Instagram / Facebook do not give apps another account’s full follower list (e.g. 330K). Only the page you manage can be exported after official Meta login. This CSV is a sample of that official path, not scraped users."
      );
      toast("Official list is blocked by Instagram — sample export only");
    }, 900);
  }

  function csv() {
    if (!rows.length) return;
    downloadCsv(
      `sarvamai-${src}-${kind}-${ig || fb}.csv`,
      [["Name", "Handle", "List", "Followers", "Mutual"], ...rows.map((r) => [r.name, r.handle, r.type, r.followers, r.mutual])]
    );
    toast("CSV downloaded");
  }

  return (
    <>
      <div className="card" style={{ marginBottom: 14, background: "linear-gradient(120deg,#101824,#0c0e14)" }}>
        <div className="kicker">InFollow · Export tool</div>
        <h3 style={{ fontFamily: "var(--serif)", fontSize: 26, fontWeight: 400 }}>
          One IG name. One FB name. Followers + following as CSV.
        </h3>
        <p style={{ color: "var(--muted)", maxWidth: 640, marginTop: 6 }}>
          @sabarimala18 lanti vere account 330K followers CSV Instagram allow cheyadu — unofficial scrape
          cheyamu. Nee connected Business account followers matrame official API tho ravadam possible.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 14 }}>
        <div className="cards-2">
          <div className="field">
            <label>Instagram profile</label>
            <input value={ig} onChange={(e) => setIg(e.target.value.replace(/\s+/g, ""))} placeholder="username only" />
          </div>
          <div className="field">
            <label>Facebook profile / page</label>
            <input value={fb} onChange={(e) => setFb(e.target.value)} placeholder="Page or profile name" />
          </div>
        </div>
        <div className="tabs">
          {[
            ["followers", "Followers"],
            ["following", "Following"],
            ["both", "Both lists"],
          ].map(([id, l]) => (
            <button key={id} className={"tab" + (kind === id ? " on" : "")} onClick={() => setKind(id)}>
              {l}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="btn btn-solid" disabled={busy} onClick={() => run("ig")}>
            <Ico name="download" size={16} /> Export Instagram
          </button>
          <button className="btn btn-ghost" disabled={busy} onClick={() => run("fb")}>
            <Ico name="download" size={16} /> Export Facebook
          </button>
          {!!rows.length && (
            <button className="btn btn-gold" onClick={csv}>
              Download CSV · {rows.length}
            </button>
          )}
        </div>
      </div>

      {notice && <p className="auth-error">{notice}</p>}
      {busy && <p style={{ color: "var(--muted)" }}>Checking official access…</p>}

      {!!rows.length && (
        <div className="card">
          <h3>
            {src === "ig" ? "Instagram" : "Facebook"} · {kind} · {rows.length} people
          </h3>
          <div className="table-wrap">
            <table className="grid-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Handle</th>
                  <th>List</th>
                  <th>Followers</th>
                  <th>Mutual</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.handle + r.type}>
                    <td>{r.name}</td>
                    <td>{r.handle}</td>
                    <td>
                      <span className={"pill " + (r.type === "follower" ? "live" : "warm")}>{r.type}</span>
                    </td>
                    <td>{r.followers}</td>
                    <td>{r.mutual}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

export function InstallHint({ toast }) {
  const [evt, setEvt] = useState(null);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const onPrompt = (e) => {
      e.preventDefault();
      setEvt(e);
    };
    const onInstalled = () => {
      setOk(true);
      setEvt(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    if (window.matchMedia("(display-mode: standalone)").matches) setOk(true);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function install() {
    if (evt) {
      evt.prompt();
      const res = await evt.userChoice;
      if (res.outcome === "accepted") {
        setOk(true);
        toast("SarvamAI installed");
      }
      setEvt(null);
      return;
    }
    toast("Phone: browser menu → Add to Home Screen · Desktop: address bar install icon");
  }

  if (ok) return null;
  return (
    <button className="btn btn-gold btn-sm" onClick={install}>
      Install app
    </button>
  );
}
