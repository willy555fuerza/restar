const routeringreso = require('./src/routes/ingreso_routes');
const { server } = require('.');

server.use('/ADB', routeringreso);
