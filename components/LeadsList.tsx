import type { Lead } from '@/types/leads'

interface Props {
  leads: Lead[]
}

export default function LeadsList({ leads }: Props) {
  if (leads.length === 0) {
    return (
      <div className="bg-foreground/5 border border-foreground/10 rounded-lg p-12 text-center">
        <p className="text-foreground/60">No leads yet. Start capturing data!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {leads.map((lead) => (
        <div
          key={lead.id}
          className="bg-foreground/5 border border-foreground/10 rounded-lg p-4 hover:border-accent transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-foreground">
                  {lead.name || 'Unknown'}
                </h3>
                <span className={`badge badge-sm ${getStatusColor(lead.status)}`}>
                  {lead.status}
                </span>
                <span className="badge badge-sm badge-outline">
                  {lead.source}
                </span>
              </div>
              <p className="text-sm text-foreground/60 mt-1">{lead.email}</p>
              {lead.company && (
                <p className="text-sm text-foreground/80 mt-1">{lead.company}</p>
              )}
            </div>
            
            {lead.ai_score !== null && (
              <div className="text-right">
                <div className="text-2xl font-bold text-accent">
                  {lead.ai_score}
                </div>
                <div className="text-xs text-foreground/60">AI Score</div>
              </div>
            )}
          </div>
          
          {lead.ai_reasoning && (
            <p className="text-sm text-foreground/70 mt-3 italic">
              {lead.ai_reasoning}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

function getStatusColor(status: Lead['status']) {
  switch (status) {
    case 'new':
      return 'badge-info'
    case 'contacted':
      return 'badge-warning'
    case 'qualified':
      return 'badge-secondary'
    case 'converted':
      return 'badge-success'
  }
}