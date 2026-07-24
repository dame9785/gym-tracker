'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

//Auth
import { useAuth } from '@/provider/auth-provider';

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

function Sidebar() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();

  if (user == null) return null;

  const handleLogout = async () => {
    localStorage.removeItem('token');
    router.push('/account/login');
    refreshUser();
  };

  return (
    <>
      <aside className="sidebar flex flex-col fixed justify-between">
        <div className="sidebar-top flex flex-col">
          <div className="sidebar-intro-wrapper flex items-center">
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
                <Link href="/" className="grid">
                  Workouts
                </Link>
              </li>

              <li className="li flex items-center">
                <FaWeight className="fa-icon" />
                <Link href="/" className="grid">
                  Log weight
                </Link>
              </li>

              <li className="li flex items-center">
                <FaChartBar className="fa-icon" />
                <Link href="/" className="grid">
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
                <Link href="/" className="grid">
                  PRs
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
                <Link href={`/account/settings/${user.id}`} className="grid">
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="sidebar-bottom">
          <div className="sidebar-bottom-wrapper flex align-center">
            <BsPersonCircle />
            <p>
              Welcome,
              <span> {user?.username == null ? 'Kompis' : user?.username}</span>
            </p>
          </div>
          <div className="logout-wrapper flex justify-center mt-5">
            <Button
              type="button"
              text="Logga ut"
              variant="secondary"
              onClick={handleLogout}
            ></Button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
