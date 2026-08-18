const FB = "https://www.facebook.com/v21.0/dialog/oauth";
const GRAPH = "https://graph.facebook.com/v21.0";
const GOOGLE_AUTH = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN = "https://oauth2.googleapis.com/token";
const SCOPES = [
  "public_profile",
  "email",
  "user_posts",
  "pages_show_list",
  "pages_read_engagement",
  "pages_manage_posts",
  "instagram_basic",
  "instagram_content_publish",
  "instagram_manage_comments",
  "instagram_manage_insights",
].join(",");

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

function originOf(request) {
  return new URL(request.url).origin;
}

function cookieGet(request, name) {
  const cookie = request.headers.get("Cookie") || "";
  const m = cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : "";
}

function setCookie(name, value) {
  return `${name}=${encodeURIComponent(value)}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=5184000`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const p = url.pathname;
    if (p === "/api/auth/status") {
      return json({
        facebook: Boolean(env.META_APP_ID && env.META_APP_SECRET),
        google: Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET),
      });
    }
    if (p === "/api/auth/facebook") return startFacebook(request, env);
    if (p === "/api/auth/callback") return facebookCallback(request, env);
    if (p === "/api/auth/google") return startGoogle(request, env);
    if (p === "/api/auth/google/callback") return googleCallback(request, env);
    if (p === "/api/me") return me(request, env);
    if (p === "/api/posts") return posts(request, env);
    if (p === "/api/comment" && request.method === "POST") return comment(request, env);
    if (p === "/api/export/summary") return exportSummary(request, env);
    if (env.ASSETS) return env.ASSETS.fetch(request);
    return new Response("Not found", { status: 404 });
  },
};

async function startFacebook(request, env) {
  if (!env.META_APP_ID || !env.META_APP_SECRET) {
    return json({ error: "Add META_APP_ID and META_APP_SECRET in Cloudflare" }, 501);
  }
  const u = new URL(FB);
  u.searchParams.set("client_id", env.META_APP_ID);
  u.searchParams.set("redirect_uri", `${originOf(request)}/api/auth/callback`);
  u.searchParams.set("scope", SCOPES);
  u.searchParams.set("response_type", "code");
  u.searchParams.set("state", crypto.randomUUID());
  return Response.redirect(u.toString(), 302);
}

async function facebookCallback(request, env) {
  const url = new URL(request.url);
  const err = url.searchParams.get("error_description") || url.searchParams.get("error");
  if (err) return Response.redirect(`/?meta_error=${encodeURIComponent(err)}`, 302);
  const code = url.searchParams.get("code");
  if (!code) return Response.redirect("/?meta_error=missing_code", 302);
  const tokenUrl = new URL(`${GRAPH}/oauth/access_token`);
  tokenUrl.searchParams.set("client_id", env.META_APP_ID);
  tokenUrl.searchParams.set("client_secret", env.META_APP_SECRET);
  tokenUrl.searchParams.set("redirect_uri", `${originOf(request)}/api/auth/callback`);
  tokenUrl.searchParams.set("code", code);
  const tok = await fetch(tokenUrl).then((r) => r.json());
  if (!tok.access_token) {
    return Response.redirect(`/?meta_error=${encodeURIComponent(tok.error?.message || "token_failed")}`, 302);
  }
  return new Response(null, {
    status: 302,
    headers: { Location: "/?connected=meta", "Set-Cookie": setCookie("sarvamai_meta", tok.access_token) },
  });
}

async function startGoogle(request, env) {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
    return json({ error: "Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in Cloudflare" }, 501);
  }
  const u = new URL(GOOGLE_AUTH);
  u.searchParams.set("client_id", env.GOOGLE_CLIENT_ID);
  u.searchParams.set("redirect_uri", `${originOf(request)}/api/auth/google/callback`);
  u.searchParams.set("response_type", "code");
  u.searchParams.set("access_type", "offline");
  u.searchParams.set("prompt", "consent");
  u.searchParams.set("scope", "https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/userinfo.profile");
  return Response.redirect(u.toString(), 302);
}

async function googleCallback(request, env) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) return Response.redirect("/?yt_error=missing_code", 302);
  const body = new URLSearchParams({
    code,
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET,
    redirect_uri: `${originOf(request)}/api/auth/google/callback`,
    grant_type: "authorization_code",
  });
  const tok = await fetch(GOOGLE_TOKEN, { method: "POST", body }).then((r) => r.json());
  if (!tok.access_token) {
    return Response.redirect(`/?yt_error=${encodeURIComponent(tok.error || "token_failed")}`, 302);
  }
  return new Response(null, {
    status: 302,
    headers: { Location: "/?connected=google", "Set-Cookie": setCookie("sarvamai_google", tok.access_token) },
  });
}

