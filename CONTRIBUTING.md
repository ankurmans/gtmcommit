# Contributing to GTM Commit

Thanks for your interest in contributing! GTM Commit is the proof-of-work network for AI-native GTM professionals — and we'd love help from the people actually using AI tools to do go-to-market work.

## Quick Start

**Prerequisites:** Node 20+, npm, a Supabase project, a GitHub OAuth app.

```bash
git clone https://github.com/ankurmans/gtmcommit.git
cd gtmcommit
npm install
cp env.local.example .env.local   # fill in Supabase + GitHub OAuth values
npm run dev                       # starts on http://localhost:3002
```

To set up the database, run the migrations in `supabase/migrations/` against your Supabase project (in order). The `supabase` CLI helpers are wired up:

```bash
npm run db:push      # push local migrations to your Supabase project
npm run db:reset     # reset the local Supabase database
```

## What to Contribute

Good first contributions:

- **New AI tool detection rules** — see [lib/github/detect-ai.ts](lib/github/detect-ai.ts). If you know how a tool (e.g. Sourcegraph Cody, Tabnine) signs commits, add a detector.
- **New external proof verifiers** — see [lib/proofs/](lib/proofs/). Each platform (Vercel, Lovable, Replit, etc.) gets its own verifier file. Adding Railway, Netlify, Fly.io, Clay, or Notion are all on the wishlist.
- **Scoring algorithm refinements** — see [lib/scoring/calculate.ts](lib/scoring/calculate.ts). If you have a case where the score doesn't reflect reality, open an issue with a reproduction.
- **Bug fixes** — anything that breaks for real users.

If you want to ship something larger, please open an issue first so we can sanity-check the scope.

## Pull Request Process

1. Fork the repo and create a branch from `main`: `git checkout -b feat/your-thing` or `fix/your-thing`
2. Make your change. Keep PRs focused — one logical change per PR.
3. Run the test suite: `npm test`
4. Run the linter: `npm run lint`
5. Commit using conventional-ish messages (`feat:`, `fix:`, `docs:`, `chore:`)
6. Open a PR with a short description of what changed and why.

## Code Style

- TypeScript everywhere. No `any` without a comment explaining why.
- Tailwind for styling. Components in `components/`, pages in `app/`.
- Keep changes minimal — don't refactor unrelated code in a feature PR.

## Privacy Bar

This is critical. **GTM Commit never stores source code** — only commit metadata. Any contribution that touches GitHub sync (`lib/github/`) must preserve this contract:

- No commit message bodies for private repos (first line only, redacted as `[private]`)
- No file contents, diffs, or patches stored — only aggregate stats (additions/deletions/files-changed counts)
- No private repo names exposed via public APIs or pages

If you're changing how we fetch or store GitHub data, call it out explicitly in the PR.

## Questions?

Open an issue or reach out to [@AnkurShrestha](https://twitter.com/AnkurShrestha) on Twitter.
