import * as XLSX from 'xlsx'

/**
 * Column headers for the comprehensive NYSC survey export.
 * Matches the 5-section survey structure.
 */
const HEADERS = [
  'Timestamp',
  // Section 1: Profile
  'Age Range',
  'Gender',
  'Current Status',
  'State',
  'Field of Study',
  // Section 2: Housing Aspiration
  'Believes Home Before 35',
  'Ideal Home Age',
  'Home Type Preference',
  'Biggest Obstacle',
  'Preferred City',
  // Section 3: Savings & Financial Readiness
  'Saves Monthly',
  'Monthly Savings Amount',
  'Willing to Join Savings Plan',
  'Equity Contribution Range',
  // Section 4: Product Design
  'Preferred Product',
  'Would Join at ₦5k–₦10k/mo',
  'Wants Investment Returns',
  'Desired Benefits',
  // Section 5: Programme Interest
  'Wants Early Access',
  'Wants Free Assessment',
  'Full Name',
  'Phone Number',
  'Email Address',
  // Calculated
  'Eligibility Status',
]

/**
 * Calculate eligibility / lead-priority status based on comprehensive survey data.
 */
export const calculateEligibilityStatus = (data) => {
  let score = 0

  // Savings behaviour
  if (data.savesMonthly === 'Yes') score += 2
  if (['₦50,001 – ₦100,000', 'Above ₦100,000'].includes(data.monthlySavingsAmount)) score += 3
  else if (['₦25,001 – ₦50,000'].includes(data.monthlySavingsAmount)) score += 2
  else if (['₦10,000 – ₦25,000'].includes(data.monthlySavingsAmount)) score += 1

  // Willingness
  if (data.willJoinSavingsPlan === 'Yes') score += 2
  else if (data.willJoinSavingsPlan === 'Maybe') score += 1

  if (data.wouldJoinSmallAmount === 'Yes') score += 2
  else if (data.wouldJoinSmallAmount === 'Maybe') score += 1

  // Programme interest
  if (data.wantsEarlyAccess === 'Yes') score += 2
  if (data.wantsFreeAssessment === 'Yes') score += 1

  // Equity contribution
  if (['₦500,001 – ₦1 million', 'Above ₦1 million'].includes(data.equityContribution)) score += 3
  else if (['₦250,001 – ₦500,000'].includes(data.equityContribution)) score += 2
  else if (['₦100,000 – ₦250,000'].includes(data.equityContribution)) score += 1

  if (score >= 12) return 'High Priority'
  if (score >= 8) return 'Qualified'
  if (score >= 4) return 'Standard Review'
  return 'Follow Up Required'
}

/**
 * Build a flat row object from survey data for Excel export.
 */
const buildRow = (data, timestamp) => ({
  'Timestamp': timestamp,
  'Age Range': data.age || '',
  'Gender': data.gender || '',
  'Current Status': data.currentStatus || '',
  'State': data.state || '',
  'Field of Study': data.fieldOfStudy || '',
  'Believes Home Before 35': data.believeHomeBefore35 || '',
  'Ideal Home Age': data.idealHomeAge || '',
  'Home Type Preference': data.homeType || '',
  'Biggest Obstacle': data.biggestObstacle || '',
  'Preferred City': data.preferredCity || '',
  'Saves Monthly': data.savesMonthly || '',
  'Monthly Savings Amount': data.monthlySavingsAmount || '',
  'Willing to Join Savings Plan': data.willJoinSavingsPlan || '',
  'Equity Contribution Range': data.equityContribution || '',
  'Preferred Product': data.preferredProduct || '',
  'Would Join at ₦5k–₦10k/mo': data.wouldJoinSmallAmount || '',
  'Wants Investment Returns': data.wantsInvestmentReturns || '',
  'Desired Benefits': Array.isArray(data.desiredBenefits)
    ? data.desiredBenefits.join(', ')
    : (data.desiredBenefits || ''),
  'Wants Early Access': data.wantsEarlyAccess || '',
  'Wants Free Assessment': data.wantsFreeAssessment || '',
  'Full Name': data.fullName || '',
  'Phone Number': data.phoneNumber || '',
  'Email Address': data.emailAddress || '',
  'Eligibility Status': data.eligibilityStatus || calculateEligibilityStatus(data),
})

/**
 * Column widths matching HEADERS order.
 */
