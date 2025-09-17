"use client"

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-20 p-4 flex justify-between items-center bg-transparent">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Abrir menu"
        className="text-white z-50 bg-black/50 rounded cursor-pointer"
      >
        {open ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Menu dropdown */}
      <nav
        className={`fixed top-0 right-0 h-full w-52 bg-[#1e3a5f]/80 text-white transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <ul className="flex flex-col mt-20 space-y-2 px-4">
          <li className='hover:bg-[#1e3a5f] p-4 rounded-2xl transition-all duration-300 cursor-pointer'>
            <Link href={'#hero'} onClick={() => setOpen(false)}>Inicio</Link>
          </li>
           <li className='hover:bg-[#1e3a5f] p-4 rounded-2xl transition-all duration-300 cursor-pointer'>
            <Link href={'#about'} onClick={() => setOpen(false)}>Sobre</Link>
          </li>
          <li className='hover:bg-[#1e3a5f] p-4 rounded-2xl transition-all duration-300 cursor-pointer'>
            <Link href={'#services'} onClick={() => setOpen(false)}>Serviços</Link>
          </li>
          <li className='hover:bg-[#1e3a5f] p-4 rounded-2xl transition-all duration-300 cursor-pointer'>
            <Link href={'#works'} onClick={() => setOpen(false)}>Trabalhos</Link>
          </li>
          <li className='hover:bg-[#1e3a5f] p-4 rounded-2xl transition-all duration-300 cursor-pointer'>
            <Link href={'#contact'} onClick={() => setOpen(false)}>Contato</Link>
          </li>

        </ul>
      </nav>
    </header>
  );
}
