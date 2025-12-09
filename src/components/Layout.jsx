import React from 'react';
import Header from './Header';

function Layout({ children, logoText, showNav }) {
  return (
    <> 
      <Header logoText={logoText} showNav={showNav} />
      <main className="container">
        {children}
      </main>
    </>
  );
}

export default Layout;