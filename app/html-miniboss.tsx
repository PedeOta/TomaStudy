import { useTheme } from '@/hooks/theme-context';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


// -----------------------------
// SLIDES (MESMO DO SEU CÓDIGO)
// -----------------------------
const SLIDES = [
  { id: 1, progress: 10, bubble: 'HTML significa "HyperText Markup Language"', contentType: 'text' },
  {
    id: 2,
    progress: 20,
    bubble:
      '<!DOCTYPE html> diz que é um documento HTML.\n<html> envolve todo o conteúdo.\n<head> Informações sobre a página (não aparecem).\n<body> o que aparece na tela.',
    contentType: 'code',
    code:
      '<!DOCTYPE html>\n<html>\n  <head>\n    <title>Minha Primeira Página</title>\n  </head>\n  <body>\n    <h1>Olá, mundo!</h1>\n    <p>Esse é meu primeiro parágrafo.</p>\n  </body>\n</html>',
  },
  { id: 3, progress: 30, bubble: 'Vamos agora falar um pouco sobre as tags mais comuns...', contentType: 'text' },
  { id: 4, progress: 45, bubble: 'A tag <h1></h1> é usada para títulos...', contentType: 'code', code: '<h1>lorem ipsum</h1>\n<h6>lorem ipsum</h6>' },
  { id: 5, progress: 55, bubble: '<img>: Mostra uma imagem na página...', contentType: 'code', code: '<img src="caminho.jpg" alt="Descrição da imagem">' },
  {
    id: 6,
    progress: 60,
    bubble: '',
    contentType: 'lists',
    lists: [
      {
        title: '<ul> - lista não ordenada.',
        code: '<ul>\n  <li>Maçã</li>\n  <li>Banana</li>\n  <li>Laranja</li>\n</ul>',
        items: ['Maçã', 'Banana', 'Laranja'],
      },
      {
        title: '<ol> - lista ordenada.',
        code: '<ol>\n  <li>Frutas</li>\n  <li>Legumes</li>\n  <li>Sobremesas</li>\n</ol>',
        items: ['1. Frutas', '2. Legumes', '3. Sobremesas'],
      },
    ],
  },
  { id: 7, progress: 80, bubble: 'href: endereço de um link.', contentType: 'code', code: '<a href="https://google.com">Ir para o Google</a>' },
  { id: 8, progress: 90, bubble: 'A tag <p> é usada para criar parágrafos.', contentType: 'code', code: '<p>Lorem ipsum dolor sit amet...</p>' },
  { id: 9, progress: 100, bubble: 'Agora prove seu conhecimento enfrentando o MiniBoss HTML!', contentType: 'text' },
];

