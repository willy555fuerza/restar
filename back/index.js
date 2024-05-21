/*****************conection 4 servidor*********************/

const express = require ('express')
const server = express()
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv')
dotenv.config()
const bodyParser = require('body-parser');

/*login-logout...*/
const routerusuario = require('./src/routes/usuario_routes')
const routerministerio = require('./src/routes/ministerio_routes')
const routermiembro = require('./src/routes/miembro_routes')
const routertipo_ingresos = require('./src/routes/tipo_ingreso_router')    
const routeringreso = require('./src/routes/ingreso_routes')


const PORT = process.env.PORT || 3000 

server.use((req,res , next)=>{
    res.setHeader("Access-Control-Allow-Origin","*")
    res.setHeader("Access-Control-Allow-Methods","*")
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Credentials",true)
    next()
})

server.get ('/', (req, res) => {
    res.send('Api Proyect')
})

server.use(cookieParser());
server.use(bodyParser.json());
/* server.use('/ADB', router_login_logout ) */
server.use('/ADB', routerusuario )
server.use('/ADB', routerministerio )
server.use('/ADB', routermiembro )
server.use('/ADB', routertipo_ingresos )
server.use('/ADB', routeringreso )


server.listen(PORT,() =>{
    console.log(`servidor corriendo en http://localhost:${PORT}`);
})
