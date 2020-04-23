// requerimos pg el cual utilizaremos para conectarnos a nuestra base de datos
const { Client } = require('pg');

// creamos una nueva instancia para conectarnos a la base de datos
const client = new Client({
    host: '127.0.0.1',
    port: 5432,
    user: 'postgres',
    password: 'pg123',
    database: 'mande'
})

// nos conectamos a la base de datos
client
    .connect()
    .then(() => console.log('connected'))
    .catch(err => console.error('connection error', err.stack))

//exportamos el modulo
exports.client = client;