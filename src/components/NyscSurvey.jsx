import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './NyscSurvey.css'

// ─── Section & Question Definitions ─────────────────────────────────────────

const sections = [
  {
    id: 'profile',
    title: 'Profile',
    icon: '👤',
    questions: [
      {
        id: 'age',
        number: 1,
        text: 'What is your age?',
        type: 'radio',
        field: 'age',
        options: ['18–21', '22–25', '26–30', 'Above 30'],
      },
      {
        id: 'gender',
        number: 2,
        text: 'What is your gender?',
        type: 'radio',
        field: 'gender',
        options: ['Male', 'Female', 'Prefer not to say'],
      },
      {
        id: 'currentStatus',
        number: 3,
        text: 'What is your current status?',
        type: 'radio',
        field: 'currentStatus',
        options: [
          'NYSC Corps Member',
          'Recent Graduate',
          'Undergraduate',
          'Employed',
          'Self-Employed',
        ],
      },
      {
        id: 'ownershipStatement',
        number: 22,
        text: 'Which statement best describes you?',
        type: 'radio',
        field: 'ownershipStatement',
        options: [
          'I want to own a home immediately.',
          'I am willing to save first.',
          'I want to invest while preparing for home ownership.',
          'I need guidance before I can decide.',
        ],
      },
      {
        id: 'state',
        number: 4,
        text: 'Which state are you currently serving or residing in?',
        type: 'text',
        field: 'state',
        placeholder: 'e.g. Lagos, Abuja, Rivers…',
      },
      {
        id: 'fieldOfStudy',
        number: 5,
        text: 'What is your field of study?',
        type: 'text',
        field: 'fieldOfStudy',
        placeholder: 'e.g. Computer Science, Law, Medicine…',
      },
    ],
  },
  {
    id: 'housing',
    title: 'Housing Aspiration',
    icon: '🏠',
    questions: [
      {
        id: 'believeHomeBefore35',
        number: 6,
        text: 'Do you currently believe you can own a home before age 35?',
        type: 'radio',
        field: 'believeHomeBefore35',
        options: ['Yes', 'No', 'Not sure'],
      },
      {
        id: 'idealHomeAge',
        number: 7,
        text: 'At what age would you ideally like to own your first home?',
        type: 'radio',
        field: 'idealHomeAge',
        options: ['Before 25', '25–30', '31–35', 'Above 35'],
      },
      {
        id: 'homeType',
        number: 8,
        text: 'What type of home would you like to own first?',
        type: 'radio',
        field: 'homeType',
        options: [
          'Studio Apartment',
          '1-Bedroom Apartment',
          '2-Bedroom Apartment',
          'Terrace House',
          'Detached House',
        ],
      },
      {
        id: 'biggestObstacle',
        number: 9,
        text: 'What is your biggest obstacle to owning a home?',
        type: 'radio',
        field: 'biggestObstacle',
        options: [
          'Lack of savings',
          'Low income',
          'High property prices',
          'Lack of mortgage access',
          'Lack of information',
          'Job uncertainty',
        ],
      },
      {
        id: 'preferredCity',
        number: 10,
        text: 'Which city would you most likely buy your first home in?',
        type: 'radio-other',
        field: 'preferredCity',
        otherField: 'preferredCityOther',
        options: ['Lagos', 'Abuja', 'Port Harcourt', 'Uyo', 'Ibadan'],
        otherLabel: 'Other',
      },
    ],
  },
  {
    id: 'savings',
    title: 'Savings & Financial Readiness',
    icon: '💰',
    questions: [
      {
        id: 'savesMonthly',
        number: 11,
        text: 'Do you currently save money monthly?',
        type: 'yesno',
        field: 'savesMonthly',
      },
      {
        id: 'monthlySavingsAmount',
        number: 12,
        text: 'How much can you comfortably save monthly toward home ownership?',
        type: 'radio',
        field: 'monthlySavingsAmount',
        options: [
          'Below ₦10,000',
          '₦10,000 – ₦25,000',
          '₦25,001 – ₦50,000',
          '₦50,001 – ₦100,000',
          'Above ₦100,000',
        ],
      },
      {
        id: 'willJoinSavingsPlan',
        number: 13,
        text: 'Would you be willing to join a structured Home Savings Plan if it helps you own a home sooner?',
        type: 'radio',
        field: 'willJoinSavingsPlan',
        options: ['Yes', 'No', 'Maybe'],
      },
      {
        id: 'equityContribution',
        number: 14,
        text: 'If a home ownership programme required an initial equity contribution, what amount would be realistic for you?',
        type: 'radio',
        field: 'equityContribution',
        options: [
          'Below ₦100,000',
          '₦100,000 – ₦250,000',
          '₦250,001 – ₦500,000',
          '₦500,001 – ₦1 million',
          'Above ₦1 million',
        ],
      },
    ],
  },
  {
    id: 'product',
    title: 'Product Design',
    icon: '📦',
    questions: [
      {
        id: 'preferredProduct',
        number: 15,
        text: 'Which of these options appeals most to you?',
        type: 'radio',
        field: 'preferredProduct',
        options: [
          'Save First, Buy Later',
          'Rent-to-Own',
          'Mortgage Financing',
          'Cooperative Housing',
          'Shared Ownership',
        ],
      },
      {
        id: 'wouldJoinSmallAmount',
        number: 16,
        text: 'If you could start your home ownership journey with as little as ₦5,000 – ₦10,000 monthly, would you join?',
        type: 'radio',
        field: 'wouldJoinSmallAmount',
        options: ['Yes', 'No', 'Maybe'],
      },
      {
        id: 'wantsInvestmentReturns',
        number: 17,
        text: 'Would you like to earn investment returns while saving toward your home?',
        type: 'yesno',
        field: 'wantsInvestmentReturns',
      },
      {
        id: 'desiredBenefits',
        number: 18,
        text: 'What additional benefits would encourage you to join?',
        subtitle: 'Select all that apply',
        type: 'multiselect',
        field: 'desiredBenefits',
        options: [
          'Financial Literacy Training',
          'Career Support',
          'Investment Education',
          'Entrepreneurship Support',
          'Home Ownership Coaching',
          'Access to Mortgages',
        ],
      },
    ],
  },
  {
    id: 'interest',
    title: 'Programme Interest',
    icon: '🚀',
    questions: [
      {
        id: 'wantsEarlyAccess',
        number: 19,
        text: 'Would you like to be among the first participants in the Start Small, Own Sooner Programme?',
        type: 'yesno',
        field: 'wantsEarlyAccess',
      },
      {
        id: 'wantsFreeAssessment',
        number: 20,
        text: 'Would you like a free Home Ownership Readiness Assessment?',
        type: 'yesno',
        field: 'wantsFreeAssessment',
      },
      {
        id: 'contact',
        number: 21,
        text: 'Please provide your contact details',
        type: 'contact',
        fields: ['fullName', 'phoneNumber', 'emailAddress'],
      },
    ],
  },
]

