// Los datos del perfil (PROFILE, LINKS, SHARE_OPTIONS) vienen de js/data.js

const outputDiv = document.getElementById('output');
const inputTextSpan = document.getElementById('input-text');
const hiddenInput = document.getElementById('hidden-input');
const inputLine = document.getElementById('input-line');
const terminalContainer = document.getElementById('terminal-container');

let isTyping = false;
let commandHistory = [];
let historyIndex = -1;

// ============================================================
// ASCII art banner (estilo figlet "ANSI Shadow")
// ============================================================
const asciiBanner =
`     ██╗██╗  ██╗ █████╗ ██╗██████╗
     ██║██║  ██║██╔══██╗██║██╔══██╗
     ██║███████║███████║██║██████╔╝
██   ██║██╔══██║██╔══██║██║██╔══██╗
╚█████╔╝██║  ██║██║  ██║██║██║  ██║
 ╚════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝`;

// "Archivos" ficticios para ls / cat — cada uno mapea a un comando
const FILES = {
    'sobre-mi.txt': 'about',
    'enlaces.txt': 'links',
    'contacto.txt': 'contact'
};

// ============================================================
// Comandos
// Los que llevan hidden: true no aparecen en help ni autocompletan
// ============================================================
const commands = {
    help: {
        desc: 'Lista los comandos disponibles.',
        action: () => {
            let helpText = "Comandos disponibles:\n";
            for (let cmd in commands) {
                if (commands[cmd].hidden) continue;
                helpText += `  <span class="cmd-echo">${cmd.padEnd(10)}</span> - ${commands[cmd].desc}\n`;
            }
            helpText += `\nTip: usa <span class="hl-yellow">Tab</span> para autocompletar y <span class="hl-yellow">↑/↓</span> para el historial.`;
            printLine(helpText);
        }
    },
    about: {
        desc: 'Lista información sobre mí.',
        action: () => {
            printHTML(`<img src="assets/images/Perfil2.jpg" alt="Profile" class="term-profile-img">`);
            printLine(`<span class="hl-pink">Nombre:</span> <span class="cmd-echo">${PROFILE.name}</span>`);
            printLine(`<span class="hl-cyan">Rol:</span>    ${PROFILE.role}`);
            printLine(`<span class="hl-purple">Exp:</span>    ${PROFILE.experience}\n`);
        }
    },
    links: {
        desc: 'Lista mis redes sociales y enlaces.',
        action: () => {
            printLine("Mis enlaces profesionales:");
            let linksHtml = "";
            LINKS.forEach(link => {
                linksHtml += `  <a href="${link.url}" target="_blank" class="term-link"><i class="${link.icon}"></i> ${link.name}</a>\n`;
            });
            printHTML(linksHtml);
        }
    },
    contact: {
        desc: 'Lista mi información de contacto.',
        action: () => {
            printLine("Información de contacto:");
            printHTML(`  <a href="tel:${PROFILE.phone.replace(/\s/g, '')}" class="term-link"><i class="fas fa-phone"></i> ${PROFILE.phone}</a>`);
            printHTML(`  <a href="mailto:${PROFILE.email}" class="term-link"><i class="fas fa-envelope"></i> ${PROFILE.email}</a>\n`);
        }
    },
    share: {
        desc: 'Lista opciones para compartir mi perfil.',
        action: () => {
            printLine("Compartir perfil vía:");
            let shareHtml = "";
            SHARE_OPTIONS.forEach(opt => {
                shareHtml += `  <a href="${opt.getUrl(PROFILE.url)}" target="_blank" class="term-link"><i class="${opt.icon}"></i> ${opt.name}</a>\n`;
            });
            printHTML(shareHtml);
        }
    },
    neofetch: {
        desc: 'Muestra info del sistema (y del perfil).',
        action: () => {
            printHTML(`<div class="ascii-art">${asciiBanner}</div>`);
            printLine(`<span class="cmd-echo">guest</span>@<span class="cmd-echo">jhair-lescano</span>`);
            printLine(`-------------------`);
            printLine(`<span class="hl-purple">OS</span>:      JhairOS 1.0 LTS x86_64`);
            printLine(`<span class="hl-purple">Host</span>:    ${PROFILE.name}`);
            printLine(`<span class="hl-purple">Rol</span>:     ${PROFILE.role}`);
            printLine(`<span class="hl-purple">Stack</span>:   ${PROFILE.experience}`);
            printLine(`<span class="hl-purple">Shell</span>:   bash 5.2.15`);
            printLine(`<span class="hl-purple">Uptime</span>:  disponible 24/7 ☕`);
            printLine(`<span class="hl-purple">Email</span>:   ${PROFILE.email}`);
            printHTML(`<span class="hl-pink">███</span><span class="hl-cyan">███</span><span class="hl-yellow">███</span><span class="hl-purple">███</span>\n`);
        }
    },
    ls: {
        desc: 'Lista los archivos del directorio.',
        action: () => {
            printLine(Object.keys(FILES).map(f => `<span class="hl-cyan">${f}</span>`).join('  '));
            printLine(`Usa '<span class="hl-yellow">cat &lt;archivo&gt;</span>' para leerlos.\n`);
        }
    },
    cat: {
        desc: 'Muestra un archivo (ej: cat sobre-mi.txt).',
        action: (args) => {
            const file = (args[0] || '').toLowerCase();
            if (FILES[file]) {
                commands[FILES[file]].action();
            } else {
                printLine(`cat: ${escapeHTML(file || '')}: No existe el archivo o directorio`, "error");
            }
        }
    },
    whoami: {
        desc: 'Muestra el usuario actual.',
        action: () => printLine("guest")
    },
    date: {
        desc: 'Muestra la fecha y hora actual.',
        action: () => printLine(new Date().toLocaleString('es-PE', { dateStyle: 'full', timeStyle: 'medium' }))
    },
    echo: {
        desc: 'Repite el texto que escribas.',
        action: (args) => printLine(escapeHTML(args.join(' ')))
    },
    history: {
        desc: 'Muestra el historial de comandos.',
        action: () => {
            commandHistory.forEach((c, i) => {
                printLine(`  ${String(i + 1).padStart(3)}  ${escapeHTML(c)}`);
            });
        }
    },
    crt: {
        desc: 'Activa/desactiva el efecto de monitor CRT.',
        action: () => {
            const on = document.body.classList.toggle('crt');
            localStorage.setItem('crt', on ? 'on' : 'off');
            printLine(`Efecto CRT: <span class="${on ? 'hl-cyan' : 'error'}">${on ? 'ACTIVADO' : 'DESACTIVADO'}</span>\n`);
        }
    },
    gui: {
        desc: 'Cambia a la versión clásica de la web.',
        action: () => {
            printLine("Cambiando a modo Interfaz Gráfica (GUI)...");
            setTimeout(() => {
                window.location.href = "classic.html";
            }, 1000);
        }
    },
    clear: {
        desc: 'Limpia la terminal.',
        action: () => {
            outputDiv.innerHTML = "";
        }
    },
    exit: {
        desc: 'Cierra la sesión (o lo intenta).',
        action: () => {
            printLine("logout");
            printLine(`No hay escapatoria 😉 Prueba '<span class="hl-yellow">gui</span>' si prefieres la versión gráfica.\n`);
        }
    },
    // ===== Easter eggs (ocultos en help) =====
    sudo: {
        hidden: true,
        action: (args) => {
            const joined = args.join(' ');
            if (joined.includes('rm') && joined.includes('-rf')) {
                printLine("Eliminando sistema de archivos...", "error");
                printLine("Borrando enlaces... perfil... recuerdos...", "error");
                printLine(`...es broma 😄 Buen intento. Este incidente será reportado.\n`);
            } else {
                printLine("guest no está en el archivo sudoers. Este incidente será reportado.", "error");
            }
        }
    },
    rm: {
        hidden: true,
        action: () => printLine("rm: permiso denegado: los enlaces de Jhair son de solo lectura 🔒", "error")
    }
};

