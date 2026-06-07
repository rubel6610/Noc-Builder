import React from 'react';
import { View, ScrollView } from 'react-native';
import { List, Divider, Switch, Avatar, Title, Text, Button, Surface } from 'react-native-paper';
import { useAppTheme } from '../../context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const { isDarkMode, toggleDarkMode, theme } = useAppTheme();

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-slate-900">
      <Surface className="bg-white dark:bg-slate-800 p-8 items-center border-b border-gray-100 dark:border-slate-700" elevation={1}>
        <View className="relative">
          <Avatar.Image 
            size={100} 
            source={{ uri: 'https://i.pravatar.cc/300' }} 
          />
          <View className="absolute bottom-0 right-0 bg-blue-500 p-1 rounded-full border-2 border-white">
            <MaterialCommunityIcons name="check" size={16} color="white" />
          </View>
        </View>
        <Title className="mt-4 font-black">John Doe</Title>
        <Text className="text-gray-500 dark:text-gray-400 font-medium">Senior Network Engineer</Text>
        <Button mode="outlined" className="mt-6 px-8 rounded-xl border-2">Edit Profile</Button>
      </Surface>

      <List.Section className="mt-4">
        <List.Subheader className="font-bold uppercase tracking-widest text-[10px] text-gray-400">App Preferences</List.Subheader>
        <Surface className="mx-4 rounded-3xl overflow-hidden bg-white dark:bg-slate-800" elevation={1}>
          <List.Item
            title="Dark Mode"
            titleStyle={{ fontWeight: '600' }}
            left={props => <List.Icon {...props} icon="weather-night" color={isDarkMode ? '#818CF8' : '#64748B'} />}
            right={() => (
              <View className="justify-center mr-2">
                <Switch value={isDarkMode} onValueChange={toggleDarkMode} color={theme.colors.primary} />
              </View>
            )}
          />
          <Divider />
          <List.Item
            title="Biometric Lock"
            titleStyle={{ fontWeight: '600' }}
            left={props => <List.Icon {...props} icon="fingerprint" color="#64748B" />}
            right={() => (
              <View className="justify-center mr-2">
                <Switch value={false} onValueChange={() => {}} />
              </View>
            )}
          />
        </Surface>
      </List.Section>

      <List.Section>
        <List.Subheader className="font-bold uppercase tracking-widest text-[10px] text-gray-400">Security & Storage</List.Subheader>
        <Surface className="mx-4 rounded-3xl overflow-hidden bg-white dark:bg-slate-800" elevation={1}>
          <List.Item
            title="Clear History"
            titleStyle={{ fontWeight: '600', color: '#EF4444' }}
            left={props => <List.Icon {...props} icon="trash-can-outline" color="#EF4444" />}
            onPress={() => {}}
          />
          <Divider />
          <List.Item
            title="Export All Data"
            titleStyle={{ fontWeight: '600' }}
            left={props => <List.Icon {...props} icon="database-export" color="#64748B" />}
            onPress={() => {}}
          />
        </Surface>
      </List.Section>

      <List.Section>
        <List.Subheader className="font-bold uppercase tracking-widest text-[10px] text-gray-400">About</List.Subheader>
        <Surface className="mx-4 rounded-3xl overflow-hidden bg-white dark:bg-slate-800" elevation={1}>
          <List.Item
            title="Terms of Service"
            titleStyle={{ fontWeight: '600' }}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          <Divider />
          <List.Item
            title="Privacy Policy"
            titleStyle={{ fontWeight: '600' }}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
        </Surface>
      </List.Section>

      <View className="p-8 mb-12">
        <Button 
          mode="contained" 
          buttonColor="#EF4444" 
          onPress={() => {}}
          className="rounded-2xl py-1"
          contentStyle={{ height: 50 }}
        >
          Logout Securely
        </Button>
        <Text className="text-center text-gray-400 mt-6 text-[10px] font-bold tracking-tighter">
          NOC BUILDER PRO • VERSION 2.0.0 (STABLE)
        </Text>
      </View>
    </ScrollView>
  );
}
