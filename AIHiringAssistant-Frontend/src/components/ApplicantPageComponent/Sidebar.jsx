import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const defaultFilters = {
  scoreRanges: [],
  topSkills: [],
  experience: null,
  educationLevel: "",
};

const ModalPortal = ({ children }) => {
  const [container] = useState(() => document.createElement("div"));

  useEffect(() => {
    document.body.appendChild(container);
    return () => {
      document.body.removeChild(container);
    };
  }, [container]);

  return createPortal(children, container);
};

const Sidebar = ({ filters, onFilterChange, onSearch, onClear }) => {
  const [showMoreSkills, setShowMoreSkills] = useState(false);
  const [modalSkills, setModalSkills] = useState(filters.topSkills);

  const allSkills = [
    "Java",
    "JavaScript",
    "SQL",
    "HTML5",
    "CSS3",
    "Spring Boot",
    "Spring Framework",
    "Spring Data JPA",
    "Microservices",
    "React.js",
    "Redux",
    "Next.js",
    "Angular (basic)",
    "MySQL",
    "MongoDB Atlas",
    "Git",
    "GitHub",
    "AWS (Basics)",
    "Application Deployment",
    "CI/CD Concepts",
  ];

  const handleScoreRangeChange = (range, checked) => {
    const newScoreRanges = checked
      ? [...filters.scoreRanges, range]
      : filters.scoreRanges.filter((r) => r !== range);
    onFilterChange({ ...filters, scoreRanges: newScoreRanges });
  };

  const handleSkillToggle = (skill) => {
    const newTopSkills = filters.topSkills.includes(skill)
      ? filters.topSkills.filter((s) => s !== skill)
      : [...filters.topSkills, skill];
    onFilterChange({ ...filters, topSkills: newTopSkills });
  };

  const openMoreSkills = () => {
    setModalSkills(filters.topSkills);
    setShowMoreSkills(true);
  };

  const toggleModalSkill = (skill) => {
    setModalSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  const applyModalSkills = () => {
    onFilterChange({ ...filters, topSkills: modalSkills });
    setShowMoreSkills(false);
  };

  const closeModal = () => {
    setShowMoreSkills(false);
  };

  const handleExperienceChange = (e) => {
    onFilterChange({
      ...filters,
      experience: parseInt(e.target.value) || null,
    });
  };

  const handleEducationChange = (level, checked) => {
    // Assuming educationLevel is a string, but for multiple, maybe array
    // For simplicity, set to the level if checked, else ""
    onFilterChange({ ...filters, educationLevel: checked ? level : "" });
  };

  return (
    <aside className="w-full lg:w-72 flex-shrink-0">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-24">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg">Filters</h3>
          <button
            className="text-brand-orange text-xs font-semibold hover:underline"
            onClick={onClear}
          >
            Clear All
          </button>
        </div>

        {/* Role Fit */}
        <div className="mb-8">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            Role Fit (AI Score)
          </label>

          <div className="space-y-2">
            <label className="flex items-center group cursor-pointer">
              <input
                type="checkbox"
                checked={filters.scoreRanges.includes("High (90%+)")}
                onChange={(e) =>
                  handleScoreRangeChange("High (90%+)", e.target.checked)
                }
                className="rounded text-brand-orange focus:ring-brand-orange border-gray-300 w-4 h-4"
              />
              <span className="ml-3 text-sm text-brand-gray group-hover:text-brand-dark">
                High (90%+)
              </span>
            </label>

            <label className="flex items-center group cursor-pointer">
              <input
                type="checkbox"
                checked={filters.scoreRanges.includes("Medium (70-90%)")}
                onChange={(e) =>
                  handleScoreRangeChange("Medium (70-90%)", e.target.checked)
                }
                className="rounded text-brand-orange focus:ring-brand-orange border-gray-300 w-4 h-4"
              />
              <span className="ml-3 text-sm text-brand-gray group-hover:text-brand-dark">
                Medium (70-90%)
              </span>
            </label>

            <label className="flex items-center group cursor-pointer">
              <input
                type="checkbox"
                checked={filters.scoreRanges.includes("Low (< 70%)")}
                onChange={(e) =>
                  handleScoreRangeChange("Low (< 70%)", e.target.checked)
                }
                className="rounded text-brand-orange focus:ring-brand-orange border-gray-300 w-4 h-4"
              />
              <span className="ml-3 text-sm text-brand-gray group-hover:text-brand-dark">
                Low (&lt; 70%)
              </span>
            </label>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-8">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            Top Skills
          </label>

          <div className="flex flex-wrap gap-2">
            {["Python", "PyTorch", "NLP", "TensorFlow", "MLOps"].map(
              (skill) => (
                <button
                  key={skill}
                  onClick={() => handleSkillToggle(skill)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    filters.topSkills.includes(skill)
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-gray-50 text-brand-gray border-gray-200 hover:border-brand-orange hover:text-brand-orange"
                  }`}
                >
                  {skill}
                </button>
              ),
            )}
            <button
              type="button"
              onClick={openMoreSkills}
              className="px-3 py-1 rounded-full text-xs font-medium border bg-gray-50 text-brand-gray border-gray-200 hover:border-brand-orange hover:text-brand-orange"
            >
              More
            </button>
          </div>

          {showMoreSkills && (
            <ModalPortal>
              <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 px-4">
                <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 relative flex flex-col max-h-[90vh]">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h3 className="text-lg font-bold">
                      Select Additional Skills
                    </h3>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="text-gray-500 hover:text-gray-700"
                      aria-label="Close"
                    >
                      ×
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto mb-5">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {allSkills.map((skill) => (
                        <button
                          type="button"
                          key={skill}
                          onClick={() => toggleModalSkill(skill)}
                          className={`px-3 py-2 rounded-full text-xs font-medium border ${
                            modalSkills.includes(skill)
                              ? "bg-orange-500 text-white border-orange-500"
                              : "bg-gray-50 text-brand-gray border-gray-200 hover:border-brand-orange hover:text-brand-orange"
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="sticky bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm py-3 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-brand-gray hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={applyModalSkills}
                      className="px-4 py-2 rounded-lg bg-brand-dark text-white bg-orange-500 text-sm font-semibold hover:bg-orange-700"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </ModalPortal>
          )}
        </div> 

        {/* Experience */}
        <div className="mb-8">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            Experience
          </label>

          <input
            type="range"
            min="0"
            max="10"
            value={filters.experience || 0}
            onChange={handleExperienceChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-orange"
          />

          <div className="flex justify-between mt-2 text-[10px] text-brand-gray font-bold">
            <span>0 Yrs</span>
            <span>{filters.experience || 0} Yrs</span>
            <span>10+ Yrs</span>
          </div>
        </div>

        {/* Education */}
        
        {/* <div className="mb-8">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            Education
          </label>

          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.educationLevel === "PhD Candidates"}
                onChange={(e) =>
                  handleEducationChange("PhD Candidates", e.target.checked)
                }
                className="rounded text-brand-orange focus:ring-brand-orange border-gray-300 w-4 h-4"
              />
              <span className="ml-3 text-sm text-brand-gray">
                PhD Candidates
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.educationLevel === "Masters Degree"}
                onChange={(e) =>
                  handleEducationChange("Masters Degree", e.target.checked)
                }
                className="rounded text-brand-orange focus:ring-brand-orange border-gray-300 w-4 h-4"
              />
              <span className="ml-3 text-sm text-brand-gray">
                Masters Degree
              </span>
            </label>
          </div>
        </div> */}
        

        <button
          onClick={onSearch}
          className="w-full bg-brand-dark bg-orange-500 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-orange-700 transition-colors"
        >
          Search
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
