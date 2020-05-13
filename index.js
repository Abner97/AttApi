"use strict";
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
const express = require('express');
const app = express();
const config = {
    user: 'att',
    password: 'att',
    connectString: 'localhost:1521/ORCLCDB.localdomain'
};
const q = new oracle_queries_1.queries(config);
app.get('/portabilidad_gral', (req, res) => {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        res.send(yield q.query("portabilidad_gral"));
    }))();
});
app.get('/portabilidad_origen_out', (req, res) => {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        res.send(yield q.query("portabilidad_origen_out"));
    }))();
});
app.get('/portabilidad_lineal_origen_out', (req, res) => {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        res.send(yield q.query("portabilidad_lineal_origen_out"));
    }))();
});
app.get('/portabilidad_operador_out', (req, res) => {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        res.send(yield q.query("portabilidad_operador_out"));
    }))();
});
app.get('/portabilidad_operador_in', (req, res) => {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        res.send(yield q.query("portabilidad_operador_in"));
    }))();
});
//PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
