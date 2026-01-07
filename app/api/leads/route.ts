import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, company, source = 'form' } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Insert lead into Supabase
    const { data, error } = await supabase
      .from('Leads')
      .insert([
        {
          email,
          name,
          company,
          source,
          status: 'new',
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Trigger n8n webhook for enrichment
    if (process.env.N8N_WEBHOOK_URL && data) {
      fetch(process.env.N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: data.id,           // ← Must match your webhook pinned data structure
          email: data.email,
          name: data.name,
          company: data.company,
        }),
      }).catch((err) => {
        console.error('n8n webhook error:', err);
        // Don't throw - enrichment failure shouldn't break lead creation
      });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { error: 'Failed to create lead' , errorDetails: error },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
    try {
      const body = await request.json()
      const { id, email, name, company, status } = body
  
      if (!id) {
        return NextResponse.json(
          { error: 'Lead ID is required' },
          { status: 400 }
        )
      }
  
      const supabase = await createClient()
  
      const updateData: Record<string, unknown> = {}
      if (email !== undefined) updateData.email = email
      if (name !== undefined) updateData.name = name
      if (company !== undefined) updateData.company = company
      if (status !== undefined) updateData.status = status
  
      const { data, error } = await supabase
        .from('Leads')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()
  
      if (error) {
        console.error('Supabase update error:', error)
        return NextResponse.json(
          { error: 'Failed to update lead' },
          { status: 500 }
        )
      }
  
      return NextResponse.json({ success: true, lead: data })
    } catch (error) {
      console.error('API error:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }


export async function DELETE(request: Request) {
  try {
      const { searchParams } = new URL(request.url)
      const id = searchParams.get('id')

      if (!id) {
      return NextResponse.json(
          { error: 'Lead ID is required' },
          { status: 400 }
      )
      }

      const supabase = await createClient()

      const { error } = await supabase
      .from('Leads')
      .delete()
      .eq('id', id)

      if (error) {
      console.error('Supabase delete error:', error)
      return NextResponse.json(
          { error: 'Failed to delete lead' },
          { status: 500 }
      )
      }

      return NextResponse.json({ success: true })
  } catch (error) {
      console.error('API error:', error)
      return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
      )
  }
}