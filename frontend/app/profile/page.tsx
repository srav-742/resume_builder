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
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

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
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            <p className="text-sm text-gray-500 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 relative font-sans text-gray-900">
      
      {/* HEADER NAVIGATION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-between items-center">
        <button
          onClick={handleGoBack}
          className="group flex items-center text-gray-500 hover:text-indigo-600 transition-colors text-sm font-medium"
        >
          <div className="bg-white p-1.5 rounded-md shadow-sm border border-gray-200 group-hover:border-indigo-200 group-hover:shadow transition-all mr-2.5">
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
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white rounded-2xl shadow-lg ring-1 ring-gray-900/5 overflow-hidden">
          
          {/* CARD HEADER */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-10 relative overflow-hidden">
             {/* Abstract Pattern overlay */}
             <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-5"></div>
             <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-40 h-40 rounded-full bg-white opacity-5"></div>
             
            <h1 className="text-3xl font-bold text-white tracking-tight relative z-10">Profile Settings</h1>
            <p className="text-slate-300 mt-2 text-sm max-w-xl relative z-10">Manage your personal information, update your contact details, and view your generated resume templates.</p>
          </div>

          <div className="p-8 lg:p-12">
            {/* ALERTS */}
            {error && (
              <div className="mb-8 rounded-lg bg-red-50 p-4 border-l-4 border-red-500">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">{error}</div>
                  </div>
                </div>
              </div>
            )}
            
            {success && (
              <div className="mb-8 rounded-lg bg-green-50 p-4 border-l-4 border-green-500">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">{success}</p>
                  </div>
                </div>
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 lg:gap-x-12">
              
              {/* LEFT COLUMN: Profile Picture */}
              <div className="lg:col-span-4">
                 <div className="flex flex-col items-center">
                    <div className="relative group cursor-pointer">
                    <div className="w-40 h-40 rounded-full overflow-hidden shadow-lg ring-4 ring-white border border-gray-100 bg-gray-50 relative">
                        {formData.profilePicture ? (
                        <img src={formData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <svg className="h-20 w-20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        )}
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 rounded-full bg-slate-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm">
                        <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" title="Change Profile Picture" />
                    </div>
                    
                    <div className="mt-4 text-center">
                    <h3 className="text-lg font-bold text-gray-900">{formData.name || 'User Name'}</h3>
                    <p className="text-sm text-gray-500">{formData.email}</p>
                    <button type="button" onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()} className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-500 hover:underline">
                        Replace Photo
                    </button>
                    </div>
                 </div>

                 {/* Divider for mobile */}
                 <div className="lg:hidden w-full h-px bg-gray-200 my-8"></div>
              </div>

              {/* RIGHT COLUMN: Fields */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* Section: Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Full Name</label>
                    <div className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-500 text-sm shadow-sm select-none">
                       {formData.name}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Email Address</label>
                    <div className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-500 text-sm shadow-sm select-none">
                       {formData.email}
                    </div>
                  </div>
                </div>

                <div className="w-full h-px bg-gray-100"></div>

                {/* Section: Editable Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth</label>
                    <input 
                        type="date" 
                        name="dateOfBirth" 
                        value={formData.dateOfBirth} 
                        onChange={handleChange} 
                        className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile Number</label>
                    <input 
                        type="tel" 
                        name="mobile" 
                        value={formData.mobile} 
                        onChange={handleChange} 
                        placeholder="+1 (555) 000-0000" 
                        className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Residential Address</label>
                  <textarea 
                    name="address" 
                    value={formData.address} 
                    onChange={handleChange} 
                    rows={3} 
                    placeholder="Street, City, Zip Code" 
                    className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all resize-y" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
                  <div className="relative">
                    <select 
                        name="gender" 
                        value={formData.gender} 
                        onChange={handleChange} 
                        className="block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 appearance-none"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                {/* ACTIONS FOOTER */}
                <div className="pt-8 mt-4 border-t border-gray-100 flex flex-col md:flex-row md:items-start justify-between gap-6">
                  
                  {/* Saved Resumes Section */}
                  <div className="flex flex-col gap-3 flex-1">
                    <div className="flex items-center gap-2">
                         <span className="text-sm font-semibold text-gray-900">Your Saved Resumes</span>
                         <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full border border-indigo-100">{savedResumes.length}</span>
                    </div>

                    {savedResumes.length > 0 ? (() => {
                      const uniqueTemplates = Array.from(
                        new Set(savedResumes.map(r => r.template))
                      ).sort();

                      return (
                        <div className="flex flex-wrap gap-2">
                          {uniqueTemplates.map(templateKey => {
                            const sampleResume = savedResumes.find(r => r.template === templateKey);
                            return (
                              <button
                                key={templateKey}
                                type="button"
                                onClick={() => sampleResume && setSelectedResumeId(sampleResume._id)}
                                className="group relative inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                              >
                                <svg className="w-4 h-4 text-gray-400 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
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
                      <p className="text-sm text-gray-400 italic">No resumes created yet.</p>
                    )}
                  </div>

                  {/* Save Button */}
                  <div className="flex-shrink-0">
                    <button type="submit" className="w-full md:w-auto px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-md hover:bg-indigo-700 active:bg-indigo-800 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {/* Resume Preview Modal */}
            {selectedResumeId && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedResumeId(null)}></div>
                <div className="bg-white w-full max-w-6xl h-[90vh] rounded-xl shadow-2xl relative flex flex-col overflow-hidden ring-1 ring-white/10">
                  
                  {/* Modal Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-800">Resume Preview</h3>
                    <div className="flex items-center gap-2">
                      {/* Add Edit Button in Modal Header ONLY */}
                      <button
                        onClick={() => {
                          const resume = savedResumes.find(r => r._id === selectedResumeId);
                          if (resume) {
                            // ✅ Pass both resumeId AND template
                            handleEditResume(resume._id, resume.template);
                          }
                        }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100 hover:border-indigo-300 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                      >
                        <svg className="w-3 h-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Resume
                      </button>
                      <button onClick={() => setSelectedResumeId(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* Modal Content */}
                  <div className="flex-1 overflow-y-auto p-8 bg-gray-100/50">
                    <div className="max-w-4xl mx-auto shadow-lg">
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