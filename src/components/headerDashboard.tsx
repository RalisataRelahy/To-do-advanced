import React from 'react';

interface NavItem {
    label: string;
    href: string;
    icon?: React.ReactNode;
}

interface HeaderDashboardProps {
    navItems?: NavItem[];
    onLogoClick?: () => void;
}

export const HeaderDashboard: React.FC<HeaderDashboardProps> = ({
    navItems = [],
    onLogoClick,
}) => {
    return (
        <header className="bg-white shadow">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div 
                        className="flex-shrink-0 cursor-pointer font-bold text-xl"
                        onClick={onLogoClick}
                    >
                    <h1>Personal Dashboard</h1>
                    </div>
                    
                    <div className="flex gap-4">
                        {navItems.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                {item.icon && <span className="mr-2">{item.icon}</span>}
                                {item.label}
                            </a>
                        ))}
                    </div>
                </div>
            </nav>
        </header>
    );
};