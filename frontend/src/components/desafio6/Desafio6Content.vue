<template>
  <div class="desafio-pe">
    <header class="desafio-pe__hero">
      <p class="desafio-pe__hero-kicker">Gestión gerencial · Desafío 6</p>
      <h1 class="desafio-pe__hero-title">Gestión del cambio — Almacenes del Norte S.A.</h1>
      <p class="desafio-pe__hero-lead">
        Análisis del caso de estudio de <strong>Almacenes del Norte S.A.</strong>, una empresa familiar que enfrenta
        la implementación de un sistema WMS. Asumimos el rol de consultores de gestión del cambio para diagnosticar
        qué falló, analizar la resistencia del personal y proponer un plan de acción que rescate el proyecto.
      </p>
    </header>

    <section class="desafio-pe__intro desafio-pe__glass" aria-labelledby="d6-problema">
      <h2 id="d6-problema" class="desafio-pe__h2">Problema abordado</h2>

      <h3 class="desafio-pe__h3-global">El contexto de la empresa</h3>
      <p>
        <strong>Almacenes del Norte S.A.</strong> es una empresa familiar fundada hace 40 años, dedicada a la
        distribución de productos de consumo masivo. Cuenta con 250 empleados y tres grandes centros de distribución.
      </p>
      <p>
        Históricamente ha sido muy exitosa gracias al conocimiento empírico de sus trabajadores: el
        <strong>60 % del personal operativo</strong> lleva más de 15 años en la compañía. Los procesos de inventario
        se registran de forma semi-manual (planillas de papel, uso intensivo de Excel y conteos físicos a fin de mes).
      </p>

      <h4 class="desafio-pe__h4-global">El detonante del cambio (las fuerzas)</h4>
      <ul class="desafio-pe__gloss-list desafio-pe__gloss-list--indented desafio-pe__gloss-list--body">
        <li>
          <strong>Fuerza externa:</strong> un gigante del comercio electrónico entró al país ofreciendo entregas en
          24 horas a los mismos clientes, y los clientes corporativos comenzaron a exigir una plataforma web para ver
          el stock en tiempo real y realizar pedidos automáticos.
        </li>
        <li>
          <strong>Fuerza interna:</strong> las pérdidas por errores de inventario manual aumentaron un 15 % el último
          año. La nueva Directora de Operaciones, Valeria, advirtió al Directorio: "O automatizamos el centro de
          distribución ahora, o en tres años perderemos la mitad de nuestros clientes".
        </li>
      </ul>

      <h4 class="desafio-pe__h4-global">El plan de transformación</h4>
      <p>
        El Directorio aprobó un presupuesto de <strong>1.5 millones de dólares</strong> para implementar un sistema
        <strong>WMS</strong> (Warehouse Management System) de última generación, que elimina las planillas de papel:
        los operarios usan escáneres de códigos de barra portátiles y pantallas táctiles en los montacargas. El
        inventario se actualiza en tiempo real y el sistema calcula automáticamente las rutas más eficientes. El
        cambio implicaba pasar de una cultura basada en la "experiencia de memoria" a una cultura basada en
        "datos y tecnología".
      </p>

      <h4 class="desafio-pe__h4-global">La ola de resistencia</h4>
      <p>
        Valeria, enfocada en lo técnico, compró las licencias, instaló las antenas Wi-Fi y contrató a la consultora.
        El día del lanzamiento envió un correo masivo anunciando que en <strong>dos semanas</strong> el sistema viejo
        dejaría de funcionar. A partir de ahí estalló el caos:
      </p>
      <ul class="desafio-pe__gloss-list desafio-pe__gloss-list--indented desafio-pe__gloss-list--body">
        <li>
          <strong>Don Roberto</strong> (supervisor más antiguo y respetado) corrió el rumor de que el software venía a
          "reemplazar a la gente" y que habría despidos masivos.
        </li>
        <li>
          Los operarios veteranos mostraron <strong>resistencia pasiva</strong>: decían que los escáneres fallaban,
          "olvidaban" cargarlos por las noches y seguían anotando todo en sus viejos cuadernos.
        </li>
        <li>
          Los choferes se negaron a usar las tablets para las firmas digitales, argumentando que no sabían usarlas y
          que los clientes preferían el papel.
        </li>
      </ul>
      <p>
        En el primer mes la productividad cayó un <strong>30 %</strong>, los pedidos se retrasaron, los clientes clave
        se quejaron y Don Roberto presentó una queja formal ante el sindicato por "estrés laboral".
      </p>
    </section>

    <section class="desafio-pe__section" aria-label="Solución propuesta">
      <div class="desafio-pe__section-head">
        <span class="desafio-pe__badge">Solución propuesta</span>
      </div>

      <div class="desafio-pe__card">
        <h3 class="desafio-pe__h3-global">Actividad 1</h3>

        <h4 class="desafio-pe__h4-global">1. Diagnóstico del cambio</h4>
        <p><strong>Fuerzas externas que impulsaron el cambio:</strong></p>
        <ul class="desafio-pe__gloss-list desafio-pe__gloss-list--indented desafio-pe__gloss-list--body">
          <li>
            <strong>Presión competitiva:</strong> el ingreso al país de un gigante del comercio electrónico con
            entregas en 24 horas, amenazando la cuota de mercado.
          </li>
          <li>
            <strong>Exigencia del cliente:</strong> clientes corporativos que demandaban herramientas digitales
            modernas (plataforma web para stock en tiempo real y automatización de pedidos).
          </li>
        </ul>
        <p><strong>Fuerzas internas que impulsaron el cambio:</strong></p>
        <ul class="desafio-pe__gloss-list desafio-pe__gloss-list--indented desafio-pe__gloss-list--body">
          <li>
            <strong>Ineficiencia operativa e impacto financiero:</strong> el incremento del 15 % en las pérdidas
            económicas debido a errores en el inventario manual.
          </li>
          <li>
            <strong>Cambio en el liderazgo estratégico:</strong> la incorporación de Valeria como nueva Directora de
            Operaciones, quien actuó como agente de cambio al advertir al Directorio sobre el riesgo de obsolescencia.
          </li>
        </ul>
        <p>
          <strong>¿Cambio planeado (proactivo) o no planeado (reactivo)?</strong> El cambio fue
          <strong>reactivo</strong>. Aunque se formuló un presupuesto de 1.5 millones de dólares y un despliegue
          técnico, la organización no inició el proceso por una visión de innovación anticipada, sino como respuesta
          directa a amenazas inminentes del entorno (el gigante del e-commerce) y a una crisis interna de
          rentabilidad. Se actuó bajo la urgencia de no perder la mitad de los clientes en tres años.
        </p>
        <p>
          <strong>¿Cambio brusco o evolutivo?</strong> Para el personal se dio como un cambio
          <strong>brusco y disruptivo</strong>: Valeria anunció por correo masivo que el sistema tradicional dejaría
          de funcionar en solo dos semanas. Al no respetar los tiempos de adaptación cultural de una planta donde el
          60 % tiene más de 15 años de antigüedad, el impacto fue catastrófico: shock colectivo, parálisis operativa,
          caída del 30 % en la productividad y activación inmediata de mecanismos de resistencia activa y pasiva.
        </p>

        <h4 class="desafio-pe__h4-global">2. Análisis de la resistencia</h4>
        <p><strong>Causas humanas y emocionales detrás de la resistencia:</strong></p>
        <ul class="desafio-pe__gloss-list desafio-pe__gloss-list--indented desafio-pe__gloss-list--body">
          <li>
            <strong>Miedo a la obsolescencia y al desempleo:</strong> el rumor de Don Roberto sobre el "reemplazo de
            la gente" refleja el temor profundo a perder el trabajo debido a la automatización.
          </li>
          <li>
            <strong>Amenaza al estatus y sentido de valía:</strong> los veteranos basaban su valor profesional en su
            "conocimiento empírico y de memoria"; al imponer un WMS sintieron que su experiencia de décadas quedaba
            desvalorizada.
          </li>
          <li>
            <strong>Ansiedad por incompetencia percibida:</strong> choferes y operarios experimentaron frustración y
            resistencia pasiva al verse obligados a usar tecnologías para las que no se sentían capacitados, afectando
            su autoeficacia.
          </li>
        </ul>
        <p><strong>Errores graves de Valeria en la gestión:</strong></p>
        <ul class="desafio-pe__gloss-list desafio-pe__gloss-list--indented desafio-pe__gloss-list--body">
          <li>
            <strong>Enfoque exclusivamente tecnocéntrico:</strong> se centró en la infraestructura (licencias, Wi-Fi,
            consultores) y omitió por completo la dimensión humana y cultural del cambio.
          </li>
          <li>
            <strong>Falta de empatía y comunicación unidireccional:</strong> comunicó una transformación de esta
            magnitud mediante un correo electrónico masivo y frío, sin instancias de diálogo previo.
          </li>
          <li>
            <strong>Estrategia sin transición:</strong> decretó el "apagón" del sistema viejo en dos semanas, sin un
            período de convivencia de sistemas ni programas de capacitación adaptados a los perfiles.
          </li>
        </ul>

        <h4 class="desafio-pe__h4-global">3. Propuesta de solución (plan de acción)</h4>
        <p><strong>Acciones concretas para reducir la resistencia:</strong></p>
        <ul class="desafio-pe__gloss-list desafio-pe__gloss-list--indented desafio-pe__gloss-list--body">
          <li>
            <strong>Involucrar a Don Roberto como referente clave:</strong> sumarlo activamente al proyecto y validar
            su experiencia para que audite si el WMS contempla las casuísticas reales del almacén. Esto transforma su
            rol de "detractor" a "co-diseñador".
          </li>
          <li>
            <strong>Garantías explícitas de estabilidad laboral:</strong> emitir un comunicado oficial del Directorio
            asegurando que el WMS es una herramienta para mitigar el esfuerzo físico y el error humano, no una
            estrategia de reducción de personal.
          </li>
          <li>
            <strong>Mesas de feedback técnico:</strong> espacios diarios de 15 minutos donde los operarios reporten
            fallas reales de los escáneres directamente a la consultora, eliminando la frustración del bloqueo
            operativo.
          </li>
        </ul>

        <p>
          <strong>Modelo de gestión del cambio aplicable:</strong> de acuerdo con los modelos analizados en el portal
          HEFLO, el <strong>Modelo de los 8 pasos de John Kotter</strong> es el que mejor se adapta al escenario:
        </p>
        <ol class="desafio-pe__gloss-list desafio-pe__gloss-list--indented desafio-pe__gloss-list--body">
          <li><strong>Establecer el sentido de urgencia:</strong> compartir con los empleados los datos del mercado para que entiendan la necesidad del WMS.</li>
          <li><strong>Formar una coalición:</strong> unir a Valeria, los consultores y líderes naturales como Don Roberto.</li>
          <li><strong>Crear una visión:</strong> explicar cómo el WMS facilitará las tareas del día a día.</li>
          <li><strong>Comunicar la visión:</strong> talleres presenciales en lugar de correos masivos.</li>
          <li><strong>Eliminar obstáculos:</strong> capacitar exhaustivamente y adecuar la ergonomía de los dispositivos.</li>
          <li><strong>Asegurar triunfos a corto plazo:</strong> celebrar las primeras rutas eficientes logradas sin errores.</li>
          <li><strong>Sostener el empeño:</strong> ajustar procesos según el feedback de los veteranos.</li>
          <li><strong>Anclar el cambio en la cultura:</strong> institucionalizar el uso de datos como el nuevo estándar de éxito.</li>
        </ol>

        <p><strong>Estrategia breve de comunicación y capacitación (pre-lanzamiento):</strong></p>
        <ul class="desafio-pe__gloss-list desafio-pe__gloss-list--indented desafio-pe__gloss-list--body">
          <li>
            <strong>Fase de sensibilización (semanas 1 y 2):</strong> reuniones presenciales por turnos explicando el
            "por qué" del cambio. Mapear los dolores actuales (tiempo perdido con Excel, conteos manuales tediosos de
            fin de mes) y mostrar cómo el WMS los soluciona.
          </li>
          <li>
            <strong>Fase de capacitación práctica en entorno seguro (semanas 3 y 4):</strong> diseñar un "laboratorio
            de pruebas" (sandbox) fuera de la línea de producción, permitiendo interactuar con escáneres y tablets a
            modo de juego (gamificación), premiando el aprendizaje y tolerando el error sin presión.
          </li>
          <li>
            <strong>Fase de despliegue progresivo y acompañamiento (semanas 5 y 6):</strong> implementar una salida en
            marcha blanca (paralelo entre el cuaderno/Excel y el WMS) con "asistentes de piso" permanentes de la
            consultora para asistir a choferes y operarios en tiempo real.
          </li>
        </ul>

        <h4 class="desafio-pe__h4-global">¿Es una transformación digital?</h4>
        <p class="desafio-pe__consigna">
          <strong>Sí, es una transformación digital.</strong> No se trata de una simple "digitalización" (pasar el
          papel a PDF). El proyecto altera profundamente el modelo operativo y la cultura de la organización,
          obligándola a mutar desde una gestión basada en la "experiencia de memoria y el empirismo" hacia una cultura
          guiada por "datos, trazabilidad y tecnología en tiempo real" para responder a una nueva demanda del mercado.
        </p>
      </div>

      <div class="desafio-pe__card">
        <h3 class="desafio-pe__h3-global">Actividad 2</h3>

        <h4 class="desafio-pe__h4-global">¿Por qué las personas suelen resistirse al cambio?</h4>
        <p>
          Porque el cambio rompe la zona de confort y activa sesgos cognitivos como la aversión a la pérdida. Cambiar
          implica un gasto de energía mental para aprender algo nuevo y expone al individuo al miedo a fallar, a
          perder control, estatus o estabilidad económica.
        </p>

        <h4 class="desafio-pe__h4-global">¿Todos los cambios organizacionales son positivos?</h4>
        <p>
          El propósito del cambio suele buscar un impacto positivo (supervivencia, eficiencia), pero el resultado
          puede ser negativo si la ejecución destruye el clima laboral, desmotiva al talento humano o genera pérdidas
          operativas crónicas debido a una mala gestión del factor humano.
        </p>

        <h4 class="desafio-pe__h4-global">¿Qué ocurre cuando una organización no se adapta?</h4>
        <p>
          Entra en una fase de obsolescencia competitiva. Los costos aumentan, la calidad del servicio decrece frente
          al mercado, pierde clientes clave ante competidores ágiles y, eventualmente, se enfrenta a la insolvencia
          financiera y la desaparición.
        </p>

        <h4 class="desafio-pe__h4-global">¿La tecnología siempre mejora el trabajo?</h4>
        <p>
          No por sí sola. Si se implanta sobre procesos deficientes o sin la alineación de las personas que la operan,
          actúa como un amplificador del caos, disminuyendo la productividad y aumentando los niveles de estrés
          laboral.
        </p>

        <h4 class="desafio-pe__h4-global">¿Qué papel tiene el liderazgo en el cambio?</h4>
        <p>
          El liderazgo es el puente entre la estrategia técnica y la realidad psicológica del equipo. Su rol no es
          imponer mandatos, sino gestionar la transición humana, comunicar con empatía, inspirar una visión
          compartida, proveer los recursos formativos necesarios y contener la incertidumbre del grupo de trabajo.
        </p>
      </div>
    </section>

    <section class="desafio-pe__intro desafio-pe__glass" aria-labelledby="d6-herramientas">
      <h2 id="d6-herramientas" class="desafio-pe__h2">Herramientas utilizadas</h2>
      <div class="desafio-pe__chips desafio-pe__chips--d3">
        <span class="desafio-pe__chip">Modelo de Kotter (8 pasos)</span>
        <span class="desafio-pe__chip desafio-pe__chip--accent">Análisis de fuerzas</span>
        <span class="desafio-pe__chip desafio-pe__chip--burgundy">HEFLO</span>
      </div>
    </section>

    <section class="desafio-pe__footer desafio-pe__glass" aria-labelledby="d6-reflexion">
      <h2 id="d6-reflexion" class="desafio-pe__h2">Reflexión del equipo</h2>
      <p>
        El caso de Almacenes del Norte nos permitió comprender que una transformación digital no fracasa por la
        tecnología, sino por la <strong>gestión del factor humano</strong>. El error central de Valeria fue confundir
        instalar un sistema con gestionar un cambio: priorizó licencias, Wi-Fi y consultores, y descuidó el miedo, el
        estatus y la capacitación de quienes debían operarlo.
      </p>
      <p>
        Aplicar un modelo estructurado como el de <strong>Kotter</strong> nos mostró el valor de construir urgencia
        compartida, sumar a los líderes naturales como aliados y comunicar con empatía antes de imponer plazos. La
        marcha blanca y la convivencia de sistemas aparecen como claves para que un cambio brusco se vuelva una
        transición acompañada.
      </p>
      <p>
        Como aprendizaje principal nos llevamos que el liderazgo del cambio consiste en contener la incertidumbre y
        transformar a los detractores en co-diseñadores: solo así la innovación se ancla en la cultura y se vuelve
        sostenible.
      </p>
    </section>
  </div>
</template>
