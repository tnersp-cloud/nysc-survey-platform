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

    return data || []
  } catch (error) {
    console.error('Failed to fetch surveys:', error.message)
    return []
  }
}
