const Express = require('express');
const Router = Express.Router();
const {validationResult} = require('express-validator');
const Responder = require('../App/Responder');
const {isEmpty} = require('../Helpers/Utils');
const {teamValidation}= require('../Validators/TeamValidator');
const { addTeam, processResult, getTeamResults} = require('../Controllers/TeamController');

Router.post('/sign_up', teamValidation(), async (req, res) => {
	try {
		let hasErrors = validationResult(req);
        console.log(hasErrors);
		if (hasErrors.isEmpty()) {
			let {error, message, data} = await addTeam(req, res);
			if (!isEmpty(data) && error === false) {
				return Responder.sendSuccessData(res, message, data);
			}
			return Responder.sendFailureMessage(res, message, 400);
		} else {
			return Responder.sendFailureMessage(res, hasErrors?.errors[0]?.msg, 422);
		}
	} catch (error) {
		return Responder.sendFailureMessage(res, error, 500);
	}
});
Router.post('/process-result', async (req, res) => {
	try {
        let {error, message, data} = await processResult(req, res);
        if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(res, message, data);
		}else {
            return Responder.sendFailureMessage(res, hasErrors?.errors[0]?.msg, 422);
        }
    } catch (error) {
        return Responder.sendFailureMessage(res, error, 500);
	}
});

Router.get('/team-result', async (req, res) => {
	try {
		let {error, message, data} = await getTeamResults(req.team_Id);
		if (!isEmpty(data) && error === false) {
			return Responder.sendSuccessData(res, message, data);
		}
		return Responder.sendFailureMessage(res, message, 400);
	} catch (error) {
		return Responder.sendFailureMessage(res, error, 500);
	}
});

module.exports = Router;