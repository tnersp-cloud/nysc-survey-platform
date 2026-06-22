import React, { useState, useEffect } from 'react'
import NyscSurvey from './components/NyscSurvey'
import AdminPanel from './components/AdminPanel'
import { fetchAllSurveys, saveSurveyToDatabase } from './utils/supabaseClient'
import { calculateEligibilityStatus } from './utils/excelExport'

function App() {
  const [isAdminView, setIsAdminView] = useState(false)
  const [surveyData, setSurveyData] = useState([])

  // Load survey data from Supabase on mount
  useEffect(() => {
    const loadData = async () => {
      const surveys = await fetchAllSurveys()
      setSurveyData(surveys)
    }
    loadData()

    // Check URL parameters for admin access
    const params = new URLSearchParams(window.location.search)
    if (params.get('admin') === 'true') {
      setIsAdminView(true)
    }
  }, [])

  const handleSurveySubmit = async (data) => {
    try {
      const eligibilityStatus = calculateEligibilityStatus(data)
      
      // Save to Supabase
      await saveSurveyToDatabase({
        ...data,
        eligibilityStatus
      })
      
      // Refresh survey data from database
      const surveys = await fetchAllSurveys()
      setSurveyData(surveys)
    } catch (error) {
      console.error('Failed to submit survey:', error)
      // Don't block the user — the survey already shows the success screen
    }
  }

  return (
    <div className="w-full min-h-screen">
      {isAdminView ? (
        <AdminPanel surveyData={surveyData} onBack={() => setIsAdminView(false)} />
      ) : (
        <NyscSurvey onSubmit={handleSurveySubmit} />
      )}
    </div>
  )
}

export default App
