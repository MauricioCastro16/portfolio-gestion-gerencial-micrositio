<script setup lang="ts">
const goToSection = (id: string): void => {
  const section = document.getElementById(id)
  section?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <main class="one-page">
    <section id="inicio" class="view hero-view">
      <div class="hero-content">
        <p class="kicker">Portfolio del equipo</p>
        <h1 class="team-name">Gestion Gerencial</h1>
        <p class="hero-subtitle">Micrositio base listo para completar por secciones.</p>
        <div class="hero-actions">
          <button type="button" class="btn btn-primary" @click="goToSection('equipo')">
            Ver integrantes
          </button>
          <button type="button" class="btn btn-secondary" @click="goToSection('proximas-secciones')">
            Bajar a secciones
          </button>
        </div>
      </div>
      <div class="scroll-tip" aria-hidden="true">Desliza para continuar</div>
    </section>

    <section id="equipo" class="view team-view">
      <div class="section-header">
        <p class="kicker">Seccion 2</p>
        <h2>Presentacion del equipo</h2>
        <p class="section-subtitle">
          Esta seccion queda temporalmente como introduccion del equipo para seguir construyendo
          el contenido paso a paso.
        </p>
      </div>

      <div class="presentation-card">
        <p>
          Aca vamos a contar quienes somos, que enfoque tiene el equipo y como nos organizamos
          durante la cursada.
        </p>
      </div>
    </section>

    <section id="proximas-secciones" class="view next-view">
      <div class="section-header">
        <p class="kicker">Siguiente paso</p>
        <h2>Espacio para futuras secciones</h2>
        <p class="section-subtitle">
          Dejamos esta vista vacia para continuar con Desafios, RPA, TPI y reflexiones.
        </p>
      </div>
    </section>
  </main>
</template>
