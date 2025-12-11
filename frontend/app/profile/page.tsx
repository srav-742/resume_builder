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
  template: string; // e.g., "template1"
  personalInfo: any;
  workExperience: any[];
  education: any[];
  skills: string[];
  projects: any[];
  additionalSections: any[];
}

export default function ProfilePage() {
  // ✅ Keep your existing profile form state (unchanged)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    mobile: '',
    address: '',
    gender: '',
    profilePicture: '',
  });

  // ✅ NEW: State for ALL saved resumes
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);

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

        // ✅ 1. Fetch basic profile (unchanged)
        const profileRes = await fetch(`${BACKEND_URL}/api/profile`, {
          headers: { 'Authorization': `Bearer ${idToken}` },
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

        // ✅ 2. Fetch ALL saved resumes (NEW)
        const resumesRes = await fetch(`${BACKEND_URL}/api/resume`, {
          headers: { 'Authorization': `Bearer ${idToken}` },
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

  // ✅ Keep your existing handlers (handleChange, handleImageUpload, handleSubmit) — no changes needed below

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
          'Authorization': `Bearer ${idToken}`,
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
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
      </div>
    );
  }

  // ✅ Template mapping for previews
  const templateMap: Record<string, React.ComponentType<{ data: ResumeData }>> = {
    template1: ResumeTemplate1,
    template2: ResumeTemplate2,
    template3: ResumeTemplate3,
    template4: ResumeTemplate4,
    template5: ResumeTemplate5,
    template6: ResumeTemplate6,
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">User Profile</h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
          {success}
        </div>
      )}

      {/* 📝 Keep your existing profile form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={formData.name}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={formData.email}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
          {formData.profilePicture && (
            <div className="mt-2">
              <img
                src={formData.profilePicture}
                alt="Profile"
                className="w-20 h-20 object-cover rounded-full border"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Save Profile
          </button>
        </div>
      </form>

      {/* ✅ NEW SECTION: Show ALL saved resume previews */}
      <div className="mt-10 pt-6 border-t">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Your Saved Resumes ({savedResumes.length})
        </h2>

        {savedResumes.length === 0 ? (
          <p className="text-gray-500">No resumes saved yet. Create one in the editor!</p>
        ) : (
          <div className="space-y-8">
            {savedResumes.map((resume) => {
              const TemplateComp = templateMap[resume.template];
              if (!TemplateComp) return null;

              const resumeDataForTemplate: ResumeData = {
                personalInfo: resume.personalInfo,
                workExperience: resume.workExperience || [],
                education: resume.education || [],
                skills: resume.skills || [],
                projects: resume.projects || [],
                additionalSections: resume.additionalSections || [],
              };

              return (
                <div key={resume._id} className="border rounded-lg p-4 bg-white">
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    {resume.template.charAt(0).toUpperCase() + resume.template.slice(1).replace('template', 'Template ')}
                  </h3>
                  <div className="overflow-auto max-h-[900px] border rounded bg-white p-4">
                    <TemplateComp data={resumeDataForTemplate} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}