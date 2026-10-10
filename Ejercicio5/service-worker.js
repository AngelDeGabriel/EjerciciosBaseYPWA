const CACHE_NAME = "conecta-offline-v1";
const APP_SHELL = ["", "index.html", "styles.css", "app.js", "offline.html"];
const cacheUrl = (path) => new URL(path, self.registration.scope).toString();

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(APP_SHELL.map((path) => cacheUrl(path))),
    ),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter(
              (cacheName) =>
                cacheName.startsWith("conecta-offline-") &&
                cacheName !== CACHE_NAME,
            )
            .map((cacheName) => caches.delete(cacheName)),
        ),
      ),
      self.clients.claim(),
    ]),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(request));
    return;
  }

  event.respondWith(handleAsset(request));
});

async function handleNavigation(request) {
  let response;

  try {
    response = await fetch(request);
  } catch (error) {
    console.warn("Falló la navegación por red; se buscará una copia local.", error);

    const cachedPage = await caches.match(request);
    if (cachedPage) {
      return cachedPage;
    }

    const offlinePage = await caches.match(cacheUrl("offline.html"));
    if (offlinePage) {
      return new Response(offlinePage.body, {
        headers: offlinePage.headers,
        status: 503,
        statusText: "Service Unavailable",
      });
    }

    return new Response("Sin conexión y la vista offline no está disponible.", {
      status: 503,
      statusText: "Service Unavailable",
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  if (response.ok) {
    try {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    } catch (error) {
      console.error("No se pudo guardar la página para uso sin conexión:", error);
    }
  }

  return response;
}

async function handleAsset(request) {
  const cachedAsset = await caches.match(request);
  if (cachedAsset) {
    return cachedAsset;
  }

  let response;

  try {
    response = await fetch(request);
  } catch (error) {
    console.warn("Falló la carga de un recurso por red.", error);

    return new Response("Este recurso no está disponible sin conexión.", {
      status: 503,
      statusText: "Service Unavailable",
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  if (response.ok) {
    try {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    } catch (error) {
      console.error("No se pudo guardar el recurso para uso sin conexión:", error);
    }
  }

  return response;
}
