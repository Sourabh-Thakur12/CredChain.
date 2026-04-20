# CredChain

CredChain is a local-first credential issuance and verification prototype built with Next.js 14, App Router, Tailwind CSS, and a simulated append-only blockchain stored in a JSON file.

It is designed to demonstrate a complete certificate lifecycle without Docker, databases, or external services:

- institutes can issue a single certificate
- institutes can bulk issue certificates from CSV
- learners can browse a wallet of issued credentials
- anyone can verify a certificate by ID, hash, or QR link

The app is intentionally self-contained and runs locally with `npm run dev`.

## What This Application Does

CredChain simulates a blockchain-backed certificate platform for vocational or institutional credentials.

Each issued certificate is:

- normalized and validated on the server
- assigned a UUID certificate ID
- hashed with SHA-256
- linked to the previous record using a `previousHash`
- stored in `data/chain.json`
- enriched with a verification URL
- rendered into a downloadable HTML certificate
- paired with a QR code that points to the public verify page

Verification works by looking up the certificate and re-checking the integrity of the local chain.

## Core Features

- Landing page with product overview and live snapshot metrics
- Portal dashboard with overview, analytics, updates, and activity
- Single certificate issuance flow with live preview
- Bulk CSV upload flow for batch issuance
- Local credential wallet with preview and download actions
- Public verification page using certificate ID or hash
- Simulated blockchain ledger stored in a local JSON file
- QR code generation for public verification links
- Printable HTML certificate export
- Clean project structure split by route area and shared helpers

## Tech Stack

- Next.js 14.2.35
- React 18
- TypeScript
- Tailwind CSS 4
- Papa Parse for CSV parsing
- QRCode for QR image generation
- uuid for certificate IDs
- Node.js file system APIs for local persistence

## Local Development

### Requirements

- Node.js 18.17+ or Node.js 20+
- npm

### Install

```bash
npm install
```

### Run the app

```bash
npm run dev
```

Open `http://localhost:3000`.

### Build for production

```bash
npm run build
npm run start
```

## Important Local-Only Notes

- No database is used.
- No external blockchain is used.
- No authentication backend is wired.
- No cloud storage is used.
- The ledger is stored in `data/chain.json`.
- The login screen is visual only and routes into the local portal.
- The verify page includes a "Scan QR Code" tab, but it is currently a UI placeholder, not a real camera scanner.
- Certificate export is HTML-based with browser print/save support rather than a true PDF generation library.

## Project Routes

### Public routes

- `/` - landing page
- `/login` - visual-only login/register screen
- `/verify` - public certificate verification

### Portal routes

- `/portal` - dashboard
- `/portal/overview` - institute overview
- `/portal/issue` - single certificate issuance
- `/portal/bulk-upload` - bulk CSV issuance
- `/portal/templates` - template management UI
- `/portal/wallet` - learner/institute wallet view
- `/portal/analytics` - analytics dashboard
- `/portal/updates` - updates and announcements
- `/portal/settings` - settings screen

### Redirect routes

- `/institute` -> `/portal/issue`
- `/student` -> `/portal/wallet`

### API routes

- `POST /api/issue` - issue one certificate
- `POST /api/bulk-upload` - parse CSV and issue many certificates
- `GET /api/certificates` - list all certificates or filter by email
- `GET /api/verify` - verify by certificate ID or hash

## Folder Structure

```text
credchain/
  app/
    api/
      bulk-upload/route.ts
      certificates/route.ts
      issue/route.ts
      verify/route.ts
    institute/page.tsx
    login/page.tsx
    portal/
      analytics/page.tsx
      bulk-upload/page.tsx
      issue/page.tsx
      layout.tsx
      overview/page.tsx
      page.tsx
      settings/page.tsx
      templates/page.tsx
      updates/page.tsx
      wallet/page.tsx
    student/page.tsx
    verify/page.tsx
    globals.css
    layout.tsx
    page.tsx
  components/
    auth/
    marketing/
    portal/
      analytics/
      bulk-upload/
      dashboard/
      issue/
      layout/
      overview/
      settings/
      templates/
      updates/
      wallet/
      shared.tsx
    public/
    shared/
  data/
    chain.json
  lib/
    blockchain.ts
    certificate-actions.ts
    format.ts
    hash.ts
    pdf.ts
    portal-data.ts
    qr.ts
  types/
    index.ts
```

## Codebase Guide

### `app/`

Contains the App Router entry points, layouts, and API route handlers.

- `app/page.tsx` loads the landing page and snapshot metrics
- `app/layout.tsx` sets global fonts, metadata, and CSS
- `app/portal/layout.tsx` wraps all portal screens with the shared sidebar/topbar shell
- `app/api/*` exposes the local issuance, listing, bulk upload, and verification endpoints

### `components/`

Contains UI organized by domain.

- `components/marketing` contains the landing page UI
- `components/auth` contains the demo login screen
- `components/public` contains the public verify experience
- `components/portal` contains all dashboard and workspace screens
- `components/shared` contains reusable brand and icon primitives

### `lib/`

Contains the app logic and shared helpers.

- `lib/blockchain.ts` is the core ledger engine
- `lib/hash.ts` creates SHA-256 hashes
- `lib/qr.ts` builds verification URLs and QR code data URLs
- `lib/pdf.ts` builds the printable certificate HTML
- `lib/certificate-actions.ts` opens or downloads issued certificates in the browser
- `lib/portal-data.ts` derives dashboard metrics and mock operational content from the ledger
- `lib/format.ts` formats dates and hashes for UI display

### `data/`

Contains the local append-only ledger.

- `data/chain.json` stores all issued certificate blocks

