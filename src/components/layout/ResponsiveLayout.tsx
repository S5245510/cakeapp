import React from 'react';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`min-h-screen w-full ${className}`}>
      {children}
    </div>
  );
};

export default ResponsiveLayout;