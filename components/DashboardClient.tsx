'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Lead, DashboardStats } from '@/types/leads'
import StatsCards from '@/components/StatsCards'
import LeadsList from '@/components/LeadsList'

interface Props {
  initialLeads: Lead[]
}

export default function DashboardClient({ initialLeads }: Props) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const supabase = createClient()

  const fetchLeads = async () => {
    setIsRefreshing(true)
    try {
      const { data, error } = await supabase
        .from('Leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (!error && data) {
        setLeads(data)
      }
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setIsRefreshing(false)
    }
  }


  useEffect(() => {
    const channel = supabase
      .channel('leads-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Leads',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setLeads((prev) => [payload.new as Lead, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setLeads((prev) =>
              prev.map((lead) =>
                lead.id === payload.new.id ? (payload.new as Lead) : lead
              ) 
            )
          } else if (payload.eventType === 'DELETE') {
            setLeads((prev) => prev.filter((lead) => lead.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const stats: DashboardStats = {
    total: leads.length,
    new: leads.filter((l) => l.status === 'new').length,
    contacted: leads.filter((l) => l.status === 'contacted').length,
    qualified: leads.filter((l) => l.status === 'qualified').length,
    converted: leads.filter((l) => l.status === 'converted').length,
    avgScore: leads.length
      ? Math.round(
          leads.reduce((sum, l) => sum + (l.ai_score || 0), 0) / leads.length
        )
      : 0,
  }

  return (
    <div className="min-h-[75vh] bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-foreground">Lead Forge</h1>
          <button
            onClick={fetchLeads}
            disabled={isRefreshing}
            className="btn btn-sm btn-outline"
          >
            {isRefreshing ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
          </button>
        </div>
        <StatsCards stats={stats} />
        <LeadsList leads={leads} onRefresh={fetchLeads} />
      </div>
    </div>
  )
}