### `types/`

Contains shared TypeScript models used by the UI and API layers.

## Data Model

The main certificate record includes:

- `index`
- `certificateId`
- `studentName`
- `studentEmail`
- `phoneNumber`
- `aadhaarNumber`
- `courseName`
- `courseCategory`
- `instituteName`
- `certificateTitle`
- `issueDate`
- `completionDate`
- `grade`
- `templateKey`
- `expiryDate`
- `issuedAt`
- `certificateHash`
- `previousHash`
- `blockHash`

The enriched certificate response also includes:

- `verificationUrl`
- `qrCodeDataUrl`
- `certificateHtml`
- `downloadFileName`

## How Issuance Works

### Single issue flow

1. The user fills the form on `/portal/issue`.
2. The client sends a `POST` request to `/api/issue`.
3. The server validates and normalizes the input.
4. A UUID certificate ID is created.
5. A SHA-256 certificate hash is generated from the certificate payload.
6. A block hash is generated using the current block metadata and previous block hash.
7. The new block is appended to `data/chain.json`.
8. The response is enriched with a QR code, verification URL, and printable HTML certificate.

### Bulk issue flow

1. The user uploads a CSV file on `/portal/bulk-upload`.
2. The file is posted as multipart form data to `/api/bulk-upload`.
3. Papa Parse reads the CSV using headers.
4. Each row is mapped to a certificate payload.
5. Each valid row is issued through the same ledger function used by single issue.
6. The API returns success counts, failure counts, created records, and row-level failures.

## How Verification Works

1. The user visits `/verify`.
2. The user enters a certificate ID or hash, or opens a QR-generated link.
3. The client calls `GET /api/verify?id=...&hash=...`.
4. The server searches the local chain for a matching certificate.
5. The chain is revalidated by checking:
   - sequential block indexes
   - `previousHash` continuity
   - recalculated `certificateHash`
   - recalculated `blockHash`
6. The result is returned with a validity state and the matching certificate if found.

## API Reference

### `POST /api/issue`

Issues one certificate.

Example JSON body:

```json
{
  "studentName": "Rahul Sharma",
  "studentEmail": "rahul@example.com",
  "phoneNumber": "+91 9876543210",
  "aadhaarNumber": "1234-5678-9012",
  "courseName": "Cloud Architecture",
  "courseCategory": "Information Technology",
  "instituteName": "NCVET Training Institute",
  "issueDate": "2026-04-21",
  "completionDate": "2026-04-20",
  "certificateTitle": "Advanced Cloud Architecture",
  "grade": "A+",
  "templateKey": "premium",
  "expiryDate": "2028-04-21"
}
```

Success response:

- status `201`
- message
- enriched certificate payload

### `POST /api/bulk-upload`

Issues many certificates from CSV.

Supported inputs:

- `multipart/form-data` with a `file` field
- JSON body with `csvText`

Recognized CSV headers include aliases such as:

- `studentName`, `student_name`, `name`
- `studentEmail`, `student_email`, `email`
- `phoneNumber`, `phone`, `mobile`
- `aadhaarNumber`, `aadhaar`, `nationalId`
- `courseName`, `course`, `program`
- `courseCategory`, `category`
- `instituteName`, `institute`, `issuer`
- `issueDate`
- `completionDate`
- `certificateTitle`, `title`
- `grade`, `score`, `rank`
- `templateKey`, `template`
- `expiryDate`

Success response:

- status `201` when at least one certificate is created
- status `400` when parsing succeeds but nothing valid is issued
- created and failure summaries

### `GET /api/certificates`

Lists all certificates in reverse chronological order.

Optional query:

- `email=<student email>`

Response:

- `certificates`
- `total`
- `filteredByEmail`

### `GET /api/verify`

Verifies a certificate by lookup values.

Supported queries:

- `id=<certificate id>`
- `hash=<certificate hash or block hash>`

Response:

- `valid`
- `reason`
- `chainLength`
- `requestedId`
- `requestedHash`
- optional enriched `certificate`

## Current UI Behavior

### Fully wired

- single issue form
- bulk CSV upload
- wallet listing
- certificate preview/download
- public verification
- snapshot metrics derived from the ledger

### Presentational or prototype-only

- login/register form
- DigiLocker sign-in button
- template editor screen
- some analytics, updates, and integrations content
- scan QR tab on the verify page

## Ledger Storage

CredChain stores records in `data/chain.json`.

The file is created automatically if it does not exist. Successful issuance appends new blocks to the array.

If you want to reset the local ledger during development, replace the contents of `data/chain.json` with:

```json
[]
```

Note: the repository may already contain sample data in `data/chain.json` from local development.

## Certificate Output

Issued certificates are exported as HTML documents generated by `lib/pdf.ts`.

That output includes:

- certificate title and recipient details
- issue and completion dates
- grade, category, expiry, and template metadata
- certificate ID and hash
- QR code for verification
- print-friendly styling for "Save as PDF" from the browser

## Design Notes

The UI follows a purple-white institutional product style inspired by high-fidelity dashboard mocks, but the portal layout now renders like a real application page rather than a screenshot frame.

Fonts are loaded with `next/font`:

- Space Grotesk for brand and interface text
- IBM Plex Mono for technical labels and code-like content

## Suggested Next Improvements

- add real authentication and session handling
- add a true QR scanner using camera or image upload
- add ledger signatures or issuer keys
- add certificate revocation and expiry checks
- add edit/delete safeguards around local data workflows
- replace HTML export with true PDF generation if needed
- add tests for API routes and ledger integrity

## License

This repository is currently a private prototype. Add a project license here if you plan to distribute it.
