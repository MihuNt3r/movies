export interface CreateUpdateMovieDto {
    title: string;
    year: number;
    format: 'DVD' | 'VHS' | 'Blu-Ray';
    actors: Array<string>
}
