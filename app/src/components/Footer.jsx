import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__grid">
                    <div className="footer__brand">
                        <div className="footer__logo">GOU PA NOU</div>
                        <p>Authentic Caribbean seasonings crafted with love and tradition. Bringing the vibrant flavors of the islands to your kitchen.</p>
                        <div className="footer__social">
                            <a href="#" aria-label="Facebook">📘</a>
                            <a href="#" aria-label="Instagram">📷</a>
                            <a href="#" aria-label="Pinterest">📌</a>
                        </div>
                    </div>

                    <div className="footer__column">
                        <h4>Quick Links</h4>
                        <ul className="footer__links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/shop">Our Flavors</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                        </ul>
                    </div>

                    <div className="footer__column">
                        <h4>Shop</h4>
                        <ul className="footer__links">
                            <li><a href="#">Buy on Etsy</a></li>
                            <li><a href="#">Buy on Amazon</a></li>
                            <li><Link to="/shop">All Products</Link></li>
                        </ul>
                    </div>

                    <div className="footer__column">
                        <h4>Contact</h4>
                        <ul className="footer__links">
                            <li><a href="mailto:hello@goupanouseasonings.com">hello@goupanouseasonings.com</a></li>
                            <li><Link to="/contact">Send a Message</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="footer__bottom">
                    <p>&copy; {new Date().getFullYear()} GOU PA NOU Seasonings. All rights reserved.</p>
                    <p>Made with ❤️ in the Caribbean</p>
                </div>
            </div>
        </footer>
    );
}
