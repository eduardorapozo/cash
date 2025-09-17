"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function ShopeeCashFunnel() {
  const [currentStep, setCurrentStep] = useState(1)
  const [userName, setUserName] = useState("")
  const [balance, setBalance] = useState(0)
  const [pixKey, setPixKey] = useState("")
  const [showDownloadButton, setShowDownloadButton] = useState(false)
  const [hasRated, setHasRated] = useState(false)
  const [showValueQuestion, setShowValueQuestion] = useState(false)
  const [showCongratulationsPopup, setShowCongratulationsPopup] = useState(false)
  const [congratulationsAmount, setCongratulationsAmount] = useState(0)
  const [userLocation, setUserLocation] = useState("")
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState([
    {
      id: 1,
      name: "Francisca Santos",
      time: "1 hora",
      text: "O único site que realmente funciona comigo, já tinha tentado de tudo para conseguir ganhar uma renda extra, resolvi então utilizar esse app , e consegui fazer 1300 na primeira semana, estou muito feliz e também muito aliviada porque se não fosse esse site eu nunca iria poder sair e comprar o que eu realmente quero, e não o que meu bolso pode !! muito bom mesmo recomendo pessoal!",
      likes: 49,
      avatar: "/francisca-santos.png",
    },
    {
      id: 2,
      name: "Carla Fernandes",
      time: "2 horas",
      text: "Alguém aqui do Rio Grande do Sul já baixou? quero saber se os 100 reais cai mesmo na conta.",
      likes: 67,
      avatar: "/carla-fernandes.png",
    },
    {
      id: 3,
      name: "Bruna Carvalho",
      time: "7 horas",
      text: "minha conta demorou mais de meia hora pra ser ativada por que? no video foi tudo automatico por que o da minha demorou esse tempo todo pra ser ativada?",
      likes: 76,
      avatar: "/bruna-carvalho.png",
    },
  ])

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((response) => response.json())
      .then((data) => {
        setUserLocation(data.city + ", " + data.region)
      })
      .catch(() => {
        setUserLocation("Brasil")
      })
  }, [])

  const playMoneySound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1)

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.1)
  }

  const increaseBalance = (amount: number) => {
    setBalance((prev) => Math.min(prev + amount, 114.26))
    playMoneySound()
  }

  useEffect(() => {
    if (currentStep === 10) {
      const timer = setTimeout(
        () => {
          setShowDownloadButton(true)
        },
        12 * 60 * 1000,
      ) // 12 minutos

      return () => clearTimeout(timer)
    }
  }, [currentStep])

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1)
    setHasRated(false)
    setShowValueQuestion(false)
  }

  const handleProductEvaluation = (rating: number, amount: number) => {
    setHasRated(true)
    setShowValueQuestion(true)
    increaseBalance(amount)
    setCongratulationsAmount(amount)
    setShowCongratulationsPopup(true)
    setTimeout(() => {
      setShowCongratulationsPopup(false)
    }, 3000)
  }

  const handleValueResponse = (response: string) => {
    nextStep()
  }

  const addComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        name: userName || "Usuário",
        time: "agora",
        text: `${newComment} - ${userLocation}`,
        likes: 0,
        avatar: "/placeholder.svg",
      }
      setComments([comment, ...comments])
      setNewComment("")
    }
  }

  const CongratulationsPopup = () => {
    if (!showCongratulationsPopup) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-sm mx-4 text-center border-4 border-orange-500">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-orange-600 mb-2">Parabéns!</h2>
          <p className="text-lg font-bold text-gray-800">Você ganhou R$ {congratulationsAmount.toFixed(2)}</p>
          <div className="mt-4 text-orange-500 text-4xl">💰</div>
        </div>
      </div>
    )
  }

  const Header = () => (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="bg-red-600 rounded-full p-2">
          <span className="text-xl font-bold text-white">$</span>
        </div>
        <div className="text-xl font-bold">
          <span className="text-gray-900">Shopee</span>
          <span className="text-gray-900">Cash</span>
        </div>
      </div>
      <div className="bg-red-600 px-4 py-2 rounded-full font-bold text-white">SALDO: R$ {balance.toFixed(2)}</div>
    </div>
  )

  if (currentStep === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-100 to-orange-50">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
          <Card className="w-full max-w-md p-8 border-2 border-orange-300 bg-orange-50">
            <div className="text-center space-y-6">
              <h1 className="text-2xl font-bold" style={{ color: "#1f2937" }}>
                Bem vindo ao <span style={{ color: "#ea580c", fontWeight: "bold" }}>Shopee</span>
                <span style={{ color: "#1f2937" }}>Cash!</span>
              </h1>
              <div className="space-y-4">
                <label className="block font-medium" style={{ color: "#374151" }}>
                  Digite seu nome:
                </label>
                <Input
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full p-3 border-2 border-orange-200 rounded-lg"
                  placeholder="Seu nome aqui..."
                />
                <Button
                  onClick={nextStep}
                  disabled={!userName.trim()}
                  className="w-full bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-lg font-medium"
                >
                  Continuar
                </Button>
              </div>
            </div>
          </Card>
        </div>
        <div className="bg-orange-500 p-4 text-center font-bold text-white">🔒 100% Seguro e Confiável</div>
      </div>
    )
  }

  if (currentStep === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-100 to-orange-50">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
          <Card className="w-full max-w-md p-8 border-2 border-orange-300 bg-orange-50">
            <div className="text-center space-y-6">
              <h1 className="text-2xl font-bold" style={{ color: "#1f2937" }}>
                É UM PRAZER <span style={{ color: "#ea580c", fontWeight: "bold" }}>TER VOCÊ AQUI!</span>
              </h1>
              <p style={{ color: "#374151" }}>
                O aplicativo da Shopee precisa de você e estão dispostos a pagar muito bem por isso!
              </p>
              <Button
                onClick={nextStep}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-bold"
              >
                Quero ganhar R$100,00 ainda hoje!
              </Button>
            </div>
          </Card>
        </div>
        <div className="bg-orange-500 p-4 text-center font-bold text-white">🔒 100% Seguro e Confiável</div>
      </div>
    )
  }

  if (currentStep === 3) {
    return (
      <div className="min-h-screen bg-gray-200">
        <Header />
        <div className="p-4">
          <div className="bg-white rounded-lg p-6 max-w-md mx-auto border-2 border-orange-300">
            <div className="text-center mb-4">
              <span className="text-sm" style={{ color: "#4b5563" }}>
                ❓ Perguntas
              </span>
            </div>
            <h2 className="text-xl font-bold text-center mb-4" style={{ color: "#1f2937" }}>
              RESPONDA E GANHE R$ 25,00
            </h2>
            <p className="text-center mb-6" style={{ color: "#4b5563" }}>
              Pagamento feito por Pix
            </p>

            <div className="bg-white rounded-lg p-4 mb-6 border">
              <img
                src="/umidificador-ultrassonico-madeira.jpg"
                alt="Umidificador Ultrassônico"
                className="w-full h-48 object-contain mx-auto mb-4"
              />
            </div>

            <div className="flex gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleProductEvaluation(rating, 25.0)}
                  className={`flex-1 py-3 rounded-lg text-white font-bold ${
                    rating === 1
                      ? "bg-red-600"
                      : rating === 2
                        ? "bg-red-500"
                        : rating === 3
                          ? "bg-yellow-500"
                          : rating === 4
                            ? "bg-green-500"
                            : "bg-teal-500"
                  }`}
                >
                  {rating === 1 ? "😡" : rating === 2 ? "😞" : rating === 3 ? "😐" : rating === 4 ? "😊" : "😍"}
                </button>
              ))}
            </div>

            {showValueQuestion && (
              <>
                <p className="text-center font-bold mb-4" style={{ color: "#1f2937" }}>
                  Vale a pena pagar R$ 47,99 nesse produto?
                </p>

                <div className="flex gap-4">
                  <Button
                    onClick={() => handleValueResponse("sim")}
                    className="flex-1 bg-white border-2 border-gray-300 hover:bg-gray-50"
                    style={{ color: "#1f2937" }}
                  >
                    Sim
                  </Button>
                  <Button
                    onClick={() => handleValueResponse("não")}
                    className="flex-1 bg-white border-2 border-gray-300 hover:bg-gray-50"
                    style={{ color: "#1f2937" }}
                  >
                    Não
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 4) {
    return (
      <div className="min-h-screen bg-gray-200">
        <Header />
        <div className="p-4">
          <div className="bg-white rounded-lg p-6 max-w-md mx-auto border-2 border-orange-300">
            <h2 className="text-xl font-bold text-center mb-4" style={{ color: "#1f2937" }}>
              RESPONDA E GANHE R$ 19,99
            </h2>
            <p className="text-center mb-6" style={{ color: "#4b5563" }}>
              Pagamento feito por Pix
            </p>

            <div className="bg-white rounded-lg p-4 mb-6 border">
              <img
                src="/maquina-de-barbear-eletrica-dourada.jpg"
                alt="Máquina de Barbear"
                className="w-full h-48 object-contain mx-auto mb-4"
              />
            </div>

            <div className="flex gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleProductEvaluation(rating, 19.99)}
                  className={`flex-1 py-3 rounded-lg text-white font-bold ${
                    rating === 1
                      ? "bg-red-600"
                      : rating === 2
                        ? "bg-red-500"
                        : rating === 3
                          ? "bg-yellow-500"
                          : rating === 4
                            ? "bg-green-500"
                            : "bg-teal-500"
                  }`}
                >
                  {rating === 1 ? "😡" : rating === 2 ? "😞" : rating === 3 ? "😐" : rating === 4 ? "😊" : "😍"}
                </button>
              ))}
            </div>

            {showValueQuestion && (
              <>
                <p className="text-center font-bold mb-4" style={{ color: "#1f2937" }}>
                  Vale a pena pagar R$ 19,99 nesse produto?
                </p>

                <div className="flex gap-4">
                  <Button
                    onClick={() => handleValueResponse("sim")}
                    className="flex-1 bg-white border-2 border-gray-300 hover:bg-gray-50"
                    style={{ color: "#1f2937" }}
                  >
                    Sim
                  </Button>
                  <Button
                    onClick={() => handleValueResponse("não")}
                    className="flex-1 bg-white border-2 border-gray-300 hover:bg-gray-50"
                    style={{ color: "#1f2937" }}
                  >
                    Não
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 5) {
    return (
      <div className="min-h-screen bg-gray-200">
        <Header />
        <div className="p-4">
          <div className="bg-white rounded-lg p-6 max-w-md mx-auto border-2 border-orange-300">
            <h2 className="text-xl font-bold text-center mb-4" style={{ color: "#1f2937" }}>
              RESPONDA E GANHE R$ 21,99
            </h2>
            <p className="text-center mb-6" style={{ color: "#4b5563" }}>
              Pagamento feito por Pix
            </p>

            <div className="bg-white rounded-lg p-4 mb-6 border">
              <img
                src="/fone-de-ouvido-bluetooth-preto.jpg"
                alt="Fone Bluetooth"
                className="w-full h-48 object-contain mx-auto mb-4"
              />
            </div>

            <div className="flex gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleProductEvaluation(rating, 21.99)}
                  className={`flex-1 py-3 rounded-lg text-white font-bold ${
                    rating === 1
                      ? "bg-red-600"
                      : rating === 2
                        ? "bg-red-500"
                        : rating === 3
                          ? "bg-yellow-500"
                          : rating === 4
                            ? "bg-green-500"
                            : "bg-teal-500"
                  }`}
                >
                  {rating === 1 ? "😡" : rating === 2 ? "😞" : rating === 3 ? "😐" : rating === 4 ? "😊" : "😍"}
                </button>
              ))}
            </div>

            {showValueQuestion && (
              <>
                <p className="text-center font-bold mb-4" style={{ color: "#1f2937" }}>
                  Vale a pena pagar R$ 21,99 nesse produto?
                </p>

                <div className="flex gap-4">
                  <Button
                    onClick={() => handleValueResponse("sim")}
                    className="flex-1 bg-white border-2 border-gray-300 hover:bg-gray-50"
                    style={{ color: "#1f2937" }}
                  >
                    Sim
                  </Button>
                  <Button
                    onClick={() => handleValueResponse("não")}
                    className="flex-1 bg-white border-2 border-gray-300 hover:bg-gray-50"
                    style={{ color: "#1f2937" }}
                  >
                    Não
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 6) {
    return (
      <div className="min-h-screen bg-gray-200">
        <Header />
        <div className="p-4">
          <div className="bg-white rounded-lg p-6 max-w-md mx-auto border-2 border-orange-300">
            <h2 className="text-xl font-bold text-center mb-4" style={{ color: "#1f2937" }}>
              RESPONDA E GANHE R$ 25,00
            </h2>
            <p className="text-center mb-6" style={{ color: "#4b5563" }}>
              Pagamento feito por Pix
            </p>

            <div className="bg-white rounded-lg p-4 mb-6 border">
              <img src="/relogio-rolex.png" alt="Relógio Rolex" className="w-full h-48 object-contain mx-auto mb-4" />
            </div>

            <div className="flex gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleProductEvaluation(rating, 25.0)}
                  className={`flex-1 py-3 rounded-lg text-white font-bold ${
                    rating === 1
                      ? "bg-red-600"
                      : rating === 2
                        ? "bg-red-500"
                        : rating === 3
                          ? "bg-yellow-500"
                          : rating === 4
                            ? "bg-green-500"
                            : "bg-teal-500"
                  }`}
                >
                  {rating === 1 ? "😡" : rating === 2 ? "😞" : rating === 3 ? "😐" : rating === 4 ? "😊" : "😍"}
                </button>
              ))}
            </div>

            {showValueQuestion && (
              <>
                <p className="text-center font-bold mb-4" style={{ color: "#1f2937" }}>
                  Vale a pena pagar R$ 197,99 nesse produto?
                </p>

                <div className="flex gap-4">
                  <Button
                    onClick={() => handleValueResponse("sim")}
                    className="flex-1 bg-white border-2 border-gray-300 hover:bg-gray-50"
                    style={{ color: "#1f2937" }}
                  >
                    Sim
                  </Button>
                  <Button
                    onClick={() => handleValueResponse("não")}
                    className="flex-1 bg-white border-2 border-gray-300 hover:bg-gray-50"
                    style={{ color: "#1f2937" }}
                  >
                    Não
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 7) {
    return (
      <div className="min-h-screen bg-gray-200">
        <Header />
        <div className="p-4">
          <div className="bg-white rounded-lg p-6 max-w-md mx-auto border-2 border-orange-300">
            <h2 className="text-xl font-bold text-center mb-4" style={{ color: "#1f2937" }}>
              RESPONDA E GANHE R$ 22,28
            </h2>
            <p className="text-center mb-6" style={{ color: "#4b5563" }}>
              Pagamento feito por Pix
            </p>

            <div className="bg-white rounded-lg p-4 mb-6 border">
              <img src="/tenis-nike.png" alt="Tênis Nike" className="w-full h-48 object-contain mx-auto mb-4" />
            </div>

            <div className="flex gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleProductEvaluation(rating, 22.28)}
                  className={`flex-1 py-3 rounded-lg text-white font-bold ${
                    rating === 1
                      ? "bg-red-600"
                      : rating === 2
                        ? "bg-red-500"
                        : rating === 3
                          ? "bg-yellow-500"
                          : rating === 4
                            ? "bg-green-500"
                            : "bg-teal-500"
                  }`}
                >
                  {rating === 1 ? "😡" : rating === 2 ? "😞" : rating === 3 ? "😐" : rating === 4 ? "😊" : "😍"}
                </button>
              ))}
            </div>

            {showValueQuestion && (
              <>
                <p className="text-center font-bold mb-4" style={{ color: "#1f2937" }}>
                  Vale a pena pagar R$ 129,90 nesse produto?
                </p>

                <div className="flex gap-4">
                  <Button
                    onClick={() => handleValueResponse("sim")}
                    className="flex-1 bg-white border-2 border-gray-300 hover:bg-gray-50"
                    style={{ color: "#1f2937" }}
                  >
                    Sim
                  </Button>
                  <Button
                    onClick={() => handleValueResponse("não")}
                    className="flex-1 bg-white border-2 border-gray-300 hover:bg-gray-50"
                    style={{ color: "#1f2937" }}
                  >
                    Não
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 8) {
    return (
      <div className="min-h-screen bg-gray-200">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
          <Card className="w-full max-w-md p-8 border-2 border-orange-300 bg-white">
            <div className="text-center space-y-6">
              <h1 className="text-2xl font-bold" style={{ color: "#1f2937" }}>
                Receba seu pagamento!
              </h1>
              <div className="space-y-2">
                <p style={{ color: "#4b5563" }}>
                  <strong>Chave PIX:</strong> CPF, email ou número
                </p>
                <p style={{ color: "#4b5563" }}>
                  <strong>Valor que quer sacar:</strong> R$ {(114.26).toFixed(2)}
                </p>
              </div>
              <div className="space-y-4">
                <Input
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                  className="w-full p-3 border-2 border-orange-200 rounded-lg"
                  placeholder="Digite sua chave PIX (CPF, celular ou email)..."
                />
                <Button
                  onClick={nextStep}
                  disabled={!pixKey.trim()}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-bold"
                >
                  Receber Pagamento
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  if (currentStep === 9) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="p-4 space-y-6">
          <Card className="w-full max-w-md mx-auto p-6 border-2 border-red-300 bg-red-50">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-bold" style={{ color: "#dc2626" }}>
                Ops! Erro no PIX
              </h2>
              <p style={{ color: "#374151" }}>
                Identificamos que sua chave pix ainda não está cadastrada na nossa plataforma parceira.
              </p>
              <Button
                onClick={() => setCurrentStep(10)}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-bold"
              >
                Cadastrar Agora
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  if (currentStep === 10) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="p-4">
          <div className="w-full max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold mb-2" style={{ color: "#1f2937" }}>
                Faça até <span style={{ color: "#ea580c", fontWeight: "bold" }}>500 reais por dia</span> avaliando
                produtos na shopee.
              </h1>
              <h2 className="text-xl font-bold" style={{ color: "#ea580c" }}>
                Seja um parceiro
              </h2>
            </div>

            <div className="mb-6">
              <div style={{ margin: "0 auto", width: "100%" }}>
                <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                  <iframe
                    src="https://scripts.converteai.net/6b8a61b2-6c26-485c-b526-b24dd7daea3b/players/68c0934c5875b06500c3831e/v4/embed.html"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      border: "none",
                    }}
                    allowFullScreen
                    title="VSL Shopee Cash"
                  />
                </div>
              </div>
            </div>

            <div className="text-center mb-6">
              {showDownloadButton ? (
                <a href="https://go.perfectpay.com.br/PPU38CQ0I0A" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg font-bold rounded-lg">
                    📱 Baixar App
                  </Button>
                </a>
              ) : (
                <div
                  className="bg-gray-300 px-8 py-4 text-lg font-bold rounded-lg inline-block"
                  style={{ color: "#4b5563" }}
                >
                  Botão disponível em alguns minutos...
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg p-4 mb-6 border">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-bold underline" style={{ color: "#1f2937" }}>
                  Mais Recentes
                </h3>
                <span style={{ color: "#1f2937" }}>▼</span>
              </div>

              <div className="mb-4 p-3 bg-blue-50 rounded-lg border">
                <div className="flex gap-3">
                  <img src="/placeholder.svg" alt="Seu avatar" className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <Input
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder={`Escreva um comentário... (${userLocation})`}
                      className="mb-2"
                    />
                    <Button
                      onClick={addComment}
                      disabled={!newComment.trim()}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 text-sm"
                    >
                      Comentar
                    </Button>
                  </div>
                </div>
              </div>

              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                  <img
                    src={comment.avatar || "/placeholder.svg"}
                    alt={`Avatar de ${comment.name}`}
                    className="w-10 h-10 rounded-full flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm" style={{ color: "#1f2937" }}>
                        {comment.name}
                      </span>
                      <span className="text-xs" style={{ color: "#6b7280" }}>
                        {comment.time}
                      </span>
                    </div>
                    <p className="text-sm mb-2" style={{ color: "#374151" }}>
                      {comment.text}
                    </p>
                    <div className="flex items-center justify-between">
                      <button className="text-xs px-2 py-1 border rounded" style={{ color: "#374151" }}>
                        Curtir
                      </button>
                      <div className="flex items-center gap-1">
                        <span className="text-blue-500">👍</span>
                        <span className="text-red-500">❤️</span>
                        <span className="text-xs" style={{ color: "#6b7280" }}>
                          {comment.likes}
                        </span>
                      </div>
                    </div>
                    {comment.id === 2 || comment.id === 3 ? (
                      <button className="text-xs mt-1" style={{ color: "#6b7280" }}>
                        Mostrar respostas ›
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <CongratulationsPopup />
      {/* Resto do conteúdo baseado no currentStep */}
    </>
  )
}
