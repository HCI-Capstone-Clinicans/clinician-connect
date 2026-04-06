import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ChevronDown,
  Check,
  MapPin,
  User,
  Briefcase,
  Lightbulb,
  Wrench,
  Clock,
  Layers
} from 'lucide-react';

interface IntakeData {
  role: 'doctor' | 'designer' | 'engineer' | null;
  collaborationIntent: string[];
  topicArea: string[];
  skills: string[];
  location: string;
  availability: string;
  projectStage: string[];
}

interface EditCriteriaPanelProps {
  onClose: () => void;
  currentCriteria: IntakeData;
  onSave: (updatedCriteria: IntakeData) => void;
}

const roleOptions = [
  { value: 'doctor', label: 'Doctor / Clinician', icon: User },
  { value: 'engineer', label: 'Engineer', icon: Wrench },
  { value: 'designer', label: 'Designer', icon: Lightbulb }
];

const collaborationIntentOptions = [
  'Find collaborators for a new project',
  'Join an existing project',
  'Offer expertise/advising',
  'Explore partnerships',
  'Research collaboration',
  'Technical consultation',
  'Design support',
  'Clinical validation',
  'Mentorship opportunity',
  'Grant collaboration'
];

const topicAreaOptions = [
  'Cancer care',
  'Surgery',
  'Pediatrics',
  'Mental health',
  'Cardiology',
  'Neurology',
  'Rehabilitation',
  'Medical education',
  'AI in healthcare',
  'Medical devices',
  'Patient experience',
  'Provider workflow',
  'Diagnostic tools',
  'Remote care',
  'Clinical operations',
  'Accessibility',
  'Data visualization',
  'Communication tools',
  'Preventive care',
  'Chronic disease'
];

const skillOptions = [
  'Research',
  'Strategy',
  'Prototyping',
  'UX research',
  'UI design',
  'Software development',
  'Hardware',
  'Machine learning',
  'Clinical insight',
  'Trial design',
  'Systems thinking',
  'Data engineering',
  'Product design',
  'Service design',
  'Testing',
  'Documentation',
  'Communication',
  'Implementation planning'
];

const locationOptions = [
  'University Hospitals',
  'Cleveland Clinic',
  'Case Western Reserve University',
  'MetroHealth',
  'Cleveland area',
  'Remote'
];

const availabilityOptions = [
  { value: 'flexible', label: 'Flexible - Open to discuss' },
  { value: 'part-time', label: 'Part-time - Few hours per week' },
  { value: 'limited', label: 'Limited - Occasional meetings' },
  { value: 'full-time', label: 'Full-time - Significant commitment' }
];

const projectStageOptions = [
  'Just exploring',
  'Defining the problem',
  'Early concept',
  'Research underway',
  'Prototype in progress',
  'Pilot ready',
  'Testing with users',
  'Seeking implementation support',
  'Looking for funding'
];

