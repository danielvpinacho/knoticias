# KNOTICIAS

Sitio estático (HTML + JavaScript, sin backend) de noticias sobre K-pop y
cultura pop en CDMX y México: noticias, conciertos, entrevistas,
presentaciones de marca, teatro y cultura pop en general.

Sitio hermano de **EventosK**, con la misma arquitectura y estética
(concepto de "boleto de evento" con perforación en CSS puro), pero
enfocado en noticias en vez de únicamente eventos.

Las notas se guardan como JSON dentro del propio repositorio, divididas
**por año** (`data/posts/2026.json`, `data/posts/2027.json`, etc.) — no hay
base de datos ni servicio externo de almacenamiento. Publicar una nota
nueva es literalmente hacer commit.

## Stack

- **Sin build step.** HTML plano + [Alpine.js](https://alpinejs.dev/) (vía CDN) para
  reactividad (filtros, búsqueda, render de la lista).
- **[marked.js](https://marked.js.org/)** (vía CDN) para convertir el contenido en
  Markdown de cada nota a HTML.
- **`data/posts/<año>.json`** como fuente de datos, un archivo por año, con
  **`data/years.json`** como manifiesto de qué años existen.

## Estructura del proyecto

```
knoticias/
├── index.html          # Listado de notas + filtros + buscador
├── post.html            # Detalle de una nota (?id=<slug>)
├── css/
│   └── style.css
├── js/
│   ├── app.js             # loadAllPosts() compartido + lógica del listado
│   └── post.js             # Lógica de la página de detalle
├── data/
│   ├── years.json           # Manifiesto: años disponibles, ej. ["2027", "2026"]
│   └── posts/
│       └── 2026.json          # Notas de 2026
└── img/                     # (opcional) imágenes de las notas
```

## Categorías

| id | Nombre visible | Color |
|---|---|---|
| `noticias` | Noticias | azul eléctrico |
| `concierto` | Conciertos | rosa |
| `entrevista` | Entrevistas | cian |
| `presentacion-marca` | Presentaciones de marca | dorado |
| `teatro` | Teatro | lavanda |
| `cultura-pop` | Cultura pop | naranja (catch-all: todo lo que no entra en las demás) |

Definidas en `js/app.js`, arreglo `CATEGORIAS`. Para agregar una categoría
nueva, añádela ahí y define su color en `css/style.css` (`:root`).

## Cómo agregar una nota nueva

**Si el año de la nota ya tiene archivo** (ej. ya existe
`data/posts/2026.json` y tu nota es de 2026): ábrelo y agrega un objeto al
array.

**Si es el primer post de un año nuevo:**

1. Crea `data/posts/<año>.json` con un array que contenga solo ese objeto.
2. Agrega ese año a `data/years.json`.

**Formato de cada nota:**

```json
{
  "id": "slug-unico-de-la-nota",
  "titulo": "Título de la nota",
  "fecha": "2026-08-20",
  "categoria": "noticias",
  "tags": ["Tag uno", "Tag dos"],
  "resumen": "Una o dos líneas que aparecen en la tarjeta del listado.",
  "ubicacion": "Recinto, Ciudad (o 'Redacción KNOTICIAS' si no aplica)",
  "contenido": "## Subtítulo\n\nTexto en **Markdown**."
}
```

El campo `id` debe ser único: se usa en la URL (`post.html?id=...`).

## Cómo probarlo localmente

El sitio usa `fetch()` para leer `data/years.json` y los archivos de
`data/posts/`, así que **no funciona abriendo `index.html` directamente
con doble clic** (protocolo `file://` bloquea el fetch por CORS).

```bash
cd knoticias
python3 -m http.server 8000
# abre http://localhost:8000
```

o con Node:

```bash
npx serve .
```

## Cómo desplegar en GitHub Pages

1. Sube esta carpeta a un repositorio de GitHub (por ejemplo `knoticias`).
2. Ve a **Settings → Pages**.
3. En "Build and deployment", selecciona **Deploy from a branch**, rama
   `main` (o `master`), carpeta `/ (root)`.
4. Guarda. GitHub te dará una URL tipo `https://usuario.github.io/knoticias/`.
5. Para usar tu dominio propio (`knoticias.com`):
   - Agrega un archivo `CNAME` en la raíz del repo con el contenido
     `knoticias.com`.
   - En tu proveedor de DNS, apunta el dominio a GitHub Pages (4 registros
     **A** apuntando a las IPs de GitHub Pages, o un registro **CNAME** si
     usas un subdominio como `www`).
   - En Settings → Pages, escribe tu dominio en el campo "Custom domain"
     y activa "Enforce HTTPS" una vez que el certificado esté listo.
