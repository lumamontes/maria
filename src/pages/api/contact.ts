import type { APIRoute } from 'astro';

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

    // Log da mensagem (em produção, você enviaria por email ou salvaria no banco)
    console.log('Nova mensagem de contato recebida:', contactData);

    // Em produção, aqui você integraria com:
    // - Serviço de email (SendGrid, Mailgun, etc.)
    // - Banco de dados
    // - Sistema de CRM

    // Exemplo de como seria com um serviço de email:
    /*
    await sendEmail({
      to: 'contato@mariaclaraprudencio.com',
      from: 'noreply@mariaclaraprudencio.com',
      subject: `Nova mensagem: ${contactData.assunto}`,
      html: `
        <h2>Nova mensagem de contato</h2>
        <p><strong>Nome:</strong> ${contactData.nome}</p>
        <p><strong>Email:</strong> ${contactData.email}</p>
        <p><strong>Assunto:</strong> ${contactData.assunto}</p>
        ${contactData.organizacao ? `<p><strong>Organização:</strong> ${contactData.organizacao}</p>` : ''}
        <p><strong>Mensagem:</strong></p>
        <p>${contactData.mensagem.replace(/\n/g, '<br>')}</p>
        ${contactData.newsletter ? '<p><em>Interessado em receber newsletter</em></p>' : ''}
      `
    });
    */

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

// Handle preflight requests
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