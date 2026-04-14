# Blockchain + Dynamic QR Integration Plan

## Goal

Add:
1. Dynamic QR generation for every project
2. Blockchain verification for citizen reports

The implementation must:
- Not break the existing app flow
- Remain modular
- Be optional and non-blocking
- Work with the current Supabase schema and report pipeline
- Be deployable on production

---

# Part 1 — Dynamic QR Integration

## Goal

Every project should have a QR code that points to its project details page.

Example:

```text
https://yourdomain.com/projects/project-1024
```

When scanned:
- User lands directly on the project page
- Existing project detail page continues working
- No change to routing structure is needed

---

# QR Integration Strategy

## Do Not Store QR Images in Database

Avoid:
- qr_image_url
- qr_blob
- qr_storage_path
- pre-generated QR PNGs

Reason:
- Harder to maintain
- Unnecessary storage cost
- Harder to update after deployment

Instead:
- Generate QR dynamically in frontend
- Use project ID or slug
- Use production URL from environment variable

---

# Required Package

```bash
npm install qrcode
```

---

# Environment Variables

Add:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

For production:

```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

# Suggested Folder Structure

```text
components/
  projects/
    project-qr.tsx
```

---

# Project QR Component

Create:

```text
components/projects/project-qr.tsx
```

Responsibilities:
- Accept project ID or slug
- Generate QR dynamically using qrcode library
- Render QR image
- Optionally allow download or print later

Suggested props:

```ts
{
  projectId: string
}
```

Generated URL format:

```ts
`${process.env.NEXT_PUBLIC_APP_URL}/projects/${projectId}`
```

---

# Integration Points

Add QR component to:

1. Project detail page
2. Admin-style print/export page later
3. Nearby works card modal later

Recommended placement on project detail page:
- Under project title
- Inside contractor/budget side panel
- With label:

```text
Scan to open this project
```

---

# QR Scanner Flow Compatibility

Your existing scanner page should support:

1. Scanning old project ID format:

```text
project-1024
```

2. Scanning full URL format:

```text
https://yourdomain.com/projects/project-1024
```

Scanner logic should:
- Detect whether QR contains raw ID or URL
- Extract project ID safely
- Redirect to correct project page

Example logic:

```ts
if (value.includes('/projects/')) {
  const projectId = value.split('/projects/')[1]
} else {
  const projectId = value
}
```

---

# Why This Does Not Break Existing Pipeline

Because:
- Existing project pages remain unchanged
- Existing routes remain unchanged
- Existing QR scan flow remains unchanged
- QR is generated dynamically and independently
- No database migration is required

---

# Part 2 — Blockchain Verification Integration

## Goal

Add a lightweight blockchain proof layer for reports.

Blockchain should:
- Not replace Supabase
- Not slow down report submission
- Not block report creation if blockchain fails
- Only store a tamper-proof proof record

---

# Blockchain Strategy

Use:
- Thirdweb SDK
- Polygon Amoy Testnet
- One small smart contract

Do NOT build:
- Wallet authentication
- NFT logic
- Token systems
- Complex on-chain storage
- Multiple contracts

---

# Required Packages

```bash
npm install thirdweb
npm install crypto-js
```

---

# Suggested Folder Structure

```text
lib/
  blockchain/
    thirdweb-client.ts
    blockchain-config.ts
    hash-report.ts
    log-report-onchain.ts
contracts/
  CivicReportRegistry.sol
```

---

# Smart Contract

Create:

```text
contracts/CivicReportRegistry.sol
```

Contract:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CivicReportRegistry {
    mapping(string => string) public reportHashes;

    event ReportLogged(
        string reportId,
        string complaintHash
    );

    function logReport(
        string memory reportId,
        string memory complaintHash
    ) public {
        reportHashes[reportId] = complaintHash;
        emit ReportLogged(reportId, complaintHash);
    }
}
```

---

# Blockchain Database Changes

Update `reports` table in Supabase.

Add columns:

```sql
alter table reports
add column blockchain_hash text,
add column blockchain_tx_hash text,
add column blockchain_verified boolean default false;
```

---

# Report Hash Strategy

Only hash small report metadata.

Example payload:

```ts
{
  reportId,
  projectId,
  issueType,
  comment,
  createdAt,
}
```

Use SHA256:

```ts
SHA256(JSON.stringify(payload)).toString()
```

Do not hash:
- Image binaries
- Large AI outputs
- Full photo URLs

Reason:
- Faster
- Simpler
- Easier to debug

---

# Blockchain Submission Flow

## Existing Flow

```text
Submit report
      ↓
Upload image
      ↓
Save report in Supabase
      ↓
Show success
```

## New Flow

```text
Submit report
      ↓
Upload image
      ↓
Save report in Supabase
      ↓
Generate report hash
      ↓
Call smart contract
      ↓
Save tx hash in Supabase
      ↓
Show blockchain verified badge
```

---

# Important Non-Blocking Rule

Blockchain should never break report submission.

Example safe flow:

```ts
try {
  const tx = await logReportOnChain(reportId, complaintHash)

  await supabase
    .from('reports')
    .update({
      blockchain_hash: complaintHash,
      blockchain_tx_hash: tx.hash,
      blockchain_verified: true,
    })
} catch (error) {
  console.error('Blockchain logging failed', error)
}
```

If blockchain fails:
- Report still exists
- User still sees success
- App still works
- Blockchain badge simply does not appear

---

# UI Integration

## Report Success Modal

Add:

```text
Verified on Polygon
```

Optionally show:

```text
Transaction: 0x81f3...
```

## Recent Reports List

If `blockchain_verified === true`:

Show small badge:

```text
Blockchain Verified
```

## Dashboard Feed

Add small chip:

```text
Stored On-Chain
```

---

# Deployment Notes

## Environment Variables

```env
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=...
NEXT_PUBLIC_CONTRACT_ADDRESS=...
```

## Production Notes

- Use Polygon Amoy Testnet
- Deploy contract once
- Reuse contract address everywhere
- Do not hardcode localhost URLs

---

# Implementation Order

## QR Feature

1. Install qrcode package
2. Add NEXT_PUBLIC_APP_URL
3. Create project-qr component
4. Add QR to project detail page
5. Update scanner logic to support full URLs

## Blockchain Feature

1. Install thirdweb and crypto-js
2. Deploy smart contract
3. Add new columns to reports table
4. Create hash-report utility
5. Create log-report-onchain utility
6. Add blockchain step after report save
7. Show verification badge in UI

---

# Final Architecture

```text
Project Page
      ↓
Generate QR Dynamically
      ↓
User Scans QR
      ↓
Project Opens

Citizen Submits Report
      ↓
Supabase Saves Report
      ↓
Blockchain Stores Proof Hash
      ↓
UI Shows Verified Badge
```

This approach keeps the current codebase stable, modular, and production-friendly while still adding meaningful QR and blockchain features.

