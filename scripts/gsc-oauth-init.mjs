#!/usr/bin/env node
/**
 * One-shot OAuth initialization for Google Search Console.
 *
 * Reads the OAuth client JSON downloaded from Google Cloud Console
 * (the "Desktop app" client type), opens a browser to Google's consent
 * screen, captures the auth code via a localhost callback, exchanges it
 * for a refresh token, and saves the credentials to
 * `~/.config/gsc-huamei-oauth.json`.
 *
 * Run:
 *   node scripts/gsc-oauth-init.mjs [path-to-client-json]
 *
 * Default client JSON path: ~/Downloads/huamei-oauth-client.json
 * Output:                   ~/.config/gsc-huamei-oauth.json
 *
 * The output file contains the refresh_token, client_id, client_secret,
 * and the email of the authorized account. The puller script reads
 * from this file at runtime to mint short-lived access tokens.
 *
 * In OAuth "Testing" mode, the refresh_token expires after 7 days.
 * Re-run this script weekly to refresh. The puller will print a clear
 * "refresh token expired" error when this happens.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { resolve, join } from "node:path";
import { createServer } from "node:http";
import { exec } from "node:child_process";

const SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"];
const PORT = 9876;
const REDIRECT_URI = `http://localhost:${PORT}/callback`;

function openBrowser(url) {
  const opener =
    process.platform === "darwin" ? "open" :
    process.platform === "win32" ? "start" : "xdg-open";
  exec(`${opener} "${url}"`);
}

async function main() {
  const clientPathArg = process.argv[2];
  const clientPath = clientPathArg
    ? resolve(clientPathArg.replace(/^~/, homedir()))
    : join(homedir(), "Downloads/huamei-oauth-client.json");

  if (!existsSync(clientPath)) {
    console.error(`❌ Client JSON not found at: ${clientPath}`);
    console.error(`   Download it from https://console.cloud.google.com/apis/credentials?project=huamei-496403`);
    console.error(`   then pass the path: node scripts/gsc-oauth-init.mjs /path/to/file.json`);
    process.exit(1);
  }

  const raw = JSON.parse(readFileSync(clientPath, "utf8"));
  // OAuth client JSON has the credentials under "installed" (Desktop app) or "web".
  const creds = raw.installed ?? raw.web ?? raw;
  if (!creds.client_id || !creds.client_secret) {
    console.error("❌ The JSON doesn't look like an OAuth client credentials file.");
    console.error("   Expected fields: client_id, client_secret (under .installed or .web)");
    process.exit(1);
  }

  console.log(`✓ Loaded OAuth client: ${creds.client_id.slice(0, 32)}...`);

  // Start a tiny local HTTP server to capture the redirect.
  const codePromise = new Promise((resolveCode, rejectCode) => {
    const server = createServer((req, res) => {
      const url = new URL(req.url, `http://localhost:${PORT}`);
      if (url.pathname !== "/callback") {
        res.writeHead(404).end();
        return;
      }
      const code = url.searchParams.get("code");
      const err = url.searchParams.get("error");
      if (err) {
        res.writeHead(400, { "Content-Type": "text/html" });
        res.end(`<h1>Authorization failed</h1><p>${err}</p>You can close this tab.`);
        rejectCode(new Error(`OAuth error: ${err}`));
        return;
      }
      if (!code) {
        res.writeHead(400).end("No code in callback.");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(`<h1 style="font-family:system-ui">✓ Authorization captured</h1><p>You can close this tab and return to the terminal.</p>`);
      server.close();
      resolveCode(code);
    });
    server.listen(PORT, () => {
      console.log(`✓ Local callback server listening on http://localhost:${PORT}`);
    });
    server.on("error", rejectCode);
  });

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", creds.client_id);
  authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", SCOPES.join(" "));
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent"); // force refresh_token return

  console.log("→ Opening Google consent screen in your browser...");
  console.log(`  (if it doesn't open, manually visit: ${authUrl.toString()})`);
  openBrowser(authUrl.toString());

  const code = await codePromise;
  console.log("✓ Got authorization code, exchanging for refresh token...");

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: creds.client_id,
      client_secret: creds.client_secret,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });
  const tokenBody = await tokenRes.json();
  if (!tokenRes.ok || !tokenBody.refresh_token) {
    console.error(`❌ Token exchange failed (HTTP ${tokenRes.status}):`);
    console.error(JSON.stringify(tokenBody, null, 2));
    if (!tokenBody.refresh_token) {
      console.error("");
      console.error("→ Google didn't return a refresh_token. This usually means you previously");
      console.error("  authorized this app and Google reused the existing token. To force a new");
      console.error("  one: open https://myaccount.google.com/permissions, remove 'Huamei SEO");
      console.error("  Puller', then re-run this script.");
    }
    process.exit(1);
  }

  // Probe userinfo to record which account authorized.
  const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${tokenBody.access_token}` },
  });
  const userBody = userRes.ok ? await userRes.json() : { email: "unknown" };

  const output = {
    client_id: creds.client_id,
    client_secret: creds.client_secret,
    refresh_token: tokenBody.refresh_token,
    authorized_email: userBody.email,
    authorized_at: new Date().toISOString(),
    expires_warning: "Refresh token expires after 7 days in OAuth Testing mode. Re-run this script weekly.",
  };

  const outDir = join(homedir(), ".config");
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "gsc-huamei-oauth.json");
  writeFileSync(outPath, JSON.stringify(output, null, 2), { mode: 0o600 });

  console.log("");
  console.log(`✓ Saved refresh token to ${outPath}`);
  console.log(`  Authorized as: ${userBody.email}`);
  console.log(`  File permissions: 0600 (owner read/write only)`);
  console.log("");
  console.log("Next step: run the daily puller — `npx tsx scripts/gsc-pull.ts`");
}

main().catch((err) => {
  console.error("❌ Failed:", err.message);
  process.exit(1);
});
