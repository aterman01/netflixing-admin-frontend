/**
 * Ready Player Me Service
 * Avatar creation and management
 */

const API_BASE = import.meta.env.VITE_API_URL || 'https://netflixing-admin-backend-production.up.railway.app';

export const rpmService = {
  /**
   * Create avatar from photo
   */
  async createFromPhoto(photoFile, agentId = null, options = {}) {
    const formData = new FormData();
    formData.append('photo', photoFile);
    
    if (agentId) {
      formData.append('agent_id', agentId);
    }

    if (options.gender) {
      formData.append('gender', options.gender);
    }

    const response = await fetch(`${API_BASE}/api/rpm/create/photo`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Avatar creation failed');
    }

    return response.json();
  },

  /**
   * Import existing RPM avatar by URL
   */
  async importAvatar(rpmUrl, agentId = null, metadata = {}) {
    const response = await fetch(`${API_BASE}/api/rpm/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rpm_url: rpmUrl,
        agent_id: agentId,
        metadata
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Avatar import failed');
    }

    return response.json();
  },

  /**
   * Get avatar details
   */
  async getAvatar(avatarId) {
    const response = await fetch(`${API_BASE}/api/rpm/avatars/${avatarId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  /**
   * List all avatars with optional filters
   */
  async listAvatars(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.agentId) params.append('agent_id', filters.agentId);
    if (filters.status) params.append('status', filters.status);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await fetch(`${API_BASE}/api/rpm/avatars?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  /**
   * Customize avatar
   */
  async customize(avatarId, customizations) {
    const response = await fetch(`${API_BASE}/api/rpm/customize/${avatarId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customizations)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Customization failed');
    }

    return response.json();
  },

  /**
   * Assign avatar to agent
   */
  async assignToAgent(avatarId, agentId) {
    const response = await fetch(`${API_BASE}/api/avatars/${avatarId}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent_id: agentId,
        approved_by: 'admin'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Avatar assignment failed');
    }

    return response.json();
  },

  /**
   * Delete avatar
   */
  async deleteAvatar(avatarId) {
    const response = await fetch(`${API_BASE}/api/rpm/avatars/${avatarId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Avatar deletion failed');
    }

    return response.json();
  },

  /**
   * Get RPM SDK configuration
   */
  async getConfig() {
    const response = await fetch(`${API_BASE}/api/rpm/config`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  /**
   * Check RPM service health
   */
  async healthCheck() {
    const response = await fetch(`${API_BASE}/api/rpm/health`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
};

export default rpmService;
