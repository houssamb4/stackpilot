import React from 'react';

interface LoaderProps {
  size?: number;
  color?: string;
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ 
  size = 36, 
  color = '#10b981',
  className = '' 
}) => {
  return (
    <div
      className={`loader ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        border: `4px solid rgba(0, 0, 0, .1)`,
        borderLeftColor: color,
        borderRadius: '50%',
        animation: 'spin89345 1s linear infinite',
      }}
    />
  );
};

export const LoaderFullPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader size={48} />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
};
