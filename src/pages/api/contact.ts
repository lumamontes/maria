export const prerender = false;
import type { APIRoute } from 'astro';
import { resend } from '@/lib/resend';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    
    const contactData = {
      nome: formData.get('nome') as string,
      email: formData.get('email') as string,
      assunto: formData.get('assunto') as string,
      organizacao: formData.get('organizacao') as string,
      mensagem: formData.get('mensagem') as string,
      newsletter: formData.get('newsletter') === 'on',
      timestamp: new Date().toISOString()
    };

    // Validação básica
    if (!contactData.nome || !contactData.email || !contactData.assunto || !contactData.mensagem) {
      return new Response(
        JSON.stringify({ error: 'Todos os campos obrigatórios devem ser preenchidos.' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactData.email)) {
      return new Response(
        JSON.stringify({ error: 'Por favor, insira um email válido.' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

      // Envio de email via Resend
      const toEmail = 'lumagoesmontes@gmail.com';
      const fromEmail = 'noreply@thetaharpia.com';
      const subject = `Maria, temos uma nova mensagem: ${contactData.assunto}`;
      const html = `
        <h2>Nova mensagem de contato recebida via website</h2>
        <ul>
          <li><strong>Nome:</strong> ${contactData.nome}</li>
          <li><strong>Email:</strong> ${contactData.email}</li>
          <li><strong>Assunto:</strong> ${contactData.assunto}</li>
          ${contactData.organizacao ? `<li><strong>Organização:</strong> ${contactData.organizacao}</li>` : ''}
          <li><strong>Mensagem:</strong><br>${contactData.mensagem.replace(/\n/g, '<br>')}</li>
        </ul>
        <p><small>Enviado em: ${new Date(contactData.timestamp).toLocaleDateString()}</small></p>
      `;

      try {
        const res = await resend.emails.send({
          to: toEmail,
          from: fromEmail,
          subject,
          html,
          replyTo: contactData.email,
        });
        console.log('Resend response:', res);
        if (res.error) {
          throw new Error(res.error.message || 'Erro ao enviar email');
        }
      } catch (err) {
        console.error('Erro ao enviar email via Resend:', err);
        return new Response(
          JSON.stringify({ error: 'Erro ao enviar email. Tente novamente mais tarde.' }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

    // Resposta de sucesso
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Mensagem enviada com sucesso! Entraremos em contato em até 48 horas.' 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Erro ao processar formulário de contato:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Erro interno do servidor. Tente novamente em alguns instantes.' 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};