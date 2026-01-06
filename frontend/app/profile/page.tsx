'use client';

import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'next/navigation';

// ✅ Import ALL your templates
import ResumeTemplate1 from '@/components/resume-templates/template1';
import ResumeTemplate2 from '@/components/resume-templates/template2';
import ResumeTemplate3 from '@/components/resume-templates/template3';
import ResumeTemplate4 from '@/components/resume-templates/template4';
import ResumeTemplate5 from '@/components/resume-templates/template5';
import ResumeTemplate6 from '@/components/resume-templates/template6';

// Types
interface ResumeData {
  personalInfo: any;
  workExperience: any[];
  education: any[];
  skills: string[];
  projects: any[];
  additionalSections: any[];
}

interface SavedResume {
  _id: string;
  template: string;
  personalInfo: any;
  workExperience: any[];
  education: any[];
  skills: string[];
  projects: any[];
  additionalSections: any[];
}

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    mobile: '',
    address: '',
    gender: '',
    profilePicture: '',
  });

  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null); // For Preview/Edit
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const router = useRouter();
  const auth = getAuth();
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://resume-builder-2gji.onrender.com';

  useEffect(() => {
    const fetchAllData = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push('/login');
        return;
      }
      try {
        const idToken = await user.getIdToken();

        // Fetch profile data
        const profileRes = await fetch(`${BACKEND_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (!profileRes.ok) throw new Error('Failed to load profile');
        const profileData = await profileRes.json();
        setFormData({
          name: profileData.name,
          email: profileData.email,
          dateOfBirth: profileData.dateOfBirth || '',
          mobile: profileData.mobile || '',
          address: profileData.address || '',
          gender: profileData.gender || '',
          profilePicture: profileData.profilePicture || '',
        });

        // Fetch all saved resumes for this user
        const resumesRes = await fetch(`${BACKEND_URL}/api/resume`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (!resumesRes.ok) throw new Error('Failed to load resumes');
        const { resumes } = await resumesRes.json();
        setSavedResumes(resumes || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [auth, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, profilePicture: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');
      const idToken = await user.getIdToken();

      const response = await fetch(`${BACKEND_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          dateOfBirth: formData.dateOfBirth,
          mobile: formData.mobile,
          address: formData.address,
          gender: formData.gender,
          profilePicture: formData.profilePicture,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      setSuccess(result.message || 'Profile saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
    }
  };

  const handleGoBack = () => router.back();

  // Template mapping
  const templateMap: Record<string, React.ComponentType<{ data: ResumeData }>> = {
    template1: ResumeTemplate1,
    template2: ResumeTemplate2,
    template3: ResumeTemplate3,
    template4: ResumeTemplate4,
    template5: ResumeTemplate5,
    template6: ResumeTemplate6,
  };

  // Function to navigate to the edit page for a specific resume
  const handleEditResume = (resumeId: string, template: string) => {
    // ✅ CORRECTED PATH: Navigate to /builder/personal-info with resumeId AND template
    router.push(`/builder/personal-info?resumeId=${encodeURIComponent(resumeId)}&template=${encodeURIComponent(template)}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 shadow-lg"></div>
          <p className="text-sm text-slate-500 font-medium tracking-wide animate-pulse">LOADING PROFILE...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-500/30 pb-20">

      {/* DECORATIVE BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-[100px]" />
      </div>

      {/* HEADER NAVIGATION */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-between items-center">
        <button
          onClick={handleGoBack}
          className="group flex items-center text-slate-500 hover:text-indigo-600 transition-colors text-sm font-semibold"
        >
          <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 group-hover:border-indigo-200 group-hover:shadow-md group-hover:-translate-x-1 transition-all duration-300 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          Back to Dashboard
        </button>
      </div>

      {/* MAIN CONTENT */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 ring-1 ring-slate-900/5 overflow-hidden">

          {/* CARD HEADER */}
          <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-black px-8 py-12 lg:px-12 relative overflow-hidden">
            {/* Abstract Pattern overlay */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 rounded-full bg-white/5 blur-2xl"></div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

            <div className="relative z-10">
              <h1 className="text-4xl font-bold text-white tracking-tight">Profile Settings</h1>
              <p className="text-indigo-200 mt-3 text-base max-w-xl font-light">
                Manage your personal information, update your contact details, and access your saved resume drafts in one place.
              </p>
            </div>
          </div>

          <div className="p-8 lg:p-12">
            {/* ALERTS */}
            {error && (
              <div className="mb-8 rounded-xl bg-red-50 p-4 border border-red-100 flex items-start gap-3 animate-fadeIn">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <svg className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-red-800">Error Saving Profile</h3>
                  <div className="mt-1 text-sm text-red-600">{error}</div>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-8 rounded-xl bg-emerald-50 p-4 border border-emerald-100 flex items-start gap-3 animate-fadeIn">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <svg className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-800">Success</p>
                  <p className="text-sm text-emerald-600">{success}</p>
                </div>
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-x-16">

              {/* LEFT COLUMN: Profile Picture */}
              <div className="lg:col-span-4">
                <div className="flex flex-col items-center sticky top-8">
                  <div className="relative group cursor-pointer">
                    <div className="w-48 h-48 rounded-full overflow-hidden shadow-2xl ring-4 ring-white ring-offset-4 ring-offset-slate-50 border border-slate-100 bg-slate-50 relative transition-transform duration-300 group-hover:scale-105">
                      {formData.profilePicture ? (
                        <img src={formData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                          <svg className="h-24 w-24" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 rounded-full bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                      <div className="bg-white/20 p-3 rounded-full backdrop-blur-md border border-white/30">
                        <svg className="h-8 w-8 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" title="Change Profile Picture" />
                  </div>

                  <div className="mt-6 text-center space-y-1">
                    <h3 className="text-xl font-bold text-slate-900">{formData.name || 'User Name'}</h3>
                    <p className="text-sm font-medium text-indigo-500">{formData.email}</p>

                    <button type="button" onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()} className="mt-4 inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-xs font-bold uppercase tracking-wide hover:bg-slate-200 transition-colors">
                      Change Photo
                    </button>
                  </div>
                </div>

                {/* Divider for mobile */}
                <div className="lg:hidden w-full h-px bg-slate-100 my-10"></div>
              </div>

              {/* RIGHT COLUMN: Fields */}
              <div className="lg:col-span-8 space-y-10">

                {/* Section: Basic Info */}
                <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 space-y-6">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    Account Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Full Name</label>
                      <div className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-600 text-sm shadow-sm flex items-center gap-3 select-none cursor-not-allowed">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        {formData.name}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Email Address</label>
                      <div className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-600 text-sm shadow-sm flex items-center gap-3 select-none cursor-not-allowed">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        {formData.email}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Editable Details */}
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 px-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Personal Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-medium text-slate-700 mb-2 group-focus-within:text-indigo-600 transition-colors">Date of Birth</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="block w-full rounded-xl border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 sm:text-sm"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-medium text-slate-700 mb-2 group-focus-within:text-indigo-600 transition-colors">Mobile Number</label>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
                        className="block w-full rounded-xl border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-slate-700 mb-2 group-focus-within:text-indigo-600 transition-colors">Residential Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Street, City, Zip Code"
                      className="block w-full rounded-xl border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 sm:text-sm resize-y"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-slate-700 mb-2 group-focus-within:text-indigo-600 transition-colors">Gender</label>
                    <div className="relative">
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="block w-full rounded-xl border-slate-200 bg-slate-50/50 px-4 py-3 pl-4 pr-10 text-slate-900 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 sm:text-sm appearance-none cursor-pointer"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ACTIONS FOOTER */}
                <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row md:items-start justify-between gap-8">

                  {/* Saved Resumes Section */}
                  <div className="flex flex-col gap-4 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">Your Saved Resumes</span>
                      <span className="bg-indigo-50 text-indigo-700 text-xs font-extrabold px-2.5 py-0.5 rounded-md border border-indigo-100 shadow-sm">{savedResumes.length}</span>
                    </div>

                    {savedResumes.length > 0 ? (() => {
                      const uniqueTemplates = Array.from(
                        new Set(savedResumes.map(r => r.template))
                      ).sort();

                      return (
                        <div className="flex flex-wrap gap-3">
                          {uniqueTemplates.map(templateKey => {
                            const sampleResume = savedResumes.find(r => r.template === templateKey);
                            return (
                              <button
                                key={templateKey}
                                type="button"
                                onClick={() => sampleResume && setSelectedResumeId(sampleResume._id)}
                                className="group relative inline-flex items-center justify-center gap-2.5 px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-white hover:border-indigo-300 hover:text-indigo-600 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                              >
                                <span className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-indigo-500 transition-colors"></span>
                                <span>
                                  {templateKey === 'template1' ? 'Template 1' :
                                    templateKey === 'template2' ? 'Template 2' :
                                      templateKey === 'template3' ? 'Template 3' :
                                        templateKey === 'template4' ? 'Template 4' :
                                          templateKey === 'template5' ? 'Template 5' :
                                            templateKey === 'template6' ? 'Template 6' :
                                              templateKey}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      );
                    })() : (
                      <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center">
                        <p className="text-sm text-slate-400 italic">No resumes created yet.</p>
                      </div>
                    )}
                  </div>

                  {/* Save Button */}
                  <div className="flex-shrink-0 md:self-end">
                    <button type="submit" className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-sm font-bold tracking-wide rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 hover:to-indigo-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2 focus:ring-4 focus:ring-indigo-500/30">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                      Save Profile
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {/* Resume Preview Modal */}
            {selectedResumeId && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setSelectedResumeId(null)}></div>
                <div className="bg-white w-full max-w-7xl h-[90vh] rounded-2xl shadow-2xl relative flex flex-col overflow-hidden ring-1 ring-white/20 animate-scaleIn">

                  {/* Modal Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white z-10">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 rounded-lg">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">Resume Preview</h3>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Add Edit Button in Modal Header ONLY */}
                      <button
                        onClick={() => {
                          const resume = savedResumes.find(r => r._id === selectedResumeId);
                          if (resume) {
                            // ✅ Pass both resumeId AND template
                            handleEditResume(resume._id, resume.template);
                          }
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 hover:shadow-md transition-all active:scale-95"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Edit Resume
                      </button>

                      <div className="w-px h-6 bg-slate-200 mx-1"></div>

                      <button onClick={() => setSelectedResumeId(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Modal Content */}
                  <div className="flex-1 overflow-y-auto p-8 bg-slate-100/80">
                    <div className="max-w-[210mm] mx-auto bg-white shadow-xl shadow-slate-200/60 transition-transform">
                      {(() => {
                        const resume = savedResumes.find(r => r._id === selectedResumeId);
                        if (!resume) return null;
                        const TemplateComp = templateMap[resume.template];
                        return <TemplateComp data={resume as ResumeData} />;
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}