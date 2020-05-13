class oracle{
    
    constructor(user,password,connecString){
        this.user=user;
        this.password=password;
        this.connecString=connecString;
    }


    async getBitacora() {
        let conn
        let result
        try {
            conn = await oracledb.getConnection(config)
    
            return await conn.execute(
                'select * from bitacora_concil',
            )
    
           //console.log(result);
    
            
            
    
        } catch (err) {
            return ('Ouch!', err)
        } finally {
           
            if (conn) { // conn assignment worked, need to close
                await conn.close()
            }
        }
    
    }
}




