'use client'

import { useState } from 'react'
import type { Lead } from '@/types/leads'

interface Props {
  lead: Lead
  onClose: () => void
  onSuccess: () => void
  onRefresh: () => void
}

export default function EditLeadModal({ lead, onClose, onSuccess, onRefresh }: Props) {
  const [formData, setFormData] = useState({
    name: lead.name || '',
    email: lead.email,
    company: lead.company || '',
    status: lead.status,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: lead.id,
          ...formData,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        onRefresh()
        onSuccess()
        onClose()
      } else {
        setError(data.error || 'Failed to update lead')
      }
    } catch (err) {
      setError('Network error. Please try again.')
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-foreground/10 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-foreground mb-4">Edit Lead</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1">
              Company
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Lead['status'] })}
              className="select select-bordered w-full"
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
            </select>
          </div>

          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline flex-1"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-1"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}