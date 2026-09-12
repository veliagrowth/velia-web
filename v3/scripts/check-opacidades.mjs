/**
 * GUARDA — una opacidad fuera de la escala de Tailwind no pinta nada.
 *
 * POR QUÉ EXISTE (12-sep-2026). El header pegajoso llevaba escrito
 * `bg-cream/92`. Esa clase **no existe**: la escala de opacidad de Tailwind va
 * de cinco en cinco, así que `/92` no genera ninguna regla. El header llevaba
 * quién sabe cuánto tiempo SIN FONDO, solo con el desenfoque.
 *
 * No se notaba porque encima de secciones claras un header transparente sobre
 * Pearl Cloud se ve igual que un header Pearl Cloud. Apareció el día que la Home
 * nueva metió dos secciones oscuras: sobre ellas, el logotipo y el menú —tinta
 * oscura— quedaban ilegibles.
 *
 * Es la familia de fallo número uno de este repositorio: **una clase que no
 * existe no da error, simplemente no pinta**. Ni el build, ni TypeScript, ni el
 * navegador dicen nada. Lo mismo que un selector CSS que no casa con nada, o que
 * un `SELECT` bloqueado por RLS.
 *
 * QUÉ DEMUESTRA
 *   claim:    ninguna clase de opacidad del código es inexistente
 *   medición: toda opacidad `-N` en el marcado es 0, 100 o múltiplo de 5, que es
 *             exactamente la escala que Tailwind 3.4 genera por defecto
 *   por qué:  Tailwind solo emite las clases de su escala; cualquier otra se
 *             descarta en silencio y el estilo simplemente no llega
 *
 * Los valores arbitrarios SÍ son válidos con corchetes —`bg-cream/[0.92]`— y
 * esta guarda no los toca: llevan su propia sintaxis y Tailwind sí los genera.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const RAIZ = process.cwd()
const CARPETAS = ['app', 'components', 'lib']
const EXTENSIONES = ['.tsx', '.ts']

/* La escala por defecto de Tailwind 3.4: 0, 100 y los múltiplos de 5. */
const enLaEscala = n => n === 0 || n === 100 || n % 5 === 0

const PROPIEDADES =
  '(?:bg|text|border|decoration|ring|ring-offset|fill|stroke|from|to|via|placeholder|divide|outline|shadow|accent|caret)'
const PATRON = new RegExp(`\\b${PROPIEDADES}-[a-z0-9-]+\\/(\\d{1,3})\\b`, 'g')

const ficheros = []
const recorrer = dir => {
  for (const entrada of readdirSync(dir)) {
    const ruta = join(dir, entrada)
    if (statSync(ruta).isDirectory()) {
      if (entrada === 'node_modules' || entrada === '.next') continue
      recorrer(ruta)
    } else if (EXTENSIONES.some(e => entrada.endsWith(e))) {
      ficheros.push(ruta)
    }
  }
}
for (const c of CARPETAS) {
  try {
    recorrer(join(RAIZ, c))
  } catch {
    /* Una carpeta que no existe no es un fallo de esta guarda. */
  }
}

const rojo = t => `\x1b[31m${t}\x1b[0m`
const verde = t => `\x1b[32m${t}\x1b[0m`

const rotas = []
let revisadas = 0

for (const fichero of ficheros) {
  const texto = readFileSync(fichero, 'utf8')
  const lineas = texto.split('\n')
  lineas.forEach((linea, i) => {
    for (const m of linea.matchAll(PATRON)) {
      revisadas++
      const valor = Number(m[1])
      if (!enLaEscala(valor)) {
        rotas.push({ fichero: relative(RAIZ, fichero), linea: i + 1, clase: m[0] })
      }
    }
  })
}

if (rotas.length === 0) {
  console.log(verde(`✅ ${revisadas} opacidades revisadas, todas dentro de la escala de Tailwind.`))
  process.exit(0)
}

console.error(rojo(`\n✖ ${rotas.length} clase(s) de opacidad que NO EXISTEN y por tanto no pintan nada:`))
for (const r of rotas) {
  console.error(`    ${r.fichero}:${r.linea}  ${rojo(r.clase)}`)
}
console.error('')
console.error('  La escala de Tailwind son 0, 100 y los múltiplos de 5.')
console.error('  Redondea al múltiplo de 5 más cercano, o usa corchetes si el valor')
console.error('  exacto importa de verdad: bg-cream/[0.92]')
console.error('')
process.exit(1)
