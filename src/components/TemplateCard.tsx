import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Card, Text, Title, Paragraph, Button, useTheme, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Template } from '../data/templates';

interface TemplateCardProps {
  template: Template;
  isSelected: boolean;
  onSelect: () => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, isSelected, onSelect }) => {
  const theme = useTheme();

  return (
    <Card 
      className={`mb-6 overflow-hidden rounded-[32px] bg-white dark:bg-slate-800 ${isSelected ? 'border-2' : 'border-0'}`}
      style={{ 
        elevation: isSelected ? 12 : 2,
        borderColor: isSelected ? template.primaryColor : 'transparent'
      }}
    >
      <TouchableOpacity activeOpacity={0.9} onPress={onSelect}>
        {/* Color Preview Header */}
        <View 
          style={{ backgroundColor: template.primaryColor }} 
          className="h-28 items-center justify-center relative"
        >
          <View 
            className="absolute top-0 right-0 p-3 opacity-10"
          >
             <MaterialCommunityIcons name="file-document" size={100} color="white" />
          </View>
          
          <View className="bg-white/20 p-4 rounded-3xl border border-white/30 backdrop-blur-md">
            <MaterialCommunityIcons name="palette-swatch-outline" size={36} color="white" />
          </View>
          
          {isSelected && (
            <View className="absolute top-4 right-4 bg-white rounded-full p-1 shadow-lg">
              <MaterialCommunityIcons name="check-bold" size={24} color={template.primaryColor} />
            </View>
          )}
        </View>

        <Card.Content className="mt-6">
          <View className="flex-row justify-between items-start mb-3">
            <View className="flex-1">
              <Text className="text-gray-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[2px]">
                {template.category}
              </Text>
              <Title className="text-2xl font-black text-slate-800 dark:text-white mt-1">{template.name}</Title>
            </View>
          </View>

          <Paragraph className="text-gray-500 dark:text-slate-400 mb-6 text-sm font-medium leading-5">
            {template.description}
          </Paragraph>

          <View className="flex-row flex-wrap gap-2 mb-6">
            {template.features.slice(0, 3).map((feature, idx) => (
              <Chip 
                key={idx} 
                textStyle={{ fontSize: 10, fontWeight: 'bold', color: isSelected ? 'white' : '#4B5563' }}
                style={{ 
                  backgroundColor: isSelected ? template.primaryColor : template.accentColor, 
                  height: 28,
                  borderRadius: 10
                }}
              >
                {feature}
              </Chip>
            ))}
          </View>

          <View className="flex-row items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700">
            <View className="flex-row gap-2">
              <View 
                style={{ backgroundColor: template.primaryColor }} 
                className="w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 shadow-sm" 
              />
              <View 
                style={{ backgroundColor: template.secondaryColor }} 
                className="w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 shadow-sm" 
              />
              <View 
                style={{ backgroundColor: template.accentColor }} 
                className="w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 shadow-sm" 
              />
            </View>
            
            <Button 
              mode={isSelected ? "contained" : "outlined"} 
              onPress={onSelect}
              buttonColor={isSelected ? template.primaryColor : undefined}
              textColor={isSelected ? "white" : template.primaryColor}
              style={{ borderRadius: 12, borderWidth: 1.5 }}
              labelStyle={{ fontSize: 12, fontWeight: 'black' }}
            >
              {isSelected ? 'ACTIVE' : 'SELECT STYLE'}
            </Button>
          </View>
        </Card.Content>
      </TouchableOpacity>
    </Card>
  );
};
