# OSCA Registration Website

A Simple registration portal built for the OSCA (Open Source Community Annaba) community. This application allows users to register by providing their personal details, academic year, and skills, with data automatically stored in a Google Sheet.

## 🚀 Features

- **Real-time Feedback**: Instant form validation and submission status updates.
- **Google Sheets Integration**: Seamlessly saves registration data to a Google Spreadsheet using a Service Account.
- **Tech Stack**: Powered by Next.js 16, React 19, and Tailwind CSS.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Backend Integration**: [Google Sheets API](https://developers.google.com/sheets/api)

## 📦 Getting Started

### Prerequisites

- Node.js installed on your machine.
- A Google Cloud Platform project with the Sheets API enabled.
- A Service Account with access to your target Google Sheet.

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd registrationwebsite
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env.local` file in the root directory and add your Google Sheets credentials:
   ```env
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account-email
   GOOGLE_PRIVATE_KEY="your-private-key"
   GOOGLE_SHEET_ID=your-spreadsheet-id
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the application:**
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

- `src/app/page.js`: The main registration form component.
- `src/app/api/submit/route.js`: API route handling form submissions to Google Sheets.
- `public/`: Static assets like images and icons.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
