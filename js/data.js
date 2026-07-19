// ============================================================
// FUENTE ÚNICA DE DATOS DEL PERFIL
// Este archivo es compartido por las dos versiones:
//   - Terminal:  js/terminal.js  (index.html)
//   - Clásica:   js/classic_script.js  (classic.html)
// Para actualizar nombre, rol, teléfono, email o enlaces,
// edita SOLO este archivo.
// ============================================================

const PROFILE = {
  name: "Jhair Lescano",
  role: "Data Engineer | Cloud | Databricks | IA",
  experience: "SQL Server, SQL Oracle, Python, Machine Learning",
  phone: "+51 933243356",
  email: "jlescanoguevara@gmail.com",
  // URL que se comparte con el botón/comando "share"
  url: "https://www.linkedin.com/in/jhair-lescano/",
};

const LINKS = [
  { name: 'My Website', url: 'https://jhairlescano.vercel.app/', icon: 'fas fa-globe', desc: 'Visit my personal website.' },
  { name: 'GitHub', url: 'https://github.com/jlescanog', icon: 'fab fa-github', desc: 'Download free source code on GitHub.' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/jhair-lescano/', icon: 'fab fa-linkedin', desc: 'Connect with me on LinkedIn.' },
  { name: 'Instagram', url: 'https://www.instagram.com/jhair.lescano', icon: 'fab fa-instagram', desc: 'Follow me for more updates.' },
  { name: 'Facebook', url: 'https://www.facebook.com/JhairLescanoG', icon: 'fab fa-facebook', desc: 'Check out my Facebook page.' },
  { name: 'Twitter', url: 'https://x.com/jlescanog', icon: 'fab fa-twitter', desc: 'Follow me on Twitter.' }
];

const SHARE_OPTIONS = [
  { name: 'Facebook', getUrl: (url) => `https://www.facebook.com/sharer/sharer.php?u=${url}`, icon: 'fab fa-facebook' },
  { name: 'Twitter', getUrl: (url) => `https://twitter.com/intent/tweet?url=${url}`, icon: 'fab fa-twitter' },
  { name: 'LinkedIn', getUrl: (url) => `https://www.linkedin.com/shareArticle?url=${url}`, icon: 'fab fa-linkedin' },
  { name: 'WhatsApp', getUrl: (url) => `https://wa.me/?text=${url}`, icon: 'fab fa-whatsapp' },
  { name: 'Email', getUrl: (url) => `mailto:?subject=Check this out&body=${url}`, icon: 'fas fa-envelope' }
];
