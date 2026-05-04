[![Consultar a DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/MauricioCastro16/portfolio-gestion-gerencial-micrositio)

# Portfolio digital — Gestión Gerencial

![Vue](https://img.shields.io/badge/Vue-3-42b883?logo=vuedotjs&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Licencia](https://img.shields.io/badge/Licencia-GPL--3.0-blue)

Micrositio estático que funciona como portfolio digital de equipo para la asignatura de Gestión Gerencial, integrando identidad del grupo, evidencias de desafíos, rutas de aprendizaje y material del TPI en una sola experiencia web navegable y responsive.

## Características principales

- Home con identificación del equipo, miembros y acceso a presentación en video a pantalla completa.
- Secciones por desafío académico con contenido en Markdown, mapas conceptuales (JSON + ELK) y enlaces a evidencias.
- Apartado de Ruta Personal de Aprendizaje por integrante y mapas conceptuales por nivel.
- Navegación jerárquica con Vue Router, diseño adaptable a escritorio y móvil.
- Build de producción con Vite para despliegue como sitio estático.

## Stack tecnológico

| Área | Tecnologías |
|------|-------------|
| **Frontend** | Vue 3, TypeScript, Vue Router, Vite, CSS |
| **Herramientas** | Marked, elkjs, Font Awesome, Axios, vue-tsc |

## Arquitectura y flujo

La aplicación es una SPA compilada por Vite: el punto de entrada monta la raíz de Vue y el enrutador resuelve vistas bajo `frontend/src/views`. El contenido largo vive en Markdown y recursos multimedia bajo `media/`; el cliente renderiza texto y el mapa conceptual (SVG vía elkjs) en el navegador sin servidor de aplicación propio, apto para hosting estático.

## Instalación y uso

```bash
git clone https://github.com/MauricioCastro16/portfolio-gestion-gerencial-micrositio.git
cd portfolio-gestion-gerencial-micrositio/frontend
npm install
npm run dev
```

Compilación y vista previa de producción:

```bash
npm run build
npm run preview
```

## Licencia

Este proyecto se distribuye bajo la licencia GNU General Public License v3.0. Ver el archivo `LICENSE` en la raíz del repositorio.
