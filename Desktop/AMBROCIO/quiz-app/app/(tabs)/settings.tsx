import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { QuizQuestion, useQuiz } from '@/context/QuizContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function QuizSettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { questions, quizTime, setQuizTime, addQuestion, updateQuestion, deleteQuestion } = useQuiz();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [tempTime, setTempTime] = useState(quizTime.toString());

  const [formData, setFormData] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
  });

  const handleAddQuestion = () => {
    if (!formData.question.trim()) {
      Alert.alert('Error', 'Please enter a question');
      return;
    }

    if (formData.options.some(opt => !opt.trim())) {
      Alert.alert('Error', 'All options must be filled');
      return;
    }

    if (editingId !== null) {
      updateQuestion(editingId, {
        id: editingId,
        question: formData.question,
        options: formData.options,
        correctAnswer: formData.correctAnswer,
      });
      Alert.alert('Success', 'Question updated');
    } else {
      addQuestion({
        id: 0,
        question: formData.question,
        options: formData.options,
        correctAnswer: formData.correctAnswer,
      });
      Alert.alert('Success', 'Question added');
    }

    setFormData({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
    });
    setEditingId(null);
    setShowAddModal(false);
  };

  const handleEditQuestion = (question: QuizQuestion) => {
    setFormData({
      question: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer,
    });
    setEditingId(question.id);
    setShowAddModal(true);
  };

  const handleDeleteQuestion = (id: number) => {
    Alert.alert('Delete Question', 'Are you sure you want to delete this question?', [
      {
        text: 'Cancel',
        onPress: () => {},
      },
      {
        text: 'Delete',
        onPress: () => {
          deleteQuestion(id);
          Alert.alert('Success', 'Question deleted');
        },
      },
    ]);
  };

  const handleSaveTime = () => {
    const time = parseInt(tempTime);
    if (isNaN(time) || time <= 0) {
      Alert.alert('Error', 'Please enter a valid time in seconds');
      return;
    }
    setQuizTime(time);
    setShowTimeModal(false);
    Alert.alert('Success', 'Quiz time updated');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        {/* Quiz Time Settings */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Quiz Settings</ThemedText>
          <TouchableOpacity
            style={[styles.timeCard, { borderColor: colors.tint }]}
            onPress={() => {
              setTempTime(quizTime.toString());
              setShowTimeModal(true);
            }}
          >
            <ThemedText style={styles.timeLabel}>Time Limit</ThemedText>
            <ThemedText style={[styles.timeValue, { color: colors.tint }]}>
              {formatTime(quizTime)}
            </ThemedText>
            <ThemedText style={styles.timeSubtext}>Tap to edit</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Questions Header */}
        <View style={styles.section}>
          <View style={styles.headerRow}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Questions ({questions.length})
            </ThemedText>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.tint }]}
              onPress={() => {
                setFormData({
                  question: '',
                  options: ['', '', '', ''],
                  correctAnswer: 0,
                });
                setEditingId(null);
                setShowAddModal(true);
              }}
            >
              <ThemedText style={styles.addButtonText}>+ Add</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Questions List */}
        {questions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>No questions added yet</ThemedText>
          </View>
        ) : (
          questions.map((q, index) => (
            <View key={q.id} style={[styles.questionItem, { borderLeftColor: colors.tint }]}>
              <View style={styles.questionHeader}>
                <ThemedText style={styles.questionNumber}>Q{index + 1}</ThemedText>
                <ThemedText style={styles.questionTitle} numberOfLines={2}>
                  {q.question}
                </ThemedText>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.tint }]}
                  onPress={() => handleEditQuestion(q)}
                >
                  <ThemedText style={styles.actionButtonText}>Edit</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#ff4444' }]}
                  onPress={() => handleDeleteQuestion(q.id)}
                >
                  <ThemedText style={styles.actionButtonText}>Delete</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Add/Edit Question Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <ThemedView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <ThemedText type="subtitle">
              {editingId ? 'Edit Question' : 'Add Question'}
            </ThemedText>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <ThemedText style={styles.closeButton}>×</ThemedText>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Question Input */}
            <ThemedText style={styles.label}>Question</ThemedText>
            <TextInput
              style={[styles.textInput, { color: colors.text, borderColor: colors.tint }]}
              placeholderTextColor={colors.text + '80'}
              placeholder="Enter question"
              value={formData.question}
              onChangeText={(text) => setFormData({ ...formData, question: text })}
              multiline
            />

            {/* Options */}
            <ThemedText style={styles.label}>Options</ThemedText>
            {formData.options.map((option, index) => (
              <View key={index} style={styles.optionInputRow}>
                <ThemedText style={styles.optionLabel}>{String.fromCharCode(65 + index)}</ThemedText>
                <TextInput
                  style={[styles.optionInput, { color: colors.text, borderColor: colors.tint }]}
                  placeholderTextColor={colors.text + '80'}
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChangeText={(text) => {
                    const newOptions = [...formData.options];
                    newOptions[index] = text;
                    setFormData({ ...formData, options: newOptions });
                  }}
                />
                {formData.correctAnswer === index && (
                  <ThemedText style={styles.correctBadge}>✓</ThemedText>
                )}
              </View>
            ))}

            {/* Correct Answer */}
            <ThemedText style={styles.label}>Correct Answer</ThemedText>
            <View style={styles.correctAnswerContainer}>
              {formData.options.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.answerButton,
                    {
                      backgroundColor: formData.correctAnswer === index ? colors.tint : colors.tabIconDefault,
                    },
                  ]}
                  onPress={() => setFormData({ ...formData, correctAnswer: index })}
                >
                  <ThemedText style={[styles.answerButtonText, { color: formData.correctAnswer === index ? '#fff' : colors.text }]}>
                    {String.fromCharCode(65 + index)}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Modal Actions */}
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.tabIconDefault }]}
              onPress={() => setShowAddModal(false)}
            >
              <ThemedText style={styles.modalButtonText}>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.tint }]}
              onPress={handleAddQuestion}
            >
              <ThemedText style={[styles.modalButtonText, { color: '#fff' }]}>
                {editingId ? 'Update' : 'Add'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </Modal>

      {/* Time Settings Modal */}
      <Modal
        visible={showTimeModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowTimeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.timeModalContent, { backgroundColor: colors.tabIconDefault }]}>
            <ThemedText type="subtitle" style={styles.timeModalTitle}>Set Quiz Time</ThemedText>
            <ThemedText style={styles.timeModalLabel}>Time in seconds</ThemedText>
            <TextInput
              style={[styles.timeModalInput, { color: colors.text, borderColor: colors.tint }]}
              placeholderTextColor={colors.text + '80'}
              placeholder="Enter time in seconds"
              value={tempTime}
              onChangeText={setTempTime}
              keyboardType="numeric"
            />
            <ThemedText style={styles.timePreview}>
              Preview: {formatTime(parseInt(tempTime) || 0)}
            </ThemedText>

            <View style={styles.timeModalActions}>
              <TouchableOpacity
                style={[styles.timeModalButton, { backgroundColor: colors.tabIconDefault, borderColor: colors.tint, borderWidth: 1 }]}
                onPress={() => setShowTimeModal(false)}
              >
                <ThemedText style={styles.timeModalButtonText}>Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.timeModalButton, { backgroundColor: colors.tint }]}
                onPress={handleSaveTime}
              >
                <ThemedText style={[styles.timeModalButtonText, { color: '#fff' }]}>Save</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  timeCard: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  timeSubtext: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 4,
  },
  questionItem: {
    borderLeftWidth: 4,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  questionNumber: {
    fontWeight: 'bold',
    fontSize: 16,
    opacity: 0.7,
    minWidth: 30,
  },
  questionTitle: {
    flex: 1,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    opacity: 0.5,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    paddingTop: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  closeButton: {
    fontSize: 32,
    fontWeight: 'bold',
    padding: 0,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  optionInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  optionLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    minWidth: 24,
  },
  optionInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  correctBadge: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#22bb22',
  },
  correctAnswerContainer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  answerButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  answerButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Time Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  timeModalContent: {
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 400,
  },
  timeModalTitle: {
    textAlign: 'center',
    marginBottom: 16,
  },
  timeModalLabel: {
    marginBottom: 8,
    fontWeight: '600',
  },
  timeModalInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  timePreview: {
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
    fontSize: 18,
  },
  timeModalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  timeModalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  timeModalButtonText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
});
