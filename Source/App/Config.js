const Dotenv = require('dotenv');
Dotenv.config({path: 'Source/App/.env'});
const environment = process.env;
module.exports = {
	TEAM_DB_URL: environment.DB_URL_TEAM_SYSTEAM || 'mongodb://localhost:27017/team_world',
	KONG_URL: environment.KONG_API || 'http://192.168.253.181:7001/consumers/'
};
