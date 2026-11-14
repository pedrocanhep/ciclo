import test from 'node:test'
import assert from 'node:assert/strict'
import { analyzeClimatePeriod, validatePeriod } from '../src/services/climate.js'
import { initialProperty, createProperty, emptyPropertyForm } from '../src/services/properties.js'
import { climateConfig } from '../src/data/climateScenarios.js'
const analyze = (start, end, property = initialProperty, config = climateConfig) => analyzeClimatePeriod({ property, start, end }, config)

test('validates empty, reversed, impossible and excessively long dates', () => {
  assert.equal(Object.keys(validatePeriod('', '')).length, 2)
  assert.ok(validatePeriod('2026-11-15', '2026-11-14').end)
  assert.ok(validatePeriod('2026-02-30', '2026-03-01').start)
  assert.ok(validatePeriod('2026-01-01', '2027-12-31').end)
  assert.deepEqual(validatePeriod('2026-11-14', '2026-11-14'), {})
  assert.deepEqual(validatePeriod('2024-02-29', '2024-03-01'), {})
})
test('classifies an inclusive configurable forecast window and history outside it', () => {
  assert.equal(analyze('2026-11-14', '2026-11-20').type, 'forecast')
  assert.equal(analyze('2026-11-14', '2026-11-21').type, 'history')
  assert.equal(analyze('2026-11-01', '2026-11-10').type, 'history')
  assert.equal(analyze('2026-11-14', '2026-11-21', initialProperty, { ...climateConfig, forecastHorizonDays: 14 }).type, 'forecast')
})
test('results are deterministic, vary by season and duration, and expose eight indicators', () => {
  const wet = analyze('2026-11-14', '2026-11-16')
  assert.deepEqual(wet, analyze('2026-11-14', '2026-11-16'))
  assert.notEqual(wet.scenario, analyze('2027-06-01', '2027-06-03').scenario)
  assert.notEqual(wet.scenario, analyze('2027-04-01', '2027-04-03').scenario)
  assert.notEqual(wet.indicators[1].text, analyze('2026-11-14', '2026-11-18').indicators[1].text)
  assert.equal(wet.indicators.length, 8)
  assert.equal(wet.referenceDate, climateConfig.referenceDate)
})
test('unsupported hazards remain insufficient, never marked low risk', () => {
  for (const result of [analyze('2026-11-14', '2026-11-16'), analyze('2027-06-01', '2027-06-03')]) {
    for (const title of ['Chuva intensa', 'Geada', 'Granizo']) assert.equal(result.indicators.find(item => item.title === title).level, 'neutral')
  }
})
test('new properties do not inherit the original soil observation', () => {
  const property = createProperty({ ...emptyPropertyForm, name: 'Nova', city: 'Curitiba', state: 'PR', plot: 'A' })
  const soil = analyze('2026-11-14', '2026-11-16', property).indicators.find(item => item.title === 'Umidade do solo')
  assert.match(soil.text, /Sem observação/)
  assert.doesNotMatch(soil.text, /31%/)
})
test('invalid intervals produce no indicators', () => {
  const result = analyze('', '')
  assert.ok(result.errors.start)
  assert.equal(result.indicators, undefined)
})