const COL_WIDTHS = [
  { wch: 20 }, // Timestamp
  { wch: 12 }, // Age Range
  { wch: 16 }, // Gender
  { wch: 20 }, // Current Status
  { wch: 18 }, // State
  { wch: 22 }, // Field of Study
  { wch: 22 }, // Believes Home Before 35
  { wch: 14 }, // Ideal Home Age
  { wch: 22 }, // Home Type Preference
  { wch: 22 }, // Biggest Obstacle
  { wch: 18 }, // Preferred City
  { wch: 14 }, // Saves Monthly
  { wch: 24 }, // Monthly Savings Amount
  { wch: 26 }, // Willing to Join Savings Plan
  { wch: 24 }, // Equity Contribution Range
  { wch: 22 }, // Preferred Product
  { wch: 26 }, // Would Join at ₦5k–₦10k/mo
  { wch: 22 }, // Wants Investment Returns
  { wch: 40 }, // Desired Benefits
  { wch: 18 }, // Wants Early Access
  { wch: 22 }, // Wants Free Assessment
  { wch: 22 }, // Full Name
  { wch: 18 }, // Phone Number
  { wch: 24 }, // Email Address
  { wch: 20 }, // Eligibility Status
]

const HEADER_STYLE = {
  fill: { fgColor: { rgb: '0D7A7A' } },
  font: { bold: true, color: { rgb: 'FFFFFF' }, size: 11 },
  alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
  border: {
    top: { style: 'thin', color: { rgb: '000000' } },
    bottom: { style: 'thin', color: { rgb: '000000' } },
    left: { style: 'thin', color: { rgb: '000000' } },
    right: { style: 'thin', color: { rgb: '000000' } },
  },
}

const applyHeaderStyles = (ws) => {
  for (let i = 0; i < HEADERS.length; i++) {
    const ref = XLSX.utils.encode_col(i) + '1'
    if (ws[ref]) ws[ref].s = HEADER_STYLE
  }
}

const applyRowStyles = (ws, numRows) => {
  const borderStyle = {
    top: { style: 'thin', color: { rgb: 'CCCCCC' } },
    bottom: { style: 'thin', color: { rgb: 'CCCCCC' } },
    left: { style: 'thin', color: { rgb: 'CCCCCC' } },
    right: { style: 'thin', color: { rgb: 'CCCCCC' } },
  }

  for (let row = 2; row <= numRows + 1; row++) {
    const bg = row % 2 === 0 ? 'F5F5F5' : 'FFFFFF'
    for (let col = 0; col < HEADERS.length; col++) {
      const ref = XLSX.utils.encode_col(col) + row
      if (ws[ref]) {
        ws[ref].s = {
          fill: { fgColor: { rgb: bg } },
          border: borderStyle,
          alignment: { horizontal: 'center', vertical: 'center' },
        }
      }
    }
  }
}

const lagosTimestamp = (date) =>
  (date || new Date()).toLocaleString('en-NG', {
    timeZone: 'Africa/Lagos',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

/**
 * Export a single survey response to an Excel file (downloads immediately).
 */
export const exportToExcel = (surveyData) => {
  const row = buildRow(surveyData, lagosTimestamp())
  const ws = XLSX.utils.json_to_sheet([row], { header: HEADERS })
  ws['!cols'] = COL_WIDTHS
  applyHeaderStyles(ws)

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Survey Responses')

  const filename = `NYSC_Survey_${new Date().toISOString().slice(0, 10)}_${Date.now()}.xlsx`
  XLSX.writeFile(wb, filename)
}

/**
 * Export a batch of survey responses to Excel (downloads immediately).
 */
export const exportBatchToExcel = (surveyDataArray, filename = 'NYSC_Survey_Batch.xlsx') => {
  const rows = surveyDataArray.map((d) =>
    buildRow(d, lagosTimestamp(new Date(d.timestamp || Date.now())))
  )

  const ws = XLSX.utils.json_to_sheet(rows, { header: HEADERS })
  ws['!cols'] = COL_WIDTHS
  ws['!freeze'] = { xSplit: 0, ySplit: 1 }
  applyHeaderStyles(ws)
  applyRowStyles(ws, rows.length)

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Survey Responses')
  ws['!autofilter'] = { ref: `A1:${XLSX.utils.encode_col(HEADERS.length - 1)}${rows.length + 1}` }

  XLSX.writeFile(wb, filename)
}

/**
 * Generate an Excel buffer (for email attachments — does not download).
 */
export const generateExcelBuffer = (surveyDataArray) => {
  const rows = surveyDataArray.map((d) =>
    buildRow(d, lagosTimestamp(new Date(d.timestamp || Date.now())))
  )

  const ws = XLSX.utils.json_to_sheet(rows, { header: HEADERS })
  ws['!cols'] = COL_WIDTHS
  ws['!freeze'] = { xSplit: 0, ySplit: 1 }
  applyHeaderStyles(ws)
  applyRowStyles(ws, rows.length)

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Survey Responses')
  ws['!autofilter'] = { ref: `A1:${XLSX.utils.encode_col(HEADERS.length - 1)}${rows.length + 1}` }

  return XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' })
}
