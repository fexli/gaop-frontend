<!--copy from v2 gaop frontend-->
<script setup>
defineProps({
  log: {
    type: String,
    default: () => ""
  },
  color: {
    type: Object,
    default: () => null
  },
  prevColor: {
    type: Object,
    default: () => null
  },
  inner: {
    type: Array,
    default: () => null
  }
})

function parseColorStyle(s) {
  if (s == null) {
    return ""
  }
  let r = ""
  let text_deco = ""
  // color: rgb();
  // background-color: rgb();
  //
  if ((s.options & 511) !== 0) {
    let o = s.options
    if ((o & 1) !== 0 && (o & 512) === 0) {
      r += "font-weight: bold;"
    }
    // if ((o & 2) !== 0 && (o & 1024) === 0) {
    // }
    if ((o & 4) !== 0 && (o & 2048) === 0) {
      r += "font-style: italic;"
    }
    if ((o & 8) !== 0 && (o & 4096) === 0) {
      text_deco = "underline"
    }
    // if ((o & 16) !== 0 && (o & 8192) === 0) {
    // }
    // if ((o & 32) !== 0 && (o & 16384) === 0) {
    // }
    if ((o & 64) !== 0 && (o & 32768) === 0) {
      let i = 0
      for (let m of s.identity) {
        if (m[3] === 1) {
          s.identity[i][3] = 2
        }
        if (m[3] === 2) {
          s.identity[i][3] = 1
        }
        i += 1
      }
    }
    if ((o & 128) !== 0 && (o & 65536) === 0) {
      if (text_deco === '') {
        text_deco = "line-through"
      } else {
        text_deco += " line-through"
      }
    }
    if ((o & 256) !== 0 && (o & 131072) === 0) {
      if (text_deco === '') {
        text_deco = "underline"
      } else {
        text_deco += " underline"
      }
    }
  }
  if (s.identity) {
    for (let m of s.identity) {
      switch (m[3]) {
        case 1:
          r += `color: rgb(${m[0]},${m[1]},${m[2]});`
          break
        case 2:
          r += `background-color: rgb(${m[0]},${m[1]},${m[2]});`
          break
      }
    }
  }
  if (text_deco !== "") {
    r += "text-decoration: " + text_deco
  }
  return r
}

function get256rv(c) {
  if (c === 0) {
    return 0
  }
  return c * 40 + 55
}

function cvt256torgb(c) {
  return [get256rv((c - 16) / 36), get256rv((c - 16) % 36 / 6), get256rv((c - 16) % 6)]
}

function toRGB(s) {
  if (s == null) {
    return [[0, 0, 0, 0], [0, 0, 0, 0]]
  }
  if (s.length == null) { // base
    let col = s % 10
    switch (parseInt(s / 10)) {
      case 3:
        return [
          [128 * (col % 1), 128 * (col % 2), 128 * (col % 4), 1],
          [0, 0, 0, 0]
        ]
      case 4:
        return [
          [0, 0, 0, 0],
          [128 * (col % 1), 128 * (col % 2), 128 * (col % 4), 2]
        ]
      case 9:
        return [
          [256 * (col % 1), 256 * (col % 2), 256 * (col % 4), 1],
          [0, 0, 0, 0]
        ]
      case 10:
        return [
          [0, 0, 0, 0],
          [256 * (col % 1), 256 * (col % 2), 256 * (col % 4), 2]
        ]
    }
  }
  if (s.length === 2) {
    if (s[0].length == null) { // 16-c
      let r = [[0, 0, 0, 0], [0, 0, 0, 0]]
      for (let m of s) {
        let col = m % 10
        switch (parseInt(m / 10)) {
          case 3:
            r[0] = [128 * (col % 1), 128 * (col % 2), 128 * (col % 4), 1]
            break
          case 4:
            r[1] = [128 * (col % 1), 128 * (col % 2), 128 * (col % 4), 2]
            break
          case 9:
            r[0] = [256 * (col % 1), 256 * (col % 2), 256 * (col % 4), 1]
            break
          case 10:
            r[1] = [256 * (col % 1), 256 * (col % 2), 256 * (col % 4), 2]
            break
        }
      }
      return r
    } else if (s[0].length === 2) { // 256-c
      let r = [[0, 0, 0, 0], [0, 0, 0, 0]]
      let ir, ig, ib
      for (let m of s) {
        if (m[0] < 8) {
          ir = (m[0] % 1) * 128
          ig = (m[0] % 2) * 64
          ib = (m[0] % 4) * 32
        } else if (m[0] < 16) {
          ir = ((m[0] - 8) % 1) * 255
          ig = (((m[0] - 8) % 2) / 2) * 255
          ib = (((m[0] - 8) % 4) / 4) * 255
        } else if (m[0] < 232) {
          let k = cvt256torgb(m[0])
          ir = k[0]
          ig = k[1]
          ib = k[2]
        } else {
          ir = (m[0] - 232) * 10 + 8
          ig = ir
          ib = ir
        }
        r[m[1] - 1] = [ir, ig, ib, m[1]]
      }
      return r
    } else {
      return s
    }
  }
}

function mergeIdentityFrom(n, o) {
  let nn = toRGB(n)
  let oo = toRGB(o)
  if (nn[0][3] === 1 || n[0][3] === 2) {
    oo[0] = nn[0]
  }
  if (nn[1][3] === 1 || n[1][3] === 2) {
    oo[1] = nn[1]
  }
  return oo
}

function mergeOptionFrom(n, o) {
  if (o === 0) {
    return n
  }
  let m = 0
  m |= n && 511
  if ((o & 1) !== 0 && (o & 512) === 0) {
    m |= 1 | (n & 1)
  }
  if ((o & 2) !== 0 && (o & 1024) === 0) {
    m |= 2 | (n & 2)
  }
  if ((o & 4) !== 0 && (o & 2048) === 0) {
    m |= 4 | (n & 4)
  }
  if ((o & 8) !== 0 && (o & 4096) === 0) {
    m |= 8 | (n & 8)
  }
  if ((o & 16) !== 0 && (o & 8192) === 0) {
    m |= 16 | (n & 16)
  }
  if ((o & 32) !== 0 && (o & 16384) === 0) {
    m |= 32 | (n & 32)
  }
  if ((o & 64) !== 0 && (o & 32768) === 0) {
    m |= 64 | (n & 64)
  }
  if ((o & 128) !== 0 && (o & 65536) === 0) {
    m |= 128 | (n & 128)
  }
  if ((o & 256) !== 0 && (o & 131072) === 0) {
    m |= 256 | (n & 256)
  }
  return m
}

function mergeColorTo(o, n) {
  if (n == null) {
    return o
  }
  if (o == null) {
    return n
  }
  let m = {}
  if (n.identity == null) {
    m.identity = o.identity
  } else {
    m.identity = mergeIdentityFrom(n, o)
  }
  m.options = mergeOptionFrom(n, o)
  return m
}
</script>
<template>
  <span v-if="inner && inner.length !== 0">
    <template v-for="(data,index) in inner">
      <LogTextCtx
          v-bind:key="index"
          v-if="data"
          :log="data.log"
          :color="data.color"
          :inner="data.inner"
          :prev-color="prevColor"
      />
    </template>
  </span>
  <span v-else :style="parseColorStyle(mergeColorTo(prevColor,color))">{{ log }}</span>
</template>

