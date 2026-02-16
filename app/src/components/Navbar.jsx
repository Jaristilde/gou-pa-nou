import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const { cartCount } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    return (
        <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container header__inner">
                <Link to="/" className="logo">
                    <div>
                        <div className="logo__text">GOU PA NOU</div>
                        <div className="logo__tagline">Caribbean Seasonings</div>
                    </div>
                </Link>

                <div className="flex items-center gap-4 md:hidden">
                    <Link to="/cart" className="relative p-2 text-gray-800 hover:text-primary transition-colors">
                        <ShoppingCart size={24} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                    <button
                        className={`nav-toggle ${isMenuOpen ? 'active' : ''}`}
                        aria-label="Toggle navigation"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <span className="nav-toggle__bar"></span>
                        <span className="nav-toggle__bar"></span>
                        <span className="nav-toggle__bar"></span>
                    </button>
                </div>

                <nav className={`nav ${isMenuOpen ? 'active' : ''}`}>
                    <ul className="nav__list">
                        <li>
                            <Link to="/" className={`nav__link ${location.pathname === '/' ? 'active' : ''}`}>
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/shop" className={`nav__link ${location.pathname === '/shop' ? 'active' : ''}`}>
                                Our Flavors
                            </Link>
                        </li>
                        <li>
                            <Link to="/about" className={`nav__link ${location.pathname === '/about' ? 'active' : ''}`}>
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact" className={`nav__link ${location.pathname === '/contact' ? 'active' : ''}`}>
                                Contact
                            </Link>
                        </li>
                        <li className="hidden md:block">
                            <Link to="/cart" className={`nav__link flex items-center gap-1 ${location.pathname === '/cart' ? 'active' : ''}`}>
                                <div className="relative">
                                    <ShoppingCart size={20} />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                                            {cartCount}
                                        </span>
                                    )}
                                </div>
                                <span>Cart</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}
