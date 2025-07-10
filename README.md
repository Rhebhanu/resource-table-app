# Healthcare Resource Management Dashboard

A modern Next.js application that displays EHR (Electronic Health Record) resources in a beautiful, interactive table using shadcn components and TanStack Table, featuring AI-powered analysis and advanced data visualization.

## ✨ Features

### Core Functionality
- **Interactive Data Table**: Built with TanStack Table for sorting, filtering, and pagination
- **AI-Powered Analysis**: OpenAI integration for intelligent resource analysis
- **Expandable Rows**: Click any row to view detailed resource information
- **Real-time Statistics**: Live dashboard with processing status overview
- **CSV Export**: Export filtered data to CSV format

### Advanced Features
- **Global Search**: Search across all resource data
- **Advanced Filtering**: Filter by status, resource type, and FHIR version
- **Smart Pagination**: Configurable page sizes with navigation controls

## Tech Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **shadcn/ui**: Beautiful, accessible components
- **TanStack Table**: Powerful table library for React
- **OpenAI API**: AI-powered resource analysis
- **Lucide React**: Beautiful icons

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js installed on your system.

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

### 📋 Table Columns

1. **Resource Key**: Unique identifier with blue highlighting
2. **Patient ID**: Patient identifier
3. **Resource Type**: Type of EHR resource (Patient, Observation, etc.)
4. **Status**: Processing state with color-coded badges
5. **FHIR Version**: FHIR specification version 
6. **Created**: Creation date
7. **Summary**: Description

### 🔍 Interactive Features

- **Row Expansion**: Click anywhere on a row to expand and view detailed information
- **AI Analysis**: Analyze individual resources with OpenAI integration
- **Global Search**: Search across all resource data
- **Advanced Filtering**: Filter by status, resource type, and FHIR version
- **Sorting**: Click column headers to sort data
- **Pagination**: Navigate through large datasets with configurable page sizes
- **CSV Export**: Export filtered data to CSV format
- **Responsive Design**: Table adapts to different screen sizes
