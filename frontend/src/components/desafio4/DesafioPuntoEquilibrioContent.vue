<script setup lang="ts">
import { computed } from 'vue'
import PeLineChart from './PeLineChart.vue'

/** Escenario La Bolsa SA — valores numéricos para textos y comparaciones. */
const e4aPe = 660 / 7
const e4bPe = 760 / 7
const e4cPe = 6500 / 9.25
const e4pBase = 15
const e4pC = 17.25

function ceilPe(u: number): number {
  return Math.ceil(u - 1e-9)
}

const e4bIngresoPe = computed(() => e4bPe * e4pBase)
const e4bMasUnidades = computed(() => ceilPe(e4bPe) - ceilPe(e4aPe))
const e4cIngresoPe = computed(() => e4cPe * e4pC)

const moneyInt = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

const numPe = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 2, minimumFractionDigits: 0 })
</script>

<template>
  <div class="desafio-pe">
    <header class="desafio-pe__hero">
      <p class="desafio-pe__hero-kicker">Gestión gerencial · Transferitos</p>
      <h1 class="desafio-pe__hero-title">Punto de equilibrio</h1>
      <p class="desafio-pe__hero-lead">
        Análisis de costes fijos y variables, margen de contribución y volumen mínimo para cubrir la estructura.
        Siglas y fórmulas de la cátedra están reunidas en el bloque siguiente.
      </p>
    </header>

    <!-- Global: glosario + fórmulas (aplica a todos los ejercicios) -->
    <section class="desafio-pe__global desafio-pe__glass" aria-labelledby="pe-global">
      <h2 id="pe-global" class="desafio-pe__h2 desafio-pe__h2--global">Glosario de siglas</h2>
      <ul class="desafio-pe__gloss-list desafio-pe__gloss-list--global">
        <li><strong>PE</strong> — Punto de equilibrio.</li>
        <li><strong>PE<sub>u</sub></strong> — Punto de equilibrio expresado en unidades.</li>
        <li><strong>PE<sub>$</sub></strong> — Punto de equilibrio expresado en pesos (importe de ingresos).</li>
        <li><strong>CF</strong> — Coste fijo.</li>
        <li><strong>CVU</strong> — Coste variable unitario (coste variable por unidad).</li>
        <li><strong>P</strong> — Precio por unidad.</li>
        <li><strong>MC</strong> — Margen de contribución unitario.</li>
        <li><strong>CV</strong> — Coste variable del período (p. ej. en tablas: Q × CVU).</li>
        <li><strong>CT</strong> — Coste total.</li>
        <li><strong>Q</strong> — Cantidad / unidades (o servicios).</li>
      </ul>

      <h3 class="desafio-pe__h3-global">Fórmulas de la cátedra</h3>

      <p class="desafio-pe__cat-label desafio-pe__cat-label--global">Margen de contribución</p>
      <p class="desafio-pe__cat-text">Margen de contribución = Precio por unidad − Coste por unidad</p>
      <div class="desafio-pe__formula-row">
        <span class="desafio-pe__formula-eq">MC =</span>
        <span class="desafio-pe__formula-plain">P − CVU</span>
      </div>

      <p class="desafio-pe__cat-label desafio-pe__cat-label--global">Punto de equilibrio en unidades</p>
      <div class="desafio-pe__formula-row desafio-pe__formula-row--wrap">
        <span class="desafio-pe__formula-eq">PE<sub>u</sub> =</span>
        <span class="desafio-pe__frac desafio-pe__frac--den-wide">
          <span class="desafio-pe__frac-num">Coste fijo</span>
          <span class="desafio-pe__frac-bar" />
          <span class="desafio-pe__frac-den">Precio por unidad − Coste por unidad</span>
        </span>
      </div>

      <p class="desafio-pe__cat-label desafio-pe__cat-label--global">Punto de equilibrio en pesos</p>
      <div class="desafio-pe__formula-row desafio-pe__formula-row--wrap">
        <span class="desafio-pe__formula-eq">PE<sub>$</sub> =</span>
        <span class="desafio-pe__frac desafio-pe__frac--den-wide">
          <span class="desafio-pe__frac-num">Coste fijo</span>
          <span class="desafio-pe__frac-bar" />
          <span class="desafio-pe__frac-den desafio-pe__frac-den--compound">
            <span class="desafio-pe__frac-den-prefix">1 −</span>
            <span class="desafio-pe__frac desafio-pe__frac--nested">
              <span class="desafio-pe__frac-num">Coste unitario</span>
              <span class="desafio-pe__frac-bar" />
              <span class="desafio-pe__frac-den">Precio unitario</span>
            </span>
          </span>
        </span>
      </div>

      <p class="desafio-pe__cat-label desafio-pe__cat-label--global">Relaciones auxiliares (tablas y gráficos)</p>
      <div class="desafio-pe__aux">
        <span>Ingresos por ventas = Q × P</span>
        <span>Coste variable total CV = Q × CVU</span>
        <span>Coste total CT = CF + CV</span>
      </div>
    </section>

    <section class="desafio-pe__intro desafio-pe__glass">
      <h2 class="desafio-pe__h2">Problema abordado</h2>
      <p>
        El desafío consiste en aplicar el <strong>punto de equilibrio</strong> en distintos contextos: tablas de
        ventas y costes, interpretación gráfica del cruce entre ingresos y coste total, y escenarios con cambios
        en precio y costes fijos que modifican el volumen necesario para no operar a pérdida.
      </p>
    </section>

    <!-- Ejercicio 1 -->
    <section class="desafio-pe__section" aria-label="Ejercicio 1">
      <div class="desafio-pe__section-head">
        <span class="desafio-pe__badge">Ejercicio 1</span>
      </div>
      <div class="desafio-pe__card">
        <p class="desafio-pe__consigna">
          Completar la tabla con precio por unidad <strong>$0,50</strong>, coste variable unitario
          <strong>$0,30</strong> y coste fijo <strong>$200.000</strong>. Calcular el PE y graficar.
        </p>

        <p class="desafio-pe__datos-title">Datos</p>
        <div class="desafio-pe__chips">
          <span class="desafio-pe__chip">P = $0,50</span>
          <span class="desafio-pe__chip">CVU = $0,30</span>
          <span class="desafio-pe__chip">CF = $200.000</span>
          <span class="desafio-pe__chip desafio-pe__chip--accent">MC = $0,20</span>
        </div>

        <div class="desafio-pe__result">
          <span class="desafio-pe__result-label">Cálculo — punto de equilibrio en unidades</span>
          <span
            class="desafio-pe__formula-row desafio-pe__formula-row--result"
            aria-label="PE sub u igual fracción 200 mil sobre 0,50 menos 0,30 igual fracción 200 mil sobre 0,20 igual 1 millón de unidades"
          >
            <span class="desafio-pe__formula-eq">PE<sub>u</sub> =</span>
            <span class="desafio-pe__frac">
              <span class="desafio-pe__frac-num">200.000</span>
              <span class="desafio-pe__frac-bar" />
              <span class="desafio-pe__frac-den">0,50 − 0,30</span>
            </span>
            <span class="desafio-pe__formula-plain">=</span>
            <span class="desafio-pe__frac">
              <span class="desafio-pe__frac-num">200.000</span>
              <span class="desafio-pe__frac-bar" />
              <span class="desafio-pe__frac-den">0,20</span>
            </span>
            <span class="desafio-pe__formula-plain">= <strong>1.000.000</strong> unidades</span>
          </span>
        </div>

        <div class="desafio-pe__result desafio-pe__result--sep">
          <span class="desafio-pe__result-label">Cálculo — punto de equilibrio en pesos</span>
          <div class="desafio-pe__formula-row desafio-pe__formula-row--wrap">
            <span class="desafio-pe__formula-eq">PE<sub>$</sub> =</span>
            <span class="desafio-pe__frac desafio-pe__frac--den-wide">
              <span class="desafio-pe__frac-num">200.000</span>
              <span class="desafio-pe__frac-bar" />
              <span class="desafio-pe__frac-den desafio-pe__frac-den--compound">
                <span class="desafio-pe__frac-den-prefix">1 −</span>
                <span class="desafio-pe__frac desafio-pe__frac--nested">
                  <span class="desafio-pe__frac-num">0,30</span>
                  <span class="desafio-pe__frac-bar" />
                  <span class="desafio-pe__frac-den">0,50</span>
                </span>
              </span>
            </span>
            <span class="desafio-pe__formula-plain">=</span>
            <span class="desafio-pe__frac">
              <span class="desafio-pe__frac-num">200.000</span>
              <span class="desafio-pe__frac-bar" />
              <span class="desafio-pe__frac-den">0,40</span>
            </span>
            <span class="desafio-pe__formula-plain">= <strong>$500.000</strong></span>
          </div>
          <p class="desafio-pe__result-note">
            Coincide con el cruce en el gráfico: a 1.000.000 unidades, ingresos y coste total valen
            <strong>$500.000</strong>.
          </p>
        </div>

        <PeLineChart
          title="Ingresos, coste fijo, coste variable total, coste total"
          :fixed-cost="200_000"
          :unit-price="0.5"
          :var-cost-per-unit="0.3"
          :x-max="2_500_000"
          x-axis-label="Unidades producidas"
        />

        <div class="desafio-pe__table-wrap">
          <table class="desafio-pe__table">
            <caption class="desafio-pe__table-cap">
              CV = coste variable del período · CF = coste fijo · CT = coste total
            </caption>
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
    <section class="desafio-pe__section" aria-label="Ejercicio 2">
      <div class="desafio-pe__section-head">
        <span class="desafio-pe__badge">Ejercicio 2</span>
      </div>
      <div class="desafio-pe__card">
        <p class="desafio-pe__datos-title">Datos</p>
        <div class="desafio-pe__chips">
          <span class="desafio-pe__chip">CF = $150.000</span>
          <span class="desafio-pe__chip">CVU = $500</span>
          <span class="desafio-pe__chip">P = $2.000</span>
        </div>

        <div class="desafio-pe__calc-block">
          <p class="desafio-pe__cat-label">Punto de equilibrio en unidades</p>
          <div class="desafio-pe__formula-row desafio-pe__formula-row--result">
            <span class="desafio-pe__formula-eq">PE<sub>u</sub> =</span>
            <span class="desafio-pe__frac">
              <span class="desafio-pe__frac-num">150.000</span>
              <span class="desafio-pe__frac-bar" />
              <span class="desafio-pe__frac-den">2.000 − 500</span>
            </span>
            <span class="desafio-pe__formula-plain">=</span>
            <span class="desafio-pe__frac">
              <span class="desafio-pe__frac-num">150.000</span>
              <span class="desafio-pe__frac-bar" />
              <span class="desafio-pe__frac-den">1.500</span>
            </span>
            <span class="desafio-pe__formula-plain">= <strong>100</strong> unidades</span>
          </div>

          <p class="desafio-pe__cat-label">Punto de equilibrio en pesos</p>
          <div class="desafio-pe__formula-row desafio-pe__formula-row--wrap">
            <span class="desafio-pe__formula-eq">PE<sub>$</sub> =</span>
            <span class="desafio-pe__frac desafio-pe__frac--den-wide">
              <span class="desafio-pe__frac-num">150.000</span>
              <span class="desafio-pe__frac-bar" />
              <span class="desafio-pe__frac-den desafio-pe__frac-den--compound">
                <span class="desafio-pe__frac-den-prefix">1 −</span>
                <span class="desafio-pe__frac desafio-pe__frac--nested">
                  <span class="desafio-pe__frac-num">500</span>
                  <span class="desafio-pe__frac-bar" />
                  <span class="desafio-pe__frac-den">2.000</span>
                </span>
              </span>
            </span>
            <span class="desafio-pe__formula-plain">=</span>
            <span class="desafio-pe__frac">
              <span class="desafio-pe__frac-num">150.000</span>
              <span class="desafio-pe__frac-bar" />
              <span class="desafio-pe__frac-den">0,75</span>
            </span>
            <span class="desafio-pe__formula-plain">= <strong>$200.000</strong></span>
          </div>
          <p class="desafio-pe__cat-hint">Comprobación: PE<sub>$</sub> = PE<sub>u</sub> × P = 100 × 2.000 = $200.000.</p>
        </div>

        <PeLineChart
          title="Ingresos, coste fijo, coste variable total, coste total (0–200 unidades)"
          :fixed-cost="150_000"
          :unit-price="2000"
          :var-cost-per-unit="500"
          :x-max="200"
          x-axis-label="Unidades"
        />
      </div>
    </section>

    <!-- Ejercicio 3 -->
    <section class="desafio-pe__section" aria-label="Ejercicio 3">
      <div class="desafio-pe__section-head">
        <span class="desafio-pe__badge">Ejercicio 3</span>
      </div>
      <div class="desafio-pe__card">
        <p class="desafio-pe__consigna">
          Precio por servicio <strong>$100</strong>. CVU total <strong>$60</strong> (comisiones, operario,
          combustible, insumos y mantenimiento proporcional). Costes fijos mensuales <strong>$3.950</strong>.
        </p>

        <div class="desafio-pe__split">
          <div class="desafio-pe__mini">
            <h3 class="desafio-pe__h3">Costes variables</h3>
            <p class="desafio-pe__muted">$20 + $30 + $5 + $2 + $3 = <strong>$60</strong></p>
          </div>
          <div class="desafio-pe__mini">
            <h3 class="desafio-pe__h3">Costes fijos</h3>
            <p class="desafio-pe__muted">Alquiler + socios + recepción = <strong>$3.950</strong></p>
          </div>
        </div>

        <p class="desafio-pe__datos-title">Datos</p>
        <div class="desafio-pe__chips">
          <span class="desafio-pe__chip">P = $100</span>
          <span class="desafio-pe__chip">CVU = $60</span>
          <span class="desafio-pe__chip">CF = $3.950</span>
          <span class="desafio-pe__chip desafio-pe__chip--accent">MC = $40</span>
        </div>

        <p class="desafio-pe__cat-label">Margen de contribución</p>
        <div class="desafio-pe__formula-row">
          <span class="desafio-pe__formula-eq">MC =</span>
          <span class="desafio-pe__formula-plain">100 − 60 = <strong>$40</strong></span>
        </div>

        <p class="desafio-pe__cat-label">Punto de equilibrio en unidades</p>
        <div class="desafio-pe__formula-row desafio-pe__formula-row--result">
          <span class="desafio-pe__formula-eq">PE<sub>u</sub> =</span>
          <span class="desafio-pe__frac">
            <span class="desafio-pe__frac-num">3.950</span>
            <span class="desafio-pe__frac-bar" />
            <span class="desafio-pe__frac-den">40</span>
          </span>
          <span class="desafio-pe__formula-plain">= <strong>98,75</strong> servicios (~<strong>99</strong> en la práctica)</span>
        </div>

        <p class="desafio-pe__cat-label">Punto de equilibrio en pesos</p>
        <div class="desafio-pe__formula-row desafio-pe__formula-row--wrap">
          <span class="desafio-pe__formula-eq">PE<sub>$</sub> =</span>
          <span class="desafio-pe__frac desafio-pe__frac--den-wide">
            <span class="desafio-pe__frac-num">3.950</span>
            <span class="desafio-pe__frac-bar" />
            <span class="desafio-pe__frac-den desafio-pe__frac-den--compound">
              <span class="desafio-pe__frac-den-prefix">1 −</span>
              <span class="desafio-pe__frac desafio-pe__frac--nested">
                <span class="desafio-pe__frac-num">60</span>
                <span class="desafio-pe__frac-bar" />
                <span class="desafio-pe__frac-den">100</span>
              </span>
            </span>
          </span>
          <span class="desafio-pe__formula-plain">=</span>
          <span class="desafio-pe__frac">
            <span class="desafio-pe__frac-num">3.950</span>
            <span class="desafio-pe__frac-bar" />
            <span class="desafio-pe__frac-den">0,40</span>
          </span>
          <span class="desafio-pe__formula-plain">≈ <strong>$9.875</strong></span>
        </div>

        <PeLineChart
          title="Ingresos, coste fijo, coste variable total, coste total (0–130 servicios)"
          :fixed-cost="3950"
          :unit-price="100"
          :var-cost-per-unit="60"
          :x-max="130"
          x-axis-label="Servicios / lavados"
        />
      </div>
    </section>

    <!-- Ejercicio 4 -->
    <section class="desafio-pe__section desafio-pe__section--wide" aria-label="Ejercicio 4">
      <div class="desafio-pe__section-head">
        <span class="desafio-pe__badge">Ejercicio 4</span>
      </div>

      <p class="desafio-pe__lead">
        Precio base <strong>$15</strong>, CVU <strong>$8</strong>, CF <strong>$660</strong>. Tres situaciones de la consigna.
      </p>

      <div class="desafio-pe__scenario-grid">
        <article class="desafio-pe__scenario">
          <h3 class="desafio-pe__scenario-title">a) Situación base</h3>
          <p class="desafio-pe__datos-title desafio-pe__datos-title--inline">Datos</p>
          <div class="desafio-pe__chips desafio-pe__chips--compact">
            <span class="desafio-pe__chip">P = $15</span>
            <span class="desafio-pe__chip">CVU = $8</span>
            <span class="desafio-pe__chip">CF = $660</span>
          </div>
          <div class="desafio-pe__formula-row desafio-pe__formula-row--stack">
            <span class="desafio-pe__formula-eq">PE<sub>u</sub> =</span>
            <span class="desafio-pe__frac">
              <span class="desafio-pe__frac-num">660</span>
              <span class="desafio-pe__frac-bar" />
              <span class="desafio-pe__frac-den">15 − 8</span>
            </span>
            <span class="desafio-pe__formula-plain">≈ <strong>94,28</strong> bolsas</span>
          </div>
          <p class="desafio-pe__scenario-result">
            Ingresos en el PE ≈ <strong>{{ moneyInt.format(e4aPe * e4pBase) }}</strong> (94,28 × 15)
          </p>
          <PeLineChart
            :fixed-cost="660"
            :unit-price="15"
            :var-cost-per-unit="8"
            :x-max="160"
            x-axis-label="Bolsas"
            hide-pe-summary
          />
        </article>

        <article class="desafio-pe__scenario">
          <h3 class="desafio-pe__scenario-title">b) Incremento de costes fijos ($100)</h3>
          <p class="desafio-pe__scenario-consigna">
            Si los accionistas otorgan un incremento de sueldos a los administrativos, se incrementan los costes
            fijos de la línea en <strong>$100</strong>. ¿Cómo repercute en el punto de equilibrio? Calcular y explicar
            conclusiones.
          </p>
          <p class="desafio-pe__datos-title desafio-pe__datos-title--inline">Datos</p>
          <div class="desafio-pe__chips desafio-pe__chips--compact">
            <span class="desafio-pe__chip">P = $15</span>
            <span class="desafio-pe__chip">CVU = $8</span>
            <span class="desafio-pe__chip">CF = $760</span>
          </div>
          <div class="desafio-pe__formula-row desafio-pe__formula-row--stack">
            <span class="desafio-pe__formula-eq">PE<sub>u</sub> =</span>
            <span class="desafio-pe__frac">
              <span class="desafio-pe__frac-num">760</span>
              <span class="desafio-pe__frac-bar" />
              <span class="desafio-pe__frac-den">15 − 8</span>
            </span>
            <span class="desafio-pe__formula-plain">≈ <strong>108,57</strong> bolsas</span>
          </div>
          <p class="desafio-pe__scenario-result">
            Ingresos en el PE ≈ <strong>{{ moneyInt.format(e4bIngresoPe) }}</strong> (108,57 × 15)
          </p>
          <p class="desafio-pe__scenario-delta">
            Respecto del escenario (a), hace falta producir y vender
            <strong>{{ e4bMasUnidades }}</strong> bolsas más, comparando PE redondeado <strong>hacia arriba</strong>
            en cada caso: ceil(108,57) − ceil(94,28) = {{ ceilPe(e4bPe) }} − {{ ceilPe(e4aPe) }}.
          </p>
          <PeLineChart
            :fixed-cost="760"
            :unit-price="15"
            :var-cost-per-unit="8"
            :x-max="160"
            x-axis-label="Bolsas"
            hide-pe-summary
          />
        </article>

        <article class="desafio-pe__scenario">
          <h3 class="desafio-pe__scenario-title">c) Precio +15 % y CF $6.500</h3>
          <p class="desafio-pe__scenario-consigna">
            Si el precio de las Bolsas Familiares aumenta un <strong>15 %</strong> y los costes fijos de la línea
            pasan a <strong>$6.500</strong>, ¿cuál es la nueva situación de equilibrio? Conclusiones.
          </p>
          <p class="desafio-pe__datos-title desafio-pe__datos-title--inline">Datos</p>
          <div class="desafio-pe__chips desafio-pe__chips--compact">
            <span class="desafio-pe__chip">P = $17,25</span>
            <span class="desafio-pe__chip">CVU = $8</span>
            <span class="desafio-pe__chip">CF = $6.500</span>
          </div>
          <div class="desafio-pe__formula-row desafio-pe__formula-row--stack">
            <span class="desafio-pe__formula-eq">PE<sub>u</sub> =</span>
            <span class="desafio-pe__frac">
              <span class="desafio-pe__frac-num">6.500</span>
              <span class="desafio-pe__frac-bar" />
              <span class="desafio-pe__frac-den">17,25 − 8</span>
            </span>
            <span class="desafio-pe__formula-plain">≈ <strong>702,7</strong> bolsas</span>
          </div>
          <p class="desafio-pe__scenario-result">
            Ingresos en el PE ≈ <strong>{{ moneyInt.format(e4cIngresoPe) }}</strong> (702,7 × 17,25)
          </p>
          <PeLineChart
            :fixed-cost="6500"
            :unit-price="17.25"
            :var-cost-per-unit="8"
            :x-max="900"
            x-axis-label="Bolsas"
            hide-pe-summary
          />
        </article>
      </div>

      <div class="desafio-pe__e4-pe-below desafio-pe__glass" aria-label="Resumen de punto de equilibrio por escenario">
        <p class="pe-chart-block__pe-label desafio-pe__e4-pe-below-kicker">Punto de equilibrio (aprox.)</p>
        <ul class="desafio-pe__e4-pe-below-list">
          <li>
            <span class="desafio-pe__e4-pe-below-tag">a)</span>
            <span class="pe-chart-block__pe-values"
              >{{ numPe.format(e4aPe) }} bolsas · {{ moneyInt.format(e4aPe * e4pBase) }}</span
            >
          </li>
          <li>
            <span class="desafio-pe__e4-pe-below-tag">b)</span>
            <span class="pe-chart-block__pe-values"
              >{{ numPe.format(e4bPe) }} bolsas · {{ moneyInt.format(e4bIngresoPe) }}</span
            >
          </li>
          <li>
            <span class="desafio-pe__e4-pe-below-tag">c)</span>
            <span class="pe-chart-block__pe-values"
              >{{ numPe.format(e4cPe) }} bolsas · {{ moneyInt.format(e4cIngresoPe) }}</span
            >
          </li>
        </ul>
      </div>

      <div class="desafio-pe__ej4-conclusions desafio-pe__glass">
        <h3 class="desafio-pe__h3-global">Conclusiones — incisos b) y c)</h3>

        <div class="desafio-pe__conclusion-block">
          <p class="desafio-pe__conclusion-tag">b) Sueldos administrativos (+$100 en CF)</p>
          <p>
            El punto de equilibrio sube de <strong>≈94,28</strong> a <strong>≈108,57</strong> bolsas: al aumentar solo
            los costes fijos (sin cambiar precio ni coste variable unitario), el margen de contribución por bolsa se
            mantiene ($7), pero hay más coste fijo que cubrir con ese margen, así que hace falta un volumen mayor. La
            empresa pasa de necesitar ~95 unidades enteras (ceil del PE) a ~109, es decir
            <strong>{{ e4bMasUnidades }} bolsas más</strong> que en la situación base si se redondea cada PE hacia
            arriba para planificar en unidades discretas.
          </p>
        </div>

        <div class="desafio-pe__conclusion-block">
          <p class="desafio-pe__conclusion-tag">c) Precio +15 % y CF = $6.500</p>
          <p>
            El precio pasa a <strong>$17,25</strong> y el margen unitario mejora (9,25 vs 7), pero el aumento muy
            fuerte de los costes fijos domina el resultado: el PE salta a <strong>≈702,7</strong> bolsas e ingresos
            mínimos en torno a <strong>{{ moneyInt.format(e4cIngresoPe) }}</strong>. Aunque cada unidad deja más
            contribución, la estructura fija exige un volumen muy alto para alcanzar equilibrio; en la práctica habría
            que evaluar si el mercado y la capacidad sostienen ese nivel de ventas.
          </p>
        </div>
      </div>
    </section>

    <section class="desafio-pe__footer desafio-pe__glass">
      <h2 class="desafio-pe__h2">Herramientas y reflexión</h2>
      <p>
        <strong>Herramientas:</strong> álgebra de costes, tablas de sensibilidad y representación gráfica del cruce
        entre ingresos y coste total (punto en el que la empresa deja de tener pérdida operativa en el modelo
        estático).
      </p>
      <p>
        <strong>Reflexión:</strong> ordenar costes en fijos versus variables y usar el margen de contribución como
        puente hacia el PE permite comparar escenarios. Pequeños cambios en precio o en costes fijos pueden mover
        fuerte el volumen mínimo necesario; por eso el gráfico ayuda a comunicar el “quiebre” de forma intuitiva.
      </p>
    </section>
  </div>
</template>
