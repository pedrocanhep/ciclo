import { useState } from 'react'
import BottomSheet from './BottomSheet'
import { useAppState } from '../state/useAppState'
import { activePlot, hasDemoData, emptyPropertyForm, states, validateProperty } from '../services/properties'
import { dashboard } from '../data/dashboard'
import { climateConfig } from '../data/climateScenarios'
import { analyzeClimatePeriod, validatePeriod } from '../services/climate'
import { MonthlyTasks } from './Dashboard'
import s from './ManagementPanels.module.css'

function PropertyIdentity() {
  const { property } = useAppState()
  return <div className={s.identity}><strong>{property.name}</strong><p>{property.city}, {property.state} · {activePlot(property).name}</p></div>
}
export function FarmPanel({ onClose, onOpen }) {
  const { property } = useAppState()
  return <BottomSheet eyebrow="ACOMPANHAMENTO" title="Minha Lavoura" onClose={onClose}>
    <PropertyIdentity />
    {hasDemoData(property) ? <><h3>Resumo da saúde do solo</h3><div className={s.metrics}>{dashboard.soil.metrics.map(metric => <div key={metric.label}><p>{metric.label}</p><strong>{metric.value}</strong><small>{metric.status}</small></div>)}</div><p className={s.note}>Última análise registrada: {dashboard.soil.date}. Valores demonstrativos.</p><button className={s.secondary} onClick={() => onOpen('soil')}>Ver laudo completo</button></> : <p className={s.empty}>Nenhuma análise registrada para esta propriedade.</p>}
    <button className={s.primary} onClick={() => onOpen('new-analysis')}>Nova análise</button>
  </BottomSheet>
}
export function PlanningPanel({ onClose, onOpen }) {
  const { property, tasks } = useAppState()
  return <BottomSheet eyebrow="ORGANIZAÇÃO DA SAFRA" title="Planejamento Agrícola" onClose={onClose}>
    <PropertyIdentity />
    {hasDemoData(property) ? <div className={s.identity}><h3>{dashboard.crop.sequence.join(' → ')}</h3><p>Objetivos ilustrativos: cobertura do solo, retenção de água e aumento de matéria orgânica. Sequência sem validação agronômica.</p></div> : <p className={s.empty}>Nenhuma sequência de culturas cadastrada. Você pode explorar exemplos no comparador.</p>}
    <button className={s.primary} onClick={() => onOpen('rotation')}>Comparar estratégias</button>
    <div className={s.identity}><h3>{dashboard.tasks.title}</h3><p>{tasks.filter(task => task.done).length} de {tasks.length} tarefas concluídas.</p>{tasks.filter(task => !task.done).slice(0, 2).map(task => <p key={task.id}>{task.title}</p>)}</div>
    <button className={s.secondary} onClick={() => onOpen('tasks')}>Ver lista completa de tarefas</button>
  </BottomSheet>
}
export function TasksPanel({ onClose }) {
  return <BottomSheet eyebrow="ACOMPANHAMENTO" title="Tarefas agrícolas" onClose={onClose}><PropertyIdentity /><MonthlyTasks /><p className={s.note}>As tarefas são mantidas por propriedade durante esta sessão.</p></BottomSheet>
}

