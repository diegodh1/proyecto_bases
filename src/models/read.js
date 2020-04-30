var fs = require('fs');
var path = require('path');

try {
    let ruta = path.resolve(__dirname, "../../uploads/cedulas/1144182874");
    console.log(ruta);

    var data = fs.readFileSync(ruta);
    let base64data = new Buffer.from(data).toString("base64");
    console.log(base64data);
} catch (e) {
    console.log('Error:', e.stack);
}