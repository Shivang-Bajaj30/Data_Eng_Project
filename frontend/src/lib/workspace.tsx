import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { api } from './api'
import { demoClasses, demoNotes } from './demo'
import type { VaultNote } from './demo'
import type { StudyClass } from './auth'
type Context = {demo:boolean; setDemo:(value:boolean)=>void; saved:string[]; toggleSave:(id:string)=>void; notify:(message:string,tone?:string)=>void}
const WorkspaceContext=createContext<Context>(null!)
export function WorkspaceProvider({children}:{children:ReactNode}) {
 const [params]=useSearchParams(); const [demo,setDemoState]=useState(params.get('demo')==='true'||sessionStorage.getItem('nv-demo')==='true')
 const [saved,setSaved]=useState<string[]>(()=>{try{return JSON.parse(localStorage.getItem('nv-saved')||'[]')}catch{return []}})
 const [toast,setToast]=useState({message:'',tone:'info'})
 useEffect(()=>{if(!toast.message)return;const t=setTimeout(()=>setToast({message:'',tone:'info'}),4000);return()=>clearTimeout(t)},[toast])
 const notify=(message:string,tone='info')=>setToast({message,tone})
 const setDemo=(value:boolean)=>{sessionStorage.setItem('nv-demo',String(value));setDemoState(value)}
 const toggleSave=(id:string)=>{setSaved(v=>{const n=v.includes(id)?v.filter(x=>x!==id):[...v,id];localStorage.setItem('nv-saved',JSON.stringify(n));return n});notify(saved.includes(id)?'Removed from saved notes':'Added to your saved notes','success')}
 return <WorkspaceContext.Provider value={{demo,setDemo,saved,toggleSave,notify}}>{children}{toast.message&&<div className={`toast ${toast.tone}`} role="status">{toast.message}</div>}</WorkspaceContext.Provider>
}
export const useWorkspace=()=>useContext(WorkspaceContext)
export function useVault(){const {demo}=useWorkspace();return useQuery({queryKey:['vault',demo],queryFn:async()=>{if(demo)return {notes:demoNotes,classes:demoClasses};const [n,c]=await Promise.all([api.get<{notes:VaultNote[]}>('/notes'),api.get<{classes:StudyClass[]}>('/classes')]);return {notes:n.data.notes,classes:c.data.classes}},retry:1})}
