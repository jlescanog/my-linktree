const outputDiv = document.getElementById('output');
const inputTextSpan = document.getElementById('input-text');
const hiddenInput = document.getElementById('hidden-input');
const inputLine = document.getElementById('input-line');
const terminalContainer = document.getElementById('terminal-container');

// Profile Info
const profile = {
    name: "Jhair Lescano",
    role: "Data Engineer | Cloud | Python | Databricks",
    experience: "SQL Server, Oracle, IA, Machine Learning",
    phone: "+51 933243356",
    email: "jlescanoguevara@gmail.com"
};

// Available links
const links = [
    { name: 'My Website', url: 'https://jhairlescano.vercel.app/', icon: 'fas fa-globe' },
    { name: 'GitHub', url: 'https://github.com/jlescanog', icon: 'fab fa-github' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/jhair-lescano/', icon: 'fab fa-linkedin' },
    { name: 'Instagram', url: 'https://www.instagram.com/jhair.lescano', icon: 'fab fa-instagram' },
    { name: 'Facebook', url: 'https://www.facebook.com/JhairLescanoG', icon: 'fab fa-facebook' },
    { name: 'Twitter', url: 'https://x.com/jlescanog', icon: 'fab fa-twitter' }
];

// Share links
const shareOptions = [
    { name: 'Facebook', getUrl: (url) => `https://www.facebook.com/sharer/sharer.php?u=${url}`, icon: 'fab fa-facebook' },
    { name: 'Twitter', getUrl: (url) => `https://twitter.com/intent/tweet?url=${url}`, icon: 'fab fa-twitter' },
    { name: 'LinkedIn', getUrl: (url) => `https://www.linkedin.com/shareArticle?url=${url}`, icon: 'fab fa-linkedin' },
    { name: 'WhatsApp', getUrl: (url) => `https://wa.me/?text=${url}`, icon: 'fab fa-whatsapp' },
    { name: 'Email', getUrl: (url) => `mailto:?subject=Check this out&body=${url}`, icon: 'fas fa-envelope' }
];

const profileUrl = "https://www.linkedin.com/in/jhair-lescano/";

const commands = {
    help: {
        desc: 'Lista los comandos disponibles.',
        action: () => {
            let helpText = "Comandos disponibles:\n";
            for (let cmd in commands) {
                helpText += `  <span class="cmd-echo">${cmd.padEnd(10)}</span> - ${commands[cmd].desc}\n`;
            }
            printLine(helpText);
        }
    },
    about: {
        desc: 'Lista información sobre mí.',
        action: () => {
            printHTML(`<img src="assets/images/Perfil2.png" alt="Profile" class="term-profile-img">`);
            printLine(`Nombre: <span class="cmd-echo">${profile.name}</span>`);
            printLine(`Rol:    ${profile.role}`);
            printLine(`Exp:    ${profile.experience}\n`);
        }
    },
    links: {
        desc: 'Lista mis redes sociales y enlaces.',
        action: () => {
            printLine("Mis enlaces profesionales:");
            let linksHtml = "";
            links.forEach(link => {
                linksHtml += `  <a href="${link.url}" target="_blank" class="term-link"><i class="${link.icon}"></i> ${link.name}</a>\n`;
            });
            printHTML(linksHtml);
        }
    },
    contact: {
        desc: 'Lista mi información de contacto.',
        action: () => {
            printLine("Información de contacto:");
            printHTML(`  <a href="tel:${profile.phone.replace(/\\s/g, '')}" class="term-link"><i class="fas fa-phone"></i> ${profile.phone}</a>`);
            printHTML(`  <a href="mailto:${profile.email}" class="term-link"><i class="fas fa-envelope"></i> ${profile.email}</a>\n`);
        }
    },
    share: {
        desc: 'Lista opciones para compartir mi perfil.',
        action: () => {
            printLine("Compartir perfil vía:");
            let shareHtml = "";
            shareOptions.forEach(opt => {
                shareHtml += `  <a href="${opt.getUrl(profileUrl)}" target="_blank" class="term-link"><i class="${opt.icon}"></i> ${opt.name}</a>\n`;
            });
            printHTML(shareHtml);
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
    }
};

let isTyping = false;
let commandHistory = [];
let historyIndex = -1;

// Helper to escape HTML characters from user input to prevent UI breaks
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
    window.scrollTo(0, document.body.scrollHeight);
    terminalContainer.scrollTop = terminalContainer.scrollHeight;
}

// Boot sequence animation
const bootSequence = [
    "Inicializando sistema...",
    "Cargando perfil de Jhair Lescano...",
    "Estableciendo conexión segura... OK",
    "Resolviendo dependencias (SQL, Python, Bash, Perl)... OK",
    "Preparando módulos de Microservicios... OK",
    "¡Bienvenido a la terminal interactiva!",
    "Escribe 'help' para ver los comandos disponibles.\n"
];

async function runBootSequence() {
    isTyping = true;
    for (let i = 0; i < bootSequence.length; i++) {
        await typeText(bootSequence[i], 20); // Faster typing
    }
    commands.about.action();
    inputLine.style.display = "flex";
    hiddenInput.focus();
    isTyping = false;
}

function typeText(text, speed = 30) {
    return new Promise(resolve => {
        let i = 0;
        const div = document.createElement("div");
        div.className = "line";
        outputDiv.appendChild(div);

        const interval = setInterval(() => {
            div.innerHTML += text.charAt(i);
            scrollToBottom();
            i++;
            if (i >= text.length) {
                clearInterval(interval);
                resolve();
            }
        }, speed);
    });
}

// Input handling
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

hiddenInput.addEventListener("input", (e) => {
    inputTextSpan.textContent = hiddenInput.value;
});

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
    const args = rawCmd.split(' ');
    const cmd = args[0].toLowerCase();

    if (commands[cmd]) {
        commands[cmd].action(args.slice(1));
    } else {
        const safeCmd = escapeHTML(cmd);
        printLine(`Comando no encontrado: ${safeCmd}. Escribe 'help' para ver los comandos disponibles.`, "error");
    }
}

// Start sequence on load
window.onload = () => {
    hiddenInput.focus();
    runBootSequence();
};
