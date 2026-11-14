export const voiceDemo = {
  transcript: 'Como está a umidade do meu solo para o plantio esta semana?',
  response: 'Olá! De acordo com os dados do satélite NASA SMAP coletados hoje às 08h, a umidade do solo no Talhão 04 está em 31%, o que é ideal para germinação. Porém, há previsão de 12 mm de chuva amanhã à tarde. Se for plantar soja agora, o momento é bom, mas evite aplicar herbicida pré-emergente logo antes da chuva forte.',
  followUp: 'O que devo observar antes de planejar o plantio?',
  followUpResponse: 'Neste exemplo, confira a análise do solo, acompanhe a previsão de chuva e avalie a cobertura do talhão. Na prática, dados locais atualizados e orientação de um profissional são necessários para definir o manejo.',
  disclaimer: 'Demonstração: nenhum áudio é captado. A resposta e as referências NASA são ilustrativas, sem consulta a satélites ou validação agronômica.',
}
export const soilReport = {
  sample: 'Talhão 04 · Amostra #2026-11-08',
  laboratory: 'Laboratório Agronômico Regional · Coleta: 10/11/2026',
  parameters: [
    { name: 'pH em CaCl₂', value: '5,8', status: 'Adequado' },
    { name: 'Matéria Orgânica (M.O.)', value: '27,0 g/dm³ (2,7%)', status: 'Média', attention: true },
    { name: 'Fósforo (P Mehlich-1)', value: '18,4 mg/dm³', status: 'Bom' },
    { name: 'Potássio (K trocável)', value: '0,38 cmolc/dm³', status: 'Adequado' },
    { name: 'Saturação por Bases (V%)', value: '62%', status: 'Ideal (>60%)' },
  ],
  diagnosis: 'O solo apresenta boa fertilidade e acidez corrigida. O principal ganho de produtividade viria do aumento da matéria orgânica através de plantas de cobertura para reter mais água na safra.',
  disclaimer: 'Laudo e diagnóstico demonstrativos. Não representam uma análise laboratorial ou avaliação agronômica real.',
}
export const rotations = [
  {
    id: 'current', tab: '1. Atual (Soja–Milho)',
    title: 'Rotação Atual: Soja no Verão → Milho Safrinha',
    description: 'Prática predominante nas regiões norte e oeste do Paraná.',
    protection: 'Moderada (janelas secas)', demand: 'Alta no florescimento do milho',
    risk: 'Risco de estiagem ou geada precoce na safrinha; menor volume de palhada para cobertura contínua durante a primavera.',
    evidence: 'Série temporal Landsat/MODIS indica rápida perda de umidade superficial nos meses de agosto e setembro antes da dessecação.',
  },
  {
    id: 'cover', tab: '2. Alternativa A (Braquiária)',
    title: 'Alternativa A: Soja no Verão → Braquiária',
    description: 'Exemplo de sucessão com planta de cobertura na entressafra.',
    protection: 'Alta (cobertura prolongada)', demand: 'Variável conforme estabelecimento',
    risk: 'Exige planejamento de implantação e dessecação. O manejo inadequado pode gerar competição por água com a cultura seguinte.',
    evidence: 'Exemplo ilustrativo: índices de vegetação Landsat/MODIS poderiam ajudar a acompanhar a permanência da cobertura. Não há imagens consultadas neste protótipo.',
  },
  {
    id: 'wheat', tab: '3. Alternativa B (Trigo)',
    title: 'Alternativa B: Soja no Verão → Trigo',
    description: 'Exemplo de sucessão com cereal de inverno e produção de palhada.',
    protection: 'Moderada a alta (palhada)', demand: 'Sensível no espigamento',
    risk: 'A viabilidade depende da janela de semeadura, do clima local e do manejo de doenças. Geadas e chuva na colheita podem afetar a produção.',
    evidence: 'Exemplo ilustrativo: precipitação e índices de vegetação poderiam apoiar o acompanhamento do ciclo. Não foram consultados dados de satélites.',
  },
]
export const rotationDisclaimer = 'Simulação baseada em séries históricas NASA e Embrapa Soja. Cada talhão requer validação do histórico de fertilidade e maquinário disponível.'
export const demoDisclaimer = 'Exemplos ilustrativos, sem consulta às fontes citadas ou validação científica. Não constituem recomendação agronômica.'

export const weatherAlert = {
  severity: 'Atenção (Risco Médio a Alto)',
  period: 'Próximas 24 horas.',
  property: 'Fazenda Boa Esperança — Talhões 02, 03 e 04.',
  precautions: [
    'Suspender aplicações foliares diante do risco de chuva intensa.',
    'Verificar curvas de nível e terraços para reduzir riscos de erosão.',
    'Evitar tráfego de máquinas pesadas em solo encharcado para reduzir compactação.',
  ],
  confidence: 'Probabilidade simulada de chuva: 70%. O horário, a intensidade e a distribuição da chuva podem variar entre os talhões. Em uma versão integrada, previsões meteorológicas e estimativas de precipitação NASA GPM/IMERG poderiam apoiar o acompanhamento. Neste protótipo, nenhuma fonte é consultada em tempo real.',
  disclaimer: 'Alerta e precauções ilustrativos para demonstração. Não representam um aviso meteorológico oficial ou orientação agronômica validada.',
}
export const analysisFields = [
  { name: 'ph', label: 'pH do solo', min: 0, max: 14, step: '0.1', initial: '5.8' },
  { name: 'organic', label: 'Matéria orgânica (%)', min: 0, max: 100, step: '0.1', initial: '2.7' },
  { name: 'moisture', label: 'Umidade (%)', min: 0, max: 100, step: '0.1', initial: '31' },
]
