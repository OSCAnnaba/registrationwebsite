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

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // 1. Get the sheet name dynamically (in case it's not "Sheet1")
    const metadata = await sheets.spreadsheets.get({
      spreadsheetId,
    });
    
    const sheetName = metadata.data.sheets[0].properties.title;

    // 2. Append to the correct sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:F`, 
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [
            new Date().toISOString(), // Timestamp
            fullName,
            telegram,
            year,
            skills,
            comment
          ]
        ],
      },
    });

    return NextResponse.json({ success: true, data: response.data });

  } catch (error) {
    console.error('Google Sheets API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
