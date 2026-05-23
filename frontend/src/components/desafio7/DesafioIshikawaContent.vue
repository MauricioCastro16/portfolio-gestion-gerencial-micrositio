<template>
  <div class="desafio-pe">
    <header class="desafio-pe__hero">
      <p class="desafio-pe__hero-kicker">Gestión gerencial · Desafío 7</p>
      <h1 class="desafio-pe__hero-title">Causa-Efecto (Bagit)</h1>
      <p class="desafio-pe__hero-lead">
        Diagrama de Ishikawa para analizar errores en facturación: las 6 M y la dimensión prioritaria del
        análisis.
      </p>
    </header>

    <section class="desafio-pe__intro desafio-pe__glass" aria-labelledby="d7-problema">
      <h2 id="d7-problema" class="desafio-pe__h2">Problema abordado</h2>
      <p>
        <strong>Aplicar la herramienta Causa-Efecto</strong> en el ejercicio asignado.
      </p>

      <h3 class="desafio-pe__h3-global">Ejercicio A — El problema está en la bolsa</h3>
      <p>
        La empresa <strong>Bagit</strong> es una manufacturera de bolsas de compras. Produce y distribuye bolsas de
        papel y plástico utilizadas en su mayoría por supermercados y negocios minoristas varios.
      </p>
      <p>
        Durante los últimos dos meses la compañía ha realizado un gran esfuerzo para mejorar la calidad de sus
        productos como también el servicio a los clientes. Dentro de los problemas que estaba enfrentando había
        una cantidad de quejas de los clientes acerca de <strong>errores en las facturas</strong> de las
        mercaderías enviadas por Bagit.
      </p>
      <p>
        La información preliminar reunida por el equipo indica que el <strong>8 % de los clientes</strong>
        notificó errores a la compañía. Aunque los datos no eran suficientes para un análisis completo,
        aparentemente los mayores problemas estaban relacionados con:
      </p>
      <ol class="desafio-pe__gloss-list">
        <li>Errores en la <strong>cantidad</strong> de elementos facturados.</li>
        <li>Errores en el <strong>precio</strong>.</li>
        <li>Facturación de mercadería que <strong>nunca fue enviada</strong>.</li>
      </ol>
      <p>
        El problema es serio y un entendimiento claro de sus causas necesita ser establecido; el equipo ha
        decidido preparar un <strong>diagrama de causa y efecto</strong> para recopilar todas las posibles causas
        que provocan errores en las facturas.
      </p>

      <h3 class="desafio-pe__h3-global">Flujo operativo (embarque y facturación)</h3>
      <ol class="desafio-pe__gloss-list">
        <li>
          En base al pedido del cliente, la factura es enviada al departamento de <strong>empaque</strong>.
        </li>
        <li>
          El departamento de empaque prepara el envío de acuerdo a la disponibilidad de mercadería en el depósito
          en ese momento.
        </li>
        <li>
          Si la cantidad o el tipo de producto requerido por el cliente no está en existencia ese día, el
          departamento de empaque solicita, por medio de la terminal de computadora, una
          <strong>nueva factura</strong> por la mercadería existente y un <strong>rechazo</strong> por los
          elementos y/o las cantidades no existentes.
        </li>
        <li>El envío es preparado y remitido por el departamento de empaque.</li>
        <li>
          El departamento de <strong>contaduría</strong> retira del sistema una copia de la factura para que sea
          enviada por correo al cliente.
        </li>
      </ol>

      <h3 class="desafio-pe__h3-global">Datos adicionales del equipo</h3>
      <ul class="desafio-pe__gloss-list">
        <li>
          El recuento de pedidos, facturas y stocks de depósito se guarda con un
          <strong>nuevo sistema de computación</strong> instalado hace cuatro meses.
        </li>
        <li>
          El empaque de los productos enviados al cliente se realiza <strong>manualmente</strong> por los obreros
          del depósito.
        </li>
        <li>
          Es posible que el problema anteriormente se haya aceptado como normal por falta de seguimiento de
          quejas.
        </li>
        <li>
          Es posible que el problema haya estado <strong>empeorando</strong> con cambios recientes en los
          procedimientos de la empresa.
        </li>
      </ul>
    </section>

    <section class="desafio-pe__section" aria-label="Solución propuesta">
      <div class="desafio-pe__section-head">
        <span class="desafio-pe__badge">Solución propuesta</span>
      </div>

      <div class="desafio-pe__card">
        <p class="desafio-pe__consigna">
          Trabajo en equipo: diagrama de Ishikawa con las <strong>6 M</strong> e identificación de la
          <strong>M más crítica</strong>.
        </p>

        <p class="desafio-pe__datos-title">Diagrama de causa y efecto (Bagit)</p>
        <figure class="desafio-pe__diagram">
          <img
            src="/desafios/ishikawa-bagit.svg"
            alt="Diagrama de Ishikawa: errores en las facturas de las mercaderías enviadas por Bagit, con causas en Métodos, Mano de obra, Materiales, Maquinaria, Medición y Medio ambiente"
            width="1129"
            height="639"
            loading="lazy"
            decoding="async"
          />
          <figcaption>
            Efecto central: <strong>Errores en las facturas de las mercaderías enviadas</strong>.
          </figcaption>
        </figure>

        <p class="desafio-pe__datos-title">M más crítica</p>
        <p class="desafio-pe__consigna">
          Tras el análisis del diagrama, la dimensión <strong>Métodos</strong> emerge como la más crítica. Concentra
          las debilidades estructurales del circuito facturación–empaque–contaduría, en particular cuando el stock
          no cubre el pedido original: persistencia de documentación en soporte físico, procedimientos desalineados
          con el nuevo sistema, ausencia de validación previa al despacho e insuficiente gestión del cambio
          organizacional. En tanto estos aspectos no se normalicen, las demás categorías —maquinaria, medición y
          mano de obra— seguirán reproduciendo los tres tipos de error reportados por los clientes: discrepancias
          en cantidad, en precio y facturación de mercadería no enviada.
        </p>
      </div>
    </section>

    <section class="desafio-pe__intro desafio-pe__glass" aria-labelledby="d7-evidencias">
      <h2 id="d7-evidencias" class="desafio-pe__h2">Evidencias</h2>
      <ul class="desafio-pe__d3-links">
        <li>Diagrama elaborado en draw.io (exportado al sitio como <code class="desafio-page__code">/desafios/ishikawa-bagit.svg</code>).</li>
        <li>Consigna: ejercicio <strong>Bagit — El problema está en la bolsa</strong> (herramienta causa-efecto / Ishikawa).</li>
      </ul>
    </section>

    <section class="desafio-pe__intro desafio-pe__glass" aria-labelledby="d7-herramientas">
      <h2 id="d7-herramientas" class="desafio-pe__h2">Herramientas utilizadas</h2>
      <div class="desafio-pe__chips desafio-pe__chips--d3">
        <span class="desafio-pe__chip">Diagrama de Ishikawa</span>
        <span class="desafio-pe__chip">6 M</span>
        <span class="desafio-pe__chip desafio-pe__chip--accent">draw.io</span>
      </div>
    </section>

    <section class="desafio-pe__footer desafio-pe__glass" aria-labelledby="d7-reflexion">
      <h2 id="d7-reflexion" class="desafio-pe__h2">Reflexión del equipo</h2>
      <p>
        <p>
        El ejercicio obligó a mirar el proceso completo y a vincular las
        <strong>quejas de los clientes</strong> con causas concretas en cada M. La
        <strong>M más crítica (Métodos)</strong> apareció porque el flujo con factura alternativa y rechazo parcial
        no estaba estandarizado ni validado antes del correo al cliente. 
        </p>
        <p>
        En una segunda iteración convendría
        profundizar en <strong>Medición</strong> (inventario físico vs. online) si persisten discrepancias tras
        ordenar los procedimientos.
        </p>
        <p>
        El poder ver el problema desde cada M nos permitió esclarecer el mismo y encontrar las causas más críticas
        para su solución. Es una herramienta muy potente que nos será de mucha utilidad en el futuro. 
        </p>
      </p>
    </section>
  </div>
</template>
