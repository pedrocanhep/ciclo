import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { createServer } from 'vite'
import { createProperty, emptyPropertyForm, initialProperty, saveProperties } from '../src/services/properties.js'

const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
try {
  const { default: App } = await server.ssrLoadModule('/src/App.jsx')
  const data = new Map()
  const storage = { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) }
  globalThis.window = { localStorage: storage }
  await test('original property dashboard renders the demonstration and all navigation buttons', () => {
    const html = renderToString(createElement(App))
    for (const text of ['Fazenda Boa Esperança', 'Saúde do solo', '5,8', 'Lavoura', 'Planejamento', 'modal-root']) assert.ok(html.includes(text), text)
  })
  await test('reloaded selected property renders its own identity and empty states without inherited soil data', () => {
    const property = createProperty({ ...emptyPropertyForm, name: 'Sítio Horizonte', state: 'SC', city: 'Chapecó', plot: 'Leste' })
    saveProperties(storage, { properties: [initialProperty, property], selectedId: property.id })
    const html = renderToString(createElement(App))
    assert.ok(html.includes('Sítio Horizonte'))
    assert.ok(html.includes('Chapecó, SC'))
    assert.ok(html.includes('Nenhuma análise registrada'))
    assert.ok(html.includes('Nenhuma tarefa cadastrada'))
    assert.doesNotMatch(html, /5,8|2,7%|31%|Talhão 04|Fazenda Boa Esperança/)
  })
} finally {
  delete globalThis.window
  await server.close()
}
