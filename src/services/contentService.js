// Content Management Service
// Location: src/services/contentService.js
// Handles all content queue operations including approval/rejection

import api from './api';

const contentService = {
  /**
   * Get all pending content in the queue
   * @returns {Promise<Array>} Array of content items
   */
  async getQueue() {
    try {
      const response = await api.get('/api/admin/content/queue');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch content queue:', error);
      throw error;
    }
  },

  /**
   * Get queue with filtering
   * @param {Object} params - Filter parameters
   * @param {string} params.status - Filter by status (pending/approved/rejected)
   * @param {number} params.agent_id - Filter by agent ID
   * @param {string} params.platform - Filter by platform
   * @returns {Promise<Array>} Filtered content items
   */
  async getQueueFiltered(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/api/admin/content/queue?${queryString}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch filtered queue:', error);
      throw error;
    }
  },

  /**
   * Approve a content item
   * @param {string} contentId - Content ID to approve
   * @param {string} feedback - Optional feedback message
   * @returns {Promise<Object>} Approval result
   */
  async approveContent(contentId, feedback = '') {
    try {
      const response = await api.post(`/api/admin/content/${contentId}/approve`, {
        feedback,
        approved_at: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to approve content ${contentId}:`, error);
      throw error;
    }
  },

  /**
   * Reject a content item
   * @param {string} contentId - Content ID to reject
   * @param {string} reason - Rejection reason (required)
   * @returns {Promise<Object>} Rejection result
   */
  async rejectContent(contentId, reason) {
    if (!reason || reason.trim() === '') {
      throw new Error('Rejection reason is required');
    }

    try {
      const response = await api.post(`/api/admin/content/${contentId}/reject`, {
        reason,
        rejected_at: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to reject content ${contentId}:`, error);
      throw error;
    }
  },

  /**
   * Edit/Update a content item before approval
   * @param {string} contentId - Content ID to edit
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Update result
   */
  async editContent(contentId, updates) {
    try {
      const response = await api.put(`/api/admin/content/${contentId}/edit`, updates);
      return response.data;
    } catch (error) {
      console.error(`Failed to edit content ${contentId}:`, error);
      throw error;
    }
  },

  /**
   * Schedule content for future posting
   * @param {string} contentId - Content ID to schedule
   * @param {string} scheduledTime - ISO timestamp for scheduled posting
   * @returns {Promise<Object>} Schedule result
   */
  async scheduleContent(contentId, scheduledTime) {
    try {
      const response = await api.post(`/api/admin/content/${contentId}/schedule`, {
        scheduled_time: scheduledTime
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to schedule content ${contentId}:`, error);
      throw error;
    }
  },

  /**
   * Get content moderation history
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>} Content history
   */
  async getHistory(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/api/admin/content/history?${queryString}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch content history:', error);
      throw error;
    }
  },

  /**
   * Get content statistics
   * @returns {Promise<Object>} Content stats (total, pending, approved, rejected)
   */
  async getStats() {
    try {
      const response = await api.get('/api/admin/content/stats');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch content stats:', error);
      throw error;
    }
  },

  /**
   * Batch approve multiple content items
   * @param {Array<string>} contentIds - Array of content IDs
   * @param {string} feedback - Optional feedback for all items
   * @returns {Promise<Object>} Batch approval results
   */
  async batchApprove(contentIds, feedback = '') {
    try {
      const response = await api.post('/api/admin/content/batch/approve', {
        content_ids: contentIds,
        feedback
      });
      return response.data;
    } catch (error) {
      console.error('Failed to batch approve content:', error);
      throw error;
    }
  },

  /**
   * Batch reject multiple content items
   * @param {Array<string>} contentIds - Array of content IDs
   * @param {string} reason - Rejection reason for all items
   * @returns {Promise<Object>} Batch rejection results
   */
  async batchReject(contentIds, reason) {
    if (!reason || reason.trim() === '') {
      throw new Error('Rejection reason is required');
    }

    try {
      const response = await api.post('/api/admin/content/batch/reject', {
        content_ids: contentIds,
        reason
      });
      return response.data;
    } catch (error) {
      console.error('Failed to batch reject content:', error);
      throw error;
    }
  }
};

export default contentService;
