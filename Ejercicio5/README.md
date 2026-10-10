# Conecta+ — experiencia sin conexión

Aplicación web estática que usa un service worker para guardar la interfaz y
responder a las navegaciones que fallan por falta de conexión.

## Ejecutar

Los service workers necesitan un contexto seguro: `localhost` sirve para
desarrollo y en producción se requiere HTTPS. Desde esta carpeta, inicia un
servidor local:

```sh
python3 -m http.server 8000
```

Abre `http://localhost:8000` y espera a que el service worker termine de
instalarse. No abras `index.html` directamente como archivo.

## Probar el modo sin conexión

1. Abre la aplicación una vez con conexión para precargar los archivos.
2. En las herramientas del navegador, activa el modo sin conexión (o
   desconecta la red).
3. Recarga `/`: la página inicial se sirve desde la caché.
4. Abre `/pagina-no-guardada`: se muestra `offline.html` con estado HTTP 503.
5. Restablece la conexión y vuelve a intentarlo.

Las páginas visitadas se guardan para su uso offline. Los recursos estáticos
guardados se sirven desde caché; si falta un recurso no HTML, el worker devuelve
un error 503 de texto en lugar de entregar HTML a un script o una imagen.
