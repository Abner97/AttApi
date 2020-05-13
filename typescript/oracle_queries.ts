
const oracl = require('oracledb');
oracl.outFormat = oracl.OUT_FORMAT_OBJECT;

export class queries{

    
    constructor(private config:object){
    
    }

    async query(nconsulta:string):Promise<string>{ //resuelve las queries para cada caso
        let conn:any;
        let query:string="";

        switch (nconsulta){
            case "portabilidad_gral":
                query="SELECT FECHA_PROCESO,SUM(PORT_OUT) PORT_OUT,SUM(PORT_IN) PORT_IN FROM ("+
                "SELECT TRUNC(A.FECHA_PROCESO) FECHA_PROCESO, NVL(B.INCONSISTENCIAS, 0) PORT_OUT, NVL(C.INCONSISTENCIAS,0) PORT_IN "+
                "FROM"+
                "(SELECT DISTINCT FECHA_PROCESO FROM BITACORA_CONCIL a "+
                "WHERE A.ID_SUBESCENARIO IN (4, 5) AND TRUNC(FECHA_PROCESO) >= TRUNC(SYSDATE-90)) A "+
                "LEFT OUTER JOIN (SELECT * FROM BITACORA_CONCIL a "+
                "WHERE A.ID_SUBESCENARIO IN 4 "+
                "AND TRUNC(FECHA_PROCESO) >= TRUNC(SYSDATE-90)ORDER BY FECHA_PROCESO ASC) B "+
                "ON A.FECHA_PROCESO = B.FECHA_PROCESO "+
                "LEFT OUTER JOIN (SELECT * FROM BITACORA_CONCIL a "+
                "WHERE A.ID_SUBESCENARIO IN 5 "+
                "AND TRUNC(FECHA_PROCESO) >= TRUNC(SYSDATE-90)ORDER BY FECHA_PROCESO ASC) C "+
                "ON A.FECHA_PROCESO = C.FECHA_PROCESO"+
                ") "+
                "GROUP BY FECHA_PROCESO "+
                "ORDER BY FECHA_PROCESO DESC";
                break;

            case "portabilidad_origen_out":
                query="select A.* from ("+
                    "(SELECT A.INCONSISTENCIAS,B.DES,A.FECHA_PROCESO FROM BITACORA_CONCIL A, CAT_SUBESCENARIO_BIT B "+
                    "WHERE A.ID_SUBESCENARIO = B.ID_SUBESCENARIO "+
                    "AND A.ID_SUBESCENARIO IN (1,2,3) "+
                    "ORDER BY FECHA ASC) A "+
                    "inner join"+
                    "(SELECT MAX(TRUNC(FECHA_PROCESO)) FECHA_PROCESO FROM BITACORA_CONCIL "+
                    "WHERE ID_SUBESCENARIO IN (1,2,3)) B "+
                    "on A.FECHA_PROCESO = B.FECHA_PROCESO"+
                ")";
                break;
            
            case "portabilidad_lineal_origen_out":
                query="SELECT FECHA_PROCESO,SUM(ACTIVACIONES) ACTIVACIONES,SUM(CAMBIO_DN) CAMBIO_DN,"+
                "SUM(OTROS) OTROS, SUM(PORTIN) PORTIN "+
                "FROM ("+			
                "SELECT TRUNC(A.FECHA_PROCESO) FECHA_PROCESO, NVL(B.INCONSISTENCIAS, 0) ACTIVACIONES, NVL(C.INCONSISTENCIAS,0) CAMBIO_DN,"+
                "NVL(D.INCONSISTENCIAS,0) OTROS, NVL(E.INCONSISTENCIAS,0) PORTIN "+
                "FROM"+			
                "(SELECT DISTINCT FECHA_PROCESO FROM BITACORA_CONCIL a "+
                "WHERE A.ID_SUBESCENARIO IN (1,2,3,5) AND TRUNC(FECHA_PROCESO) >= TRUNC(SYSDATE-90)) A "+			
                "LEFT OUTER JOIN (SELECT * FROM BITACORA_CONCIL a "+
                "WHERE A.ID_SUBESCENARIO = 1 "+
                "AND TRUNC(FECHA_PROCESO) >= TRUNC(SYSDATE-90)ORDER BY FECHA_PROCESO ASC) B "+
                "ON A.FECHA_PROCESO = B.FECHA_PROCESO "+
                "LEFT OUTER JOIN (SELECT * FROM BITACORA_CONCIL a "+
                "WHERE A.ID_SUBESCENARIO = 2 "+
                "AND TRUNC(FECHA_PROCESO) >= TRUNC(SYSDATE-90)ORDER BY FECHA_PROCESO ASC) C "+
                "ON A.FECHA_PROCESO = C.FECHA_PROCESO "+
                "LEFT OUTER JOIN (SELECT * FROM BITACORA_CONCIL a "+
                "WHERE A.ID_SUBESCENARIO = 3 "+
                "AND TRUNC(FECHA_PROCESO) >= TRUNC(SYSDATE-90)ORDER BY FECHA_PROCESO ASC) D "+
                "ON A.FECHA_PROCESO = D.FECHA_PROCESO "+
                "LEFT OUTER JOIN (SELECT * FROM BITACORA_CONCIL a "+
                "WHERE A.ID_SUBESCENARIO = 5 "+
                "AND TRUNC(FECHA_PROCESO) >= TRUNC(SYSDATE-90)ORDER BY FECHA_PROCESO ASC) E "+
                "ON A.FECHA_PROCESO = E.FECHA_PROCESO "+
                ") "+
                "GROUP BY FECHA_PROCESO "+
                "ORDER BY FECHA_PROCESO DESC";
                break;
            
            case "portabilidad_operador_out":
                query="select A.* from ("+
                    "(SELECT CB.NOMBRE CATEGORIA,"+
                                "D.DES CONCILIACION,"+
                                "C.SHDES SHDES_ESCENARIO, C.DES ESCENARIO,"+
                                "B.DES SUBESCENARIO,"+
                               "A.ID_SUBESCENARIO, A.INCONSISTENCIAS,"+
                                "ROUND(( A.INCONSISTENCIAS * 100) /  (SELECT INCONSISTENCIAS FROM BITACORA_CONCIL "+
                                                                    " WHERE ID_SUBESCENARIO = 300 "+
                                                                     "AND TRUNC(FECHA_PROCESO) = TO_DATE('25/02/2020','DD/MM/YYYY')),1) PORCENTAJE,"+
                                            "A.FECHA_PROCESO "+
                                   "FROM BITACORA_CONCIL a "+
                                "inner join CAT_SUBESCENARIO_BIT b "+
                                "on a.ID_SUBESCENARIO = b.ID_SUBESCENARIO "+
                                "inner join CAT_ESCENARIO_BIT C "+
                                "on b.ID_ESCENARIO = c.ID_ESCENARIO "+
                                "INNER JOIN CAT_REPORTE_BIT D "+
                                "ON D.ID_REPORTE =  C.ID_REPORTE "+
                                "INNER JOIN cat_usuarios U "+
                                "ON D.ID_USUARIO = U.ID_USUARIO "+
                                "INNER JOIN CATEGORIA_BIT CB "+
                                "ON CB.ID_CATEGORIA = D.ID_CATEGORIA "+
                                "WHERE A.ID_SUBESCENARIO IN (9,10,11) "+
                                "ORDER BY SUBESCENARIO ASC) A "+
                    "INNER JOIN"+
                    "(SELECT MAX(TRUNC(FECHA_PROCESO)) FECHA_PROCESO FROM BITACORA_CONCIL "+
                    "WHERE ID_SUBESCENARIO IN (9,10,11)) B "+
                    "on A.FECHA_PROCESO = B.FECHA_PROCESO)"
                break;

                case "portabilidad_operador_in":
                    query="select A.* from ("+
                        "(SELECT CB.NOMBRE CATEGORIA,"+
                                    "D.DES CONCILIACION,"+
                                    "C.SHDES SHDES_ESCENARIO, C.DES ESCENARIO,"+
                                    "B.DES SUBESCENARIO,"+
                                    "A.ID_SUBESCENARIO, A.INCONSISTENCIAS,"+
                                    "ROUND(( A.INCONSISTENCIAS * 100) /  (SELECT INCONSISTENCIAS FROM BITACORA_CONCIL "+
                                                                         "WHERE ID_SUBESCENARIO = 5 "+
                                                                         "AND TRUNC(FECHA_PROCESO) = TO_DATE('11/03/2020','DD/MM/YYYY')),1) PORCENTAJE,"+
                                                "A.FECHA_PROCESO "+
                                        "FROM BITACORA_CONCIL a "+
                                   "inner join CAT_SUBESCENARIO_BIT b "+
                                    "on a.ID_SUBESCENARIO = b.ID_SUBESCENARIO "+
                                    "inner join CAT_ESCENARIO_BIT C "+
                                    "on b.ID_ESCENARIO = c.ID_ESCENARIO "+
                                    "INNER JOIN CAT_REPORTE_BIT D "+
                                    "ON D.ID_REPORTE =  C.ID_REPORTE "+
                                    "INNER JOIN cat_usuarios U "+
                                    "ON D.ID_USUARIO = U.ID_USUARIO "+
                                    "INNER JOIN CATEGORIA_BIT CB "+
                                    "ON CB.ID_CATEGORIA = D.ID_CATEGORIA "+
                                    "WHERE A.ID_SUBESCENARIO IN (6,7,8) "+
                                    "ORDER BY SUBESCENARIO ASC) A "+
                        "INNER JOIN"+
                        "(SELECT MAX(TRUNC(FECHA_PROCESO)) FECHA_PROCESO FROM BITACORA_CONCIL "+
                        "WHERE ID_SUBESCENARIO IN (6,7,8)) B "+
                        "on A.FECHA_PROCESO = B.FECHA_PROCESO "+
                    ")"
                    break;
            
            default:
                console.log("El parametro introducido en la función query del objeto queries no esta en ninguna de las opciones en el switch/case");
                break;

            
        }


        try {
            conn = await oracl.getConnection(this.config);
            const result= await conn.execute(query);
            return JSON.stringify(result.rows);

           //console.log(result);
        } catch (err) {
            return (err)
        } finally {
           
            if (conn) { // conn assignment worked, need to close
                await conn.close()
            }
        }
    }


}