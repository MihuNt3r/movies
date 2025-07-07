import { z } from 'zod';

export const CreateUpdateMovieSchema = z.object({
    title: z.string().min(1),
    year: z.number().int().min(1880).max(2100),
    format: z.enum(['DVD', 'VHS', 'Blu-ray']),
    actors: z.array(z.string()),
});

export const MovieQuerySchema = z.object({
    actor: z.string().optional(),
    title: z.string().optional(),
    search: z.string().optional(),
    sort: z.enum(['id', 'title', 'year']).default('id'),
    order: z.enum(['ASC', 'DESC']).default('ASC'),
    limit: z.coerce.number().min(1).max(100).default(20),
    offset: z.coerce.number().min(0).default(0),
});

export type MovieQuery = z.infer<typeof MovieQuerySchema>;