const fields = [
  ['name', 'Nome da propriedade', 'text', true], ['state', 'Estado', 'state', true], ['city', 'Município', 'text', true], ['plot', 'Nome ou identificação do talhão', 'text', true],
  ['area', 'Área em hectares (opcional)', 'number'], ['crop', 'Cultura atualmente plantada (opcional)', 'text'], ['soilType', 'Tipo de solo (opcional)', 'text'], ['irrigation', 'Disponibilidade de irrigação (opcional)', 'irrigation'], ['latitude', 'Latitude (opcional)', 'number'], ['longitude', 'Longitude (opcional)', 'number'],
]
export function PropertyManager({ onClose }) {
  const { properties, selectedId, selectProperty, addProperty, storageMessage, propertyDraft, setPropertyDraft } = useAppState()
  const [editing, setEditing] = useState(false)
  const values = propertyDraft || emptyPropertyForm
  const setValues = setPropertyDraft
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  function submit(event) {
    event.preventDefault()
    const nextErrors = validateProperty(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) { event.currentTarget.querySelector(`[name="${Object.keys(nextErrors)[0]}"]`)?.focus(); return }
    const persisted = addProperty(values)
    setEditing(false); setValues(emptyPropertyForm)
    setMessage(persisted ? 'Propriedade salva e selecionada.' : 'Propriedade criada nesta sessão. Confira o aviso de armazenamento.')
  }
  return <BottomSheet eyebrow="SUAS ÁREAS DE CULTIVO" title={editing ? 'Cadastrar propriedade' : 'Minhas propriedades'} onClose={onClose}>
    <p className={s.note}>Selecione ou cadastre uma propriedade agrícola.</p>
    {storageMessage && <p role="alert" className={s.warning}>{storageMessage}</p>}
    {message && <p role="status" className={s.success}>{message}</p>}
    {editing ? <form noValidate className={s.form} onSubmit={submit}>
      {fields.map(([name, label, type, required]) => <label key={name} htmlFor={`property-${name}`}>{label}{required && ' *'}
        {type === 'state' || type === 'irrigation' ? <select id={`property-${name}`} name={name} value={values[name]} required={required} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `error-${name}` : undefined} onChange={e => setValues({ ...values, [name]: e.target.value })}>
          {type === 'state' ? <><option value="">Selecione o estado</option>{states.map(state => <option key={state} value={state}>{state}</option>)}</> : <><option value="">Não informado</option><option value="yes">Sim</option><option value="no">Não</option><option value="partial">Parcial</option></>}
        </select> : <input id={`property-${name}`} name={name} type={type} step={type === 'number' ? 'any' : undefined} maxLength={type === 'text' ? 120 : undefined} value={values[name]} required={required} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `error-${name}` : undefined} onChange={e => setValues({ ...values, [name]: e.target.value })} />}
        {errors[name] && <span id={`error-${name}`} className={s.error}>{errors[name]}</span>}
      </label>)}
      <button className={s.primary} type="submit">Salvar propriedade</button><button className={s.secondary} type="button" onClick={() => { setEditing(false); setErrors({}) }}>Cancelar</button>
    </form> : <><div className={s.propertyList}>{properties.map(property => <button key={property.id} className={`${s.propertyCard} ${selectedId === property.id ? s.selected : ''}`} aria-pressed={selectedId === property.id} onClick={() => { selectProperty(property.id); setMessage(`${property.name} selecionada.`) }}><strong>{property.name}</strong><span>{property.city}, {property.state}</span><span>Talhões: {property.plots.map(plot => plot.name).join(', ')}</span><span>Cultura atual: {activePlot(property).crop || 'Não informada'}</span>{selectedId === property.id && <small>Propriedade selecionada</small>}</button>)}</div><button className={s.primary} onClick={() => { setEditing(true); setMessage('') }}>+ Cadastrar nova propriedade</button></>}
  </BottomSheet>
}

export function ClimatePeriodPanel({ onClose, draft, onDraftChange, result, onResult }) {
  const { property } = useAppState()
  const [errors, setErrors] = useState({})
  function submit(event) {
    event.preventDefault()
    const next = validatePeriod(draft.start, draft.end)
    setErrors(next)
    if (Object.keys(next).length) { onResult(null); event.currentTarget.querySelector(`[name="${Object.keys(next)[0]}"]`)?.focus(); return }
    onResult(analyzeClimatePeriod({ property, ...draft }))
  }
  return <BottomSheet eyebrow="CLIMA E HISTÓRICO" title="Análise climática por período" onClose={onClose}>
    <PropertyIdentity />
    <p className={s.warning}>Simulação demonstrativa — dados não consultados em tempo real.</p>
    <p className={s.note}>Referência fixa: {climateConfig.referenceDate}. Janela próxima configurada: {climateConfig.forecastHorizonDays} dias; demais datas usam cenário histórico ilustrativo.</p>
    <form noValidate className={s.form} onSubmit={submit}>{[['start', 'Data inicial'], ['end', 'Data final']].map(([key, label]) => <label key={key} htmlFor={`period-${key}`}>{label}<input id={`period-${key}`} name={key} type="date" required value={draft[key]} onChange={event => { onDraftChange({ ...draft, [key]: event.target.value }); onResult(null) }} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `period-error-${key}` : undefined} />{errors[key] && <span className={s.error} id={`period-error-${key}`}>{errors[key]}</span>}</label>)}<button className={s.primary}>Analisar período</button></form>
    {result && result.propertyId === property.id && <section className={s.result} aria-live="polite"><h3>{result.label}</h3><p className={s.note}>{result.start} a {result.end} · {result.scenario}</p><p className={s.warning}>{result.limitation}</p><div className={s.resultGrid}>{result.indicators.map(indicator => <article key={indicator.title} className={`${s.risk} ${s[indicator.level]}`}><h4>{indicator.title}</h4><p>{indicator.text}</p>{indicator.note && <small>{indicator.note}</small>}</article>)}</div><div className={s.identity}><h3>Fontes previstas para integração futura</h3>{result.sources.map(source => <p key={source}>{source}</p>)}<p>Referência dos dados simulados: {result.referenceDate}. Nenhum valor foi calculado a partir dessas fontes.</p></div></section>}
  </BottomSheet>
}
