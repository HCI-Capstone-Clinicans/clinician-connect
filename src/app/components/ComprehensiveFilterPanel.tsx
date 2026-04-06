import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ChevronDown,
  Search,
  Target,
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';
import { filterCategories, FilterCategoryKey, UserRole } from '../data/filterOptions';

interface ComprehensiveFilterPanelProps {
  userRole: UserRole | null;
  onClose: () => void;
  appliedFilters: Record<string, string[]>;
  onUpdateFilters: (category: string, values: string[]) => void;
  onClearAll: () => void;
  matchType: 'exact' | 'adjacent';
  onMatchTypeChange: (type: 'exact' | 'adjacent') => void;
  resultCount: number;
  strongMatchCount: number;
}

export default function ComprehensiveFilterPanel({
  userRole,
  onClose,
  appliedFilters,
  onUpdateFilters,
  onClearAll,
  matchType,
  onMatchTypeChange,
  resultCount,
  strongMatchCount
}: ComprehensiveFilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['workingOn', 'collaboratorType', 'areaOfInterest']));
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
  const [showRoleSpecific, setShowRoleSpecific] = useState(true);

  const toggleSection = (key: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedSections(newExpanded);
  };

  const toggleFilter = (category: string, value: string) => {
    const currentValues = appliedFilters[category] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    onUpdateFilters(category, newValues);
  };

  const removeFilter = (category: string, value: string) => {
    const currentValues = appliedFilters[category] || [];
    onUpdateFilters(category, currentValues.filter(v => v !== value));
  };

  const getTotalAppliedCount = () => {
    return Object.values(appliedFilters).reduce((sum, arr) => sum + arr.length, 0);
  };

  const getCategoryAppliedCount = (key: string) => {
    return (appliedFilters[key] || []).length;
  };

  const getFilteredTags = (category: FilterCategoryKey) => {
    const categoryData = filterCategories[category];
    const searchTerm = searchTerms[category] || '';
    
    let allTags = [...categoryData.shared];
    
    if (showRoleSpecific && userRole && 'doctor' in categoryData) {
      const roleSpecificTags = categoryData[userRole as keyof typeof categoryData];
      if (Array.isArray(roleSpecificTags)) {
        allTags = [...allTags, ...roleSpecificTags];
      }
    }

    if (searchTerm) {
      return allTags.filter(tag => 
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return allTags;
  };

  return (
    <motion.div
      initial={{ x: -400 }}
      animate={{ x: 0 }}
      exit={{ x: -400 }}
      transition={{ type: 'spring', damping: 25 }}
      className="w-96 bg-white border-r border-gray-200 flex flex-col overflow-hidden z-10 h-full"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Discover</h2>
            {getTotalAppliedCount() > 0 && (
              <p className="text-sm text-gray-600 mt-0.5">
                {getTotalAppliedCount()} filter{getTotalAppliedCount() !== 1 ? 's' : ''} applied
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Match Type Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => onMatchTypeChange('exact')}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
              matchType === 'exact'
                ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Target className="h-4 w-4 inline mr-1.5" />
            Exact Match
          </button>
          <button
            onClick={() => onMatchTypeChange('adjacent')}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
              matchType === 'adjacent'
                ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Sparkles className="h-4 w-4 inline mr-1.5" />
            Adjacent
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gradient-to-br from-orange-50 to-rose-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{resultCount}</div>
            <div className="text-xs text-gray-600">Collaborators</div>
          </div>
          <div className="p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{strongMatchCount}</div>
            <div className="text-xs text-gray-600">Strong Matches</div>
          </div>
        </div>

        {/* Role-Specific Toggle */}
        {userRole && (
          <div className="mt-4 flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-700">
              Show {userRole}-specific suggestions
            </span>
            <button
              onClick={() => setShowRoleSpecific(!showRoleSpecific)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                showRoleSpecific ? 'bg-orange-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showRoleSpecific ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        )}

        {/* Clear All */}
        {getTotalAppliedCount() > 0 && (
          <button
            onClick={onClearAll}
            className="mt-3 w-full px-4 py-2 text-sm font-medium text-orange-700 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Applied Filters Chips */}
      {getTotalAppliedCount() > 0 && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
            Active Filters
          </h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(appliedFilters).map(([category, values]) =>
              values.map(value => (
                <button
                  key={`${category}-${value}`}
                  onClick={() => removeFilter(category, value)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-orange-200 text-orange-700 rounded-lg text-xs font-medium hover:bg-orange-50 transition-colors group"
                >
                  {value}
                  <X className="h-3 w-3 group-hover:text-orange-900" />
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Filter Sections */}
      <div className="flex-1 overflow-y-auto">
        {(Object.keys(filterCategories) as FilterCategoryKey[]).map((key) => {
          const category = filterCategories[key];
          const isExpanded = expandedSections.has(key);
          const appliedCount = getCategoryAppliedCount(key);
          const filteredTags = getFilteredTags(key);

          return (
            <div key={key} className="border-b border-gray-200">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(key)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 text-sm">
                    {category.label}
                  </span>
                  {appliedCount > 0 && (
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                      {appliedCount}
                    </span>
                  )}
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-gray-500 transition-transform ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Section Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4">
                      {/* Search */}
                      {filteredTags.length > 10 && (
                        <div className="mb-3 relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerms[key] || ''}
                            onChange={(e) =>
                              setSearchTerms({ ...searchTerms, [key]: e.target.value })
                            }
                            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        </div>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {filteredTags.map((tag) => {
                          const isSelected = (appliedFilters[key] || []).includes(tag);
                          return (
                            <button
                              key={tag}
                              onClick={() => toggleFilter(key, tag)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                isSelected
                                  ? 'bg-orange-100 text-orange-700 border-orange-300 shadow-sm'
                                  : 'bg-white text-gray-700 border-gray-200 hover:border-orange-200 hover:bg-orange-50'
                              }`}
                            >
                              {tag}
                            </button>
                          );
                        })}
                      </div>

                      {filteredTags.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4">
                          No matches found
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
