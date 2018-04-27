app.constant("FUNCION", {});

app.constant("FORMULARIO", {
    animales: [
        { label: "Nombre", type: "text", name: "nombre", required: true, icon: true },
        { label: "Peso (Kg)", type: "number", name: "peso", required: true, icon: true, min: 1 },
        { label: "Especie", type: "select", name: "especie", options: [{ name: 'Perro', id: 1 }, { name: 'Gato', id: 2 }], value: 1 },
        { label: "Raza", type: "select", name: "raza", options: [{ name: 'Criollo', id: 1 }, { name: 'Pug', id: 2 }, { name: 'Pastor Aleman', id: 3 }], value: 1 },
        { label: "Color", type: "select", name: "color", options: [{ name: 'Cafe', id: 1 }, { name: 'Blanco', id: 2 }, { name: 'Negro', id: 3 }, { name: 'Amarillo', id: 4 }], value: 1 },
        { label: "Fecha de ingreso", type: "datetime-local", name: "fecha_ingreso", required: true, icon: true },
        { label: "Edad", type: "number", name: "edad", required: true, icon: true, min: 1 },
        { label: "Estado de Ingreso", type: "textarea", name: "estado_ingreso", required: true, icon: true }
    ]
});

app.constant("GeneralURL", "http://localhost/startadmin_back-end/webapis/api/");