export default function EditCriteriaPanel({
  onClose,
  currentCriteria,
  onSave
}: EditCriteriaPanelProps) {
  const [criteria, setCriteria] = useState<IntakeData>(currentCriteria);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['role', 'topicArea', 'skills'])
  );

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const toggleArrayValue = (
    field: 'collaborationIntent' | 'topicArea' | 'skills' | 'projectStage',
    value: string
  ) => {
    const currentValues = criteria[field];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    setCriteria({ ...criteria, [field]: newValues });
  };

  const handleSave = () => {
    onSave(criteria);
    onClose();
  };

  const hasChanges = JSON.stringify(criteria) !== JSON.stringify(currentCriteria);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000]"
      />

      {/* Panel */}
      <motion.div
        initial={{ x: 400 }}
        animate={{ x: 0 }}
        exit={{ x: 400 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed right-0 top-0 bottom-0 w-[480px] bg-white shadow-2xl z-[2001] flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-semibold text-gray-900">Edit Search Criteria</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Adjust your preferences to refine collaborator matches
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Role Selection */}
          <div className="border-b border-gray-200">
            <button
              onClick={() => toggleSection('role')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-500" />
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Your Role</h3>
                  <p className="text-xs text-gray-600">
                    {criteria.role ? roleOptions.find(r => r.value === criteria.role)?.label : 'Not selected'}
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-gray-500 transition-transform ${
                  expandedSections.has('role') ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            <AnimatePresence>
              {expandedSections.has('role') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-4 space-y-2">
                    {roleOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() =>
                          setCriteria({
                            ...criteria,
                            role: option.value as 'doctor' | 'designer' | 'engineer'
                          })
                        }
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left flex items-center gap-3 ${
                          criteria.role === option.value
                            ? 'border-orange-400 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${
                          criteria.role === option.value
                            ? 'bg-orange-100'
                            : 'bg-gray-100'
                        }`}>
                          <option.icon className={`h-5 w-5 ${
                            criteria.role === option.value
                              ? 'text-orange-600'
                              : 'text-gray-600'
                          }`} />
                        </div>
                        <span className={`font-medium ${
                          criteria.role === option.value
                            ? 'text-orange-900'
                            : 'text-gray-900'
                        }`}>
                          {option.label}
                        </span>
                        {criteria.role === option.value && (
                          <Check className="h-5 w-5 text-orange-600 ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Collaboration Intent */}
          <div className="border-b border-gray-200">
            <button
              onClick={() => toggleSection('collaborationIntent')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-gray-500" />
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Collaboration Intent</h3>
                  <p className="text-xs text-gray-600">
                    {criteria.collaborationIntent.length} selected
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-gray-500 transition-transform ${
                  expandedSections.has('collaborationIntent') ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            <AnimatePresence>
              {expandedSections.has('collaborationIntent') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-4">
                    <div className="flex flex-wrap gap-2">
                      {collaborationIntentOptions.map((option) => {
                        const isSelected = criteria.collaborationIntent.includes(option);
                        return (
                          <button
                            key={option}
                            onClick={() => toggleArrayValue('collaborationIntent', option)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                              isSelected
                                ? 'border-orange-400 bg-orange-50 text-orange-700'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            {isSelected && <Check className="h-3 w-3 inline mr-1" />}
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Topic Areas */}
          <div className="border-b border-gray-200">
            <button
              onClick={() => toggleSection('topicArea')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Layers className="h-5 w-5 text-gray-500" />
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Topic Areas</h3>
                  <p className="text-xs text-gray-600">
                    {criteria.topicArea.length} selected
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-gray-500 transition-transform ${
                  expandedSections.has('topicArea') ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            <AnimatePresence>
              {expandedSections.has('topicArea') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-4">
                    <div className="flex flex-wrap gap-2">
                      {topicAreaOptions.map((option) => {
                        const isSelected = criteria.topicArea.includes(option);
                        return (
                          <button
                            key={option}
                            onClick={() => toggleArrayValue('topicArea', option)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                              isSelected
                                ? 'border-orange-400 bg-orange-50 text-orange-700'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            {isSelected && <Check className="h-3 w-3 inline mr-1" />}
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Skills */}
          <div className="border-b border-gray-200">
            <button
              onClick={() => toggleSection('skills')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Wrench className="h-5 w-5 text-gray-500" />
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Skills</h3>
                  <p className="text-xs text-gray-600">
                    {criteria.skills.length} selected
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-gray-500 transition-transform ${
                  expandedSections.has('skills') ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            <AnimatePresence>
              {expandedSections.has('skills') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-4">
                    <div className="flex flex-wrap gap-2">
                      {skillOptions.map((option) => {
                        const isSelected = criteria.skills.includes(option);
                        return (
                          <button
                            key={option}
                            onClick={() => toggleArrayValue('skills', option)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                              isSelected
                                ? 'border-orange-400 bg-orange-50 text-orange-700'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            {isSelected && <Check className="h-3 w-3 inline mr-1" />}
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Location */}
          <div className="border-b border-gray-200">
            <button
              onClick={() => toggleSection('location')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-500" />
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Location</h3>
                  <p className="text-xs text-gray-600">
                    {criteria.location || 'Not selected'}
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-gray-500 transition-transform ${
                  expandedSections.has('location') ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            <AnimatePresence>
              {expandedSections.has('location') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-4 space-y-2">
                    {locationOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => setCriteria({ ...criteria, location: option })}
                        className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                          criteria.location === option
                            ? 'border-orange-400 bg-orange-50 text-orange-900'
                            : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{option}</span>
                          {criteria.location === option && (
                            <Check className="h-5 w-5 text-orange-600" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Availability */}
          <div className="border-b border-gray-200">
            <button
              onClick={() => toggleSection('availability')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-500" />
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Availability</h3>
                  <p className="text-xs text-gray-600">
                    {availabilityOptions.find(a => a.value === criteria.availability)?.label || 'Not selected'}
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-gray-500 transition-transform ${
                  expandedSections.has('availability') ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            <AnimatePresence>
              {expandedSections.has('availability') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-4 space-y-2">
                    {availabilityOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setCriteria({ ...criteria, availability: option.value })}
                        className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                          criteria.availability === option.value
                            ? 'border-orange-400 bg-orange-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className={`font-medium ${
                              criteria.availability === option.value
                                ? 'text-orange-900'
                                : 'text-gray-900'
                            }`}>
                              {option.label.split(' - ')[0]}
                            </div>
                            <div className="text-xs text-gray-600">
                              {option.label.split(' - ')[1]}
                            </div>
                          </div>
                          {criteria.availability === option.value && (
                            <Check className="h-5 w-5 text-orange-600" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Project Stage */}
          <div className="border-b border-gray-200">
            <button
              onClick={() => toggleSection('projectStage')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Lightbulb className="h-5 w-5 text-gray-500" />
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Project Stage</h3>
                  <p className="text-xs text-gray-600">
                    {criteria.projectStage.length} selected
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-gray-500 transition-transform ${
                  expandedSections.has('projectStage') ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            <AnimatePresence>
              {expandedSections.has('projectStage') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-4">
                    <div className="flex flex-wrap gap-2">
                      {projectStageOptions.map((option) => {
                        const isSelected = criteria.projectStage.includes(option);
                        return (
                          <button
                            key={option}
                            onClick={() => toggleArrayValue('projectStage', option)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                              isSelected
                                ? 'border-orange-400 bg-orange-50 text-orange-700'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            {isSelected && <Check className="h-3 w-3 inline mr-1" />}
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`flex-1 px-6 py-3 font-semibold rounded-lg transition-all ${
                hasChanges
                  ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Apply Changes
            </button>
          </div>
          {hasChanges && (
            <p className="text-xs text-center text-gray-600 mt-3">
              Changes will update your collaborator matches
            </p>
          )}
        </div>
      </motion.div>
    </>
  );
}
