import { queries } from './oracle_queries';
const llave = require('./configs/config');

const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
var cors = require('cors');
const app = express();

const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors());

app.all('*', function (req:any, res:any, next:any) {
    res.header('Access-Control-Allow-Origin', 'https://attsmc.herokuapp.com');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    } else {
        next();
    }
});


const rutasProtegidas = express.Router(); //middleware 
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


const config = {//datos de acceso a la DB
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

app.get('/portabilidad_origen_out', rutasProtegidas, (req: any, res: any) => { //endpoint para 
    (async () => {
        res.send(await q.query("portabilidad_origen_out"));
    })()
});

app.get('/portabilidad_lineal_origen_out/:sysdate', rutasProtegidas, (req: any, res: any) => {
    (async () => {
        res.send(await q.query("portabilidad_lineal_origen_out", null, null, null, null, null, req.params.sysdate));
    })()
});

app.get('/portabilidad_operador_out', rutasProtegidas, (req: any, res: any) => {
    (async () => {
        res.send(await q.query("portabilidad_operador_out"));
    })()
});

app.get('/portabilidad_operador_in', rutasProtegidas, (req: any, res: any) => {
    (async () => {
        res.send(await q.query("portabilidad_operador_in"));
    })()
});
app.get('/usuarios', rutasProtegidas, (req: any, res: any) => {

    console.log(req.body.user);


    (async () => {
        datos = await q.query("usuarios", req.body.user, req.body.password);
        //console.log(datos);
        res.send(await q.query("usuarios", req.body.user, req.body.password));
    })()
});



app.post('/autenticar', cors(corsOptions), (req: any, res: any) => {//endpoint para autenticar al usuario

    const plainPassword = req.body.password;
    const user = req.body.user;
    (async () => {

        try {

            datos = await q.query("autenticar", null, null, null, user, null);
            const passwordValidated = await q.validarPassword(plainPassword, datos[0].PASS);

            if (user === datos[0].USUARIO && passwordValidated) {
                const payload = {
                    check: true
                };
                const token = jwt.sign(payload, app.get('llave'), {
                    expiresIn: 3600
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

app.post('/registrar', rutasProtegidas, (req: any, res: any) => {//endpoint para registrar al usuario
    (async () => {
        res.json(await q.Registrar(req.body.name, req.body.lastName, req.body.email, req.body.user, req.body.password));
    })()
});





//PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));

