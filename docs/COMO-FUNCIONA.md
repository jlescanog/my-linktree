# Cómo funciona la aplicación

Este documento explica el funcionamiento interno de la app: la terminal interactiva, la animación de tipeo, cómo se muestran los datos y cómo se cambia a la interfaz gráfica (GUI).

## Visión general

El proyecto es un "linktree" personal **100% estático** (HTML + CSS + JavaScript vanilla, sin build ni instalación). Tiene **dos versiones independientes** de la misma página:

| Versión | Entrada | JS | CSS |
|---|---|---|---|
| Terminal (por defecto) | `index.html` | `js/terminal.js` | `assets/css/terminal.css` |
| Clásica / GUI | `classic.html` | `js/classic_script.js` | `assets/css/classic_styles.css` |

Ambas versiones comparten **`js/data.js`**, la fuente única de datos del perfil (`PROFILE`, `LINKS`, `SHARE_OPTIONS`). Para cambiar nombre, teléfono, email o enlaces, se edita solo ese archivo y ambas versiones se actualizan.

## La versión Terminal (`index.html`)

### Estructura del DOM

El HTML es mínimo:

- `.terminal-window` — el marco de ventana estilo macOS/Linux, con barra de título (`.titlebar`: los tres puntos ●●● y el título `guest@jhair-lescano: ~`).
- `#terminal-container` — el área de contenido de la terminal (con scroll interno propio).
- `#output` — donde se van agregando las líneas de salida como `<div class="line">`.
- `#input-line` — la línea del prompt (`guest@jhair-lescano:~$`) con `#input-text` (el texto que escribes) y el cursor parpadeante. Arranca oculta (`display: none`) hasta que termina el arranque.
- `#hidden-input` — un `<input>` invisible posicionado fuera de pantalla. **Este es el truco clave**: la terminal no usa un input visible; captura el teclado con este input oculto y refleja cada tecla en `#input-text`. Esto permite que funcione también el teclado en móviles.

### Secuencia de arranque (el "tipeo automático")

Al cargar la página (`window.onload` en `js/terminal.js`):

1. Se enfoca el input oculto y se llama a `runBootSequence()`.
2. Se imprime al instante el **banner ASCII** con el nombre (estilo figlet "ANSI Shadow").
3. `runBootSequence()` recorre el array `bootSequence` (los mensajes de "Inicializando sistema...", etc.) y los escribe uno por uno con `typeHTML()`.
4. `typeHTML(htmlStr, speed)` es la función que **simula el tipeo carácter por carácter**: tokeniza el HTML una sola vez (separando etiquetas de texto), inserta las etiquetas al instante y agrega el texto carácter a carácter con nodos de texto (`textNode.data += char`), con un `setInterval` de 20 ms por carácter. Este diseño evita re-parsear todo el `innerHTML` en cada tecla (la versión anterior era O(n²)).
5. Mientras dura el tipeo, la bandera `isTyping = true` bloquea cualquier tecla del usuario (los listeners hacen `e.preventDefault()`).
6. Al terminar, ejecuta automáticamente el comando `about` (muestra foto de perfil, nombre, rol y experiencia), muestra la línea de input y devuelve el control al usuario.

### Cómo se muestran los datos

Los datos del perfil viven en **`js/data.js`** (compartido con la versión clásica):

- `PROFILE` — nombre, rol, experiencia, teléfono, email y URL a compartir.
- `LINKS` — redes sociales (nombre, URL, ícono de Font Awesome y descripción).
- `SHARE_OPTIONS` — plantillas de URL para compartir en cada red.

Tres helpers pintan en pantalla:

- `printLine(text, cssClass)` — agrega una línea de texto/HTML instantánea.
- `printHTML(html)` — igual, pensada para bloques con enlaces o imágenes.
- `typeHTML(html, speed)` — la versión animada (solo se usa en el arranque).

Después de cada línea, `scrollToBottom()` mantiene la vista abajo, como una terminal real.

### El sistema de comandos

Todos los comandos viven en el objeto `commands` de `js/terminal.js`, cada uno con `{ desc, action }` (y opcionalmente `hidden: true` para que no aparezca en `help` ni en el autocompletado):

