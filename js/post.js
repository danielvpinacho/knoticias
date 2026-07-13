// KNOTICIAS — lógica de la página de detalle de una nota
function formatContent(id, contenido) {
  cont_post = "";
  for (let i = 0; i < contenido.length; i++) {
    if (contenido[i].startsWith("*img*")) {
      year = id.split("-").at(-1);
      img_name = contenido[i].slice(5, -5);
      cont_post += `<img src="./img/${year}/${id}/${img_name}" alt="Imagen ${img_name}">`;
    } else {
      cont_post += `<p>${contenido[i]}</p>`;
    }
  }
  return cont_post;
}


function postPage() {
  return {
    post: null,
    renderedContent: "",
    loading: true,

    async init() {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");

      try {
        const posts = await loadAllPosts();
        this.post = posts.find((p) => p.id === id) || null;
        if (this.post) {
          this.renderedContent = marked.parse(formatContent(id, this.post.contenido) || "");
        }
      } catch (err) {
        console.error("No se pudo cargar la nota:", err);
        this.post = null;
      } finally {
        this.loading = false;
      }
    },

    catLabel(id) {
      return catInfo(id).label;
    },
    catColor(id) {
      return catInfo(id).color;
    },
    formatDate,
  };
}
