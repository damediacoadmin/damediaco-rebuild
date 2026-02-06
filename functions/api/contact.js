export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone') || 'Not provided';
    const businessType = formData.get('businessType') || 'Not specified';
    const message = formData.get('message');

    // Honeypot check
    if (formData.get('website')) {
      return new Response(JSON.stringify({ success: true, message: 'Message received!' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      });
    }

    // Get Resend API key from environment variable
    const resendApiKey = context.env.RESEND_API_KEY;
    
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Email service not configured. Please contact directly at hello@damediaco.com' 
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500
      });
    }

    // Send email via Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: 'millerd79@gmail.com',
        reply_to: email,
        subject: `New Contact: ${name} - ${businessType}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Business Type:</strong> ${businessType}</p>
          <h3>Message:</h3>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `
      })
    });

    if (!emailResponse.ok) {
      const error = await emailResponse.text();
      console.error('Resend API error:', error);
      throw new Error('Failed to send email');
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Message sent! I\'ll get back to you within 24 hours.' 
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to send message. Please email hello@damediaco.com directly.' 
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
}
