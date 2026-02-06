export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    // For now, just return success
    // TODO: Add email sending (Resend, SendGrid, etc.)
    console.log('Contact form submission:', { name, email, message });

    // Send to David's email using fetch to a webhook or email service
    // Example: await sendEmail({ to: 'millerd79@gmail.com', from: email, subject: `Contact from ${name}`, body: message });

    return new Response(JSON.stringify({ success: true, message: 'Message received! I\'ll get back to you soon.' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
}
