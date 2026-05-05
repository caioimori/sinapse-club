#!/usr/bin/env node
/**
 * Seed avatares pros 5 curator bots.
 *
 * Fonte: thispersondoesnotexist.com (StyleGAN2 / NVIDIA, AI-generated faces).
 * Sem risco LGPD — ninguém real existe nessas fotos.
 *
 * Idempotente: pula bots que já têm avatar apontando pra avatars/curators/.
 *
 * Uso: node scripts/seed-curator-avatars.mjs [--force]
 */
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const FORCE = process.argv.includes("--force");

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error("Faltando NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const REAL_SUPABASE_URL = SUPABASE_URL.includes("/sb")
  ? "https://udwpovojufbpzrexvkcc.supabase.co"
  : SUPABASE_URL;

const supabase = createClient(REAL_SUPABASE_URL, SERVICE_ROLE, {
  auth: { persistSession: false },
});

const BOT_IDS = [
  "00000000-0000-0000-0000-000000000001",
  "00000000-0000-0000-0000-000000000002",
  "00000000-0000-0000-0000-000000000003",
  "00000000-0000-0000-0000-000000000004",
  "00000000-0000-0000-0000-000000000005",
];

const SIZE = 256;
const BUCKET = "avatars";
const FOLDER = "curators";
const SOURCE = "https://thispersondoesnotexist.com/";
const DELAY_MS = 1500; // respeita o serviço

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function downloadFace() {
  const res = await fetch(SOURCE, {
    headers: { "User-Agent": "Mozilla/5.0 sinapse-club-curator-seed" },
  });
  if (!res.ok) throw new Error(`Download falhou: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function processAndUpload(botId, idx) {
  const filename = `${FOLDER}/${idx + 1}.webp`;
  const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${filename}`;

  const { data: existing } = await supabase
    .from("profiles")
    .select("avatar_url, username")
    .eq("id", botId)
    .single();

  const alreadySeeded =
    existing?.avatar_url?.includes(`${FOLDER}/${idx + 1}.webp`);

  if (alreadySeeded && !FORCE) {
    console.log(`[${idx + 1}] @${existing.username} já tem avatar — pula`);
    return;
  }

  console.log(`[${idx + 1}] @${existing?.username ?? botId}: baixando rosto...`);
  const raw = await downloadFace();
  const webp = await sharp(raw)
    .resize(SIZE, SIZE, { fit: "cover", position: "center" })
    .webp({ quality: 82 })
    .toBuffer();

  console.log(`[${idx + 1}] subindo ${(webp.length / 1024).toFixed(1)}KB...`);
  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(filename, webp, {
      contentType: "image/webp",
      upsert: true,
      cacheControl: "31536000",
    });
  if (upErr) throw upErr;

  const { error: updErr } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl })
    .eq("id", botId);
  if (updErr) throw updErr;

  console.log(`[${idx + 1}] OK -> ${publicUrl}`);
}

async function main() {
  console.log(`Seedando ${BOT_IDS.length} curator avatars (${SIZE}x${SIZE} webp)`);
  console.log(`Force mode: ${FORCE}`);
  for (let i = 0; i < BOT_IDS.length; i++) {
    try {
      await processAndUpload(BOT_IDS[i], i);
    } catch (e) {
      console.error(`[${i + 1}] erro: ${e.message}`);
    }
    if (i < BOT_IDS.length - 1) await sleep(DELAY_MS);
  }
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
