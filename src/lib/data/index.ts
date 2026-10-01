import type { Repository } from "../repository";
import { localRepository } from "../repository.local";

/**
 * The active data source. Swap this for a Supabase-backed implementation
 * of `Repository` to connect a live backend without touching pages.
 */
export const repo: Repository = localRepository;