// -----------------------------------------------------
// TODAS AS PERGUNTAS (antigas + novas + verdadeiro/falso)
// -----------------------------------------------------
const QUIZ_QUESTIONS = [
  { id: 1, question: "O que significa HTML?", options: [
    { text: "Uma linguagem de programação", correct: false },
    { text: "HyperText Markup Language", correct: true },
    { text: "Uma ferramenta de design", correct: false },
    { text: "Um banco de dados", correct: false }
  ]},

  { id: 2, question: "Qual tag cria um parágrafo?", options: [
    { text: "<p>", correct: true },
    { text: "<text>", correct: false },
    { text: "<pg>", correct: false },
    { text: "<paragraph>", correct: false }
  ]},

  { id: 3, question: "Qual destas tags exibe uma imagem?", options: [
    { text: "<img>", correct: true },
    { text: "<image>", correct: false },
    { text: "<picture>", correct: false },
    { text: "<src>", correct: false }
  ]},

  { id: 4, question: "Qual atributo define o link de <a>?", options: [
    { text: "ref", correct: false },
    { text: "url", correct: false },
    { text: "href", correct: true },
    { text: "link", correct: false }
  ]},

  { id: 5, question: "Qual tag representa o maior título?", options: [
    { text: "<h1>", correct: true },
    { text: "<h6>", correct: false },
    { text: "<title>", correct: false },
    { text: "<header>", correct: false }
  ]},

  { id: 6, question: "Qual a tag utilizada para gerar uma lista NÃO ordenada?", options: [
    { text: "<ul>", correct: true },
    { text: "<ol>", correct: false },
    { text: "<li>", correct: false },
    { text: "<list>", correct: false }
  ]},

  // NOVAS PERGUNTAS DA TRILHA
  { id: 7, question: "Para que serve a declaração <!DOCTYPE html>?", options: [
    { text: "Define que o arquivo é um documento HTML", correct: true },
    { text: "Carrega imagens", correct: false },
    { text: "Cria um parágrafo", correct: false },
    { text: "Gera uma lista", correct: false }
  ]},

  { id: 8, question: "Qual tag envolve todo o conteúdo da página HTML?", options: [
    { text: "<html>", correct: true },
    { text: "<body>", correct: false },
    { text: "<head>", correct: false },
    { text: "<all>", correct: false }
  ]},

  { id: 9, question: "O que fica dentro da tag <head>?", options: [
    { text: "Informações e configurações da página", correct: true },
    { text: "Textos visíveis", correct: false },
    { text: "Imagens", correct: false },
    { text: "Títulos e parágrafos", correct: false }
  ]},

  { id: 10, question: "O que fica dentro da tag <body>?", options: [
    { text: "Conteúdo visível", correct: true },
    { text: "Configurações invisíveis", correct: false },
    { text: "Scripts do navegador", correct: false },
    { text: "Metadados", correct: false }
  ]},

  { id: 11, question: "Quanto maior o número do <h1> ao <h6>, o que acontece com o tamanho do texto?", options: [
    { text: "Fica menor", correct: true },
    { text: "Fica maior", correct: false },
    { text: "Some da tela", correct: false },
    { text: "Fica em negrito", correct: false }
  ]},

  { id: 12, question: "O que representa o atributo src da tag <img>?", options: [
    { text: "Endereço da imagem", correct: true },
    { text: "Tamanho da imagem", correct: false },
    { text: "Cor da imagem", correct: false },
    { text: "Tipo da imagem", correct: false }
  ]},

  { id: 13, question: "Para que serve o atributo alt?", options: [
    { text: "Texto alternativo caso a imagem não carregue", correct: true },
    { text: "Criar uma legenda", correct: false },
    { text: "Mudar o tamanho", correct: false },
    { text: "Mostrar um link", correct: false }
  ]},

  { id: 14, question: "Qual tag cria um link clicável?", options: [
    { text: "<a>", correct: true },
    { text: "<url>", correct: false },
    { text: "<href>", correct: false },
    { text: "<p>", correct: false }
  ]},

  { id: 15, question: "O que aparece entre <a> e </a>?", options: [
    { text: "Texto clicável", correct: true },
    { text: "Endereço do site", correct: false },
    { text: "Nome do navegador", correct: false },
    { text: "Imagem", correct: false }
  ]},

  // VERDADEIRO / FALSO
  { id: 16, question: "A tag <head> contém informações que NÃO aparecem na tela.", options: [
    { text: "Verdadeiro", correct: true },
    { text: "Falso", correct: false }
  ]},

  { id: 17, question: "A tag <ul> cria uma lista ordenada com números.", options: [
    { text: "Verdadeiro", correct: false },
    { text: "Falso", correct: true }
  ]},

  { id: 18, question: "O atributo href define o destino de um link.", options: [
    { text: "Verdadeiro", correct: true },
    { text: "Falso", correct: false }
  ]},
];

