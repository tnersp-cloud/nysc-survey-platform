import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { exportBatchToExcel, generateExcelBuffer } from '../utils/excelExport'

const AdminPanel = ({ surveyData = [], onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [selectedRecords, setSelectedRecords] = useState(new Set())
  const [isEmailLoading, setIsEmailLoading] = useState(false)

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

  const sendEmailExport = async (dataToExport, filename) => {
    try {
      setIsEmailLoading(true)
      
      // Generate Excel buffer
      const excelBuffer = generateExcelBuffer(dataToExport)
      const base64Data = excelBuffer.toString('base64')
      
      // Send to backend
      const response = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:3001') + '/api/send-export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          excelData: base64Data,
          filename: filename
        })
      })
      
      const result = await response.json()
      
      if (response.ok) {
        alert(`✅ Email sent successfully to info@axplimited.com!\n\nFile: ${filename}`)
      } else {
        alert(`❌ Error sending email: ${result.error}`)
      }
    } catch (error) {
      console.error('Email error:', error)
      alert(`❌ Failed to send email: ${error.message}\n\nMake sure backend server is running on port 3001`)
    } finally {
      setIsEmailLoading(false)
    }
  }

  const handleExportAndEmailSelected = () => {
    if (selectedRecords.size === 0) {
      alert('Please select at least one record to export')
      return
    }
    
    const selectedData = Array.from(selectedRecords).map(idx => surveyData[idx])
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:]/g, '')
    const filename = `NYSC_Survey_Export_${timestamp}.xlsx`
    
    sendEmailExport(selectedData, filename)
  }

  const handleExportAndEmailAll = () => {
    if (surveyData.length === 0) {
      alert('No survey data available to export')
      return
    }
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:]/g, '')
    const filename = `NYSC_Survey_Complete_Export_${timestamp}.xlsx`
    
    sendEmailExport(surveyData, filename)
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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

          {/* Email Export Options */}
          <div className="border-t-2 border-gray-200 pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">📧 Send via Email to info@axplimited.com</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handleExportAndEmailAll}
                disabled={isEmailLoading}
                className="bg-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEmailLoading ? '⏳ Sending...' : '📧 Email All Records'}
              </button>
              <button
                onClick={handleExportAndEmailSelected}
                disabled={selectedRecords.size === 0 || isEmailLoading}
                className={`font-bold py-3 px-6 rounded-lg transition ${
                  selectedRecords.size === 0 || isEmailLoading
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isEmailLoading ? '⏳ Sending...' : `📧 Email Selected (${selectedRecords.size})`}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3 italic">Backend server must be running. Run: npm run dev:full</p>
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
              <table className="w-full text-sm whitespace-nowrap">
                <thead>
                  <tr className="bg-teal text-white">
                    <th className="px-4 py-3 text-left sticky left-0 bg-teal z-10">
                      <input
                        type="checkbox"
                        checked={selectedRecords.size === surveyData.length && surveyData.length > 0}
                        onChange={selectAll}
                        className="w-4 h-4"
                      />
                    </th>
                    <th className="px-4 py-3 text-left font-semibold sticky left-12 bg-teal z-10">Name</th>
                    <th className="px-4 py-3 text-left font-semibold">Eligibility</th>
                    <th className="px-4 py-3 text-left font-semibold">Phone</th>
                    <th className="px-4 py-3 text-left font-semibold">Email</th>
                    <th className="px-4 py-3 text-left font-semibold">Age</th>
                    <th className="px-4 py-3 text-left font-semibold">Gender</th>
                    <th className="px-4 py-3 text-left font-semibold">State</th>
                    <th className="px-4 py-3 text-left font-semibold">Current Status</th>
                    <th className="px-4 py-3 text-left font-semibold">Field of Study</th>
                    <th className="px-4 py-3 text-left font-semibold">Ownership Statement</th>
                    <th className="px-4 py-3 text-left font-semibold">Home by 35?</th>
                    <th className="px-4 py-3 text-left font-semibold">Ideal Home Age</th>
                    <th className="px-4 py-3 text-left font-semibold">Home Type</th>
                    <th className="px-4 py-3 text-left font-semibold">Biggest Obstacle</th>
                    <th className="px-4 py-3 text-left font-semibold">Preferred City</th>
                    <th className="px-4 py-3 text-left font-semibold">Saves Monthly?</th>
                    <th className="px-4 py-3 text-left font-semibold">Monthly Savings</th>
                    <th className="px-4 py-3 text-left font-semibold">Join Savings Plan?</th>
                    <th className="px-4 py-3 text-left font-semibold">Equity Contribution</th>
                    <th className="px-4 py-3 text-left font-semibold">Preferred Product</th>
                    <th className="px-4 py-3 text-left font-semibold">Start Small (5k-10k)?</th>
                    <th className="px-4 py-3 text-left font-semibold">Investment Returns?</th>
                    <th className="px-4 py-3 text-left font-semibold">Desired Benefits</th>
                    <th className="px-4 py-3 text-left font-semibold">Early Access?</th>
                    <th className="px-4 py-3 text-left font-semibold">Free Assessment?</th>
                    <th className="px-4 py-3 text-left font-semibold">Date Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {surveyData.map((record, idx) => {
                    const isSelected = selectedRecords.has(idx);
                    return (
                    <tr
                      key={idx}
                      className={`border-b border-gray-200 transition ${isSelected ? 'bg-teal-50' : 'hover:bg-gray-50'}`}
                    >
                      <td className={`px-4 py-3 sticky left-0 z-10 ${isSelected ? 'bg-teal-50' : 'bg-white'}`}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRecordSelection(idx)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className={`px-4 py-3 font-semibold text-gray-800 sticky left-12 z-10 ${isSelected ? 'bg-teal-50' : 'bg-white'}`}>
                        {record.fullName || record.full_name || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${
                            (record.eligibilityStatus || record.eligibility_status) === 'High Priority'
                              ? 'bg-green-100 text-green-800'
                              : (record.eligibilityStatus || record.eligibility_status) === 'Qualified'
                              ? 'bg-blue-100 text-blue-800'
                              : (record.eligibilityStatus || record.eligibility_status) === 'Standard Review'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {record.eligibilityStatus || record.eligibility_status || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{record.phoneNumber || record.phone_number || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{record.emailAddress || record.email_address || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{record.age || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{record.gender || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{record.state || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{record.currentStatus || record.current_status || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{record.fieldOfStudy || record.field_of_study || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{record.ownershipStatement || record.ownership_statement || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{record.believeHomeBefore35 || record.believe_home_before_35 || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{record.idealHomeAge || record.ideal_home_age || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{record.homeType || record.home_type || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{record.biggestObstacle || record.biggest_obstacle || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {record.preferredCity === '__other__' || record.preferred_city === '__other__' 
                          ? (record.preferredCityOther || record.preferred_city_other || '—') 
                          : (record.preferredCity || record.preferred_city || '—')}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{record.savesMonthly || record.saves_monthly || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{record.monthlySavingsAmount || record.monthly_savings_amount || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{record.willJoinSavingsPlan || record.will_join_savings_plan || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{record.equityContribution || record.equity_contribution || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{record.preferredProduct || record.preferred_product || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{record.wouldJoinSmallAmount || record.would_join_small_amount || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{record.wantsInvestmentReturns || record.wants_investment_returns || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {Array.isArray(record.desiredBenefits) 
                          ? record.desiredBenefits.join(', ') 
                          : record.desired_benefits || '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{record.wantsEarlyAccess || record.wants_early_access || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{record.wantsFreeAssessment || record.wants_free_assessment || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {record.timestamp || record.created_at ? new Date(record.timestamp || record.created_at).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  )})}
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
