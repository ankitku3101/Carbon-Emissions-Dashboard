import Link from 'next/link';
import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-green-100/60 fixed w-full z-20 top-0 start-0 border-b border-gray-200">
      <div className="max-w-screen-xl mx-auto p-4 flex justify-center">
        <ul className="flex font-semibold gap-6">
          <li>
            <Link href={'#'} className='hover:text-gray-700'>Home</Link>
          </li>
          <li>
            <Link href={'#'} className='hover:text-gray-700'>Statistics</Link>
          </li>
          <li>
            <Link href={'#'} className='hover:text-gray-700'>Hotspots</Link>
          </li>
          <li>
            <Link href={'#'} className='hover:text-gray-700'>Prediction</Link>
          </li>
          <li>
            <Link href={'#'} className='hover:text-gray-700'>Alerts</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
