import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { exportBatchToExcel } from '../utils/excelExport'

const AdminPanel = ({ surveyData = [], onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [selectedRecords, setSelectedRecords] = useState(new Set())

  // Simple password authentication (in production, use proper backend auth)
  const handleLogin = () => {
    if (passwordInput === adminPassword || passwordInput === 'admin123') {
      setIsAuthenticated(true)
      setPasswordInput('')
    } else {
      alert('Invalid password')
      setPasswordInput('')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setPasswordInput('')
    if (onBack) {
      onBack()
    }
  }

  const toggleRecordSelection = (index) => {
    const newSelected = new Set(selectedRecords)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedRecords(newSelected)
  }

  const selectAll = () => {
    if (selectedRecords.size === surveyData.length) {
      setSelectedRecords(new Set())
    } else {
      setSelectedRecords(new Set(Array.from({ length: surveyData.length }, (_, i) => i)))
    }
  }

  const handleExportSelected = () => {
    if (selectedRecords.size === 0) {
      alert('Please select at least one record to export')
      return
    }

    const selectedData = Array.from(selectedRecords).map(idx => surveyData[idx])
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:]/g, '')
    exportBatchToExcel(selectedData, `NYSC_Survey_Export_${timestamp}.xlsx`)
  }

  const handleExportAll = () => {
    if (surveyData.length === 0) {
      alert('No survey data available to export')
      return
    }
    exportBatchToExcel(surveyData, `NYSC_Survey_Complete_Export_${Date.now()}.xlsx`)
  }

  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4"
      >
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-teal mb-2">AXP</div>
            <div className="text-sm text-gray-600 mb-4">ADMIN PANEL</div>
            <p className="text-gray-600">Authorized Access Only</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Admin Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal transition"
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-teal text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-dark transition"
            >
              Login
            </button>
          </div>

          <div className="mt-6 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
            <p className="text-xs text-blue-800">
              <strong>Demo:</strong> Use password <code>admin123</code> to access the admin panel.
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-cream via-white to-cream py-8 px-4"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-teal mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage and export NYSC survey responses</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm uppercase tracking-widest">Total Responses</p>
            <p className="text-4xl font-bold text-teal mt-2">{surveyData.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm uppercase tracking-widest">Selected</p>
            <p className="text-4xl font-bold text-forest mt-2">{selectedRecords.size}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm uppercase tracking-widest">Export Ready</p>
            <p className="text-4xl font-bold text-teal-light mt-2">✓</p>
          </div>
        </div>

        {/* Export Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Export Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleExportAll}
              className="bg-teal text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-dark transition"
            >
              📊 Export All Records
            </button>
            <button
              onClick={handleExportSelected}
              disabled={selectedRecords.size === 0}
              className={`font-bold py-3 px-6 rounded-lg transition ${
                selectedRecords.size === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-forest text-white hover:bg-forest-dark'
              }`}
            >
              📋 Export Selected ({selectedRecords.size})
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b-2 border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Survey Responses</h2>
            {surveyData.length > 0 && (
              <button
                onClick={selectAll}
                className="text-teal font-semibold hover:underline"
              >
                {selectedRecords.size === surveyData.length
                  ? 'Deselect All'
                  : 'Select All'}
              </button>
            )}
          </div>

          {surveyData.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">No survey data collected yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-teal text-white">
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedRecords.size === surveyData.length && surveyData.length > 0}
                        onChange={selectAll}
                        className="w-5 h-5"
                      />
                    </th>
                    <th className="px-6 py-3 text-left font-semibold">Name</th>
                    <th className="px-6 py-3 text-left font-semibold">Phone</th>
                    <th className="px-6 py-3 text-left font-semibold">Income</th>
                    <th className="px-6 py-3 text-left font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {surveyData.map((record, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-3">
                        <input
                          type="checkbox"
                          checked={selectedRecords.has(idx)}
                          onChange={() => toggleRecordSelection(idx)}
                          className="w-5 h-5"
                        />
                      </td>
                      <td className="px-6 py-3 font-semibold text-gray-800">
                        {record.fullName}
                      </td>
                      <td className="px-6 py-3 text-gray-600">{record.phoneNumber}</td>
                      <td className="px-6 py-3 text-gray-600">
                        ₦{parseFloat(record.monthlyIncome || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            record.eligibilityStatus === 'High Priority'
                              ? 'bg-green-100 text-green-800'
                              : record.eligibilityStatus === 'Qualified'
                              ? 'bg-blue-100 text-blue-800'
                              : record.eligibilityStatus === 'Standard Review'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {record.eligibilityStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default AdminPanel
