<template>
  <div class="desafio-pe">
    <header class="desafio-pe__hero">
      <p class="desafio-pe__hero-kicker">Gestión gerencial · Transferitos</p>
      <h1 class="desafio-pe__hero-title">Desafío 3 — Portfolio (micrositio)</h1>
      <p class="desafio-pe__hero-lead">
        Portfolio digital del equipo, alineado a los lineamientos de la materia: secciones claras, RPA, mapa
        conceptual y desafíos D3 a D7.
      </p>
    </header>

    <section class="desafio-pe__intro desafio-pe__glass" aria-labelledby="d3-problema">
      <h2 id="d3-problema" class="desafio-pe__h2">Problema abordado</h2>
      <p>
        Dar cuenta del proceso de aprendizaje del equipo en <strong>Gestión gerencial</strong> con un portfolio
        digital accesible, navegable y alineado a los lineamientos de la materia (home, equipo, RPA, mapa
        conceptual y secciones por desafío).
      </p>
    </section>

    <section class="desafio-pe__intro desafio-pe__glass" aria-labelledby="d3-solucion">
      <h2 id="d3-solucion" class="desafio-pe__h2">Solución propuesta</h2>
      <p>
        Realizamos este <strong>micrositio</strong> desarrollado con Vue y Vite: una sola página principal con
        secciones claras y páginas adicionales para la <strong>Ruta Personal de Aprendizaje</strong> de cada
        integrante, los diagramas por nivel de gestión y una página por cada desafío (D3 a D7).
      </p>
    </section>

    <section class="desafio-pe__intro desafio-pe__glass" aria-labelledby="d3-evidencias">
      <h2 id="d3-evidencias" class="desafio-pe__h2">Evidencias</h2>
      <ul class="desafio-pe__d3-links">
        <li>
          <a
            href="https://github.com/MauricioCastro16/portfolio-gestion-gerencial-micrositio"
            target="_blank"
            rel="noopener noreferrer"
            >Repositorio del código (GitHub)</a
          >
        </li>
        <li>
          <a href="https://gaoniters.vercel.app/" target="_blank" rel="noopener noreferrer"
            >Despliegue del sitio (Vercel)</a
          >
        </li>
      </ul>
    </section>

    <section class="desafio-pe__intro desafio-pe__glass" aria-labelledby="d3-herramientas">
      <h2 id="d3-herramientas" class="desafio-pe__h2">Herramientas utilizadas</h2>
      <div class="desafio-pe__chips desafio-pe__chips--d3">
        <span class="desafio-pe__chip">Vue 3</span>
        <span class="desafio-pe__chip">Vite</span>
        <span class="desafio-pe__chip">TypeScript</span>
        <span class="desafio-pe__chip">Markdown</span>
        <span class="desafio-pe__chip desafio-pe__chip--accent">Mermaid</span>
      </div>
    </section>

    <section class="desafio-pe__footer desafio-pe__glass desafio-pe__d3-reflex" aria-labelledby="d3-reflexion">
      <h2 id="d3-reflexion" class="desafio-pe__h2">Reflexión del equipo</h2>
      <p>
        Este desafío nos permitió indagar otras <strong>herramientas</strong> que antes no habíamos usado (como
        <em>Mermaid</em> para los mapas conceptuales) y definir la <strong>arquitectura de la información</strong>
        sobre cómo <strong>comunicar</strong> lo que vamos desarrollando. Buscamos no solo “tener contenido”, sino
        mostrarlo con criterios de usabilidad y trazabilidad de nuestro aprendizaje.
      </p>
    </section>
  </div>
</template>
