const raw = `
op_0 --> op_1
op_0 --> op_20
op_0 --> op_34
op_1 --> op_3
op_1 --> op_2
op_2 --> op_4
op_2 --> op_5
op_3 --> op_7
op_3 --> op_48
op_3 --> op_50
op_3 --> op_52
op_3 --> op_53
op_3 --> op_64
op_3 --> op_62
op_3 --> op_66
op_3 --> op_71
op_4 --> op_6
op_7 --> op_8
op_7 --> op_9
op_7 --> op_10
op_7 --> op_15
op_7 --> op_18
op_10 --> op_11
op_10 --> op_12
op_11 --> op_13
op_11 --> op_14
op_11 --> op_19
op_15 --> op_16
op_16 --> op_17
op_20 --> op_21
op_20 --> op_22
op_20 --> op_25
op_24 --> op_26
op_24 --> op_27
op_25 --> op_24
op_27 --> op_28
op_27 --> op_29
op_27 --> op_30
op_27 --> op_31
op_27 --> op_33
op_33 --> op_32
op_34 --> op_35
op_34 --> op_36
op_34 --> op_42
op_34 --> op_45
op_35 --> op_37
op_36 --> op_40
op_36 --> op_41
op_37 --> op_38
op_37 --> op_39
op_42 --> op_43
op_42 --> op_44
op_48 --> op_46
op_48 --> op_47
op_48 --> op_49
op_50 --> op_51
op_51 --> op_70
op_52 --> op_54
op_52 --> op_55
op_52 --> op_58
op_53 --> op_56
op_53 --> op_57
op_53 --> op_58
op_54 --> op_60
op_56 --> op_61
op_58 --> op_59
op_62 --> op_63
op_64 --> op_65
op_64 --> op_68
op_66 --> op_67
op_68 --> op_69
op_71 --> op_76
op_71 --> op_79
op_72 --> op_84
op_72 --> op_102
op_73 --> op_95
op_73 --> op_100
op_73 --> op_101
op_74 --> op_91
op_74 --> op_92
op_74 --> op_108
op_75 --> op_89
op_75 --> op_90
op_75 --> op_105
op_76 --> op_77
op_76 --> op_72
op_76 --> op_75
op_79 --> op_78
op_79 --> op_73
op_79 --> op_74
op_84 --> op_80
op_84 --> op_81
op_84 --> op_82
op_84 --> op_83
op_89 --> op_85
op_89 --> op_86
op_89 --> op_87
op_89 --> op_88
op_95 --> op_93
op_95 --> op_94
op_100 --> op_96
op_100 --> op_97
op_100 --> op_98
op_100 --> op_99
op_101 --> op_104
op_108 --> op_107
op_102 --> op_103
op_105 --> op_106
`

const edges = raw
  .trim()
  .split(/\n/)
  .filter(Boolean)
  .map((l) => {
    const m = l.match(/(op_\d+)\s*-->\s*(op_\d+)/)
    return [m[1], m[2]]
  })

const adj = new Map()
for (const [a, b] of edges) {
  if (!adj.has(a)) adj.set(a, [])
  adj.get(a).push(b)
}

const depth = new Map([['op_0', 0]])
const q = ['op_0']
while (q.length) {
  const u = q.shift()
  const d = depth.get(u)
  for (const v of adj.get(u) || []) {
    if (!depth.has(v)) {
      depth.set(v, d + 1)
      q.push(v)
    }
  }
}

const maxD = Math.max(...depth.values())
const byD = new Map()
for (const [n, d] of depth) {
  if (!byD.has(d)) byD.set(d, [])
  byD.get(d).push(n)
}

console.log('max depth', maxD)
for (let i = 0; i <= maxD; i++) {
  const nodes = (byD.get(i) || []).sort((a, b) => Number(a.slice(3)) - Number(b.slice(3)))
  console.log(`d${i}:`, nodes.join(' '))
}
