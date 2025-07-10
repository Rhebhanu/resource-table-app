import { DataTable } from "@/components/data-table"
import { ResourceWrapper, ProcessingState, FHIRVersion } from "@/types/resource"

// Sample data for demonstration
const sampleData: ResourceWrapper[] = [
  {
    resource: {
      metadata: {
        state: ProcessingState.PROCESSING_STATE_COMPLETED,
        createdTime: "2024-01-15T10:30:00Z",
        fetchTime: "2024-01-15T10:35:00Z",
        processedTime: "2024-01-15T10:40:00Z",
        identifier: {
          key: "patient-001",
          uid: "urn:uuid:12345678-1234-1234-1234-123456789abc",
          patientId: "P001"
        },
        resourceType: "Patient",
        version: FHIRVersion.FHIR_VERSION_R4
      },
      humanReadableStr: "Patient John Doe, age 35, admitted for chest pain"
    }
  },
  {
    resource: {
      metadata: {
        state: ProcessingState.PROCESSING_STATE_PROCESSING,
        createdTime: "2024-01-15T11:00:00Z",
        fetchTime: "2024-01-15T11:05:00Z",
        identifier: {
          key: "observation-001",
          uid: "urn:uuid:87654321-4321-4321-4321-cba987654321",
          patientId: "P001"
        },
        resourceType: "Observation",
        version: FHIRVersion.FHIR_VERSION_R4
      },
      humanReadableStr: "Blood pressure reading: 140/90 mmHg"
    }
  },
  {
    resource: {
      metadata: {
        state: ProcessingState.PROCESSING_STATE_FAILED,
        createdTime: "2024-01-15T12:00:00Z",
        fetchTime: "2024-01-15T12:05:00Z",
        identifier: {
          key: "medication-001",
          uid: "urn:uuid:11111111-2222-3333-4444-555555555555",
          patientId: "P002"
        },
        resourceType: "MedicationRequest",
        version: FHIRVersion.FHIR_VERSION_R4B
      },
      humanReadableStr: "Prescription for Aspirin 100mg daily"
    }
  },
  {
    resource: {
      metadata: {
        state: ProcessingState.PROCESSING_STATE_NOT_STARTED,
        createdTime: "2024-01-15T13:00:00Z",
        fetchTime: "2024-01-15T13:05:00Z",
        identifier: {
          key: "procedure-001",
          uid: "urn:uuid:aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
          patientId: "P003"
        },
        resourceType: "Procedure",
        version: FHIRVersion.FHIR_VERSION_R4
      },
      humanReadableStr: "Cardiac catheterization procedure scheduled"
    }
  },
  {
    resource: {
      metadata: {
        state: ProcessingState.PROCESSING_STATE_COMPLETED,
        createdTime: "2024-01-15T14:00:00Z",
        fetchTime: "2024-01-15T14:05:00Z",
        processedTime: "2024-01-15T14:10:00Z",
        identifier: {
          key: "condition-001",
          uid: "urn:uuid:bbbbbbbb-cccc-dddd-eeee-ffffffffffff",
          patientId: "P001"
        },
        resourceType: "Condition",
        version: FHIRVersion.FHIR_VERSION_R4
      },
      humanReadableStr: "Diagnosis: Acute coronary syndrome"
    }
  },
  {
    resource: {
      metadata: {
        state: ProcessingState.PROCESSING_STATE_COMPLETED,
        createdTime: "2024-01-15T15:00:00Z",
        fetchTime: "2024-01-15T15:05:00Z",
        processedTime: "2024-01-15T15:10:00Z",
        identifier: {
          key: "encounter-001",
          uid: "urn:uuid:cccccccc-dddd-eeee-ffff-gggggggggggg",
          patientId: "P001"
        },
        resourceType: "Encounter",
        version: FHIRVersion.FHIR_VERSION_R4
      },
      humanReadableStr: "Emergency department visit for chest pain"
    }
  }
]

// Calculate statistics
const stats = {
  total: sampleData.length,
  completed: sampleData.filter(item => item.resource.metadata.state === ProcessingState.PROCESSING_STATE_COMPLETED).length,
  processing: sampleData.filter(item => item.resource.metadata.state === ProcessingState.PROCESSING_STATE_PROCESSING).length,
  failed: sampleData.filter(item => item.resource.metadata.state === ProcessingState.PROCESSING_STATE_FAILED).length,
  notStarted: sampleData.filter(item => item.resource.metadata.state === ProcessingState.PROCESSING_STATE_NOT_STARTED).length,
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="glass-card m-6 rounded-xl p-8 fade-in">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 slide-up">
            Electronic Health Record Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto slide-up">
            Comprehensive EHR resource management system with real-time processing status and intelligent data visualization
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass-card rounded-lg p-6 text-center bounce-in border-l-4 border-blue-500" style={{animationDelay: '0.1s'}}>
            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.total}</div>
            <div className="text-gray-600 text-sm font-medium">Total Resources</div>
          </div>
          
          <div className="glass-card rounded-lg p-6 text-center bounce-in border-l-4 border-green-500" style={{animationDelay: '0.2s'}}>
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.completed}</div>
            <div className="text-gray-600 text-sm font-medium">Completed</div>
          </div>
          
          <div className="glass-card rounded-lg p-6 text-center bounce-in border-l-4 border-yellow-500" style={{animationDelay: '0.3s'}}>
            <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.processing}</div>
            <div className="text-gray-600 text-sm font-medium">Processing</div>
          </div>
          
          <div className="glass-card rounded-lg p-6 text-center bounce-in border-l-4 border-red-500" style={{animationDelay: '0.4s'}}>
            <div className="text-3xl font-bold text-red-600 mb-2">{stats.failed}</div>
            <div className="text-gray-600 text-sm font-medium">Failed</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="glass-card rounded-lg p-6 mb-8 slide-up">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Processing Progress</h3>
            <span className="text-gray-600 font-medium">
              {Math.round((stats.completed / stats.total) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${(stats.completed / stats.total) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="glass-card m-6 rounded-xl p-8 slide-up">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Resource Management Table</h2>
          <p className="text-gray-600">Interactive table with real-time status tracking and advanced filtering capabilities</p>
        </div>
        <DataTable data={sampleData} />
      </div>

      {/* Footer */}
      <div className="text-center py-8">
        <p className="text-gray-500 text-sm">
          Built with Next.js, TanStack Table, and shadcn/ui • 
          <span className="text-blue-600 ml-2 font-medium">FHIR R4/R4B Compliant</span>
        </p>
      </div>
    </div>
  )
} 