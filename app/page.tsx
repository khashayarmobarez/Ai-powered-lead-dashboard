import { createClient } from '@/lib/supabase/server'
import DashboardClient from '@/components/DashboardClient'
import LeadForm from '@/components/LeadForm'

export const dynamic = 'force-dynamic'

async function getLeads() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('Leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)
  
  if (error) {
    console.log('Error fetching leads:', error)
    return []
  }
  
  return data
}

export default async function Dashboard() {
  const initialLeads = await getLeads()
  
  return (
    <div className=' mb-4'>
      <DashboardClient initialLeads={initialLeads} />
      <LeadForm />
    </div>
  )
}