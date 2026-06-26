# PR Title

feat: legal center, bilingual policies, and Play compliance upgrades

# Summary

This PR strengthens app readiness for production publishing and policy review by introducing an in-app Legal Center, bilingual legal documents (EN/AR), and compliance-facing UX improvements.

# What Changed

- Added a new `LegalCenter` screen for policy access and account deletion requests.
- Added navigation route and stack registration for `LegalCenter`.
- Updated Profile legal section to open Legal Center directly.
- Added Arabic versions of legal documents:
  - `PRIVACY_POLICY.ar.md`
  - `TERMS_OF_SERVICE.ar.md`
- Kept English legal files as baseline:
  - `PRIVACY_POLICY.md`
  - `TERMS_OF_SERVICE.md`
- Added Play-release support docs:
  - `docs/GOOGLE_PLAY_RELEASE_CHECKLIST.md`
  - `docs/PR_DESCRIPTION.md`
- Strengthened brand-only media direction in travel content and local travel API seed data.

# Why

- Improve Google Play review readiness.
- Make legal and account-control actions easier for end users.
- Align in-app legal touchpoints with store listing disclosures and support workflow.

# Validation

- `npm run typecheck` passed.
- Legal Center route compiles and is reachable from Profile.

# Manual QA Checklist

- Open Profile -> Legal Center.
- Open Terms/Privacy links from both Profile and Legal Center.
- Trigger account deletion request email action.
- Verify EN/AR legal markdown files are present in repository.
