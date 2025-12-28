import { createClient } from '@/lib/supabase/server'
import DashboardClient from '@/components/DashboardClient'

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
  
  return <DashboardClient initialLeads={initialLeads} />
}