// ============================================================
// Helpers de salida
// ============================================================

// Escapa HTML del input del usuario para prevenir inyección
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g,
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

function printLine(text, cssClass = "") {
    const div = document.createElement("div");
    div.className = `line ${cssClass}`;
    div.innerHTML = text;
    outputDiv.appendChild(div);
    scrollToBottom();
}

function printHTML(html) {
    const div = document.createElement("div");
    div.className = `line`;
    div.innerHTML = html;
    outputDiv.appendChild(div);
    scrollToBottom();
}

function scrollToBottom() {
    terminalContainer.scrollTop = terminalContainer.scrollHeight;
}

// ============================================================
// Secuencia de arranque
// ============================================================
const bootSequence = [
    "Inicializando sistema...",
    "Cargando perfil de Jhair Lescano...",
    "Estableciendo conexión segura... OK",
    "Resolviendo dependencias (SQL, Python, Bash, Perl)... OK",
    "Preparando módulos de Microservicios... OK",
    "¡Bienvenido a la terminal interactiva!",
    "Escribe '<span class=\"hl-yellow\">help</span>' para ver los comandos disponibles.\n"
];

async function runBootSequence() {
    isTyping = true;
    printHTML(`<div class="ascii-art">${asciiBanner}</div>`);
    for (let i = 0; i < bootSequence.length; i++) {
        await typeHTML(bootSequence[i], 20);
    }
    commands.about.action();
    inputLine.style.display = "flex";
    hiddenInput.focus();
    isTyping = false;
}

// ============================================================
// Efecto de tipeo carácter por carácter.
// Tokeniza el HTML una sola vez (etiquetas vs texto) y agrega
// nodos de texto incrementalmente (textNode.data += char),
// evitando re-parsear todo el innerHTML en cada carácter.
// ============================================================
const VOID_TAGS = new Set(['img', 'br', 'hr', 'input']);

