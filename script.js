document.querySelectorAll(".proyecto-galeria").forEach((galeria) => {
    const imagenPrincipal = galeria.querySelector(".proyecto-imagen-principal");
    const miniaturas = galeria.querySelectorAll(".proyecto-miniatura");

    miniaturas.forEach((miniatura) => {
        miniatura.addEventListener("click", () => {
            imagenPrincipal.src = miniatura.dataset.src;
            imagenPrincipal.alt = miniatura.dataset.alt;

            miniaturas.forEach((boton) => {
                const estaActiva = boton === miniatura;
                boton.classList.toggle("is-active", estaActiva);
                boton.setAttribute("aria-pressed", estaActiva.toString());
            });
        });
    });
});

const formularioCotizacion = document.querySelector("#formulario-cotizacion");

if (formularioCotizacion) {
    const urlAppsScript = "https://script.google.com/macros/s/AKfycbyEsQ2a6PGX4G0miOEDw8RAag9x0Pm-GXt9Ql3GS2v3xm2U57HdfK57KIKggejh1RPS/exec";
    const botonEnviar = formularioCotizacion.querySelector('button[type="submit"]');
    const estado = formularioCotizacion.querySelector("#formulario-estado");

    formularioCotizacion.addEventListener("submit", async (evento) => {
        if (!formularioCotizacion.checkValidity()) {
            evento.preventDefault();
            formularioCotizacion.reportValidity();
            return;
        }

        evento.preventDefault();

        const datos = {
            nombre: formularioCotizacion.elements.nombre.value.trim(),
            empresa: formularioCotizacion.elements.empresa.value.trim(),
            telefono: formularioCotizacion.elements.telefono.value.trim(),
            correo: formularioCotizacion.elements.correo.value.trim(),
            tipoProyecto: formularioCotizacion.elements.tipo_proyecto.value,
            mensaje: formularioCotizacion.elements.mensaje.value.trim()
        };

        estado.textContent = "";
        estado.classList.remove("es-exito", "es-error");
        botonEnviar.textContent = "Enviando...";
        botonEnviar.disabled = true;

        try {
            const respuesta = await fetch(urlAppsScript, {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },
                body: JSON.stringify(datos)
            });

            const resultado = await respuesta.json();

            if (!respuesta.ok || resultado.ok !== true) {
                throw new Error("El servidor no confirmó el envío.");
            }

            estado.textContent = "Gracias. Tu solicitud fue enviada correctamente. Nos pondremos en contacto contigo.";
            estado.classList.add("es-exito");
            formularioCotizacion.reset();
        } catch (error) {
            estado.textContent = "No fue posible enviar tu solicitud. Por favor intenta nuevamente o contáctanos directamente.";
            estado.classList.add("es-error");
        } finally {
            botonEnviar.textContent = "Enviar solicitud";
            botonEnviar.disabled = false;
        }
    });
}
