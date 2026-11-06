'use client';

import { useState } from 'react';

import ChangePasswordForm from '@/components/forms/user/change-password-form';
import UpdateUserForm from '@/components/forms/user/update-user-form';
import type { UserSettingsViewModel } from '@/types/user-types';

interface Props {
  user: UserSettingsViewModel;
}

type SettingsTab = 'user-settings' | 'change-password';

export default function UserSettingsTabs({ user }: Props) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('user-settings');

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-8 flex gap-3 border-b border-gray-700">
        <button
          type="button"
          onClick={() => setActiveTab('user-settings')}
          className={`px-5 py-3 font-semibold transition-colors ${
            activeTab === 'user-settings' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-400 hover:text-white'
          }`}
        >
          User Settings
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('change-password')}
          className={`px-5 py-3 font-semibold transition-colors ${
            activeTab === 'change-password' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-400 hover:text-white'
          }`}
        >
          Change Password
        </button>
      </div>

      <div>
        {activeTab === 'user-settings' && <UpdateUserForm user={user} />}

        {activeTab === 'change-password' && <ChangePasswordForm />}
      </div>
    </div>
  );
}
