import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HistoryItem } from '../types/history';

interface HistoryContextType {
  history: HistoryItem[];
  addToHistory: (item: Omit<HistoryItem, 'id' | 'generatedDate' | 'serialNumber'>) => Promise<string>;
  deleteFromHistory: (id: string) => Promise<void>;
  refreshHistory: () => Promise<void>;
  getNextSerialNumber: () => string;
  isLoading: boolean;
}

const HISTORY_STORAGE_KEY = '@noc_builder_history';

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      const storedHistory = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const getNextSerialNumber = () => {
    const year = new Date().getFullYear();
    const count = history.length + 1;
    const paddedCount = count.toString().padStart(5, '0');
    return `NOC-${year}-${paddedCount}`;
  };

  const addToHistory = async (item: Omit<HistoryItem, 'id' | 'generatedDate' | 'serialNumber'>) => {
    try {
      const serialNumber = getNextSerialNumber();
      const newItem: HistoryItem & { serialNumber: string } = {
        ...item,
        id: Date.now().toString(),
        generatedDate: new Date().toISOString(),
        serialNumber,
      };
      
      const updatedHistory = [newItem, ...history];
      setHistory(updatedHistory);
      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
      return serialNumber;
    } catch (error) {
      console.error('Failed to add to history:', error);
      return '';
    }
  };

  const deleteFromHistory = async (id: string) => {
    try {
      const updatedHistory = history.filter(item => item.id !== id);
      setHistory(updatedHistory);
      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Failed to delete from history:', error);
    }
  };

  return (
    <HistoryContext.Provider value={{ 
      history, 
      addToHistory, 
      deleteFromHistory, 
      refreshHistory: loadHistory,
      getNextSerialNumber,
      isLoading 
    }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}
