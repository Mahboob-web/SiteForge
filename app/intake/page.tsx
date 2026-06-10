import { Suspense } from 'react'
import IntakeForm from './IntakeForm'

export default function IntakePage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight:'100vh', background:'#0a1a10', display:'flex',
        alignItems:'center', justifyContent:'center',
        fontFamily:'Outfit, sans-serif', color:'rgba(255,255,255,0.4)', fontSize:16 }}>
        Loading your intake form...
      </div>
    }>
      <IntakeForm />
    </Suspense>
  )
}
