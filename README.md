# NYSC Survey Platform - AXP Solutions Pro

A professional, enterprise-grade lead-generation survey platform for NYSC Corpers targeting real estate/mortgage opportunities. Built with React, Tailwind CSS, and SheetJS for automated Excel data compilation.

## Features

✅ **Multi-Step Survey** - Professional, animated form with 5 key questions
✅ **Real-time Validation** - Instant feedback on required fields
✅ **Eligibility Scoring** - Automatic lead qualification based on income & commitment
✅ **Excel Export** - Direct download of survey data in structured `.xlsx` format
✅ **Responsive Design** - Mobile-first, enterprise-grade UI
✅ **Smooth Animations** - Framer Motion for elegant transitions
✅ **Timezone Aware** - Timestamps recorded in Africa/Lagos timezone

## Tech Stack

- **Frontend**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Data Export**: SheetJS (XLSX)
- **Animations**: Framer Motion
- **Bundler**: Vite

## Project Structure

```
NYSC QUESTIONAIRE/
├── src/
│   ├── components/
│   │   ├── NyscSurvey.jsx       # Main survey component
│   │   └── NyscSurvey.css       # Component styles
│   ├── utils/
│   │   └── excelExport.js       # Excel export utilities
│   ├── App.jsx                   # Root component
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles
├── index.html                    # HTML template
├── vite.config.js                # Vite configuration
├── tailwind.config.js            # Tailwind configuration
├── postcss.config.js             # PostCSS configuration
├── package.json                  # Dependencies
└── README.md                     # This file
```

## Installation & Setup

### Prerequisites
- Node.js 16+ and npm 7+

### Step 1: Install Dependencies

```bash
npm install
```

This installs all required packages including:
- `react` & `react-dom`
- `xlsx` (SheetJS for Excel export)
- `framer-motion` (animations)
- `tailwindcss` (styling)
- `vite` (build tool)

### Step 2: Start Development Server

```bash
npm run dev
```

The application will start at `http://localhost:5173` (or your configured port).

### Step 3: Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory, ready for deployment.

## Survey Flow

### Step 1: Introduction
- **Question**: "Start Small. Own Sooner. Check your 6-Month Mortgage Eligibility"
- **Fields**: Full Name, Phone Number

### Step 2: NYSC Timeline
- **Question**: "Where are you currently in your NYSC service year?"
- **Options**: Just Started, Mid-way, Passing Out Soon

### Step 3: Monthly Income
- **Question**: "What is your average total monthly income? (Include allowance + side gigs)"
- **Input**: Number (NGN currency)

### Step 4: Desired Location
- **Question**: "Which area are you looking to settle in post-NYSC?"
- **Input**: Text

### Step 5: Savings Commitment
- **Question**: "Can you commit a portion of your income to a 6-month equity savings plan?"
- **Options**: Yes / No

## Eligibility Scoring Logic

The system calculates lead priority based on:

| Condition | Status |
|-----------|--------|
| Income ≥ ₦150,000 + Commitment: Yes | **High Priority** |
| Income ≥ ₦100,000 + Commitment: Yes | **Qualified** |
| Commitment: Yes | **Standard Review** |
| Commitment: No | **Follow Up Required** |

## Excel Export Structure

Downloaded `.xlsx` file includes:

| Column | Description |
|--------|-------------|
| A | Timestamp (Africa/Lagos timezone) |
| B | Full Name |
| C | Phone Number |
| D | NYSC Stage |
| E | Monthly Income (NGN) |
| F | Desired Location |
| G | Savings Commitment |
| H | Eligibility Status |

**File Format**: `NYSC_Survey_YYYY-MM-DD_TIMESTAMP.xlsx`

## Key Components

### NyscSurvey.jsx
Main component managing:
- Multi-step form state
- Step validation
- Navigation (next/previous)
- Success screen
- Excel export trigger

### excelExport.js
Utility functions for:
- `calculateEligibilityStatus()` - Lead qualification
- `exportToExcel()` - Single record export
- `exportBatchToExcel()` - Batch export functionality

## Customization

### Modify Color Scheme
Edit `tailwind.config.js`:
```javascript
colors: {
  'teal': '#0d7a7a',      // Primary color
  'teal-dark': '#05545d', // Darker variant
  'forest': '#1e7e74',    // Accent color
}
```

### Change Survey Questions
Edit `NyscSurvey.jsx` - `steps` array:
```javascript
const steps = [
  {
    id: 'custom',
    title: 'Your Question',
    subtitle: 'Additional context',
    type: 'text', // or 'radio', 'number', 'yesno'
    field: 'fieldName',
    options: [] // for radio types
  }
]
```

### Adjust Eligibility Criteria
Edit `excelExport.js` - `calculateEligibilityStatus()` function:
```javascript
if (income >= 150000 && commitment) {
  return 'High Priority'
}
```

## Deployment

### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Traditional Hosting
```bash
npm run build
# Upload 'dist' folder contents to your server
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### XLSX Library Issues
If Excel export fails:
```bash
npm uninstall xlsx
npm install xlsx@0.18.5
```

### Vite Port Conflicts
If port 5173 is taken:
```bash
npm run dev -- --port 3000
```

### Tailwind Styles Not Loading
Rebuild CSS:
```bash
npm run build
```

## Performance Tips

1. **Reduce Bundle Size**: The component uses tree-shaking; unused Framer Motion features won't be bundled
2. **Image Optimization**: Consider optimizing the AXP logo with Vite's image handling
3. **Caching**: Enable browser caching for static assets

## Security Considerations

- **No Backend Integration** (Yet): Responses are stored client-side before export
- **Data Privacy**: Excel download happens locally; no data sent to external servers
- **Form Validation**: All inputs validated before submission

## Future Enhancements

- [ ] Backend API integration for data persistence
- [ ] Email verification step
- [ ] Multi-language support
- [ ] SMS confirmation
- [ ] CRM integration (Hubspot, Salesforce)
- [ ] Real-time data analytics dashboard
- [ ] Batch import/export from admin panel

## License

Proprietary - AXP Solutions Pro

## Support

For issues or feature requests, contact the development team.

---

**Version**: 1.0.0
**Last Updated**: June 2024
**Status**: Production Ready ✅
