const z = require('zod')


const movieSchema = z.object({
    title: z.string({
        invalid_type_error: 'Movie title must be a string',
        required_error: 'Movie title is required'
    }),
    genre: z.array(
        z.enum(['Action', 'Adventure', 'Comedy', 'Crime', 'Drama', 'Fantasy', 'Horror', 'Thriller','Sci-Fy']),
        {
            required_error: 'Movie genre is required',
            invalid_type_error: 'Movie genre must be an array of enum genre'
        }
    ),
    director: z.string(),
    year: z.number().int().min(1900).max(2024),
    duration: z.number().int().positive(),
    rate: z.number().min(0).max(10).default(5),
    poster: z.string().url({
        message: 'Poster must be a valid URL'
    })

})

function validateMovie(object) {
    return movieSchema.safeParse(object)
}

function validatePartialMovie(object) { 
    return movieSchema.partial().safeParse(object) // partial hace que todas las propiedades sean opcionales, si está la valida, pero si no, no pasa nada
}

module.exports = {
    validateMovie, validatePartialMovie
}