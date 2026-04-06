import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, Check, MapPin, Calendar, Lightbulb } from 'lucide-react';

interface IntakeData {
  role: 'doctor' | 'designer' | 'engineer' | null;
  collaborationIntent: string[];
  topicArea: string[];
  skills: string[];
  location: string;
  availability: string;
  projectStage: string[];
}

interface DiscoverIntakeProps {
  onComplete: (data: IntakeData) => void;
}

export default function DiscoverIntake({ onComplete }: DiscoverIntakeProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<IntakeData>({
    role: null,
    collaborationIntent: [],
    topicArea: [],
    skills: [],
    location: 'Cleveland, OH',
    availability: '',
    projectStage: []
  });

  const steps = [
    {
      id: 'role',
      question: 'What is your role?',
      subtitle: 'This helps us connect you with the right collaborators',
      type: 'role-select'
    },
    {
      id: 'intent',
      question: 'What brings you here?',
      subtitle: 'Select all that apply',
      type: 'multi-select',
      options: [
        'Find research collaborators',
        'Join an existing project',
        'Start a new initiative',
        'Share my expertise',
        'Learn from others',
        'Validate an idea'
      ]
    },
    {
      id: 'topic',
      question: 'What areas are you interested in?',
      subtitle: 'Choose your focus areas',
      type: 'multi-select',
      options: [
        'Cardiology',
        'Oncology',
        'Neurology',
        'Pediatrics',
        'Emergency Medicine',
        'Surgery',
        'Wearable Tech',
        'AI/ML',
        'Robotics',
        'Telemedicine',
        'Medical Devices',
        'Healthcare IT'
      ]
    },
    {
      id: 'skills',
      question: 'What skills do you bring?',
      subtitle: 'Or what skills are you looking for',
      type: 'multi-select',
      options: [
        'Clinical Research',
        'UX Design',
        'Machine Learning',
        'Data Analysis',
        'Product Design',
        'Software Development',
        'Medical Imaging',
        'User Research',
        'Prototyping',
        'Systems Thinking'
      ]
    },
    {
      id: 'location',
      question: 'Where are you located?',
      subtitle: 'We\'ll show you nearby opportunities',
      type: 'location'
    },
    {
      id: 'availability',
      question: 'When can you start?',
      subtitle: 'This helps set expectations',
      type: 'single-select',
      options: [
        'Immediately available',
        'Within a month',
        'Flexible timing',
        'Just planning ahead'
      ]
    },
    {
      id: 'stage',
      question: 'What project stages interest you?',
      subtitle: 'Select all that apply',
      type: 'multi-select',
      options: [
        'Ideation',
        'Early Research',
        'Prototype Development',
        'Clinical Testing',
        'Product Development',
        'Implementation'
      ]
    },
    {
      id: 'preview',
      question: 'Ready to explore?',
      subtitle: 'Here\'s what we\'ll find for you',
      type: 'preview'
    }
  ];

  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(data);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepComplete = () => {
    const step = steps[currentStep];
    switch (step.id) {
      case 'role':
        return data.role !== null;
      case 'intent':
        return data.collaborationIntent.length > 0;
      case 'topic':
        return data.topicArea.length > 0;
      case 'skills':
        return data.skills.length > 0;
      case 'location':
        return data.location.length > 0;
      case 'availability':
        return data.availability.length > 0;
      case 'stage':
        return data.projectStage.length > 0;
      case 'preview':
        return true;
      default:
        return false;
    }
  };

  const handleRoleSelect = (role: 'doctor' | 'designer' | 'engineer') => {
    setData({ ...data, role });
  };

  const handleMultiSelect = (field: keyof IntakeData, value: string) => {
    const currentValues = data[field] as string[];
    if (currentValues.includes(value)) {
      setData({ ...data, [field]: currentValues.filter(v => v !== value) });
    } else {
      setData({ ...data, [field]: [...currentValues, value] });
    }
  };

  const handleSingleSelect = (field: keyof IntakeData, value: string) => {
    setData({ ...data, [field]: value });
  };

  const getRoleIcon = (role: 'doctor' | 'designer' | 'engineer') => {
    switch (role) {
      case 'doctor':
        return '🩺';
      case 'designer':
        return '✏️';
      case 'engineer':
        return '⚙️';
    }
  };

  const getRoleTitle = (role: 'doctor' | 'designer' | 'engineer') => {
    switch (role) {
      case 'doctor':
        return 'Doctor / Clinician';
      case 'designer':
        return 'Designer';
      case 'engineer':
        return 'Engineer';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% complete
            </span>
          </div>
          <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-400 to-rose-400"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-12"
          >
            {/* Question Header */}
            <div className="mb-12 text-center">
              <h1 className="text-5xl font-semibold text-gray-900 mb-4 leading-tight">
                {currentStepData.question}
              </h1>
              <p className="text-xl text-gray-600">
                {currentStepData.subtitle}
              </p>
            </div>

            {/* Answer Options */}
            <div className="mb-12">
              {currentStepData.type === 'role-select' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(['doctor', 'designer', 'engineer'] as const).map((role) => (
                    <button
                      key={role}
                      onClick={() => handleRoleSelect(role)}
                      className={`p-8 rounded-xl border-2 transition-all duration-200 ${
                        data.role === role
                          ? 'border-orange-400 bg-orange-50 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-orange-200 hover:bg-orange-50/30'
                      }`}
                    >
                      <div className="text-5xl mb-4">{getRoleIcon(role)}</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {getRoleTitle(role)}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {currentStepData.type === 'multi-select' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentStepData.options?.map((option) => {
                    const field = currentStepData.id === 'intent' ? 'collaborationIntent' 
                      : currentStepData.id === 'topic' ? 'topicArea'
                      : currentStepData.id === 'skills' ? 'skills'
                      : 'projectStage';
                    const isSelected = (data[field] as string[]).includes(option);
                    
                    return (
                      <button
                        key={option}
                        onClick={() => handleMultiSelect(field as keyof IntakeData, option)}
                        className={`p-5 rounded-lg border-2 transition-all duration-200 text-left ${
                          isSelected
                            ? 'border-orange-400 bg-orange-50'
                            : 'border-gray-200 hover:border-orange-200 hover:bg-orange-50/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-base font-medium text-gray-900">{option}</span>
                          {isSelected && (
                            <Check className="h-5 w-5 text-orange-500" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {currentStepData.type === 'single-select' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentStepData.options?.map((option) => {
                    const isSelected = data.availability === option;
                    
                    return (
                      <button
                        key={option}
                        onClick={() => handleSingleSelect('availability', option)}
                        className={`p-5 rounded-lg border-2 transition-all duration-200 text-left ${
                          isSelected
                            ? 'border-orange-400 bg-orange-50'
                            : 'border-gray-200 hover:border-orange-200 hover:bg-orange-50/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-base font-medium text-gray-900">{option}</span>
                          {isSelected && (
                            <Check className="h-5 w-5 text-orange-500" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {currentStepData.type === 'location' && (
                <div className="max-w-md mx-auto">
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={data.location}
                      onChange={(e) => setData({ ...data, location: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      placeholder="Enter your location"
                    />
                  </div>
                </div>
              )}

              {currentStepData.type === 'preview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 bg-gradient-to-br from-orange-50 to-rose-50 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-white rounded-lg">
                          <span className="text-2xl">{data.role && getRoleIcon(data.role)}</span>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Your role</div>
                          <div className="font-semibold text-gray-900">
                            {data.role && getRoleTitle(data.role)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-orange-50 to-rose-50 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-white rounded-lg">
                          <MapPin className="h-6 w-6 text-orange-500" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Location</div>
                          <div className="font-semibold text-gray-900">{data.location}</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-orange-50 to-rose-50 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-white rounded-lg">
                          <Calendar className="h-6 w-6 text-orange-500" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Availability</div>
                          <div className="font-semibold text-gray-900">{data.availability}</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-orange-50 to-rose-50 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-white rounded-lg">
                          <Lightbulb className="h-6 w-6 text-orange-500" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Topics</div>
                          <div className="font-semibold text-gray-900">
                            {data.topicArea.length} areas
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl">
                    <p className="text-lg text-gray-700 text-center">
                      We found <span className="font-bold text-orange-600">
                        {data.topicArea.length * 2 + 3} potential collaborators
                      </span> who match your interests in the Cleveland area
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  currentStep === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ArrowLeft className="h-5 w-5" />
                Back
              </button>

              <button
                onClick={handleNext}
                disabled={!isStepComplete()}
                className={`flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-lg transition-all ${
                  isStepComplete()
                    ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white hover:shadow-lg hover:scale-105'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {currentStep === steps.length - 1 ? 'Explore Map' : 'Continue'}
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
