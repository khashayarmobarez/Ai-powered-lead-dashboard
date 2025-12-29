'use client'

import { useState } from 'react'

export default function LeadForm() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    company: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'form',
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage('Lead captured! Check the dashboard.')
        setFormData({ email: '', name: '', company: '' })
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Network error. Please try again.')
      console.log(error)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-foreground/5 border border-foreground/10 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-foreground mb-4">Capture Lead</h2>
      
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
            placeholder="john@example.com"
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
            placeholder="John Doe"
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
            placeholder="Acme Corp"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn btn-primary w-full"
        >
          {status === 'loading' ? 'Capturing...' : 'Capture Lead'}
        </button>

        {status === 'success' && (
          <div className="alert alert-success">
            <span>{message}</span>
          </div>
        )}

        {status === 'error' && (
          <div className="alert alert-error">
            <span>{message}</span>
          </div>
        )}
      </form>
    </div>
  )
}