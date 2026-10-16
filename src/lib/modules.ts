export type Module = {
  id: number;
  name: string;
  description: string;
  tip: string;
  phrases: string[];
  // Future: premium flag for freemium (modules 1-2 free)
  premium?: boolean;
};

export const MODULES: Module[] = [
  { id: 1, name: "Posição Inicial", description: "Palavras curtas para encontrar a posição dos polegares.", tip: "Apoie o celular nos dedos mindinhos. Polegares flutuam sobre o teclado. Não olhe para baixo!", phrases: ["gato", "sapo", "dedo", "bola", "casa", "mao"] },
  { id: 2, name: "Linha Base", description: "Treine a linha do meio do teclado (a, s, d, f, g, l).", tip: "A linha do meio é sua casa. Volte os polegares para ela depois de cada letra.", phrases: ["dada", "sala", "faca", "galo", "fila", "sola"], premium: false },
  { id: 3, name: "Palavras Comuns", description: "Expressões do dia a dia com espaço entre palavras.", tip: "Use o polegar que estiver mais perto da letra. O espaço é de quem estiver livre!", phrases: ["eu quero mais", "voce vem", "de novo para mim", "mais uma vez", "o que e isso", "como assim"], premium: true },
  { id: 4, name: "Frases Curtas", description: "Mensagens rápidas como no WhatsApp.", tip: "Ritmo constante vale mais que pressa. Respire e mantenha o compasso.", phrases: ["bom dia tudo bem", "onde voce esta", "ate mais tarde", "muito obrigado", "falo com voce depois"], premium: true },
  { id: 5, name: "Digitação Cega", description: "Frases longas sem olhar para o teclado.", tip: "Confie na memória dos polegares. Os olhos ficam só na tela.", phrases: ["a pratica leva a perfeicao todos os dias", "digitar sem olhar e possivel com treino", "polegares treinados digitam sozinhos"], premium: true },
  { id: 6, name: "Teste de Velocidade", description: "Um texto longo para medir sua velocidade real.", tip: "Hora de brilhar! Mantenha a precisão e a velocidade vem sozinha.", phrases: ["o polegar e o dedo mais usado no celular aprender a digitar sem olhar o teclado aumenta a velocidade e reduz os erros com dez minutos de treino por dia voce digita mais rapido que a maioria das pessoas"], premium: true },
];

export function thumbLevel(wpm: number) {
  if (wpm <= 15) return "Polegar Iniciante";
  if (wpm <= 25) return "Polegar Ágil";
  if (wpm <= 35) return "Polegar Pro";
  return "Polegar Lenda 🐹";
}
