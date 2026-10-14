import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { fullName, telegram, year, skills, comment } = body;

    // Basic validation
    if (!fullName || !telegram || !year) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Prepare auth
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    let spreadsheetId = process.env.GOOGLE_SHEET_ID;
    if (spreadsheetId && spreadsheetId.includes('/d/')) {
      const match = spreadsheetId.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (match) spreadsheetId = match[1];
    }

    const metadata = await sheets.spreadsheets.get({
      spreadsheetId,
    });
    
    const sheetName = metadata.data.sheets[0].properties.title;

    // Determine the next empty row based on Column A (Timestamp is always present)
    const colA = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A:A`,
    });

    const nextRow = (colA.data.values ? colA.data.values.length : 0) + 1;
    
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A${nextRow}:F${nextRow}`, 
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [
            new Date().toISOString(), // Timestamp
            fullName || '',
            telegram || '',
            year || '',
            skills || '',
            comment || ''
          ]
        ],
      },
    });

    return NextResponse.json({ success: true, data: response.data, row: nextRow });

  } catch (error) {
    console.error('Google Sheets API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
