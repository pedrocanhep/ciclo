// Fictional presentation fixtures, not computed from observations or real climatology.
// Fixed reference makes identical property/date requests reproducible after reload.
export const climateConfig = { referenceDate: '2026-11-14', forecastHorizonDays: 7, maxIntervalDays: 366 }
export const futureSources = {
  forecast: 'Serviço de modelos meteorológicos operacionais a definir; sem integração nesta etapa.',
  history: 'NASA POWER: histórico de variáveis ambientais; NASA GPM/IMERG: observações de precipitação.',
  soil: 'NASA SMAP: observações de umidade do solo, sem previsão operacional.',
}
export const seasonalScenarios = {
  wet: { id: 'wet', name: 'Cenário fictício úmido', minimum: 18, maximum: 30, rainPerDay: 6, trend: 'Temperaturas estáveis no exemplo.', distribution: 'Chuvas concentradas em alguns dias no cenário, sem datas ou horários definidos.', drought: 'Sem déficit no cenário fictício; não é avaliação local.', droughtLevel: 'good' },
  dry: { id: 'dry', name: 'Cenário fictício seco', minimum: 16, maximum: 29, rainPerDay: 1, trend: 'Amplitude térmica maior no exemplo.', distribution: 'Longos intervalos sem chuva no cenário, sem distribuição diária prevista.', drought: 'Déficit hídrico elevado no cenário fictício; não é avaliação local.', droughtLevel: 'high' },
  cool: { id: 'cool', name: 'Cenário fictício de inverno', minimum: 8, maximum: 22, rainPerDay: 3, trend: 'Temperaturas mais baixas no exemplo.', distribution: 'Chuvas espaçadas no cenário, sem previsão diária.', drought: 'Possibilidade de déficit no cenário fictício.', droughtLevel: 'attention' },
}

// Separate short-range model fixture; never presented as NASA operational output.
export const shortTermForecast = {
  id: 'forecast-wet', name: 'Cenário fictício de curto prazo', minimum: 19, maximum: 29,
  rainPerDay: 4, trend: 'Temperaturas estáveis no modelo fictício.',
  distribution: 'Distribuição fictícia irregular no intervalo, sem horários de chuva definidos.',
  drought: 'Sem déficit no cenário fictício; não é avaliação local.', droughtLevel: 'good',
}
