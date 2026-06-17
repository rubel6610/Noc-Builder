import React from 'react';
import { View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextInput, Button, HelperText, Title, Surface, useTheme, Text } from 'react-native-paper';
import { NocSchema, NocFormData } from '../types/noc';
import { useNoc } from '../context/NocContext';
import { useTemplates } from '../context/TemplateContext';
import { generateNocPdf } from '../utils/pdfGenerator';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const NocForm = () => {
  const theme = useTheme();
  const { saveNocData, nocData } = useNoc();
  const { selectedTemplate } = useTemplates();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NocFormData>({
    resolver: zodResolver(NocSchema),
    defaultValues: nocData || {
      employeeName: '',
      fatherName: '',
      passportNumber: '',
      emiratesId: '',
      nationality: '',
      jobTitle: '',
      companyName: '',
      companyNameArabic: '',
      issueDate: new Date().toISOString().split('T')[0],
      managerName: '',
      phoneNumber: '',
      address: '',
      remarks: '',
    },
  });

  const onSubmit = async (data: NocFormData) => {
    saveNocData(data);

    if (!selectedTemplate) {
      alert('Please select a template before generating the NOC PDF.');
      return;
    }

    const referenceNumber = `NOC-${new Date().toISOString().slice(0, 10)}-${Date.now().toString().slice(-6)}`;
    await generateNocPdf(data, selectedTemplate, referenceNumber);
  };

  const renderInput = (
    name: keyof NocFormData,
    label: string,
    icon: string,
    placeholder?: string,
    multiline: boolean = false
  ) => (
    <View className="mb-4">
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label={label}
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder={placeholder}
            error={!!errors[name]}
            multiline={multiline}
            numberOfLines={multiline ? 4 : 1}
            left={<TextInput.Icon icon={icon} color={theme.colors.primary} />}
            className="bg-white dark:bg-slate-800"
            textColor={theme.colors.onSurface}
            placeholderTextColor={theme.colors.outline}
            outlineStyle={{ borderRadius: 16, borderWidth: 1.5 }}
          />
        )}
      />
      {errors[name] && (
        <HelperText type="error" visible={!!errors[name]}>
          {errors[name]?.message}
        </HelperText>
      )}
    </View>
  );

  return (
    <View style={{ padding: 20 }}>
        {selectedTemplate ? (
          <Surface className="p-4 rounded-[24px] bg-emerald-50 dark:bg-emerald-900/20 mb-6 border border-emerald-100 dark:border-emerald-800" elevation={1}>
            <Text className="font-black text-emerald-900 dark:text-emerald-100">
              Selected template: {selectedTemplate.name}
            </Text>
            <Text className="text-emerald-700 dark:text-emerald-200 mt-1">
              Submitting this form will generate the PDF directly from these inputs.
            </Text>
          </Surface>
        ) : (
          <Surface className="p-4 rounded-[24px] bg-amber-50 dark:bg-amber-900/20 mb-6 border border-amber-100 dark:border-amber-800" elevation={1}>
            <Text className="font-black text-amber-900 dark:text-amber-100">
              No template selected
            </Text>
            <Text className="text-amber-700 dark:text-amber-200 mt-1">
              Choose a template first, then generate the NOC PDF from this form.
            </Text>
          </Surface>
        )}

        <Surface className="p-6 rounded-[32px] bg-white dark:bg-slate-800 mb-6 border border-slate-100 dark:border-slate-700" elevation={1}>
          <View className="flex-row items-center mb-6">
            <View className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-2xl mr-4">
              <MaterialCommunityIcons name="account-details" size={28} color={theme.colors.primary} />
            </View>
            <Title className="text-xl font-black dark:text-white">Identity</Title>
          </View>

          {renderInput('employeeName', 'Full Name', 'account')}
          {renderInput('fatherName', 'Father Name', 'human-male-boy')}
          {renderInput('nationality', 'Nationality', 'flag-outline')}

          <View className="flex-row flex-wrap gap-4">
            <View className="flex-1" style={{ minWidth: 0 }}>
              {renderInput('passportNumber', 'Passport', 'passport')}
            </View>
            <View className="flex-1" style={{ minWidth: 0 }}>
              {renderInput('emiratesId', 'EID', 'card-account-details-outline', '784-XXXX-XXXXXXX-X')}
            </View>
          </View>
        </Surface>

        <Surface className="p-6 rounded-[32px] bg-white dark:bg-slate-800 mb-6 border border-slate-100 dark:border-slate-700" elevation={1}>
          <View className="flex-row items-center mb-6">
            <View className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-2xl mr-4">
              <MaterialCommunityIcons name="briefcase" size={28} color="#10B981" />
            </View>
            <Title className="text-xl font-black dark:text-white">Employment</Title>
          </View>

          <View className="flex-row flex-wrap gap-4">
            <View className="flex-1" style={{ minWidth: 0 }}>
              {renderInput('jobTitle', 'Designation', 'badge-account-horizontal-outline')}
            </View>
            <View className="flex-1" style={{ minWidth: 0 }}>
              {renderInput('companyName', 'Company Name (English)', 'office-building')}
            </View>
          </View>
          {renderInput('companyNameArabic', 'Company Name (Arabic)', 'alphabetical-variant', 'اسم الشركة بالعربية')}
          {renderInput('managerName', 'Manager', 'account-tie')}
          {renderInput('issueDate', 'Issue Date', 'calendar-range')}
        </Surface>

        <Surface className="p-6 rounded-[32px] bg-white dark:bg-slate-800 mb-6 border border-slate-100 dark:border-slate-700" elevation={1}>
          <View className="flex-row items-center mb-6">
            <View className="bg-amber-50 dark:bg-amber-900/30 p-3 rounded-2xl mr-4">
              <MaterialCommunityIcons name="map-marker" size={28} color="#D97706" />
            </View>
            <Title className="text-xl font-black dark:text-white">Contact</Title>
          </View>

          {renderInput('phoneNumber', 'Phone', 'phone')}
          {renderInput('address', 'Location', 'map-marker', 'Street, Building, City', true)}
          {renderInput('remarks', 'Notes', 'comment-text-outline', 'Optional...', true)}
        </Surface>

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          className="py-2 mb-12 rounded-2xl shadow-xl"
          contentStyle={{ height: 60 }}
          labelStyle={{ fontSize: 18, fontWeight: 'black' }}
        >
          Generate NOC PDF
        </Button>
    </View>
  );
};