function typeHTML(htmlStr, speed = 30) {
    return new Promise(resolve => {
        const div = document.createElement("div");
        div.className = "line";
        outputDiv.appendChild(div);

        // Divide en tokens: etiquetas HTML completas o fragmentos de texto
        const tokens = htmlStr.split(/(<[^>]+>)/g).filter(t => t !== "");
        const stack = [div]; // pila de elementos abiertos
        let ti = 0;          // índice de token
        let ci = 0;          // índice de carácter dentro del token de texto
        let textNode = null;

        const interval = setInterval(() => {
            // Las etiquetas se insertan al instante (no se "tipean")
            while (ti < tokens.length && tokens[ti].startsWith("<")) {
                const tag = tokens[ti];
                if (tag.startsWith("</")) {
                    if (stack.length > 1) stack.pop();
                } else {
                    const tpl = document.createElement("template");
                    tpl.innerHTML = tag;
                    const el = tpl.content.firstChild;
                    if (el) {
                        stack[stack.length - 1].appendChild(el);
                        const name = el.tagName ? el.tagName.toLowerCase() : "";
                        if (!VOID_TAGS.has(name) && !tag.endsWith("/>")) stack.push(el);
                    }
                }
                ti++;
                textNode = null;
            }

            if (ti >= tokens.length) {
                clearInterval(interval);
                resolve();
                return;
            }

            // Tipea un carácter del token de texto actual
            if (!textNode) {
                textNode = document.createTextNode("");
                stack[stack.length - 1].appendChild(textNode);
            }
            textNode.data += tokens[ti].charAt(ci++);
            if (ci >= tokens[ti].length) {
                ti++;
                ci = 0;
                textNode = null;
            }
            scrollToBottom();

            if (ti >= tokens.length) {
                clearInterval(interval);
                resolve();
            }
        }, speed);
    });
}

// ============================================================
// Manejo de input
// ============================================================
terminalContainer.addEventListener("click", () => {
    hiddenInput.focus();
});

document.addEventListener("keydown", (e) => {
    if (isTyping) {
        e.preventDefault();
        return;
    }
    hiddenInput.focus();
});

hiddenInput.addEventListener("input", () => {
    inputTextSpan.textContent = hiddenInput.value;
});

// Autocompletado con Tab (comandos y archivos de cat)
function autocomplete() {
    const val = hiddenInput.value;
    let candidates = [];
    let prefix = "";
    let base = "";

    if (val.toLowerCase().startsWith("cat ")) {
        base = "cat ";
        prefix = val.slice(4).toLowerCase();
        candidates = Object.keys(FILES).filter(f => f.startsWith(prefix));
    } else if (!val.includes(" ")) {
        prefix = val.toLowerCase();
        candidates = Object.keys(commands).filter(c => c.startsWith(prefix) && !commands[c].hidden);
    }

    if (candidates.length === 1) {
        hiddenInput.value = base + candidates[0];
        inputTextSpan.textContent = hiddenInput.value;
    } else if (candidates.length > 1 && prefix) {
        printLine(`<span class="prompt">guest@jhair-lescano:~$</span> <span class="cmd-echo">${escapeHTML(val)}</span>`);
        printLine(candidates.map(c => `<span class="hl-cyan">${c}</span>`).join('  '));
    }
}

hiddenInput.addEventListener("keydown", (e) => {
    if (isTyping) {
        e.preventDefault();
        return;
    }

    if (e.key === "Enter") {
        const cmd = hiddenInput.value.trim();
        if (cmd) {
            commandHistory.push(cmd);
            historyIndex = commandHistory.length;
            const safeCmd = escapeHTML(cmd);
            printLine(`<span class="prompt">guest@jhair-lescano:~$</span> <span class="cmd-echo">${safeCmd}</span>`);
            processCommand(cmd);
        } else {
            printLine(`<span class="prompt">guest@jhair-lescano:~$</span>`);
        }
        hiddenInput.value = "";
        inputTextSpan.textContent = "";
    } else if (e.key === "Tab") {
        e.preventDefault();
        autocomplete();
    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            hiddenInput.value = commandHistory[historyIndex];
            inputTextSpan.textContent = hiddenInput.value;
        }
    } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            hiddenInput.value = commandHistory[historyIndex];
            inputTextSpan.textContent = hiddenInput.value;
        } else {
            historyIndex = commandHistory.length;
            hiddenInput.value = "";
            inputTextSpan.textContent = "";
        }
    }
});

function processCommand(rawCmd) {
    const args = rawCmd.split(' ').filter(a => a !== '');
    const cmd = (args[0] || '').toLowerCase();

    if (commands[cmd]) {
        commands[cmd].action(args.slice(1));
    } else {
        const safeCmd = escapeHTML(cmd);
        printLine(`bash: ${safeCmd}: command not found`, "error");
        printLine(`Escribe '<span class="hl-yellow">help</span>' para ver los comandos disponibles.`);
    }
}

// ============================================================
// Inicio
// ============================================================
// Efecto CRT activado por defecto (se puede apagar con el comando 'crt')
if (localStorage.getItem('crt') !== 'off') {
    document.body.classList.add('crt');
}

window.onload = () => {
    hiddenInput.focus();
    runBootSequence();
};
