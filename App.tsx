import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet ,  } from 'react-native';
import { Header } from './components/Header';
import { KanbanBoard } from './components/KanbanBoard';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={'#3B82F6'} />
      <Header />
      <KanbanBoard />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});