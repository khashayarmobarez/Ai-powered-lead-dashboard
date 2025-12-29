'use client'

import { useState } from 'react'
import type { Lead } from '@/types/leads'
import EditLeadModal from './EditLeadModal'

interface Props {
  leads: Lead[]
}

export default function LeadsList({ leads }: Props) {
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return

    setDeletingId(id)

    try {
      const response = await fetch(`/api/leads?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        alert('Failed to delete lead')
      }
    } catch (error) {
      alert('Network error. Please try again.')
      console.log(error)
    } finally {
      setDeletingId(null)
    }
  }

  if (leads.length === 0) {
    return (
      <div className="bg-foreground/5 border border-foreground/10 rounded-lg p-12 text-center">
        <p className="text-foreground/60">No leads yet. Start capturing data!</p>
      </div>
    )
  }

  return (
    <>
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

              <div className="flex items-center gap-2">
                {lead.ai_score !== null && (
                  <div className="text-right mr-4">
                    <div className="text-2xl font-bold text-accent">
                      {lead.ai_score}
                    </div>
                    <div className="text-xs text-foreground/60">AI Score</div>
                  </div>
                )}

                <button
                  onClick={() => setEditingLead(lead)}
                  className="btn btn-sm btn-ghost"
                  title="Edit lead"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>

                <button
                  onClick={() => handleDelete(lead.id)}
                  disabled={deletingId === lead.id}
                  className="btn btn-sm btn-ghost text-error"
                  title="Delete lead"
                >
                  {deletingId === lead.id ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {lead.ai_reasoning && (
              <p className="text-sm text-foreground/70 mt-3 italic">
                {lead.ai_reasoning}
              </p>
            )}
          </div>
        ))}
      </div>

      {editingLead && (
        <EditLeadModal
          lead={editingLead}
          onClose={() => setEditingLead(null)}
          onSuccess={() => setEditingLead(null)}
        />
      )}
    </>
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