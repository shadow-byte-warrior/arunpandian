import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import {
  LayoutDashboard,
  Settings,
  FolderOpen,
  PenTool,
  Briefcase,
  Mail,
  LogOut,
  ArrowLeft,
  Menu,
  X,
  Sparkles,
  UserRound,
  Wrench,
  Award,
  AtSign,
  Palette,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
      { name: 'Inbox', path: '/admin/inbox', icon: Mail },
    ],
  },
  {
    label: 'Site content',
    items: [
      { name: 'Hero', path: '/admin/settings/hero', icon: Sparkles },
      { name: 'About', path: '/admin/settings/about', icon: UserRound },
      { name: 'Skills', path: '/admin/settings/skills', icon: Wrench },
      { name: 'Certifications', path: '/admin/settings/certifications', icon: Award },
      { name: 'Contact', path: '/admin/settings/contact', icon: AtSign },
    ],
  },
  {
    label: 'Collections',
    items: [
      { name: 'Projects', path: '/admin/projects', icon: FolderOpen },
      { name: 'Experience', path: '/admin/experiences', icon: Briefcase },
      { name: 'Blogs', path: '/admin/blogs', icon: PenTool },
    ],
  },
  {
    label: 'System',
    items: [
      { name: 'Theme', path: '/admin/settings/theme', icon: Palette },
      { name: 'SEO', path: '/admin/settings/seo', icon: Search },
      { name: 'Settings', path: '/admin/settings', icon: Settings },
    ],
  },
];

const navItems = navGroups.flatMap((g) => g.items);

export default function AdminLayout() {
  const [userEmail, setUserEmail] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserEmail(user.email);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Dark theme */}
      <motion.aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold">
              AP
            </div>
            <div>
              <div className="font-bold text-sm tracking-wide">ADMIN PANEL</div>
              <div className="text-[10px] text-slate-400">Arun Pandian</div>
            </div>
          </div>
          <button onClick={closeSidebar} className="lg:hidden text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-5 space-y-5 overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.label}>
              <div className="px-4 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                {group.label}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={closeSidebar}
                      className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-slate-800 text-white'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <Icon size={17} className={isActive ? 'text-blue-400' : 'text-slate-500'} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 shrink-0 space-y-4">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-blue-400">
              {userEmail ? userEmail.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs text-slate-400 truncate">{userEmail}</div>
              <div className="text-[10px] text-slate-500">Administrator</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700"
          >
            <LogOut size={16} />
            Sign Out
          </button>
          
          <Link
            to="/"
            className="flex w-full items-center justify-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Site
          </Link>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 shrink-0 items-center border-b border-slate-200 bg-white px-6 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-slate-500 hover:text-slate-700 mr-4"
          >
            <Menu size={20} />
          </button>
          <h2 className="text-xl font-bold text-slate-800">
            {navItems.find(i => i.path === location.pathname)?.name || 'Dashboard'}
          </h2>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
