<template>
  <div class="desafio-pe">
    <header class="desafio-pe__hero">
      <p class="desafio-pe__hero-kicker">Gestión gerencial · Desafío 7</p>
      <h1 class="desafio-pe__hero-title">Diagrama causa - efecto (Ishikawa)</h1>
      <p class="desafio-pe__hero-lead">
        Análisis de la empresa Bagit, para identificar cómo el diagrama de Ishikawa, conocido por ser una herramienta por excelencia
        para desglosar problemas organizacionales, puede contribuir a garantizar una modelización del problema,
        permitiendo identificar de 4 a 6 categorías de causas.
      </p>
    </header>

    <section class="desafio-pe__intro desafio-pe__glass" aria-labelledby="d7-problema">
      <h2 id="d7-problema" class="desafio-pe__h2">Problema abordado</h2>

      <h3 class="desafio-pe__h3-global">Escenario A: "El problema está en la bolsa"</h3>
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
      <ol class="desafio-pe__gloss-list desafio-pe__gloss-list--indented desafio-pe__gloss-list--body">
        <li>Errores en la <strong>cantidad</strong> de elementos facturados.</li>
        <li>Errores en el <strong>precio</strong>.</li>
        <li>Facturación de mercadería que <strong>nunca fue enviada</strong>.</li>
      </ol>
      <p>
        El problema es serio y un entendimiento claro de sus causas necesita ser establecido; el equipo ha
        decidido preparar un <strong>diagrama de causa y efecto</strong> para recopilar todas las posibles causas
        que provocan errores en las facturas.
      </p>

      <h4 class="desafio-pe__h4-global">Flujo operativo (embarque y facturación)</h4>
      <ol class="desafio-pe__gloss-list desafio-pe__gloss-list--indented desafio-pe__gloss-list--body">
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

      <h4 class="desafio-pe__h4-global">Datos adicionales del equipo</h4>
      <ul class="desafio-pe__gloss-list desafio-pe__gloss-list--indented desafio-pe__gloss-list--body">
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
        <h3 class="desafio-pe__h3-global">Diagrama de Ishikawa de la empresa Bagit</h3>
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
            Problema encontrado: <strong>Errores en las facturas de las mercaderías enviadas</strong>.
          </figcaption>
        </figure>

        <h4 class="desafio-pe__h4-global">La raíz del problema</h4>
        <p class="desafio-pe__consigna">
          Tras el análisis del diagrama, la dimensión <strong>métodos</strong> emerge como la más crítica. Concentra
          las debilidades estructurales del circuito facturación–empaque–contaduría, en particular cuando el stock
          no cubre el pedido original: persistencia de documentación en soporte físico, procedimientos desalineados
          con el nuevo sistema, ausencia de validación previa al despacho e insuficiente gestión del cambio
          organizacional. En tanto estos aspectos no se normalicen, las demás categorías —maquinaria, medición y
          mano de obra— seguirán reproduciendo los tres tipos de error reportados por los clientes: discrepancias
          en cantidad, en precio y facturación de mercadería no enviada.
        </p>
      </div>
    </section>

    <section class="desafio-pe__intro desafio-pe__glass" aria-labelledby="d7-herramientas">
      <h2 id="d7-herramientas" class="desafio-pe__h2">Herramientas utilizadas</h2>
      <div class="desafio-pe__chips desafio-pe__chips--d3">
        <span class="desafio-pe__chip">Diagrama de Ishikawa</span>
        <span class="desafio-pe__chip">Método de las 6M</span>
        <span class="desafio-pe__chip desafio-pe__chip--accent">draw.io</span>
      </div>
    </section>

    <section class="desafio-pe__footer desafio-pe__glass" aria-labelledby="d7-reflexion">
      <h2 id="d7-reflexion" class="desafio-pe__h2">Reflexión del equipo</h2>
      <p>
        El ejercicio nos permitió estudiar el proceso completo y vincular los errores en las facturas de las
        mercaderías enviadas con causas concretas en cada M. Siendo la M más crítica los <strong>métodos</strong>, ya que apareció
        ante la existencia de procesos ineficientes, falta de un proceso de gestión del cambio y una clara falta de
        validación antes del envío. Asimismo, también influyen factores como la pérdida de los comprobantes de
        rechazo y la documentación transpapelada, correspondiente a los <strong>materiales</strong>.
      </p>
      <p>
        Si se planteara una segunda iteración, convendría profundizar en el área de <strong>medición</strong>, particularmente en
        las discrepancias entre inventario físico y online y la falta de control de calidad antes de cerrar un
        pedido, si persisten los problemas tras ordenar los procedimientos.
      </p>
      <p>
        El poder ver el problema desde cada M nos permitió esclarecer el mismo y encontrar las causas más críticas
        para su solución. Es una herramienta muy potente que nos será de mucha utilidad en el futuro.
      </p>
    </section>
  </div>
</template>
