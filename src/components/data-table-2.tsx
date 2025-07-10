"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ResourceWrapper, ProcessingState, FHIRVersion } from "@/types/resource"

const columns: ColumnDef<ResourceWrapper>[] = [
  {
    accessorFn: (row) => row.resource.metadata.identifier.key,
    id: "key",
    header: "Resource Key",
    cell: ({ row }) => {
      return (
        <div className="font-bold text-blue-700">
          {row.getValue("key")}
        </div>
      )
    },
  },
  {
    accessorFn: (row) => row.resource.metadata.identifier.patientId,
    id: "patientId",
    header: "Patient ID",
    cell: ({ row }) => {
      return (
        <div className="text-sm text-gray-700">
          {row.getValue("patientId")}
        </div>
      )
    },
  },
  {
    accessorFn: (row) => row.resource.metadata.resourceType,
    id: "resourceType",
    header: "Resource Type",
    cell: ({ row }) => {
      return (
        <div className="text-sm text-gray-700">
          {row.getValue("resourceType")}
        </div>
      )
    },
  },
  {
    accessorFn: (row) => row.resource.metadata.state,
    id: "state",
    header: "Status",
    cell: ({ row }) => {
      const state = row.getValue("state") as ProcessingState
      const getStatusColor = (state: ProcessingState) => {
        switch (state) {
          case ProcessingState.PROCESSING_STATE_COMPLETED:
            return "bg-green-100 text-green-800 border border-green-200"
          case ProcessingState.PROCESSING_STATE_PROCESSING:
            return "bg-yellow-100 text-yellow-800 border border-yellow-200"
          case ProcessingState.PROCESSING_STATE_FAILED:
            return "bg-red-100 text-red-800 border border-red-200"
          case ProcessingState.PROCESSING_STATE_NOT_STARTED:
            return "bg-gray-100 text-gray-800 border border-gray-200"
          default:
            return "bg-gray-100 text-gray-800 border border-gray-200"
        }
      }
      return (
        <div className={`status-badge ${getStatusColor(state)}`}>
          {state ? state.replace("PROCESSING_STATE_", "") : "UNKNOWN"}
        </div>
      )
    },
  },
  {
    accessorFn: (row) => row.resource.metadata.version,
    id: "version",
    header: "FHIR Version",
    cell: ({ row }) => {
      const version = row.getValue("version") as FHIRVersion
      return (
        <div className="text-sm text-gray-700">
          {version ? version.replace("FHIR_VERSION_", "") : "UNKNOWN"}
        </div>
      )
    },
  },
  {
    accessorFn: (row) => row.resource.metadata.createdTime,
    id: "createdTime",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdTime"))
      return (
        <div className="text-sm text-gray-600">
          {date.toLocaleDateString()}
        </div>
      )
    },
  },
  {
    accessorFn: (row) => row.resource.humanReadableStr,
    id: "summary",
    header: "Summary",
    cell: ({ row }) => {
      const summary = row.getValue("summary") as string
      return (
        <div className="max-w-xs text-sm text-gray-700 leading-relaxed max-h-20 overflow-y-auto">
          {summary}
        </div>
      )
    },
  },
]

interface DataTableProps {
  data: ResourceWrapper[]
}

