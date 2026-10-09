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
3. Keep the most relevant project first in Project Showcase. Use one expandable section per distinct project, with an architecture diagram, feature highlights, verification notes, and current limits. Add another only when it demonstrates a distinct skill and has a readable walkthrough.
4. Add a public LinkedIn, portfolio, resume, or professional email link when you choose to publish it. There are no guessed contact links in this profile.
5. If you later publish the source, review code and Git history for private material before changing visibility. Then add a public source link and pin that repository.

## Limits

Network checks can fail temporarily due to outages or rate limits; rerun before editing a working link. GitHub can disable scheduled workflows in public repositories after 60 days without repository activity. Check Actions when returning after a long break and re-enable the schedule if needed. GitHub notification settings control whether workflow failures reach you.

The Pixel Workshop banner, techstack icon strip, link badges, and walkthrough live in this repository. The banner uses a slow, decorative SVG animation with static labels and racks. Reduced-motion preferences hide the moving packets and leave the still frame readable. The animation illustrates backend components; it is not live system status. No external animation or statistics service is required.

To change the pixel art, edit the text, palette, or geometry in `scripts/build-pixel-assets.mjs`, then rebuild with:

```text
node scripts/build-pixel-assets.mjs
node scripts/check-profile.mjs --offline
```

Commit both the generator and regenerated assets. Keep the plain-text introduction, project links, and technology image descriptions readable when images are unavailable. Keep contact behind the Send a hello link, without a printed email address. Check the live profile in light and dark mode and at a narrow mobile width after visual changes.

The techstack uses large, individually titled SVG icons stored under `assets/techstack/`. Their browser hover labels identify each technology and describe its role. Each icon links to the profile's Techstack details toggle, where visitors can expand the descriptions without hover. Keep icon titles, alt text, link targets, and detail headings consistent. The [Skill Icons license](../assets/techstack/LICENSE.txt) is included with these vendored assets.

Project Explore and Architecture badges belong inside their respective expandable sections. The Send a hello badge belongs in the bottom contact section; do not print the email address beside it. Keep every project `<details>` element without `open`; all projects start collapsed.

