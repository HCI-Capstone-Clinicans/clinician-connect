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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[13px] text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-[13px] text-gray-500">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% complete
            </span>
          </div>
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gray-900"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-10"
          >
            {/* Question Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 mb-1.5 leading-snug">
                {currentStepData.question}
              </h1>
              <p className="text-[14px] text-gray-500">
                {currentStepData.subtitle}
              </p>
            </div>

            {/* Answer Options */}
            <div className="mb-8">
              {currentStepData.type === 'role-select' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {(['doctor', 'designer', 'engineer'] as const).map((role) => (
                    <button
                      key={role}
                      onClick={() => handleRoleSelect(role)}
                      className={`p-6 rounded-lg border transition-all duration-150 text-left ${
                        data.role === role
                          ? 'border-gray-900 bg-gray-50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-3xl mb-3">{getRoleIcon(role)}</div>
                      <div className="text-[14px] font-semibold text-gray-900">
                        {getRoleTitle(role)}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {currentStepData.type === 'multi-select' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
                        className={`px-4 py-3 rounded-lg border transition-all duration-150 text-left ${
                          isSelected
                            ? 'border-gray-900 bg-gray-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[13px] font-medium text-gray-900">{option}</span>
                          {isSelected && (
                            <Check className="h-4 w-4 text-gray-900 shrink-0" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {currentStepData.type === 'single-select' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {currentStepData.options?.map((option) => {
                    const isSelected = data.availability === option;

                    return (
                      <button
                        key={option}
                        onClick={() => handleSingleSelect('availability', option)}
                        className={`px-4 py-3 rounded-lg border transition-all duration-150 text-left ${
                          isSelected
                            ? 'border-gray-900 bg-gray-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[13px] font-medium text-gray-900">{option}</span>
                          {isSelected && (
                            <Check className="h-4 w-4 text-gray-900 shrink-0" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {currentStepData.type === 'location' && (
                <div className="max-w-md">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={data.location}
                      onChange={(e) => setData({ ...data, location: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300"
                      placeholder="Enter your location"
                    />
                  </div>
                </div>
              )}

              {currentStepData.type === 'preview' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-white border border-gray-200 rounded-md">
                          <span className="text-xl">{data.role && getRoleIcon(data.role)}</span>
                        </div>
                        <div>
                          <div className="text-[12px] text-gray-500">Your role</div>
                          <div className="text-[13px] font-semibold text-gray-900">
                            {data.role && getRoleTitle(data.role)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-white border border-gray-200 rounded-md">
                          <MapPin className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="text-[12px] text-gray-500">Location</div>
                          <div className="text-[13px] font-semibold text-gray-900">{data.location}</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-white border border-gray-200 rounded-md">
                          <Calendar className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="text-[12px] text-gray-500">Availability</div>
                          <div className="text-[13px] font-semibold text-gray-900">{data.availability}</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-white border border-gray-200 rounded-md">
                          <Lightbulb className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="text-[12px] text-gray-500">Topics</div>
                          <div className="text-[13px] font-semibold text-gray-900">
                            {data.topicArea.length} areas selected
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-[13px] text-gray-700 text-center">
                      We found{' '}
                      <span className="font-semibold text-gray-900">
                        {data.topicArea.length * 2 + 3} potential collaborators
                      </span>{' '}
                      who match your interests in the Cleveland area
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-[13px] font-medium transition-colors ${
                  currentStep === 0
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              <button
                onClick={handleNext}
                disabled={!isStepComplete()}
                className={`flex items-center gap-1.5 px-5 py-2 rounded-md text-[13px] font-semibold transition-colors ${
                  isStepComplete()
                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {currentStep === steps.length - 1 ? 'Explore Map' : 'Continue'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
