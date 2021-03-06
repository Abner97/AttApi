"use strict";
/**
* Este script se encarga de crear los endpoints de la API, el servidor, generar el token jwt, y validar credenciales de usuario.
*
*
*
* @author Abraham Vega
* @date 10-06-2020
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const oracle_queries_1 = require("./oracle_queries");
const llave = require('./configs/config');
const express = require('express'); //Express-js
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken'); //JWT
var cors = require('cors');
const app = express();
//Cross-origin resource sharing (si no se usa el navegador bloquea la respuesta http de la API)
app.use(cors());
const rutasProtegidas = express.Router();
/**
*Esta función es la que valida el token jwt cada vez que se hace una petición.(Middleware)
*
*/
rutasProtegidas.use((req, res, next) => {
    const token = req.headers['access-token'];
    if (token) {
        jwt.verify(token, app.get('llave'), (err, decoded) => {
            if (err) {
                return res.json({ mensaje: 'Token inválida' });
            }
            else {
                req.decoded = decoded;
                next();
            }
        });
    }
    else {
        res.send({
            mensaje: 'Token no proveída.'
        });
    }
});
const config = {
    user: 'att',
    password: 'att',
    connectString: 'localhost:1521/ORCLCDB.localdomain'
};
const q = new oracle_queries_1.queries(config); //creacion del objeto queries que da acceso a la base datos para poder hacer consultas (oracle_queries.ts/js)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('llave', llave.llave);
let datos = {};
app.get('/portabilidad_gral/:sysdate', rutasProtegidas, (req, res) => {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        res.send(yield q.query("portabilidad_gral", null, null, null, null, null, req.params.sysdate));
    }))();
});
app.get('/portabilidad_origen_out', rutasProtegidas, (req, res) => {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        res.send(yield q.query("portabilidad_origen_out"));
    }))();
});
app.get('/portabilidad_lineal_origen_out/:sysdate', rutasProtegidas, (req, res) => {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        res.send(yield q.query("portabilidad_lineal_origen_out", null, null, null, null, null, req.params.sysdate));
    }))();
});
app.get('/portabilidad_operador_out', rutasProtegidas, (req, res) => {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        res.send(yield q.query("portabilidad_operador_out"));
    }))();
});
app.get('/portabilidad_operador_in', rutasProtegidas, (req, res) => {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        res.send(yield q.query("portabilidad_operador_in"));
    }))();
});
app.get('/usuarios', rutasProtegidas, (req, res) => {
    console.log(req.body.user);
    (() => __awaiter(void 0, void 0, void 0, function* () {
        datos = yield q.query("usuarios", req.body.user, req.body.password);
        res.send(yield q.query("usuarios", req.body.user, req.body.password));
    }))();
});
app.post('/autenticar', (req, res) => {
    const plainPassword = req.body.password;
    const user = req.body.user;
    (() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            datos = yield q.query("autenticar", null, null, null, user, null);
            const passwordValidated = yield q.validarPassword(plainPassword, datos[0].PASS);
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
            }
            else {
                res.json({ mensaje: "Usuario o contraseña incorrectos" });
            }
        }
        catch (err) {
            res.json({ mensaje: "Usuario o contraseña incorrectos" });
        }
    }))();
});
app.post('/registrar', rutasProtegidas, (req, res) => {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        res.json(yield q.Registrar(req.body.name, req.body.lastName, req.body.email, req.body.user, req.body.password));
    }))();
});
//Creación del servidor
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
