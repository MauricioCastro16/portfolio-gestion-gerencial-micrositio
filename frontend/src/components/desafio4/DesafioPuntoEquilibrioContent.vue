<script setup lang="ts">
import PeLineChart from './PeLineChart.vue'
</script>

<template>
  <div class="desafio-pe">
    <header class="desafio-pe__hero">
      <p class="desafio-pe__hero-kicker">Gestión gerencial · Transferitos</p>
      <h1 class="desafio-pe__hero-title">Punto de equilibrio</h1>
      <p class="desafio-pe__hero-lead">
        Análisis de costes fijos y variables, margen de contribución y volumen mínimo para cubrir la estructura.
        Las siglas usadas están definidas en cada bloque (glosario previo al uso).
      </p>
    </header>

    <section class="desafio-pe__intro desafio-pe__glass">
      <h2 class="desafio-pe__h2">Problema abordado</h2>
      <p>
        El desafío consiste en aplicar el <strong>punto de equilibrio</strong> en distintos contextos: tablas de
        ventas y costes, interpretación gráfica del cruce entre ingresos y coste total, y escenarios con cambios
        en precio y costes fijos que modifican el volumen necesario para no operar a pérdida.
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
          Completar la tabla con precio por unidad <strong>$0,50</strong>, coste variable unitario
          <strong>$0,30</strong> y coste fijo <strong>$200.000</strong>. Calcular el PE y graficar.
        </p>

        <div class="desafio-pe__gloss" role="note">
          <p class="desafio-pe__gloss-title">Siglas en este ejercicio</p>
          <ul class="desafio-pe__gloss-list">
            <li><strong>PE</strong> — Punto de equilibrio.</li>
            <li><strong>CF</strong> — Coste fijo.</li>
            <li><strong>CVU</strong> — Coste variable por unidad (coste variable unitario).</li>
            <li><strong>P</strong> — Precio por unidad.</li>
            <li><strong>MC</strong> — Margen de contribución unitario.</li>
            <li><strong>CV</strong> — Coste variable del período (en la tabla).</li>
            <li><strong>CT</strong> — Coste total.</li>
            <li><strong>Q</strong> — Cantidad / unidades.</li>
          </ul>
        </div>

        <div class="desafio-pe__chips">
          <span class="desafio-pe__chip">P = $0,50</span>
          <span class="desafio-pe__chip">CVU = $0,30</span>
          <span class="desafio-pe__chip">CF = $200.000</span>
          <span class="desafio-pe__chip desafio-pe__chip--accent">MC = $0,20</span>
        </div>

        <div class="desafio-pe__cat-formulas">
          <p class="desafio-pe__cat-title">Fórmulas de la cátedra</p>

          <p class="desafio-pe__cat-label">Margen de contribución</p>
          <p class="desafio-pe__cat-text">Margen de contribución = Precio por unidad − Coste por unidad</p>
          <div class="desafio-pe__formula-row" aria-label="MC igual P menos CVU">
            <span class="desafio-pe__formula-eq">MC =</span>
            <span class="desafio-pe__formula-plain">P − CVU = 0,50 − 0,30 = <strong>0,20</strong></span>
          </div>

          <p class="desafio-pe__cat-label">Punto de equilibrio en unidades</p>
          <p class="desafio-pe__cat-text">
            Punto de equilibrio en unidades =
            <span class="desafio-pe__sr-only">Coste fijo dividido entre paréntesis precio por unidad menos coste por unidad</span>
          </p>
          <div class="desafio-pe__formula-row" aria-label="PE en unidades igual CF entre P menos CVU">
            <span class="desafio-pe__formula-eq">PE<sub>u</sub> =</span>
            <span class="desafio-pe__frac" aria-hidden="true">
              <span class="desafio-pe__frac-num">Coste fijo</span>
              <span class="desafio-pe__frac-bar" />
              <span class="desafio-pe__frac-den">Precio por unidad − Coste por unidad</span>
            </span>
          </div>

          <p class="desafio-pe__cat-label">Punto de equilibrio en pesos</p>
          <p class="desafio-pe__cat-text">
            Punto de equilibrio en pesos =
            <span class="desafio-pe__sr-only">Coste fijo dividido entre uno menos cociente coste variable sobre precio unitario</span>
          </p>
          <div class="desafio-pe__formula-row desafio-pe__formula-row--wrap">
            <span class="desafio-pe__formula-eq">PE<sub>$</sub> =</span>
            <span class="desafio-pe__frac desafio-pe__frac--den-wide" aria-hidden="true">
              <span class="desafio-pe__frac-num">Coste fijo</span>
              <span class="desafio-pe__frac-bar" />
              <span class="desafio-pe__frac-den desafio-pe__frac-den--compound">
                <span class="desafio-pe__frac-den-prefix">1 −</span>
                <span class="desafio-pe__frac desafio-pe__frac--nested">
                  <span class="desafio-pe__frac-num">Coste variable unitario</span>
                  <span class="desafio-pe__frac-bar" />
                  <span class="desafio-pe__frac-den">Precio unitario</span>
                </span>
              </span>
            </span>
          </div>
          <p class="desafio-pe__cat-hint">
            En problemas con coste variable proporcional al volumen, el cociente es <strong>CVU / P</strong> (equivalente al
            reparto variable sobre precio).
          </p>

          <p class="desafio-pe__cat-label">Relaciones auxiliares (tabla)</p>
          <div class="desafio-pe__aux">
            <span>Ingresos por ventas = Q × P</span>
            <span>Coste total CT = CF + CV</span>
          </div>
        </div>

        <p class="desafio-pe__result">
          <span class="desafio-pe__result-label">Cálculo (PE en unidades)</span>
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
          <span class="desafio-pe__result-note">
            En ese volumen, ingresos y coste total coinciden en <strong>$500.000</strong>.
          </span>
        </p>

        <PeLineChart
          title="Coste fijo, coste total e ingresos por volumen"
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
    <section class="desafio-pe__section" aria-labelledby="pe-ej2">
      <div class="desafio-pe__section-head">
        <span class="desafio-pe__badge">Ejercicio 2</span>
        <h2 id="pe-ej2" class="desafio-pe__section-title">PE en unidades y en pesos</h2>
      </div>
      <div class="desafio-pe__card">
        <div class="desafio-pe__gloss" role="note">
          <p class="desafio-pe__gloss-title">Siglas en este ejercicio</p>
          <ul class="desafio-pe__gloss-list">
            <li><strong>PE<sub>u</sub></strong> — Punto de equilibrio en unidades.</li>
            <li><strong>PE<sub>$</sub></strong> — Punto de equilibrio en pesos (ingreso mínimo en valor).</li>
            <li><strong>CF, CVU, P</strong> — Igual que en el ejercicio 1.</li>
          </ul>
        </div>

        <div class="desafio-pe__chips">
          <span class="desafio-pe__chip">CF = $150.000</span>
          <span class="desafio-pe__chip">CVU = $500</span>
          <span class="desafio-pe__chip">P = $2.000</span>
        </div>

        <div class="desafio-pe__calc-block">
          <p class="desafio-pe__cat-label">Punto de equilibrio en unidades</p>
          <div class="desafio-pe__formula-row desafio-pe__formula-row--result">
            <span class="desafio-pe__formula-eq">PE<sub>u</sub> =</span>
            <span class="desafio-pe__frac" aria-hidden="true">
              <span class="desafio-pe__frac-num">150.000</span>
              <span class="desafio-pe__frac-bar" />
              <span class="desafio-pe__frac-den">2.000 − 500</span>
            </span>
            <span class="desafio-pe__formula-plain">=</span>
            <span class="desafio-pe__frac" aria-hidden="true">
              <span class="desafio-pe__frac-num">150.000</span>
              <span class="desafio-pe__frac-bar" />
              <span class="desafio-pe__frac-den">1.500</span>
            </span>
            <span class="desafio-pe__formula-plain">= <strong>100</strong> unidades</span>
          </div>

          <p class="desafio-pe__cat-label">Punto de equilibrio en pesos (fórmula de la cátedra)</p>
          <div class="desafio-pe__formula-row desafio-pe__formula-row--wrap">
            <span class="desafio-pe__formula-eq">PE<sub>$</sub> =</span>
            <span class="desafio-pe__frac desafio-pe__frac--den-wide" aria-hidden="true">
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
            <span class="desafio-pe__frac" aria-hidden="true">
              <span class="desafio-pe__frac-num">150.000</span>
              <span class="desafio-pe__frac-bar" />
              <span class="desafio-pe__frac-den">0,75</span>
            </span>
            <span class="desafio-pe__formula-plain">= <strong>$200.000</strong></span>
          </div>
          <p class="desafio-pe__cat-hint">Comprobación: PE<sub>$</sub> = PE<sub>u</sub> × P = 100 × 2.000 = $200.000.</p>
        </div>

        <PeLineChart
          title="Intersección ingresos vs coste total (0–200 unidades)"
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
        <div class="desafio-pe__gloss" role="note">
          <p class="desafio-pe__gloss-title">Siglas en este ejercicio</p>
          <ul class="desafio-pe__gloss-list">
            <li><strong>MC</strong> — Margen de contribución unitario (P − CVU).</li>
            <li><strong>PE<sub>u</sub>, PE<sub>$</sub></strong> — Punto de equilibrio en unidades / en pesos.</li>
          </ul>
        </div>

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

        <p class="desafio-pe__cat-label">Margen de contribución</p>
        <div class="desafio-pe__formula-row">
          <span class="desafio-pe__formula-eq">MC =</span>
          <span class="desafio-pe__formula-plain">100 − 60 = <strong>$40</strong></span>
        </div>

        <p class="desafio-pe__cat-label">Punto de equilibrio en unidades</p>
        <div class="desafio-pe__formula-row desafio-pe__formula-row--result">
          <span class="desafio-pe__formula-eq">PE<sub>u</sub> =</span>
          <span class="desafio-pe__frac" aria-hidden="true">
            <span class="desafio-pe__frac-num">3.950</span>
            <span class="desafio-pe__frac-bar" />
            <span class="desafio-pe__frac-den">40</span>
          </span>
          <span class="desafio-pe__formula-plain">= <strong>98,75</strong> servicios (~<strong>99</strong> en la práctica)</span>
        </div>

        <p class="desafio-pe__cat-label">Punto de equilibrio en pesos</p>
        <div class="desafio-pe__formula-row desafio-pe__formula-row--wrap">
          <span class="desafio-pe__formula-eq">PE<sub>$</sub> =</span>
          <span class="desafio-pe__frac desafio-pe__frac--den-wide" aria-hidden="true">
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
          <span class="desafio-pe__frac" aria-hidden="true">
            <span class="desafio-pe__frac-num">3.950</span>
            <span class="desafio-pe__frac-bar" />
            <span class="desafio-pe__frac-den">0,40</span>
          </span>
          <span class="desafio-pe__formula-plain">≈ <strong>$9.875</strong></span>
        </div>

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

      <div class="desafio-pe__gloss desafio-pe__gloss--inline" role="note">
        <p class="desafio-pe__gloss-title">Siglas en este ejercicio</p>
        <p class="desafio-pe__gloss-inline">
          <strong>PE<sub>u</sub></strong> punto de equilibrio en unidades · <strong>CF</strong> coste fijo ·
          <strong>CVU</strong> coste variable unitario · <strong>P</strong> precio por unidad.
        </p>
      </div>

      <p class="desafio-pe__lead">
        Precio base <strong>$15</strong>, CVU <strong>$8</strong>, CF <strong>$660</strong>. Tres situaciones:
        base, aumento de CF por sueldos, y combinación de suba de precio + CF elevados.
      </p>

      <div class="desafio-pe__scenario-grid">
        <article class="desafio-pe__scenario">
          <h3 class="desafio-pe__scenario-title">a) Situación base</h3>
          <div class="desafio-pe__formula-row desafio-pe__formula-row--stack">
            <span class="desafio-pe__formula-eq">PE<sub>u</sub> =</span>
            <span class="desafio-pe__frac" aria-hidden="true">
              <span class="desafio-pe__frac-num">660</span>
              <span class="desafio-pe__frac-bar" />
              <span class="desafio-pe__frac-den">15 − 8</span>
            </span>
            <span class="desafio-pe__formula-plain">≈ <strong>94,28</strong> bolsas</span>
          </div>
          <p class="desafio-pe__scenario-result">Ingreso en el PE ≈ <strong>$1.414</strong> (94,28 × 15)</p>
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
          <div class="desafio-pe__formula-row desafio-pe__formula-row--stack">
            <span class="desafio-pe__formula-eq">PE<sub>u</sub> =</span>
            <span class="desafio-pe__frac" aria-hidden="true">
              <span class="desafio-pe__frac-num">760</span>
              <span class="desafio-pe__frac-bar" />
              <span class="desafio-pe__frac-den">15 − 8</span>
            </span>
            <span class="desafio-pe__formula-plain">≈ <strong>108,57</strong> bolsas</span>
          </div>
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
          <p class="desafio-pe__scenario-kv">P nuevo = <strong>$17,25</strong></p>
          <div class="desafio-pe__formula-row desafio-pe__formula-row--stack">
            <span class="desafio-pe__formula-eq">PE<sub>u</sub> =</span>
            <span class="desafio-pe__frac" aria-hidden="true">
              <span class="desafio-pe__frac-num">6.500</span>
              <span class="desafio-pe__frac-bar" />
              <span class="desafio-pe__frac-den">17,25 − 8</span>
            </span>
            <span class="desafio-pe__formula-plain">≈ <strong>702,7</strong> bolsas</span>
          </div>
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