function shuffleArray(array) {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

function shuffleQuestionsAndOptions(questions) {
  return shuffleArray(questions).map(q => ({
    ...q,
    options: shuffleArray(q.options),
  }));
}



export default function HtmlMiniBoss() {
  const router = useRouter();
  const { colors } = useTheme();

  const [step, setStep] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizStep, setQuizStep] = useState(0);

  const [bossHealth, setBossHealth] = useState(100);
  const [playerLives, setPlayerLives] = useState(5);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);


  // NOVO: agora precisa acertar 10 perguntas
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const [showVictoryScreen, setShowVictoryScreen] = useState(false);
  const [showDefeatScreen, setShowDefeatScreen] = useState(false);
  React.useEffect(() => {
  setShuffledQuestions(shuffleQuestionsAndOptions(QUIZ_QUESTIONS));
}, []);


  const currentSlide = SLIDES[step];
  const currentQuestion = shuffledQuestions[quizStep];


  // RESET TOTAL
  const resetQuizState = () => {
    setStep(0);
    setShowQuiz(false);
    setSelectedAnswer(null);
    setQuizStep(0);
    setBossHealth(100);
    setPlayerLives(5);
    setCorrectCount(0);
    setWrongCount(0);
    setShowVictoryScreen(false);
    setShowDefeatScreen(false);
  };

  // CONTINUAR SLIDES
  const handleContinue = () => {
    if (step < SLIDES.length - 1) setStep(step + 1);
    else setShowQuiz(true);
  };

  // ------------------------------------
  //   MUDANÇA IMPORTANTE AQUI!!!
  //   Agora acerto vale 10% de dano
  //   E a vitória ocorre com 10 acertos
  // ------------------------------------
  const handleAnswerSubmit = () => {
    if (selectedAnswer === null) return;

    const isCorrect = currentQuestion.options[selectedAnswer].correct;

    if (isCorrect) {
      const newBossHealth = Math.max(0, bossHealth - 10); // DANO: 10%
      setBossHealth(newBossHealth);

      const newCorrect = correctCount + 1;
      setCorrectCount(newCorrect);

      if (newCorrect >= 10 || newBossHealth <= 0) {
        setShowVictoryScreen(true);
        setShowQuiz(false);
        return;
      }

    } else {
      const newLives = Math.max(0, playerLives - 1);
      setPlayerLives(newLives);

      const newWrong = wrongCount + 1;
      setWrongCount(newWrong);

      if (newWrong >= 5 || newLives <= 0) {
        setShowDefeatScreen(true);
        setShowQuiz(false);
        return;
      }
    }

    setSelectedAnswer(null);

    if (quizStep + 1 >= shuffledQuestions.length) {


      if (correctCount >= 10) {
        setShowVictoryScreen(true);
        setShowQuiz(false);
      } else {
        setShowDefeatScreen(true);
        setShowQuiz(false);
      }
      return;
    }

    setQuizStep(v => v + 1);
  };

  // -----------------------------
  // Telas de vitória e derrota
  // -----------------------------
  const VictoryScreen = () => (
    <View style={[styles.centeredContainer, { backgroundColor: colors.bg }]}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.victoryTitle, { color: colors.text }]}>Parabéns!</Text>
        <Image source={require('../assets/images/htmlboss.png')} style={styles.victoryImage} />
        <Text style={[styles.victoryText, { color: colors.text }]}>Você derrotou o MiniBoss HTML!</Text>

        <View style={styles.row}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => router.replace('/(tabs)')}
