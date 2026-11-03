import { describe, it, expect } from 'vitest';
import { normalizeTag, deduplicateTags, getAllTags } from './tags';

describe('normalizeTag', () => {
  it('lowercases a tag', () => {
    expect(normalizeTag('Kubernetes')).toBe('kubernetes');
  });
  it('trims whitespace', () => {
    expect(normalizeTag('  Git  ')).toBe('git');
  });
});

describe('deduplicateTags', () => {
  it('removes case-duplicate tags, keeping first occurrence', () => {
    const result = deduplicateTags(['Git', 'git', 'GIT', 'DevOps']);
    expect(result).toEqual(['Git', 'DevOps']);
  });
  it('handles empty array', () => {
    expect(deduplicateTags([])).toEqual([]);
  });
});

describe('getAllTags', () => {
  it('collects and deduplicates tags from multiple post arrays', () => {
    const posts = [
      { tags: ['Git', 'DevOps'] },
      { tags: ['git', 'Ansible'] },
      { tags: ['DevOps', 'Kubernetes'] },
    ];
    const result = getAllTags(posts);
    // Should have Git, DevOps, Ansible, Kubernetes (no duplicates by normalized key)
    expect(result).not.toContain('git'); // lowercase 'git' lost to first-occurrence 'Git'
    // Either Git or git — whichever came first — but not both
    const normalized = result.map(t => t.toLowerCase());
    expect(new Set(normalized).size).toBe(normalized.length);
    expect(result).toHaveLength(4);
  });
});
