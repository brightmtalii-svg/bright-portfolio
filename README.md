# Bright Portfolio

Reconstructed recovery copy of the **Bright Portfolio** project for Bright Mtalii.

This directory was created from recovered files located in `D:\found.000`.
The original recovered directory was left untouched.

## Available scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm test
```

## Notes

- Static assets are restored under `public/`.
- The Ask Bright API is available at `/api/ask`.
- The contact form API is available at `/api/contact`.
- Some root configuration files were reconstructed from `package-lock.json`, source imports, and the recovered scaffold configuration. They are marked as reconstructed in `RECOVERY_REPORT.md`.

## Validation

Recommended validation commands:

```bash
npm install
npx tsc --noEmit
npm run lint
npm test
npm run build
```