import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const links = [
  ['Home', '/'],
  ['Reserve', '/reserve'],
  ['Restock', '/restock'],
  ['Availability', '/availability'],
  ['QCM', '/quality'],
  ['Contact', '/contact']
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="sticky top-3 z-50 mx-3 rounded-full glass px-4 py-2">
      <div className="flex items-center justify-between">
        <Link to="/" className="font-semibold">🥭 K&N Import & Export</Link>
        <button className="md:hidden" onClick={() => setOpen(!open)}><Menu /></button>
        <div className="hidden gap-4 md:flex">{links.map(([l,h]) => <Link key={h} to={h}>{l}</Link>)}</div>
      </div>
      {open && <div className="mt-2 flex flex-col gap-2 md:hidden">{links.map(([l,h]) => <Link key={h} to={h}>{l}</Link>)}</div>}
    </nav>
  );
}
