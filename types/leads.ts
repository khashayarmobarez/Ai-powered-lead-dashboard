export interface Lead {
    id: string
    email: string
    name: string | null
    company: string | null
    source: 'x' | 'linkedin' | 'form'
    raw_data: Record<string, unknown> | null
    enrichment_status: 'pending' | 'enriched' | 'failed'
    enriched_data: EnrichedData | null
    ai_score: number | null
    ai_reasoning: string | null
    status: 'new' | 'contacted' | 'qualified' | 'converted'
    created_at: string
    updated_at: string
  }
  
  export interface EnrichedData {
    phone?: string
    linkedin?: string
    company_size?: string
    industry?: string
    [key: string]: unknown
  }
  
  export interface DashboardStats {
    total: number
    new: number
    contacted: number
    qualified: number
    converted: number
    avgScore: number
  }