app.constant("FUNCION", {});

app.constant("FORMULARIO", {
    animales: [
        { label: "Nombre", type: "text", name: "nombre", required: true, icon: true },
        { label: "Peso (Kg)", type: "number", name: "peso", required: true, icon: true },
        { label: "Especie", type: "select", name: "especie", options: ['Perro', 'Galo'], value: 'Perro' },
        { label: "Raza", type: "select", name: "raza", options: ['Criollo', 'Pug', 'Pastor Aleman'], value: 'Criollo' },
        { label: "Color", type: "select", name: "color", options: ['Cafe', 'Blanco', 'Negro', 'Amarillo'], value: "Negro" },
        { label: "Fecha de ingreso", type: "datetime-local", name: "fecha_ingreso", required: true, icon: true },
        { label: "Edad", type: "number", name: "edad", required: true, icon: true },
        { label: "Estado de Ingreso", type: "textarea", name: "estado_ingreso", required: true, icon: true },
    ]
});