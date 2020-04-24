//importamos las dependencias
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
//Creamos nuestra clase Empleado con sus respectivos parametros y metodos

class Empleado {
    constructor(trabajador_cedula, trabajador_nombre, trabajador_apellido, trabajador_celular, trabajador_correo, trabajador_latitud, trabajador_longitud, trabajador_direccion, trabajador_foto_base64, trabajador_doc_base64, trabajador_estado, trabajador_contrasenha) {
        this.trabajador_cedula = parseInt(trabajador_cedula);
        this.trabajador_nombre = trabajador_nombre.toUpperCase();
        this.trabajador_apellido = trabajador_apellido.toUpperCase();
        this.trabajador_celular = parseInt(trabajador_celular);
        this.trabajador_correo = trabajador_correo;
        this.trabajador_latitud = parseFloat(trabajador_latitud);
        this.trabajador_longitud = parseFloat(trabajador_longitud);
        this.trabajador_direccion = trabajador_direccion;
        this.trabajador_foto_base64 = trabajador_foto_base64;
        this.trabajador_doc_base64 = trabajador_doc_base64;
        this.trabajador_estado = trabajador_estado;
        this.trabajador_contrasenha = trabajador_contrasenha;
    }
    get_trabajador_cedula = () => { return this.trabajador_cedula; }
    get_trabajador_nombre = () => { return this.trabajador_nombre; }
    get_trabajador_apellido = () => { return this.trabajador_apellido; }
    get_trabajador_celular = () => { return this.trabajador_celular; }
    get_trabajador_correo = () => { return this.trabajador_correo; }
    get_trabajador_latitud = () => { return this.trabajador_latitud; }
    get_trabajador_longitud = () => { return this.trabajador_longitud; }
    get_trabajador_direccion = () => { return this.trabajador_direccion; }
    get_trabajador_estado = () => { return this.trabajador_estado; }
    get_trabajador_contrasenha = () => { return this.trabajador_contrasenha; }
    // permite encriptar una contraseña
    contrasenha_ecrypt() {
        let mykey = crypto.createCipher('aes-128-cbc', 'mypassword');
        let mystr = mykey.update(this.trabajador_contrasenha, 'utf8', 'hex')
        mystr += mykey.final('hex');
        return mystr;
    }
    // permite desencriptar una contraseña
    contrasenha_decrypt(password) {
        let mykey = crypto.createDecipher('aes-128-cbc', 'mypassword');
        let mystr = mykey.update(password, 'hex', 'utf8')
        mystr += mykey.final('utf8');
        return mystr;
    }
    // permite leer una foto y convertirlo en base64
    foto_to_base64() {
        try {
            let ruta = path.resolve(__dirname, "../../uploads/fotos/" + this.trabajador_foto_base64);
            let data = fs.readFileSync(ruta);
            let base64data = new Buffer.from(data).toString("base64");
            return base64data;
        } catch (e) {
            return "";
        }
    }
    // permite leer una cedula y convertirla en base64
    doc_to_base64() {
        try {
            let ruta = path.resolve(__dirname, "../../uploads/cedulas/" + this.trabajador_doc_base64);
            let data = fs.readFileSync(ruta);
            let base64data = new Buffer.from(data).toString("base64");
            return base64data;
        } catch (e) {
            return "";
        }
    }
}

exports.Empleado = Empleado;