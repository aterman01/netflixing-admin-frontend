// Content Service - Handles content approval/rejection API calls
// Location: src/services/contentService.js

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://netflixing-admin-backend-production.up.railway.app';

const contentService = {
  /**
   * Get content moderation queue
   */
  async getQueue() {
    const response = await fetch(`${API_BASE_URL}/api/admin/content/queue`);
    if (!response.ok) throw new Error('Failed to fetch content queue');
    return response.json();
  },

  /**
   * Approve content by ID
   */
  async approveContent(contentId, feedback = '') {
    const response = await fetch(`${API_BASE_URL}/api/admin/content/${contentId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feedback })
    });
    if (!response.ok) throw new Error('Failed to approve content');
    return response.json();
  },

  /**
   * Reject content by ID
   */
  async rejectContent(contentId, reason) {
    const response = await fetch(`${API_BASE_URL}/api/admin/content/${contentId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    });
    if (!response.ok) throw new Error('Failed to reject content');
    return response.json();
  },

  /**
   * Edit content before approval
   */
  async editContent(contentId, updates) {
    const response = await fetch(`${API_BASE_URL}/api/admin/content/${contentId}/edit`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to edit content');
    return response.json();
  },

  /**
   * Get content approval history
   */
  async getHistory(limit = 50) {
    const response = await fetch(`${API_BASE_URL}/api/admin/content/history?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch content history');
    return response.json();
  },

  /**
   * Get content by ID
   */
  async getContentById(contentId) {
    const response = await fetch(`${API_BASE_URL}/api/admin/content/${contentId}`);
    if (!response.ok) throw new Error('Failed to fetch content');
    return response.json();
  }
};

export default contentService;
