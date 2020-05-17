"use strict";
const bcrypt = require('bcrypt');
// let prueba="";
//     bcrypt.genSalt(10, function(err:any, salt:any) {
//         bcrypt.hash('maracton', salt, function(err:any, hash:any) {
//             console.log(salt);
//             console.log(hash);
//             prueba=hash;
//             bcrypt.compare('maracton',prueba, function(err:any, result:any) {
//                 console.log(result);
//              });
//         });
//     });
function hashPassword(password) {
    let data;
    bcrypt.hash(password, 10, function (err, hash) {
        data = hash;
    });
}
