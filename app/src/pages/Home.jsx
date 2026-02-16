import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

export default function Home() {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                // Fetch up to 4 active products. 
                // Ideal: where('is_featured', '==', true) but we don't have that flag set in DB yet.
                // Fallback: just get 4 active products.
                const q = query(
                    collection(db, 'products'),
                    where('is_active', '==', true),
                    where('is_featured', '==', true),
                    limit(4)
                );

                const querySnapshot = await getDocs(q);
                const products = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setFeaturedProducts(products);
            } catch (error) {
                console.error("Error fetching featured products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

    return (
        <>
            <section className="hero">
                <div className="container hero__inner">
                    <div className="hero__content">
                        <span className="hero__badge">✨ Premium Handcrafted Seasonings</span>
                        <h1 className="hero__title">
                            The <span>Authentic Taste</span> of the Caribbean
                        </h1>
                        <p className="hero__description">
                            Elevate every meal with our collection of 9 small-batch seasoning blends. Crafted from traditional family
                            recipes to bring the bold, vibrant soul of the islands to your kitchen.
                        </p>
                        <div className="hero__buttons">
                            <Link to="/shop" className="btn btn--primary btn--lg">Shop The Collection</Link>
                            <Link to="/about" className="btn btn--outline btn--lg">Discover Our Story</Link>
                        </div>
                        <div className="hero__trust mt-8">
                            <span>🌿 All Natural</span>
                            <span>•</span>
                            <span>🇭🇹 100% Authentic</span>
                            <span>•</span>
                            <span>⭐ Premium Quality</span>
                        </div>
                    </div>
                    <div className="hero__image">
                        <img src="/images/hero-bottles.png" alt="GOU PA NOU Caribbean Seasoning Bottles"
                            onError={(e) => e.target.src = 'https://placehold.co/600x600/FDF8F3/8B1E3F?text=GOU+PA+NOU%0ASeasonings'} />
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="features__header">
                        <h2 className="features__title">Our Best Sellers</h2>
                        <p className="features__subtitle">Discover the flavors that our customers can't get enough of</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : featuredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {featuredProducts.map(product => (
                                <article key={product.id} className="product-card h-full flex flex-col">
                                    <Link to={`/products/${product.slug || product.id}`}>
                                        <div className="product-card__image relative">
                                            {product.stock_quantity <= 0 && (
                                                <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                                                    Sold Out
                                                </span>
                                            )}
                                            <img
                                                src={product.image_url || 'https://placehold.co/400x400?text=No+Image'}
                                                alt={product.name}
                                                onError={(e) => e.target.src = 'https://placehold.co/400x400/FFFFFF/8B1E3F?text=GOU+PA+NOU'}
                                                className="w-full h-full object-cover aspect-square"
                                            />
                                        </div>
                                    </Link>
                                    <div className="product-card__content flex-1 flex flex-col">
                                        <h3 className="product-card__name text-lg font-bold mb-1">{product.name}</h3>
                                        <p className="product-card__weight text-sm text-gray-500 mb-2">4 oz / 113g</p>
                                        <p className="product-card__description text-sm text-gray-600 mb-4 flex-1 line-clamp-2">
                                            {product.description}
                                        </p>
                                        <div className="product-card__footer mt-auto flex justify-between items-center">
                                            <Link to={`/products/${product.slug || product.id}`} className="btn btn--primary w-full text-center">
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <p className="text-gray-500">Check out our shop for all products!</p>
                            <Link to="/shop" className="btn btn--primary mt-4">Go to Shop</Link>
                        </div>
                    )}

                    <div className="text-center mt-12">
                        <Link to="/shop" className="btn btn--outline btn--lg">View All Flavors</Link>
                    </div>
                </div>
            </section>

            <section className="section section--cream features">
                <div className="container">
                    <div className="features__header">
                        <h2 className="features__title">Why Choose GOU PA NOU?</h2>
                        <p className="features__subtitle">We bring the authentic taste of the Caribbean to your kitchen</p>
                    </div>

                    <div className="features__grid">
                        <div className="feature-card">
                            <div className="feature-card__icon">🌿</div>
                            <h3 className="feature-card__title">All-Natural Ingredients</h3>
                            <p className="feature-card__text">No artificial preservatives or fillers. Just pure, authentic Caribbean spices and herbs.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-card__icon">👨‍👩‍👧‍👦</div>
                            <h3 className="feature-card__title">Family Recipes</h3>
                            <p className="feature-card__text">Each blend is crafted from recipes passed down through generations of Caribbean families.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-card__icon">🏝️</div>
                            <h3 className="feature-card__title">Island Heritage</h3>
                            <p className="feature-card__text">We honor our Caribbean roots by bringing authentic island flavors to tables worldwide.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="about-section">
                        <div className="about-section__image">
                            <img src="/images/about-preview.png" alt="Caribbean spices and ingredients"
                                onError={(e) => e.target.src = 'https://placehold.co/600x500/FDF8F3/8B1E3F?text=Caribbean%0AHeritage'}
                                style={{ aspectRatio: '6/5', objectFit: 'cover', borderRadius: '1rem' }} />
                        </div>
                        <div className="about-section__content">
                            <h2>A Taste of <span className="text-primary">Caribbean Heritage</span></h2>
                            <p>
                                GOU PA NOU was born from a passion for authentic Caribbean cooking. Our name, meaning "Taste of Ours" in
                                Haitian Creole, reflects our mission to share the rich culinary traditions of the Caribbean islands with the
                                world.
                            </p>
                            <p>
                                Each bottle is a celebration of the vibrant flavors, aromatic spices, and time-honored recipes that make
                                Caribbean cuisine so beloved. From the first sprinkle to the last bite, experience the warmth of the
                                islands.
                            </p>
                            <Link to="/about" className="btn btn--primary">Learn More About Us</Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="newsletter">
                <div className="container newsletter__inner">
                    <h2 className="newsletter__title">Join the GOU PA NOU Family</h2>
                    <p className="newsletter__text">Subscribe for exclusive recipes, special offers, and Caribbean cooking tips delivered to your inbox.</p>
                    <form className="newsletter__form" onSubmit={(e) => e.preventDefault()}>
                        <input type="email" className="newsletter__input" placeholder="Enter your email address" required />
                        <button type="submit" className="btn btn--white">Subscribe</button>
                    </form>
                </div>
            </section>
        </>
    );
}
