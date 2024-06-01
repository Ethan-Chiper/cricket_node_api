const {check} = require('express-validator');

const Validate = {
	teamValidation: () => {
		return [
			check('teamName', 'please enter the name').notEmpty({ignore_whitespace: true}),
			check('players').notEmpty().trim(),
			check('captain').notEmpty({ignore_whitespace: true}),
            check('viceCaptain').notEmpty().trim()
		];
	}
};

module.exports = Validate;
