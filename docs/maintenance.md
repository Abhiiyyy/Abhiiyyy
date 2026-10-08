# Keeping this profile useful

[← Profile overview](../README.md)

## What the automation does

The **Profile health** workflow runs on pushes, pull requests, manual dispatch, and a weekly schedule. It checks Markdown links and heading anchors, verifies local assets, rejects links to private or nonexistent GitHub repositories, and checks public HTTPS destinations without a GitHub token. The job has read-only repository permissions and does not rewrite profile content.

A dated case study becomes a failed check after 90 days without review. Read the project again, update its verification snapshot and boundaries, then change its `Last reviewed` date. Do not change the date without reviewing the facts.

Run the same check locally with Node.js 22 or later:

```text
node scripts/check-profile.mjs
node scripts/check-profile.mjs --offline
```

The offline option checks local files and anchors but skips public network checks. Plain `mailto:` links receive a format check only; the workflow does not send email or verify that an inbox exists.

## Maintenance routine

1. Review the public profile while signed out. Recruiters need usable links without your permissions.
2. Update project statements when the implementation or your role changes.
3. Keep one clearly featured project. Add another only when it demonstrates a distinct skill and has a readable walkthrough.
4. Add a public LinkedIn, portfolio, resume, or professional email link when you choose to publish it. There are no guessed contact links in this profile.
5. If you later publish the source, review code and Git history for private material before changing visibility. Then add a public source link and pin that repository.

## Limits

Network checks can fail temporarily due to outages or rate limits; rerun before editing a working link. GitHub can disable scheduled workflows in public repositories after 60 days without repository activity. Check Actions when returning after a long break and re-enable the schedule if needed. GitHub notification settings control whether workflow failures reach you.

The banner and walkthrough live in this repository. The core profile uses text, native Markdown, and a collapsible overview; it does not require a visitor counter, remote stats image, external animation, hosted demo, or analytics service to communicate your work.
