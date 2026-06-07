import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Modal, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Text, Surface, Button, IconButton, useTheme, Portal, FAB } from 'react-native-paper';
import { useNoc } from '../context/NocContext';
import { useTemplates } from '../context/TemplateContext';
import { useHistory } from '../context/HistoryContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { generateNocPdf } from '../utils/pdfGenerator';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';

const { width, height } = Dimensions.get('window');
const A4_RATIO = 1.414;
const PREVIEW_WIDTH = width - 40;
const PREVIEW_HEIGHT = PREVIEW_WIDTH * A4_RATIO;

export const NocPreview = () => {
  const { nocData } = useNoc();
  const { selectedTemplate } = useTemplates();
  const { addToHistory, getNextSerialNumber } = useHistory();
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

  const serialNumber = getNextSerialNumber();

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const uri = await generateNocPdf(nocData, selectedTemplate, serialNumber);
      if (uri) {
        await addToHistory({
          employeeName: nocData.employeeName,
          emiratesId: nocData.emiratesId,
          templateName: selectedTemplate.name,
          pdfPath: uri,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    const text = `NOC Details:\nSerial: ${serialNumber}\nEmployee: ${nocData.employeeName}\nEmirates ID: ${nocData.emiratesId}\nCompany: ${nocData.companyName}`;
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied!', 'NOC summary copied to clipboard');
  };

  const toggleZoom = () => {
    setZoomScale(zoomScale === 1 ? 1.5 : 1);
  };

  const t = selectedTemplate;

  const renderDocument = (scale: number = 1) => (
    <Surface 
      style={[
        styles.a4Page, 
        { 
          borderColor: t.primaryColor,
          borderTopWidth: t.id === '4' || t.id === '5' ? 8 : 0,
          transform: [{ scale }]
        }
      ]} 
      elevation={4}
    >
      {/* Template Header Design */}
      <View style={{ backgroundColor: t.id === '1' || t.id === '3' ? t.primaryColor : 'transparent' }} className="p-6 flex-row justify-between items-center">
        <View>
           {t.id === '5' && <MaterialCommunityIcons name="seal" size={40} color={t.primaryColor} />}
           <Text 
             style={{ 
               color: (t.id === '1' || t.id === '3') ? 'white' : t.primaryColor,
               fontFamily: t.id === '4' ? 'serif' : 'sans-serif',
               fontSize: 24,
               fontWeight: '900'
             }}
           >
             NOC
           </Text>
           <Text style={{ color: (t.id === '1' || t.id === '3') ? t.accentColor : '#64748B', fontSize: 10 }}>
             Ref: {serialNumber}
           </Text>
        </View>
        <View className="items-end">
          <Text style={{ color: (t.id === '1' || t.id === '3') ? 'white' : '#1E293B', fontWeight: 'bold' }}>
            {nocData.companyName || 'Company Name'}
          </Text>
          <Text style={{ color: (t.id === '1' || t.id === '3') ? t.accentColor : '#64748B', fontSize: 10 }}>
            Date: {nocData.issueDate}
          </Text>
        </View>
      </View>

      {t.id === '1' && <View style={{ backgroundColor: t.secondaryColor, height: 4 }} />}
      
      <View className="p-8 flex-1">
        <Text 
          style={{ 
            color: t.primaryColor, 
            textAlign: 'center', 
            fontSize: 18, 
            fontWeight: 'bold',
            textDecorationLine: t.id === '2' ? 'none' : 'underline',
            marginBottom: 30
          }}
        >
          TO WHOMSOEVER IT MAY CONCERN
        </Text>

        <View className="mb-6">
          <Text style={styles.bodyText}>
            This is to certify that <Text style={styles.boldText}>{nocData.employeeName || '[Employee Name]'}</Text>, 
            son of <Text style={styles.boldText}>{nocData.fatherName || '[Father Name]'}</Text>, 
            holding Passport No: <Text style={styles.boldText}>{nocData.passportNumber || '[Passport #]'}</Text> 
            and Emirates ID: <Text style={styles.boldText}>{nocData.emiratesId || '[Emirates ID]'}</Text>, 
            is currently employed with <Text style={styles.boldText}>{nocData.companyName || '[Company Name]'}</Text> 
            as <Text style={styles.boldText}>{nocData.jobTitle || '[Job Title]'}</Text>.
          </Text>
        </View>

        <View className="mb-6">
          <Text style={styles.bodyText}>
            We confirm that we have no objection to the employee's request and we provide our 
            full consent regarding the matter mentioned in the application.
          </Text>
        </View>

        {nocData.remarks ? (
          <View className="mb-6 p-3 bg-slate-50 border-l-2 border-slate-200">
            <Text className="text-[10px] text-slate-400 font-bold mb-1">REMARKS:</Text>
            <Text style={styles.bodyText} className="italic">{nocData.remarks}</Text>
          </View>
        ) : null}

        <View className="mt-auto pt-10 flex-row justify-between">
          <View className="w-1/2">
             <View style={{ borderBottomWidth: 1, borderBottomColor: '#E2E8F0', marginBottom: 5 }} />
             <Text className="text-[10px] font-bold text-slate-800 uppercase">{nocData.managerName || 'Manager Name'}</Text>
             <Text className="text-[9px] text-slate-500">Authorized Signatory</Text>
             <Text className="text-[9px] text-slate-500">{nocData.companyName}</Text>
          </View>
          
          <View className="items-end">
             <QRCode
               value={`${serialNumber}|${nocData.employeeName}|${nocData.emiratesId}`}
               size={60}
               color={t.primaryColor}
               backgroundColor="white"
             />
          </View>
        </View>
      </View>

      {/* Footer Design */}
      <View 
        style={{ backgroundColor: t.id === '2' ? 'transparent' : t.accentColor }} 
        className="p-4 flex-row justify-around border-t border-slate-100"
      >
        <View className="flex-row items-center">
          <MaterialCommunityIcons name="phone" size={10} color={t.primaryColor} />
          <Text className="text-[8px] ml-1 text-slate-600">{nocData.phoneNumber || 'Contact No.'}</Text>
        </View>
        <View className="flex-row items-center">
          <MaterialCommunityIcons name="map-marker" size={10} color={t.primaryColor} />
          <Text className="text-[8px] ml-1 text-slate-600">{nocData.address || 'Address'}</Text>
        </View>
      </View>
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
          <IconButton
            icon="content-copy"
            size={20}
            onPress={copyToClipboard}
            mode="contained"
            containerColor="white"
          />
          <IconButton
            icon="fullscreen"
            size={20}
            onPress={() => setIsFullscreen(true)}
            mode="contained"
            containerColor="white"
          />
          <Button 
            mode="contained" 
            icon="file-pdf-box" 
            onPress={handleDownload}
            loading={isLoading}
            buttonColor={t.primaryColor}
            labelStyle={{ fontSize: 10 }}
            className="rounded-lg"
          >
            Share PDF
          </Button>
        </View>
      </View>
      
      <View className="overflow-hidden items-center">
        {renderDocument()}
      </View>

      <Portal>
        <Modal 
          visible={isFullscreen} 
          onDismiss={() => setIsFullscreen(false)}
          contentContainerStyle={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)' }}
        >
          <View className="flex-1">
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
                Generate & Share NOC
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  a4Page: {
    width: PREVIEW_WIDTH,
    minHeight: PREVIEW_HEIGHT,
    backgroundColor: 'white',
    alignSelf: 'center',
    marginBottom: 40,
  },
  bodyText: {
    fontSize: 12,
    lineHeight: 20,
    color: '#334155',
    textAlign: 'justify',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#0F172A',
  }
});
