# Google Play Release Checklist

Use this checklist before publishing VANIR Mobile to production on Google Play.

## A) Store Listing and Legal

- [ ] Public Privacy Policy URL is live and reachable.
- [ ] Terms of Service URL is live and reachable.
- [ ] App description accurately reflects app behavior.
- [ ] Contact email, website, and support details are valid.

## B) App Content and Policy Declarations

- [ ] Data Safety form completed and matches actual data use.
- [ ] Account deletion flow is available (in-app or web) and documented.
- [ ] Target audience and content rating completed.
- [ ] Ads declaration is correct.
- [ ] Sensitive permissions are justified and only requested when necessary.

## C) Technical Compliance

- [ ] Target API level meets current Google Play requirements.
- [ ] Release build uses signed AAB.
- [ ] Crash-free startup and key flows validated on real devices.
- [ ] No debug logs, test credentials, or placeholder endpoints in production build.
- [ ] HTTPS endpoints used in production.

## D) Security and Privacy Operations

- [ ] Firebase and backend keys reviewed.
- [ ] Security rules validated (auth/storage/firestore, if applicable).
- [ ] PII handling audited for minimum collection and retention.

## E) Required User Flows to Test

- [ ] Login and logout.
- [ ] Booking flows (package, flight, hotel).
- [ ] Travel essentials checkout (Visa/eSIM/Insurance).
- [ ] Visa document upload and submission.
- [ ] Terms, Privacy, and account deletion request access from Profile.

## F) Internal Project Files To Keep Updated

- [ ] PRIVACY_POLICY.md
- [ ] TERMS_OF_SERVICE.md
- [ ] README.md release notes section
- [ ] android/app/src/main/AndroidManifest.xml permission review
