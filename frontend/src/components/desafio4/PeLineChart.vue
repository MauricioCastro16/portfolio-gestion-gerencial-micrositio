<script setup lang="ts">
import {
  Chart,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
  type ChartConfiguration,
} from 'chart.js'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

Chart.register(LineController, LineElement, PointElement, LinearScale, Tooltip, Legend, Filler)

const props = withDefaults(
  defineProps<{
    fixedCost: number
    unitPrice: number
    varCostPerUnit: number
    /** Límite derecho del eje horizontal (unidades / servicios). */
    xMax: number
    /** Etiqueta del eje X */
    xAxisLabel?: string
    /** Punto de equilibrio en unidades (si no se pasa, se calcula). */
    breakEvenUnits?: number
    /** Ocultar curva de ventas (p.ej. vista solo costos). */
    hideRevenue?: boolean
  }>(),
  {
    xAxisLabel: 'Unidades',
    breakEvenUnits: undefined,
    hideRevenue: false,
  },
)

const canvasRef = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

const moneyFmt = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

const numFmt = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 2 })

const contributionMargin = computed(() => props.unitPrice - props.varCostPerUnit)

const peUnits = computed(() => {
  if (props.breakEvenUnits !== undefined && Number.isFinite(props.breakEvenUnits)) {
    return props.breakEvenUnits
  }
  const m = contributionMargin.value
  if (m <= 0) return NaN
  return props.fixedCost / m
})

function revenue(u: number): number {
  return u * props.unitPrice
}

function totalCost(u: number): number {
  return props.fixedCost + u * props.varCostPerUnit
}

function variableCost(u: number): number {
  return u * props.varCostPerUnit
}

function buildPoints(): { x: number; rev: number; ct: number; cf: number; cv: number }[] {
  const n = 96
  const out: { x: number; rev: number; ct: number; cf: number; cv: number }[] = []
  for (let i = 0; i <= n; i++) {
    const x = (props.xMax * i) / n
    out.push({
      x,
      rev: revenue(x),
      ct: totalCost(x),
      cf: props.fixedCost,
      cv: variableCost(x),
    })
  }
  return out
}

const brandGold = '#fdc111'
const brandPurple = '#432e8c'
const brandBurgundy = '#c42352'
const brandTeal = '#0d9488'

function destroyChart(): void {
  chart?.destroy()
  chart = null
}

function createChart(): void {
  const canvas = canvasRef.value
  if (!canvas) return

  destroyChart()

  const pts = buildPoints()
  const pe = peUnits.value
  const peY =
    Number.isFinite(pe) && pe >= 0 && pe <= props.xMax * 1.05 ? revenue(pe) : null

  const datasets: ChartConfiguration<'line'>['data']['datasets'] = [
    {
      label: 'Coste fijo',
      data: pts.map((p) => ({ x: p.x, y: p.cf })),
      borderColor: brandPurple,
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderDash: [7, 5],
      pointRadius: 0,
      tension: 0,
    },
    {
      label: 'Coste variable total (CV)',
      data: pts.map((p) => ({ x: p.x, y: p.cv })),
      borderColor: brandTeal,
      backgroundColor: colorMix(brandTeal, 10),
      borderWidth: 2,
      fill: false,
      pointRadius: 0,
      tension: 0.08,
    },
    {
      label: 'Coste total',
      data: pts.map((p) => ({ x: p.x, y: p.ct })),
      borderColor: brandBurgundy,
      backgroundColor: colorMix(brandBurgundy, 12),
      borderWidth: 2.25,
      fill: false,
      pointRadius: 0,
      tension: 0.08,
    },
  ]

  if (!props.hideRevenue) {
    datasets.unshift({
      label: 'Ventas / ingresos',
      data: pts.map((p) => ({ x: p.x, y: p.rev })),
      borderColor: brandGold,
      backgroundColor: colorMix(brandGold, 14),
      borderWidth: 2.5,
      fill: true,
      pointRadius: 0,
      tension: 0.08,
    })
  }

  if (peY !== null && Number.isFinite(pe)) {
    datasets.push({
      label: 'Punto de equilibrio',
      data: [{ x: pe, y: peY }],
      borderColor: '#ffffff',
      backgroundColor: brandPurple,
      borderWidth: 3,
      pointRadius: 9,
      pointHoverRadius: 11,
      showLine: false,
    })
  }

  const maxY = Math.max(
    ...pts.map((p) => Math.max(p.rev, p.ct, p.cv)),
    props.fixedCost,
    peY ?? 0,
  )
  const padY = maxY * 0.06 || 1

  chart = new Chart(canvas, {
    type: 'line',
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            boxWidth: 14,
            padding: 14,
            font: { family: 'Inter, system-ui, sans-serif', size: 11 },
            color: '#3a2f55',
          },
        },
        tooltip: {
          callbacks: {
            title(items) {
              const raw = items[0]?.parsed.x
              const x = typeof raw === 'number' ? raw : Number(raw)
              if (!Number.isFinite(x)) return ''
              return `${props.xAxisLabel}: ${numFmt.format(x)}`
            },
            label(ctx) {
              const raw = ctx.parsed.y
              const y = typeof raw === 'number' ? raw : Number(raw)
              if (!Number.isFinite(y)) return ''
              return `${ctx.dataset.label}: ${moneyFmt.format(y)}`
            },
          },
        },
      },
      scales: {
        x: {
          type: 'linear',
          title: {
            display: true,
            text: props.xAxisLabel,
            font: { size: 12, weight: 600, family: 'Inter, system-ui, sans-serif' },
            color: '#5a4d78',
          },
          grid: { color: 'rgba(67, 46, 140, 0.08)' },
          ticks: {
            font: { size: 10 },
            maxTicksLimit: 8,
            callback(value) {
              const v = Number(value)
              if (!Number.isFinite(v)) return ''
              if (Math.abs(v) >= 1_000_000) return `${numFmt.format(v / 1_000_000)} M`
              if (Math.abs(v) >= 1000) return `${numFmt.format(v / 1000)} k`
              return numFmt.format(v)
            },
          },
        },
        y: {
          title: {
            display: true,
            text: 'Importes ($)',
            font: { size: 12, weight: 600, family: 'Inter, system-ui, sans-serif' },
            color: '#5a4d78',
          },
          grid: { color: 'rgba(67, 46, 140, 0.08)' },
          suggestedMax: maxY + padY,
          ticks: {
            font: { size: 10 },
            callback(value) {
              const v = Number(value)
              return Number.isFinite(v) ? moneyFmt.format(v) : ''
            },
          },
        },
      },
    },
  })
}

function colorMix(hex: string, alphaPct: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const a = alphaPct / 100
  return `rgba(${r},${g},${b},${a})`
}

onMounted(() => {
  createChart()
})

watch(
  () => [
    props.fixedCost,
    props.unitPrice,
    props.varCostPerUnit,
    props.xMax,
    props.breakEvenUnits,
    props.hideRevenue,
    props.xAxisLabel,
  ],
  () => {
    createChart()
  },
)

onBeforeUnmount(() => {
  destroyChart()
})
</script>

<template>
  <div class="pe-chart-block">
    <div class="pe-chart-block__canvas-wrap">
      <canvas ref="canvasRef" />
    </div>
  </div>
</template>
