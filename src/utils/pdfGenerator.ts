import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { NocFormData } from '../types/noc';
import { Template } from '../data/templates';

const STAMP_COLOR = '#6D28D9';

const escapeHtml = (value: string | undefined) =>
  (value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

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

const getIssueDateText = (issueDate: string) => {
  const parsed = parseSafeDate(issueDate);
  if (!parsed) {
    return issueDate;
  }

  return parsed.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const buildStampSvg = (englishName: string, arabicName: string) => `
  <svg width="230" height="230" viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <path id="topArc" d="M 28 100 A 72 72 0 0 1 172 100" />
      <path id="bottomArc" d="M 172 100 A 72 72 0 0 1 28 100" />
    </defs>
    <g transform="rotate(-8 100 100)" opacity="0.96">
      <circle cx="100" cy="100" r="84" fill="none" stroke="${STAMP_COLOR}" stroke-width="4" />
      <circle cx="100" cy="100" r="60" fill="none" stroke="${STAMP_COLOR}" stroke-width="2.5" />
      <text fill="${STAMP_COLOR}" font-size="10" font-weight="700">
        <textPath xlink:href="#topArc" href="#topArc" startOffset="50%" text-anchor="middle">${escapeHtml(arabicName || 'اسم الشركة')}</textPath>
      </text>
      <text fill="${STAMP_COLOR}" font-size="8.5" font-weight="700" letter-spacing="0.8">
        <textPath xlink:href="#bottomArc" href="#bottomArc" startOffset="50%" text-anchor="middle">${escapeHtml(englishName || 'COMPANY NAME')}</textPath>
      </text>
      <text x="51" y="108" text-anchor="middle" fill="${STAMP_COLOR}" font-size="14" font-weight="700">•</text>
      <text x="149" y="108" text-anchor="middle" fill="${STAMP_COLOR}" font-size="14" font-weight="700">•</text>
    </g>
    <text x="100" y="108" text-anchor="middle" dominant-baseline="middle" fill="${STAMP_COLOR}" font-size="24" font-weight="700">UAE</text>
  </svg>
`;

const buildNocHtml = (data: NocFormData, template: Template, serialNumber: string) => {
  const issueDate = getIssueDateText(data.issueDate);
  const stampSvg = buildStampSvg(data.companyName, data.companyNameArabic);

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
          @page {
            size: A4;
            margin: 20px;
          }

          body {
            margin: 0;
            color: #202124;
            font-family: "Times New Roman", Times, serif;
            background: #ffffff;
          }

          .document {
            width: 100%;
            box-sizing: border-box;
          }

          .top-strip {
            height: 4px;
            background: ${template.primaryColor};
            margin-bottom: 0;
          }

          .banner {
            background: ${template.secondaryColor};
            color: ${template.id === '2' ? '#111827' : '#ffffff'};
            text-align: center;
            border: 2px solid ${template.primaryColor};
            font-size: 34px;
            line-height: 1.2;
            padding: 18px 20px 16px;
            margin-bottom: 90px;
            letter-spacing: 0.3px;
          }

          .meta-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            font-size: 14px;
            margin-bottom: 30px;
          }

          .subject {
            font-size: 24px;
            margin: 0 0 28px;
            font-weight: 400;
          }

          .paragraph {
            font-size: 17px;
            line-height: 1.45;
            margin: 0 0 30px;
          }

          .paragraph.tight {
            margin-bottom: 16px;
          }

          .strong {
            font-weight: 700;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin: 46px 0 34px;
            table-layout: fixed;
            font-size: 15px;
          }

          th, td {
            border: 1px solid #262626;
            padding: 10px 8px;
            vertical-align: top;
            word-wrap: break-word;
          }

          th {
            background: ${template.accentColor};
            text-align: center;
            font-weight: 700;
          }

          td {
            background: #ffffff;
          }

          .col-sr { width: 5%; text-align: center; }
          .col-name { width: 25%; }
          .col-eid { width: 21%; }
          .col-job { width: 18%; }
          .col-nationality { width: 13%; text-align: center; }
          .col-company { width: 18%; }

          .closing {
            margin-top: 28px;
          }

          .closing-line {
            font-size: 17px;
            margin: 0 0 18px;
          }

          .manager {
            font-size: 17px;
            margin-bottom: 34px;
          }

          .company-sign {
            text-align: center;
            font-size: 18px;
            margin-bottom: 10px;
          }

          .seal {
            width: 230px;
            height: 230px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .remarks {
            margin-top: 18px;
            font-size: 15px;
            color: #4b5563;
          }
        </style>
      </head>
      <body>
        <div class="document">
          <div class="top-strip"></div>
          <div class="banner">${escapeHtml(data.companyName)}</div>

          <div class="meta-row">
            <div></div>
            <div>Date: ${escapeHtml(issueDate)}</div>
          </div>

          <p class="subject">Sub: No Objection Certificate</p>

          <p class="paragraph">
            We confirm that <span class="strong">${escapeHtml(data.employeeName)}</span>, Emirates ID No
            <span class="strong">${escapeHtml(data.emiratesId)}</span> has been an employee of
            <span class="strong">${escapeHtml(data.companyName)}</span> as a
            <span class="strong">${escapeHtml(data.jobTitle)}</span> and we have no objection for
            ${escapeHtml(data.employeeName.split(' ')[0] || 'the employee')} to work with
            <span class="strong">any other company</span>.
          </p>

          <p class="paragraph">
            This no objection certificate is issued on particular request of the employee and may be useful for
            him in future or as per requirement of any other organization.
          </p>

          <p class="paragraph tight">
            If any further queries are to be discussed you can feel free to contact.
          </p>

          <table>
            <thead>
              <tr>
                <th class="col-sr">Sr</th>
                <th class="col-name">Name</th>
                <th class="col-eid">Emirates ID No</th>
                <th class="col-job">Job</th>
                <th class="col-nationality">Nationality</th>
                <th class="col-company">Company</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="col-sr">01</td>
                <td class="col-name">${escapeHtml(data.employeeName)}</td>
                <td class="col-eid">${escapeHtml(data.emiratesId)}</td>
                <td class="col-job">${escapeHtml(data.jobTitle)}</td>
                <td class="col-nationality">${escapeHtml(data.nationality)}</td>
                <td class="col-company">${escapeHtml(data.companyName)}</td>
              </tr>
            </tbody>
          </table>

          <div class="closing">
            <p class="closing-line">Yours truly</p>
            <p class="closing-line manager">${escapeHtml(data.managerName || 'Manager')}</p>

            <div class="company-sign">${escapeHtml(data.companyName)}</div>
            <div class="seal">${stampSvg}</div>
          </div>

          ${data.remarks ? `<div class="remarks">Remarks: ${escapeHtml(data.remarks)}</div>` : ''}
        </div>
      </body>
    </html>
  `;
};

export const generateNocPdf = async (data: NocFormData, template: Template, serialNumber: string) => {
  const htmlContent = buildNocHtml(data, template, serialNumber);

  try {
    if (Platform.OS === 'web') {
      await Print.printAsync({ html: htmlContent });
      return 'web-print-dialog';
    }

    const { uri } = await Print.printToFileAsync({ html: htmlContent });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    }

    return uri;
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again.');
    return null;
  }
};
