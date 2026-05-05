#!/usr/bin/env node
/**
 * Seed avatares pros 5 curator bots + 5 seed humans + logo institucional.
 *
 * Fontes:
 *  - randomuser.me/api/portraits — rostos reais curados pra match com personas
 *    (license livre, padrão de mercado pra placeholder avatars)
 *  - Arquivo local — logo SINAPSE pro avatar institucional do @sinapse-bot
 *
 * Idempotente: pula entries que já apontam pro avatar correto (use --force pra regen).
 *
 * IMPORTANTE: @ownersoier (Matheus) NUNCA entra aqui — é pessoa real, dono da marca.
 *
 * Uso: node scripts/seed-curator-avatars.mjs [--force]
 */
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import { readFile } from "node:fs/promises";
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

// Cada entry tem:
//  - id      : UUID do profile
//  - label   : pra log
//  - src     : URL https:// OU caminho local de arquivo
//  - path    : path no bucket (avatars/<path>)
//  - mode    : 'cover' (rostos, fit cover) ou 'contain' (logo, padding branco)
const ENTRIES = [
  // ─── Curator bots (5) ───────────────────────────────────────
  {
    id: "00000000-0000-0000-0000-000000000001",
    label: "@sinapse-bot (logo institucional)",
    src: "C:/Users/Caio Imori/Downloads/icon-snps.png",
    path: "curators/1.webp",
    mode: "contain",
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    label: "@rafael.automacao",
    src: "https://randomuser.me/api/portraits/men/80.jpg",
    path: "curators/2.webp",
    mode: "cover",
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    label: "@ana.ianegocios",
    src: "https://randomuser.me/api/portraits/women/30.jpg",
    path: "curators/3.webp",
    mode: "cover",
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    label: "@lucas.growth",
    src: "https://randomuser.me/api/portraits/men/50.jpg",
    path: "curators/4.webp",
    mode: "cover",
  },
  {
    id: "00000000-0000-0000-0000-000000000005",
    label: "@carla.dados",
    src: "https://randomuser.me/api/portraits/women/40.jpg",
    path: "curators/5.webp",
    mode: "cover",
  },
  // ─── Seed humans (5) — postam no feed, faltavam avatar humano ─
  {
    id: "e26f0024-7769-49f4-989f-3c533f6cd385",
    label: "@maridata (Mariana Souza)",
    src: "https://randomuser.me/api/portraits/women/70.jpg",
    path: "seed-humans/maridata.webp",
    mode: "cover",
  },
  {
    id: "80c07fb0-8d04-4193-b716-5daaefcf09b1",
    label: "@rafaeldev (Rafael Costa)",
    src: "https://randomuser.me/api/portraits/men/30.jpg",
    path: "seed-humans/rafaeldev.webp",
    mode: "cover",
  },
  {
    id: "0ef6d466-49b1-49e2-92f3-9a78966897ba",
    label: "@analima (Ana Lima)",
    src: "https://randomuser.me/api/portraits/women/60.jpg",
    path: "seed-humans/analima.webp",
    mode: "cover",
  },
  {
    id: "d5678591-d7d3-4570-9ff8-e6458f41e200",
    label: "@juliaai (Julia Martins)",
    src: "https://randomuser.me/api/portraits/women/50.jpg",
    path: "seed-humans/juliaai.webp",
    mode: "cover",
  },
  {
    id: "fbbdd70f-356d-42c2-a4df-82cf411e8188",
    label: "@pedrotech (Pedro Tech)",
    src: "https://randomuser.me/api/portraits/men/60.jpg",
    path: "seed-humans/pedrotech.webp",
    mode: "cover",
  },
];

const SIZE = 256;
const BUCKET = "avatars";
const DELAY_MS = 400;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function loadSource(src) {
  if (src.startsWith("http://") || src.startsWith("https://")) {
    const res = await fetch(src, {
      headers: { "User-Agent": "Mozilla/5.0 sinapse-club-curator-seed" },
    });
    if (!res.ok) throw new Error(`Download falhou (${src}): ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  }
  return readFile(src);
}

async function processAndUpload(entry, idx) {
  const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${entry.path}`;

  const { data: existing } = await supabase
    .from("profiles")
    .select("avatar_url, username")
    .eq("id", entry.id)
    .single();

  if (!existing) {
    console.log(`[${idx + 1}] ${entry.label}: profile não encontrado — pula`);
    return;
  }

  if (existing.avatar_url === publicUrl && !FORCE) {
    console.log(`[${idx + 1}] ${entry.label} já correto — pula`);
    return;
  }

  console.log(`[${idx + 1}] ${entry.label}: lendo ${entry.src}...`);
  const raw = await loadSource(entry.src);

  let pipeline = sharp(raw);
  if (entry.mode === "contain") {
    // Logo: preserva proporção, fundo branco do brandbook (BONE)
    pipeline = pipeline.resize(SIZE, SIZE, {
      fit: "contain",
      background: { r: 245, g: 245, b: 240, alpha: 1 },
    });
  } else {
    // Rosto: corta cobrindo o frame
    pipeline = pipeline.resize(SIZE, SIZE, {
      fit: "cover",
      position: "center",
    });
  }
  const webp = await pipeline.webp({ quality: 85 }).toBuffer();

  console.log(`[${idx + 1}] subindo ${(webp.length / 1024).toFixed(1)}KB → ${entry.path}`);
  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(entry.path, webp, {
      contentType: "image/webp",
      upsert: true,
      cacheControl: "31536000",
    });
  if (upErr) throw upErr;

  const { error: updErr } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl })
    .eq("id", entry.id);
  if (updErr) throw updErr;

  console.log(`[${idx + 1}] OK -> ${publicUrl}`);
}

async function main() {
  console.log(`Seedando ${ENTRIES.length} avatares (${SIZE}x${SIZE} webp)`);
  console.log(`Force mode: ${FORCE}`);
  for (let i = 0; i < ENTRIES.length; i++) {
    try {
      await processAndUpload(ENTRIES[i], i);
    } catch (e) {
      console.error(`[${i + 1}] erro: ${e.message}`);
    }
    if (i < ENTRIES.length - 1) await sleep(DELAY_MS);
  }
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
