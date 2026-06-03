import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={`
        bg-white rounded-lg shadow-lg p-8
        border border-gray-100
        ${className || ''}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
