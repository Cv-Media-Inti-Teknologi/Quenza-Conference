export default function PapersReviewTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'papers', label: 'Paper Management' },
    { id: 'reviewers', label: 'Reviewer Management' },
  ];

  return (
    <div className="border-b border-gray-200">
      <div className="flex gap-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-4 px-1 border-b-2 font-quenza-medium text-quenza-medium transition-colors ${
              activeTab === tab.id
                ? 'border-quenza-primary text-quenza-primary'
                : 'border-transparent text-quenza-text-secondary hover:text-quenza-text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
