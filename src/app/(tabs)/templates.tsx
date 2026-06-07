import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Title, Searchbar, FAB, useTheme, Surface } from 'react-native-paper';
import { TEMPLATES } from '../../data/templates';
import { TemplateCard } from '../../components/TemplateCard';
import { useTemplates } from '../../context/TemplateContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TemplatesScreen() {
  const { selectedTemplate, selectTemplate } = useTemplates();
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();

  const filteredTemplates = TEMPLATES.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View className="flex-1 bg-[#F8FAFC] dark:bg-slate-900">
      <Surface className="bg-white dark:bg-slate-800 px-4 pt-4 pb-6 rounded-b-[32px] mb-4" elevation={2}>
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Title className="text-2xl font-black text-slate-900 dark:text-white">Design Hub</Title>
            <Text className="text-slate-400 text-sm font-medium">Choose your document aesthetic</Text>
          </View>
          <View className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-2xl">
            <MaterialCommunityIcons name="auto-fix" size={24} color={theme.colors.primary} />
          </View>
        </View>

        <Searchbar
          placeholder="Search templates or styles..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          className="bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 elevation-0 rounded-2xl"
          inputStyle={{ fontSize: 14 }}
          iconColor={theme.colors.primary}
        />
      </Surface>

      <ScrollView 
        className="flex-1 px-4 pt-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between mb-4 px-1">
          <Text className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-widest">
            {filteredTemplates.length} Styles Available
          </Text>
          <MaterialCommunityIcons name="filter-variant" size={20} color={theme.colors.outline} />
        </View>
        
        <View className="pb-24">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplate?.id === template.id}
              onSelect={() => selectTemplate(template)}
            />
          ))}

          {filteredTemplates.length === 0 && (
            <View className="items-center justify-center py-20">
              <MaterialCommunityIcons name="file-search-outline" size={64} color={theme.colors.outline} />
              <Text className="text-slate-400 mt-4 font-medium">No templates match your search</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {selectedTemplate && (
        <FAB
          icon="check-bold"
          label={`Apply ${selectedTemplate.name}`}
          className="absolute m-6 right-0 bottom-0 rounded-2xl shadow-xl"
          style={{ backgroundColor: selectedTemplate.primaryColor }}
          onPress={() => {}}
          color="white"
        />
      )}
    </View>
  );
}
