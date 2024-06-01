const TeamModel = require('../Models/Team');
const {isEmpty} = require('../Helpers/Utils');

const TeamQuery = {
	/**
	 * To do database query on Team Model.
	 * @param queryOptions
	 * @returns {Promise<*>}
	 */
	findOneTeam: async (queryOptions) => {
		if (isEmpty(queryOptions?.method)) queryOptions.method = 'findOne';
		let projection = queryOptions?.projection || {team_id: 1, status: 1};
		let condition = queryOptions || {};
		let options = queryOptions?.options || {lean: true};
		return await TeamModel[queryOptions.method](condition, projection, options);
	},

	createTeam: async (queryOptions) => {
		let document = queryOptions || {};
		let options = queryOptions || {};
		const team = await TeamModel.create([document], options);
		return team[0];
	},

	//For testing purpose
	deleteTeam: async (condition, options) => {
		if (isEmpty(condition)) return;
		if (isEmpty(options)) options = {};

		return await TeamModel.deleteOne(condition, options);
	}
};

module.exports = TeamQuery;
