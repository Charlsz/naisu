# Brand assets

Replace these two files whenever you want new icons or link previews:

| File | Used for |
| --- | --- |
| `mark.png` | Favicon, apple touch icon, in-app logo (`/naisu.png`) |
| `og.png` | URL previews (iMessage, X, Slack, Discord, …) |

Then run:

```bash
npm run sync-brand
```

That also runs automatically on `npm run dev` and before `npm run build`.

Tips:

- `mark.png` should be a square (or near-square) PNG.
- `og.png` can be any size; sync crops it to **1200×630**.
- After deploy, social sites cache hard. Open Graph uses Next’s hashed `opengraph-image`, so a new deploy usually picks up the new preview. You can force-refresh at [opengraph.xyz](https://www.opengraph.xyz/) or [Twitter Card Validator](https://cards-dev.twitter.com/validator).
