
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'autorack.proxy.rlwy.net',   
    user: 'root',                      
    password: 'caFeHODAgKaGcNMAXIrgAPVZfjoQKFPF',  
    database: 'railway',              
    port: 36215                       
});

module.exports = pool;
