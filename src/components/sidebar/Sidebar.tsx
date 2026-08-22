'use client';

//NEXT & Routing
import Link from 'next/link';
import { useRouter } from 'next/navigation';

//CSS
import './sidebar.css';

//Components
import Button from '@/components/button/button';

//FA-ICONS
import { FaDumbbell, FaWeight, FaChartBar } from 'react-icons/fa';
import { CiDumbbell } from 'react-icons/ci';
import { BsBarChartLine } from 'react-icons/bs';
import { FaTrophy } from 'react-icons/fa6';
import { FaHistory } from 'react-icons/fa';
import { IoIosSettings } from 'react-icons/io';
import { BsPersonCircle } from 'react-icons/bs';
import { FaHome } from 'react-icons/fa';

//Services
import AuthService from '@/services/auth-service';

//Types
import type { UserSettingsViewModel } from '@/types/user-types';

interface Props {
  user: UserSettingsViewModel | null;
}

function Sidebar({ user }: Props) {
  const router = useRouter();

  if (user === null) {
    router.push('/account/login');
    return;
  }

  const handleLogout = async () => {
    const apiResponse = await AuthService.logout();
    if (apiResponse.success) {
      router.push('/account/login');
    }
  };

  return (
    <>
      <aside className="sidebar flex flex-col fixed justify-between">
        <div className="sidebar-top flex flex-col">
          <div className="sidebar-intro-wrapper flex items-center justify-center">
            <FaDumbbell className="fa-dumbbell" />
            <h3 className="sidebar-intro-text">
              Gym <span>Tracker</span>
            </h3>
          </div>

          <nav className="sidebar-nav">
            <ul className="ul-list grid grid-flow-row">
              <li className="li active flex align-center">
                <FaHome className="fa-icon" />
                <Link href="/dashboard" className="grid">
                  Dashboard
                </Link>
              </li>

              <li className="li flex items-center">
                <CiDumbbell className="fa-icon" />
                <Link href="/workout" className="grid">
                  Workouts
                </Link>
              </li>

              <li className="li flex items-center">
                <FaWeight className="fa-icon" />
                <Link href="/log-weight" className="grid">
                  Log weight
                </Link>
              </li>

              <li className="li flex items-center">
                <FaChartBar className="fa-icon" />
                <Link href="/progress" className="grid">
                  Progress
                </Link>
              </li>

              <li className="li flex items-center">
                <BsBarChartLine className="fa-icon" />
                <Link href="/" className="grid">
                  Statics
                </Link>
              </li>

              <li className="li flex items-center">
                <FaTrophy className="fa-icon" />
                <Link href="/exercise" className="grid">
                  Övningar
                </Link>
              </li>

              <li className="li flex items-center">
                <FaHistory className="fa-icon" />
                <Link href="/history" className="grid">
                  History
                </Link>
              </li>

              <li className="li flex items-center">
                <IoIosSettings className="fa-icon" />
                <Link href={`/account/setting`} className="grid">
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="sidebar-bottom">
          <div className="sidebar-bottom-wrapper flex justify-center items-center">
            <BsPersonCircle />
            <p>
              <small>{user?.username}</small>
            </p>
          </div>
          <div className="logout-wrapper flex justify-center mt-5">
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
