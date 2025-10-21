import { useState } from 'react';
import { Upload, Link as LinkIcon, Download } from 'lucide-react';
import rpmService from '../../services/rpmService';

const RPMTab = () => {
  const [avatars, setAvatars] = useState([]);
  const [creating, setCreating] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');

  const handleCreateFromPhoto = async () => {
    if (!photoFile) return;
    
    setCreating(true);
    try {
      const formData = new FormData();
      formData.append('photo', photoFile);
      const result = await rpmService.createFromPhoto(formData);
      setAvatars([...avatars, result]);
      setPhotoFile(null);
    } catch (error) {
      console.error('Avatar creation failed:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleCreateFromUrl = async () => {
    if (!avatarUrl) return;
    
    setCreating(true);
    try {
      const result = await rpmService.createFromUrl(avatarUrl);
      setAvatars([...avatars, result]);
      setAvatarUrl('');
    } catch (error) {
      console.error('Avatar creation failed:', error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Avatar Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* From Photo */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-xl border border-white/10">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Upload className="w-6 h-6 text-[#667eea]" />
            Create from Photo
          </h3>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files[0])}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-400">Click to upload photo</p>
                {photoFile && <p className="text-sm text-[#667eea] mt-2">{photoFile.name}</p>}
              </label>
            </div>
            <button
              onClick={handleCreateFromPhoto}
              disabled={!photoFile || creating}
              className="w-full bg-gradient-to-r from-[#667eea] to-[#764ba2] px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create Avatar'}
            </button>
          </div>
        </div>

        {/* From URL */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-xl border border-white/10">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <LinkIcon className="w-6 h-6 text-[#667eea]" />
            Import from URL
          </h3>
          <div className="space-y-4">
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://readyplayer.me/avatar.glb"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#667eea]"
            />
            <button
              onClick={handleCreateFromUrl}
              disabled={!avatarUrl || creating}
              className="w-full bg-gradient-to-r from-[#667eea] to-[#764ba2] px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {creating ? 'Importing...' : 'Import Avatar'}
            </button>
          </div>
        </div>
      </div>

      {/* Avatar Gallery */}
      <div className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-xl border border-white/10">
        <h3 className="text-xl font-bold mb-4">Avatar Gallery</h3>
        {avatars.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No avatars created yet</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {avatars.map((avatar, idx) => (
              <div key={idx} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="aspect-square bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-lg mb-2"></div>
                <button className="w-full bg-white/10 hover:bg-white/20 px-3 py-2 rounded text-sm transition-colors flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RPMTab;
