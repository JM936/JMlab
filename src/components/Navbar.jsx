import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between">
        <Link href="/">
          <a className="text-white font-bold">GeotechLab</a>
        </Link>
        <div className="flex space-x-4">
          <Link href="/ensaios">
            <a className="text-gray-300 hover:text-white">Ensaios</a>
          </Link>
          <Link href="/blog">
            <a className="text-gray-300 hover:text-white">Blog</a>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; // Exportação padrão adicionada
