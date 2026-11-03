// astro/src/utils/verify-build.ts  (run manually after build to spot-check)
// @ts-nocheck — Node.js script, not part of the Astro build
import { existsSync } from 'fs';

const expectedSlugs = [
  'learn-git-in-five-minutes',
  'books-that-changed-my-life',
  'containerizing-a-react-app',
  'my-story',
];

let allPassed = true;
for (const slug of expectedSlugs) {
  const path = `dist/${slug}/index.html`;
  if (existsSync(path)) {
    console.log(`✓ ${path}`);
  } else {
    console.error(`✗ MISSING: ${path}`);
    allPassed = false;
  }
}
if (!allPassed) process.exit(1);
