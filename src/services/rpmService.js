import { api } from './api.js';

export const rpmService = {
  getAvatar: async (agentId) => {
    return api.get(`/api/rpm/avatar/${agentId}`);
  },
  
  createAvatar: async (agentId, avatarConfig) => {
    return api.post(`/api/rpm/create/${agentId}`, avatarConfig);
  }
};

export default rpmService;
