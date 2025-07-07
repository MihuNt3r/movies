import fs from 'fs/promises';
import { Movie, Actor } from "../models.ts";
import { CreateUpdateMovieDto } from "../dtos/movieDtos.ts";

export const importMoviesFromTxt = async (filePath: string) => {
    const raw = await fs.readFile(filePath, 'utf-8');

    // Normalize line endings and split by double newlines
    const entries = raw.replace(/\r/g, '').trim().split('\n\n');

    const movies: CreateUpdateMovieDto[] = [];

    for (const block of entries) {
        const lines = block.split('\n');

        const titleLine = lines.find(l => l.startsWith('Title:'));
        const yearLine = lines.find(l => l.startsWith('Release Year:'));
        const formatLine = lines.find(l => l.startsWith('Format:'));
        const starsLine = lines.find(l => l.startsWith('Stars:'));

        if (!titleLine || !yearLine || !formatLine || !starsLine) {
            console.warn(`Skipping malformed block:\n${block}`);
            continue;
        }

        const title = titleLine.split('Title:')[1].trim();
        const year = parseInt(yearLine.split('Release Year:')[1].trim(), 10);
        const format = formatLine.split('Format:')[1].trim() as 'DVD' | 'VHS' | 'Blu-Ray';
        const actors = starsLine.split('Stars:')[1].split(',').map(a => a.trim());

        movies.push({ title, year, format, actors });
    }

    for (const movieDto of movies) {
        const existing = await Movie.findOne({ where: { title: movieDto.title } });
        if (existing) continue; // skip duplicates

        const movie = await Movie.create({
            title: movieDto.title,
            year: movieDto.year,
            format: movieDto.format,
        });

        const actorInstances = [];

        for (const actorName of movieDto.actors) {
            const [actor] = await Actor.findOrCreate({ where: { name: actorName } });
            actorInstances.push(actor);
        }

        await movie.$set('actors', actorInstances);
    }

    return { imported: movies.length };
};