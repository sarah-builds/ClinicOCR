# 🏥 ClinicOCR

> **AI-powered clinical document digitization and analysis using OCR and generative AI.**

ClinicOCR is a web application designed to simplify the process of converting medical documents and handwritten/printed clinical information into structured digital data.

The application combines **Optical Character Recognition (OCR)** with **AI-powered processing** to extract useful information from uploaded clinical documents, organize the extracted content, and make it easier to review, manage, and generate digital reports.

🌐 **Live Demo:** [ClinicOCR](https://clinic-ocr-seven.vercel.app)

---

## 📌 Overview

Medical and clinical workflows often involve information stored in physical prescriptions, reports, and scanned documents. Manually entering this information into digital systems can be time-consuming and error-prone.

**ClinicOCR** aims to reduce this manual effort by providing a pipeline where users can:

1. Upload a clinical document.
2. Extract text using OCR.
3. Process the extracted information using AI.
4. Review and organize the resulting data.
5. Generate a digital report when required.

The project demonstrates how **OCR, Generative AI, database systems, and modern web technologies** can be combined to build a practical healthcare-oriented application.

---

## 🎯 Problem Statement

Healthcare professionals and patients frequently deal with medical information contained in:

* Prescriptions
* Clinical reports
* Scanned documents
* Printed medical records
* Images containing patient information

Manually digitizing this information can be:

* ⏳ Time-consuming
* ✍️ Prone to manual entry errors
* 📄 Difficult to organize
* 🔍 Difficult to search and review
* 🔄 Repetitive for frequently handled documents

ClinicOCR addresses this problem by providing an automated document-to-digital-information workflow.

---

## 💡 Solution

ClinicOCR combines **OCR technology and Generative AI** to create a streamlined document processing workflow.

### Core workflow

```text
┌──────────────────────┐
│   Upload Document    │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│      OCR Engine      │
│    Tesseract.js      │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│   Extracted Text     │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│    AI Processing     │
│    Google Gemini     │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ Structured Clinical  │
│      Information     │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ Database / Report    │
│      Generation      │
└──────────────────────┘
```

---

## ✨ Key Features

### 🔍 OCR-Based Text Extraction

ClinicOCR uses **Tesseract.js** to extract text from uploaded document images.

This enables the application to transform visual medical information into machine-readable text.

### 🤖 AI-Powered Processing

Extracted text can be processed using **Google Generative AI** to help interpret and structure the information.

This creates a bridge between raw OCR output and usable digital information.

### 🗄️ Persistent Data Storage

The project uses:

* **Neon PostgreSQL** for database hosting
* **Drizzle ORM** for database interaction

This provides a structured way to store application data.

### 📝 Form Validation

User input is handled using:

* React Hook Form
* Zod

This provides structured form handling and validation.

### 📄 PDF Generation

ClinicOCR includes client-side tools for generating downloadable reports using:

* jsPDF
* html2canvas

### 🎨 Modern Responsive UI

The frontend is built using:

* Next.js
* React
* Tailwind CSS
* Lucide React icons

The interface is designed to provide a clean workflow for document processing.

---

## 🧰 Tech Stack

| Category         | Technology           |
| ---------------- | -------------------- |
| Framework        | Next.js 15           |
| Frontend         | React 19             |
| Language         | TypeScript           |
| Styling          | Tailwind CSS         |
| OCR              | Tesseract.js         |
| AI               | Google Generative AI |
| Database         | PostgreSQL           |
| Database Hosting | Neon                 |
| ORM              | Drizzle ORM          |
| Forms            | React Hook Form      |
| Validation       | Zod                  |
| PDF Generation   | jsPDF                |
| Canvas Rendering | html2canvas          |
| Icons            | Lucide React         |
| Deployment       | Vercel               |

---

## 🏗️ Project Structure

```text
ClinicOCR/
│
├── .github/
│   └── workflows/
│
├── app/
│   ├── ...
│   └── ...
│
├── components/
│   └── ...
│
├── db/
│   └── ...
│
├── lib/
│   └── ...
│
├── types/
│   └── ...
│
├── public/
│   └── ...
│
├── eng.traineddata
│
├── .env.example
├── .gitignore
├── next.config.mjs
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

### Directory Responsibilities

**`app/`**

Contains the Next.js application routes, pages, layouts, and application logic.

**`components/`**

Contains reusable React UI components.

**`db/`**

Contains database-related configuration and Drizzle ORM logic.

**`lib/`**

Contains reusable utilities and application services.

**`types/`**

Contains TypeScript type definitions used across the project.

**`eng.traineddata`**

English language training data used by the OCR pipeline.

---

## ⚙️ How It Works

### 1. Document Upload

The user provides a clinical document or image through the application.

### 2. OCR Processing

Tesseract.js processes the document and attempts to extract readable text.

```text
Image → OCR Engine → Raw Text
```

### 3. AI Processing

The extracted text can then be passed to the Google Generative AI integration for further processing and structuring.

```text
Raw OCR Text
      ↓
Google Gemini
      ↓
Structured Information
```

### 4. Data Management

Relevant information can be handled through the application's database layer using Drizzle ORM and PostgreSQL.

### 5. Report Generation

Processed information can be presented in a structured format and converted into a PDF when required.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js 18+
* npm
* Git

You will also need:

* A Neon PostgreSQL database
* A Google Gemini API key

---

### 1. Clone the Repository

```bash
git clone https://github.com/sarah-builds/ClinicOCR.git
```

Navigate into the project:

```bash
cd ClinicOCR
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory.

```env
DATABASE_URL=your_neon_database_url
GEMINI_API_KEY=your_google_gemini_api_key
```

The repository includes a `.env.example` file showing the required environment variables.

> ⚠️ **Never commit your actual API keys or database credentials to GitHub.**

---

### 4. Run the Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 📜 Available Scripts

| Command         | Description                   |
| --------------- | ----------------------------- |
| `npm run dev`   | Starts the development server |
| `npm run build` | Creates a production build    |
| `npm run start` | Starts the production server  |
| `npm run lint`  | Runs the linting command      |

These scripts are defined in the project's `package.json`.

---

## 🖼️ Screenshots

> Screenshots will be added here as the project UI is documented.

### Home / Dashboard

```text
[ Add screenshot here ]
```

### Document Upload

```text
[ Add screenshot here ]
```

### OCR Result

```text
[ Add screenshot here ]
```

### AI-Processed Information

```text
[ Add screenshot here ]
```

### Generated Report

```text
[ Add screenshot here ]
```

---

## 🔐 Security & Privacy

Because ClinicOCR works with healthcare-related information, privacy and security are important considerations.

The project follows these basic principles:

* API keys are stored using environment variables.
* Sensitive credentials should not be committed to the repository.
* Clinical information should be handled responsibly.
* AI/OCR-generated information should be reviewed before being used for real clinical decisions.

> **Disclaimer:** ClinicOCR is a software project and should not be considered a replacement for professional medical judgment. OCR and AI-generated results may contain errors and should be verified by a qualified professional before clinical use.

---

## ⚠️ Current Limitations

Like any OCR and AI-based system, ClinicOCR has some limitations:

* OCR accuracy depends on document quality.
* Handwritten or low-quality documents may produce incorrect text.
* AI-generated interpretations may contain errors.
* Different document formats may require different processing approaches.
* The application is currently a prototype/project implementation and has not been validated for production clinical use.

---

## 🔮 Future Improvements

Potential improvements include:

* [ ] Improved handwriting recognition
* [ ] Support for more document formats
* [ ] Better medical terminology extraction
* [ ] Structured patient history management
* [ ] Authentication and role-based access
* [ ] Doctor/patient dashboards
* [ ] Improved OCR accuracy through preprocessing
* [ ] Multi-language OCR support
* [ ] More advanced document classification
* [ ] Audit logs for document processing
* [ ] Stronger privacy and encryption mechanisms
* [ ] Automated deployment and testing pipelines

---

## 🧪 Future Architecture

A future version of ClinicOCR could evolve into a complete clinical document intelligence platform:

```text
                    ┌─────────────────┐
                    │  Clinical       │
                    │  Document       │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │ Image           │
                    │ Preprocessing   │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │ OCR             │
                    │ Tesseract.js    │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │ AI Extraction   │
                    │ & Structuring   │
                    └────────┬────────┘
                             ↓
              ┌──────────────┴──────────────┐
              ↓                             ↓
      ┌───────────────┐             ┌───────────────┐
      │ PostgreSQL    │             │ PDF / Report  │
      │ Database      │             │ Generation     │
      └───────────────┘             └───────────────┘
```

---

## 📚 Learning Outcomes

This project provided hands-on experience with:

* Full-stack development using Next.js
* React component architecture
* TypeScript
* OCR integration
* Generative AI APIs
* PostgreSQL databases
* Drizzle ORM
* Form validation
* PDF generation
* Environment variable management
* Vercel deployment
* Building AI-assisted healthcare applications

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

To contribute:

```bash
# Fork the repository

# Clone your fork
git clone https://github.com/YOUR_USERNAME/ClinicOCR.git

# Create a new branch
git checkout -b feature/your-feature

# Make your changes

# Commit
git commit -m "feat: add your feature"

# Push
git push origin feature/your-feature
```

Then open a Pull Request.

---

## 📄 License

This project is currently intended for educational and demonstration purposes.

---

## 👩‍💻 Author

**Sarah Ansari**

GitHub: [@sarah-builds](https://github.com/sarah-builds)


