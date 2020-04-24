// requerimos pg el cual utilizaremos para conectarnos a nuestra base de datos
const { Pool }= require('pg');

// creamos una nueva instancia para conectarnos a la base de datos
const pool = new Pool({
    host: '127.0.0.1',
    port: 5432,
    user: 'postgres',
    password: 'pg123',
    database: 'mande'
})

exports.pool = pool;