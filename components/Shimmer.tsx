
import React from 'react';

const Shimmer: React.FC = () => (
  <div className="space-y-4">
    <div className="h-16 w-3/4 rounded-lg bg-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" style={{ backgroundSize: '2000px 100%' }}></div>
    </div>
    <div className="h-4 w-1/2 rounded-lg bg-white/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" style={{ backgroundSize: '2000px 100%' }}></div>
    </div>
  </div>
);

export default Shimmer;
