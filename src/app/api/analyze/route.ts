import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { resourceType, summary, patientId, status, fhirVersion } = body

    // Validate required fields
    if (!resourceType || !patientId) {
      return NextResponse.json(
        { error: 'Missing required fields: resourceType and patientId are required' },
        { status: 400 }
      )
    }

    // Get OpenAI API key from environment
    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Prepare the prompt for OpenAI
    const prompt = `Analyze this healthcare resource and provide a brief, formal analysis in 2-3 sentences:

Resource Type: ${resourceType}
Patient ID: ${patientId}
Processing Status: ${status}
FHIR Version: ${fhirVersion || 'Not specified'}
Resource Summary: ${summary || 'Not provided'}

Please provide a professional analysis that describes the resource's clinical significance, processing status, and any relevant insights for healthcare professionals.`

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a healthcare data analyst specializing in FHIR resources. Provide concise, professional analysis of healthcare resources.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.3
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('OpenAI API error:', errorData)
      return NextResponse.json(
        { error: 'Failed to generate AI analysis' },
        { status: 500 }
      )
    }

    const data = await response.json()
    const analysis = data.choices[0]?.message?.content?.trim() || 'Analysis unavailable'

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Internal server error during analysis' },
      { status: 500 }
    )
  }
} 