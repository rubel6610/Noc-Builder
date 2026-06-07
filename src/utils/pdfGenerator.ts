import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { NocFormData } from '../types/noc';
import { Template } from '../data/templates';

export const generateNocPdf = async (data: NocFormData, template: Template, serialNumber: string) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&family=Playfair+Display:wght@700&display=swap');
          
          body {
            font-family: 'Roboto', sans-serif;
            margin: 0;
            padding: 0;
            background-color: white;
            color: #1e293b;
          }
          
          .a4-container {
            width: 100%;
            height: 100%;
            padding: 40px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            border-top: ${template.id === '4' || template.id === '5' ? `12px solid ${template.primaryColor}` : 'none'};
          }
          
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 30px;
            background-color: ${template.id === '1' || template.id === '3' ? template.primaryColor : 'transparent'};
            color: ${template.id === '1' || template.id === '3' ? 'white' : template.primaryColor};
            border-radius: 8px;
            margin-bottom: 40px;
          }
          
          .header-title {
            font-size: 32px;
            font-weight: 900;
            margin: 0;
            font-family: ${template.id === '4' ? "'Playfair Display', serif" : 'inherit'};
          }
          
          .ref-no {
            font-size: 12px;
            opacity: 0.8;
          }
          
          .company-info {
            text-align: right;
          }
          
          .company-name {
            font-weight: bold;
            font-size: 18px;
            margin-bottom: 5px;
          }
          
          .date {
            font-size: 12px;
            opacity: 0.8;
          }
          
          .accent-bar {
            background-color: ${template.secondaryColor};
            height: 6px;
            width: 100%;
            margin-top: -40px;
            margin-bottom: 40px;
            display: ${template.id === '1' ? 'block' : 'none'};
          }
          
          .content {
            flex: 1;
            padding: 20px 40px;
          }
          
          .doc-title {
            text-align: center;
            font-size: 20px;
            font-weight: bold;
            color: ${template.primaryColor};
            text-decoration: ${template.id === '2' ? 'none' : 'underline'};
            margin-bottom: 50px;
            text-transform: uppercase;
          }
          
          .body-text {
            font-size: 16px;
            line-height: 1.8;
            text-align: justify;
            margin-bottom: 30px;
          }
          
          .bold {
            font-weight: bold;
            color: #0f172a;
          }
          
          .remarks-box {
            background-color: #f8fafc;
            border-left: 4px solid #cbd5e1;
            padding: 15px;
            margin-bottom: 30px;
            font-style: italic;
          }
          
          .footer-section {
            margin-top: auto;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding-bottom: 50px;
          }
          
          .signature-area {
            width: 250px;
          }
          
          .sig-line {
            border-top: 1px solid #e2e8f0;
            margin-bottom: 10px;
          }
          
          .sig-name {
            font-weight: bold;
            font-size: 14px;
            text-transform: uppercase;
          }
          
          .sig-title {
            font-size: 12px;
            color: #64748b;
          }
          
          .stamp-area {
            width: 100px;
            height: 100px;
            border: 2px dashed ${template.primaryColor}22;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            color: ${template.primaryColor}44;
            text-align: center;
          }
          
          .contact-footer {
            display: flex;
            justify-content: space-around;
            padding: 20px;
            background-color: ${template.id === '2' ? 'transparent' : template.accentColor};
            border-top: 1px solid #f1f5f9;
            font-size: 10px;
            color: #475569;
            border-radius: 0 0 8px 8px;
          }
        </style>
      </head>
      <body>
        <div class="a4-container">
          <div class="header">
            <div>
              <h1 class="header-title">NOC</h1>
              <div class="ref-no">Ref: ${serialNumber}</div>
            </div>
            <div class="company-info">
              <div class="company-name">${data.companyName}</div>
              <div class="date">Date: ${data.issueDate}</div>
            </div>
          </div>
          
          ${template.id === '1' ? '<div class="accent-bar"></div>' : ''}
          
          <div class="content">
            <div class="doc-title">To Whomsoever It May Concern</div>
            
            <div class="body-text">
              This is to certify that <span class="bold">${data.employeeName}</span>, 
              son of <span class="bold">${data.fatherName}</span>, 
              holding Passport No: <span class="bold">${data.passportNumber}</span> 
              and Emirates ID: <span class="bold">${data.emiratesId}</span>, 
              is currently employed with <span class="bold">${data.companyName}</span> 
              as <span class="bold">${data.jobTitle}</span>.
            </div>
            
            <div class="body-text">
              We confirm that we have no objection to the employee's request and we provide our 
              full consent regarding the matter mentioned in the application.
            </div>
            
            ${data.remarks ? `
              <div class="remarks-box">
                <strong>REMARKS:</strong><br/>
                ${data.remarks}
              </div>
            ` : ''}
            
            <div class="footer-section">
              <div class="signature-area">
                <div class="sig-line"></div>
                <div class="sig-name">${data.managerName}</div>
                <div class="sig-title">Authorized Signatory</div>
                <div class="sig-title">${data.companyName}</div>
              </div>
              
              <div class="stamp-area">
                OFFICIAL STAMP
              </div>
            </div>
          </div>
          
          <div class="contact-footer">
            <div><strong>Phone:</strong> ${data.phoneNumber}</div>
            <div><strong>Address:</strong> ${data.address}</div>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    console.log('PDF Generated at:', uri);
    await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    return uri;
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again.');
    return null;
  }
};
