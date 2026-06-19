import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './NyscSurvey.css'

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

const NyscSurvey = ({ onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    nyscStage: '',
    monthlyIncome: '',
    desiredLocation: '',
    savingsCommitment: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [eligibilityStatus, setEligibilityStatus] = useState('')

  const steps = [
    {
      id: 'intro',
      title: 'Start Small. Own Sooner.',
      subtitle: 'Check your 6-Month Mortgage Eligibility',
      fields: ['fullName', 'phoneNumber']
    },
    {
      id: 'timeline',
      title: 'NYSC Service Progress',
      subtitle: 'Where are you currently in your NYSC service year?',
      type: 'radio',
      options: ['Just Started', 'Mid-way', 'Passing Out Soon'],
      field: 'nyscStage'
    },
    {
      id: 'income',
      title: 'Monthly Income',
      subtitle: 'What is your average total monthly income? (Include allowance + side gigs)',
      type: 'number',
      field: 'monthlyIncome'
    },
    {
      id: 'location',
      title: 'Desired Location',
      subtitle: 'Which area are you looking to settle in post-NYSC?',
      type: 'text',
      field: 'desiredLocation'
    },
    {
      id: 'commitment',
      title: 'Savings Commitment',
      subtitle: 'Can you commit a portion of your income to a 6-month equity savings plan?',
      type: 'yesno',
      field: 'savingsCommitment'
    }
  ]

  const handleInputChange = (e, field) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleRadioChange = (value, field) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleYesNo = (value) => {
    setFormData(prev => ({ ...prev, savingsCommitment: value }))
  }

  const isStepValid = () => {
    const step = steps[currentStep]
    if (step.id === 'intro') {
      return formData.fullName.trim() && formData.phoneNumber.trim()
    }
    if (step.type === 'radio') return formData[step.field]
    if (step.type === 'number') return formData[step.field] && parseFloat(formData[step.field]) > 0
    if (step.type === 'text') return formData[step.field].trim()
    if (step.type === 'yesno') return formData[step.field]
    return false
  }

  const handleNext = () => {
    if (isStepValid()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1)
      } else {
        handleSubmit()
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1)
  }

  const handleSubmit = () => {
    const status = calculateEligibilityStatus(formData)
    setEligibilityStatus(status)
    setSubmitted(true)
    if (onSubmit) onSubmit(formData)
  }

  const handleReset = () => {
    setCurrentStep(0)
    setFormData({
      fullName: '',
      phoneNumber: '',
      nyscStage: '',
      monthlyIncome: '',
      desiredLocation: '',
      savingsCommitment: ''
    })
    setSubmitted(false)
    setEligibilityStatus('')
  }

  const renderIntroStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="mb-8">
        <motion.h2 className="text-4xl font-bold text-teal mb-2" animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
          Start Small. Own Sooner.
        </motion.h2>
        <p className="text-xl text-gray-700">Your salary can buy you a home.</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
          <motion.input
            type="text"
            value={formData.fullName}
            onChange={(e) => handleInputChange(e, 'fullName')}
            placeholder="Enter your full name"
            whileFocus={{ scale: 1.02 }}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal transition"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
          <motion.input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange(e, 'phoneNumber')}
            placeholder="+234 (0) 123 456 7890"
            whileFocus={{ scale: 1.02 }}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal transition"
          />
        </div>
      </div>
    </motion.div>
  )

  const renderRadioStep = (step) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2 className="text-3xl font-bold text-teal">{step.title}</h2>
      <div className="space-y-3">
        {step.options.map((option, idx) => (
          <motion.label
            key={option}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.02, x: 10 }}
            className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-teal hover:bg-teal/5 transition relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-teal/0 to-teal/10"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.5 }}
            />
            <input
              type="radio"
              name={step.field}
              value={option}
              checked={formData[step.field] === option}
              onChange={(e) => handleRadioChange(e.target.value, step.field)}
              className="w-5 h-5 text-teal accent-teal"
            />
            <span className="ml-3 text-lg text-gray-700 font-medium relative z-10">{option}</span>
          </motion.label>
        ))}
      </div>
    </motion.div>
  )

  const renderNumberStep = (step) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2 className="text-3xl font-bold text-teal">{step.title}</h2>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">{step.subtitle}</label>
        <motion.input
          type="number"
          value={formData[step.field]}
          onChange={(e) => handleInputChange(e, step.field)}
          placeholder="Enter amount in NGN"
          whileFocus={{ scale: 1.02 }}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal transition text-lg"
        />
        {formData[step.field] && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-sm text-teal font-semibold">
            ₦{parseFloat(formData[step.field]).toLocaleString()}
          </motion.p>
        )}
      </div>
    </motion.div>
  )

  const renderTextStep = (step) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2 className="text-3xl font-bold text-teal">{step.title}</h2>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">{step.subtitle}</label>
        <motion.input
          type="text"
          value={formData[step.field]}
          onChange={(e) => handleInputChange(e, step.field)}
          placeholder="Enter your preferred location"
          whileFocus={{ scale: 1.02 }}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal transition"
        />
      </div>
    </motion.div>
  )

  const renderYesNoStep = (step) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2 className="text-3xl font-bold text-teal">{step.title}</h2>
      <p className="text-gray-600">{step.subtitle}</p>
      <div className="grid grid-cols-2 gap-4">
        <motion.button
          onClick={() => handleYesNo('Yes')}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          transition={{ delay: 0.1 }}
          className={`py-4 px-6 rounded-lg font-semibold text-lg transition relative overflow-hidden ${
            formData[step.field] === 'Yes'
              ? 'bg-gradient-to-br from-teal to-teal-dark text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <motion.span className="absolute inset-0 bg-white/20" initial={{ x: '-100%' }} whileHover={{ x: '100%' }} transition={{ duration: 0.5 }} />
          Yes
        </motion.button>
        <motion.button
          onClick={() => handleYesNo('No')}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          transition={{ delay: 0.2 }}
          className={`py-4 px-6 rounded-lg font-semibold text-lg transition relative overflow-hidden ${
            formData[step.field] === 'No'
              ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <motion.span className="absolute inset-0 bg-white/20" initial={{ x: '-100%' }} whileHover={{ x: '100%' }} transition={{ duration: 0.5 }} />
          No
        </motion.button>
      </div>
    </motion.div>
  )

  const renderSuccessScreen = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="text-center space-y-6"
    >
      <div className="mb-6">
        <motion.div className="text-6xl mb-4 success-icon" animate={{ scale: [0, 1.2, 1] }} transition={{ duration: 0.8, type: 'spring' }}>
          ✓
        </motion.div>
        <h2 className="text-4xl font-bold text-teal mb-2">Thank You!</h2>
        <p className="text-xl text-gray-600 mb-4">Your information has been received.</p>
      </div>
      <div className="bg-gradient-to-r from-teal to-teal-light text-white p-6 rounded-lg mb-6 shadow-lg">
        <p className="text-sm uppercase tracking-widest mb-2 opacity-90">Your Eligibility Status</p>
        <p className="text-3xl font-bold">{eligibilityStatus}</p>
      </div>
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-left mb-6 rounded">
        <p className="text-blue-900 font-semibold">Next Step</p>
        <p className="text-blue-800">Claim your <span className="font-bold">Free First Session</span> with our mortgage advisors to discuss your home ownership journey.</p>
      </div>
      <div className="space-y-3">
        <motion.button
          onClick={handleReset}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-gradient-to-r from-teal to-teal-light text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transition text-lg"
        >
          Start Another Survey
        </motion.button>
      </div>
    </motion.div>
  )

  const currentStepData = steps[currentStep]

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-cream via-white to-cream overflow-hidden py-8 px-4">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-br from-teal to-forest rounded-full opacity-10 blur-3xl" />
        <motion.div animate={{ x: [0, -100, 0], y: [0, 100, 0], scale: [1, 1.1, 1] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }} className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-tl from-teal-light to-teal rounded-full opacity-10 blur-3xl" />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `linear-gradient(to right, #0d7a7a 1px, transparent 1px), linear-gradient(to bottom, #0d7a7a 1px, transparent 1px)`, backgroundSize: '50px 50px', animation: 'slideGrid 20s linear infinite' }} />
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-2 h-2 bg-teal rounded-full opacity-20"
            animate={{ y: [0, -200, 0], x: [0, Math.sin(i) * 100, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.3 }}
            style={{ left: `${10 + i * 15}%`, top: `${20 + i * 12}%` }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="text-center mb-8">
          <motion.div animate={{ rotateY: [0, 5, 0], rotateX: [0, -2, 0] }} transition={{ duration: 4, repeat: Infinity }} style={{ transformStyle: 'preserve-3d' }} className="perspective">
            <div className="text-4xl font-bold text-teal mb-2 drop-shadow-lg">AXP</div>
            <div className="text-sm text-gray-600 tracking-widest drop-shadow">SOLUTIONS PRO</div>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="backdrop-blur-md bg-white/95 rounded-2xl shadow-2xl p-8 md:p-12 border border-white/20 relative overflow-hidden" style={{ perspective: '1200px' }}>
          {!submitted ? (
            <>
              <div className="mb-8 relative z-10">
                <div className="flex justify-between items-center mb-4">
                  {steps.map((step, idx) => (
                    <motion.div key={step.id} initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.1 }} transition={{ delay: idx * 0.1 }} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer transition ${idx <= currentStep ? 'bg-gradient-to-br from-teal to-teal-dark text-white shadow-lg' : 'bg-gray-200 text-gray-600'}`}>
                      {idx + 1}
                    </motion.div>
                  ))}
                </div>
                <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden shadow-inner">
                  <motion.div className="h-full bg-gradient-to-r from-teal to-teal-light" animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} transition={{ duration: 0.6, type: 'spring' }} />
                </div>
                <p className="text-xs text-gray-500 mt-2">Step {currentStep + 1} of {steps.length}</p>
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={currentStep} initial={{ opacity: 0, x: 50, rotateY: 90 }} animate={{ opacity: 1, x: 0, rotateY: 0 }} exit={{ opacity: 0, x: -50, rotateY: -90 }} transition={{ duration: 0.5 }} style={{ perspective: '1000px' }} className="relative z-10">
                  {currentStepData.id === 'intro' && renderIntroStep()}
                  {currentStepData.type === 'radio' && renderRadioStep(currentStepData)}
                  {currentStepData.type === 'number' && renderNumberStep(currentStepData)}
                  {currentStepData.type === 'text' && renderTextStep(currentStepData)}
                  {currentStepData.type === 'yesno' && renderYesNoStep(currentStepData)}
                </motion.div>
              </AnimatePresence>

              <div className="flex gap-4 mt-8 relative z-10">
                <motion.button onClick={handlePrevious} disabled={currentStep === 0} whileHover={currentStep !== 0 ? { scale: 1.05, y: -2 } : {}} whileTap={currentStep !== 0 ? { scale: 0.95 } : {}} className={`flex-1 py-3 px-6 rounded-lg font-semibold transition relative overflow-hidden ${currentStep === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:shadow-lg'}`}>
                  ← Previous
                </motion.button>
                <motion.button onClick={handleNext} disabled={!isStepValid()} whileHover={isStepValid() ? { scale: 1.05, y: -2 } : {}} whileTap={isStepValid() ? { scale: 0.95 } : {}} className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition relative overflow-hidden ${isStepValid() ? 'bg-gradient-to-r from-teal to-teal-light hover:shadow-lg' : 'bg-gray-300 cursor-not-allowed'}`}>
                  {currentStep === steps.length - 1 ? 'Submit' : 'Next →'}
                </motion.button>
              </div>
            </>
          ) : (
            <div className="relative z-10">{renderSuccessScreen()}</div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center mt-8 text-gray-600 text-sm">
          <motion.p animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
            © 2024 AXP Solutions Pro | NYSC Lead Generation Platform
          </motion.p>
        </motion.div>
      </div>

      <style>{`
        @keyframes slideGrid {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        .perspective { perspective: 1000px; }
      `}</style>
    </div>
  )
}

export default NyscSurvey