const totalQuestions = sections.reduce((sum, s) => sum + s.questions.length, 0)

// ─── Initial Form State ─────────────────────────────────────────────────────

const initialFormData = {
  // Section 1: Profile
  age: '',
  gender: '',
  currentStatus: '',
  ownershipStatement: '',
  state: '',
  fieldOfStudy: '',
  // Section 2: Housing Aspiration
  believeHomeBefore35: '',
  idealHomeAge: '',
  homeType: '',
  biggestObstacle: '',
  preferredCity: '',
  preferredCityOther: '',
  // Section 3: Savings & Financial Readiness
  savesMonthly: '',
  monthlySavingsAmount: '',
  willJoinSavingsPlan: '',
  equityContribution: '',
  // Section 4: Product Design
  preferredProduct: '',
  wouldJoinSmallAmount: '',
  wantsInvestmentReturns: '',
  desiredBenefits: [],
  // Section 5: Programme Interest
  wantsEarlyAccess: '',
  wantsFreeAssessment: '',
  fullName: '',
  phoneNumber: '',
  emailAddress: '',
}

// ─── Eligibility / Lead Scoring ─────────────────────────────────────────────

const calculateEligibilityStatus = (data) => {
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

// ─── Component ──────────────────────────────────────────────────────────────

const NyscSurvey = ({ onSubmit }) => {
  const [sectionIdx, setSectionIdx] = useState(0)
  const [questionIdx, setQuestionIdx] = useState(0)
  const [formData, setFormData] = useState(initialFormData)
  const [submitted, setSubmitted] = useState(false)
  const [eligibilityStatus, setEligibilityStatus] = useState('')
  const [direction, setDirection] = useState(1) // 1 = forward, -1 = back
  const containerRef = useRef(null)

  const currentSection = sections[sectionIdx]
  const currentQuestion = currentSection.questions[questionIdx]

  // Scroll to top on question change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [sectionIdx, questionIdx])

  // Count completed questions (for progress)
  const completedCount = (() => {
    let count = 0
    for (let si = 0; si < sections.length; si++) {
      for (let qi = 0; qi < sections[si].questions.length; qi++) {
        if (si < sectionIdx || (si === sectionIdx && qi < questionIdx)) {
          count++
        }
      }
    }
    return count
  })()

  // ── Handlers ──

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleMultiSelectToggle = (field, value) => {
    setFormData((prev) => {
      const current = prev[field] || []
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      return { ...prev, [field]: updated }
    })
  }

  const isCurrentValid = () => {
    const q = currentQuestion
    if (q.type === 'contact') {
      return (
        formData.fullName.trim() &&
        formData.phoneNumber.trim() &&
        formData.emailAddress.trim()
      )
    }
    if (q.type === 'multiselect') {
      return (formData[q.field] || []).length > 0
    }
    if (q.type === 'radio-other') {
      const val = formData[q.field]
      if (val === '__other__') return (formData[q.otherField] || '').trim().length > 0
      return !!val
    }
    if (q.type === 'text') return (formData[q.field] || '').trim().length > 0
    return !!formData[q.field]
  }

  const goNext = (skip = false) => {
    // If not skipping, enforce validation
    // Wait, since event might be passed, ensure skip is boolean
    const isSkipping = skip === true;
    if (!isSkipping && !isCurrentValid()) return
    setDirection(1)

    // If there's a next question in the section
    if (questionIdx < currentSection.questions.length - 1) {
      setQuestionIdx((p) => p + 1)
    } else if (sectionIdx < sections.length - 1) {
      // Move to next section
      setSectionIdx((p) => p + 1)
      setQuestionIdx(0)
    } else {
      // Submit
      handleSubmit()
    }
  }

  const handleSkip = () => {
    goNext(true)
  }

  const goPrev = () => {
    setDirection(-1)
    if (questionIdx > 0) {
      setQuestionIdx((p) => p - 1)
    } else if (sectionIdx > 0) {
      const prevSection = sections[sectionIdx - 1]
      setSectionIdx((p) => p - 1)
      setQuestionIdx(prevSection.questions.length - 1)
    }
  }

  const handleSubmit = () => {
    const status = calculateEligibilityStatus(formData)
    setEligibilityStatus(status)
    setSubmitted(true)

    // Build the final payload, resolving 'Other' city
    const finalData = {
      ...formData,
      preferredCity:
        formData.preferredCity === '__other__'
          ? formData.preferredCityOther
          : formData.preferredCity,
      desiredBenefits: (formData.desiredBenefits || []).join(', '),
      eligibilityStatus: status,
    }

    if (onSubmit) onSubmit(finalData)
  }

  const handleReset = () => {
    setSectionIdx(0)
    setQuestionIdx(0)
    setFormData(initialFormData)
    setSubmitted(false)
    setEligibilityStatus('')
  }

  const isFirst = sectionIdx === 0 && questionIdx === 0
  const isLast =
    sectionIdx === sections.length - 1 &&
    questionIdx === currentSection.questions.length - 1

  // ── Animation variants ──

  const variants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 80 : -80, scale: 0.96 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -80 : 80, scale: 0.96 }),
  }

  // ── Render helpers ──

  const renderRadioOptions = (q) => (
    <div className="survey-options-grid">
      {q.options.map((option, idx) => (
        <motion.label
          key={option}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.06 }}
          whileHover={{ scale: 1.02, x: 6 }}
          className={`survey-option ${formData[q.field] === option ? 'selected' : ''}`}
        >
          <span className="survey-option-radio">
            {formData[q.field] === option && (
              <motion.span
                className="survey-option-dot"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400 }}
              />
            )}
          </span>
          <span className="survey-option-text">{option}</span>
          <input
            type="radio"
            name={q.field}
            value={option}
            checked={formData[q.field] === option}
            onChange={() => handleInputChange(q.field, option)}
            className="sr-only"
          />
        </motion.label>
      ))}
    </div>
  )

  const renderRadioOther = (q) => (
    <div className="survey-options-grid">
      {q.options.map((option, idx) => (
        <motion.label
          key={option}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.06 }}
          whileHover={{ scale: 1.02, x: 6 }}
          className={`survey-option ${formData[q.field] === option ? 'selected' : ''}`}
        >
          <span className="survey-option-radio">
            {formData[q.field] === option && (
              <motion.span className="survey-option-dot" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400 }} />
            )}
          </span>
          <span className="survey-option-text">{option}</span>
          <input
            type="radio"
            name={q.field}
            value={option}
            checked={formData[q.field] === option}
            onChange={() => handleInputChange(q.field, option)}
            className="sr-only"
          />
        </motion.label>
      ))}
      {/* "Other" option */}
      <motion.label
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: q.options.length * 0.06 }}
        whileHover={{ scale: 1.02, x: 6 }}
        className={`survey-option other-option ${formData[q.field] === '__other__' ? 'selected' : ''}`}
      >
        <span className="survey-option-radio">
          {formData[q.field] === '__other__' && (
            <motion.span className="survey-option-dot" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400 }} />
          )}
        </span>
        <span className="survey-option-text">{q.otherLabel}</span>
        <input
          type="radio"
          name={q.field}
          value="__other__"
          checked={formData[q.field] === '__other__'}
          onChange={() => handleInputChange(q.field, '__other__')}
          className="sr-only"
        />
      </motion.label>
      {formData[q.field] === '__other__' && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="other-input-wrap">
          <input
            type="text"
            value={formData[q.otherField] || ''}
            onChange={(e) => handleInputChange(q.otherField, e.target.value)}
            placeholder="Please specify…"
            className="survey-input"
            autoFocus
          />
        </motion.div>
      )}
    </div>
  )

  const renderYesNo = (q) => (
    <div className="survey-yesno-grid">
      {['Yes', 'No'].map((val, idx) => (
        <motion.button
          key={val}
          onClick={() => handleInputChange(q.field, val)}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.06, y: -4 }}
          whileTap={{ scale: 0.95 }}
          transition={{ delay: idx * 0.1 }}
          className={`survey-yesno-btn ${formData[q.field] === val ? (val === 'Yes' ? 'yes-active' : 'no-active') : ''}`}
        >
          <span className="yesno-icon">{val === 'Yes' ? '✓' : '✗'}</span>
          {val}
        </motion.button>
      ))}
    </div>
  )

  const renderMultiSelect = (q) => (
    <div className="survey-options-grid">
      {q.options.map((option, idx) => {
        const checked = (formData[q.field] || []).includes(option)
        return (
          <motion.label
            key={option}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06 }}
            whileHover={{ scale: 1.02, x: 6 }}
            className={`survey-option checkbox-option ${checked ? 'selected' : ''}`}
            onClick={() => handleMultiSelectToggle(q.field, option)}
          >
            <span className="survey-option-checkbox">
              {checked && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                  className="checkbox-tick"
                >
                  ✓
                </motion.span>
              )}
            </span>
            <span className="survey-option-text">{option}</span>
          </motion.label>
        )
      })}
    </div>
  )

  const renderTextInput = (q) => (
    <div className="survey-text-wrap">
      <motion.input
        type="text"
        value={formData[q.field] || ''}
        onChange={(e) => handleInputChange(q.field, e.target.value)}
        placeholder={q.placeholder || 'Type your answer…'}
        whileFocus={{ scale: 1.01 }}
        className="survey-input"
        autoFocus
      />
    </div>
  )

  const renderContact = () => (
    <div className="survey-contact-fields">
      <div className="contact-field">
        <label className="contact-label">Full Name *</label>
        <motion.input
          type="text"
          value={formData.fullName}
          onChange={(e) => handleInputChange('fullName', e.target.value)}
          placeholder="Enter your full name"
          whileFocus={{ scale: 1.01 }}
          className="survey-input"
        />
      </div>
      <div className="contact-field">
        <label className="contact-label">Phone Number *</label>
        <motion.input
          type="tel"
          value={formData.phoneNumber}
          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
          placeholder="+234 (0) 812 345 6789"
          whileFocus={{ scale: 1.01 }}
          className="survey-input"
        />
      </div>
      <div className="contact-field">
        <label className="contact-label">Email Address *</label>
        <motion.input
          type="email"
          value={formData.emailAddress}
          onChange={(e) => handleInputChange('emailAddress', e.target.value)}
          placeholder="you@example.com"
          whileFocus={{ scale: 1.01 }}
          className="survey-input"
        />
      </div>
    </div>
  )

  const renderQuestion = (q) => {
    switch (q.type) {
      case 'radio':
        return renderRadioOptions(q)
      case 'radio-other':
        return renderRadioOther(q)
      case 'yesno':
        return renderYesNo(q)
      case 'multiselect':
        return renderMultiSelect(q)
      case 'text':
        return renderTextInput(q)
      case 'contact':
        return renderContact()
      default:
        return null
    }
  }

  // ── Success Screen ──

  const renderSuccess = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="success-screen"
    >
      <motion.div
        className="success-icon-wrap"
        animate={{ scale: [0, 1.3, 1] }}
        transition={{ duration: 0.8, type: 'spring' }}
      >
        <span className="success-check">✓</span>
      </motion.div>

      <h2 className="success-title">Thank You, {formData.fullName.split(' ')[0]}!</h2>
      <p className="success-subtitle">Your survey has been submitted successfully.</p>

      <div className="eligibility-card">
        <p className="eligibility-label">Home Ownership Readiness</p>
        <p className="eligibility-value">{eligibilityStatus}</p>
      </div>

      <div className="next-step-card">
        <p className="next-step-title">🏡 What Happens Next?</p>
        <p className="next-step-text">
          Our team will review your responses and reach out to you with a{' '}
          <strong>personalized Home Ownership Readiness Assessment</strong> and
          next steps for the <em>Start Small, Own Sooner</em> programme.
        </p>
      </div>

      <motion.button
        onClick={handleReset}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="restart-btn"
      >
        Submit Another Response
      </motion.button>
    </motion.div>
  )

  // ── Main Render ──

  return (
    <div className="survey-page" ref={containerRef}>
      {/* Animated background */}
      <div className="survey-bg">
        <motion.div
          className="bg-blob blob-1"
          animate={{ x: [0, 80, 0], y: [0, -40, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="bg-blob blob-2"
          animate={{ x: [0, -60, 0], y: [0, 70, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <div className="bg-grid" />
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`p-${i}`}
            className="bg-particle"
            animate={{
              y: [0, -180, 0],
              x: [0, Math.sin(i * 1.2) * 80, 0],
              opacity: [0.15, 0.4, 0.15],
            }}
            transition={{ duration: 5 + i, repeat: Infinity, delay: i * 0.4 }}
            style={{ left: `${8 + i * 15}%`, top: `${22 + i * 11}%` }}
          />
        ))}
      </div>

      <div className="survey-container">
        {/* Header */}
        <motion.div
          className="survey-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            animate={{ rotateY: [0, 5, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="brand"
          >
            <div className="brand-name">AXP</div>
            <div className="brand-sub">SOLUTIONS PRO</div>
          </motion.div>
          <p className="brand-tagline">Start Small. Own Sooner.</p>
        </motion.div>

        {/* Card */}
        <motion.div
          className="survey-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          {!submitted ? (
            <>
              {/* Section tabs */}
              <div className="section-tabs">
                {sections.map((sec, idx) => {
                  const isActive = idx === sectionIdx
                  const isCompleted = idx < sectionIdx
                  return (
                    <div
                      key={sec.id}
                      className={`section-tab ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                    >
                      <span className="tab-icon">
                        {isCompleted ? '✓' : sec.icon}
                      </span>
                      <span className="tab-label">{sec.title}</span>
                    </div>
                  )
                })}
              </div>

              {/* Progress bar */}
              <div className="progress-wrap">
                <div className="progress-bar">
                  <motion.div
                    className="progress-fill"
                    animate={{
                      width: `${((completedCount + 1) / totalQuestions) * 100}%`,
                    }}
                    transition={{ duration: 0.5, type: 'spring' }}
                  />
                </div>
                <p className="progress-text">
                  Question {completedCount + 1} of {totalQuestions}
                </p>
              </div>

              {/* Section header */}
              <div className="section-header">
                <span className="section-badge">{currentSection.icon} Section {sectionIdx + 1}</span>
                <h3 className="section-title">{currentSection.title}</h3>
              </div>

              {/* Question */}
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={`${sectionIdx}-${questionIdx}`}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="question-area"
                >
                  <h2 className="question-text">
                    <span className="question-number">Q{currentQuestion.number}.</span>{' '}
                    {currentQuestion.text}
                  </h2>
                  {currentQuestion.subtitle && (
                    <p className="question-subtitle">{currentQuestion.subtitle}</p>
                  )}
                  {renderQuestion(currentQuestion)}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="survey-nav">
                <motion.button
                  onClick={goPrev}
                  disabled={isFirst}
                  whileHover={!isFirst ? { scale: 1.04, y: -2 } : {}}
                  whileTap={!isFirst ? { scale: 0.96 } : {}}
                  className={`nav-btn nav-prev ${isFirst ? 'disabled' : ''}`}
                >
                  ← Previous
                </motion.button>
                <motion.button
                  onClick={handleSkip}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  className="nav-btn nav-skip"
                >
                  Skip
                </motion.button>
                <motion.button
                  onClick={() => goNext(false)}
                  disabled={!isCurrentValid()}
                  whileHover={isCurrentValid() ? { scale: 1.04, y: -2 } : {}}
                  whileTap={isCurrentValid() ? { scale: 0.96 } : {}}
                  className={`nav-btn nav-next ${!isCurrentValid() ? 'disabled' : ''}`}
                >
                  {isLast ? 'Submit Survey' : 'Next →'}
                </motion.button>
              </div>
            </>
          ) : (
            renderSuccess()
          )}
        </motion.div>

        {/* Footer */}
        <motion.p
          className="survey-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          © {new Date().getFullYear()} AXP Solutions Pro · Youth &amp; NYSC Home Ownership Programme
        </motion.p>
      </div>
    </div>
  )
}

export { calculateEligibilityStatus }
export default NyscSurvey
