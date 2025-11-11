import React from 'react';

export const TranslateIcon: React.FC<{ className?: string }> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m5 12 5 5L20 7"/>
    <path d="m5 7 5 5"/>
  </svg>
);

export const CogIcon: React.FC<{ className?: string }> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/>
    <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
    <path d="M12 2v2"/>
    <path d="M12 22v-2"/>
    <path d="m17 20.66-1-1.73"/>
    <path d="m8 4.93-1 1.73"/>
    <path d="m22 12-2 0"/>
    <path d="m4 12-2 0"/>
    <path d="m20.66 7-1.73 1"/>
    <path d="m4.93 16 1.73 1"/>
  </svg>
);


export const BookOpenIcon: React.FC<{ className?: string }> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);