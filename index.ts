/**
* Este script se encarga de crear los endpoints de la API, el servidor, generar el token jwt, y validar credenciales de usuario.
* 
*
*
* @author Abraham Vega
* @date 10-06-2020
*/

import { queries } from './oracle_queries';
const llave = require('./configs/config');

const express = require('express'); //Express-js
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');//JWT
var cors = require('cors');
const app = express();

//Cross-origin resource sharing (si no se usa el navegador bloquea la respuesta http de la API)
app.use(cors());


const rutasProtegidas = express.Router();

/**
*Esta función es la que valida el token jwt cada vez que se hace una petición.(Middleware)
* 
*/
rutasProtegidas.use((req: any, res: any, next: any) => {
    const token = req.headers['access-token'];

    if (token) {
        jwt.verify(token, app.get('llave'), (err: any, decoded: any) => {
            if (err) {
                return res.json({ mensaje: 'Token inválida' });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.send({
            mensaje: 'Token no proveída.'
        });
    }
});


const config = {//datos de acceso a la DB (cambiar por los de la empresa)
    user: 'att',
    password: 'att',
    connectString: 'localhost:1521/ORCLCDB.localdomain'
}


const q = new queries(config);//creacion del objeto queries que da acceso a la base datos para poder hacer consultas (oracle_queries.ts/js)

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('llave', llave.llave);

let datos: any = {};

app.get('/portabilidad_gral/:sysdate', rutasProtegidas, (req: any, res: any) => { //endpoint para portabilidad general
    (async () => {
        res.send(await q.query("portabilidad_gral", null, null, null, null, null, req.params.sysdate));
    })()
});

app.get('/portabilidad_origen_out', rutasProtegidas, (req: any, res: any) => { //endpoint para portabilidad_origen_out
    (async () => {
        res.send(await q.query("portabilidad_origen_out"));
    })()
});

app.get('/portabilidad_lineal_origen_out/:sysdate', rutasProtegidas, (req: any, res: any) => { ////endpoint para portabilidad_lineal_origen_out
    (async () => {
        res.send(await q.query("portabilidad_lineal_origen_out", null, null, null, null, null, req.params.sysdate));
    })()
});

app.get('/portabilidad_operador_out', rutasProtegidas, (req: any, res: any) => {//endpoint para portabilidad_operador_out
    (async () => {
        res.send(await q.query("portabilidad_operador_out"));
    })()
});

app.get('/portabilidad_operador_in', rutasProtegidas, (req: any, res: any) => {//endpoint para portabilidad_operador_in
    (async () => {
        res.send(await q.query("portabilidad_operador_in"));
    })()
});

app.get('/usuarios', rutasProtegidas, (req: any, res: any) => {//este endpoint solo era de prueba puede ser eliminado su así lo desean.

    console.log(req.body.user);


    (async () => {
        datos = await q.query("usuarios", req.body.user, req.body.password);
        res.send(await q.query("usuarios", req.body.user, req.body.password));
    })()
});



app.post('/autenticar',(req: any, res: any) => {//endpoint para autenticar al usuario

    const plainPassword = req.body.password;
    const user = req.body.user;
    (async () => {

        try {

            datos = await q.query("autenticar", null, null, null, user, null);
            const passwordValidated = await q.validarPassword(plainPassword, datos[0].PASS);

            if (user === datos[0].USUARIO && passwordValidated) { //si las credenciales son correctas se genera el token.
                const payload = {
                    check: true
                };
                const token = jwt.sign(payload, app.get('llave'), {
                    expiresIn: 28800 //el token expira en 8 horas (una jornada laboral)
                });
                res.json({
                    mensaje: 'Autenticación correcta',
                    token: token
                });
            } else {
                res.json({ mensaje: "Usuario o contraseña incorrectos" });
            }


        } catch (err) {
            res.json({ mensaje: "Usuario o contraseña incorrectos" });
        }

    })();

});

app.post('/registrar', rutasProtegidas, (req: any, res: any) => {//endpoint para registrar al usuario (no es accesible por medio de la aplicación)
    (async () => {
        res.json(await q.Registrar(req.body.name, req.body.lastName, req.body.email, req.body.user, req.body.password));
    })()
});





//Creación del servidor
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));

