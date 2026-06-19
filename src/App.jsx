import React, { useState, useEffect } from 'react'
import NyscSurvey from './components/NyscSurvey'
import AdminPanel from './components/AdminPanel'

function App() {
  const [isAdminView, setIsAdminView] = useState(false)
  const [surveyData, setSurveyData] = useState([])

  // Load survey data from localStorage and check URL for admin access
  useEffect(() => {
    const stored = localStorage.getItem('nyscSurveyData')
    if (stored) {
      setSurveyData(JSON.parse(stored))
    }

    // Check URL parameters for admin access
    const params = new URLSearchParams(window.location.search)
    if (params.get('admin') === 'true') {
      setIsAdminView(true)
    }
  }, [])

  const handleSurveySubmit = (data) => {
    const updatedData = [
      ...surveyData,
      {
        ...data,
        timestamp: new Date().toISOString(),
        eligibilityStatus: calculateEligibilityStatus(data)
      }
    ]
    setSurveyData(updatedData)
    localStorage.setItem('nyscSurveyData', JSON.stringify(updatedData))
  }

  const calculateEligibilityStatus = (data) => {
    const income = parseFloat(data.monthlyIncome) || 0
    const commitment = data.savingsCommitment === 'Yes'
    
    if (income >= 150000 && commitment) {
      return 'High Priority'
    } else if (income >= 100000 && commitment) {
      return 'Qualified'
    } else if (commitment) {
      return 'Standard Review'
    } else {
      return 'Follow Up Required'
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
