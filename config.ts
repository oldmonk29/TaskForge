export const config = {
  FREE_LAUNCH: import.meta.env.VITE_FREE_LAUNCH === 'true',
  WELCOME_BONUS_PAISE: parseInt(import.meta.env.VITE_WELCOME_BONUS_PAISE || '50000'),
  SHOW_ADS: import.meta.env.VITE_SHOW_ADS === 'true',
  RAZORPAY_KEY_ID: import.meta.env.VITE_RAZORPAY_KEY_ID,
};

export const formatCurrency = (paise: number): string => {
  return `₹${(paise / 100).toFixed(2)}`;
};

export const subscriptionTiers = [
  {
    id: 'FREEMIUM',
    name: 'Freemium',
    price: 5900, // paise
    features: [
      'Basic course library access',
      'Community forum access',
      'Mobile app access',
      'Ad-supported content'
    ],
    limitations: [
      'No certificates',
      'Premium content locked'
    ]
  },
  {
    id: 'PREMIUM',
    name: 'Premium',
    price: 50000, // paise
    features: [
      'All premium course content',
      'Ad-free streaming experience',
      'Downloadable course materials',
      'Official course certificates',
      'Hands-on lab exercises',
      'Priority support'
    ],
    popular: true
  },
  {
    id: 'ADVISORY',
    name: 'Expert Advisory',
    price: 99900, // paise
    features: [
      'Everything in Premium',
      '1-on-1 expert consultations',
      'Career guidance sessions',
      'Resume & portfolio review',
      'Industry networking access',
      'Job placement assistance'
    ]
  }
];
