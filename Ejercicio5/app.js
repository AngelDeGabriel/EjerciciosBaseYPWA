const connectionStatus = document.querySelector("#connection-status");
const connectionLabel = document.querySelector("#connection-label");

function updateConnectionStatus() {
  const isOnline = navigator.onLine;

  connectionStatus.classList.toggle("is-online", isOnline);
  connectionStatus.classList.toggle("is-offline", !isOnline);
  connectionLabel.textContent = isOnline
    ? "Con conexión"
    : "Sin conexión";
}

window.addEventListener("online", updateConnectionStatus);
window.addEventListener("offline", updateConnectionStatus);
updateConnectionStatus();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch((error) => {
      console.error("No se pudo activar el soporte sin conexión:", error);
    });
  });
}
