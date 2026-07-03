import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * Save comprehensive survey response to Supabase.
 *
 * NOTE: Your Supabase `survey_responses` table needs to include all the new
 * columns below. Run the SQL migration in SETUP_SUPABASE.md to add them.
 */
export const saveSurveyToDatabase = async (surveyData) => {
  try {
    const { data, error } = await supabase
      .from('survey_responses')
      .insert([
        {
          // Section 1: Profile
          age: surveyData.age,
          gender: surveyData.gender,
          current_status: surveyData.currentStatus,
          state: surveyData.state,
          field_of_study: surveyData.fieldOfStudy,
          // Section 2: Housing Aspiration
          believe_home_before_35: surveyData.believeHomeBefore35,
          ideal_home_age: surveyData.idealHomeAge,
          home_type: surveyData.homeType,
          biggest_obstacle: surveyData.biggestObstacle,
          preferred_city: surveyData.preferredCity,
          // Section 3: Savings & Financial Readiness
          saves_monthly: surveyData.savesMonthly,
          monthly_savings_amount: surveyData.monthlySavingsAmount,
          will_join_savings_plan: surveyData.willJoinSavingsPlan,
          equity_contribution: surveyData.equityContribution,
          // Section 4: Product Design
          preferred_product: surveyData.preferredProduct,
          would_join_small_amount: surveyData.wouldJoinSmallAmount,
          wants_investment_returns: surveyData.wantsInvestmentReturns,
          desired_benefits: surveyData.desiredBenefits,
          // Section 5: Programme Interest
          wants_early_access: surveyData.wantsEarlyAccess,
          wants_free_assessment: surveyData.wantsFreeAssessment,
          ownership_statement: surveyData.ownershipStatement,
          full_name: surveyData.fullName,
          phone_number: surveyData.phoneNumber,
          email_address: surveyData.emailAddress,
          // Calculated
          eligibility_status: surveyData.eligibilityStatus,
        },
      ])

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error('Failed to save survey:', error.message)
    throw error
  }
}

/**
 * Fetch all survey responses from Supabase
 */
const mapSurveyRow = (row) => ({
  ...row,
  currentStatus: row.current_status,
  fieldOfStudy: row.field_of_study,
  believeHomeBefore35: row.believe_home_before_35,
  idealHomeAge: row.ideal_home_age,
  homeType: row.home_type,
  biggestObstacle: row.biggest_obstacle,
  preferredCity: row.preferred_city,
  preferredCityOther: row.preferred_city_other,
  savesMonthly: row.saves_monthly,
  monthlySavingsAmount: row.monthly_savings_amount,
  willJoinSavingsPlan: row.will_join_savings_plan,
  equityContribution: row.equity_contribution,
  preferredProduct: row.preferred_product,
  wouldJoinSmallAmount: row.would_join_small_amount,
  wantsInvestmentReturns: row.wants_investment_returns,
  desiredBenefits: Array.isArray(row.desired_benefits)
    ? row.desired_benefits
    : typeof row.desired_benefits === 'string'
    ? row.desired_benefits.split(',').map((v) => v.trim()).filter(Boolean)
    : [],
  wantsEarlyAccess: row.wants_early_access,
  wantsFreeAssessment: row.wants_free_assessment,
  fullName: row.full_name,
  phoneNumber: row.phone_number,
  emailAddress: row.email_address,
  ownershipStatement: row.ownership_statement,
  eligibilityStatus: row.eligibility_status,
  timestamp: row.created_at,
})

export const fetchAllSurveys = async () => {
  try {
    const { data, error } = await supabase
      .from('survey_responses')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    return (data || []).map(mapSurveyRow)
  } catch (error) {
    console.error('Failed to fetch surveys:', error.message)
    return []
  }
}
