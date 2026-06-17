import React from 'react';
import { View, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Text, Card, Title, Paragraph, Button, Avatar, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-slate-900">
      <Surface className="bg-white dark:bg-slate-800 px-6 pt-4 pb-8 rounded-b-[40px] mb-6" elevation={2}>
        <View className="flex-row items-center justify-between mb-8">
          <View>
            <Text className="text-3xl font-black text-slate-900 dark:text-white">Dashboard</Text>
            <Text className="text-slate-400 font-medium">Template-based NOC PDF generator</Text>
          </View>
          <Avatar.Image size={50} source={{ uri: 'https://i.pravatar.cc/150?u=noc' }} />
        </View>

        <View className="flex-row justify-between">
          <View className="items-center w-1/3">
            <Text className="text-2xl font-black text-indigo-600 dark:text-indigo-400">1</Text>
            <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">PDF Flow</Text>
          </View>
          <View className="items-center w-1/3 border-x border-slate-100 dark:border-slate-700">
            <Text className="text-2xl font-black text-emerald-600 dark:text-emerald-400">0</Text>
            <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">DB Saves</Text>
          </View>
          <View className="items-center w-1/3">
            <Text className="text-2xl font-black text-amber-600 dark:text-amber-400">5</Text>
            <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Styles</Text>
          </View>
        </View>
      </Surface>

      <View className="px-6">
        <Title className="mb-4 font-black text-slate-800 dark:text-slate-200">Quick Actions</Title>

        <View className="flex-row gap-4 mb-8">
          <Card className="flex-1 bg-indigo-600 rounded-3xl" onPress={() => router.push('/(tabs)/create')}>
            <Card.Content className="items-center py-6">
              <MaterialCommunityIcons name="plus-circle" size={32} color="white" />
              <Text className="text-white font-bold mt-2">New NOC</Text>
            </Card.Content>
          </Card>

          <Card className="flex-1 bg-white dark:bg-slate-800 rounded-3xl" elevation={1} onPress={() => router.push('/(tabs)/templates')}>
            <Card.Content className="items-center py-6">
              <MaterialCommunityIcons name="file-document-multiple-outline" size={32} color="#4F46E5" />
              <Text className="font-bold mt-2 dark:text-white">Templates</Text>
            </Card.Content>
          </Card>
        </View>

        <Title className="font-black text-slate-800 dark:text-slate-200 mb-4">Current Flow</Title>

        <Surface className="p-8 rounded-[32px] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
          <Paragraph className="text-slate-500 dark:text-slate-400 leading-6">
            Choose a template, enter the employee details, preview the NOC, and generate the PDF directly.
            The app does not keep a document history or database archive.
          </Paragraph>
          <Button
            mode="contained"
            onPress={() => router.push('/(tabs)/templates')}
            className="mt-6 rounded-2xl"
          >
            Choose Template
          </Button>
        </Surface>
      </View>
      <View className="h-20" />
    </ScrollView>
  );
}