| Comando | Qué hace |
|---|---|
| `help` | Lista los comandos visibles (se genera automáticamente iterando `commands`) |
| `about` | Foto + nombre, rol y experiencia (datos de `PROFILE`) |
| `links` | Enlaces sociales (datos de `LINKS`) |
| `contact` | Teléfono y email como enlaces `tel:` / `mailto:` |
| `share` | Enlaces para compartir el perfil (datos de `SHARE_OPTIONS`) |
| `neofetch` | Banner ASCII + ficha del "sistema" con los datos del perfil, al estilo del neofetch real |
| `ls` / `cat` | Archivos ficticios (`sobre-mi.txt`, `enlaces.txt`, `contacto.txt`, definidos en `FILES`) que mapean a los comandos `about`/`links`/`contact` |
| `whoami`, `date`, `echo`, `history` | Clásicos de Unix |
| `crt` | Activa/desactiva el efecto de monitor CRT (persiste en `localStorage`, clave `crt`) |
| `gui` | Cambia a la versión clásica (ver abajo) |
| `clear` | Vacía `#output` |
| `exit` | Broma — no hay escapatoria |
| `sudo`, `rm` | Easter eggs ocultos (prueba `sudo rm -rf /`) |

Flujo de un comando: el usuario escribe → Enter → `processCommand()` toma la primera palabra en minúsculas, busca en `commands` y ejecuta su `action(args)`. Si no existe, muestra el error estilo bash `bash: xyz: command not found`. El input del usuario pasa por `escapeHTML()` antes de mostrarse (previene inyección de HTML, importante porque todo se pinta con `innerHTML`).

Extras:
- **Historial** navegable con ↑/↓ (`commandHistory` + `historyIndex`).
- **Autocompletado con Tab** (`autocomplete()`): completa comandos y, tras `cat `, nombres de archivo; si hay varias coincidencias las lista como bash.
- **Efecto CRT**: scanlines + glow definidos en `terminal.css` bajo `body.crt`. Activado por defecto; el comando `crt` lo alterna y guarda la preferencia.

### Cambio a la interfaz gráfica

Hay dos caminos hacia la GUI:

1. El comando `gui`: imprime "Cambiando a modo Interfaz Gráfica (GUI)..." y tras 1 segundo hace `window.location.href = "classic.html"`.
2. El botón fijo **"Ver versión GUI"** (esquina inferior derecha de la terminal): pensado para visitantes que no conocen las terminales y no sabrían escribir un comando. Es un `<a>` a `classic.html` estilizado en `terminal.css` (clase `.gui-switch`).

La versión clásica tiene el camino inverso: un botón fijo **"Modo Terminal"** (esquina inferior derecha) que regresa a `index.html`.

## La versión Clásica (`classic.html`)

Layout tradicional tipo linktree con Bootstrap: foto, nombre, botones de teléfono/email/compartir y la lista de enlaces con animaciones de entrada. Su JS (`js/classic_script.js`) maneja:

- **Tema claro/oscuro**: botón toggle; respeta la preferencia del sistema (`prefers-color-scheme`) y guarda la elección en `localStorage` (clave `theme`). También cambia el favicon según el tema del sistema.
- **Compartir**: si el navegador soporta la Web Share API (`navigator.share`, típico en móviles) usa el diálogo nativo; si no, abre un modal de Bootstrap con botones por red social y un campo para copiar la URL (con clipboard.js).

## Librerías externas (todas por CDN, nada instalado)

### Terminal (`index.html`)
| Librería | Uso |
|---|---|
| Google Fonts — **Fira Code** | Fuente monoespaciada de la terminal |
| **Font Awesome** 6.0.0-beta3 | Íconos de los enlaces |

### Clásica (`classic.html`)
| Librería | Uso |
|---|---|
| Google Fonts — **Nunito** | Tipografía |
| **Font Awesome** 6.0.0-beta3 | Íconos |
| **Bootstrap** 5.3.0-alpha1 (CSS + JS bundle) | Layout, botones, modal de compartir |
| **Animate.css** 4.1.1 | Animaciones de entrada (fadeIn, bounceIn) |
| **clipboard.js** 2.0.6 | Botón "Copy" de la URL en el modal |

Todos los `<script>` locales y de CDN se cargan con `defer` para no bloquear el renderizado.

> Nota: al ser todo por CDN, la página necesita internet para verse bien (fuentes e íconos). Sin conexión solo fallarían los estilos externos, no la lógica.

## Dónde editar los datos del perfil

Todo está centralizado en **`js/data.js`**. La terminal los lee directamente y la versión clásica genera con JavaScript (en `classic_script.js`, al `DOMContentLoaded`) los botones de contacto, la lista de enlaces y la URL de compartir. Lo único que sigue en HTML es el nombre del `<h1>` y la descripción del `<p class="lead">` de `classic.html`.

La foto de perfil es **`assets/images/Perfil2.jpg`** (optimizada con Squoosh, ~21 KB) y se usa en el comando `about` de la terminal y en el header de la clásica.
