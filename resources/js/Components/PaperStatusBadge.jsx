import React from 'react';

export default function PaperStatusBadge({ status }) {
  const statusConfig = {
    'submitted': { label: 'Submitted', class: 'quenza-badge-info' },
    'under_review': { label: 'Under Review', class: 'quenza-badge-warning' },
    'revision_required': { label: 'Revision Required', class: 'quenza-badge-warning' },
    'accepted': { label: 'Accepted', class: 'quenza-badge-success' },
    'rejected': { label: 'Rejected', class: 'quenza-badge-danger' },
  };

  const config = statusConfig[status] || { label: status, class: 'quenza-badge-secondary' };

  return <span className={config.class}>{config.label}</span>;
}
