import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useQuiz } from '@/context/QuizContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface Answer {
  [key: number]: number | null;
}

export default function PreviewQuizScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { questions, quizTime } = useQuiz();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer>({});
  const [timeLeft, setTimeLeft] = useState(quizTime);
  const [quizActive, setQuizActive] = useState(false);

  useEffect(() => {
    // Initialize answers object
    const initialAnswers: Answer = {};
    questions.forEach((q) => {
      initialAnswers[q.id] = null;
    });
    setAnswers(initialAnswers);
    setTimeLeft(quizTime);
  }, [questions, quizTime]);

  useEffect(() => {
    if (!quizActive) return;

    if (timeLeft <= 0) {
      handleSubmitQuiz();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, quizActive]);

  const handleStartQuiz = () => {
    setQuizActive(true);
    setTimeLeft(quizTime);
  };

  const handleSelectAnswer = (optionIndex: number) => {
    if (quizActive) {
      setAnswers({
        ...answers,
        [questions[currentQuestion].id]: optionIndex,
      });
    }
  };

  const handleNext = () => {
    if (!quizActive) return;
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (!quizActive) return;
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = () => {
    if (questions.length === 0) {
      Alert.alert('No Questions', 'Please add questions in Quiz Settings');
      return;
    }
    setQuizActive(false);
    
    let finalScore = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        finalScore++;
      }
    });

    router.push({
      pathname: '/results',
      params: {
        score: finalScore,
        totalQuestions: questions.length,
        answers: JSON.stringify(answers),
      },
    } as any);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!quizActive) {
    return (
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText type="title" style={styles.title}>Welcome to Quiz Preview</ThemedText>
          <ThemedText type="subtitle" style={styles.subtitle}>
            {questions.length} Questions
          </ThemedText>
          <ThemedText style={styles.infoText}>
            Each question has 4 options. Carefully select your answers.
          </ThemedText>
          <ThemedText style={styles.timeText}>
            Time Limit: {formatTime(quizTime)}
          </ThemedText>
        </ScrollView>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.tint }]}
          onPress={handleStartQuiz}
          disabled={questions.length === 0}
        >
          <ThemedText style={styles.buttonText}>Start Quiz</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  if (questions.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.emptyContainer}>
          <ThemedText type="subtitle">No Questions</ThemedText>
          <ThemedText style={styles.emptyText}>
            Please add questions in Quiz Settings to start the quiz
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  const question = questions[currentQuestion];
  const selectedAnswer = answers[question?.id];

  return (
    <ThemedView style={styles.container}>
      {/* Timer and Progress */}
      <View style={styles.header}>
        <View style={[styles.timerBox, { borderColor: timeLeft <= 30 ? '#ff3333' : colors.tint }]}>
          <ThemedText style={[styles.timerText, { color: timeLeft <= 30 ? '#ff3333' : colors.tint }]}>
            {formatTime(timeLeft)}
          </ThemedText>
        </View>
        <ThemedText style={styles.progressText}>
          {currentQuestion + 1} / {questions.length}
        </ThemedText>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Progress bar */}
        <View style={[styles.progressBar, { backgroundColor: colors.tabIconDefault }]}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                backgroundColor: colors.tint,
              },
            ]}
          />
        </View>

        {/* Question */}
        <View style={styles.questionContainer}>
          <ThemedText type="subtitle" style={styles.questionText}>
            {question?.question}
          </ThemedText>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {question?.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                {
                  borderColor: colors.tint,
                  backgroundColor:
                    selectedAnswer === index
                      ? colors.tint
                      : colors.tabIconDefault,
                },
              ]}
              onPress={() => handleSelectAnswer(index)}
            >
              <ThemedText
                style={{
                  color: selectedAnswer === index ? '#fff' : colors.text,
                }}
              >
                {option}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Navigation buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.navButton,
            {
              backgroundColor: currentQuestion === 0 ? colors.tabIconDefault : colors.tint,
              opacity: currentQuestion === 0 ? 0.5 : 1,
            },
          ]}
          onPress={handlePrevious}
          disabled={currentQuestion === 0}
        >
          <ThemedText style={styles.buttonText}>Previous</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton,
            {
              backgroundColor: colors.tint,
            },
          ]}
          onPress={currentQuestion === questions.length - 1 ? handleSubmitQuiz : handleNext}
        >
          <ThemedText style={styles.buttonText}>
            {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  timerBox: {
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  timerText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    paddingBottom: 160,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 24,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  questionContainer: {
    marginBottom: 32,
    paddingVertical: 16,
  },
  questionText: {
    fontSize: 18,
    lineHeight: 26,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    flexDirection: 'row',
    gap: 12,
  },
  navButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 12,
    textAlign: 'center',
    opacity: 0.7,
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  infoText: {
    marginVertical: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  timeText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
