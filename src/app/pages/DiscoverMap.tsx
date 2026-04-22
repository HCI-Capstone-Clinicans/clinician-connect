import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Map as PigeonMap, Marker, Overlay } from 'pigeon-maps';
import { motion, AnimatePresence } from 'motion/react';
import {
  Filter,
  Building2,
  X,
  ChevronRight,
  Mail,
  SlidersHorizontal,

  MapPin,
  Navigation,
  ChevronDown,
  Search,
  Loader
} from 'lucide-react';
import { collaborators, Collaborator } from '../data/collaborators';
import { institutionList } from '../data/collaborators';
import ComprehensiveFilterPanel from '../components/ComprehensiveFilterPanel';
import EditCriteriaPanel from '../components/EditCriteriaPanel';
import { Link, useNavigate } from 'react-router';

interface ProjectPin {
  id: string;
  name: string;
  lab: string;
  institution: string;
  status: string;
  tags: string[];
  matchPercentage: number;
  location: { lat: number; lng: number };
}

// Projects spread at 0 / 1.1 / 1.4 / 1.7 miles from userLocation so the
// radius slider progressively reveals them one by one.
const STATIC_PROJECTS: ProjectPin[] = [
  {
    id: 'robodog',
    name: 'RoboDog',
    lab: 'Carroll Labs',
    institution: 'University Hospitals',
    status: 'Prototype Development',
    tags: ['Robotics', 'Human-Robot Interaction', 'Surgery'],
    matchPercentage: 87,
    location: { lat: 41.5045, lng: -81.6082 }, // 0 mi — at userLocation
  },
  {
    id: 'smartsuture',
    name: 'SmartSuture',
    lab: 'Biomedical Engineering Lab',
    institution: 'Case Western Reserve University',
    status: 'Early Research',
    tags: ['Robotics', 'Computer Vision', 'Medical Devices'],
    matchPercentage: 68,
    location: { lat: 41.5204, lng: -81.6082 }, // ~1.1 mi north
  },
  {
    id: 'burnout-prevention',
    name: 'Burnout Prevention',
    lab: 'Cleveland Art Labs',
    institution: 'UH Cleveland Medical Center',
    status: 'Active Research',
    tags: ['Digital Health', 'Mental Health', 'UX Research'],
    matchPercentage: 30,
    location: { lat: 41.4850, lng: -81.6082 }, // ~1.35 mi south
  },
  {
    id: 'medassist',
    name: 'MedAssist AI',
    lab: 'Digital Health Innovation Lab',
    institution: 'Cleveland Clinic',
    status: 'Active Development',
    tags: ['AI/ML', 'Surgery Assistance', 'Medical Devices'],
    matchPercentage: 72,
    location: { lat: 41.5045, lng: -81.6400 }, // ~1.65 mi west
  },
];

interface IntakeData {
  role: 'doctor' | 'designer' | 'engineer' | null;
  collaborationIntent: string[];
  topicArea: string[];
  skills: string[];
  location: string;
  availability: string;
  projectStage: string[];
}

interface DiscoverMapProps {
  intakeData: IntakeData | null;
  onEditFilters: () => void;
  mode?: 'projects' | 'collaborators';
}

const PUBLIC_COLLABORATOR_PROFILE_IDS = new Set([
  'jane-smith',
  'john-doe',
  'eric-shanefield',
]);

