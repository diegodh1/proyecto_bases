//importamos las dependencias
const crypto = require('crypto');
const fs = require('fs');
let path_cedulas = '../../uploads/cedulas/';
let path_fotos = '../../uploads/fotos/';
//Creamos nuestra clase Empleado con sus respectivos parametros y metodos

class Empleado {
    constructor(cedula, nombre, apellido, celular, correo, direccion, foto_base64, doc_base64, estado_trabajador, contrasenha) {
        this.cedula = parseInt(cedula);
        this.nombre = nombre;
        this.apellido = apellido;
        this.celular = celular;
        this.correo = correo;
        this.direccion = direccion;
        this.foto_base64 = foto_base64;
        this.doc_base64 = doc_base64;
        this.estado_trabajador = estado_trabajador;
        this.contrasenha = contrasenha;
    }

    //getters

    get cedula() {
        return this.cedula;
    }
    get nombre() {
        return this.nombre.toUpperCase();
    }
    get apellido() {
        return this.apellido.toUpperCase();
    }
    get celular() {
        return this.celular;
    }
    get correo() {
        return this.correo;
    }
    get direccion() {
        return this.direccion;
    }
    get foto_base64() {
        return this.foto_base64;
    }
    get doc_base64() {
        return this.doc_base64;
    }
    get estado_trabajador() {
        return this.estado_trabajador;
    }
    get contrasenha() {
        return this.contrasenha;
    }
    // permite encriptar una contraseña
    contrasenha_ecrypt() {
        let mykey = crypto.createCipher('aes-128-cbc', 'mypassword');
        let mystr = mykey.update(this.contrasenha, 'utf8', 'hex')
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
        let ruta = path_fotos+""+this.foto_base64;
        let buff = fs.readFileSync(ruta);
        let base64data = buff.toString('base64');
        return base64data;
    }
    // permite leer una cedula y convertirla en base64
    doc_to_base64() {
        let ruta = path_cedulas+""+this.doc_base64;
        let buff = fs.readFileSync(ruta);
        let base64data = buff.toString('base64');
        return base64data;
    }
}

exports.Empleado = Empleado;