const statusMessage = document.querySelector("#sw-status");

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    statusMessage.textContent = "Este navegador no admite Service Workers.";
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register("./sw.js");
    statusMessage.textContent = "Service Worker registrado correctamente.";
    console.info("Service Worker registrado:", registration.scope);
  } catch (error) {
    statusMessage.textContent = "No se pudo registrar el Service Worker.";
    console.error("Error al registrar el Service Worker:", error);
  }
}

registerServiceWorker();
