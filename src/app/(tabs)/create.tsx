import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Button, Title, Paragraph, List, Divider, Surface, useTheme, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NocForm } from '../../components/NocForm';
import { NocPreview } from '../../components/NocPreview';
import { useTemplates } from '../../context/TemplateContext';

export default function CreateNocScreen() {
  const [showForm, setShowForm] = useState(false);
  const theme = useTheme();
  const { selectedTemplate } = useTemplates();

  if (showForm) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={{ flex: 1 }}
      >
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
          contentContainerStyle={{ paddingBottom: 140 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {!selectedTemplate ? (
            <Surface className="mx-5 mt-5 p-5 rounded-[24px] bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800" elevation={1}>
              <Text className="font-black text-amber-900 dark:text-amber-100 mb-2">Template required</Text>
              <Paragraph className="text-amber-800 dark:text-amber-200">
                Select a template first. The PDF is generated from your chosen style and the form data below.
              </Paragraph>
            </Surface>
          ) : null}

          <NocForm />
          <Divider className="my-8 opacity-0" />
          <NocPreview />
          <View className="h-20" />
        </ScrollView>
      </KeyboardAvoidingView>
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
          Generate a NOC PDF directly from the selected template and the form data you enter.
        </Paragraph>
      </View>

      <View className="px-6">
        <Text className="text-gray-400 font-bold uppercase text-[10px] mb-4 px-2 tracking-widest">Workflow Options</Text>

        <Surface className="bg-white dark:bg-slate-800 rounded-[32px] mb-8 overflow-hidden border border-slate-100 dark:border-slate-700" elevation={1}>
          <List.Item
            title="Generate New NOC"
            description="Fill the form and download the PDF directly"
            left={props => <View className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-2xl ml-2"><MaterialCommunityIcons {...props} name="file-document-outline" color="#4F46E5" /></View>}
            right={props => <IconButton {...props} icon="chevron-right" />}
            onPress={() => setShowForm(true)}
            className="py-5"
            titleStyle={{ fontWeight: '900', fontSize: 16 }}
          />
          <Divider className="mx-4" />
          <List.Item
            title="Template Driven"
            description={selectedTemplate ? `Using ${selectedTemplate.name}` : 'Pick a template from the Templates tab first'}
            left={props => <View className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-2xl ml-2"><MaterialCommunityIcons {...props} name="palette-outline" color="#10B981" /></View>}
            right={props => <IconButton {...props} icon="chevron-right" />}
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
            Ensure the entered details match the employee identity documents before you generate the PDF.
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
