// SVG fallback while the lucide-react package cannot be installed in this environment.
// Keep the same size/stroke API so the imports can be replaced by lucide-react.
const paths = {
 AlertTriangle:['M12 3 2 21h20L12 3Z','M12 9v5','M12 17v1'],
 ArrowRight:['M5 12h14','m12 5 7 7-7 7'], ChevronRight:['m9 18 6-6-6-6'], ChevronDown:['m6 9 6 6 6-6'], Plus:['M12 5v14','M5 12h14'], Check:['m20 6-11 11-5-5'],
 Cloud:['M20 16.2A4.5 4.5 0 0 0 18 7.5a6 6 0 0 0-11.4-1A5 5 0 0 0 6 16.5h14Z'],
 CloudRain:['M20 15a4 4 0 0 0-2-7.5A6 6 0 0 0 6.5 6 4.5 4.5 0 0 0 4 14','m8 16-1 4','m13 16-1 4','m18 16-1 4'],
 CloudSun:['M12 3v2','m5.6 5.6 1.4 1.4','M3 12h2','m5.6 18.4 1.4-1.4','m18.4 5.6-1.4 1.4','M9 14a4 4 0 1 1 7-4','M20 20a3 3 0 0 0 0-6 4 4 0 0 0-7.5-1 3.5 3.5 0 0 0 .5 7Z'],
 Sun:['M12 2v2','M12 20v2','m4.93 4.93 1.42 1.42','m17.65 17.65 1.42 1.42','M2 12h2','M20 12h2','m6.35 17.65-1.42 1.42','m19.07 4.93-1.42 1.42'],
 Mic:['M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z','M19 10v2a7 7 0 0 1-14 0v-2','M12 19v3','M8 22h8'],
 Sprout:['M7 20h10','M12 20v-8','M12 14C12 7 17 4 22 4c0 6-4 10-10 10Z','M12 16C12 10 8 7 2 7c0 6 4 9 10 9Z'],
 Wheat:['M2 22 16 8','M7 17c-4 0-5-4-4-7 4 0 6 2 4 7Z','M12 12c-4 0-5-4-4-7 4 0 6 2 4 7Z','M17 7c-2-3 0-6 4-6 0 4-1 6-4 6Z','M7 17c0-4 4-5 7-4 0 4-2 6-7 4Z','M12 12c0-4 4-5 7-4 0 4-2 6-7 4Z'],
 Bell:['M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9','M10 21h4'],
 CalendarDays:['M8 2v4','M16 2v4','M3 10h18','M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z'],
 ChartNoAxesColumnIncreasing:['M4 14h4v8H4Z','M10 9h4v13h-4Z','M16 3h4v19h-4Z'],
 MessageCircle:['M21 11.5a8.5 8.5 0 0 1-8.5 8.5 9 9 0 0 1-4-.9L3 21l1.9-5.5a9 9 0 0 1-.9-4 8.5 8.5 0 0 1 17 0Z'],
 Orbit:['M16 3a10 10 0 0 1 5 9','M21 16a10 10 0 0 1-9 5','M8 21a10 10 0 0 1-5-9','M3 8a10 10 0 0 1 9-5']
}
function Icon({name,size=24,...props}){return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name].map((d,i)=><path key={i} d={d}/>)}{name==='Sun'&&<circle cx="12" cy="12" r="4"/>}{name==='Orbit'&&<circle cx="12" cy="12" r="5"/>}</svg>}
export const ArrowRight=p=><Icon name="ArrowRight" {...p}/>
export const ChevronRight=p=><Icon name="ChevronRight" {...p}/>
export const ChevronDown=p=><Icon name="ChevronDown" {...p}/>
export const Plus=p=><Icon name="Plus" {...p}/>
export const Check=p=><Icon name="Check" {...p}/>
export const Cloud=p=><Icon name="Cloud" {...p}/>
export const CloudRain=p=><Icon name="CloudRain" {...p}/>
export const CloudSun=p=><Icon name="CloudSun" {...p}/>
export const Sun=p=><Icon name="Sun" {...p}/>
export const Mic=p=><Icon name="Mic" {...p}/>
export const Sprout=p=><Icon name="Sprout" {...p}/>
export const Wheat=p=><Icon name="Wheat" {...p}/>
export const Bell=p=><Icon name="Bell" {...p}/>
export const CalendarDays=p=><Icon name="CalendarDays" {...p}/>
export const ChartNoAxesColumnIncreasing=p=><Icon name="ChartNoAxesColumnIncreasing" {...p}/>
export const MessageCircle=p=><Icon name="MessageCircle" {...p}/>
export const Orbit=p=><Icon name="Orbit" {...p}/>

export const AlertTriangle=p=><Icon name="AlertTriangle" {...p}/>
