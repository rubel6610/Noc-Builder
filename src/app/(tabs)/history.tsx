import React, { useState, useMemo } from 'react';
import { View, FlatList, Alert } from 'react-native';
import { Text, List, Avatar, useTheme, Chip, Searchbar, IconButton, Surface, ActivityIndicator } from 'react-native-paper';
import { useHistory } from '../../context/HistoryContext';
import * as Sharing from 'expo-sharing';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HistoryScreen() {
  const theme = useTheme();
  const { history, deleteFromHistory, isLoading } = useHistory();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'today' | 'recent'>('all');

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchesSearch = 
        item.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.emiratesId.includes(searchQuery) ||
        item.templateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      if (filterStatus === 'today') {
        const today = new Date().toISOString().split('T')[0];
        return item.generatedDate.startsWith(today);
      }
      
      return true;
    });
  }, [history, searchQuery, filterStatus]);

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Delete Record',
      `Are you sure you want to delete the NOC record for ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteFromHistory(id) 
        },
      ]
    );
  };

  const handleShare = async (path: string) => {
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(path);
      } else {
        Alert.alert('Error', 'Sharing is not available on this device');
      }
    } catch (error) {
      console.error('Error sharing PDF from history:', error);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-slate-900">
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text className="mt-4 text-slate-500 font-medium">Loading Archive...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F8FAFC] dark:bg-slate-900">
      <Surface className="bg-white dark:bg-slate-800 px-4 pt-4 pb-6 rounded-b-[32px] mb-4" elevation={2}>
        <View className="mb-6 flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-black text-slate-900 dark:text-white">NOC Archive</Text>
            <Text className="text-slate-400 text-sm font-medium">Manage your generated documents</Text>
          </View>
          <View className="bg-slate-50 dark:bg-slate-700 p-3 rounded-2xl">
            <MaterialCommunityIcons name="history" size={24} color={theme.colors.primary} />
          </View>
        </View>

        <Searchbar
          placeholder="Search by name, ID or Serial..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          className="bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 elevation-0 rounded-2xl mb-4"
          inputStyle={{ fontSize: 14 }}
        />
        
        <View className="flex-row space-x-2">
          <Chip 
            selected={filterStatus === 'all'} 
            onPress={() => setFilterStatus('all')}
            showSelectedOverlay
            className="rounded-lg"
          >
            All Time
          </Chip>
          <Chip 
            selected={filterStatus === 'today'} 
            onPress={() => setFilterStatus('today')}
            showSelectedOverlay
            className="rounded-lg"
          >
            Today
          </Chip>
        </View>
      </Surface>

      <FlatList
        data={filteredHistory}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <View className="bg-slate-100 dark:bg-slate-800 p-8 rounded-full mb-4">
              <MaterialCommunityIcons name="folder-open-outline" size={64} color={theme.colors.outline} />
            </View>
            <Text className="text-slate-400 font-bold text-lg">No records found</Text>
            <Text className="text-slate-400 text-center px-10 mt-2">
              Start by creating a new NOC. All your generated documents will appear here.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Surface className="bg-white dark:bg-slate-800 rounded-[24px] mb-4 overflow-hidden border border-slate-100 dark:border-slate-700" elevation={1}>
            <List.Item
              title={item.employeeName}
              titleStyle={{ fontWeight: '900', color: theme.colors.onSurface, fontSize: 16 }}
              description={`Ref: ${item.serialNumber}\nTemplate: ${item.templateName}\n${new Date(item.generatedDate).toLocaleDateString()}`}
              descriptionStyle={{ color: theme.colors.outline, fontSize: 12, lineHeight: 18 }}
              left={props => (
                <View className="justify-center pl-4 pr-2">
                  <Avatar.Icon 
                    {...props} 
                    icon="file-pdf-box" 
                    size={48} 
                    style={{ backgroundColor: '#FEE2E2' }} 
                    color="#EF4444" 
                  />
                </View>
              )}
              right={() => (
                <View className="flex-row items-center pr-2">
                  <IconButton 
                    icon="share-variant-outline" 
                    iconColor={theme.colors.primary} 
                    onPress={() => handleShare(item.pdfPath)} 
                  />
                  <IconButton 
                    icon="delete-outline" 
                    iconColor="#EF4444" 
                    onPress={() => handleDelete(item.id, item.employeeName)} 
                  />
                </View>
              )}
              className="py-3"
            />
          </Surface>
        )}
      />
    </View>
  );
}
