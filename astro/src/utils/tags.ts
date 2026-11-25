export function normalizeTag(tag: string): string {
  return tag.toLowerCase().trim();
}

/** Deduplicates tags ignoring case, preserving first occurrence */
export function deduplicateTags(tags: string[]): string[] {
  const seen = new Set<string>();
  return tags.filter(tag => {
    const key = normalizeTag(tag);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Collects all unique tags from an array of objects with a `tags` field, sorted A–Z ignoring case */
export function getAllTags(posts: Array<{ tags: string[] }>): string[] {
  const all = posts.flatMap(p => p.tags);
  return deduplicateTags(all).sort((a, b) =>
    a.localeCompare(b, 'en', { sensitivity: 'base' }),
  );
}
