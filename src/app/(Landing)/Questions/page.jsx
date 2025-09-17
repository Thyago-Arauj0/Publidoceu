"use client"

import { useState } from "react"

const perguntas = [
  {
    id: 1,
    pergunta: "Qual o seu nome completo?",
    tipo: "texto",
    obrigatorio: true,
    validacao: (valor) => valor.trim().split(' ').length >= 2 || "Por favor, informe seu nome completo."
  },
  {
    id: 2,
    pergunta: "Qual o seu e-mail?",
    tipo: "email",
    obrigatorio: true,
    validacao: (valor) => /\S+@\S+\.\S+/.test(valor) || "Por favor, informe um e-mail válido."
  },
  {
    id: 3,
    pergunta: "Qual o seu telefone?",
    tipo: "telefone",
    obrigatorio: false,
    placeholder: "(11) 99999-9999",
    validacao: (valor) => valor.trim() === "" || /^\d+$/.test(valor) ||  "Formato de telefone inválido."
  },
  {
    id: 4,
    pergunta: "O que você deseja solicitar?",
    tipo: "opcoes",
    obrigatorio: true,
    opcoes: ["Custo", "Serviço", "Consultoria", "Outro"],
  },
  {
    id: 5,
    pergunta: "Para quando você precisa?",
    tipo: "opcoes",
    obrigatorio: true,
    opcoes: ["Urgente (até 1 semana)", "Até 1 mês", "1-3 meses", "3-6 meses", "Sem pressa"],
  },
  {
    id: 6,
    pergunta: "Você tem um orçamento estimado?",
    tipo: "opcoes",
    obrigatorio: false,
    opcoes: [
      "A partir de R$ 500,00",
      "R$ 1.000,00 - R$ 5.000,00",
      "R$ 5.000,00 - R$ 15.000,00",
      "R$ 15.000,00 - R$ 30.000,00",
      "Acima de R$ 30.000,00",
      "Prefiro não informar",
    ],
  },
  {
    id: 7,
    pergunta: "Onde você está localizado?",
    tipo: "texto",
    obrigatorio: false,
    placeholder: "Cidade, Estado",
  },
]

