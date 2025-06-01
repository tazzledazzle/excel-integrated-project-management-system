import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface ExcelAuthDialogProps {
  onSuccess: (token: string) => void;
  onClose: () => void;
}

const ExcelAuthDialog: React.FC<ExcelAuthDialogProps> = ({ onSuccess, onClose }) => {
  const [token, setToken] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const { validateExcelToken } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      showToast('Please enter a token', 'warning');
      return;
    }

    setIsValidating(true);
    try {
      const isValid = await validateExcelToken(token);
      if (isValid) {
        onSuccess(token);
        showToast('Authentication successful', 'success');
      } else {
        showToast('Invalid token', 'error');
      }
    } catch (error) {
      showToast('Authentication failed', 'error');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Excel Integration Authentication</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">
              Project Token
            </label>
            <input
              type="text"
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="input w-full"
              placeholder="Enter your project token"
              disabled={isValidating}
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              disabled={isValidating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isValidating}
            >
              {isValidating ? 'Validating...' : 'Connect'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExcelAuthDialog;