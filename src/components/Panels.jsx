import { useRef, useState } from 'react'
import BottomSheet from './BottomSheet'
import { Mic, Sprout, Check, AlertTriangle } from './Icons'
import { voiceDemo, soilReport, rotations, rotationDisclaimer, demoDisclaimer, weatherAlert, analysisFields } from '../data/panels'
import { dashboard } from '../data/dashboard'
import s from './Panels.module.css'
import { useAppState } from '../state/useAppState'
import { activePlot, hasDemoData } from '../services/properties'

export function VoiceAssistant({ onClose }) {
  const [followUp, setFollowUp] = useState(false)
  const { property } = useAppState()
  return <BottomSheet eyebrow="ASSISTENTE INTELIGENTE" title="Conversa com o Ciclo" icon={<Sprout size={20} />} onClose={onClose}>
    <div className={s.voiceIntro}><span className={s.microphone}><Mic size={45} /></span><p>ESTOU OUVINDO SUA PERGUNTA...</p><small>Modo demonstrativo · microfone desligado</small></div>
    <div aria-live="polite" aria-atomic="true"><div className={s.transcript}><p>TRANSCRIÇÃO DA SUA VOZ:</p><blockquote>“{followUp ? voiceDemo.followUp : voiceDemo.transcript}”</blockquote></div>
    <div className={s.response}><div className={s.responseHeading}><strong>Resposta do Ciclo:</strong><span><i />Resposta demonstrativa</span></div><p>{!hasDemoData(property) ? `Não há dados de solo ou clima observados para ${property.name}. Cadastre uma análise e consulte a simulação por período. Esta resposta é apenas demonstrativa.` : followUp ? voiceDemo.followUpResponse : voiceDemo.response}</p></div></div>
    <p className={s.disclaimer}>{voiceDemo.disclaimer}</p>
    <div className={s.actions}><button className={s.secondary} onClick={() => setFollowUp(value => !value)}>Perguntar outra coisa</button><button className={s.primary} onClick={onClose}>Concluir</button></div>
  </BottomSheet>
}

export function SoilReport({ onClose }) {
  const { property } = useAppState()
  if (!hasDemoData(property)) return <BottomSheet eyebrow="SOLO" title="Laudo indisponível" onClose={onClose}><p className={s.disclaimer}>Nenhum laudo registrado para {property.name}.</p></BottomSheet>
  return <BottomSheet eyebrow="LAUDO COMPLETO" title="Análise Físico-Química do Solo" onClose={onClose}>
    <div className={s.sample}><strong>{soilReport.sample}</strong><p>{soilReport.laboratory}</p></div>
    <div className={s.tableWrapper}><table className={s.table}><caption className={s.srOnly}>Parâmetros demonstrativos da análise de solo</caption><thead><tr><th scope="col">PARÂMETRO</th><th scope="col">VALOR</th><th scope="col">STATUS</th></tr></thead><tbody>{soilReport.parameters.map(parameter => <tr key={parameter.name}><th scope="row">{parameter.name}</th><td>{parameter.value}</td><td className={parameter.attention ? s.warningText : s.good}>{parameter.status}</td></tr>)}</tbody></table></div>
    <p className={s.diagnosis}><strong>Diagnóstico Prático do Ciclo: </strong>{soilReport.diagnosis}</p>
    <p className={s.disclaimer}>{soilReport.disclaimer}</p>
    <button className={s.primary} onClick={onClose}>Fechar Laudo</button>
  </BottomSheet>
}

export function RotationComparator({ onClose }) {
  const { property } = useAppState()
  const [selected, setSelected] = useState(0)
  const tabs = useRef([])
  const strategy = rotations[selected]
  function navigateTabs(event, index) {
    let next
    if (event.key === 'ArrowRight') next = (index + 1) % rotations.length
    else if (event.key === 'ArrowLeft') next = (index + rotations.length - 1) % rotations.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = rotations.length - 1
    else return
    event.preventDefault()
    setSelected(next)
    tabs.current[next].focus()
  }
  return <BottomSheet eyebrow="APOIO À DECISÃO AGRONÔMICA" title="Comparador de Rotação de Culturas" onClose={onClose}>
    <p className={s.disclaimer}>{property.name} · {activePlot(property).name}. Estratégias ilustrativas, sem recomendação validada para esta propriedade.</p>
    <div className={s.tabs} role="tablist" aria-label="Estratégias de rotação">{rotations.map((rotation, index) => <button key={rotation.id} ref={element => { tabs.current[index] = element }} id={`tab-${rotation.id}`} role="tab" aria-selected={selected === index} aria-controls={`panel-${rotation.id}`} tabIndex={selected === index ? 0 : -1} className={selected === index ? s.selectedTab : ''} onClick={() => setSelected(index)} onKeyDown={event => navigateTabs(event, index)}>{rotation.tab}</button>)}</div>
    <div role="tabpanel" id={`panel-${strategy.id}`} aria-labelledby={`tab-${strategy.id}`} tabIndex={0}>
      <div className={s.rotationDescription}><h3>{strategy.title}</h3><p>{strategy.description}</p></div>
      <div className={s.indicators}><div><p>Proteção do Solo:</p><strong className={selected === 0 ? s.warningText : s.good}>{strategy.protection}</strong></div><div><p>Demanda Hídrica:</p><strong>{strategy.demand}</strong></div></div>
      <div className={s.risks}><h3><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 3 2 21h20L12 3Z"/><path d="M12 9v5m0 3v1"/></svg> Principais Riscos e Restrições:</h3><p>{strategy.risk}</p></div>
      <div className={s.evidence}><h3><Sprout size={16} /> Evidência Científica / Satélite NASA:</h3><p>{strategy.evidence}</p></div>
    </div>
    <div className={s.limitations}><p>* {rotationDisclaimer}</p><p>{demoDisclaimer}</p></div>
    <button className={s.primary} onClick={onClose}>Entendi as Diferenças</button>
  </BottomSheet>
}

