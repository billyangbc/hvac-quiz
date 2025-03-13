import { sendContactEmail } from '@/lib/email';
import { isTurnstileEnabled } from '@/lib/services/turnstile';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Create a dynamic schema based on whether Turnstile is enabled
const createContactSchema = (isTurnstile: boolean) => {
  const baseSchema = {
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    subject: z.string().min(5, 'Subject must be at least 5 characters'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
  };
  
  // Add turnstileToken validation only if Turnstile is enabled
  if (isTurnstile) {
    return z.object({
      ...baseSchema,
      turnstileToken: z.string().min(1, 'Invalid security verification'),
    });
  }
  
  // Otherwise, make turnstileToken optional
  return z.object({
    ...baseSchema,
    turnstileToken: z.string().optional(),
  });
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const isTurnstile = await isTurnstileEnabled();
    // Create schema based on current configuration
    const contactSchema = createContactSchema(isTurnstile);
    
    // Validate request body format
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return new NextResponse(
        JSON.stringify({ errors: result.error.flatten().fieldErrors }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Only validate Turnstile token if it's enabled
    if (isTurnstile) {
      const { turnstileToken } = result.data;
      const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for');

      const turnstileResponse = await fetch(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            secret: process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY,
            response: turnstileToken,
            remoteip: ip,
          }),
        }
      );

      const turnstileData = await turnstileResponse.json();

      if (!turnstileData.success) {
        return new NextResponse(
          JSON.stringify({ errors: { turnstileToken: ['Security verification failed'] } }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Send email using Brevo
    try {
      await sendContactEmail({
        toEmail: result.data.email,
        name: result.data.name,
        subject: result.data.subject,
        message: result.data.message
      });
    } catch (error) {
      console.error('Email sending failed:', error);
      return new NextResponse(
        JSON.stringify({ error: 'Failed to send email' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new NextResponse(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