export function DataTable({ data }: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [showFilters, setShowFilters] = React.useState(false)
  const [expandedRows, setExpandedRows] = React.useState<Set<string>>(new Set())
  const [analyzingResources, setAnalyzingResources] = React.useState<Set<string>>(new Set())
  const [aiResults, setAiResults] = React.useState<Record<string, string>>({})
  const [hiddenAnalyses, setHiddenAnalyses] = React.useState<Set<string>>(new Set())

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  })

  // Keyboard navigation for expandable rows
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && event.target instanceof HTMLElement) {
        const expandButton = event.target.closest('[data-expand-button]')
        if (expandButton) {
          const rowKey = expandButton.getAttribute('data-row-key')
          if (rowKey) {
            toggleRowExpansion(rowKey)
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const exportToCSV = () => {
    const headers = columns.map(col => col.header as string).join(',')
    const rows = table.getFilteredRowModel().rows.map(row => {
      return columns.map(col => {
        const value = row.getValue(col.id as string)
        return typeof value === 'string' ? `"${value}"` : value
      }).join(',')
    }).join('\n')
    
    const csv = `${headers}\n${rows}`
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'healthcare-resources.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const toggleRowExpansion = (rowKey: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev)
      if (newSet.has(rowKey)) {
        newSet.delete(rowKey)
      } else {
        newSet.add(rowKey)
      }
      return newSet
    })
  }

  const analyzeResource = async (resource: ResourceWrapper) => {
    const resourceKey = resource.resource.metadata.identifier.key
    
    setAnalyzingResources(prev => {
      const newSet = new Set(prev)
      newSet.add(resourceKey)
      return newSet
    })

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resourceType: resource.resource.metadata.resourceType,
          summary: resource.resource.humanReadableStr,
          patientId: resource.resource.metadata.identifier.patientId,
          status: resource.resource.metadata.state,
          fhirVersion: resource.resource.metadata.version
        }),
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const result = await response.json()
      
      setAiResults(prev => ({
        ...prev,
        [resourceKey]: result.analysis
      }))
    } catch (error) {
      console.error('Analysis error:', error)
      setAiResults(prev => ({
        ...prev,
        [resourceKey]: 'Analysis failed. Please try again.'
      }))
    } finally {
      setAnalyzingResources(prev => {
        const newSet = new Set(prev)
        newSet.delete(resourceKey)
        return newSet
      })
    }
  }

  const toggleAnalysisVisibility = (resourceKey: string) => {
    setHiddenAnalyses(prev => {
      const newSet = new Set(prev)
      if (newSet.has(resourceKey)) {
        newSet.delete(resourceKey)
      } else {
        newSet.add(resourceKey)
      }
      return newSet
    })
  }

  const clearAllFilters = () => {
    setColumnFilters([])
    setGlobalFilter("")
  }

  const currentPageRowsCount = table.getRowModel().rows.length
  const totalRowsCount = table.getFilteredRowModel().rows.length

  return (
    <div className="w-full space-y-4">
      {/* Enhanced Toolbar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative">
              <input
                placeholder="Search resources..."
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-full sm:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <svg className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2"
            >
              {showFilters ? "Hide" : "Show"} Filters
            </Button>

            {(columnFilters.length > 0 || globalFilter) && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                Clear Filters
              </Button>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportToCSV}
              className="text-green-600 border-green-300 hover:bg-green-50"
            >
              Export CSV
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={columnFilters.find(f => f.id === "state")?.value || ""}
                  onChange={(e) => {
                    const filter = columnFilters.find(f => f.id === "state")
                    if (filter) {
                      filter.value = e.target.value
                      setColumnFilters([...columnFilters])
                    } else {
                      setColumnFilters([...columnFilters, { id: "state", value: e.target.value }])
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="PROCESSING_STATE_COMPLETED">Completed</option>
                  <option value="PROCESSING_STATE_PROCESSING">Processing</option>
                  <option value="PROCESSING_STATE_FAILED">Failed</option>
                  <option value="PROCESSING_STATE_NOT_STARTED">Not Started</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resource Type</label>
                <select
                  value={columnFilters.find(f => f.id === "resourceType")?.value || ""}
                  onChange={(e) => {
                    const filter = columnFilters.find(f => f.id === "resourceType")
                    if (filter) {
                      filter.value = e.target.value
                      setColumnFilters([...columnFilters])
                    } else {
                      setColumnFilters([...columnFilters, { id: "resourceType", value: e.target.value }])
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="Patient">Patient</option>
                  <option value="Observation">Observation</option>
                  <option value="MedicationRequest">Medication Request</option>
                  <option value="Procedure">Procedure</option>
                  <option value="Condition">Condition</option>
                  <option value="Encounter">Encounter</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">FHIR Version</label>
                <select
                  value={columnFilters.find(f => f.id === "version")?.value || ""}
                  onChange={(e) => {
                    const filter = columnFilters.find(f => f.id === "version")
                    if (filter) {
                      filter.value = e.target.value
                      setColumnFilters([...columnFilters])
                    } else {
                      setColumnFilters([...columnFilters, { id: "version", value: e.target.value }])
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Versions</option>
                  <option value="FHIR_VERSION_R4">R4</option>
                  <option value="FHIR_VERSION_R4B">R4B</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-gray-50 border-b border-gray-200">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead 
                      key={header.id} 
                      className="text-gray-700 font-semibold text-sm py-4 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => {
                        if (header.column.getCanSort()) {
                          header.column.toggleSorting()
                        }
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <span className="text-gray-400">
                            {header.column.getIsSorted() === "asc" ? "↑" : 
                             header.column.getIsSorted() === "desc" ? "↓" : "↕"}
                          </span>
                        )}
                      </div>
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => {
                const rowData = row.original
                const rowKey = rowData.resource.metadata.identifier.key
                const isExpanded = expandedRows.has(rowKey)
                
                return (
                  <React.Fragment key={row.id}>
                    <TableRow 
                      className="table-row-hover border-b border-gray-100 bg-white cursor-pointer"
                      onClick={() => toggleRowExpansion(rowKey)}
                      aria-expanded={isExpanded}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-4 text-gray-900">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                    
                    {/* Expanded Row Details */}
                    {isExpanded && (
                      <TableRow className="bg-gray-50 border-b border-gray-200">
                        <TableCell colSpan={columns.length} className="py-6">
                          <div className="max-w-6xl mx-auto">
                            {/* Compact Header */}
                            <div className="mb-4">
                              <h3 className="text-base font-semibold text-gray-900">
                                {rowData.resource.metadata.resourceType}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Patient {rowData.resource.metadata.identifier.patientId}
                              </p>
                            </div>

                            {/* Compact Grid Layout - Equal Columns */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                              {/* Resource Details - Compact */}
                              <div>
                                <div className="bg-white rounded-lg border border-gray-200 p-4 h-full">
                                  <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">Resource Details</h4>
                                  <div className="space-y-2 text-xs">
                                    <div>
                                      <span className="text-gray-500">Key:</span>
                                      <span className="ml-2 text-gray-900 font-medium">{rowData.resource.metadata.identifier.key}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">UID:</span>
                                      <span className="ml-2 text-gray-900">{rowData.resource.metadata.identifier.uid.replace('urn:uuid:', '')}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">FHIR:</span>
                                      <span className="ml-2 text-gray-900">{rowData.resource.metadata.version ? rowData.resource.metadata.version.replace("FHIR_VERSION_", "") : "Unknown"}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Timestamps - Compact */}
                              <div>
                                <div className="bg-white rounded-lg border border-gray-200 p-4 h-full">
                                  <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">Timestamps</h4>
                                  <div className="space-y-2 text-xs">
                                    <div>
                                      <span className="text-gray-500">Created:</span>
                                      <span className="ml-2 text-gray-900">{new Date(rowData.resource.metadata.createdTime).toLocaleDateString()}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Fetched:</span>
                                      <span className="ml-2 text-gray-900">{new Date(rowData.resource.metadata.fetchTime).toLocaleDateString()}</span>
                                    </div>
                                    {rowData.resource.metadata.processedTime && (
                                      <div>
                                        <span className="text-gray-500">Processed:</span>
                                        <span className="ml-2 text-gray-900">{new Date(rowData.resource.metadata.processedTime).toLocaleDateString()}</span>
                                      </div>
                                    )}
                                    {!rowData.resource.metadata.processedTime && (
                                      <div>
                                        <span className="text-gray-500">Processed:</span>
                                        <span className="ml-2 text-gray-400">Not available</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Content - Compact */}
                              <div>
                                <div className="bg-white rounded-lg border border-gray-200 p-4 h-full">
                                  <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">Content</h4>
                                  <div className="space-y-3">
                                    {/* AI Analysis - Compact */}
                                    <div>
                                      <div className="flex items-center justify-between mb-1">
                                        <div className="text-xs text-gray-500">AI Analysis</div>
                                        <Button
                                          onClick={() => {
                                            if (aiResults[rowData.resource.metadata.identifier.key]) {
                                              toggleAnalysisVisibility(rowData.resource.metadata.identifier.key)
                                            } else {
                                              analyzeResource(rowData)
                                            }
                                          }}
                                          disabled={analyzingResources.has(rowData.resource.metadata.identifier.key)}
                                          size="sm"
                                          variant="outline"
                                          className="text-xs h-6 px-2"
                                        >
                                          {analyzingResources.has(rowData.resource.metadata.identifier.key) 
                                            ? "Analyzing..." 
                                            : aiResults[rowData.resource.metadata.identifier.key] 
                                              ? (hiddenAnalyses.has(rowData.resource.metadata.identifier.key) ? "Show Analysis" : "Hide Analysis")
                                              : "Analyze"
                                          }
                                        </Button>
                                      </div>
                                      
                                      {aiResults[rowData.resource.metadata.identifier.key] && !hiddenAnalyses.has(rowData.resource.metadata.identifier.key) && (
                                        <div className="text-xs text-gray-800 leading-relaxed bg-green-50 p-3 rounded border border-green-200">
                                          {aiResults[rowData.resource.metadata.identifier.key]}
                                        </div>
                                      )}
                                      
                                      {analyzingResources.has(rowData.resource.metadata.identifier.key) && (
                                        <div className="text-xs text-gray-600 bg-yellow-50 p-2 rounded border border-yellow-200">
                                          <div className="flex items-center gap-2">
                                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                                            Analyzing...
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                )
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-500"
                >
                  {globalFilter ? "No results found for your search." : "No results found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Enhanced Pagination Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex-1 text-sm text-gray-600">
            Showing {currentPageRowsCount} of {totalRowsCount} total rows
          </div>
          
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium text-gray-700">Rows per page</p>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value))
                }}
                className="h-8 w-16 rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex w-[100px] items-center justify-center text-sm font-medium text-gray-700">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="pagination-button h-8 w-8 p-0 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <span className="sr-only">Go to previous page</span>
                ←
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="pagination-button h-8 w-8 p-0 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <span className="sr-only">Go to next page</span>
                →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 