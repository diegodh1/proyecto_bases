//importamos las dependencias
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
//Creamos nuestra clase Usuario con sus respectivos parametros y metodos

class Usuario {
    constructor(usuario_id, usuario_nombre, usuario_apellido, usuario_celular, usuario_correo, usuario_latitud, usuario_longitud, usuario_direccion, usuario_foto_base64, usuario_recibo_base64, usuario_contrasenha, usuario_estado) {
        this.usuario_id = parseInt(usuario_id);
        this.usuario_nombre = usuario_nombre.toUpperCase();
        this.usuario_apellido = usuario_apellido.toUpperCase();
        this.usuario_celular = parseInt(usuario_celular);
        this.usuario_correo = usuario_correo;
        this.usuario_latitud = parseFloat(usuario_latitud);
        this.usuario_longitud = parseFloat(usuario_longitud);
        this.usuario_direccion = usuario_direccion;
        this.usuario_foto_base64 = usuario_foto_base64;
        this.usuario_recibo_base64 = usuario_recibo_base64;
        this.usuario_contrasenha = usuario_contrasenha;
        this.usuario_estado = usuario_estado;
    }

    //getters
    get_usuario_id = () => { return this.usuario_id; }
    get_usuario_nombre = () => { return this.usuario_nombre; }
    get_usuario_apellido = () => { return this.usuario_apellido; }
    get_usuario_celular = () => { return this.usuario_celular; }
    get_usuario_correo = () => { return this.usuario_correo; }
    get_usuario_latitud = () => { return this.usuario_latitud; }
    get_usuario_longitud = () => { return this.usuario_longitud; }
    get_usuario_direccion = () => { return this.usuario_direccion; }
    get_usuario_estado = () => { return this.usuario_estado; }
    get_usuario_contrasenha = () => { return this.usuario_contrasenha; }

    // permite encriptar una contraseña
    contrasenha_ecrypt() {
        let mykey = crypto.createCipher('aes-128-cbc', 'mypassword');
        let mystr = mykey.update(this.usuario_contrasenha, 'utf8', 'hex')
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
            let ruta = path.resolve(__dirname, "../../uploads/fotos/" + this.usuario_foto_base64);
            let data = fs.readFileSync(ruta);
            let base64data = new Buffer.from(data).toString("base64");
            return base64data;
        } catch (e) {
            return "";
        }
    }
    
    // permite leer una cedula y convertirla en base64
    recibo_to_base64() {
        try {
            let ruta = path.resolve(__dirname, "../../uploads/recibos/" + this.usuario_recibo_base64);
            let data = fs.readFileSync(ruta);
            let base64data = new Buffer.from(data).toString("base64");
            return base64data;
        } catch (e) {
            return "";
        }
    }
}

//exportamos el modulo
exports.Usuario = Usuario;