import type { DashboardStats } from '@/types/leads'

interface Props {
  stats: DashboardStats
}

export default function StatsCards({ stats }: Props) {
  const cards = [
    { label: 'Total Leads', value: stats.total, color: 'bg-accent' },
    { label: 'New', value: stats.new, color: 'bg-info' },
    { label: 'Contacted', value: stats.contacted, color: 'bg-warning' },
    { label: 'Qualified', value: stats.qualified, color: 'bg-secondary' },
    { label: 'Converted', value: stats.converted, color: 'bg-success' },
    { label: 'Avg AI Score', value: stats.avgScore, color: 'bg-accent' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-foreground/5 border border-foreground/10 rounded-lg p-4"
        >
          <div className="text-sm text-foreground/60 mb-1">{card.label}</div>
          <div className="text-3xl font-bold text-foreground">{card.value}</div>
        </div>
      ))}
    </div>
  )
}