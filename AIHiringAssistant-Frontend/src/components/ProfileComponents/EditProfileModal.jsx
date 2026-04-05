import React, { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "react-toastify";
import { updateProfileApi } from "../../api/user.api";
export const EditProfileModal = ({ isOpen, onClose, profile, onSave }) => {
  // helper to extract integer from various formats
  const normalizeExperience = (val) => {
    if (val == null || val === "") return "";
    const n = parseInt(val, 10);
    return isNaN(n) ? "" : n;
  };

  const [formData, setFormData] = useState({
    totalExperience: normalizeExperience(profile?.totalExperience),
    role: profile?.role || "",
    summary: profile?.summary || "",
    // removed: skills, highestEducation, certifications
    availability: profile?.availability || "",
    expectedCTC: profile?.expectedCTC || "",
  });

  const [isSaving, setIsSaving] = useState(false);

  // keep form in sync when profile updates or modal reopens
  React.useEffect(() => {
    if (isOpen && profile) {
      setFormData({
        totalExperience: normalizeExperience(profile?.totalExperience),
        role: profile?.role || "",
        summary: profile?.summary || "",
        // removed: skills, highestEducation, certifications
        availability: profile?.availability || "",
        expectedCTC: profile?.expectedCTC || "",
      });
    }
  }, [isOpen, profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    // build payload expected by backend
    const payload = {
      totalExperience: parseInt(formData.totalExperience, 10) || 0,
      currentRole: formData.role,
      availability: formData.availability,
      expectedCTC: formData.expectedCTC,
      summary: formData.summary,
    };

    try {
      const res = await updateProfileApi(payload);
      const respData = res.data || {};
      const updated = respData.data || respData;

      // backend returns currentRole; map to role
      if (updated) {
        const mapped = {
          ...updated,
          role: updated.currentRole || updated.role,
          totalExperience: normalizeExperience(updated.totalExperience),
        };
        onSave(mapped);
      }

      // toast.success(respData.message || "Profile updated successfully");
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 transition-opacity bg-slate-900/50"
              // className="fixed inset-0 bg-black/40 backdrop-blur-md z-40"
              onClick={onClose}
            />

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
              &#8203;
            </span>

            {/* stop propagation on content to avoid closing when clicking inside */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-2xl shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900">
                  Edit Professional Details
                </h3>
                <button
                  className="text-slate-400 hover:text-slate-600"
                  onClick={onClose}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Current Role */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Current Role
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full border-slate-200 rounded-lg focus:ring-[#f26522] focus:border-[#f26522] text-sm"
                  />
                </div>

                {/* Total Experience */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Total Experience (years)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={formData.totalExperience}
                    onChange={(e) => {
                      const val = e.target.value;
                      // allow empty or whole numbers only
                      if (val === "" || /^[0-9]+$/.test(val)) {
                        setFormData({
                          ...formData,
                          totalExperience: val,
                        });
                      }
                    }}
                    className="w-full border-slate-200 rounded-lg focus:ring-[#f26522] focus:border-[#f26522] text-sm"
                  />
                </div>

                {/* Summary */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Summary
                  </label>
                  <textarea
                    rows={4}
                    value={formData.summary}
                    onChange={(e) =>
                      setFormData({ ...formData, summary: e.target.value })
                    }
                    className="w-full border-slate-200 rounded-lg focus:ring-[#f26522] focus:border-[#f26522] text-sm"
                  />
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Availability
                  </label>
                  <input
                    type="text"
                    value={formData.availability}
                    onChange={(e) =>
                      setFormData({ ...formData, availability: e.target.value })
                    }
                    className="w-full border-slate-200 rounded-lg focus:ring-[#f26522] focus:border-[#f26522] text-sm"
                  />
                </div>

                {/* Expected CTC */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Expected CTC
                  </label>
                  <input
                    type="text"
                    value={formData.expectedCTC}
                    onChange={(e) =>
                      setFormData({ ...formData, expectedCTC: e.target.value })
                    }
                    className="w-full border-slate-200 rounded-lg focus:ring-[#f26522] focus:border-[#f26522] text-sm"
                  />
                </div>

                {/* removed: Skills, Highest Education, Certifications fields */}

                {/* Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 bg-[#f26522] text-white rounded-lg text-sm font-bold hover:bg-orange-600 shadow-md transition-all disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
