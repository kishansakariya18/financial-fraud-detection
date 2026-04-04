/*
import { Bell, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router';

export function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <header style={styles.header}>
      <h2 style={styles.title}>Dashboard</h2>

      <div style={styles.right}>
        {/* Notification *}
        <div style={styles.iconWrapper}>
          <Bell size={20} />
          <span style={styles.badge}></span>
        </div>

        {/* Logout Button *}
        <button onClick={handleLogout} style={styles.logoutBtn}>
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}

const styles = {
  header: {
    height: '60px',
    background: '#ffffff',
    borderBottom: '1px solid #E5E7EB',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 30px'
  },

  title: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827'
  },

  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },

  iconWrapper: {
    position: 'relative',
    cursor: 'pointer',
    color: '#374151'
  },

  badge: {
    position: 'absolute',
    top: '-3px',
    right: '-3px',
    width: '8px',
    height: '8px',
    background: '#EF4444',
    borderRadius: '50%'
  },

  logoutBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#EF4444'
  }
};
*/
import { Bell, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router';

export function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // clear auth
    navigate('/login'); // redirect
  };

  return (
    <header style={styles.header}>
      {/* LEFT */}
      <h2 style={styles.title}>Dashboard</h2>

      {/* RIGHT */}
      <div style={styles.right}>
        {/* Notification */}
        <div style={styles.iconWrapper}>
          <Bell size={20} />
          <span style={styles.badge}></span>
        </div>

        {/* Logout Button */}
        <button style={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}

const styles = {
  header: {
    height: '60px',
    background: '#ffffff',
    borderBottom: '1px solid #E5E7EB',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 30px'
  },

  title: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827'
  },

  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px' // spacing between bell & logout
  },

  iconWrapper: {
    position: 'relative',
    cursor: 'pointer',
    color: '#374151'
  },

  badge: {
    position: 'absolute',
    top: '-3px',
    right: '-3px',
    width: '8px',
    height: '8px',
    background: '#EF4444',
    borderRadius: '50%'
  },

  logoutBtn: {
    background: 'transparent',
    border: '1px solid #EF4444',
    color: '#EF4444',
    padding: '5px 10px',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};
