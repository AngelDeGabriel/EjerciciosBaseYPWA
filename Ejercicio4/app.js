const status = document.querySelector("#status");

if (!("serviceWorker" in navigator)) {
  status.textContent = "Este navegador no admite service workers.";
} else if (!window.isSecureContext) {
  status.textContent = "Abre esta demo en localhost o mediante HTTPS para habilitar la caché.";
} else {
  navigator.serviceWorker.register("./service-worker.js")
    .then(() => {
      status.textContent = "App Shell preparado. Puedes probarlo sin conexión después de cargarlo una vez.";
    })
    .catch((error) => {
      console.error("No se pudo registrar el service worker:", error);
      status.textContent = "No se pudo habilitar el modo sin conexión. Revisa la consola.";
    });
}