>
            <Text style={styles.actionText}>Voltar ao menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const DefeatScreen = () => (
    <View style={[styles.centeredContainer, { backgroundColor: colors.bg }]}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.defeatTitle, { color: colors.text }]}>Quase lá...</Text>
        <Image source={require('../assets/images/htmlboss.png')} style={styles.defeatImage} />
        <Text style={[styles.defeatText, { color: colors.text }]}>
          Você ficou sem vidas. Mas não desista — tente novamente!
        </Text>

        <View style={styles.row}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={resetQuizState}>
            <Text style={styles.actionText}>Recomeçar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.ghostButton]}
            onPress={() => { 
  resetQuizState(); 
  router.replace('/(tabs)'); 
}}
>
            <Text style={styles.actionTextPrimary}>Voltar ao menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // RENDER PRINCIPAL
  if (showVictoryScreen) return <VictoryScreen />;
  if (showDefeatScreen) return <DefeatScreen />;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {!showQuiz ? (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={[styles.closeButton, { backgroundColor: colors.card }]}
            onPress={() => router.back()}>
            <Text style={[styles.closeX, { color: colors.text }]}>✕</Text>
          </TouchableOpacity>

          {/* HEADER */}
          <View style={styles.topRow}>
            <View style={styles.heartsRow}>
              {[0, 1, 2, 3, 4].map(i => (
                <Image key={i} source={require('../assets/images/heart.png')} style={styles.heartImage} />
              ))}
            </View>

            <View style={styles.progressWrap}>
              <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
                <View style={[styles.progressFill, { width: `${currentSlide.progress}%` }]} />
              </View>
              <Text style={[styles.progressText, { color: colors.text }]}>
                {currentSlide.progress}%
              </Text>
            </View>
          </View>

          {/* CONTEÚDO DA TRILHA */}
          {currentSlide.contentType === 'text' && (
            <View style={[styles.bubbleContainer, { backgroundColor: colors.card }]}>
              <Text style={[styles.bubbleText, { color: colors.text }]}>{currentSlide.bubble}</Text>
            </View>
          )}

          {currentSlide.contentType === 'code' && (
            <>
              <View style={[styles.codeBlock, { backgroundColor: colors.card }]}>
                <Text style={[styles.codeText, { color: colors.text }]}>{currentSlide.code}</Text>
              </View>

              <View style={[styles.bubbleContainer, { backgroundColor: colors.card }]}>
                <Text style={[styles.bubbleText, { color: colors.text }]}>{currentSlide.bubble}</Text>
              </View>
            </>
          )}

          {currentSlide.contentType === 'lists' && (
            <>
              {currentSlide.lists.map((list, idx) => (
                <View key={idx} style={styles.listSection}>
                  <Text style={[styles.listTitle, { color: colors.text }]}>{list.title}</Text>

                  <View style={styles.listRow}>
                    <View style={[styles.codeBlock, { backgroundColor: colors.card, flex: 1 }]}>
                      <Text style={[styles.codeText, { color: colors.text }]}>{list.code}</Text>
                    </View>

                    <View style={styles.itemsDisplay}>
                      {list.items.map((item, i) => (
                        <Text key={i} style={[styles.listItem, { color: colors.text }]}>{item}</Text>
                      ))}
                    </View>
                  </View>
                </View>
              ))}
            </>
          )}

          <View style={styles.bossWrap}>
            <Image source={require('../assets/images/htmlboss.png')} style={styles.bossImage} />
          </View>

          <View style={styles.footerSpace} />

          <TouchableOpacity style={[styles.continueButton]} onPress={handleContinue}>
            <Text style={styles.continueText}>CONTINUAR ➜</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        // ---------- QUIZ ----------
        <ScrollView contentContainerStyle={styles.quizScroll} showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={[styles.closeButton, { backgroundColor: colors.card }]}
            onPress={() => router.back()}>
            <Text style={[styles.closeX, { color: colors.text }]}>✕</Text>
          </TouchableOpacity>

          {/* BARRA DE VIDA DO BOSS */}
          <View style={styles.quizHeader}>
            <View style={styles.healthBarContainer}>
              <View style={[styles.healthBarBg, { backgroundColor: colors.border }]}>
                <View style={[styles.healthBarFill, { width: `${bossHealth}%` }]} />
              </View>
              <Image source={require('../assets/images/vilao.png')} style={styles.vilaoImageSmall} />
            </View>
          </View>

          {/* PERGUNTA */}
          <View style={[styles.questionBubble, { backgroundColor: colors.card }]}>
            <Text style={[styles.questionBubbleText, { color: colors.text }]}>
              {currentQuestion.question}
            </Text>
          </View>

          <View style={styles.bossWrap}>
            <Image source={require('../assets/images/htmlboss.png')} style={styles.bossImageQuiz} />
          </View>

          {/* VIDAS DO PLAYER */}
          <View style={styles.playerHeartsContainer}>
            {[0, 1, 2, 3, 4].map(i => (
              <Image
                key={i}
                source={i < playerLives ? require('../assets/images/heart.png') : require('../assets/images/brokenheart.png')}
                style={styles.heartImage}
              />
            ))}
          </View>

          {/* OPÇÕES */}
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: selectedAnswer === index ? colors.primary : colors.card,
                  },
                ]}
                onPress={() => setSelectedAnswer(index)}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: selectedAnswer === index ? '#fff' : colors.text },
                  ]}
                >
                  {option.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.footerSpace} />

          <TouchableOpacity
            style={[styles.continueButton, { backgroundColor: selectedAnswer !== null ? colors.primary : colors.border }]}
            onPress={handleAnswerSubmit}
            disabled={selectedAnswer === null}
          >
            <Text
              style={[styles.continueText, { color: selectedAnswer !== null ? '#fff' : colors.secondaryText }]}
            >
              CONFIRMAR ➜
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 24, alignItems: 'center' },
  quizScroll: { padding: 24, alignItems: 'center' },

  closeButton: {
    position: 'absolute',
    left: 18,
    top: 18,
    zIndex: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  closeX: { fontSize: 20 },

  topRow: { marginTop: 60, width: '100%', alignItems: 'center' },
  heartsRow: { flexDirection: 'row', gap: 6, marginBottom: 12 },
  heartImage: { width: 24, height: 24, resizeMode: 'contain' },

  progressWrap: { alignItems: 'center', marginTop: 6 },
  progressBarBg: { width: 220, height: 28, borderRadius: 16, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#7ed957' },
  progressText: { marginTop: 6 },

  bubbleContainer: { marginTop: 26, width: '100%', borderWidth: 2, borderRadius: 12, padding: 18 },
  bubbleText: { fontSize: 14, fontWeight: '600', lineHeight: 22 },

  codeBlock: { marginTop: 16, padding: 12, borderRadius: 8, borderWidth: 1 },
  codeText: { fontSize: 12, fontFamily: 'monospace', lineHeight: 18 },

  listSection: { marginTop: 18, width: '100%' },
  listTitle: { fontSize: 13, fontWeight: '600', marginBottom: 10 },
  listRow: { flexDirection: 'row', gap: 12 },
  itemsDisplay: { flex: 1, justifyContent: 'center', paddingRight: 8 },
  listItem: { fontSize: 12, lineHeight: 22 },

  bossWrap: { marginTop: 26, alignItems: 'center', width: '100%' },
  bossImage: { width: 200, height: 200, resizeMode: 'contain' },

  footerSpace: { height: 40 },

  continueButton: {
    width: '60%',
    height: 54,
    borderRadius: 40,
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#55D838',
    borderWidth: 3,
    borderColor: '#D9D9D9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 5,
  },

  continueText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },

  quizHeader: { marginTop: 18, width: '100%', gap: 12, marginBottom: 20 },
  healthBarContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  healthBarBg: { flex: 1, height: 20, borderRadius: 10, overflow: 'hidden' },
  healthBarFill: { height: '100%', backgroundColor: '#FF4444' },
  vilaoImageSmall: { width: 32, height: 32, resizeMode: 'contain' },

  questionBubble: { width: '100%', borderWidth: 2, borderRadius: 12, padding: 16, marginBottom: 20, marginTop: 20 },
  questionBubbleText: { fontSize: 14, fontWeight: '600', lineHeight: 22, textAlign: 'center' },

  bossImageQuiz: { width: 140, height: 140, resizeMode: 'contain' },

  optionsContainer: { width: '100%', gap: 12, marginBottom: 24 },
  optionButton: { width: '100%', paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  optionText: { fontSize: 14, fontWeight: '600', textAlign: 'center' },

  playerHeartsContainer: { flexDirection: 'row', gap: 6, marginBottom: 20, justifyContent: 'center' },

  centeredContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  card: { width: '100%', borderRadius: 16, padding: 22, alignItems: 'center', elevation: 4 },

  victoryTitle: { fontSize: 22, fontWeight: '800', marginBottom: 8 },
  victoryImage: { width: 140, height: 140, resizeMode: 'contain', marginVertical: 8 },
  victoryText: { fontSize: 16, fontWeight: '600', marginTop: 8, textAlign: 'center' },

  defeatTitle: { fontSize: 22, fontWeight: '800', marginBottom: 8 },
  defeatImage: { width: 140, height: 140, resizeMode: 'contain', marginVertical: 8 },
  defeatText: { fontSize: 16, fontWeight: '600', marginTop: 8, textAlign: 'center' },

  row: { flexDirection: 'row', width: '100%', justifyContent: 'space-around', marginTop: 18 },
  actionButton: { paddingVertical: 12, paddingHorziontal: 18, borderRadius: 12, minWidth: 140, alignItems: 'center' },
  actionText: { color: '#fff', fontWeight: '700' },
  ghostButton: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 12, minWidth: 140, alignItems: 'center' },
  actionTextPrimary: { color: '#2a9d5b', fontWeight: '700' },
});
