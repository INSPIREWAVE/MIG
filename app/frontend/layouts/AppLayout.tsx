import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { ThemeProvider, ThemeSwitcher } from '../components/ThemeProvider';

const navItems = [
  { id: 'clients', label: 'Clients' },
  { id: 'loans', label: 'Loans' },
  { id: 'payments', label: 'Payments' },
  { id: 'reports', label: 'Reports' }
];

export const AppLayout = ({ children }: { children: JSX.Element }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ThemeProvider>
      <div>
        <Sidebar items={navItems} collapsed={collapsed} onToggle={() => setCollapsed((state) => !state)} />
        <main>
          <ThemeSwitcher />
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
};
