import React, { useState } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { Text, Button, Title, Paragraph, List, Divider, Surface, useTheme, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NocForm } from '../../components/NocForm';
import { NocPreview } from '../../components/NocPreview';

const { height } = Dimensions.get('window');

export default function CreateNocScreen() {
  const [showForm, setShowForm] = useState(false);
  const theme = useTheme();

  if (showForm) {
    return (
      <View className="flex-1 bg-gray-50 dark:bg-slate-900">
        <Surface className="bg-white dark:bg-slate-800 px-4 pt-2 pb-4 flex-row items-center border-b border-gray-100 dark:border-slate-700" elevation={1}>
          <IconButton 
            icon="arrow-left" 
            size={24} 
            onPress={() => setShowForm(false)} 
            iconColor={theme.colors.primary}
          />
          <Title className="text-lg font-black dark:text-white">New NOC Request</Title>
        </Surface>
        
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <NocForm />
          <Divider className="my-8 opacity-0" />
          <NocPreview />
          <View className="h-20" />
        </ScrollView>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-slate-900">
      <View className="p-8 items-center">
        <Surface className="p-10 rounded-full bg-blue-50 dark:bg-blue-900/20 mb-8 border-4 border-white dark:border-slate-800 shadow-xl" elevation={2}>
          <MaterialCommunityIcons name="file-plus" size={72} color="#4F46E5" />
        </Surface>
        <Title className="text-3xl font-black mb-2 dark:text-white">Create NOC</Title>
        <Paragraph className="text-center text-gray-500 dark:text-slate-400 mb-8 px-6 font-medium leading-5">
          Initialize a professional Network Operations Center request with instant validation and preview.
        </Paragraph>
      </View>

      <View className="px-6">
        <Text className="text-gray-400 font-bold uppercase text-[10px] mb-4 px-2 tracking-widest">Workflow Options</Text>
        
        <Surface className="bg-white dark:bg-slate-800 rounded-[32px] mb-8 overflow-hidden border border-slate-100 dark:border-slate-700" elevation={1}>
          <List.Item
            title="Standard Request"
            description="Start with a blank certified form"
            left={props => <View className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-2xl ml-2"><MaterialCommunityIcons {...props} name="file-document-outline" color="#4F46E5" /></View>}
            right={props => <IconButton icon="chevron-right" />}
            onPress={() => setShowForm(true)}
            className="py-5"
            titleStyle={{ fontWeight: '900', fontSize: 16 }}
          />
          <Divider className="mx-4" />
          <List.Item
            title="Use Last Session"
            description="Restore your previous form data"
            left={props => <View className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-2xl ml-2"><MaterialCommunityIcons {...props} name="history" color="#10B981" /></View>}
            right={props => <IconButton icon="chevron-right" />}
            onPress={() => setShowForm(true)}
            className="py-5"
            titleStyle={{ fontWeight: '900', fontSize: 16 }}
          />
        </Surface>

        <Surface className="bg-indigo-600 p-8 rounded-[40px] mb-12 overflow-hidden relative shadow-2xl" elevation={4}>
           <View className="absolute -top-20 -right-20 opacity-20">
              <MaterialCommunityIcons name="shield-check" size={240} color="white" />
           </View>
          <Title className="text-white mb-2 font-black text-2xl">Compliance Guide</Title>
          <Paragraph className="text-indigo-100 mb-6 leading-5 font-medium">
            Ensure all legal details match your ID and passport for rapid administrative approval.
          </Paragraph>
          <Button 
            mode="contained" 
            buttonColor="white" 
            textColor="#4F46E5" 
            onPress={() => {}}
            className="rounded-2xl py-1"
            labelStyle={{ fontWeight: 'black' }}
          >
            Review Guidelines
          </Button>
        </Surface>
      </View>
    </ScrollView>
  );
}
