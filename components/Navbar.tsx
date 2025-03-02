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
            <Link href={'#insight'} className='hover:text-gray-700'>Insights</Link>
          </li>
          <li>
            <Link href={'#predict'} className='hover:text-gray-700'>Prediction</Link>
          </li>
          <li>
            <Link href={'#coaltype'} className='hover:text-gray-700'>Coal Type</Link>
          </li>
          <li>
            <Link href={'#energyproduction'} className='hover:text-gray-700'>Energy Production</Link>
          </li>
          <li>
            <Link href={'#totalemissions'} className='hover:text-gray-700'>Total Emissions</Link>
          </li>
          <li>
            <Link href={'#tracker'} className='hover:text-gray-700'>Tracker</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
