# Thumb Typing Trainer

Crie um aplicativo web mobile-first chamado "PolegarPro" — um curso de digitação
para celular que ensina o usuário a digitar rápido com os dois polegares.

CONCEITO
- Público: pessoas que digitam devagar no celular e querem velocidade e precisão
  (estudantes, concursandos, profissionais que atendem clientes pelo WhatsApp).
- Diferencial: "curso de digitação, só que para celular" — metodologia clássica
  (posição base, exercícios progressivos) adaptada ao posicionamento dos dois
  polegares com o restante dos dedos apoiando o celular.
- Diferencial pedagógico: o usuário treina olhando para a TELA, nunca para o
  teclado (digitação cega adaptada ao polegar).

DESIGN SYSTEM
- 100% mobile-first (largura ideal 360-420px), tema escuro com gradiente
  roxo/azul, cantos arredondados (16px), fontes grandes, alvos de toque de no
  mínimo 48px de altura.
- Responsivo para desktop (centrado, largura máx ~480px).
- Microinterações em tudo: botões com leve escala ao pressionar (transform
  scale 0.97), transições suaves (200ms), animação de celebração (confetes CSS
  ou emojis) ao concluir módulo.
- Modo claro e escuro alternáveis (botão no header, preferência salva).
- Acessibilidade: contraste alto, áreas de toque generosas, sem depender só de
  cor (verde/vermelho também têm ícone ✅/❌).

ONBOARDING (primeira vez que o app abre)
- 3 telas rápidas de tutorial ilustrado:
  1. "Segure o celular apoiado nos dedos, polegares livres" (ilustração das
     mãos segurando o aparelho);
  2. "Olhe para a tela, não para o teclado";
  3. "5 minutos por dia e você digita 2x mais rápido".
- Botão "Começar agora" pula direto para o Módulo 1.
- Nunca mostrar de novo depois (flag salva no perfil).

TELAS

1) HOME
- Header com logo "PolegarPro" e ícone de configurações (modo claro/escuro,
  som on/off, vibração on/off).
- Card de estatísticas animado (contagem sobe com animação): nível, streak de
  dias com chama 🔥, PPM recorde, precisão recorde.
- Lista dos módulos com nome, descrição, barra de progresso animada e botão
  "Praticar". Módulo bloqueado com cadeado e mini-preview do que ensina
  ("Desbloqueia ao concluir o anterior") para gerar desejo.
- Banner diário: "Desafio de hoje: complete 1 frase para manter o streak 🔥".
- Aba "Meu progresso".

2) TELA DE EXERCÍCIO (o coração do app)
- Campo de entrada invisível foca automaticamente ao entrar na tela (e ao
  tocar em qualquer área da prática) — o teclado nativo abre sem clique extra.
  Se perder o foco, qualquer toque na área reabre.
- Texto-alvo grande (24px+) com realce por caractere:
  * corretos em VERDE com ✅ implícito;
  * caractere atual com fundo amarelo e pulso animado;
  * errados em VERMELHO — e mostre o caractere correto pequeno acima da letra
    errada para o usuário saber o que digitar.
- Regra: não avança até digitar o caractere correto; backspace permitido;
  erros entram no cálculo de precisão.
- MÉTRICAS EM TEMPO REAL a cada tecla: PPM, precisão %, tempo, barra de
  progresso da frase. Quando a métrica sobe, animação sutil (pulso verde).
- FEEDBACK MULTI-SENSORIAL:
  * acerto: micro-vibração leve (10ms) + som curto opcional de "tic" agradável;
  * erro: vibração firme (50ms) + som opcional de erro suave (nada estridente).
  * Toggles de som e vibração nas configurações.
- Dica pedagógica no topo conforme o módulo (Módulo 1: "Apoie o celular nos
  dedos mindinhos. Polegares flutuam sobre o teclado. Não olhe para baixo!").
- Botão de pausa/sair que salva o progresso da frase pela metade.
- Ao concluir a frase: modal de resultado com animação de estrelas aparecendo
  uma a uma (3 estrelas se precisão >= 95% e PPM >= 25; 2 se >= 90% e >= 15;
  senão 1), PPM, precisão, tempo, comparação com o recorde ("Novo recorde!
  🏆" quando aplicável). Botões "Repetir" e "Praxóxima frase".
- Ao concluir o módulo: tela de celebração com confetes, título do módulo
  concluído e botão "Continuar para o Módulo X".

3) TELA DE PROGRESSO
- Resumo: PPM atual, precisão média, frases concluídas, streak.
- Gráfico de barras da evolução das últimas 10 sessões (PPM), com animação de
  crescimento ao abrir a tela.
- "Nível de polegar": título divertido conforme PPM (0-15: Polegar Iniciante;
  16-25: Polegar Ágil; 26-35: Polegar Pro; 36+: Polegar Lenda 🐹).
- Botão "Compartilhar meu progresso" (gera texto pronto para WhatsApp: "Já
  digito a X PPM no celular 🚀").

MÓDULOS DO CURSO (conteúdo inicial, em português, sem acento no exercício para
não complicar o teclado)
1. Posição Inicial: "gato", "sapo", "dedo", "bola", "casa", "mao".
2. Linha Base: "dada", "sala", "faca", "galo", "fila", "sola".
3. Palavras Comuns: "eu quero mais", "voce vem", "de novo para mim", "mais uma
   vez", "o que e isso", "como assim".
4. Frases Curtas: "bom dia tudo bem", "onde voce esta", "ate mais tarde",
   "muito obrigado", "falo com voce depois".
5. Digitação Cega: "a pratica leva a perfeicao todos os dias", "digitar sem
   olhar e possivel com treino", "polegares treinados digitam sozinhos".
6. Teste de Velocidade: "o polegar e o dedo mais usado no celular aprender a
   digitar sem olhar o teclado aumenta a velocidade e reduz os erros com dez
   minutos de treino por dia voce digita mais rapido que a maioria das
   pessoas".

DADOS E LÓGICA
- Salvar por usuário: módulos/frases concluídos, PPM recorde, precisão recorde,
  streak de dias (reset se pular um dia), histórico das últimas 10 sessões,
  preferências (som, vibração, tema), flag de onboarding.
- PPM = (caracteres corretos / 5) / minutos — padrão de digitação.
- Precisão = caracteres corretos / tentativas totais.

FUTURO (estrutura preparada, não implementar ainda)
- Freemium (módulos 1-2 grátis, demais premium), ranking de PPM, modo desafio
  diário, modo uma mão (só polegar direito ou esquerdo).
- Tom sempre encorajador, zero crítica dura ao usuário. Rodapé discreto com a
  marca.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://thumb-typing-trainer.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d2ee9c4f-98df-4cdb-978f-12d901dad580).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
