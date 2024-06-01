const PlayerModel = require('../Models/Player');
const {isEmpty} = require('../Helpers/Utils');

const PlayerQuery = {
	/**
	 * To do database query on Player Model.
	 * @param queryOptions
	 * @returns {Promise<*>}
	 */
	findOnePlayer: async (queryOptions) => {
		if (isEmpty(queryOptions?.method)) queryOptions.method = 'findOne';
		let projection = queryOptions?.projection || {player_id: 1, status: 1};
		let condition = queryOptions || {};
		let options = queryOptions?.options || {lean: true};
		return await PlayerModel[queryOptions.method](condition, projection, options);
	},

	createPlayer: async (queryOptions) => {
		let document = queryOptions || {};
		let options = queryOptions || {};
		const team = await PlayerModel.create([document], options);
		return team[0];
	},

	// //For testing purpose
	// deletePlayer: async (condition, options) => {
	// 	if (isEmpty(condition)) return;
	// 	if (isEmpty(options)) options = {};

	// 	return await PlayerModel.deleteOne(condition, options);
	// }
};

module.exports = PlayerQuery;
