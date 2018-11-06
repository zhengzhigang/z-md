export const UUID = (function () {
  let self = {}
  let lut = []
  for (let i = 0; i < 256; i++) {
    lut[i] = (i < 16 ? '0' : '') + (i).toString(16)
  }
  self.generate = function () {
    let d0 = Math.random() * 0xffffffff | 0
    let d1 = Math.random() * 0xffffffff | 0
    let d2 = Math.random() * 0xffffffff | 0
    let d3 = Math.random() * 0xffffffff | 0
    return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' +
      lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
      lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
      lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff]
  }
  return self
})()

export function hasClass (elem, cls) {
  cls = cls || ''
  if (cls.replace(/\s/g, '').length === 0) return false
  return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ')
}

export function addClass (elem, cls) {
  if (!hasClass(elem, cls)) {
    elem.className = elem.className === '' ? cls : elem.className + ' ' + cls
  }
}

export function removeClass (elem, cls) {
  if (hasClass(elem, cls)) {
    var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, '') + ' '
    while (newClass.indexOf(' ' + cls + ' ') >= 0) {
      newClass = newClass.replace(' ' + cls + ' ', ' ')
    }
    elem.className = newClass.replace(/^\s+|\s+$/g, '')
  }
}
// 判断对象的属性值不为空
export function isEmptyProp (p) {
  let c = false
  for (var i in p) {
    if (typeof p[i] === 'object') {
      if (p[i].constructor === Array && p[i].length === 0) {
        c = true
      } else {
        isEmptyProp(p[i])
      }
    } else if (!p[i]) {
      c = true
    }
  }
  return c
}
// 判断数组或对象是否为空
export function isEmpty (v) {
  return (Array.isArray(v) && v.length === 0) || (Object.prototype.isPrototypeOf(v) && Object.keys(v).length === 0)
}
