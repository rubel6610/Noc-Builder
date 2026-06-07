import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Card, Title, Paragraph, Button, useTheme, Avatar, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useHistory } from '../../context/HistoryContext';

export default function HomeScreen() {
  const theme = useTheme();
  const { history } = useHistory();

  const stats = {
    total: history.length,
    today: history.filter(h => h.generatedDate.startsWith(new Date().toISOString().split('T')[0])).length,
    templates: 5
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-slate-900">
      <Surface className="bg-white dark:bg-slate-800 px-6 pt-4 pb-8 rounded-b-[40px] mb-6" elevation={2}>
        <View className="flex-row items-center justify-between mb-8">
          <View>
            <Text className="text-3xl font-black text-slate-900 dark:text-white">Dashboard</Text>
            <Text className="text-slate-400 font-medium">NOC Management Suite</Text>
          </View>
          <Avatar.Image size={50} source={{ uri: 'https://i.pravatar.cc/150?u=noc' }} />
        </View>

        <View className="flex-row justify-between">
          <View className="items-center w-1/3">
            <Text className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{stats.total}</Text>
            <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total NOCs</Text>
          </View>
          <View className="items-center w-1/3 border-x border-slate-100 dark:border-slate-700">
            <Text className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats.today}</Text>
            <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Today</Text>
          </View>
          <View className="items-center w-1/3">
            <Text className="text-2xl font-black text-amber-600 dark:text-amber-400">{stats.templates}</Text>
            <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Styles</Text>
          </View>
        </View>
      </Surface>

      <View className="px-6">
        <Title className="mb-4 font-black text-slate-800 dark:text-slate-200">Quick Actions</Title>
        
        <View className="flex-row gap-4 mb-8">
          <Card className="flex-1 bg-indigo-600 rounded-3xl" onPress={() => {}}>
            <Card.Content className="items-center py-6">
              <MaterialCommunityIcons name="plus-circle" size={32} color="white" />
              <Text className="text-white font-bold mt-2">New NOC</Text>
            </Card.Content>
          </Card>
          
          <Card className="flex-1 bg-white dark:bg-slate-800 rounded-3xl" elevation={1}>
            <Card.Content className="items-center py-6">
              <MaterialCommunityIcons name="file-document-multiple-outline" size={32} color={theme.colors.primary} />
              <Text className="font-bold mt-2 dark:text-white">Templates</Text>
            </Card.Content>
          </Card>
        </View>

        <View className="flex-row justify-between items-center mb-4">
          <Title className="font-black text-slate-800 dark:text-slate-200">Recent Activity</Title>
          <Button mode="text" compact labelStyle={{ fontWeight: 'bold' }}>View All</Button>
        </View>

        {history.length === 0 ? (
          <Surface className="p-8 rounded-[32px] items-center bg-white dark:bg-slate-800 border-2 border-dashed border-slate-100 dark:border-slate-700">
             <MaterialCommunityIcons name="timer-sand-empty" size={40} color={theme.colors.outline} />
             <Text className="mt-4 text-slate-400 font-medium">No recent documents found</Text>
          </Surface>
        ) : (
          history.slice(0, 3).map((item) => (
            <Card key={item.id} className="mb-4 bg-white dark:bg-slate-800 rounded-2xl" elevation={1}>
              <Card.Title
                title={item.employeeName}
                subtitle={`Ref: ${item.serialNumber} • ${new Date(item.generatedDate).toLocaleDateString()}`}
                titleStyle={{ fontWeight: 'bold' }}
                left={(props) => <Avatar.Icon {...props} icon="file-pdf-box" size={40} style={{ backgroundColor: '#FEE2E2' }} color="#EF4444" />}
                right={(props) => <IconButton {...props} icon="chevron-right" />}
              />
            </Card>
          ))
        )}
      </View>
      <View className="h-20" />
    </ScrollView>
  );
}
