// N8N Status Page Wrapper
// Location: src/pages/admin/N8NStatusPage.jsx

import React from 'react';
import N8NDualLayerStatus from '../../components/N8NDualLayerStatus';

const N8NStatusPage = () => {
  return (
    <div className="container mx-auto p-6">
      <N8NDualLayerStatus />
    </div>
  );
};

export default N8NStatusPage;
