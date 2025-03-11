'use server';

/**
 * Verifies a Cloudflare Turnstile token with the Cloudflare API
 * @param token The token to verify
 * @returns A boolean indicating whether the token is valid
 */
export async function verifyTurnstileToken(token: string): Promise<boolean> {
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
