import type { APIRoute } from 'astro';
import { writingFeed } from '../lib/writing-feed';

export const GET: APIRoute = ({ site, url }) => writingFeed(site ?? url, url.pathname);
