const mongoose = require('mongoose');
const Config = require('./Config');
const DB_URL = Config.TEAM_DB_URL;

const MultiDBConnection = {
	establish: async (Express) => {
		return await new Promise((resolve) => {
			let teamDBCheck = false;
			mongoose.set('strictQuery', true);
			try {
				mongoose.connect(DB_URL, {
					useNewUrlParser: true,
					useUnifiedTopology: true
				});
				console.log('team database connection established');
				teamDBCheck = true;
			} catch (error) {
				throw error;
			}
			mongoose.set('debug', true);

			let playerDBCheck = false;
			mongoose.set('strictQuery', true);
			try {
				mongoose.connect(DB_URL, {
					useNewUrlParser: true,
					useUnifiedTopology: true
				});
				console.log('player database connection established');
				playerDBCheck = true;
			} catch (error) {
				throw error;
			}
			mongoose.set('debug', true);

			resolve([
				teamDBCheck,
			    playerDBCheck
			]);
		})
			.then(() => {
				Express.listen('5022', () => {
					console.log('server is running in 5022');
				});
			})
			.catch((error) => {
				throw error;
			});
	},

	getTeamDBConnection: () => {
		return mongoose;
	},

	getPlayerDBConnection: () => {
		return mongoose;
	},
};

module.exports = MultiDBConnection;
