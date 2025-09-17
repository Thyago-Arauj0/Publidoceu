import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const perguntas = [
  { id: 1, pergunta: "Qual o seu nome completo?" },
  { id: 2, pergunta: "Qual o seu e-mail?" },
  { id: 3, pergunta: "Qual o seu telefone?" },
  { id: 4, pergunta: "O que você deseja solicitar?" },
  { id: 5, pergunta: "Descreva o que você precisa com o máximo de detalhes:" },
  { id: 6, pergunta: "Para quando você precisa?" },
  { id: 7, pergunta: "Você tem um orçamento estimado?" },
  { id: 8, pergunta: "Onde você está localizado?" },
  { id: 9, pergunta: "Como nos encontrou?" }
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const respostas: string[] = body.respostas;

    if (!respostas || !Array.isArray(respostas)) {
      return NextResponse.json({ error: 'Respostas inválidas.' }, { status: 400 });
    }

    const corpoEmail = `
      <h3>Novo formulário de contato recebido</h3>
      <ul>
        ${perguntas.map((pergunta, index) => `
          <li>
            <strong>${pergunta.pergunta}</strong><br>
            ${respostas[index] || 'Não informado'}
          </li>
        `).join('')}
      </ul>
      <p>Enviado em: ${new Date().toLocaleString()}</p>
    `;

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.error('Variáveis de ambiente do SMTP não configuradas');
      return NextResponse.json({ error: 'Configuração do servidor incompleta' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });

    await transporter.sendMail({
      from: `"Formulário do Site" <${process.env.SMTP_USER}>`,
      to: process.env.EMAIL_DESTINO || 'publidoceu@gmail.com',
      subject: 'Nova submissão de formulário',
      html: corpoEmail,
      text: corpoEmail.replace(/<[^>]*>?/gm, '')
    });

    return NextResponse.json({ success: true, message: 'Formulário enviado com sucesso' });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Falha no envio do formulário', details: error instanceof Error ? error.message : 'Erro desconhecido' }, { status: 500 });
  }
}
