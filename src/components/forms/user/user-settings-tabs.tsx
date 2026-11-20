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

  const tabClasses = 'px-5 py-3 font-semibold transition-colors border-b-2';

  const activeTabClasses = 'border-primary text-primary';

  const inactiveTabClasses = 'border-transparent text-text-muted hover:text-text';

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div role="tablist" aria-label="User settings" className="border-border mb-8 flex justify-center gap-3 border-b">
        <button
          id="user-settings-tab"
          type="button"
          role="tab"
          aria-selected={activeTab === 'user-settings'}
          aria-controls="user-settings-panel"
          tabIndex={activeTab === 'user-settings' ? 0 : -1}
          onClick={() => setActiveTab('user-settings')}
          className={`${tabClasses} ${activeTab === 'user-settings' ? activeTabClasses : inactiveTabClasses}`}
        >
          User Settings
        </button>

        <button
          id="change-password-tab"
          type="button"
          role="tab"
          aria-selected={activeTab === 'change-password'}
          aria-controls="change-password-panel"
          tabIndex={activeTab === 'change-password' ? 0 : -1}
          onClick={() => setActiveTab('change-password')}
          className={`${tabClasses} ${activeTab === 'change-password' ? activeTabClasses : inactiveTabClasses}`}
        >
          Change Password
        </button>
      </div>

      {activeTab === 'user-settings' && (
        <div id="user-settings-panel" role="tabpanel" aria-labelledby="user-settings-tab" tabIndex={0}>
          <UpdateUserForm user={user} />
        </div>
      )}

      {activeTab === 'change-password' && (
        <div id="change-password-panel" role="tabpanel" aria-labelledby="change-password-tab" tabIndex={0}>
          <ChangePasswordForm />
        </div>
      )}
    </div>
  );
}