export default function DiscoverMap({ intakeData, onEditFilters, mode }: DiscoverMapProps) {
  const showProjects = mode !== 'collaborators';
  const showCollaborators = mode !== 'projects';
  const navigate = useNavigate();

  const [clickedMarkerId, setClickedMarkerId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [matchType, setMatchType] = useState<'exact' | 'adjacent'>('exact');
  const [radiusFilter, setRadiusFilter] = useState(1);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Auto-zoom so the circle edges nearly touch the map edges
  const computeZoom = (radius: number) => {
    const EARTH_CIRC_MILES = 24901;
    const lat = userLocation[0];
    const cosLat = Math.cos(lat * Math.PI / 180);
    const containerSize = mapContainerRef.current
      ? Math.min(mapContainerRef.current.offsetWidth, mapContainerRef.current.offsetHeight)
      : 600;
    const targetDiameterPx = containerSize * 0.88;
    const zoom = Math.log2((targetDiameterPx * EARTH_CIRC_MILES * cosLat) / (radius * 2 * 256));
    return Math.max(10, Math.min(16, Math.round(zoom)));
  };

  useEffect(() => {
    setMapZoom(computeZoom(radiusFilter));
    setMapCenter([41.5045, -81.6082]);
  }, [radiusFilter]);

  // Recompute zoom on mount once the ref is available
  useEffect(() => {
    setMapZoom(computeZoom(radiusFilter));
  }, []);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string[]>>({
    areaOfInterest: intakeData?.topicArea ?? []
  });
  const [mapCenter, setMapCenter] = useState<[number, number]>([41.4993, -81.6944]);
  const [mapZoom, setMapZoom] = useState(12);
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const [showEditCriteria, setShowEditCriteria] = useState(false);
  const [showAllResults, setShowAllResults] = useState(false);
  const [hasAppliedFilter, setHasAppliedFilter] = useState(true);
  const [privateProfileName, setPrivateProfileName] = useState<string | null>(null);
  const DEFAULT_INTAKE: IntakeData = {
    role: null,
    collaborationIntent: [],
    topicArea: [],
    skills: [],
    location: "Cleveland, OH",
    availability: "",
    projectStage: [],
  };
  const [currentIntakeData, setCurrentIntakeData] = useState<IntakeData>(intakeData ?? DEFAULT_INTAKE);

  // Fixed user location: University Hospitals / Case Western cluster (Cleveland, OH)
  const userLocation: [number, number] = [41.5045, -81.6082];

  // Haversine distance in miles between two lat/lng points
  function getDistanceMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 3958.8;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // Pixels per mile at current zoom + latitude (256px tile size, Web Mercator)
  const pixelsPerMile = useMemo(() => {
    const EARTH_CIRC_MILES = 24901;
    return (256 * Math.pow(2, mapZoom)) / (EARTH_CIRC_MILES * Math.cos(userLocation[0] * Math.PI / 180));
  }, [mapZoom]);

  // Custom tile provider for light, flat aesthetic (CartoDB Positron)
  const customTileProvider = (x: number, y: number, z: number) => {
    return `https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/${z}/${x}/${y}.png`;
  };

  // Filter collaborators based on current filters
  const filteredCollaborators = useMemo(() => {
    return collaborators.filter(collab => {
      // Radius filter — only include collaborators within the search radius
      const dist = getDistanceMiles(
        userLocation[0], userLocation[1],
        collab.location.lat, collab.location.lng
      );
      if (dist > radiusFilter) return false;

      // Role filter - include residents and nurses when filtering by doctor
      if (appliedFilters.role && appliedFilters.role.length > 0) {
        const roleMatch = appliedFilters.role.some(filterRole => {
          if (filterRole === 'doctor') {
            return collab.role === 'doctor' || collab.role === 'resident' || collab.role === 'nurse';
          }
          return collab.role === filterRole;
        });
        if (!roleMatch) return false;
      }

      // Topic area filter (from currentIntakeData)
      if (currentIntakeData.topicArea.length > 0) {
        const hasMatchingTopic = collab.topicAreas.some(topic =>
          currentIntakeData.topicArea.some(filter => 
            topic.toLowerCase().includes(filter.toLowerCase()) ||
            filter.toLowerCase().includes(topic.toLowerCase())
          )
        );
        if (!hasMatchingTopic && matchType === 'exact') return false;
      }

      // Skills filter (from currentIntakeData)
      if (currentIntakeData.skills.length > 0) {
        const hasMatchingSkill = collab.skills.some(skill =>
          currentIntakeData.skills.some(filter => 
            skill.toLowerCase().includes(filter.toLowerCase()) ||
            filter.toLowerCase().includes(skill.toLowerCase())
          )
        );
        if (!hasMatchingSkill && matchType === 'exact') return false;
      }

      // Collaboration intent filter (from currentIntakeData)
      if (currentIntakeData.collaborationIntent.length > 0) {
        const hasMatchingIntent = collab.collaborationIntent.some(intent =>
          currentIntakeData.collaborationIntent.some(filter => 
            intent.toLowerCase().includes(filter.toLowerCase()) ||
            filter.toLowerCase().includes(intent.toLowerCase())
          )
        );
        if (!hasMatchingIntent && matchType === 'exact') return false;
      }

      // Project stage filter (from currentIntakeData)
      if (currentIntakeData.projectStage.length > 0) {
        const hasMatchingStage = collab.projectStage.some(stage =>
          currentIntakeData.projectStage.some(filter => 
            stage.toLowerCase().includes(filter.toLowerCase()) ||
            filter.toLowerCase().includes(stage.toLowerCase())
          )
        );
        if (!hasMatchingStage && matchType === 'exact') return false;
      }

      // Availability filter (from currentIntakeData)
      if (currentIntakeData.availability && currentIntakeData.availability !== '') {
        if (matchType === 'exact') {
          if (collab.availability !== currentIntakeData.availability && collab.availability !== 'flexible') {
            return false;
          }
        }
      }

      // Additional advanced filters from appliedFilters
      if (appliedFilters.workingStyle && appliedFilters.workingStyle.length > 0) {
        const hasMatchingStyle = collab.workingStyle.some(style =>
          appliedFilters.workingStyle.some(filter => 
            style.toLowerCase().includes(filter.toLowerCase())
          )
        );
        if (!hasMatchingStyle && matchType === 'exact') return false;
      }

      if (appliedFilters.collaborationType && appliedFilters.collaborationType.length > 0) {
        const hasMatchingType = collab.collaborationType.some(type =>
          appliedFilters.collaborationType.some(filter => 
            type.toLowerCase().includes(filter.toLowerCase())
          )
        );
        if (!hasMatchingType && matchType === 'exact') return false;
      }

      if (appliedFilters.constraints && appliedFilters.constraints.length > 0) {
        const hasMatchingConstraint = collab.constraints.some(constraint =>
          appliedFilters.constraints.some(filter => 
            constraint.toLowerCase().includes(filter.toLowerCase())
          )
        );
        if (!hasMatchingConstraint && matchType === 'exact') return false;
      }

      return true;
    });
  }, [appliedFilters, matchType, currentIntakeData, radiusFilter]);

  // Calculate match score
  const getMatchScore = (collab: Collaborator): number => {
    let score = 0;
    
    const topicMatches = collab.topicAreas.filter(topic =>
      currentIntakeData.topicArea.some(userTopic => 
        topic.toLowerCase().includes(userTopic.toLowerCase()) ||
        userTopic.toLowerCase().includes(topic.toLowerCase())
      )
    ).length;
    score += (topicMatches / Math.max(currentIntakeData.topicArea.length, 1)) * 40;

    const skillMatches = collab.skills.filter(skill =>
      currentIntakeData.skills.some(userSkill => 
        skill.toLowerCase().includes(userSkill.toLowerCase()) ||
        userSkill.toLowerCase().includes(skill.toLowerCase())
      )
    ).length;
    score += (skillMatches / Math.max(currentIntakeData.skills.length, 1)) * 30;

    if (collab.availability === currentIntakeData.availability || collab.availability === 'flexible') {
      score += 15;
    }

    const stageMatches = collab.projectStage.filter(stage =>
      currentIntakeData.projectStage.some(userStage => 
        stage.toLowerCase().includes(userStage.toLowerCase()) ||
        userStage.toLowerCase().includes(stage.toLowerCase())
      )
    ).length;
    score += (stageMatches / Math.max(currentIntakeData.projectStage.length, 1)) * 15;

    return Math.round(score);
  };

  const collaboratorsWithScores = filteredCollaborators.map(collab => ({
    ...collab,
    matchScore: getMatchScore(collab)
  })).sort((a, b) => b.matchScore - a.matchScore);

  const filteredProjects = useMemo(() =>
    STATIC_PROJECTS.filter(p =>
      getDistanceMiles(userLocation[0], userLocation[1], p.location.lat, p.location.lng) <= radiusFilter
    ),
  [radiusFilter]);
  const projectsByInstitution = useMemo(() => {
    const grouped = new Map<string, ProjectPin[]>();
    filteredProjects.forEach((project) => {
      const existing = grouped.get(project.institution) ?? [];
      grouped.set(project.institution, [...existing, project]);
    });
    return grouped;
  }, [filteredProjects]);

  // For adjacent mode, only show high-quality matches (top performers)
  const displayedCollaborators = useMemo(() => {
    if (matchType === 'adjacent') {
      // Only show collaborators with match score > 40 and limit to top 25
      return collaboratorsWithScores
        .filter(c => c.matchScore > 40)
        .slice(0, 25);
    }
    // For exact mode, show all that pass filters but ranked by score
    return collaboratorsWithScores;
  }, [collaboratorsWithScores, matchType]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'doctor':
        return 'from-blue-500 to-cyan-500';
      case 'designer':
        return 'from-purple-500 to-pink-500';
      case 'engineer':
        return 'from-orange-500 to-red-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'doctor':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'designer':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'engineer':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const toggleDisciplineFilter = (role: string) => {
    setHasAppliedFilter(true);
    if (appliedFilters.role && appliedFilters.role.includes(role)) {
      setAppliedFilters({
        ...appliedFilters,
        role: appliedFilters.role.filter(r => r !== role)
      });
    } else {
      setAppliedFilters({
        ...appliedFilters,
        role: [...(appliedFilters.role || []), role]
      });
    }
  };

  const handleViewCollaboratorProfile = (collab: Collaborator) => {
    if (PUBLIC_COLLABORATOR_PROFILE_IDS.has(collab.id)) {
      navigate(`/collaborator/${collab.id}`);
      return;
    }
    setPrivateProfileName(collab.name);
  };

  const CustomMarker = ({ 
    color, 
    size = 20, 
    isSelected = false,
    isUH = false,
    isInstitution = false,
    hoverLabel,
    onHoverStart,
    onHoverEnd,
  }: { 
    color: string; 
    size?: number; 
    isSelected?: boolean;
    isUH?: boolean;
    isInstitution?: boolean;
    hoverLabel?: string;
    onHoverStart?: () => void;
    onHoverEnd?: () => void;
  }) => {
    if (isInstitution) {
      return (
        <div
          className="relative"
          title={hoverLabel}
          onMouseEnter={onHoverStart}
          onMouseLeave={onHoverEnd}
        >
          {isUH && (
            <>
              <div 
                className="absolute inset-0 rounded-lg bg-cyan-400 opacity-40 blur-xl animate-pulse" 
                style={{ width: '60px', height: '60px', left: '-20px', top: '-20px' }} 
              />
              <div 
                className="absolute inset-0 rounded-lg bg-cyan-300 opacity-30 blur-lg" 
                style={{ width: '48px', height: '48px', left: '-14px', top: '-14px' }} 
              />
            </>
          )}
          <div 
            className={`rounded-lg border-3 shadow-2xl flex items-center justify-center cursor-pointer transition-transform hover:scale-110 ${
              isUH 
                ? 'bg-gradient-to-br from-cyan-500 to-blue-600 border-cyan-300 ring-4 ring-cyan-400 ring-opacity-50' 
                : 'bg-slate-600 border-white'
            }`}
            style={{ width: '40px', height: '40px' }}
          >
            <Building2 className="h-6 w-6 text-white" />
            {isUH && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full border-2 border-white animate-ping" />
            )}
          </div>
        </div>
      );
    }

    return (
      <div 
        className={`rounded-full border-2 border-white shadow-lg cursor-pointer transition-transform hover:scale-125 ${
          isSelected ? 'ring-4 ring-gray-700' : ''
        }`}
        title={hoverLabel}
        onMouseEnter={onHoverStart}
        onMouseLeave={onHoverEnd}
        style={{ 
          width: `${size}px`, 
          height: `${size}px`, 
          backgroundColor: color 
        }}
      />
    );
  };

  return (
    <div className="h-full flex overflow-hidden bg-gray-50 gap-4">
      {/* Side Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ x: -400 }}
            animate={{ x: 0 }}
            exit={{ x: -400 }}
            transition={{ type: 'spring', damping: 25 }}
            className="w-72 bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden z-10 shadow-sm"
          >
            {/* Panel Header */}
            <div className="px-4 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900">Discover</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="px-4 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <SlidersHorizontal className="h-3.5 w-3.5 text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
              </div>

              {/* Discipline Filter — collaborators mode only */}
              {showCollaborators && (
                <div className="mb-3">
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">Discipline</label>
                  <div className="flex flex-wrap gap-1.5">
                    {['doctor', 'designer', 'engineer'].map(role => (
                      <button
                        key={role}
                        onClick={() => toggleDisciplineFilter(role)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                          appliedFilters.role && appliedFilters.role.includes(role)
                            ? getRoleBadgeColor(role)
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                        {appliedFilters.role && appliedFilters.role.includes(role) && 's'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Radius Filter */}
              <div className="mb-3">
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">
                  Search Radius: {radiusFilter} miles
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={radiusFilter}
                  onChange={(e) => { setRadiusFilter(Number(e.target.value)); setHasAppliedFilter(true); }}
                  className="w-full"
                />
              </div>

              <button
                onClick={() => { setShowEditCriteria(true); setHasAppliedFilter(true); }}
                className="w-full px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Edit Search Criteria
              </button>
            </div>

            {/* Results List */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {!hasAppliedFilter ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <SlidersHorizontal className="h-7 w-7 text-gray-300 mb-2" />
                  <p className="text-xs text-gray-400">Apply a filter to see results</p>
                </div>
              ) : (
                <>
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Results ({(showProjects ? filteredProjects.length : 0) + (showCollaborators ? displayedCollaborators.length : 0)})
                    </h3>
                  </div>

                  {(() => {
                    const totalCount = (showProjects ? filteredProjects.length : 0) + (showCollaborators ? displayedCollaborators.length : 0);

                    if (totalCount === 0) {
                      return (
                        <div className="flex flex-col items-center justify-center py-6 text-center">
                          <MapPin className="h-7 w-7 text-gray-300 mb-2" />
                          <p className="text-xs text-gray-500">No results within {radiusFilter} miles.</p>
                          <p className="text-xs text-gray-400 mt-1">Try increasing the search radius.</p>
                        </div>
                      );
                    }

                    const allItems: Array<{ type: 'project' | 'collab'; id: string; node: React.ReactNode }> = [];

                    if (showProjects) {
                      filteredProjects.forEach((project) => {
                        allItems.push({
                          type: 'project',
                          id: project.id,
                          node: (
                            <motion.button
                              key={project.id}
                              onClick={() => {
                                setClickedMarkerId(prev => prev === project.id ? null : project.id);
                                setMapCenter([project.location.lat, project.location.lng]);
                                setMapZoom(15);
                              }}
                              whileHover={{ scale: 1.01 }}
                              className={`w-full p-2.5 rounded-xl border-2 transition-all text-left ${
                                clickedMarkerId === project.id
                                  ? 'border-green-500 bg-green-50'
                                  : 'border-gray-200 hover:border-gray-300 bg-white'
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                  {project.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1 mb-0.5">
                                    <h4 className="font-semibold text-gray-900 text-xs truncate">{project.name}</h4>
                                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0 ${
                                      project.matchPercentage > 70 ? 'bg-green-100 text-green-700' :
                                      project.matchPercentage > 50 ? 'bg-yellow-100 text-yellow-700' :
                                      'bg-gray-100 text-gray-700'
                                    }`}>{project.matchPercentage}%</span>
                                  </div>
                                  <p className="text-[10px] text-gray-500 truncate">{project.lab}</p>
                                </div>
                              </div>
                            </motion.button>
                          ),
                        });
                      });
                    }

                    if (showCollaborators) {
                      displayedCollaborators.forEach((collab) => {
                        allItems.push({
                          type: 'collab',
                          id: collab.id,
                          node: (
                            <motion.button
                              key={collab.id}
                              onClick={() => {
                                setClickedMarkerId(prev => prev === collab.id ? null : collab.id);
                                setMapCenter([collab.location.lat, collab.location.lng]);
                                setMapZoom(15);
                              }}
                              whileHover={{ scale: 1.01 }}
                              className={`w-full p-2.5 rounded-xl border-2 transition-all text-left ${
                                clickedMarkerId === collab.id
                                  ? 'border-gray-900 bg-gray-50 shadow-sm'
                                  : 'border-gray-200 hover:border-gray-300 bg-white'
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getRoleColor(collab.role)} flex items-center justify-center text-white font-semibold text-xs flex-shrink-0`}>
                                  {collab.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1 mb-0.5">
                                    <h4 className="font-semibold text-gray-900 text-xs truncate">{collab.name}</h4>
                                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0 ${
                                      collab.matchScore > 70 ? 'bg-green-100 text-green-700' :
                                      collab.matchScore > 50 ? 'bg-yellow-100 text-yellow-700' :
                                      'bg-gray-100 text-gray-700'
                                    }`}>{collab.matchScore}%</span>
                                  </div>
                                  <p className="text-[10px] text-gray-600 truncate">{collab.title}</p>
                                  <p className="text-[10px] text-gray-500 truncate">{collab.institution}</p>
                                </div>
                              </div>
                            </motion.button>
                          ),
                        });
                      });
                    }

                    const visibleItems = showAllResults ? allItems : allItems.slice(0, 3);
                    const hasMore = allItems.length > 3;

                    return (
                      <div className="space-y-1.5">
                        {visibleItems.map(item => (
                          <div key={item.id}>{item.node}</div>
                        ))}
                        {hasMore && (
                          <button
                            onClick={() => setShowAllResults(prev => !prev)}
                            className="w-full py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            {showAllResults ? 'Show less' : `See ${allItems.length - 3} more`}
                          </button>
                        )}
                      </div>
                    );
                  })()}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Container */}
      <div ref={mapContainerRef} className="flex-1 relative rounded-xl overflow-hidden border border-gray-200 shadow-sm">
        {/* Floating Controls */}
        {!showFilters && (
          <button
            onClick={() => setShowFilters(true)}
            className="absolute top-6 left-6 z-[1000] px-4 py-3 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-medium text-gray-700"
          >
            <Filter className="h-5 w-5" />
            Show Filters
          </button>
        )}

        {/* Floating Chips */}
        <div className="absolute top-6 left-6 z-[1000] flex flex-wrap gap-2 max-w-md">
          {(intakeData?.topicArea ?? []).slice(0, 3).map((topic, idx) => (
            <div
              key={idx}
              className="px-3 py-2 bg-white rounded-full shadow-md text-sm font-medium text-gray-700 border border-gray-200"
            >
              {topic}
            </div>
          ))}
          {(intakeData?.topicArea ?? []).length > 3 && (
            <div className="px-3 py-2 bg-white rounded-full shadow-md text-sm font-medium text-gray-600 border border-gray-200">
              +{(intakeData?.topicArea ?? []).length - 3} more
            </div>
          )}
        </div>

        {/* Map Legend */}
        <div className="absolute top-6 right-6 z-[1000] bg-white rounded-lg shadow-lg p-4">
          <h4 className="text-xs font-semibold text-gray-900 mb-2">Legend</h4>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="relative w-4 h-4">
                <div className="absolute inset-0 rounded-full bg-gray-600 opacity-20 blur-sm" />
                <div className="absolute inset-0 rounded-full bg-gray-900 border border-white flex items-center justify-center">
                  <Navigation className="h-2 w-2 text-white" style={{ transform: 'rotate(45deg)' }} />
                </div>
              </div>
              <span className="text-xs text-gray-700 font-semibold">Your Location</span>
            </div>
            {showCollaborators && (
              <>
                <div className="flex items-center gap-2 pt-1 border-t border-gray-200 mt-1.5">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-xs text-gray-600">Doctors</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <span className="text-xs text-gray-600">Designers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-xs text-gray-600">Engineers</span>
                </div>
              </>
            )}
            <div className="flex items-center gap-2 pt-1 border-t border-gray-200 mt-1.5">
              <div className="w-4 h-4 bg-slate-600 rounded flex items-center justify-center">
                <Building2 className="h-2.5 w-2.5 text-white" />
              </div>
              <span className="text-xs text-gray-600">Institutions</span>
            </div>
          </div>
        </div>

        {/* GPS/Location Button */}
        <button
          onClick={() => {
            setMapCenter(userLocation as [number, number]);
            setMapZoom(13);
          }}
          className="absolute bottom-6 right-6 z-[1000] p-3 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all group"
          title="Go to your location"
        >
          <div className="relative">
            <Navigation 
              className="h-6 w-6 text-gray-600 group-hover:text-gray-800 transition-colors" 
              style={{ transform: 'rotate(45deg)' }} 
            />
            <div className="absolute inset-0 rounded-full bg-gray-400 opacity-0 group-hover:opacity-10 blur-sm transition-opacity" />
          </div>
        </button>

        {/* Interactive Map */}
        <PigeonMap
          center={mapCenter}
          zoom={mapZoom}
          onBoundsChanged={({ center, zoom }) => {
            setMapCenter(center);
            setMapZoom(zoom);
          }}
          height={mapContainerRef.current?.clientHeight ?? 700}
          defaultWidth={600}
          attribution={false}
          provider={customTileProvider}
        >
          {/* Institution Markers */}
          {institutionList.map((inst) => (
            <Marker
              key={inst.id}
              anchor={[inst.location.lat, inst.location.lng]}
              offset={[20, 20]}
              onClick={() => setClickedMarkerId(prev => prev === inst.id ? null : inst.id)}
            >
              <div
                className="relative"
              >
                <CustomMarker
                  color="#64748b"
                  size={40}
                  isInstitution={true}
                  isUH={inst.isUH}
                  hoverLabel={inst.name}
                  onHoverStart={() => setHoveredLabel(inst.name)}
                  onHoverEnd={() => setHoveredLabel((prev) => (prev === inst.name ? null : prev))}
                />
                {hoveredLabel === inst.name && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[1200] pointer-events-none">
                    <div className="bg-gray-900 text-white text-[11px] px-2.5 py-1.5 rounded-lg shadow-xl whitespace-nowrap">
                      {inst.name}
                    </div>
                  </div>
                )}
                {clickedMarkerId === inst.id && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[1300] w-56 pointer-events-auto">
                    <div className={`rounded-xl shadow-xl p-3 ${inst.isUH ? 'bg-gradient-to-br from-cyan-600 to-blue-700' : 'bg-gray-900'}`}>
                      <button
                        onClick={(e) => { e.stopPropagation(); setClickedMarkerId(null); }}
                        className="absolute top-2 right-2 text-white/60 hover:text-white"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                      <div className="flex items-center gap-2 mb-2 pr-4">
                        <Building2 className="h-5 w-5 text-white flex-shrink-0" />
                        <p className="text-sm font-semibold text-white leading-tight">{inst.name}</p>
                      </div>
                      <p className={`text-xs mb-1 ${inst.isUH ? 'text-cyan-100' : 'text-gray-300'}`}>
                        {inst.collaboratorCount} collaborators
                      </p>
                      {(projectsByInstitution.get(inst.name)?.length ?? 0) > 0 && (
                        <div className={`mt-2 pt-2 border-t ${inst.isUH ? 'border-cyan-400/50' : 'border-white/20'}`}>
                          <p className={`text-[10px] uppercase tracking-wide font-semibold mb-1 ${inst.isUH ? 'text-cyan-100' : 'text-gray-300'}`}>
                            Projects at institution
                          </p>
                          <div className="space-y-1">
                            {(projectsByInstitution.get(inst.name) ?? []).slice(0, 3).map((project) => (
                              <button
                                key={project.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/project/${project.id}`);
                                }}
                                className={`w-full text-left text-[11px] px-2 py-1 rounded transition-colors ${
                                  inst.isUH
                                    ? 'bg-cyan-500/20 text-white hover:bg-cyan-400/30'
                                    : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                              >
                                {project.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {inst.isUH && (
                        <p className="text-[10px] font-semibold text-cyan-200 border-t border-cyan-400/50 pt-1.5 mt-1.5">
                          ★ UH Network Hospital
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Marker>
          ))}

          {/* Project Markers */}
          {showProjects && filteredProjects
            .filter((project) => clickedMarkerId !== project.id)
            .map((project) => (
            <Marker
              key={project.id}
              anchor={[project.location.lat, project.location.lng]}
              offset={[14, 14]}
              onClick={() => setClickedMarkerId(prev => prev === project.id ? null : project.id)}
            >
              <div
                className="relative"
                onMouseEnter={() => setHoveredLabel(project.name)}
                onMouseLeave={() => setHoveredLabel(null)}
              >
                <div className={`w-7 h-7 rounded-lg border-2 border-white shadow-lg flex items-center justify-center cursor-pointer transition-transform hover:scale-110 ${
                  clickedMarkerId === project.id ? 'ring-2 ring-green-500' : ''
                } bg-gradient-to-br from-green-500 to-teal-600`}>
                  <span className="text-white text-[9px] font-bold leading-none">
                    {project.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                {hoveredLabel === project.name && clickedMarkerId !== project.id && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[1200] pointer-events-none">
                    <div className="bg-gray-900 text-white text-[11px] px-2.5 py-1.5 rounded-lg shadow-xl whitespace-nowrap">
                      {project.name}
                    </div>
                  </div>
                )}
                {clickedMarkerId === project.id && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[1300] w-52 pointer-events-auto">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); setClickedMarkerId(null); }}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                      <div className="flex items-center gap-2 mb-2 pr-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {project.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-900 truncate">{project.name}</p>
                          <p className="text-[10px] text-gray-500 truncate">{project.lab}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="px-1.5 py-0.5 text-[10px] bg-gray-100 text-gray-600 rounded">{project.status}</span>
                        <span className={`px-1.5 py-0.5 text-[10px] rounded font-semibold ${
                          project.matchPercentage > 70 ? 'bg-green-100 text-green-700' :
                          project.matchPercentage > 50 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>{project.matchPercentage}% match</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2.5">
                        {project.tags.slice(0, 2).map((t, i) => (
                          <span key={i} className="px-1.5 py-0.5 text-[10px] bg-green-50 text-green-700 border border-green-200 rounded">{t}</span>
                        ))}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/project/${project.id}`); }}
                        className="block w-full text-center px-3 py-1.5 bg-gray-900 text-white text-[11px] font-medium rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        View Project →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Marker>
          ))}
          {showProjects && filteredProjects
            .filter((project) => clickedMarkerId === project.id)
            .map((project) => (
            <Marker
              key={`selected-${project.id}`}
              anchor={[project.location.lat, project.location.lng]}
              offset={[14, 14]}
              onClick={() => setClickedMarkerId(prev => prev === project.id ? null : project.id)}
            >
              <div className="relative">
                <div className="w-7 h-7 rounded-lg border-2 border-white shadow-lg flex items-center justify-center cursor-pointer transition-transform hover:scale-110 ring-2 ring-green-500 bg-gradient-to-br from-green-500 to-teal-600">
                  <span className="text-white text-[9px] font-bold leading-none">
                    {project.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[1300] w-52 pointer-events-auto">
                  <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); setClickedMarkerId(null); }}
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <div className="flex items-center gap-2 mb-2 pr-4">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {project.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">{project.name}</p>
                        <p className="text-[10px] text-gray-500 truncate">{project.lab}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="px-1.5 py-0.5 text-[10px] bg-gray-100 text-gray-600 rounded">{project.status}</span>
                      <span className={`px-1.5 py-0.5 text-[10px] rounded font-semibold ${
                        project.matchPercentage > 70 ? 'bg-green-100 text-green-700' :
                        project.matchPercentage > 50 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>{project.matchPercentage}% match</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2.5">
                      {project.tags.slice(0, 2).map((t, i) => (
                        <span key={i} className="px-1.5 py-0.5 text-[10px] bg-green-50 text-green-700 border border-green-200 rounded">{t}</span>
                      ))}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/project/${project.id}`); }}
                      className="block w-full text-center px-3 py-1.5 bg-gray-900 text-white text-[11px] font-medium rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      View Project →
                    </button>
                  </div>
                </div>
              </div>
            </Marker>
          ))}

          {/* Collaborator Markers */}
          {showCollaborators && displayedCollaborators
            .filter((collab) => clickedMarkerId !== collab.id)
            .map((collab) => {
            const color = collab.role === 'doctor' ? '#3b82f6' : 
                         collab.role === 'designer' ? '#a855f7' : '#f97316';
            const size = collab.matchScore > 70 ? 20 : 16;

            return (
              <Marker
                key={collab.id}
                anchor={[collab.location.lat, collab.location.lng]}
                offset={[size / 2, size / 2]}
                onClick={() => setClickedMarkerId(prev => prev === collab.id ? null : collab.id)}
              >
                <div
                  className="relative"
                >
                  <CustomMarker
                    color={color}
                    size={size}
                    isSelected={clickedMarkerId === collab.id}
                    hoverLabel={collab.name}
                    onHoverStart={() => setHoveredLabel(collab.name)}
                    onHoverEnd={() => setHoveredLabel((prev) => (prev === collab.name ? null : prev))}
                  />
                  {hoveredLabel === collab.name && clickedMarkerId !== collab.id && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[1200] pointer-events-none">
                      <div className="bg-gray-900 text-white text-[11px] px-2.5 py-1.5 rounded-lg shadow-xl whitespace-nowrap">
                        {collab.name}
                      </div>
                    </div>
                  )}
                  {clickedMarkerId === collab.id && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[1300] w-52 pointer-events-auto">
                      <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); setClickedMarkerId(null); }}
                          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                        <div className="flex items-center gap-2 mb-2 pr-4">
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getRoleColor(collab.role)} flex items-center justify-center text-white text-xs font-semibold flex-shrink-0`}>
                            {collab.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-gray-900 truncate">{collab.name}</p>
                            <p className="text-[10px] text-gray-500 truncate">{collab.title}</p>
                          </div>
                        </div>
                        <p className="text-[10px] text-gray-500 mb-2">{collab.institution}</p>
                        <div className="flex items-center gap-1.5 mb-2.5">
                          <span className={`px-1.5 py-0.5 text-[10px] rounded-full font-semibold border ${getRoleBadgeColor(collab.role)}`}>
                            {collab.role.charAt(0).toUpperCase() + collab.role.slice(1)}
                          </span>
                          <span className={`px-1.5 py-0.5 text-[10px] rounded font-semibold ${
                            collab.matchScore > 70 ? 'bg-green-100 text-green-700' :
                            collab.matchScore > 50 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>{collab.matchScore}% match</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewCollaboratorProfile(collab);
                          }}
                          className="block w-full text-center px-3 py-1.5 bg-gray-900 text-white text-[11px] font-medium rounded-lg hover:bg-gray-800 transition-colors"
                        >
                          View Full Profile →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </Marker>
            );
          })}
          {showCollaborators && displayedCollaborators
            .filter((collab) => clickedMarkerId === collab.id)
            .map((collab) => {
            const color = collab.role === 'doctor' ? '#3b82f6' :
                         collab.role === 'designer' ? '#a855f7' : '#f97316';
            const size = collab.matchScore > 70 ? 20 : 16;

            return (
              <Marker
                key={`selected-${collab.id}`}
                anchor={[collab.location.lat, collab.location.lng]}
                offset={[size / 2, size / 2]}
                onClick={() => setClickedMarkerId(prev => prev === collab.id ? null : collab.id)}
              >
                <div className="relative">
                  <CustomMarker
                    color={color}
                    size={size}
                    isSelected={true}
                  />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[1300] w-52 pointer-events-auto">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); setClickedMarkerId(null); }}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                      <div className="flex items-center gap-2 mb-2 pr-4">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getRoleColor(collab.role)} flex items-center justify-center text-white text-xs font-semibold flex-shrink-0`}>
                          {collab.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-900 truncate">{collab.name}</p>
                          <p className="text-[10px] text-gray-500 truncate">{collab.title}</p>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-500 mb-2">{collab.institution}</p>
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <span className={`px-1.5 py-0.5 text-[10px] rounded-full font-semibold border ${getRoleBadgeColor(collab.role)}`}>
                          {collab.role.charAt(0).toUpperCase() + collab.role.slice(1)}
                        </span>
                        <span className={`px-1.5 py-0.5 text-[10px] rounded font-semibold ${
                          collab.matchScore > 70 ? 'bg-green-100 text-green-700' :
                          collab.matchScore > 50 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>{collab.matchScore}% match</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewCollaboratorProfile(collab);
                        }}
                        className="block w-full text-center px-3 py-1.5 bg-gray-900 text-white text-[11px] font-medium rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        View Full Profile →
                      </button>
                    </div>
                  </div>
                </div>
              </Marker>
            );
          })}

          {/* User Location Marker */}
          <Marker
            anchor={userLocation as [number, number]}
            offset={[0, 0]}
          >
            <div 
              className="relative"
              style={{ 
                width: '48px', 
                height: '48px',
                marginLeft: '-24px',
                marginTop: '-24px'
              }}
              onMouseEnter={() => setHoveredMarker('user-location')}
              onMouseLeave={() => setHoveredMarker(null)}
            >
              {/* Outer pulsing circle */}
              <div className="absolute inset-0 rounded-full bg-gray-600 opacity-20 blur-md animate-pulse" />
              {/* Middle circle */}
              <div className="absolute rounded-full bg-gray-500 opacity-25" 
                style={{ 
                  width: '36px', 
                  height: '36px',
                  left: '6px', 
                  top: '6px' 
                }} 
              />
              {/* Main marker */}
              <div className="absolute rounded-full bg-gray-900 border-2 border-white shadow-2xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                style={{ 
                  width: '32px', 
                  height: '32px',
                  left: '8px', 
                  top: '8px' 
                }}
              >
                <Navigation className="h-4 w-4 text-white" style={{ transform: 'rotate(45deg)' }} />
                {/* Center dot */}
                <div className="absolute w-2 h-2 bg-white rounded-full" />
              </div>
              {/* Tooltip */}
              {hoveredMarker === 'user-location' && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none z-50">
                  <div className="bg-gray-900 text-white text-xs px-4 py-3 rounded-lg shadow-2xl whitespace-nowrap">
                    <div className="font-semibold text-sm">Your Location</div>
                    <div className="text-gray-300">
                      Center of search area
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Marker>

          {/* Search Radius Circle Overlay */}
          <Overlay anchor={userLocation} offset={[0, 0]}>
            <div
              className="rounded-full border-2 border-blue-400 bg-blue-200 opacity-20 pointer-events-none"
              style={{
                width: `${radiusFilter * pixelsPerMile * 2}px`,
                height: `${radiusFilter * pixelsPerMile * 2}px`,
                marginLeft: `-${radiusFilter * pixelsPerMile}px`,
                marginTop: `-${radiusFilter * pixelsPerMile}px`,
              }}
            />
          </Overlay>
        </PigeonMap>

      </div>

      {/* Edit Criteria Panel */}
      <AnimatePresence>
        {showEditCriteria && (
          <EditCriteriaPanel
            onClose={() => setShowEditCriteria(false)}
            currentCriteria={currentIntakeData}
            onSave={(updatedCriteria) => {
              setCurrentIntakeData(updatedCriteria);
              setAppliedFilters({
                ...appliedFilters,
                areaOfInterest: updatedCriteria.topicArea
              });
            }}
          />
        )}
      </AnimatePresence>

      {/* Private profile modal */}
      <AnimatePresence>
        {privateProfileName && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000]"
              onClick={() => setPrivateProfileName(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              className="fixed inset-0 z-[2001] flex items-center justify-center p-4"
            >
              <div className="w-full max-w-sm bg-white border border-gray-200 rounded-xl shadow-2xl p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">Profile is private</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {privateProfileName}'s full profile is not publicly available right now.
                    </p>
                  </div>
                  <button
                    onClick={() => setPrivateProfileName(null)}
                    className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                    aria-label="Close private profile message"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setPrivateProfileName(null)}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Tag color maps ---
type TagColor = 'blue' | 'purple' | 'gray' | 'orange' | 'teal' | 'green' | 'rose';

const tagLabelColors: Record<TagColor, string> = {
  blue:   'text-blue-600',
  purple: 'text-purple-600',
  gray:   'text-gray-500',
  orange: 'text-orange-600',
  teal:   'text-teal-600',
  green:  'text-green-600',
  rose:   'text-rose-600',
};

const tagChipColors: Record<TagColor, string> = {
  blue:   'bg-blue-50 text-blue-700',
  purple: 'bg-purple-50 text-purple-700',
  gray:   'bg-gray-100 text-gray-700',
  orange: 'bg-orange-50 text-orange-700',
  teal:   'bg-teal-50 text-teal-700',
  green:  'bg-green-50 text-green-700',
  rose:   'bg-rose-50 text-rose-700',
};

// Compact row used inside result list cards
function CardTagRow({ label, color, values, max = 2 }: {
  label: string;
  color: TagColor;
  values: string[];
  max?: number;
}) {
  const shown = values.slice(0, max);
  const overflow = values.length - max;
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className={`text-[10px] font-semibold uppercase tracking-wide w-16 shrink-0 ${tagLabelColors[color]}`}>
        {label}
      </span>
      {shown.map((v, i) => (
        <span key={i} className={`px-1.5 py-0.5 text-[10px] rounded ${tagChipColors[color]}`}>
          {v}
        </span>
      ))}
      {overflow > 0 && (
        <span className="text-[10px] text-gray-400">+{overflow}</span>
      )}
    </div>
  );
}

// Full tag section used in the detail panel
function DetailTagSection({ label, color, values }: {
  label: string;
  color: TagColor;
  values: string[];
}) {
  return (
    <div>
      <p className={`text-[11px] font-semibold uppercase tracking-wide mb-1.5 ${tagLabelColors[color]}`}>
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {values.map((v, i) => (
          <span key={i} className={`px-2.5 py-1 text-xs rounded-md ${tagChipColors[color]}`}>
            {v}
          </span>
        ))}
      </div>
    </div>
  );
}