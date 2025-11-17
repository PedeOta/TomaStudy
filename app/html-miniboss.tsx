import { useTheme } from '@/hooks/theme-context';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SLIDES = [
  {
    id: 1,
    progress: 10,
    bubble: 'HTML significa "HyperText Markup Language"',
    contentType: 'text',
  },
  {
    id: 2,
    progress: 20,
    bubble: '<!DOCTYPE html> diz que é um documento HTML.\n<html> envolve todo o conteúdo.\n<head> Informações sobre a página (não aparecem).\n<body> o que aparece na tela.',
    contentType: 'code',
    code: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>Minha Primeira Página</title>\n  </head>\n  <body>\n    <h1>Olá, mundo!</h1>\n    <p>Esse é meu primeiro parágrafo.</p>\n  </body>\n</html>'
  },
  {
    id: 3,
    progress: 30,
    bubble: 'Vamos agora falar um pouco sobre as tags mais comuns, como títulos, imagens, listas links e parágrafos.',
    contentType: 'text',
  },
  {
    id: 4,
    progress: 45,
    bubble: 'A tag <h1></h1> é usada para títulos. Quanto menor o número da tag (h1, h2, h3, h4, h5, h6) menor será a fonte do título.',
    contentType: 'code',
    code: '<h1>lorem ipsum</h1>\n<h6>lorem ipsum</h6>',
  },
  {
    id: 5,
    progress: 55,
    bubble: '<img>: Mostra uma imagem na página.\nsrc: é o endereço da imagem.\nalt: texto alternativo da imagem.',
    contentType: 'code',
    code: '<img src="caminho.jpg" alt="Descrição da imagem">',
  },
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
  {
    id: 7,
    progress: 80,
    bubble: 'href: endereço de um link.\nO texto dentro de <a> aparece clicável.',
    contentType: 'code',
    code: '<a href="https://google.com">Ir para o Google</a>',
  },
  {
    id: 8,
    progress: 90,
    bubble: 'A tag <p> é usada para criar parágrafos.',
    contentType: 'code',
    code: '<p>Lorem ipsum dolor sit amet...</p>',
  },
  {
    id: 9,
    progress: 100,
    bubble: 'Agora prove seu conhecimento enfrentando o MiniBoss HTML!',
    contentType: 'text',
  },
];

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'O que significa HTML?',
    options: [
      { text: 'Uma linguagem de programação', correct: false },
      { text: 'HyperText Markup Language', correct: true },
      { text: 'Uma ferramenta de design', correct: false },
      { text: 'Um banco de dados', correct: false },
    ],
  },
  {
    id: 2,
    question: 'Qual tag cria um parágrafo?',
    options: [
      { text: '<p>', correct: true },
      { text: '<text>', correct: false },
      { text: '<pg>', correct: false },
      { text: '<paragraph>', correct: false },
    ],
  },
  {
    id: 3,
    question: 'Qual destas tags exibe uma imagem?',
    options: [
      { text: '<img>', correct: true },
      { text: '<image>', correct: false },
      { text: '<picture>', correct: false },
      { text: '<src>', correct: false },
    ],
  },
  {
    id: 4,
    question: 'Qual atributo define o link de <a>?',
    options: [
      { text: 'ref', correct: false },
      { text: 'url', correct: false },
      { text: 'href', correct: true },
      { text: 'link', correct: false },
    ],
  },
  {
    id: 5,
    question: 'Qual tag representa o maior título?',
    options: [
      { text: '<h1>', correct: true },
      { text: '<h6>', correct: false },
      { text: '<title>', correct: false },
      { text: '<header>', correct: false },
    ],
  },
];

