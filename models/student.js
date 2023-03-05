const Joi = require('joi');

const student_schema = Joi.object({
    nom: Joi.string().required(),
    classe: Joi.string().required(),
    modules: Joi.array().items(
        Joi.object({
            module: Joi.string().required(),
            note: Joi.number().min(0).max(20).required()
        })
    ).required()
});

const student_update_schema = Joi.object({
    nom: Joi.string().required(),
    classe: Joi.string().required(),
    modules: Joi.array().items(
        Joi.object({
            module: Joi.string().required(),
            note: Joi.number().min(0).max(20).required()
        })
    ).required()
});


module.exports.student_schema = student_schema;
module.exports.student_update_schema = student_update_schema;