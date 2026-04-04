/*
import { Outlet } from 'react-router';
import BottomNav from 'components/shared/BottomNav';
import { Header } from './Header';

export default function MainLayout() {
  return (
    <div style={styles.container}>
      <Header />

      <main style={styles.main}>
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#0A2540'
  },

  main: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px'
  }
};
*/

import { Outlet } from 'react-router';
import BottomNav from 'components/shared/BottomNav';
import { Header } from './Header';

export default function MainLayout() {
  return (
    <div style={styles.container}>
      <Header />

      <main style={styles.main}>
        <div style={styles.content}>
          <Outlet />
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#F9FAFB' // ✅ light background
  },

  main: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    padding: '30px 20px'
  },

  content: {
    width: '100%',
    maxWidth: '1200px', // ✅ perfect for laptops
    background: '#ffffff',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
  }
};
