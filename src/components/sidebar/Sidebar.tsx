'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSyncExternalStore } from 'react';

import Button from '@/components/button/button';
import { logoutAction } from '@/actions/user-actions';

import { FaDumbbell, FaWeight, FaHistory, FaHome, FaUtensils } from 'react-icons/fa';
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
  { label: 'Foods', href: '/foods', icon: FaUtensils },
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
      <header className="fixed inset-x-0 top-0 z-[80] flex h-14 items-center gap-3 border-b border-slate-800 bg-[#03091b] px-4 lg:hidden">
        <button type="button" onClick={toggleSidebar} aria-label={isOpen ? 'Hide sidebar' : 'Show sidebar'} aria-expanded={isOpen} aria-controls="gymtracker-sidebar" className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-200 transition hover:bg-slate-800 hover:text-orange-400">
          {isOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
        </button>

        <Link href="/dashboard" className="flex items-center gap-2">
          <FaDumbbell className="text-orange-400" />

          <span className="font-extrabold text-white">
            Gym<span className="text-orange-400">Tracker</span>
          </span>
        </Link>
      </header>

      {/* Sidebar overlay */}
      {isOpen && <button type="button" aria-label="Close sidebar" onClick={closeSidebar} className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-[2px] lg:hidden" />}

      {/* Sidebar */}
      <aside
        id="gymtracker-sidebar"
        aria-label="Sidebar navigation"
        className={`fixed top-14 bottom-0 left-0 z-[75] flex h-auto w-60 flex-col justify-between overflow-y-auto overscroll-contain border-r border-slate-800/80 bg-[#03091b] px-4 py-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] text-slate-100 shadow-2xl shadow-black/20 transition-transform duration-300 ease-in-out lg:top-0 lg:z-50 lg:h-dvh ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div>
          {/* Logo */}
          <Link href="/dashboard" onClick={closeSidebar} className="mb-9 flex items-center gap-3 rounded-xl px-1">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-orange-400/20 bg-gradient-to-br from-orange-500/20 to-amber-500/10 text-xl text-orange-400 shadow-lg shadow-orange-950/20">
              <FaDumbbell />
            </div>

            <div className="flex min-w-0 flex-col">
              <span className="text-lg font-extrabold tracking-tight whitespace-nowrap text-white">
                Gym<span className="text-orange-400">Tracker</span>
              </span>

              <span className="mt-0.5 text-[9px] font-bold tracking-[0.17em] whitespace-nowrap text-slate-500">YOUR FITNESS JOURNEY</span>
            </div>
          </Link>

          {/* Navigation heading */}
          <div className="mb-3 px-2.5 text-[10px] font-bold tracking-[0.2em] text-slate-500">MENU</div>

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
                        isActive ? 'border-orange-500/25 bg-gradient-to-r from-orange-500/15 to-amber-500/5 text-white shadow-sm shadow-orange-950/20' : 'border-transparent text-slate-400 hover:border-orange-500/15 hover:bg-orange-500/5 hover:text-white'
                      }`}
                    >
                      {isActive && <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.6)]" />}

                      <Icon className={`h-[17px] w-[17px] shrink-0 transition-colors duration-200 ${isActive ? 'text-orange-400' : 'text-slate-500 group-hover:text-orange-400'}`} />

                      <span className="flex-1 text-xs font-semibold">{label}</span>

                      {isActive && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.6)]" />}
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
          <div className="mb-3 flex items-center gap-2.5 rounded-xl border border-slate-700/50 bg-slate-900/70 p-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-orange-500/15 bg-orange-500/10 text-lg text-orange-400">
              <MdOutlineLocalFireDepartment />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-slate-200">Stay consistent</p>

              <p className="mt-0.5 text-[9px] text-slate-500">Small steps. Big results.</p>
            </div>
          </div>

          <div className="mb-3 h-px bg-slate-800" />

          {/* Logout */}
          <div className="[&_button]:w-full">
            <Button type="button" variant="secondary" onClick={handleLogout}>
              Logga ut
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
