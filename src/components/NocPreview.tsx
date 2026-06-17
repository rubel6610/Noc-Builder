import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Modal, ScrollView, Alert } from 'react-native';
import { Text, Surface, Button, IconButton, useTheme, Portal } from 'react-native-paper';
import Svg, { Circle, Defs, Path, Text as SvgText, TextPath, G } from 'react-native-svg';
import { useNoc } from '../context/NocContext';
import { useTemplates } from '../context/TemplateContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { generateNocPdf } from '../utils/pdfGenerator';
import * as Clipboard from 'expo-clipboard';

const { width } = Dimensions.get('window');
const A4_RATIO = 1.414;
const PREVIEW_WIDTH = width - 40;
const PREVIEW_HEIGHT = PREVIEW_WIDTH * A4_RATIO;
const STAMP_COLOR = '#6D28D9';

const parseSafeDate = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    const parsed = new Date(Number(year), Number(month) - 1, Number(day));
    if (
      parsed.getFullYear() === Number(year) &&
      parsed.getMonth() === Number(month) - 1 &&
      parsed.getDate() === Number(day)
    ) {
      return parsed;
    }
    return null;
  }

  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getReferenceDatePart = (issueDate: string) => {
  const parsed = parseSafeDate(issueDate);
  if (!parsed) {
    return 'undated';
  }

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const CompanyStamp = ({
  englishName,
  arabicName,
}: {
  englishName: string;
  arabicName: string;
}) => (
  <Svg width={204} height={204} viewBox="0 0 200 200">
    <Defs>
      <Path id="topArc" d="M 28 100 A 72 72 0 0 1 172 100" />
      <Path id="bottomArc" d="M 172 100 A 72 72 0 0 1 28 100" />
    </Defs>
    <G rotation="-8" origin="100, 100" opacity={0.96}>
      <Circle cx="100" cy="100" r="84" stroke={STAMP_COLOR} strokeWidth="4" fill="none" />
      <Circle cx="100" cy="100" r="60" stroke={STAMP_COLOR} strokeWidth="2.5" fill="none" />
      <SvgText fill={STAMP_COLOR} fontSize="10" fontWeight="700">
        <TextPath href="#topArc" startOffset="50%" textAnchor="middle">
          {arabicName || 'اسم الشركة'}
        </TextPath>
      </SvgText>
      <SvgText fill={STAMP_COLOR} fontSize="8.5" fontWeight="700" letterSpacing="0.8">
        <TextPath href="#bottomArc" startOffset="50%" textAnchor="middle">
          {englishName || 'COMPANY NAME'}
        </TextPath>
      </SvgText>
      <SvgText x="51" y="108" textAnchor="middle" fill={STAMP_COLOR} fontSize="14" fontWeight="700">•</SvgText>
      <SvgText x="149" y="108" textAnchor="middle" fill={STAMP_COLOR} fontSize="14" fontWeight="700">•</SvgText>
    </G>
    <SvgText x="100" y="108" textAnchor="middle" alignmentBaseline="middle" fill={STAMP_COLOR} fontSize="24" fontWeight="700">
      UAE
    </SvgText>
  </Svg>
);

export const NocPreview = () => {
  const { nocData } = useNoc();
  const { selectedTemplate } = useTemplates();
  const theme = useTheme();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  if (!nocData || !selectedTemplate) {
    return (
      <View className="items-center justify-center p-10 bg-gray-50 dark:bg-slate-900 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-700">
        <MaterialCommunityIcons name="file-eye-outline" size={48} color={theme.colors.outline} />
        <Text style={{ color: theme.colors.outline }} className="mt-4 text-center font-medium">
          Fill in the details and select a template to see the live preview
        </Text>
      </View>
    );
  }

  const serialNumber = `NOC-${getReferenceDatePart(nocData.issueDate || '')}-${nocData.emiratesId.slice(-4).replace(/\D/g, '') || '0000'}`;
  const t = selectedTemplate;

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      await generateNocPdf(nocData, selectedTemplate, serialNumber);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    const text = `NOC Details:\nReference: ${serialNumber}\nCompany: ${nocData.companyName}\nEmployee: ${nocData.employeeName}\nEmirates ID: ${nocData.emiratesId}\nJob: ${nocData.jobTitle}`;
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied!', 'NOC summary copied to clipboard');
  };

  const renderDocument = (scale = 1) => (
    <Surface
      style={[
        styles.a4Page,
        {
          transform: [{ scale }],
        }
      ]}
      elevation={4}
    >
      <View style={[styles.topStrip, { backgroundColor: t.primaryColor }]} />

      <View style={[styles.banner, { backgroundColor: t.secondaryColor, borderColor: t.primaryColor }]}>
        <Text style={[styles.bannerText, { color: t.id === '2' ? '#111827' : '#FFFFFF' }]}>
          {nocData.companyName || 'Company Name'}
        </Text>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>Date: {nocData.issueDate}</Text>
      </View>

      <Text style={styles.subject}>Sub: No Objection Certificate</Text>

      <Text style={styles.paragraph}>
        We confirm that <Text style={styles.strong}>{nocData.employeeName || '[Employee Name]'}</Text>, Emirates ID No{' '}
        <Text style={styles.strong}>{nocData.emiratesId || '[Emirates ID]'}</Text> has been an employee of{' '}
        <Text style={styles.strong}>{nocData.companyName || '[Company Name]'}</Text> as a{' '}
        <Text style={styles.strong}>{nocData.jobTitle || '[Job Title]'}</Text> and we have no objection for{' '}
        {nocData.employeeName?.split(' ')[0] || 'the employee'} to work with <Text style={styles.strong}>any other company</Text>.
      </Text>

      <Text style={styles.paragraph}>
        This no objection certificate is issued on particular request of the employee and may be useful for him in
        future or as per requirement of any other organization.
      </Text>

      <Text style={styles.paragraphTight}>
        If any further queries are to be discussed you can feel free to contact.
      </Text>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={[styles.th, styles.colSr, { backgroundColor: t.accentColor }]}>Sr</Text>
          <Text style={[styles.th, styles.colName, { backgroundColor: t.accentColor }]}>Name</Text>
          <Text style={[styles.th, styles.colEid, { backgroundColor: t.accentColor }]}>Emirates ID No</Text>
          <Text style={[styles.th, styles.colJob, { backgroundColor: t.accentColor }]}>Job</Text>
          <Text style={[styles.th, styles.colNationality, { backgroundColor: t.accentColor }]}>Nationality</Text>
          <Text style={[styles.th, styles.colCompany, { backgroundColor: t.accentColor }]}>Company</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={[styles.td, styles.colSr]}>01</Text>
          <Text style={[styles.td, styles.colName]}>{nocData.employeeName}</Text>
          <Text style={[styles.td, styles.colEid]}>{nocData.emiratesId}</Text>
          <Text style={[styles.td, styles.colJob]}>{nocData.jobTitle}</Text>
          <Text style={[styles.td, styles.colNationality]}>{nocData.nationality}</Text>
          <Text style={[styles.td, styles.colCompany]}>{nocData.companyName}</Text>
        </View>
      </View>

      <View style={styles.signatureBlock}>
        <Text style={styles.signatureText}>Yours truly</Text>
        <Text style={styles.signatureText}>{nocData.managerName || 'Manager'}</Text>

        <Text style={styles.companySignature}>{nocData.companyName}</Text>
        <CompanyStamp
          englishName={nocData.companyName}
          arabicName={nocData.companyNameArabic}
        />
      </View>

      {nocData.remarks ? (
        <Text style={styles.remarks}>Remarks: {nocData.remarks}</Text>
      ) : null}
    </Surface>
  );

  return (
    <View className="p-5 bg-slate-200 dark:bg-slate-900">
      <View className="flex-row justify-between items-center mb-4 px-1">
        <View>
          <Text className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-widest">
            Live Preview
          </Text>
          <Text className="text-[8px] text-slate-400">Ref: {serialNumber}</Text>
        </View>
        <View className="flex-row gap-2">
          <IconButton icon="content-copy" size={20} onPress={copyToClipboard} mode="contained" containerColor="white" />
          <IconButton icon="fullscreen" size={20} onPress={() => setIsFullscreen(true)} mode="contained" containerColor="white" />
          <Button
            mode="contained"
            icon="file-pdf-box"
            onPress={handleDownload}
            loading={isLoading}
            buttonColor={t.primaryColor}
            labelStyle={{ fontSize: 10 }}
            className="rounded-lg"
          >
            Download PDF
          </Button>
        </View>
      </View>

      <View className="overflow-hidden items-center">
        {renderDocument()}
      </View>

      <Portal>
        <Modal visible={isFullscreen} onDismiss={() => setIsFullscreen(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)' }}>
            <View className="flex-row justify-between p-4 items-center">
              <Text className="text-white font-bold">Document Preview</Text>
              <View className="flex-row">
                <IconButton icon="minus" iconColor="white" onPress={() => setZoomScale(Math.max(0.5, zoomScale - 0.1))} />
                <IconButton icon="plus" iconColor="white" onPress={() => setZoomScale(Math.min(2, zoomScale + 0.1))} />
                <IconButton icon="close" iconColor="white" onPress={() => setIsFullscreen(false)} />
              </View>
            </View>
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 50 }}
              maximumZoomScale={2}
              minimumZoomScale={0.5}
            >
              {renderDocument(zoomScale)}
            </ScrollView>
            <View className="p-6">
              <Button mode="contained" onPress={handleDownload} buttonColor={t.primaryColor}>
                Generate NOC PDF
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

const cellBase = {
  borderWidth: 1,
  borderColor: '#262626',
  paddingHorizontal: 6,
  paddingVertical: 10,
  fontSize: 8.5,
  color: '#202124',
};

const styles = StyleSheet.create({
  a4Page: {
    width: PREVIEW_WIDTH,
    minHeight: PREVIEW_HEIGHT,
    backgroundColor: 'white',
    alignSelf: 'center',
    marginBottom: 40,
    padding: 14,
  },
  topStrip: {
    height: 4,
    marginBottom: 0,
  },
  banner: {
    borderWidth: 2,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 36,
  },
  bannerText: {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'Times New Roman',
  },
  metaRow: {
    alignItems: 'flex-end',
    marginBottom: 18,
  },
  metaText: {
    fontSize: 9,
    color: '#4b5563',
  },
  subject: {
    fontSize: 16,
    color: '#202124',
    marginBottom: 20,
    fontFamily: 'Times New Roman',
  },
  paragraph: {
    fontSize: 10.5,
    lineHeight: 18,
    color: '#202124',
    marginBottom: 18,
    fontFamily: 'Times New Roman',
  },
  paragraphTight: {
    fontSize: 10.5,
    lineHeight: 18,
    color: '#202124',
    marginBottom: 24,
    fontFamily: 'Times New Roman',
  },
  strong: {
    fontWeight: '700',
    fontFamily: 'Times New Roman',
  },
  table: {
    marginBottom: 24,
  },
  tableRow: {
    flexDirection: 'row',
  },
  th: {
    ...cellBase,
    fontWeight: '700',
    textAlign: 'center',
  },
  td: {
    ...cellBase,
    backgroundColor: '#FFFFFF',
  },
  colSr: {
    width: '5%',
    textAlign: 'center',
  },
  colName: {
    width: '24%',
  },
  colEid: {
    width: '20%',
  },
  colJob: {
    width: '18%',
  },
  colNationality: {
    width: '14%',
    textAlign: 'center',
  },
  colCompany: {
    width: '19%',
  },
  signatureBlock: {
    alignItems: 'center',
    marginTop: 4,
  },
  signatureText: {
    width: '100%',
    fontSize: 10.5,
    color: '#202124',
    marginBottom: 12,
    fontFamily: 'Times New Roman',
  },
  companySignature: {
    fontSize: 11.5,
    color: '#202124',
    marginTop: 18,
    marginBottom: 8,
    fontFamily: 'Times New Roman',
  },
  remarks: {
    marginTop: 14,
    fontSize: 9,
    color: '#4b5563',
    fontFamily: 'Times New Roman',
  },
});
