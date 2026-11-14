# Dados e fluxos demonstrativos do Ciclo

## Propriedades

O serviço `src/services/properties.js` salva uma estrutura versionada (`ciclo.properties.v1`) no localStorage: propriedades, seus talhões e o identificador da propriedade selecionada. Cada propriedade tem UUID; cada talhão tem um identificador próprio. A propriedade fictícia inicial tem ID reservado e é a única com análise, clima e recomendações de exemplo. Cadastros novos começam sem esses dados.

A leitura valida campos, estados, números, talhões e identificadores duplicados. Registros inválidos são ignorados com aviso. A leitura nunca sobrescreve o armazenamento. Erros de permissão/quota mantêm o estado em memória com aviso de que ele não sobreviverá ao recarregamento. A próxima seleção ou inclusão explícita tenta persistir novamente. Não há sincronização entre navegadores, contas ou abas.

Tarefas são compartilhadas entre dashboard e painel de planejamento, separadas por propriedade, durante a sessão. O formulário de nova análise continua sendo uma simulação: não grava laudos e não altera o diagnóstico. O cadastro de propriedades não tem essa limitação e é persistido localmente.

## Navegação e modais

Lavoura, Planejamento e Voz abrem painéis. Não há mais cálculo de scroll. Um único estado `modal` escolhe o conteúdo; abrir laudo, comparador ou tarefas substitui o painel anterior. O host de portal ocupa a janela do navegador; os painéis têm largura máxima de 640 px no mobile e 720 px nas demais faixas. O BottomSheet bloqueia a rolagem da dashboard, mantém o foco no diálogo e retorna ao acionador original após fechar, inclusive quando houve troca de painéis.

## Simulação climática

Implementação em `src/services/climate.js`; configurações e fixtures em `src/data/climateScenarios.js`. Nenhuma chamada a APIs, aleatoriedade ou probabilidade científica é usada.

Referência fixa: **2026-11-14**. A janela de curto prazo é configurável e atualmente cobre sete datas, de 14 a 20 de novembro, inclusive. Um intervalo só é classificado como previsão simulada se estiver inteiro nessa janela. Períodos anteriores, distantes ou que cruzam a janela são classificados como histórico sazonal simulado, com explicação. Limite demonstrativo: 366 dias inclusive.

| Dados fictícios | Regra de seleção | Temperatura | Acumulado ilustrativo |
| --- | --- | --- | --- |
| Modelo de curto prazo | Intervalo inteiro na janela configurada | 19–29 °C | 4 mm × dias |
| Histórico úmido | Início em outubro a março | 18–30 °C | 6 mm × dias |
| Histórico seco | Início em abril, maio ou setembro | 16–29 °C | 1 mm × dias |
| Histórico de inverno | Início em junho a agosto | 8–22 °C | 3 mm × dias |

Essas regras são roteiros para demonstrar a interface, **não uma climatologia validada da região da propriedade**. Não usamos município, coordenadas ou tipo de solo para inferir medições. Mesmo período e propriedade produzem o mesmo resultado. O histórico usa a estação do início do período: intervalos que cruzam estações precisam de segmentação em uma integração futura. As faixas históricas não são máximas/mínimas diárias; o acumulado não é previsão de eventos.

Chuva intensa, geada e granizo ficam cinza por insuficiência de dados apropriados. As cores de seca descrevem somente os cenários fictícios. A umidade de 31% é mostrada exclusivamente como o exemplo original da propriedade inicial, com referência fixa, nunca como previsão para o intervalo selecionado. Datas/resultados são preservados por propriedade entre aberturas do painel, durante a sessão.

Fontes futuras: serviço meteorológico operacional a definir para previsões; NASA POWER para histórico ambiental; NASA GPM/IMERG para observações de precipitação; NASA SMAP para observações de umidade do solo. As fontes NASA citadas não são tratadas como serviços de previsão operacional.

## Verificação

- `node tests/properties.test.mjs`: validação, UUIDs, recuperação, persistência e erros de armazenamento.
- `node tests/climate.test.mjs`: datas, janela configurável, cenários determinísticos e dados insuficientes.
- `node tests/dashboard.test.mjs`: renderização React no servidor, identidade selecionada e ausência de dados herdados.
- `npm run lint` e `npm run build`.

Os testes de renderização não executam cliques, foco, CSS ou localStorage de um navegador real. A revisão visual e os testes de teclado/toque em dispositivos móveis continuam manuais.


## Layout responsivo

A dashboard usa a rolagem normal do documento, largura de 100% e máximo de 1280 px, sem moldura ou escala artificial.

- Até 767 px: cards empilhados e navegação inferior fixa com safe area e espaço reservado no conteúdo.
- De 768 a 1023 px: grid de duas colunas; clima, assistente e tarefas ocupam a largura completa, enquanto solo e recomendação ficam lado a lado. A navegação vira uma faixa horizontal compacta e sticky acima dos cards.
- A partir de 1024 px: navegação lateral sticky e grid de duas colunas, com clima e assistente na primeira linha, solo e recomendação na segunda e tarefas na largura completa. A lista de tarefas pode usar duas colunas quando houver espaço.

A navegação é um único componente DOM, com os mesmos handlers e estados em todas as faixas. Regras internas dos cards usam suas próprias larguras. Os modais permanecem painéis inferiores no mobile/tablet e viram diálogos centralizados no desktop; conteúdo, foco, Escape e overlay são compartilhados.

O viewport usa `viewport-fit=cover`; safe areas são aplicadas no topo, nas laterais e na base. Alturas de viewport têm fallback `vh` e valor `dvh`. Campos usam pelo menos 16 px. Os BottomSheets bloqueiam a rolagem do documento preservando a posição e usam VisualViewport quando disponível para adaptar altura e posição ao teclado virtual. O conteúdo do painel permanece rolável.

Validação manual pendente: 320×568, 375×667, 390×844, 430×932, 768×1024, 1024×768, 1366×768 e 1920×1080. Conferir ausência de overflow horizontal, safe areas em retrato/paisagem, expansão da barra do Safari, foco dos campos, abertura/fechamento do teclado e restauração da posição após fechar ou trocar painéis. Não houve teste em iPhone real nesta etapa.
