'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSyncExternalStore } from 'react';

import Button from '@/components/button/button';
import { logoutAction } from '@/actions/user-actions';

import { FaDumbbell, FaWeight, FaHistory, FaHome } from 'react-icons/fa';
import { BsBarChartLine } from 'react-icons/bs';
import { IoIosSettings } from 'react-icons/io';
import { FaPersonRunning } from 'react-icons/fa6';
import { FiMenu, FiX } from 'react-icons/fi';
import { MdOutlineLocalFireDepartment } from 'react-icons/md';

const navigationItems = [
  { label: 'Dashboard', href: '/dashboard', icon: FaHome },
  { label: 'Workouts', href: '/workout', icon: FaDumbbell },
  { label: 'Weight', href: '/log-weight', icon: FaWeight },
  { label: 'Progress', href: '/progress', icon: BsBarChartLine },
  { label: 'Exercises', href: '/exercises', icon: FaPersonRunning },
  { label: 'Nutrition', href: '/nutrition', icon: FaHistory },
  { label: 'History', href: '/history', icon: FaHistory },
  { label: 'Settings', href: '/account/setting', icon: IoIosSettings },
];

const SIDEBAR_STORAGE_KEY = 'gymtracker-sidebar-open';

function subscribeToSidebar(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('gymtracker-sidebar-change', callback);

  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('gymtracker-sidebar-change', callback);
  };
}

function getSidebarSnapshot() {
  return localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true';
}

function getSidebarServerSnapshot() {
  return false;
}

function updateSidebarPreference(isOpen: boolean) {
  localStorage.setItem(SIDEBAR_STORAGE_KEY, String(isOpen));
  window.dispatchEvent(new Event('gymtracker-sidebar-change'));
}

function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const isOpen = useSyncExternalStore(subscribeToSidebar, getSidebarSnapshot, getSidebarServerSnapshot);

  const toggleSidebar = () => {
    updateSidebarPreference(!isOpen);
  };

  const closeSidebar = () => {
    updateSidebarPreference(false);
  };

  const handleLogout = async () => {
    closeSidebar();

    await logoutAction();

    router.push('/account/login');
    router.refresh();
  };

  return (
    <>
      {/* Mobile header */}
      <header className="border-border bg-background fixed inset-x-0 top-0 z-[80] flex h-14 items-center gap-3 border-b px-4 lg:hidden">
        <Button type="button" variant="ghost" size="sm" onClick={toggleSidebar} ariaLabel={isOpen ? 'Hide sidebar' : 'Show sidebar'} ariaExpanded={isOpen} ariaControls="gymtracker-sidebar" className="text-text-secondary hover:bg-surface-hover hover:text-primary !h-10 !w-10 !rounded-lg">
          {isOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
        </Button>

        <Link href="/dashboard" className="flex items-center gap-2">
          <FaDumbbell className="text-primary" />

          <span className="text-text font-extrabold">
            Gym<span className="text-primary">Tracker</span>
          </span>
        </Link>
      </header>

      {/* Sidebar overlay */}
      {isOpen && <button type="button" aria-label="Close sidebar" onClick={closeSidebar} className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-[2px] lg:hidden" />}

      {/* Sidebar */}
      <aside
        id="gymtracker-sidebar"
        aria-label="Sidebar navigation"
        className={`border-border bg-background text-text fixed top-14 bottom-0 left-0 z-[75] flex h-auto w-60 flex-col justify-between overflow-y-auto overscroll-contain border-r px-4 py-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl shadow-black/20 transition-transform duration-300 ease-in-out lg:top-0 lg:z-50 lg:h-dvh ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div>
          {/* Logo */}
          <Link href="/dashboard" onClick={closeSidebar} className="mb-9 flex items-center gap-3 rounded-xl px-1">
            <div className="border-primary/20 bg-primary/10 text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-xl shadow-lg shadow-black/10">
              <FaDumbbell />
            </div>

            <div className="flex min-w-0 flex-col">
              <span className="text-text text-lg font-extrabold tracking-tight whitespace-nowrap">
                Gym<span className="text-primary">Tracker</span>
              </span>

              <span className="text-text-muted mt-0.5 text-[9px] font-bold tracking-[0.17em] whitespace-nowrap">YOUR FITNESS JOURNEY</span>
            </div>
          </Link>

          {/* Navigation heading */}
          <div className="text-text-muted mb-3 px-2.5 text-[10px] font-bold tracking-[0.2em]">MENU</div>

          {/* Navigation */}
          <nav aria-label="Main navigation">
            <ul className="flex flex-col gap-1.5">
              {navigationItems.map(({ label, href, icon: Icon }) => {
                const isActive = pathname === href || pathname.startsWith(`${href}/`);

                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={closeSidebar}
                      aria-current={isActive ? 'page' : undefined}
                      className={`group relative flex min-h-10 items-center gap-3 overflow-hidden rounded-xl border px-2.5 transition-all duration-200 ${
                        isActive ? 'border-primary/25 bg-primary/10 text-text shadow-sm shadow-black/10' : 'text-text-secondary hover:border-primary/15 hover:bg-surface-hover hover:text-text border-transparent'
                      }`}
                    >
                      {isActive && <span className="bg-primary absolute inset-y-2 left-0 w-0.5 rounded-full shadow-[0_0_10px_rgba(251,146,60,0.6)]" />}

                      <Icon className={`h-[17px] w-[17px] shrink-0 transition-colors duration-200 ${isActive ? 'text-primary' : 'text-text-muted group-hover:text-primary'}`} />

                      <span className="flex-1 text-xs font-semibold">{label}</span>

                      {isActive && <span className="bg-primary h-1.5 w-1.5 shrink-0 rounded-full shadow-[0_0_8px_rgba(251,146,60,0.6)]" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Bottom section */}
        <div className="mt-6">
          {/* Motivation card */}
          <div className="border-border bg-surface mb-3 flex items-center gap-2.5 rounded-xl border p-2.5">
            <div className="border-primary/15 bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-lg">
              <MdOutlineLocalFireDepartment />
            </div>

            <div className="min-w-0">
              <p className="text-text text-[11px] font-semibold">Stay consistent</p>

              <p className="text-text-muted mt-0.5 text-[9px]">Small steps. Big results.</p>
            </div>
          </div>

          <div className="bg-border mb-3 h-px" />

          {/* Logout */}
          <div className="[&_button]:w-full">
            <Button type="button" variant="secondary" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
