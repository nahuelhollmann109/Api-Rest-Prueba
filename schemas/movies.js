
const z = require('zod');
const movieSchema = z.object({
    title:z.string({
        invalid_type_error :'Movie title must be a string',
        required_error :'Movie title is required'
}),
    year: z.number().int().min(1900).max(2024),
    director: z.string(),
    duration:z.number().int().positive(),
    rate:z.number().min(0).max(10).optional(),
    poster: z.string().url({
        messege:'Poster must be a valid URL'
    }),
    genre: z.array(
        z.enum(['Action','Adventure','Comedy','Romance','Drama','Crime','Fantasy','Horror','Thriller','Sci-fi']),
        {
            required_error:'Movie genre is required',
            invalid_type_error:'Movie genre must be an array of enum Genre'
        }
    )
})

function validateMovie(object){
    return movieSchema.safeParse(object);
    // safeParse debuelve un OBJ res que indica si hay ERR o datos
}

function validarPartial(object){
    return movieSchema.partial().safeParse(object);
}

module.exports = {validateMovie, validarPartial};