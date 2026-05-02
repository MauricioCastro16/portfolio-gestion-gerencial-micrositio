<script setup lang="ts">
import PeLineChart from './PeLineChart.vue'
</script>

<template>
  <div class="desafio-pe">
    <header class="desafio-pe__hero">
      <p class="desafio-pe__hero-kicker">Gestión gerencial · Transferitos</p>
      <h1 class="desafio-pe__hero-title">Punto de equilibrio</h1>
      <p class="desafio-pe__hero-lead">
        Análisis de costos fijos y variables, márgenes de contribución y volumen mínimo para cubrir estructura.
        Resultados y gráficos interactivos alineados al trabajo práctico.
      </p>
      <ul class="desafio-pe__hero-meta" aria-label="Créditos">
        <li>UTN · Facultad Regional Resistencia</li>
        <li>Beneyto, Mateo</li>
        <li>Castro, Mauricio</li>
        <li>Cocito, Maximiliano</li>
        <li>Peralta Ruiz, Nadine</li>
      </ul>
    </header>

    <section class="desafio-pe__intro desafio-pe__glass">
      <h2 class="desafio-pe__h2">Problema abordado</h2>
      <p>
        El desafío consiste en aplicar el <strong>punto de equilibrio</strong> en distintos contextos: tablas de
        ventas y costos, interpretación gráfica del cruce entre ingresos y costo total, y escenarios con cambios
        en precio y costos fijos que modifican el volumen necesario para no operar a pérdida.
      </p>
    </section>

    <!-- Ejercicio 1 -->
    <section class="desafio-pe__section" aria-labelledby="pe-ej1">
      <div class="desafio-pe__section-head">
        <span class="desafio-pe__badge">Ejercicio 1</span>
        <h2 id="pe-ej1" class="desafio-pe__section-title">Fabricación — tabla y PE en unidades</h2>
      </div>
      <div class="desafio-pe__card">
        <p class="desafio-pe__consigna">
          Completar la tabla con precio unitario <strong>$0,50</strong>, costo variable unitario
          <strong>$0,30</strong> y costo fijo <strong>$200.000</strong>. Calcular el PE y graficar.
        </p>
        <div class="desafio-pe__chips">
          <span class="desafio-pe__chip">P = $0,50</span>
          <span class="desafio-pe__chip">CVU = $0,30</span>
          <span class="desafio-pe__chip">CF = $200.000</span>
          <span class="desafio-pe__chip desafio-pe__chip--accent">MC = $0,20</span>
        </div>
        <div class="desafio-pe__formulas">
          <div class="desafio-pe__formula">
            <span class="desafio-pe__formula-label">Ventas</span>
            <code>Y = Q × P</code>
          </div>
          <div class="desafio-pe__formula">
            <span class="desafio-pe__formula-label">Costo total</span>
            <code>CT = CF + Q × CVU</code>
          </div>
          <div class="desafio-pe__formula">
            <span class="desafio-pe__formula-label">PE en unidades</span>
            <code>PE = CF ÷ (P − CVU)</code>
          </div>
        </div>
        <p class="desafio-pe__result">
          <strong>PE = 200.000 ÷ 0,20 = 1.000.000 unidades</strong> · En ese volumen, ventas y costo total
          alcanzan <strong>$500.000</strong>.
        </p>
        <PeLineChart
          title="Costo fijo, costo total e ingresos por volumen"
          :fixed-cost="200_000"
          :unit-price="0.5"
          :var-cost-per-unit="0.3"
          :x-max="2_500_000"
          x-axis-label="Unidades producidas"
        />
        <div class="desafio-pe__table-wrap">
          <table class="desafio-pe__table">
            <thead>
              <tr>
                <th>Unidades</th>
                <th>Ventas</th>
                <th>CV</th>
                <th>CF</th>
                <th>CT</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>0</td>
                <td>$0</td>
                <td>$0</td>
                <td>$200.000</td>
                <td>$200.000</td>
              </tr>
              <tr>
                <td>500.000</td>
                <td>$250.000</td>
                <td>$150.000</td>
                <td>$200.000</td>
                <td>$350.000</td>
              </tr>
              <tr class="desafio-pe__table-highlight">
                <td><strong>1.000.000</strong></td>
                <td><strong>$500.000</strong></td>
                <td><strong>$300.000</strong></td>
                <td>$200.000</td>
                <td><strong>$500.000</strong></td>
              </tr>
              <tr>
                <td>2.500.000</td>
                <td>$1.250.000</td>
                <td>$750.000</td>
                <td>$200.000</td>
                <td>$950.000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Ejercicio 2 -->
    <section class="desafio-pe__section" aria-labelledby="pe-ej2">
      <div class="desafio-pe__section-head">
        <span class="desafio-pe__badge">Ejercicio 2</span>
        <h2 id="pe-ej2" class="desafio-pe__section-title">PE en unidades y en pesos</h2>
      </div>
      <div class="desafio-pe__card">
        <div class="desafio-pe__chips">
          <span class="desafio-pe__chip">CF = $150.000</span>
          <span class="desafio-pe__chip">CVU = $500</span>
          <span class="desafio-pe__chip">P = $2.000</span>
        </div>
        <p class="desafio-pe__result">
          <strong>PE<sub>u</sub> = 100 unidades</strong> ·
          <strong>PE<sub>$</sub> = $200.000</strong>
        </p>
        <PeLineChart
          title="Intersección ventas vs costo total (eje 0–200 unidades)"
          :fixed-cost="150_000"
          :unit-price="2000"
          :var-cost-per-unit="500"
          :x-max="200"
          x-axis-label="Unidades"
        />
      </div>
    </section>

    <!-- Ejercicio 3 -->
    <section class="desafio-pe__section" aria-labelledby="pe-ej3">
      <div class="desafio-pe__section-head">
        <span class="desafio-pe__badge">Ejercicio 3</span>
        <h2 id="pe-ej3" class="desafio-pe__section-title">Servicios — mantelería Carella</h2>
      </div>
      <div class="desafio-pe__card">
        <p class="desafio-pe__consigna">
          Precio por servicio <strong>$100</strong>. CVU total <strong>$60</strong> (comisiones, operario,
          combustible, insumos y mantenimiento proporcional). Costos fijos mensuales <strong>$3.950</strong>.
        </p>
        <div class="desafio-pe__split">
          <div class="desafio-pe__mini">
            <h3 class="desafio-pe__h3">Costos variables</h3>
            <p class="desafio-pe__muted">$20 + $30 + $5 + $2 + $3 = <strong>$60</strong></p>
          </div>
          <div class="desafio-pe__mini">
            <h3 class="desafio-pe__h3">Costos fijos</h3>
            <p class="desafio-pe__muted">Alquiler + socios + recepción = <strong>$3.950</strong></p>
          </div>
        </div>
        <p class="desafio-pe__result">
          <strong>MC = $40</strong> ·
          <strong>PE ≈ 98,75 servicios</strong> (~<strong>99</strong> operativamente) ·
          <strong>PE<sub>$</sub> ≈ $9.875</strong>
        </p>
        <PeLineChart
          title="Equilibrio en volumen de lavados (0–130 servicios)"
          :fixed-cost="3950"
          :unit-price="100"
          :var-cost-per-unit="60"
          :x-max="130"
          x-axis-label="Servicios / lavados"
        />
      </div>
    </section>

    <!-- Ejercicio 4 -->
    <section class="desafio-pe__section desafio-pe__section--wide" aria-labelledby="pe-ej4">
      <div class="desafio-pe__section-head">
        <span class="desafio-pe__badge">Ejercicio 4</span>
        <h2 id="pe-ej4" class="desafio-pe__section-title">La Bolsa SA — escenarios</h2>
      </div>
      <p class="desafio-pe__lead">
        Precio base <strong>$15</strong>, CVU <strong>$8</strong>, CF <strong>$660</strong>. Tres situaciones:
        base, aumento de CF por sueldos, y combinación de suba de precio + CF elevados.
      </p>

      <div class="desafio-pe__scenario-grid">
        <article class="desafio-pe__scenario">
          <h3 class="desafio-pe__scenario-title">a) Situación base</h3>
          <p class="desafio-pe__scenario-result">PE ≈ <strong>94,28</strong> bolsas · ~<strong>$1.414</strong> en ingresos</p>
          <PeLineChart
            :fixed-cost="660"
            :unit-price="15"
            :var-cost-per-unit="8"
            :x-max="160"
            x-axis-label="Bolsas"
          />
        </article>
        <article class="desafio-pe__scenario">
          <h3 class="desafio-pe__scenario-title">b) CF + $100</h3>
          <p class="desafio-pe__scenario-note">Más estructura fija ⇒ más volumen para cubrirla.</p>
          <p class="desafio-pe__scenario-result">PE ≈ <strong>108,57</strong> bolsas</p>
          <PeLineChart
            :fixed-cost="760"
            :unit-price="15"
            :var-cost-per-unit="8"
            :x-max="160"
            x-axis-label="Bolsas"
          />
        </article>
        <article class="desafio-pe__scenario">
          <h3 class="desafio-pe__scenario-title">c) P +15 % y CF $6.500</h3>
          <p class="desafio-pe__scenario-note">Mayor margen unitario, pero CF muy altos disparan el PE.</p>
          <p class="desafio-pe__scenario-result">P nuevo <strong>$17,25</strong> · PE ≈ <strong>702,7</strong> bolsas</p>
          <PeLineChart
            :fixed-cost="6500"
            :unit-price="17.25"
            :var-cost-per-unit="8"
            :x-max="900"
            x-axis-label="Bolsas"
          />
        </article>
      </div>
    </section>

    <section class="desafio-pe__footer desafio-pe__glass">
      <h2 class="desafio-pe__h2">Herramientas y reflexión</h2>
      <p>
        <strong>Herramientas:</strong> álgebra de costos, tablas de sensibilidad y representación gráfica del cruce
        entre ingresos y costo total (punto en el que la empresa deja de tener pérdida operativa en el modelo
        estático).
      </p>
      <p>
        <strong>Reflexión:</strong> ordenar costos en fijos versus variables y usar el margen de contribución como
        puente hacia el PE permite comparar escenarios. Pequeños cambios en precio o en costos fijos pueden mover
        fuerte el volumen mínimo necesario; por eso el gráfico ayuda a comunicar el “quiebre” de forma intuitiva.
      </p>
    </section>
  </div>
</template>
