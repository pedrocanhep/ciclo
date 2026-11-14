export const PROPERTY_STORAGE_KEY = 'ciclo.properties.v1'
export const DEMO_PROPERTY_ID = 'demo-boa-esperanca'
export const states = 'AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO'.split(' ')
export const initialProperty = {
  id: DEMO_PROPERTY_ID, name: 'Fazenda Boa Esperança', city: 'Londrina', state: 'PR',
  plots: [{ id: 'demo-plot-04', name: 'Talhão 04', crop: 'Soja', soilType: 'Argilosa', irrigation: '' }],
  activePlotId: 'demo-plot-04',
}
export const emptyPropertyForm = { name: '', state: '', city: '', plot: '', area: '', crop: '', soilType: '', irrigation: '', latitude: '', longitude: '' }
const text = value => typeof value === 'string' ? value.trim() : ''
export const hasDemoData = property => property?.id === DEMO_PROPERTY_ID
export const activePlot = property => property.plots.find(plot => plot.id === property.activePlotId) || property.plots[0]
export function validateProperty(values) {
  const errors = {}
  for (const [field, label] of [['name', 'nome da propriedade'], ['city', 'município'], ['plot', 'talhão']]) {
    if (!text(values[field])) errors[field] = `Informe o ${label}.`
    else if (text(values[field]).length > 120) errors[field] = 'Use no máximo 120 caracteres.'
  }
  if (!states.includes(values.state)) errors.state = 'Selecione um estado.'
  for (const [field, min, max, message] of [['area', 0, 100000000, 'Informe uma área maior que zero.'], ['latitude', -90, 90, 'Latitude deve estar entre -90 e 90.'], ['longitude', -180, 180, 'Longitude deve estar entre -180 e 180.']]) {
    if (values[field] !== '' && values[field] != null && (!Number.isFinite(Number(values[field])) || Number(values[field]) < min || Number(values[field]) > max || (field === 'area' && Number(values[field]) === 0))) errors[field] = message
  }
  if (!['', 'yes', 'no', 'partial'].includes(values.irrigation ?? '')) errors.irrigation = 'Selecione uma opção válida.'
  return errors
}
export function createProperty(values, id = globalThis.crypto.randomUUID()) {
  const errors = validateProperty(values)
  if (Object.keys(errors).length) throw new Error('Revise os campos da propriedade.')
  const plotId = `${id}-plot-1`
  const optionalNumber = value => value === '' || value == null ? null : Number(value)
  return { id, name: text(values.name), city: text(values.city), state: values.state,
    latitude: optionalNumber(values.latitude), longitude: optionalNumber(values.longitude),
    activePlotId: plotId, plots: [{ id: plotId, name: text(values.plot), crop: text(values.crop), soilType: text(values.soilType), irrigation: values.irrigation || '', area: optionalNumber(values.area) }] }
}
function validStoredProperty(property) {
  if (!property || typeof property.id !== 'string' || !property.id || !Array.isArray(property.plots) || !property.plots.length) return false
  const ids = new Set()
  for (const plot of property.plots) {
    if (!plot || typeof plot.id !== 'string' || !plot.id || ids.has(plot.id)) return false
    ids.add(plot.id)
    const fields = { ...property, ...plot, plot: plot.name, name: property.name, area: plot.area ?? '', latitude: property.latitude ?? '', longitude: property.longitude ?? '' }
    if (Object.keys(validateProperty(fields)).length) return false
    if (['crop', 'soilType', 'irrigation'].some(key => plot[key] != null && typeof plot[key] !== 'string')) return false
  }
  return ids.has(property.activePlotId)
}
export function defaultPropertyState() {
  return { version: 1, properties: [initialProperty], selectedId: DEMO_PROPERTY_ID }
}
export function readProperties(storage) {
  const fallback = defaultPropertyState()
  try {
    const raw = storage.getItem(PROPERTY_STORAGE_KEY)
    if (!raw) return { ...fallback, storageMessage: '' }
    const value = JSON.parse(raw)
    if (value.version !== 1 || !Array.isArray(value.properties)) throw new Error('Formato inválido')
    const properties = [initialProperty]
    const ids = new Set([DEMO_PROPERTY_ID])
    let rejected = false
    for (const property of value.properties) {
      if (property?.id === DEMO_PROPERTY_ID) continue
      if (!validStoredProperty(property) || ids.has(property.id)) { rejected = true; continue }
      properties.push(property); ids.add(property.id)
    }
    return { version: 1, properties, selectedId: ids.has(value.selectedId) ? value.selectedId : DEMO_PROPERTY_ID,
      storageMessage: rejected ? 'Alguns registros locais inválidos não puderam ser carregados. O armazenamento original foi preservado até sua próxima alteração.' : '' }
  } catch {
    return { ...fallback, storageMessage: 'Não foi possível recuperar as propriedades locais. Os registros existentes não foram sobrescritos. Você pode continuar nesta sessão.' }
  }
}
export function saveProperties(storage, state) {
  try {
    storage.setItem(PROPERTY_STORAGE_KEY, JSON.stringify({ version: 1, properties: state.properties, selectedId: state.selectedId }))
    return ''
  } catch {
    return 'Não foi possível salvar neste navegador. As alterações estão disponíveis apenas nesta sessão; não recarregue antes de anotar seus dados.'
  }
}
