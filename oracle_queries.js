"use strict";
/**
* Este clase es la que se encarga de hacer las consultas a la BD ORACLE
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
const oracl = require('oracledb'); //libreria para consultar la base de datos Oracle con Node.js (libreria oficial de Oracle).
const bcrypt = require('bcrypt'); //libreria para encriptar las contraseñas con salt hashing.
//se le dice al objeto oracl que genere una salida tipo JSON para que los datos sean más fáciles de manejar del lado del Frontend.
oracl.outFormat = oracl.OUT_FORMAT_OBJECT;
class queries {
    constructor(config) {
        this.config = config;
    }
    /**
   * Esta función recibe el tipo de consulta que se desea hacer y ejecuta el query especifico de dicha consulta.
   * @param nconsulta - nombre de la consulta.
   * @param nombre - nombre real del usuario
   * @param lastName - apellido del usuario
   * @param email - correo del usuario
   * @param usuario - nombre de usuario
   * @param contrasena - contraseña en texto plano del usuario.
   * @param SYSDATE - cantidad de dias atras (offset) que se van a consultar.
   */
    query(nconsulta, nombre = "", lastName = "", email = "", usuario = "", contrasena = "", SYSDATE = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            let conn;
            let query = "";
            let date = new Date();
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();
            let FormatedDate; //cuando los datos de la BD sean actuales usar esta variable, la cual gener la fecha al día de hoy
            if (month < 10) {
                FormatedDate = (`${day}-0${month}-${year}`);
            }
            else {
                FormatedDate = (`${day}-${month}-${year}`);
            }
            switch (nconsulta) {
                case "portabilidad_gral":
                    query = "SELECT FECHA_PROCESO,SUM(PORT_OUT) PORT_OUT,SUM(PORT_IN) PORT_IN FROM (" +
                        "SELECT TRUNC(A.FECHA_PROCESO) FECHA_PROCESO, NVL(B.INCONSISTENCIAS, 0) PORT_OUT, NVL(C.INCONSISTENCIAS,0) PORT_IN " +
                        "FROM" +
                        "(SELECT DISTINCT FECHA_PROCESO FROM BITACORA_CONCIL a " +
                        `WHERE A.ID_SUBESCENARIO IN (4, 5) AND TRUNC(FECHA_PROCESO) >= TRUNC(SYSDATE-${SYSDATE})) A ` +
                        "LEFT OUTER JOIN (SELECT * FROM BITACORA_CONCIL a " +
                        "WHERE A.ID_SUBESCENARIO IN 4 " +
                        `AND TRUNC(FECHA_PROCESO) >= TRUNC(SYSDATE-${SYSDATE})ORDER BY FECHA_PROCESO ASC) B ` +
                        "ON A.FECHA_PROCESO = B.FECHA_PROCESO " +
                        "LEFT OUTER JOIN (SELECT * FROM BITACORA_CONCIL a " +
                        "WHERE A.ID_SUBESCENARIO IN 5 " +
                        `AND TRUNC(FECHA_PROCESO) >= TRUNC(SYSDATE-${SYSDATE})ORDER BY FECHA_PROCESO ASC) C ` +
                        "ON A.FECHA_PROCESO = C.FECHA_PROCESO" +
                        ") " +
                        "GROUP BY FECHA_PROCESO " +
                        "ORDER BY FECHA_PROCESO DESC";
                    break;
                case "portabilidad_origen_out":
                    query = "select A.* from (" +
                        "(SELECT A.INCONSISTENCIAS,B.DES,A.FECHA_PROCESO FROM BITACORA_CONCIL A, CAT_SUBESCENARIO_BIT B " +
                        "WHERE A.ID_SUBESCENARIO = B.ID_SUBESCENARIO " +
                        "AND A.ID_SUBESCENARIO IN (1,2,3) " +
                        "ORDER BY FECHA ASC) A " +
                        "inner join" +
                        "(SELECT MAX(TRUNC(FECHA_PROCESO)) FECHA_PROCESO FROM BITACORA_CONCIL " +
                        "WHERE ID_SUBESCENARIO IN (1,2,3)) B " +
                        "on A.FECHA_PROCESO = B.FECHA_PROCESO" +
                        ")";
                    break;
                case "portabilidad_lineal_origen_out":
                    query = "SELECT FECHA_PROCESO,SUM(ACTIVACIONES) ACTIVACIONES,SUM(CAMBIO_DN) CAMBIO_DN," +
                        "SUM(OTROS) OTROS, SUM(PORTIN) PORTIN " +
                        "FROM (" +
                        "SELECT TRUNC(A.FECHA_PROCESO) FECHA_PROCESO, NVL(B.INCONSISTENCIAS, 0) ACTIVACIONES, NVL(C.INCONSISTENCIAS,0) CAMBIO_DN," +
                        "NVL(D.INCONSISTENCIAS,0) OTROS, NVL(E.INCONSISTENCIAS,0) PORTIN " +
                        "FROM" +
                        "(SELECT DISTINCT FECHA_PROCESO FROM BITACORA_CONCIL a " +
                        `WHERE A.ID_SUBESCENARIO IN (1,2,3,5) AND TRUNC(FECHA_PROCESO) >= TRUNC(SYSDATE-${SYSDATE})) A ` +
                        "LEFT OUTER JOIN (SELECT * FROM BITACORA_CONCIL a " +
                        "WHERE A.ID_SUBESCENARIO = 1 " +
                        `AND TRUNC(FECHA_PROCESO) >= TRUNC(SYSDATE-${SYSDATE})ORDER BY FECHA_PROCESO ASC) B ` +
                        "ON A.FECHA_PROCESO = B.FECHA_PROCESO " +
                        "LEFT OUTER JOIN (SELECT * FROM BITACORA_CONCIL a " +
                        "WHERE A.ID_SUBESCENARIO = 2 " +
                        `AND TRUNC(FECHA_PROCESO) >= TRUNC(SYSDATE-${SYSDATE})ORDER BY FECHA_PROCESO ASC) C ` +
                        "ON A.FECHA_PROCESO = C.FECHA_PROCESO " +
                        "LEFT OUTER JOIN (SELECT * FROM BITACORA_CONCIL a " +
                        "WHERE A.ID_SUBESCENARIO = 3 " +
                        `AND TRUNC(FECHA_PROCESO) >= TRUNC(SYSDATE-${SYSDATE})ORDER BY FECHA_PROCESO ASC) D ` +
                        "ON A.FECHA_PROCESO = D.FECHA_PROCESO " +
                        "LEFT OUTER JOIN (SELECT * FROM BITACORA_CONCIL a " +
                        "WHERE A.ID_SUBESCENARIO = 5 " +
                        `AND TRUNC(FECHA_PROCESO) >= TRUNC(SYSDATE-${SYSDATE})ORDER BY FECHA_PROCESO ASC) E ` +
                        "ON A.FECHA_PROCESO = E.FECHA_PROCESO " +
                        ") " +
                        "GROUP BY FECHA_PROCESO " +
                        "ORDER BY FECHA_PROCESO DESC";
                    break;
                case "portabilidad_operador_out":
                    query = "select A.* from (" +
                        "(SELECT CB.NOMBRE CATEGORIA," +
                        "D.DES CONCILIACION," +
                        "C.SHDES SHDES_ESCENARIO, C.DES ESCENARIO," +
                        "B.DES SUBESCENARIO," +
                        "A.ID_SUBESCENARIO, A.INCONSISTENCIAS," +
                        "ROUND(( A.INCONSISTENCIAS * 100) /  (SELECT INCONSISTENCIAS FROM BITACORA_CONCIL " +
                        " WHERE ID_SUBESCENARIO = 4 " +
                        `AND TRUNC(FECHA_PROCESO) = TO_DATE('22/02/2020','DD/MM/YYYY')),1) PORCENTAJE,` + //fecha estática para pruebas, borrar o comentar cuando el sistema este con datos actuales
                        //`AND TRUNC(FECHA_PROCESO) = TO_DATE(${FormatedDate},'DD/MM/YYYY')),1) PORCENTAJE,` + Descomentar cuando el sistema este con datos actuales ((${FormatedDate}=fecha al día de hoy)
                        "A.FECHA_PROCESO " +
                        "FROM BITACORA_CONCIL a " +
                        "inner join CAT_SUBESCENARIO_BIT b " +
                        "on a.ID_SUBESCENARIO = b.ID_SUBESCENARIO " +
                        "inner join CAT_ESCENARIO_BIT C " +
                        "on b.ID_ESCENARIO = c.ID_ESCENARIO " +
                        "INNER JOIN CAT_REPORTE_BIT D " +
                        "ON D.ID_REPORTE =  C.ID_REPORTE " +
                        "INNER JOIN cat_usuarios U " +
                        "ON D.ID_USUARIO = U.ID_USUARIO " +
                        "INNER JOIN CATEGORIA_BIT CB " +
                        "ON CB.ID_CATEGORIA = D.ID_CATEGORIA " +
                        "WHERE A.ID_SUBESCENARIO IN (9,10,11) " +
                        "ORDER BY SUBESCENARIO ASC) A " +
                        "INNER JOIN" +
                        "(SELECT MAX(TRUNC(FECHA_PROCESO)) FECHA_PROCESO FROM BITACORA_CONCIL " +
                        "WHERE ID_SUBESCENARIO IN (9,10,11)) B " +
                        "on A.FECHA_PROCESO = B.FECHA_PROCESO)";
                    break;
                case "portabilidad_operador_in":
                    query = "select A.* from (" +
                        "(SELECT CB.NOMBRE CATEGORIA," +
                        "D.DES CONCILIACION," +
                        "C.SHDES SHDES_ESCENARIO, C.DES ESCENARIO," +
                        "B.DES SUBESCENARIO," +
                        "A.ID_SUBESCENARIO, A.INCONSISTENCIAS," +
                        "ROUND(( A.INCONSISTENCIAS * 100) /  (SELECT INCONSISTENCIAS FROM BITACORA_CONCIL " +
                        "WHERE ID_SUBESCENARIO = 5 " +
                        "AND TRUNC(FECHA_PROCESO) = TO_DATE('22/02/2020','DD/MM/YYYY')),1) PORCENTAJE," + //fecha estática para pruebas, borrar o comentar cuando el sistema este con datos actuales
                        //`AND TRUNC(FECHA_PROCESO) = TO_DATE(${FormatedDate},'DD/MM/YYYY')),1) PORCENTAJE,` +  Descomentar cuando el sistema este con datos actuales (${FormatedDate}=fecha al día de hoy)
                        "A.FECHA_PROCESO " +
                        "FROM BITACORA_CONCIL a " +
                        "inner join CAT_SUBESCENARIO_BIT b " +
                        "on a.ID_SUBESCENARIO = b.ID_SUBESCENARIO " +
                        "inner join CAT_ESCENARIO_BIT C " +
                        "on b.ID_ESCENARIO = c.ID_ESCENARIO " +
                        "INNER JOIN CAT_REPORTE_BIT D " +
                        "ON D.ID_REPORTE =  C.ID_REPORTE " +
                        "INNER JOIN cat_usuarios U " +
                        "ON D.ID_USUARIO = U.ID_USUARIO " +
                        "INNER JOIN CATEGORIA_BIT CB " +
                        "ON CB.ID_CATEGORIA = D.ID_CATEGORIA " +
                        "WHERE A.ID_SUBESCENARIO IN (6,7,8) " +
                        "ORDER BY SUBESCENARIO ASC) A " +
                        "INNER JOIN" +
                        "(SELECT MAX(TRUNC(FECHA_PROCESO)) FECHA_PROCESO FROM BITACORA_CONCIL " +
                        "WHERE ID_SUBESCENARIO IN (6,7,8)) B " +
                        "on A.FECHA_PROCESO = B.FECHA_PROCESO " +
                        ")";
                    break;
                case "usuarios":
                    query = `SELECT * FROM USUARIOS WHERE usuario='${usuario}' AND pass='${contrasena}'`;
                    break;
                case "autenticar":
                    query = `SELECT usuario, pass FROM USUARIOS WHERE usuario='${usuario}'`;
                    break;
                default:
                    console.log("El parametro introducido en la función query del objeto queries no esta en ninguna de las opciones en el switch/case");
                    break;
            }
            try {
                conn = yield oracl.getConnection(this.config);
                const result = yield conn.execute(query); //ejecuta el query devuelto por el switch/case
                return result.rows;
            }
            catch (err) {
                return (err);
            }
            finally {
                if (conn) { // conn assignment worked, need to close
                    yield conn.close();
                }
            }
        });
    }
    /**
  * Esta función compara la contraseña ingresada por el usuario con el hash que esta guardado en la BD para verificar que sea la contraseña correcta.
  * @param password - contraseña del usuario en texto plano (ej.contraseña12345678).
  * @param hash - hash de la contraseña guardada en la BD
  */
    validarPassword(password, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield new Promise((resolve, reject) => {
                bcrypt.compare(password, hash, function (err, result) {
                    if (err)
                        reject(err);
                    resolve(result);
                });
            });
            return response; //Devuelve true o false, si es true la constraseña en correcta, si no es true es incorrecta
        });
    }
    /**
* Esta función es para registrar nuevos usuarios.
* @param primerNombre - Nombre real del usuario
* @param apellido - apellido del usuario
* @param email - correo electrónico del usuario
* @param user - nombre de usuario
* @param password - contraseña del usuario
*/
    Registrar(primerNombre, apellido, email, user, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let conn;
            try {
                conn = yield oracl.getConnection(this.config);
                const verificarUser = yield conn.execute(`SELECT usuario FROM USUARIOS WHERE usuario='${user}'`);
                const verificarEmail = yield conn.execute(`SELECT email FROM USUARIOS WHERE email='${email}'`);
                if (verificarUser.rows[0] != undefined) { //verifica que no exista el usuario en la BD.
                    return { user: "Exist" };
                }
                else if (verificarEmail.rows[0] != undefined) { //verifica que no exista el email en la BD.
                    return { email: "Exist" };
                }
                else { //si ninguno de los 2 existe entonces procede a registrar en usuario en la BD.
                    const hashedPassword = yield new Promise((resolve, reject) => {
                        bcrypt.hash(password, 10, function (err, hash) {
                            if (err)
                                reject(err);
                            resolve(hash);
                        });
                    });
                    const result = yield conn.execute(`BEGIN 
                                                insertUSER('${primerNombre}','${apellido}','${email}','${user}','${hashedPassword}'); 
                                              END;`);
                    return { mensaje: "Registro Exitoso!" };
                }
            }
            catch (err) {
                return (err + "Error al guardar en la base de datos"); //Hubo un error al insertar la información en la BD.
            }
            finally {
                if (conn) { // Todo salio bien, así que se procede a cerrar la conexión.
                    yield conn.close();
                }
            }
        });
    }
}
exports.queries = queries;
