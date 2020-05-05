// obtenemos los controladores
let ocupacion = require('../controllers/ocupacion');
let Ocupacion_controller = ocupacion.Ocupacion_controller;

// metodo para poder filtrar la lista de ocupacion
exports.filtro_ocupacion = async(req, res) => {
    //obtenemos los campos de la solicitud
    id = req.body.id;
    ocupacion_controller = new Ocupacion_controller();
    let data = ocupacion_controller.ocupacion_filtro(id);

    if (!Number(id)) {
        res.json({
            message: 'El id de la ocupacion debe ser un dato numerico',
            status: 400
        });

    } else {

        //resolvemos la promesa
        data.then(result => {
            res.json(result);
        }).catch(err => {
            res.json({
                message: err,
                status: 500
            });
        });

    }

}