async function me(request) {
  const token = cookieGet(request, "sarvamai_meta");
  const gtok = cookieGet(request, "sarvamai_google");
  const out = { connected: Boolean(token || gtok), facebook: null, page: null, instagram: null, youtube: null };

  if (token) {
    const meRes = await fetch(`${GRAPH}/me?fields=id,name,picture&access_token=${token}`).then((r) => r.json());
    out.facebook = { id: meRes.id, name: meRes.name, official: true, personal: true };
    const pages = await fetch(
      `${GRAPH}/me/accounts?fields=id,name,access_token,instagram_business_account{id,username,followers_count,media_count}&access_token=${token}`
    ).then((r) => r.json());
    if (pages.data?.[0]) {
      out.page = { id: pages.data[0].id, name: pages.data[0].name, official: true, token: pages.data[0].access_token };
    }
    const ig = (pages.data || []).map((p) => p.instagram_business_account).find(Boolean);
    if (ig) {
      out.instagram = {
        id: ig.id,
        handle: "@" + (ig.username || ""),
        followers: ig.followers_count || 0,
        posts: ig.media_count || 0,
        official: true,
      };
    }
  }

  if (gtok) {
    const ch = await fetch("https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true", {
      headers: { Authorization: `Bearer ${gtok}` },
    }).then((r) => r.json());
    const c = ch.items?.[0];
    if (c) {
      out.youtube = {
        id: c.id,
        handle: c.snippet?.title,
        official: true,
        subscribers: Number(c.statistics?.subscriberCount || 0),
      };
    }
  }
  return json(out);
}

async function posts(request) {
  const token = cookieGet(request, "sarvamai_meta");
  const gtok = cookieGet(request, "sarvamai_google");
  const list = [];

  if (token) {
    const pages = await fetch(
      `${GRAPH}/me/accounts?fields=id,name,access_token,instagram_business_account{id}&access_token=${token}`
    ).then((r) => r.json());
    const page = pages.data?.[0];
    const igId = page?.instagram_business_account?.id;
    if (igId && page?.access_token) {
      const media = await fetch(
        `${GRAPH}/${igId}/media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp,permalink,like_count,comments_count&limit=20&access_token=${page.access_token}`
      ).then((r) => r.json());
      for (const m of media.data || []) {
        list.push({
          id: m.id,
          platform: "ig",
          caption: m.caption || "",
          image: m.thumbnail_url || m.media_url,
          when: m.timestamp,
          permalink: m.permalink,
          likes: m.like_count,
          comments: m.comments_count,
          type: m.media_type,
        });
      }
    }
    if (page?.id && page?.access_token) {
      const fb = await fetch(
        `${GRAPH}/${page.id}/posts?fields=id,message,created_time,full_picture,permalink_url&limit=15&access_token=${page.access_token}`
      ).then((r) => r.json());
      for (const m of fb.data || []) {
        list.push({
          id: m.id,
          platform: "fb",
          caption: m.message || "",
          image: m.full_picture,
          when: m.created_time,
          permalink: m.permalink_url,
        });
      }
    }
    const personal = await fetch(
      `${GRAPH}/me/posts?fields=id,message,created_time,full_picture,permalink_url&limit=10&access_token=${token}`
    ).then((r) => r.json());
    for (const m of personal.data || []) {
      list.push({
        id: m.id,
        platform: "fb",
        caption: m.message || "(personal post)",
        image: m.full_picture,
        when: m.created_time,
        permalink: m.permalink_url,
        personal: true,
      });
    }
  }

  if (gtok) {
    const yt = await fetch(
      "https://www.googleapis.com/youtube/v3/search?part=snippet&forMine=true&maxResults=12&type=video&order=date",
      { headers: { Authorization: `Bearer ${gtok}` } }
    ).then((r) => r.json());
    for (const m of yt.items || []) {
      list.push({
        id: m.id?.videoId,
        platform: "yt",
        caption: m.snippet?.title,
        image: m.snippet?.thumbnails?.medium?.url,
        when: m.snippet?.publishedAt,
        permalink: "https://youtube.com/watch?v=" + m.id?.videoId,
      });
    }
  }

  list.sort((a, b) => String(b.when).localeCompare(String(a.when)));
  return json({ posts: list });
}

async function comment(request) {
  const token = cookieGet(request, "sarvamai_meta");
  if (!token) return json({ error: "Official Facebook login required" }, 401);
  const body = await request.json().catch(() => ({}));
  const message = body.message || "Thanks for watching 💛";
  const pages = await fetch(
    `${GRAPH}/me/accounts?fields=access_token,instagram_business_account{id}&access_token=${token}`
  ).then((r) => r.json());
  const page = pages.data?.[0];
  const igId = page?.instagram_business_account?.id;
  if (!igId || !page?.access_token) return json({ error: "No Instagram Professional account on this login" }, 400);
  const media = await fetch(`${GRAPH}/${igId}/media?fields=id&limit=1&access_token=${page.access_token}`).then((r) =>
    r.json()
  );
  const mediaId = body.mediaId || media.data?.[0]?.id;
  if (!mediaId) return json({ error: "No post to comment on yet" }, 400);
  const res = await fetch(`${GRAPH}/${mediaId}/comments`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ message, access_token: page.access_token }),
  }).then((r) => r.json());
  if (res.error) return json({ error: res.error.message }, 400);
  return json({ ok: true, id: res.id });
}

async function exportSummary(request) {
  const data = await me(request).then((r) => r.json());
  if (!data.connected) return json({ error: "Official login required" }, 401);
  return json({
    ok: true,
    followers: data.instagram?.followers || 0,
    handle: data.instagram?.handle || data.facebook?.name || "",
    note: "Meta gives YOUR connected account follower count only. It never gives another ID’s 330K follower names.",
  });
}
