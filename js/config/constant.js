app.constant("FUNCION", {});

app.constant("FORMULARIO", {
	animales: [
		{label: "Nombre",type: "text",   name: "nombre", required: true, icon: true},
		{label: "Peso",  type: "text",   name: "peso", required: true, icon: true},
		{label: "Raza",  type: "text",   name: "peso1", required: true, icon: true},
		{label: "Color", type: "textarea",  name: "color", required: true, icon: true},
		{label: "Peso",  type: "number",   name: "peso3", required: true, icon: true},
		{label: "Raza",  type: "select", name: "raza", options: ["Perro", "Gato"], value: "Perro"},
	]
});