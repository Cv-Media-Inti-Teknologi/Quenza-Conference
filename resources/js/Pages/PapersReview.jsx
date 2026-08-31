import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '../Layouts/AdminLayout';
import PapersReviewTabs from '../Components/PapersReviewTabs';
import PaperDashboard from '../Components/PaperDashboard';
import PaperManagementTab from '../Components/PaperManagementTab';
import ReviewerManagementTab from '../Components/ReviewerManagementTab';

export default function PapersReview() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [period, setPeriod] = useState('month');

    return (
        <AdminLayout title="Manajemen Paper & Review" subtitle="Kelola konten publik landing page konferensi">
            <Head title="Manajemen Paper & Review" />

            <PapersReviewTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="mt-6">
                {activeTab === 'dashboard' && (
                    <PaperDashboard period={period} setPeriod={setPeriod} />
                )}
                {activeTab === 'papers' && (
                    <PaperManagementTab />
                )}
                {activeTab === 'reviewers' && (
                    <ReviewerManagementTab />
                )}
            </div>
        </AdminLayout>
    );
}
