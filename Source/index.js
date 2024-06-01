const Express = require('express');
const App = Express();
let helmet = require('helmet');
App.use(Express.json());
App.use(helmet.hidePoweredBy());

require('../Source/App/Connection').establish(App);
/**--------------------------------------------------------------------------------------- */

App.use('/api/teams', require('./Routes/TeamRoutes'));

/**--------------------------------------------------------------------------------------- */

module.exports = App;
