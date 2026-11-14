import { useRef, useState } from 'react'
import { AppStateContext } from './useAppState'
import { createProperty, readProperties, saveProperties, hasDemoData } from '../services/properties'
import { dashboard } from '../data/dashboard'

export default function AppStateProvider({ children }) {
  const [state, setState] = useState(() => {
    try { return readProperties(window.localStorage) }
    catch { return readProperties({ getItem() { throw new Error('Indisponível') } }) }
  })
  const returnFocusRef = useRef(null)
  const [propertyDraft, setPropertyDraft] = useState(null)
  const [tasksByProperty, setTasksByProperty] = useState({})
  const property = state.properties.find(item => item.id === state.selectedId)
  const tasks = Object.hasOwn(tasksByProperty, property.id) ? tasksByProperty[property.id] : hasDemoData(property) ? dashboard.tasks.items : []
  function commit(next) {
    let storageMessage
    try { storageMessage = saveProperties(window.localStorage, next) }
    catch { storageMessage = 'Armazenamento indisponível: alterações apenas nesta sessão.' }
    setState({ ...next, storageMessage })
    return !storageMessage
  }
  function selectProperty(id) {
    if (state.properties.some(item => item.id === id)) commit({ ...state, selectedId: id })
  }
  function addProperty(values) {
    const added = createProperty(values)
    return commit({ ...state, properties: [...state.properties, added], selectedId: added.id })
  }
  function setTasks(next) {
    setTasksByProperty(current => ({ ...current, [property.id]: next }))
  }
  return <AppStateContext.Provider value={{ ...state, property, tasks, setTasks, selectProperty, addProperty, returnFocusRef, propertyDraft, setPropertyDraft }}>{children}</AppStateContext.Provider>
}
