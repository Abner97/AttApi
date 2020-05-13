import { queries } from './oracle_queries';

const express = require('express');
const app = express();

const config = {
    user: 'att',
    password: 'att',
    connectString: 'localhost:1521/ORCLCDB.localdomain'
}


const q = new queries(config);



app.get('/portabilidad_gral',(req:any,res:any)=>{ //endpoint para portabilidad general
    (async () => {
        res.send(await q.query("portabilidad_gral"));
     })()
});

app.get('/portabilidad_origen_out',(req:any,res:any)=>{ //endpoint para 
    (async () => {
        res.send(await q.query("portabilidad_origen_out"));
     })()
});

app.get('/portabilidad_lineal_origen_out',(req:any,res:any)=>{
    (async () => {
        res.send(await q.query("portabilidad_lineal_origen_out"));
     })()
});

app.get('/portabilidad_operador_out',(req:any,res:any)=>{
    (async () => {
        res.send(await q.query("portabilidad_operador_out"));
     })()
});

app.get('/portabilidad_operador_in',(req:any,res:any)=>{
    (async () => {
        res.send(await q.query("portabilidad_operador_in"));
     })()
});


//PORT
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}`));

