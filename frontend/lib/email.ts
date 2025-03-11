type SendContactEmailParams = {
  toEmail: string;
  name: string;
  subject: string;
  message: string;
};

export async function sendContactEmail(params: SendContactEmailParams) {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    throw new Error('BREVO_API_KEY environment variable is required');
  }

  const data = {
    sender: {
      name: "HVAC Pro contact",
      email: process.env.EMAIL_FROM || "hvacprobooster@gmail.com"
    },
    to: [{
      name: "HVAC Pro Booster",
      email: process.env.EMAIL_CONTACT || "info@hvacprobooster.com"
    }],
    replyTo: {
      email: params.toEmail,
      name: params.name
    },
    subject: params.subject,
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a365d;">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${params.name}</p>
        <p><strong>Email:</strong> ${params.toEmail}</p>
        <p><strong>Subject:</strong> ${params.subject}</p>
        <p><strong>Message:</strong></p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
          ${params.message.replace(/\n/g, '<br>')}
        </div>
      </div>
    `,
    textContent: `
      New Contact Form Submission
      ----------------------------
      Name: ${params.name}
      Email: ${params.toEmail}
      Subject: ${params.subject}
      Message:
      ${params.message}
    `
  };

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Brevo API error: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    const responseData = await response.json();
    return { success: true, messageId: responseData.messageId };
  } catch (error) {
    console.error('Brevo API error:', error);
    throw new Error('Failed to send email');
  }
}
