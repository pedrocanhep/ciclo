# 🌱 Ciclo

**Inteligência climática e planejamento agrícola ao alcance do produtor.**

![NASA Space Apps Challenge 2026](https://img.shields.io/badge/NASA_Space_Apps_Challenge-2026-006d97?style=flat)
![React](https://img.shields.io/badge/React-19-347a91?style=flat)
![Vite](https://img.shields.io/badge/Vite-8-646cff?style=flat)
![Status: Protótipo funcional](https://img.shields.io/badge/Status-Prot%C3%B3tipo_funcional-008b60?style=flat)

## Sobre o projeto

O **Ciclo** é uma aplicação web desenvolvida para o **NASA Space Apps Challenge 2026**, no contexto do desafio **“Field Shift: Adapting Farms with NASA Data”**.

O projeto busca auxiliar agricultores na interpretação das condições climáticas, no acompanhamento da saúde do solo e no planejamento de rotações de culturas. A proposta é aproximar as observações da Terra das decisões do produtor, apresentando informações técnicas em uma interface acessível.

## O problema

O planejamento da lavoura precisa lidar com desafios que se combinam:

- Eventos climáticos extremos que dificultam a definição de períodos de plantio e manejo.
- Dificuldade de acesso e interpretação de informações técnicas.
- Degradação do solo e necessidade de conservar água e cobertura vegetal.
- Necessidade de organizar culturas, análises e tarefas ao longo da safra.
- Conectividade limitada no campo, que dificulta a consulta a ferramentas digitais.

## Nossa solução

O Ciclo reúne clima, propriedades, solo e planejamento em uma dashboard responsiva para celulares, tablets e computadores. Painéis interativos permitem consultar informações e comparar estratégias sem sair da aplicação.

A evolução prevista inclui integrar observações da NASA e serviços meteorológicos adequados, além de oferecer suporte ao funcionamento offline e a interações reais por voz. **O protótipo atual utiliza dados fictícios e não consulta APIs em tempo real.** O armazenamento local das propriedades já existe, mas não equivale a suporte completo ao funcionamento offline.

## 📱 Prévia da aplicação

![Dashboard do Ciclo](docs/images/dashboard.png)

> **Captura pendente:** adicionar uma captura real da aplicação em `docs/images/dashboard.png` antes da publicação deste README. A pasta está preparada; nenhuma imagem artificial foi incluída.

## Funcionalidades

| Recurso | Disponível no protótipo | Limitação atual |
| --- | --- | --- |
| Dashboard climático | Temperatura, precipitação, umidade, vento e previsão visual. | Valores demonstrativos, sem atualização meteorológica real. |
| Alertas de riscos meteorológicos | Painel de alerta, precauções e explicação de confiabilidade. | Alerta simulado, sem monitoramento ou emissão automática. |
| Consulta climática por período | Seleção e validação de datas, indicadores e separação entre previsão próxima e histórico sazonal. | Cenários fictícios determinísticos; não são previsões ou estatísticas regionais validadas. |
| Cadastro e seleção de propriedades | Formulário, seleção pelo card e persistência com `localStorage`. | Dados salvos no navegador, sem sincronização com servidor. |
| Acompanhamento do solo | Indicadores de pH, matéria orgânica, umidade e laudo demonstrativo. | Nova análise é um fluxo simulado e não grava laudos. |
| Comparação de rotações | Alternância entre estratégias e apresentação de objetivos e restrições. | Exemplos ilustrativos, sem recomendação agronômica validada. |
| Planejamento de tarefas | Adição e conclusão de tarefas, com resumo no planejamento. | Estado separado por propriedade e mantido apenas durante a sessão. |
| Assistente agrícola por voz e texto | Campo de texto, sugestões e painel com transcrição e resposta de exemplo. | Sem captura de áudio, reconhecimento de voz ou inteligência artificial integrada. |

Os dados originais de solo e clima estão associados apenas à propriedade fictícia inicial. Novas propriedades apresentam estados vazios quando não há informações cadastradas.

**Previsto para próximas etapas:** integrações reais, validação das informações agronômicas, persistência em backend, suporte offline e assistente com voz e texto conectado a serviços apropriados.

## Tecnologias

- **React 19 e React DOM:** componentes e estado da interface.
- **JavaScript e JSX:** implementação da aplicação.
- **Vite 8:** ambiente de desenvolvimento e build.
- **CSS Modules e CSS puro:** estilos, grid e responsividade.
- **SVGs locais:** ícones da interface, sem dependência de uma biblioteca de ícones.
- **localStorage:** persistência das propriedades e da seleção ativa.
- **ESLint:** verificação estática do código.
- **Node.js:** execução de testes de lógica e renderização React.

## Como executar

Com Git, Node.js e npm instalados:

```bash
git clone https://github.com/pedrocanhep/ciclo.git
cd ciclo
npm install
npm run dev
```

Abra o endereço informado pelo Vite no terminal. O protótipo funciona sem backend e sem chaves de API.

Para verificar o código e gerar a versão de produção:

```bash
npm run lint
npm run build
```

Para visualizar o build localmente:

```bash
npm run preview
```

## Fontes científicas

As fontes abaixo fazem parte da **arquitetura prevista para integração futura**. Nenhuma delas está conectada ao protótipo atual.

| Fonte | Papel pretendido no Ciclo |
| --- | --- |
| **NASA POWER** | Consulta ao histórico de temperatura, precipitação e outras variáveis ambientais para análises sazonais. |
| **NASA GPM/IMERG** | Uso de observações e estimativas de precipitação para acompanhar a distribuição das chuvas. |
| **NASA SMAP** | Uso de observações de umidade do solo para contextualizar as condições da lavoura. |

Essas observações e séries históricas não substituem uma previsão meteorológica operacional. A consulta de curto prazo deverá ser complementada por serviços meteorológicos apropriados. Médias históricas não devem ser interpretadas como previsões diárias, nem como garantia de ocorrência ou ausência de eventos extremos.

## Estado atual

> O Ciclo encontra-se em desenvolvimento. Parte das informações meteorológicas, dos indicadores de solo e das recomendações exibidas são demonstrativas e não devem ser utilizadas como orientação agronômica operacional.

Nesta versão, os valores meteorológicos e os laudos apresentados são fictícios. A interface demonstra os fluxos de uso; não realiza diagnóstico agronômico ou previsão operacional.

Os cenários, as limitações e os comandos de teste estão documentados em [Dados e fluxos demonstrativos](docs/demonstracao.md).

## Créditos

Projeto desenvolvido para o **NASA Space Apps Challenge 2026**, no contexto do desafio **“Field Shift: Adapting Farms with NASA Data”**.

A menção à NASA e às suas fontes de dados contextualiza a proposta do projeto. Não implica desenvolvimento oficial, patrocínio ou endosso da NASA.
