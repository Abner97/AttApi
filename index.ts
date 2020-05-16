import { queries } from './oracle_queries';
const llave = require('./configs/config');

const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();

const config = {
    user: 'att',
    password: 'att',
    connectString: 'localhost:1521/ORCLCDB.localdomain'
}


const q = new queries(config);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('llave',llave.llave);

let datos: any = {};

app.get('/portabilidad_gral', (req: any, res: any) => { //endpoint para portabilidad general
    (async () => {
        res.send(await q.query("portabilidad_gral"));
    })()
});

app.get('/portabilidad_origen_out', (req: any, res: any) => { //endpoint para 
    (async () => {
        res.send(await q.query("portabilidad_origen_out"));
    })()
});

app.get('/portabilidad_lineal_origen_out', (req: any, res: any) => {
    (async () => {
        res.send(await q.query("portabilidad_lineal_origen_out"));
    })()
});

app.get('/portabilidad_operador_out', (req: any, res: any) => {
    (async () => {
        res.send(await q.query("portabilidad_operador_out"));
    })()
});

app.get('/portabilidad_operador_in', (req: any, res: any) => {
    (async () => {
        res.send(await q.query("portabilidad_operador_in"));
    })()
});
app.get('/usuarios', (req: any, res: any) => {
    
    console.log(req.body.user);


    (async () => {
        datos = await q.query("usuarios", req.body.user, req.body.password);
        //console.log(datos);
        res.send(await q.query("usuarios", req.body.user, req.body.password));
    })()
});



app.post('/autenticar', (req: any, res: any) => {


    (async () => {
        datos = await q.query("autenticar", req.body.user, req.body.password);
        // console.log(datos[0].USUARIO);
         //console.log(datos[0].USUARIO);

    try{
        if (req.body.user === datos[0].USUARIO && req.body.password === datos[0].PASS) {
            const payload = {
                check: true
            };
            const token = jwt.sign(payload, app.get('llave'), {
                expiresIn: 1440
            });
            res.json({
                mensaje: 'Autenticación correcta',
                token: token
            });
        } else {
            res.json({ mensaje: "Usuario o contraseña incorrectos" });
        }

    }catch(err){
        res.json({ mensaje: "Usuario o contraseña incorrectos" });
    }
   
    })()
   
})





//PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));

