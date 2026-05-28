
import React from 'react';

interface LayoutProps {
  currentView: string;
  onNavigate: (view: any) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, onNavigate, children }) => {
  const navItems = [
    { id: 'home', label: '序言' },
    { id: 'intro', label: '背景' },
    { id: 'explore', label: '画卷' },
    { id: 'method', label: '术理' },
  ];

  const showNavBackground = currentView !== 'home';

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col select-none">
      {/* 顶部导航 */}
      <nav className={`absolute top-0 left-0 w-full z-50 flex justify-between items-center px-8 py-6 pointer-events-none transition-all duration-500 ${showNavBackground ? 'bg-black/80 backdrop-blur-md' : ''}`}>
        <div className="flex items-center gap-4 pointer-events-auto cursor-pointer" onClick={() => onNavigate('home')}>
          <div className="w-8 h-8 flex items-center justify-center">
            <img 
              src="/images/logo/Simplification.svg" 
              alt="Logo" 
              className="w-full h-full object-contain" 
            />
          </div>
          <h1 className="text-xl font-bold tracking-widest chinese-font">豳风数字交互平台</h1>
        </div>

        <div className="flex gap-8 pointer-events-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`text-sm tracking-[0.2em] transition-all duration-500 hover:text-[#c5a059] ${
                currentView === item.id ? 'text-[#c5a059] font-bold' : 'text-white/60'
              }`}
            >
              {item.label}
              {currentView === item.id && (
                <div className="h-[1px] bg-[#c5a059] w-full mt-1 scale-x-100 transition-transform origin-left" />
              )}
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-1 w-full h-full relative">
        {children}
      </main>
    </div>
  );
};

export default Layout;
