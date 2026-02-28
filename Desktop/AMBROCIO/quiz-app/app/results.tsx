import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { questions } from '@/questions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function ResultsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { score: scoreParam, totalQuestions: totalParam, answers: answersParam } = useLocalSearchParams();

  const [highestScore, setHighestScore] = useState(0);
  const score = parseInt(scoreParam as string) || 0;
  const totalQuestions = parseInt(totalParam as string) || questions.length;

  useEffect(() => {
    loadAndUpdateHighestScore();
  }, []);

  const loadAndUpdateHighestScore = async () => {
    try {
      const savedScore = await AsyncStorage.getItem('highestScore');
      const currentHighest = savedScore ? parseInt(savedScore) : 0;
      
      if (score > currentHighest) {
        await AsyncStorage.setItem('highestScore', score.toString());
        setHighestScore(score);
      } else {
        setHighestScore(currentHighest);
      }
    } catch (error) {
      console.error('Error loading highest score:', error);
    }
  };

  const percentage = ((score / totalQuestions) * 100).toFixed(1);

  const getScoreMessage = () => {
    const percent = parseFloat(percentage);
    if (percent === 100) return 'Perfect Score!';
    if (percent >= 80) return 'Excellent!';
    if (percent >= 60) return 'Good Job!';
    if (percent >= 40) return 'Not Bad!';
    return 'Keep Practicing!';
  };

  const handleRetakeQuiz = () => {
    router.replace('/quiz' as any);
  };

  const handleGoHome = () => {
    router.replace('/(tabs)' as any);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        {/* Message */}
        <ThemedText type="title" style={styles.message}>
          {getScoreMessage()}
        </ThemedText>

        {/* Score Display */}
        <View style={styles.scoreCard}>
          <ThemedText type="subtitle" style={styles.scoreLabel}>
            Your Score
          </ThemedText>
          <View style={styles.scoreDisplay}>
            <ThemedText style={styles.scoreNumber}>{score}</ThemedText>
            <ThemedText style={styles.scoreTotal}>/ {totalQuestions}</ThemedText>
          </View>
          <ThemedText style={styles.percentage}>{percentage}%</ThemedText>
        </View>

        {/* Highest Score */}
        <View style={[styles.highestScoreCard, { borderColor: colors.tint }]}>
          <ThemedText type="subtitle">Highest Score</ThemedText>
          <ThemedText style={styles.highestScoreNumber}>{highestScore}</ThemedText>
          <ThemedText style={styles.highestScoreTotal}>of {totalQuestions}</ThemedText>
        </View>

        {/* Results Summary */}
        <View style={styles.summaryContainer}>
          <ThemedText type="subtitle">Summary</ThemedText>
          <View style={styles.summaryItem}>
            <ThemedText>Questions Answered: {totalQuestions}</ThemedText>
          </View>
          <View style={styles.summaryItem}>
            <ThemedText>Correct Answers: {score}</ThemedText>
          </View>
          <View style={styles.summaryItem}>
            <ThemedText>Incorrect Answers: {totalQuestions - score}</ThemedText>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.tint }]}
          onPress={handleRetakeQuiz}>
          <ThemedText style={styles.buttonText}>Retake Quiz</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.tabIconDefault, borderWidth: 2, borderColor: colors.tint }]}
          onPress={handleGoHome}>
          <ThemedText style={styles.buttonText}>Go Home</ThemedText>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 32,
    marginBottom: 32,
    textAlign: 'center',
  },
  scoreCard: {
    alignItems: 'center',
    marginBottom: 32,
  },
  scoreLabel: {
    marginBottom: 8,
  },
  scoreDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  scoreNumber: {
    fontSize: 64,
    fontWeight: 'bold',
  },
  scoreTotal: {
    fontSize: 24,
  },
  percentage: {
    fontSize: 20,
    marginTop: 8,
    opacity: 0.8,
  },
  highestScoreCard: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 2,
    marginBottom: 32,
    width: '100%',
  },
  highestScoreNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 8,
  },
  highestScoreTotal: {
    fontSize: 16,
    marginTop: 4,
    opacity: 0.8,
  },
  summaryContainer: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  summaryItem: {
    paddingVertical: 8,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
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
