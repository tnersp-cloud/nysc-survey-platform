import * as XLSX from 'xlsx'

/**
 * Calculate eligibility status based on survey data
 */
export const calculateEligibilityStatus = (data) => {
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

/**
 * Export survey data to Excel file
 */
export const exportToExcel = (surveyData) => {
  // Prepare data for Excel
  const timestamp = new Date().toLocaleString('en-NG', { 
    timeZone: 'Africa/Lagos',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
  
  const eligibilityStatus = calculateEligibilityStatus(surveyData)
  
  // Create data array with exact column order
  const data = [
    {
      'Timestamp': timestamp,
      'Full Name': surveyData.fullName || '',
      'Phone Number': surveyData.phoneNumber || '',
      'NYSC Stage': surveyData.nyscStage || '',
      'Monthly Income (NGN)': surveyData.monthlyIncome || '',
      'Desired Location': surveyData.desiredLocation || '',
      'Savings Commitment': surveyData.savingsCommitment || '',
      'Eligibility Status': eligibilityStatus
    }
  ]
  
  // Create workbook and worksheet
  const ws = XLSX.utils.json_to_sheet(data, {
    header: ['Timestamp', 'Full Name', 'Phone Number', 'NYSC Stage', 'Monthly Income (NGN)', 'Desired Location', 'Savings Commitment', 'Eligibility Status']
  })
  
  // Set column widths
  const columnWidths = [
    { wch: 20 }, // Timestamp
    { wch: 20 }, // Full Name
    { wch: 15 }, // Phone Number
    { wch: 18 }, // NYSC Stage
    { wch: 18 }, // Monthly Income
    { wch: 20 }, // Desired Location
    { wch: 18 }, // Savings Commitment
    { wch: 18 }  // Eligibility Status
  ]
  ws['!cols'] = columnWidths
  
  // Style header row
  const headerStyle = {
    fill: { fgColor: { rgb: '0D7A7A' } },
    font: { bold: true, color: { rgb: 'FFFFFF' } },
    alignment: { horizontal: 'center', vertical: 'center' }
  }
  
  // Apply header styling
  for (let i = 0; i < 8; i++) {
    const cellRef = XLSX.utils.encode_col(i) + '1'
    if (ws[cellRef]) {
      ws[cellRef].s = headerStyle
    }
  }
  
  // Create workbook
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Survey Responses')
  
  // Generate filename with timestamp
  const filename = `NYSC_Survey_${new Date().toISOString().slice(0, 10)}_${Date.now()}.xlsx`
  
  // Trigger download
  XLSX.writeFile(wb, filename)
}

/**
 * Export batch of survey data to Excel
 */
export const exportBatchToExcel = (surveyDataArray, filename = 'NYSC_Survey_Batch.xlsx') => {
  const processedData = surveyDataArray.map(data => {
    const timestamp = new Date(data.timestamp || Date.now()).toLocaleString('en-NG', {
      timeZone: 'Africa/Lagos',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
    
    return {
      'Timestamp': timestamp,
      'Full Name': data.fullName || '',
      'Phone Number': data.phoneNumber || '',
      'NYSC Stage': data.nyscStage || '',
      'Monthly Income (NGN)': data.monthlyIncome || '',
      'Desired Location': data.desiredLocation || '',
      'Savings Commitment': data.savingsCommitment || '',
      'Eligibility Status': calculateEligibilityStatus(data)
    }
  })
  
  const ws = XLSX.utils.json_to_sheet(processedData, {
    header: ['Timestamp', 'Full Name', 'Phone Number', 'NYSC Stage', 'Monthly Income (NGN)', 'Desired Location', 'Savings Commitment', 'Eligibility Status']
  })
  
  const columnWidths = [
    { wch: 20 },
    { wch: 20 },
    { wch: 15 },
    { wch: 18 },
    { wch: 18 },
    { wch: 20 },
    { wch: 18 },
    { wch: 18 }
  ]
  ws['!cols'] = columnWidths
  
  const headerStyle = {
    fill: { fgColor: { rgb: '0D7A7A' } },
    font: { bold: true, color: { rgb: 'FFFFFF' } },
    alignment: { horizontal: 'center', vertical: 'center' }
  }
  
  for (let i = 0; i < 8; i++) {
    const cellRef = XLSX.utils.encode_col(i) + '1'
    if (ws[cellRef]) {
      ws[cellRef].s = headerStyle
    }
  }
  
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Survey Responses')
  XLSX.writeFile(wb, filename)
}
