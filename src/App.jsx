import { useCallback, useState } from 'react'
import { Header, WeatherCard, CicloAssistant, SoilAnalysis, CropRecommendation, MonthlyTasks, BottomNavigation } from './components/Dashboard'
import { VoiceAssistant, SoilReport, RotationComparator, WeatherAlert, ForecastDetails, NewSoilAnalysis } from './components/Panels'
import { FarmPanel, PlanningPanel, TasksPanel, PropertyManager, ClimatePeriodPanel } from './components/ManagementPanels'
import AppStateProvider from './state/AppStateProvider'
import { useAppState } from './state/useAppState'
import styles from './App.module.css'

function DashboardApp() {
  const [modal, setModal] = useState(null)
  const [activeSection, setActiveSection] = useState(null)
  const [periods, setPeriods] = useState({})
  const { property, storageMessage } = useAppState()
  const closeModal = useCallback(() => setModal(null), [])
  const openModal = useCallback(name => setModal(name), [])
  const period = Object.hasOwn(periods, property.id) ? periods[property.id] : { draft: { start: '', end: '' }, result: null }
  function updatePeriod(update) {
    setPeriods(current => ({ ...current, [property.id]: { ...(Object.hasOwn(current, property.id) ? current[property.id] : period), ...update } }))
  }
  function navigate(section) {
    setActiveSection(section)
    setModal(section === 'soil' ? 'farm' : 'planning')
  }
  const panels = {
    voice: <VoiceAssistant onClose={closeModal} />,
    soil: <SoilReport onClose={closeModal} />,
    rotation: <RotationComparator onClose={closeModal} />,
    alert: <WeatherAlert onClose={closeModal} />,
    forecast: <ForecastDetails onClose={closeModal} onOpenPeriod={() => openModal('period')} />,
    property: <PropertyManager onClose={closeModal} />,
    'new-analysis': <NewSoilAnalysis onClose={closeModal} />,
    farm: <FarmPanel onClose={closeModal} onOpen={openModal} />,
    planning: <PlanningPanel onClose={closeModal} onOpen={openModal} />,
    tasks: <TasksPanel onClose={closeModal} />,
    period: <ClimatePeriodPanel onClose={closeModal} draft={period.draft} onDraftChange={draft => updatePeriod({ draft })} result={period.result} onResult={result => updatePeriod({ result })} />,
  }
  return <>
    <div id="dashboard" className={styles.app}>
      <div className={styles.headerRegion}>
        <Header onOpenAlert={() => openModal('alert')} onOpenProperty={() => openModal('property')} />
      </div>
      <div className={styles.workspace}>
        <BottomNavigation onOpenVoice={() => openModal('voice')} onNavigate={navigate} activeSection={activeSection} />
        <main className={styles.content}>
          {storageMessage && <p role="alert" className={styles.demo}>{storageMessage}</p>}
          <div className={`${styles.slot} ${styles.weather}`}><WeatherCard onOpenForecast={() => openModal('forecast')} /></div>
          <div className={`${styles.slot} ${styles.assistant}`}><CicloAssistant onOpenVoice={() => openModal('voice')} /></div>
          <div className={`${styles.slot} ${styles.soil}`}><SoilAnalysis onOpenDetails={() => openModal('soil')} onNewAnalysis={() => openModal('new-analysis')} /></div>
          <div className={`${styles.slot} ${styles.crop}`}><CropRecommendation onOpenComparison={() => openModal('rotation')} /></div>
          <div className={`${styles.slot} ${styles.tasks}`}><MonthlyTasks key={property.id} /></div>
        </main>
      </div>
    </div>
    <div id="modal-root" className={styles.modalRoot} />
    {modal && <div key={modal}>{panels[modal]}</div>}
  </>
}
export default function App() {
  return <AppStateProvider><DashboardApp /></AppStateProvider>
}
