// KNOTICIAS — lógica del listado principal
// Sin backend: las notas viven en data/posts/<año>.json dentro del repo.

const CATEGORIAS = [
  { id: "noticias", label: "Noticias", color: "#4fc3ff" },
  { id: "concierto", label: "Conciertos", color: "#ff2e7e" },
  { id: "entrevista", label: "Entrevistas", color: "#29e5c6" },
  { id: "presentacion-marca", label: "Presentaciones de marca", color: "#ffc93c" },
  { id: "teatro", label: "Teatro", color: "#b98cff" },
  { id: "cultura-pop", label: "Cultura pop", color: "#ff8a3c" },
];

function catInfo(id) {
  return CATEGORIAS.find((c) => c.id === id) || { label: id, color: "#a79fc4" };
}

function formatDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
}

// Las notas viven en data/posts/<año>.json, uno por año, para que el
// repositorio no acumule un solo JSON gigante. data/years.json es el
// manifiesto con los años disponibles.
async function loadAllPosts() {
  try {
    const yearsRes = await fetch("data/years.json");
    const years = await yearsRes.json();

    const yearFiles = await Promise.all(
      years.map(async (year) => {
        try {
          const res = await fetch(`data/posts/${year}.json`);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return await res.json();
        } catch (err) {
          console.error(`No se pudo cargar data/posts/${year}.json:`, err);
          return [];
        }
      })
    );

    return yearFiles.flat();
  } catch (err) {
    console.error("No se pudo cargar data/years.json:", err);
    return [];
  }
}

function blog() {
  return {
    posts: [],
    categoria: "todos",
    query: "",
    categorias: CATEGORIAS,

    async init() {
      this.posts = await loadAllPosts();
    },

    catLabel(id) {
      return catInfo(id).label;
    },
    catColor(id) {
      return catInfo(id).color;
    },
    formatDate,

    filtered() {
      return this.posts
        .filter((p) => this.categoria === "todos" || p.categoria === this.categoria)
        .filter((p) => {
          if (!this.query.trim()) return true;
          const q = this.query.trim().toLowerCase();
          return (
            p.titulo.toLowerCase().includes(q) ||
            p.resumen.toLowerCase().includes(q) ||
            (p.tags || []).some((t) => t.toLowerCase().includes(q))
          );
        })
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    },

    upcoming() {
      const today = new Date().toISOString().slice(0, 10);
      const future = this.posts.filter((p) => p.fecha >= today);
      const base = (future.length ? future : this.posts)
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
        .slice(0, 6);
      return base;
    },
  };
}
