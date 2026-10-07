import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import { 
  Building2, Globe, MapPin, Phone, Mail, FileText, 
  Upload, CheckCircle, AlertCircle, ShieldCheck
} from 'lucide-react';

export default function EmployerCompanyProfilePage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  const [profile, setProfile] = useState({
    companyName: '',
    industry: '',
    companySize: '',
    websiteUrl: '',
    companyDescription: '',
    address: '',
    city: 'Colombo',
    contactNumber: '',
    contactEmail: '',
    verificationStatus: 'PENDING'
  });

  const [documents, setDocuments] = useState([]);
  const [docType, setDocType] = useState('BRC');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/employers/profile/me');
      const data = res.data;
      setProfile({
        companyName: data.companyName || '',
        industry: data.industry || '',
        companySize: data.companySize || '50-200',
        websiteUrl: data.websiteUrl || '',
        companyDescription: data.companyDescription || '',
        address: data.address || '',
        city: data.city || 'Colombo',
        contactNumber: data.contactNumber || '',
        contactEmail: data.contactEmail || '',
        verificationStatus: data.verificationStatus || 'PENDING'
      });
      setDocuments(data.documents || []);
    } catch (error) {
      showToast('Error loading company profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put('/employers/profile/me', profile);
      showToast('Company profile updated successfully', 'success');
    } catch (error) {
      showToast('Failed to update company profile', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', docType);

    setUploadingDoc(true);
    try {
      const res = await api.post('/employers/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      showToast('Verification document uploaded! Admin has been notified.', 'success');
      setDocuments(prev => [...prev, res.data]);
    } catch (error) {
      showToast(error.response?.data?.message || 'Document upload failed', 'error');
    } finally {
      setUploadingDoc(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading enterprise profile..." />;
  }

  const isVerified = profile.verificationStatus === 'VERIFIED';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Company Profile & Verification</h1>
        <p className="text-sm text-gray-500">
          Manage your enterprise branding and submit business registration credentials for verification.
        </p>
      </div>

      {/* Verification Status Banner */}
      <div className={`card p-5 border-l-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        isVerified 
          ? 'border-l-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/20' 
          : 'border-l-amber-500 bg-amber-50/60 dark:bg-amber-950/20'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg ${isVerified ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
            {isVerified ? <ShieldCheck size={28} /> : <AlertCircle size={28} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-gray-900 dark:text-white text-base">
                Verification Status: {profile.verificationStatus}
              </h4>
              <StatusBadge status={profile.verificationStatus} />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
              {isVerified
                ? 'Your organization has been officially verified by LankaHire Compliance. Candidates see your verified badge.'
                : 'Upload your Business Registration Certificate below to receive verified status and boost applicant confidence.'}
            </p>
          </div>
        </div>
      </div>

      {/* Company Information Form */}
      <form onSubmit={handleSubmitProfile} className="card p-6 space-y-6">
        <h3 className="text-base font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
          <Building2 size={18} className="text-primary-600" /> Enterprise Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Company Legal / Trading Name *"
            name="companyName"
            value={profile.companyName}
            onChange={handleChange}
            required
          />

          <Input
            label="Industry / Domain *"
            name="industry"
            value={profile.industry}
            onChange={handleChange}
            placeholder="e.g. Information Technology, FinTech"
            required
          />

          <Input
            label="Website URL"
            name="websiteUrl"
            value={profile.websiteUrl}
            onChange={handleChange}
            placeholder="https://company.lk"
          />

          <Input
            label="Company Size"
            name="companySize"
            value={profile.companySize}
            onChange={handleChange}
            placeholder="e.g. 50-200 Employees"
          />

          <Input
            label="Contact Email *"
            name="contactEmail"
            type="email"
            value={profile.contactEmail}
            onChange={handleChange}
            required
          />

          <Input
            label="Contact Phone *"
            name="contactNumber"
            value={profile.contactNumber}
            onChange={handleChange}
            placeholder="+94 11 234 5678"
            required
          />

          <Input
            label="City / Region *"
            name="city"
            value={profile.city}
            onChange={handleChange}
            required
          />

          <Input
            label="Headquarters Address"
            name="address"
            value={profile.address}
            onChange={handleChange}
            placeholder="Street address, Colombo"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Company Bio & Overview
          </label>
          <textarea
            name="companyDescription"
            rows={4}
            value={profile.companyDescription}
            onChange={handleChange}
            placeholder="Tell job seekers about your company culture, mission, and benefits..."
            className="input"
          />
        </div>

        <div className="flex justify-end pt-2 border-t border-gray-200 dark:border-gray-800">
          <Button type="submit" variant="primary" loading={submitting}>
            Save Enterprise Profile
          </Button>
        </div>
      </form>

      {/* Verification Documents Section */}
      <div className="card p-6 space-y-4">
        <h3 className="text-base font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
          <FileText size={18} className="text-primary-600" /> Business Registration Documents
        </h3>
        <p className="text-xs text-gray-500">
          Upload PDF or image copies of your Business Registration Certificate (BRC) or Form 1 for administrator review.
        </p>

        {/* Upload Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 p-4 bg-gray-50 dark:bg-gray-850 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className="select text-xs py-2 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <option value="BRC">Business Registration (BRC)</option>
            <option value="TAX_CERTIFICATE">Tax Clearance / TIN</option>
            <option value="INCORPORATION_DOC">Certificate of Incorporation</option>
          </select>

          <label className="btn btn-outline btn-sm cursor-pointer flex items-center gap-2">
            <Upload size={14} />
            {uploadingDoc ? 'Uploading...' : 'Choose File to Upload'}
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileUpload}
              disabled={uploadingDoc}
              className="hidden"
            />
          </label>
        </div>

        {/* Uploaded Documents List */}
        {documents.length > 0 && (
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300">Submitted Documents</h4>
            {documents.map((doc, idx) => (
              <div key={doc.id || idx} className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-primary-600" />
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{doc.documentType || 'BRC'}</p>
                    <p className="text-[10px] text-gray-400">{doc.fileName || 'document.pdf'}</p>
                  </div>
                </div>
                <StatusBadge status={doc.verificationStatus || 'PENDING'} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
