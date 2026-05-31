// Data Preview Component with Table
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export function DataPreviewTable({ datasetId, onNext, onBack }: any) {
    const [loading, setLoading] = useState(true)
    const [previewData, setPreviewData] = useState<any[]>([])
    const [columns, setColumns] = useState<string[]>([])
    const [stats, setStats] = useState({ rows: 0, columns: 0 })

    // Mock data for now - will be replaced with real API call
    useState(() => {
        // Simulate API call
        setTimeout(() => {
            const mockColumns = ['Date', 'Product Description', 'HS Code', 'Quantity', 'Value (USD)', 'Country', 'Importer/Exporter']
            const mockData = [
                { 'Date': '2024-01-15', 'Product Description': 'PARACETAMOL TABLETS 500MG', 'HS Code': '3004.90.10', 'Quantity': '50000', 'Value (USD)': '12500', 'Country': 'India', 'Importer/Exporter': 'ABC Pharma Ltd' },
                { 'Date': '2024-01-16', 'Product Description': 'ASPIRIN TABLETS 75MG ENTERIC COATED', 'HS Code': '3004.90.20', 'Quantity': '30000', 'Value (USD)': '8900', 'Country': 'China', 'Importer/Exporter': 'XYZ Chemicals' },
                { 'Date': '2024-01-17', 'Product Description': 'IBUPROFEN SUSPENSION 100MG/5ML', 'HS Code': '3004.90.30', 'Quantity': '25000', 'Value (USD)': '15600', 'Country': 'USA', 'Importer/Exporter': 'Global Meds Inc' },
                { 'Date': '2024-01-18', 'Product Description': 'AMOXICILLIN CAPSULES 500MG', 'HS Code': '3004.20.10', 'Quantity': '40000', 'Value (USD)': '22000', 'Country': 'Germany', 'Importer/Exporter': 'Euro Pharma GmbH' },
                { 'Date': '2024-01-19', 'Product Description': 'METFORMIN TABLETS 850MG', 'HS Code': '3004.90.40', 'Quantity': '35000', 'Value (USD)': '18500', 'Country': 'India', 'Importer/Exporter': 'Diabetes Care Ltd' },
            ]
            setColumns(mockColumns)
            setPreviewData(mockData)
            setStats({ rows: 1247, columns: mockColumns.length })
            setLoading(false)
        }, 1000)
    })

    return (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Data Preview</h2>
                <p className="text-slate-600">Review your merged dataset before cleaning</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <span className="ml-3 text-slate-600">Loading data...</span>
                </div>
            ) : (
                <>
                    {/* Stats Cards */}
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                            <p className="text-sm text-blue-700 font-medium mb-1">Total Rows</p>
                            <p className="text-2xl font-bold text-blue-900">{stats.rows.toLocaleString()}</p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                            <p className="text-sm text-purple-700 font-medium mb-1">Total Columns</p>
                            <p className="text-2xl font-bold text-purple-900">{stats.columns}</p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                            <p className="text-sm text-green-700 font-medium mb-1">Files Merged</p>
                            <p className="text-2xl font-bold text-green-900">1</p>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="mb-6 overflow-x-auto rounded-xl border border-slate-200">
                        <table className="w-full text-sm">
                            <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                                <tr>
                                    {columns.map((col, idx) => (
                                        <th key={idx} className="px-4 py-3 text-left font-semibold text-slate-700 border-b border-slate-200 whitespace-nowrap">
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {previewData.map((row, rowIdx) => (
                                    <tr key={rowIdx} className="hover:bg-slate-50 transition-colors">
                                        {columns.map((col, colIdx) => (
                                            <td key={colIdx} className="px-4 py-3 border-b border-slate-100 text-slate-700 whitespace-nowrap">
                                                {row[col]}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <p className="text-sm text-slate-500 mb-6">Showing first 5 rows of {stats.rows.toLocaleString()} total rows</p>
                </>
            )}

            <div className="flex gap-4">
                <button onClick={onBack} className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors">
                    ← Back
                </button>
                <button
                    onClick={onNext}
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all hover:scale-105 disabled:opacity-50"
                >
                    Continue to Cleaning →
                </button>
            </div>
        </div>
    )
}
