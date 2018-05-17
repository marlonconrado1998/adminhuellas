app.controller("adopcionController", adopcionController);

adopcionController.$inject = ['printFile'];

function adopcionController(printFile) {
    console.log("adopcion controller ready", printFile);

    var gestionAdopcion = this;

    gestionAdopcion.imprimirAdopcion = function (datos) {
        var contenidoOriginal = document.body.innerHTML;
        var titulo = document.getElementById("tituloCompromiso").innerHTML;
        
        var cuerpo = document.getElementById("textoCompromiso").innerHTML;
        var logotipo = '<div style="display: flex; justify-content: center; opacity: 0.5"><img src="images/logo_main.svg" style="height:4.5cm"></div>';

        var contenido = logotipo +
            '<br><div style="margin-left: 4cm;margin-right: 2cm;margin-bottom: 3cm; font-family: Arial">' +
            '<h3 style="text-align: center; margin-left:-2cm">ACTA DE COMPROMISO DE ADOPCIÓN</h3><br><br>' +
            '<p>Fecha: ' + new Date().toLocaleDateString() + '.</p>' +
            '<p>Yo, <strong>' + datos.nombre.toUpperCase() + " " + datos.apellido.toUpperCase() + '</strong> , con C.C ' + datos.identificacion + ', deseo recibir en adopción a:</p>' +
            '<p>Nombre actual del animal: ' + '</p>' +
            '<p>Tipo de animal: ' + '</p>' +
            '<p>Sexo: ' + '</p>' +
            '<p>Edad: ' + '</p>' +
            cuerpo +
            '<br><br><br><p>Firma y Cédula del adoptante: _______________________________________________________</p>' +
            '</div>';

        document.body.innerHTML = contenido;

        window.print();

        document.body.innerHTML = contenidoOriginal;
    }
}