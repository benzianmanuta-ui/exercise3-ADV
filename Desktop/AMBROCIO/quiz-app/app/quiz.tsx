import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { questions } from '@/questions';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface Answer {
  [key: number]: number | null;
}

export default function QuizScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer>({});
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Initialize answers object
    const initialAnswers: Answer = {};
    questions.forEach((q) => {
      initialAnswers[q.id] = null;
    });
    setAnswers(initialAnswers);
  }, []);

  const handleSelectAnswer = (optionIndex: number) => {
    setAnswers({
      ...answers,
      [questions[currentQuestion].id]: optionIndex,
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz completed, calculate score
      let finalScore = 0;
      questions.forEach((q) => {
        if (answers[q.id] === q.correctAnswer) {
          finalScore++;
        }
      });
      setScore(finalScore);
      // Navigate to results screen
      router.replace({
        pathname: '/results',
        params: {
          score: finalScore,
          totalQuestions: questions.length,
          answers: JSON.stringify(answers),
        },
      } as any);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const question = questions[currentQuestion];
  const selectedAnswer = answers[question?.id];

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          <ThemedText type="subtitle">
            Question {currentQuestion + 1} of {questions.length}
          </ThemedText>
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
              onPress={() => handleSelectAnswer(index)}>
              <ThemedText
                style={{
                  color: selectedAnswer === index ? '#fff' : colors.text,
                }}>
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
          disabled={currentQuestion === 0}>
          <ThemedText style={styles.buttonText}>Previous</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton,
            {
              backgroundColor: colors.tint,
            },
          ]}
          onPress={handleNext}>
          <ThemedText style={styles.buttonText}>
            {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
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
  content: {
    paddingBottom: 120,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginTop: 8,
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
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
