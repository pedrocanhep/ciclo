import { climateConfig, futureSources, seasonalScenarios, shortTermForecast } from '../data/climateScenarios.js'
const DAY = 86400000
function parseDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN
  const date = Date.parse(`${value}T00:00:00Z`)
  return Number.isFinite(date) && new Date(date).toISOString().slice(0, 10) === value ? date : NaN
}
export function validatePeriod(start, end, config = climateConfig) {
  const errors = {}
  const startTime = parseDate(start), endTime = parseDate(end)
  if (!Number.isFinite(startTime)) errors.start = 'Informe uma data inicial válida.'
  if (!Number.isFinite(endTime)) errors.end = 'Informe uma data final válida.'
  if (Number.isFinite(startTime) && Number.isFinite(endTime)) {
    if (endTime < startTime) errors.end = 'A data final deve ser igual ou posterior à inicial.'
    else if ((endTime - startTime) / DAY + 1 > config.maxIntervalDays) errors.end = `Escolha um intervalo de até ${config.maxIntervalDays} dias para esta demonstração.`
  }
  return errors
}
export function analyzeClimatePeriod({ property, start, end }, config = climateConfig) {
  const errors = validatePeriod(start, end, config)
  if (Object.keys(errors).length) return { errors }
  const startTime = parseDate(start), endTime = parseDate(end), reference = parseDate(config.referenceDate)
  const days = (endTime - startTime) / DAY + 1
  const forecast = startTime >= reference && endTime <= reference + (config.forecastHorizonDays - 1) * DAY
  const month = Number(start.slice(5, 7))
  const season = month >= 6 && month <= 8 ? 'cool' : month >= 4 && month <= 9 ? 'dry' : 'wet'
  const scenario = forecast ? shortTermForecast : seasonalScenarios[season]
  const historic = !forecast
  const label = historic ? 'Histórico sazonal simulado' : 'Previsão meteorológica simulada'
  const unavailable = 'Informação insuficiente: não há modelo meteorológico apropriado integrado.'
  const hasSoil = property.id === 'demo-boa-esperanca'
  return {
    errors: {}, propertyId: property.id, start, end, days, type: forecast ? 'forecast' : 'history', label,
    referenceDate: config.referenceDate, scenario: scenario.name,
    sources: [forecast ? futureSources.forecast : futureSources.history, futureSources.soil],
    limitation: historic
      ? 'O período está fora da janela demonstrativa de curto prazo. As faixas representam um cenário sazonal fictício para a época do início do intervalo, não uma previsão diária nem estatísticas reais desta região. Intervalos que cruzam estações exigem análise segmentada em uma integração futura.'
      : `Janela de ${config.forecastHorizonDays} dias configurada apenas para a demonstração, a partir de ${config.referenceDate}. Não garante a capacidade de nenhuma fonte real. Não há modelos consultados.`,
    indicators: [
      { title: 'Temperatura', text: `${scenario.minimum}°C a ${scenario.maximum}°C. ${scenario.trend}`, level: 'neutral', note: historic ? 'Faixa sazonal fictícia; não são máximas e mínimas diárias.' : 'Mínima e máxima do cenário de curto prazo.' },
      { title: 'Precipitação', text: `${scenario.rainPerDay * days} mm ${historic ? 'no cenário histórico ilustrativo' : 'no cenário de previsão'}. ${scenario.distribution}`, level: 'neutral', note: 'Acumulado fictício proporcional à duração, sem probabilidade validada.' },
      { title: 'Chuva intensa', text: historic ? 'Histórico fictício não permite estimar eventos fortes em datas específicas.' : unavailable, level: 'neutral' },
      { title: 'Geada', text: historic ? 'Sem série local e modelo adequado para estimar geadas no período.' : unavailable, level: 'neutral' },
      { title: 'Granizo', text: 'Informação insuficiente. Sem dados de tempestades; não há previsão de granizo.', level: 'neutral' },
      { title: 'Seca', text: scenario.drought, level: scenario.droughtLevel, note: 'Classificação do cenário fictício, sem diagnóstico da propriedade.' },
      { title: 'Umidade do solo', text: hasSoil ? '31% no exemplo original, referência 2026-11-14. Fonte futura: NASA SMAP.' : 'Sem observação de umidade cadastrada para esta propriedade.', level: 'neutral', note: 'Não é estimativa para o intervalo escolhido nem observação real.' },
      { title: 'Atividades agrícolas', text: 'Exemplo de planejamento: conferir umidade local, condições do terreno e previsão atualizada antes de operações. Sem janela operacional validada.', level: 'attention' },
    ],
  }
}
