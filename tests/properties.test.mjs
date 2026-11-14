import test from 'node:test'
import assert from 'node:assert/strict'
import { createProperty, readProperties, saveProperties, validateProperty, emptyPropertyForm, initialProperty, activePlot, hasDemoData, PROPERTY_STORAGE_KEY } from '../src/services/properties.js'
const values = { ...emptyPropertyForm, name: ' Sítio Horizonte ', city: 'Maringá', state: 'PR', plot: 'Área Norte', area: '12.5', crop: 'Milho' }
function memoryStorage() { const data = new Map(); return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) } }

test('validates required fields, states and optional coordinates/area', () => {
  assert.deepEqual(Object.keys(validateProperty(emptyPropertyForm)).sort(), ['city', 'name', 'plot', 'state'])
  assert.deepEqual(validateProperty(values), {})
  const errors = validateProperty({ ...values, area: '-1', latitude: '91', longitude: 'abc', state: 'XX' })
  assert.deepEqual(Object.keys(errors).sort(), ['area', 'latitude', 'longitude', 'state'])
  assert.equal(Object.keys(validateProperty({ ...values, latitude: '-90', longitude: '180' })).length, 0)
})
test('creates unique records with active plots and no inherited demonstration data', () => {
  const first = createProperty(values), second = createProperty(values)
  assert.notEqual(first.id, second.id)
  assert.equal(first.name, 'Sítio Horizonte')
  assert.equal(activePlot(first).area, 12.5)
  assert.equal(hasDemoData(first), false)
  assert.equal(hasDemoData(initialProperty), true)
})
test('round trip preserves all properties, selected property and optional fields', () => {
  const storage = memoryStorage()
  const property = createProperty({ ...values, latitude: '-23.4', longitude: '-51.9', irrigation: 'partial' })
  assert.equal(saveProperties(storage, { properties: [initialProperty, property], selectedId: property.id }), '')
  const loaded = readProperties(storage)
  assert.equal(loaded.selectedId, property.id)
  assert.equal(loaded.properties.length, 2)
  assert.deepEqual(loaded.properties[1], property)
  assert.equal(loaded.storageMessage, '')
})
test('corrupt storage is not silently overwritten', () => {
  const storage = memoryStorage()
  storage.setItem(PROPERTY_STORAGE_KEY, '{invalid')
  assert.equal(readProperties(storage).properties.length, 1)
  assert.ok(readProperties(storage).storageMessage)
  assert.equal(storage.getItem(PROPERTY_STORAGE_KEY), '{invalid')
})
test('invalid records/duplicates are excluded and invalid selection falls back safely', () => {
  const storage = memoryStorage(), property = createProperty(values, 'new-1')
  storage.setItem(PROPERTY_STORAGE_KEY, JSON.stringify({ version: 1, properties: [property, property, { ...property, id: 'broken', plots: [] }], selectedId: 'missing' }))
  const loaded = readProperties(storage)
  assert.equal(loaded.properties.length, 2)
  assert.equal(loaded.selectedId, initialProperty.id)
  assert.ok(loaded.storageMessage)
})
test('storage failures return an actionable message instead of throwing', () => {
  const storage = { getItem() { throw Error('Denied') }, setItem() { throw Error('Quota') } }
  assert.ok(readProperties(storage).storageMessage)
  assert.ok(saveProperties(storage, { properties: [initialProperty], selectedId: initialProperty.id }))
})
