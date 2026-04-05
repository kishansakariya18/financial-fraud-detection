/*import { useNavigate, useLocation } from 'react-router';
import { Home, List, PlusCircle, BarChart2, User } from 'lucide-react';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: <Home size={22} />, label: 'Dashboard', path: '/dashboards/home' },
    { icon: <List size={22} />, label: 'Transactions', path: '/dashboards/transactions' },
    { icon: <BarChart2 size={22} />, label: 'Graphs', path: '/dashboards/analytics' },
    { icon: <User size={22} />, label: 'Profile', path: '/profile' }
  ];

  return (
    <div style={styles.container}>
      {/* Left Items *}
      <div style={styles.side}>
        {navItems.slice(0, 2).map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            style={{
              ...styles.button,
              color: location.pathname === item.path ? '#00C897' : '#6B7280'
            }}>
            {item.icon}
            <span style={styles.label}>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Floating Center Button *}
      <button onClick={() => navigate('/dashboard/create-transaction')} style={styles.fab}>
        <PlusCircle size={28} />
      </button>

      {/* Right Items *}
      <div style={styles.side}>
        {navItems.slice(2).map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            style={{
              ...styles.button,
              color: location.pathname === item.path ? '#00C897' : '#6B7280'
            }}>
            {item.icon}
            <span style={styles.label}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70px',
    background: '#0A2540',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
    zIndex: 1000
  },
  side: {
    display: 'flex',
    gap: '20px'
  },
  button: {
    background: 'none',
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: '12px',
    cursor: 'pointer'
  },
  label: {
    fontSize: '10px'
  },
  fab: {
    position: 'absolute',
    top: '-25px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#00C897',
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
  }
};

const navItems = [
  {
    icon: <Home size={22} />,
    label: "Dashboard",
    path: "/dashboards/home", // ✅ FIXED
  },
  {
    icon: <List size={22} />,
    label: "Transactions",
    path: "/dashboards/transactions", // ✅ FIXED
  },
  {
    icon: <BarChart2 size={22} />,
    label: "Graphs",
    path: "/dashboards/analytics", // ✅ FIXED
  },
  {
    icon: <User size={22} />,
    label: "Profile",
    path: "/profile",
  },
];
*/

import { useNavigate, useLocation } from 'react-router-dom';
import { Home, List, PlusCircle, BarChart2, User, Tags } from 'lucide-react';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  const navItems = [
    {
      icon: <Home size={22} />,
      label: 'Dashboards',
      path: '/dashboards/home'
    },
    {
      icon: <List size={22} />,
      label: 'Transaction',
      path: '/dashboards/transactions'
    },
    {
      icon: 'center', // special case
      label: '',
      path: '/dashboards/transactions/create'
    },
    {
      icon: <BarChart2 size={22} />,
      label: 'Graphs',
      path: '/dashboards/analytics'
    },
    {
      icon: <Tags size={22} />,
      label: 'Category',
      path: '/dashboards/categories'
    },
    {
      icon: <User size={22} />,
      label: 'Profile',
      path: '/profile'
    }
  ];

  return (
    <div style={styles.container}>
      {navItems.map((item, index) => {
        // CENTER BUTTON (FAB)
        if (item.icon === 'center') {
          return (
            <button key={index} onClick={() => navigate(item.path)} style={styles.fab}>
              <PlusCircle size={28} />
            </button>
          );
        }

        return (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            style={{
              ...styles.button,
              color: isActive(item.path) ? '#00C897' : '#6B7280'
            }}>
            {item.icon}
            <span style={styles.label}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ================== STYLES ================== */

const styles = {
  container: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70px',
    background: '#0A2540',
    display: 'flex',
    justifyContent: 'space-evenly', // ✅ KEY FIX
    alignItems: 'center',
    zIndex: 1000,
    borderTop: '1px solid #1F2937'
  },

  button: {
    background: 'none',
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: '12px',
    cursor: 'pointer'
  },

  label: {
    fontSize: '10px',
    marginTop: '2px'
  },

  fab: {
    position: 'relative', // ✅ IMPORTANT (not absolute)
    background: '#00C897',
    borderRadius: '50%',
    width: '55px',
    height: '55px',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    cursor: 'pointer',
    marginTop: '-25px', // slight lift
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
  }
};
