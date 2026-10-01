import { useState } from 'react';
import {
  Home,
  LayoutGrid,
  ShoppingCart,
  Clock,
  User,
  Search,
  ChevronDown,
  PawPrint,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import './Header.css';
import logo from '../../assets/branch.png';

export type NavKey = 'Home' | 'Product' | 'Cart' | 'Order History' | 'Account';

const NAV: { key: NavKey; icon: LucideIcon; href: string }[] = [
  { key: 'Home', icon: Home, href: '/' },
  { key: 'Product', icon: LayoutGrid, href: '/products' },
  { key: 'Cart', icon: ShoppingCart, href: '/cart' },
  { key: 'Order History', icon: Clock, href: '/orders' },
  { key: 'Account', icon: User, href: '/account' },
];

type HeaderProps = {
  active?: NavKey;
  cartCount?: number;
  avatar?: string; 
  onSearch?: (keyword: string) => void;
};

export default function Header({ active = 'Home', cartCount = 0, avatar, onSearch }: HeaderProps) {
  const [keyword, setKeyword] = useState('');

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a href="/" className="brand">
          <span className="brand__icon">
            <img src={logo} alt="Plushie logo" />
          </span>
          <span>
            <strong>Plushie Kat</strong>
            <small>More Hugs, Less Worries</small>
          </span>
        </a>

        <nav className="site-nav" aria-label="Main">
          {NAV.map(({ key, icon: Icon, href }) => (
            <a
              key={key}
              href={href}
              className={`site-nav__item ${key === active ? 'is-active' : ''}`}
              aria-current={key === active ? 'page' : undefined}
            >
              <Icon size={18} aria-hidden /> {key}
            </a>
          ))}
        </nav>

        <div className="site-tools">
          <form
            className="site-search"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              onSearch?.(keyword.trim());
            }}
          >
            <input
              type="search"
              placeholder="Search for plushies..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              aria-label="Search for plushies"
            />
            <button type="submit" aria-label="Search">
              <Search size={18} />
            </button>
          </form>

          <a href="/cart" className="site-cart" aria-label={`Cart, ${cartCount} items`}>
            <ShoppingCart size={26} />
            {cartCount > 0 && <span className="site-cart__count">{cartCount}</span>}
          </a>

          <button className="site-user" aria-label="Account menu">
            <span className="site-user__avatar">
              {avatar ? <img src={avatar} alt="" /> : <User size={22} />}
            </span>
            <ChevronDown size={16} aria-hidden />
          </button>
        </div>
      </div>
    </header>
  );
}