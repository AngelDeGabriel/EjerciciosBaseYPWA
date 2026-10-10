# Nébula

PWA estática de demostración con un App Shell adaptable y una Splash Screen generada por Chrome a partir del manifiesto. No requiere dependencias de instalación.

## Ejecutar localmente

Desde esta carpeta, inicia un servidor local:

```sh
python3 -m http.server 4173
```

Abre `http://localhost:4173` en Chrome. Las PWAs se pueden probar en `localhost` sin desplegarlas en un servidor HTTPS.

## Comprobar instalación y Splash Screen

1. Abre DevTools y ve a **Application > Manifest**. Confirma que el manifiesto, los iconos de 192 y 512 px y el modo `standalone` cargan sin errores.
2. Desde **Application > Manifest**, usa **Install** para simular la instalación en Chrome de escritorio; también puedes instalarla desde el icono de instalación de la barra de direcciones.
3. Abre Nébula desde la aplicación instalada para comprobar que se inicia en una ventana independiente. Chrome genera su pantalla de inicio nativa usando el nombre y el icono del manifiesto sobre `background_color`.
4. Para comprobar la Splash Screen nativa de Android, instala y abre la PWA en Chrome para Android. La vista previa de instalación de DevTools no reproduce la pantalla de inicio del sistema operativo.

Verificación realizada en Chrome 150 sobre un emulador Pixel 8 Pro (API 35): DevTools no reportó errores de instalación y, al abrir la PWA instalada, Android mostró la pantalla de inicio nativa con el icono y el color de fondo configurados.

El service worker almacena los recursos principales para que la interfaz siga disponible sin conexión después de la primera visita.
