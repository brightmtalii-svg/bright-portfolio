# Project images

Project cards and detail pages render **generated placeholder artwork** while a
project has no real image, so nothing is ever faked.

Images are 16:9 (1600×900) and may be **conceptual illustrations** rather than
real screenshots — label them honestly so the site never implies otherwise.

To attach an image to a project:

1. Drop the image in this folder, e.g.
   `public/images/projects/bright-ai.webp` (16:9 works best, ~1600×900px).
2. In `src/data/projects.ts`, set that project's `thumbnail`:

   ```ts
   thumbnail: "/images/projects/bright-ai.webp",
   thumbnailAlt: "Conceptual illustration for Bright AI — a terminal assistant wired to a local language model.",
   thumbnailKind: "illustration", // use "screenshot" only for real captures
   ```

3. For extra images on the detail page, add entries to the same project's
   `screenshots` array:

   ```ts
   screenshots: [
     { src: "/images/projects/bright-ai-2.jpg", alt: "Reasoning view", width: 1600, height: 900 },
   ],
   ```
