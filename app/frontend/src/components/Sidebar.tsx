import type { ReactNode } from 'react';

type SidebarItem = { id: string; label: string; icon?: ReactNode };

type SidebarProps = {
  items: SidebarItem[];
  collapsed: boolean;
  onToggle: () => void;
};

export const Sidebar = ({ items, collapsed, onToggle }: SidebarProps) => (
  <aside aria-label="Primary navigation" data-collapsed={collapsed}>
    <button onClick={onToggle} aria-expanded={!collapsed}>
      {collapsed ? 'Expand' : 'Collapse'}
    </button>
    <nav>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`}>
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  </aside>
);
