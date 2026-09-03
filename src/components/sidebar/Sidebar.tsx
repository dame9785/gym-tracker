'use client';

// NEXT & Routing
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// CSS
import './sidebar.css';

// Components
import Button from '@/components/button/button';

// Icons
import { FaDumbbell, FaWeight, FaHistory, FaHome } from 'react-icons/fa';

import { BsBarChartLine, BsPersonCircle } from 'react-icons/bs';
import { IoIosSettings } from 'react-icons/io';
import { FaPersonRunning, FaUtensils } from 'react-icons/fa6';
import { MdOutlineLocalFireDepartment } from 'react-icons/md';
import { logoutAction } from '@/actions/user-actions';

function Sidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();

    router.push('/account/login');
    router.refresh();
  };

  return (
    <aside className="sidebar fixed flex flex-col justify-between">
      <div className="sidebar-top flex flex-col">
        <div className="sidebar-intro-wrapper flex items-center justify-center">
          <FaDumbbell className="fa-dumbbell" />

          <h3 className="sidebar-intro-text">
            Gym <span>Tracker</span>
          </h3>
        </div>

        <nav className="sidebar-nav">
          <ul className="ul-list grid grid-flow-row">
            <li className="li active flex items-center">
              <FaHome className="fa-icon" />
              <Link href="/dashboard">Dashboard</Link>
            </li>

            <li className="li flex items-center">
              <FaDumbbell className="fa-icon" />
              <Link href="/workout">Workouts</Link>
            </li>

            <li className="li flex items-center">
              <FaWeight className="fa-icon" />
              <Link href="/log-weight">Log weight</Link>
            </li>

            <li className="li flex items-center">
              <BsBarChartLine className="fa-icon" />
              <Link href="/progress">Progress</Link>
            </li>

            <li className="li flex items-center">
              <FaPersonRunning className="fa-icon" />
              <Link href="/exercise">Övningar</Link>
            </li>

            <li className="li flex items-center">
              <MdOutlineLocalFireDepartment className="fa-icon" />
              <Link href="/calories">Calories</Link>
            </li>

            <li className="li flex items-center">
              <FaUtensils className="fa-icon" />
              <Link href="/meals">Meals</Link>
            </li>

            <li className="li flex items-center">
              <FaHistory className="fa-icon" />
              <Link href="/history">History</Link>
            </li>

            <li className="li flex items-center">
              <IoIosSettings className="fa-icon" />
              <Link href="/account/setting">Settings</Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="sidebar-bottom">
        <div className="sidebar-bottom-wrapper flex items-center justify-center">
          <BsPersonCircle />

          {/* <p>
            <small>{user.username}</small>
          </p> */}
        </div>

        <div className="logout-wrapper mt-5 flex justify-center">
          <Button type="button" variant="secondary" onClick={handleLogout}>
            Logga ut
          </Button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