export default function Questions() {
  const [perguntaAtual, setPerguntaAtual] = useState(0)
  const [respostas, setRespostas] = useState(new Array(perguntas.length).fill(""))
  const [finalizado, setFinalizado] = useState(false)
  const [animando, setAnimando] = useState(false)
  const [erro, setErro] = useState("")

  const pergunta = perguntas[perguntaAtual]
  const respostaAtual = respostas[perguntaAtual] || ""

  const handleResposta = (valor) => {
    const novasRespostas = [...respostas]
    novasRespostas[perguntaAtual] = valor
    setRespostas(novasRespostas)
  }

  const podeAvancar = () => {
    if (!pergunta.obrigatorio && respostaAtual.trim() === ""){
      setErro("")
      return true
    }

    if(respostaAtual.trim() === ""){
      setErro("Este campo é obrigatório!")
      return false
    }

    if(pergunta.validacao){
      const validacao = pergunta.validacao(respostaAtual)
      if(validacao !== true){
        setErro(validacao)
        return false
      }
    }
    setErro("")
    return true
  }

  const handleProximo = async () => {
  if (!podeAvancar()) return

  setAnimando(true)

  setTimeout(async () => {
    if (perguntaAtual < perguntas.length - 1) {
      setPerguntaAtual(perguntaAtual + 1)
    } else {
      try {
        const response = await fetch('https://sendemail-publidoceu.vercel.app/enviar-formulario', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ respostas }),
        });
        await response.json();
        setFinalizado(true);
      } catch (error) {
        console.error('Erro ao enviar formulário:', error);
      }
    }
    setAnimando(false)
  }, 300)
}


  const handleVoltar = () => {
    if (perguntaAtual > 0) {
      setAnimando(true)
      setTimeout(() => {
        setPerguntaAtual(perguntaAtual - 1)
        setAnimando(false)
      }, 300)
    }
  }

  const handleVoltarInicio = () => {
    window.location.href = "/"
  }

  if (finalizado) {
    return (
      <div className="min-h-screen bg-gradient-to-br  flex items-center justify-center p-4">
        <div
          className={`bg-white  p-8 max-w-2xl w-full text-center transform transition-all duration-500 ${!animando ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
        >
          <div className="mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Orçamento Enviado com Sucesso!</h2>
            <p className="text-lg text-gray-600">
              Obrigado pelas informações detalhadas. Nossa equipe analisará sua solicitação e entrará em contato em
              breve com uma proposta personalizada.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-bold text-gray-900 mb-4 text-center">Resumo da sua solicitação:</h3>
            <div className="space-y-3 text-sm">
              {perguntas.map((pergunta, index) => {
                if (!respostas[index]) return null
                return (
                  <div key={pergunta.id} className="border-b border-gray-200 pb-2 last:border-b-0">
                    <span className="font-semibold text-gray-700">{pergunta.pergunta}</span>
                    <br />
                    <span className="text-blue-600">{respostas[index]}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <button
            onClick={handleVoltarInicio}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg cursor-pointer"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    )
  }

  const progresso = ((perguntaAtual + 1) / perguntas.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br  flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Barra de Progresso */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-3">
            <span className="font-medium">
              Pergunta {perguntaAtual + 1} de {perguntas.length}
            </span>
            <span className="font-medium">{Math.round(progresso)}% concluído</span>
          </div>
          <div className="w-full bg-white/50 rounded-full h-3 shadow-inner">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${progresso}%` }}
            ></div>
          </div>
        </div>

        {/* Card da Pergunta */}
        <div
          className={`bg-white  p-8 md:p-12 transform transition-all duration-300 ${animando ? "scale-95 opacity-0 translate-y-4" : "scale-100 opacity-100 translate-y-0"}`}
        >
          {/* Pergunta */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{pergunta.pergunta}</h2>
            {!pergunta.obrigatorio && <p className="text-gray-500 text-sm">(Opcional)</p>}
          </div>

          {/* Campo de Resposta */}
          <div className="mb-12">
            {pergunta.tipo === "texto" && (
              <>
              <input
                type="text"
                value={respostaAtual}
                onChange={(e) => handleResposta(e.target.value)}
                placeholder={pergunta.placeholder || "Digite seu nome..."}
                className="w-full p-4 text-lg border-b-2 border-gray-200  focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 focus:bg-white"
                autoFocus
              />
              {erro && <p className="text-red-500 text-sm mt-2">{erro}</p>}
              </>
            )}

            {pergunta.tipo === "email" && (
              <>
              <input
                type="email"
                value={respostaAtual}
                onChange={(e) => handleResposta(e.target.value)}
                placeholder="seu@email.com"
                className="w-full p-4 text-lg border-b-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 focus:bg-white"
                autoFocus
                required
              />
              {erro && <p className="text-red-500 text-sm mt-2">{erro}</p>}
              </>
            )}

            {pergunta.tipo === "telefone" && (
              <>
              <input
                type="tel"
                value={respostaAtual}
                onChange={(e) => handleResposta(e.target.value)}
                placeholder={pergunta.placeholder}
                className="w-full p-4 text-lg border-b-2 border-gray-200  focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 focus:bg-white"
                autoFocus
              />
              {erro && <p className="text-red-500 text-sm mt-2">{erro}</p>}
              </>
            )}

            {pergunta.tipo === "textarea" && (
              <textarea
                value={respostaAtual}
                onChange={(e) => handleResposta(e.target.value)}
                placeholder={pergunta.placeholder}
                rows={6}
                className="w-full p-4 text-lg border-b-2 border-gray-200  focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 focus:bg-white resize-none"
                autoFocus
              />
            )}

            {pergunta.tipo === "opcoes" && (
              <div className="grid gap-3 md:grid-cols-2">
                {pergunta.opcoes?.map((opcao, index) => (
                  <label
                    key={index}
                    className={`block p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                      respostaAtual === opcao
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm"
                    }`}
                  >
                    <input
                      type="radio"
                      name="resposta"
                      value={opcao}
                      checked={respostaAtual === opcao}
                      onChange={(e) => handleResposta(e.target.value)}
                      className="sr-only"
                    />
                    <span className="text-gray-900 font-medium text-lg">{opcao}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Botões */}
          <div className="flex gap-4">
            {perguntaAtual > 0 && (
              <button
                onClick={handleVoltar}
                className="flex-1 bg-gray-200 text-gray-700 py-4 px-8 rounded-xl font-semibold text-lg hover:bg-gray-300 transform hover:scale-105 transition-all duration-200 cursor-pointer"
              >
                ← Voltar
              </button>
            )}

          <button
            onClick={handleProximo}
            className={`flex-1 py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-200 transform bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:scale-105 shadow-lg cursor-pointer`}
          >
            {perguntaAtual === perguntas.length - 1 ? "Finalizar ✓" : "Próximo →"}
          </button>

          </div>
        </div>
      </div>
    </div>
  )
}
