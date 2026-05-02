# Desafío 4 — Punto de Equilibrio

**Universidad Tecnológica Nacional — Facultad Regional Resistencia**  
**Alumno:** Mauricio Nicolás Castro López  
**Equipo:** Transferitos (Mateo, Lucas, Martin, Nadine, Mauricio)

## Problema abordado

Trabajo práctico sobre **punto de equilibrio** en contextos de fabricación y servicios: completar tablas de ventas y costos, aplicar las relaciones entre costo fijo, costo variable unitario y precio, y calcular el PE en **unidades** y en **pesos**. También se analizan variaciones en costos fijos y en precio para interpretar el impacto en el volumen necesario para no operar a pérdida.

## Solución propuesta

Se resolvieron **cuatro ejercicios** con fórmulas explícitas, tablas numéricas donde correspondía y guías para el armado de gráficos (ejes, rectas de ventas y costos, coordenadas del cruce en el PE). Los detalles por ejercicio siguen abajo.

---

## Ejercicio Nº 1

**Consigna:** Tabla de venta de artículos fabricados. Completar columnas con:

- Precio unitario: **$0,50**
- Costo variable unitario: **$0,30**
- Calcular el punto de equilibrio en **unidades** y graficar.

**Fórmulas utilizadas**

- **Ventas (Y):** Ventas = Unidades × Precio  
- **Costos variables (CV):** CV = Unidades × Costo variable unitario  
- **Costo total (CT):** CT = Costo fijo + Costo variable  
- **Punto de equilibrio en unidades (PE):** PE = Costo fijo ÷ (Precio − Costo variable unitario)

**Cálculo del punto de equilibrio**

PE = 200 000 ÷ (0,50 − 0,30) = 200 000 ÷ 0,20 = **1 000 000 unidades**

**Tabla**

| Unidades | Ventas (Y) | Costos var. | Costo fijo | CT |
| --- | ---:| ---:| ---:| ---:|
| 0 | 0 | 0 | 200 000 | 200 000 |
| 500 000 | 250 000 | 150 000 | 200 000 | 350 000 |
| **1 000 000** | **500 000** | **300 000** | **200 000** | **500 000** |
| 1 500 000 | 750 000 | 450 000 | 200 000 | 650 000 |
| 2 000 000 | 1 000 000 | 600 000 | 200 000 | 800 000 |
| 2 500 000 | 1 250 000 | 750 000 | 200 000 | 950 000 |

En **1 000 000** de unidades, las ventas igualan al costo total: se confirma el punto de equilibrio.

**Guía del gráfico**

- **Eje X:** Unidades (0 a 2 500 000).  
- **Eje Y:** Pesos ($0 a $1 250 000).  
- **Líneas:** Costo fijo horizontal en **$200 000**. Costo total desde **$200 000** hasta **$950 000**. Ventas desde el origen hasta **$1 250 000**.  
- **Intersección (PE):** (1 000 000 unidades; **$500 000**).

---

## Ejercicio Nº 2

**Datos**

- Costo fijo: **$150 000**  
- Costo variable unitario: **$500**  
- Precio unitario: **$2 000**

**Fórmulas**

- PE en unidades: PE_u = CF ÷ (P − CVU)  
- PE en pesos: PE_$ = PE_u × P  

**Cálculos**

1. **PE en unidades:** PE_u = 150 000 ÷ (2 000 − 500) = 150 000 ÷ 1 500 = **100 unidades**  
2. **PE en pesos:** PE_$ = 100 × 2 000 = **$200 000**

**Guía del gráfico**

- **Eje X:** Unidades (0 a 200).  
- **Eje Y:** Pesos ($0 a $400 000).  
- **Intersección (PE):** (100 unidades; **$200 000**).

---

## Ejercicio Nº 3

**Contexto:** Empresa de lavado de mantelería (hermanos Carella). Precio por servicio: **$100**.

**Costos variables por servicio:** comisiones $20, operario $30, combustible $5, jabón $2, mantenimiento $3 (proporcional de $300 cada 100 lavados).

**Costos fijos mensuales:** alquiler $500, salario hermanos $2 250, recepcionista $1 200.

**Fórmulas**

- Margen de contribución unitario (MC): MC = Precio − CVU  
- PE (unidades): PE_u = CF ÷ MC  
- PE (pesos): PE_$ = PE_u × Precio  

**Separación de costos**

- **CVU total:** 20 + 30 + 5 + 2 + 3 = **$60**  
- **CF total:** 500 + 2 250 + 1 200 = **$3 950**

**Margen de contribución**

MC = 100 − 60 = **$40**

**Punto de equilibrio**

- PE_u = 3 950 ÷ 40 = **98,75 servicios** (operativamente **99** lavados).  
- PE_$ = 98,75 × 100 = **$9 875**

---

## Ejercicio Nº 4

**Enunciado:** “La Bolsa SA” — bolsas familiares: precio **$15**, CVU **$8**, costos fijos **$660**.

**a) Situación base**

- PE = 660 ÷ (15 − 8) = 660 ÷ 7 ≈ **94,28 bolsas**  
- En el gráfico, el cruce aproximado queda en **(94,28 bolsas; $1 414,28)**.

**b) CF aumentan $100 por sueldos**

- Nuevos CF: 660 + 100 = **$760**  
- PE = 760 ÷ 7 ≈ **108,57 bolsas**  
- **Conclusión:** más costos fijos exigen **mayor volumen** para cubrirlos (de ~94 a ~109 bolsas).

**c) Precio +15 % y CF = $6 500**

- Nuevo precio: 15 × 1,15 = **$17,25**  
- CF = **$6 500**  
- PE = 6 500 ÷ (17,25 − 8) = 6 500 ÷ 9,25 ≈ **702,70 bolsas**  
- **Conclusión:** sube el margen unitario por precio, pero el fuerte aumento de costos fijos **dispara** el volumen necesario para el equilibrio (más de **702** unidades).

---

## Herramientas utilizadas

Álgebra y proporciones para PE y márgenes; tablas de valores; esquema de rectas (costo fijo, costo total, ventas) para interpretación gráfica del equilibrio.

## Reflexión del equipo

Este desafío nos obligó a **ordenar costos** en fijos versus variables, usar el **margen de contribución** como puente hacia el PE y **leer escenarios**: pequeños cambios en CF o en precio pueden mover mucho el volumen mínimo necesario. La parte gráfica ayuda a comunicar por qué el “cruce” de ventas y costo total marca el umbral entre pérdida y ganancia.