export function WeatherAlert({ onClose }) {
  const { property } = useAppState()
  if (!hasDemoData(property)) return <BottomSheet eyebrow="CLIMA" title="Sem alertas disponíveis" onClose={onClose}><p className={s.disclaimer}>Nenhuma fonte meteorológica está integrada a {property.name}. A ausência de alertas não indica ausência de risco.</p><button className={s.primary} onClick={onClose}>Entendi</button></BottomSheet>
  return <BottomSheet eyebrow="DETALHAMENTO DO RISCO" title="Alerta de Chuva Forte" icon={<span className={s.alertIcon}><AlertTriangle size={23} /></span>} onClose={onClose}>
    <div className={s.severity}>
      <p><strong>Severidade:</strong> {weatherAlert.severity}</p>
      <p><strong>Período esperado:</strong> {weatherAlert.period}</p>
      <p><strong>Propriedade afetada:</strong> {weatherAlert.property}</p>
    </div>
    <h3 className={s.precautionsTitle}>Precauções recomendadas</h3>
    <ul className={s.precautions}>{weatherAlert.precautions.map(text => <li key={text}><Check size={22} /><span>{text}</span></li>)}</ul>
    <div className={s.evidence}><h3>CONFIABILIDADE DA PREVISÃO</h3><p>{weatherAlert.confidence}</p></div>
    <p className={s.disclaimer}>{weatherAlert.disclaimer}</p>
    <button className={s.primary} onClick={onClose}>Entendi as Recomendações</button>
  </BottomSheet>
}

export function ForecastDetails({ onClose, onOpenPeriod }) {
  const { property } = useAppState()
  return <BottomSheet eyebrow="CLIMA · DEMONSTRAÇÃO" title="Previsão & dados de satélite" onClose={onClose}>
    <div className={s.sample}><strong>{property.name}</strong><p>{property.city}, {property.state} · {hasDemoData(property) ? dashboard.weather.condition : 'Sem observações cadastradas'}</p></div>
    {hasDemoData(property) && <table className={s.table}><caption className={s.srOnly}>Previsão simulada para cinco dias</caption><thead><tr><th scope="col">DIA</th><th scope="col">MÁXIMA / MÍNIMA</th></tr></thead><tbody>{dashboard.weather.days.map(day => <tr key={day.label}><th scope="row">{day.label}</th><td>{day.temperatures}</td></tr>)}</tbody></table>}
    <div className={s.evidence}><h3>Fontes previstas para a próxima fase</h3><p>NASA GPM/IMERG para precipitação e NASA SMAP para umidade do solo. Os números desta demonstração são fictícios e não foram consultados nessas fontes.</p></div>
    <p className={s.disclaimer}>{demoDisclaimer}</p><button className={s.primary} onClick={onOpenPeriod}>Ver previsão por período</button>
  </BottomSheet>
}

export function NewSoilAnalysis({ onClose }) {
  const { property } = useAppState()
  const [saved, setSaved] = useState(false)
  const [values, setValues] = useState(Object.fromEntries(analysisFields.map(field => [field.name, hasDemoData(property) ? field.initial : ''])))
  return <BottomSheet eyebrow="REGISTRO DEMONSTRATIVO" title="Nova análise do solo" onClose={onClose}>
    <div className={s.sample}><strong>{property.name}</strong><p>{activePlot(property).name}</p></div>
    {saved ? <div role="status" className={s.evidence}><h3>Simulação de registro concluída</h3><p>{analysisFields.map(field => `${field.label}: ${values[field.name]}`).join(' · ')}</p><p>Os valores não foram enviados ou armazenados. A dashboard mantém os dados demonstrativos originais.</p></div> : <form className={s.analysisForm} onSubmit={event => { event.preventDefault(); setSaved(true) }}>
      {analysisFields.map(field => <label key={field.name}>{field.label}<input type="number" required min={field.min} max={field.max} step={field.step} value={values[field.name]} onChange={event => setValues({ ...values, [field.name]: event.target.value })} /></label>)}
      <p className={s.disclaimer}>Preencha valores de exemplo para simular o registro. Esta etapa não grava dados nem altera o laudo demonstrativo.</p>
      <button className={s.primary} type="submit">Simular registro</button>
    </form>}
    <button className={s.secondary} onClick={onClose}>{saved ? 'Concluir' : 'Cancelar'}</button>
  </BottomSheet>
}
