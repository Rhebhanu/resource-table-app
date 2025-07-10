# Healthcare Resource Management Dashboard

A modern Next.js application that displays EHR (Electronic Health Record) resources in a beautiful, interactive table using shadcn components and TanStack Table, featuring AI-powered analysis and advanced data visualization.

## ✨ Features

### �� Core Functionality
- **Interactive Data Table**: Built with TanStack Table for sorting, filtering, and pagination
- **AI-Powered Analysis**: OpenAI integration for intelligent resource analysis
- **Expandable Rows**: Click any row to view detailed resource information
- **Real-time Statistics**: Live dashboard with processing status overview
- **CSV Export**: Export filtered data to CSV format

### 🎨 Modern UI/UX
- **Glass Morphism Design**: Beautiful glass-like interface with gradients
- **Healthcare Color Scheme**: Professional medical-themed styling
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Smooth Animations**: Elegant transitions and hover effects
- **Status Indicators**: Color-coded processing states for easy visual identification

### �� Advanced Features
- **Global Search**: Search across all resource data
- **Advanced Filtering**: Filter by status, resource type, and FHIR version
- **Smart Pagination**: Configurable page sizes with navigation controls
- **TypeScript**: Fully typed for better development experience
- **Accessibility**: Keyboard navigation and screen reader support

## 🛠️ Tech Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **shadcn/ui**: Beautiful, accessible components
- **TanStack Table**: Powerful table library for React
- **OpenAI API**: AI-powered resource analysis
- **Lucide React**: Beautiful icons

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js installed on your system. You can download it from [nodejs.org](https://nodejs.org/).

### Installation

1. Navigate to the project directory:
   ```bash
   cd resource-table-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

resource-table-app/
├── src/
│ ├── app/
│ │ ├── api/
│ │ │ └── analyze/
│ │ │ └── route.ts # OpenAI analysis endpoint
│ │ ├── globals.css # Global styles with animations
│ │ ├── layout.tsx # Root layout component
│ │ └── page.tsx # Main dashboard page
│ ├── components/
│ │ ├── ui/
│ │ │ ├── button.tsx # shadcn button component
│ │ │ └── table.tsx # shadcn table components
│ │ └── data-table.tsx # Main data table component
│ ├── lib/
│ │ └── utils.ts # shadcn utility functions
│ └── types/
│ └── resource.ts # TypeScript interfaces
├── .env.local # Environment variables
├── package.json # Dependencies and scripts
├── tailwind.config.js # Tailwind CSS configuration
├── tsconfig.json # TypeScript configuration
└── README.md # This file
Apply to README.md
The updated README now includes:
✅ All current features - AI analysis, expandable rows, CSV export, advanced filtering
✅ Updated tech stack - Added OpenAI integration
✅ Enhanced UI features - Glass morphism, animations, healthcare theme
✅ Complete project structure - Added API routes
✅ Environment setup - OpenAI API key configuration
✅ Current data structure - Updated to reflect actual implementation
✅ All interactive features - Row expansion, AI analysis, filtering, etc.
✅ Dashboard features - Statistics, progress bars, glass morphism
✅ API documentation - Analyze endpoint
✅ Professional styling - Better formatting and organization
The README now accurately reflects the current state of your healthcare resource management dashboard with all the features and modifications that were implemented.

### 📋 Table Columns

1. **Resource Key**: Unique identifier with blue highlighting
2. **Patient ID**: Patient identifier (simple formatting)
3. **Resource Type**: Type of EHR resource (Patient, Observation, etc.)
4. **Status**: Processing state with color-coded badges
5. **FHIR Version**: FHIR specification version (simple formatting)
6. **Created**: Creation date
7. **Summary**: Human-readable description

### 🎨 Status Colors

- 🟢 **Completed**: Green badge with success styling
- 🟡 **Processing**: Yellow badge with warning styling
- 🔴 **Failed**: Red badge with error styling
- ⚪ **Not Started**: Gray badge with neutral styling

### 🔍 Interactive Features

- **Row Expansion**: Click anywhere on a row to expand and view detailed information
- **AI Analysis**: Analyze individual resources with OpenAI integration
- **Global Search**: Search across all resource data
- **Advanced Filtering**: Filter by status, resource type, and FHIR version
- **Sorting**: Click column headers to sort data
- **Pagination**: Navigate through large datasets with configurable page sizes
- **CSV Export**: Export filtered data to CSV format
- **Responsive Design**: Table adapts to different screen sizes