export default function HtmlMiniBoss() {
  const router = useRouter();
  const { colors } = useTheme();

  const [step, setStep] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizStep, setQuizStep] = useState(0);
  const [bossHealth, setBossHealth] = useState<number>(100);
  const [playerLives, setPlayerLives] = useState<number>(5);

  const currentSlide = SLIDES[step];
  const currentQuestion = QUIZ_QUESTIONS[quizStep];

  const handleContinue = () => {
    if (step < SLIDES.length - 1) setStep(step + 1);
    else setShowQuiz(true);
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null) return;

    const isCorrect = currentQuestion.options[selectedAnswer].correct;

    if (isCorrect) {
      const newBossHealth = Math.max(0, bossHealth - 20);
      setBossHealth(newBossHealth);
      if (newBossHealth <= 0) {
        router.push('/');
        return;
      }
    } else {
      const newLives = Math.max(0, playerLives - 1);
      setPlayerLives(newLives);
      if (newLives <= 0) {
        router.push('/');
        return;
      }
    }

    setSelectedAnswer(null);

    // Evita estourar o array → CORREÇÃO DO SEU ERRO
    if (quizStep + 1 >= QUIZ_QUESTIONS.length) {
      router.push('/');
      return;
    }

    setQuizStep((v) => v + 1);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {!showQuiz ? (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          
          <TouchableOpacity style={[styles.closeButton, { backgroundColor: colors.card }]} onPress={() => router.back()}>
            <Text style={[styles.closeX, { color: colors.text }]}>✕</Text>
          </TouchableOpacity>

          <View style={styles.topRow}>
            <View style={styles.heartsRow}>
              {[0,1,2,3,4].map((i) => (
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

          {currentSlide.contentType === 'text' && (
            <View style={[styles.bubbleContainer, { borderColor: '#21421f', backgroundColor: colors.card }]}>
              <Text style={[styles.bubbleText, { color: colors.text }]}>{currentSlide.bubble}</Text>
            </View>
          )}

          {currentSlide.contentType === 'code' && (
            <>
              <View style={[styles.codeBlock, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.codeText, { color: colors.text }]}>{currentSlide.code}</Text>
              </View>
              <View style={[styles.bubbleContainer, { borderColor: '#21421f', backgroundColor: colors.card }]}>
                <Text style={[styles.bubbleText, { color: colors.text }]}>{currentSlide.bubble}</Text>
              </View>
            </>
          )}

          {currentSlide.contentType === 'lists' && (
            <>
              {currentSlide.lists?.map((list, idx) => (
                <View key={idx} style={styles.listSection}>
                  <Text style={[styles.listTitle, { color: colors.text }]}>{list.title}</Text>
                  <View style={styles.listRow}>
                    <View style={[styles.codeBlock, { backgroundColor: colors.card, borderColor: colors.border, flex: 1 }]}>
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

          <TouchableOpacity
            style={[styles.continueButton, { backgroundColor: colors.primary }]}
            onPress={handleContinue}
          >
            <Text style={styles.continueText}>CONTINUAR ➜</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.quizScroll} showsVerticalScrollIndicator={false}>
          
          <TouchableOpacity style={[styles.closeButton, { backgroundColor: colors.card }]} onPress={() => router.back()}>
            <Text style={[styles.closeX, { color: colors.text }]}>✕</Text>
          </TouchableOpacity>

          <View style={styles.quizHeader}>
            <View style={styles.healthBarContainer}>
              <View style={[styles.healthBarBg, { backgroundColor: colors.border }]}>
                <View style={[styles.healthBarFill, { width: `${bossHealth}%` }]} />
              </View>
              <Image source={require('../assets/images/vilao.png')} style={styles.vilaoImageSmall} />
            </View>
          </View>

          <View style={[styles.questionBubble, { borderColor: '#21421f', backgroundColor: colors.card }]}>
            <Text style={[styles.questionBubbleText, { color: colors.text }]}>
              {currentQuestion.question}
            </Text>
          </View>

          <View style={styles.bossWrap}>
            <Image source={require('../assets/images/htmlboss.png')} style={styles.bossImageQuiz} />
          </View>

          <View style={styles.playerHeartsContainer}>
            {[0,1,2,3,4].map((i) => (
              <Image
                key={i}
                source={ i < playerLives ? require('../assets/images/heart.png') : require('../assets/images/brokenheart.png') }
                style={styles.heartImage}
              />
            ))}
          </View>

          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: selectedAnswer === index ? colors.primary : colors.card,
                    borderColor: colors.border,
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
            style={[
              styles.continueButton,
              { backgroundColor: selectedAnswer !== null ? colors.primary : colors.border },
            ]}
            onPress={handleAnswerSubmit}
            disabled={selectedAnswer === null}
          >
            <Text style={[styles.continueText, { color: selectedAnswer !== null ? '#fff' : colors.secondaryText }]}>
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
    justifyContent: 'center'
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
    width: '80%',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    elevation: 3
  },
  continueText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  /* QUIZ */
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
});
