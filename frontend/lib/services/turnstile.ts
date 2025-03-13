'use server';

/**
 * Checks if Cloudflare Turnstile is enabled based on environment variable
 * @returns A boolean indicating whether Turnstile is enabled
 */
export async function isTurnstileEnabled(): Promise<boolean> {
  return process.env.CLOUDFLARE_TURNSTILE === 'true';
}

/**
 * Verifies a Cloudflare Turnstile token with the Cloudflare API
 * @param token The token to verify
 * @returns A boolean indicating whether the token is valid or true if Turnstile is disabled
 */
export async function verifyTurnstileToken(token: string): Promise<boolean> {
  // If Turnstile is disabled, always return true
  if (!isTurnstileEnabled()) {
    return true;
  }
  
  try {
    const formData = new FormData();
    formData.append('secret', process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY || '');
    formData.append('response', token);

    const result = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        body: formData,
      }
    );

    const outcome = await result.json();
    return outcome.success;
  } catch (error) {
    console.error('Error verifying Turnstile token:', error);
    return false;
  }
}
