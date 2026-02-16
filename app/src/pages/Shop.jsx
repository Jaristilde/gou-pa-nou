import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import ProductCard from '../components/ProductCard';

export default function Shop() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all' or category_id

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch Categories
                const catQuery = query(collection(db, 'categories'), orderBy('name'));
                const catSnapshot = await getDocs(catQuery);
                setCategories(catSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

                // Fetch Products
                const prodQuery = query(
                    collection(db, 'products'),
                    where('is_active', '==', true)
                );
                const prodSnapshot = await getDocs(prodQuery);
                const productsData = prodSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Client-side sort
                productsData.sort((a, b) => a.name.localeCompare(b.name));
                setProducts(productsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredProducts = filter === 'all'
        ? products
        : products.filter(p => p.category_id === filter);

    if (loading) return (
        <div className="container section min-h-[60vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="container section">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4 font-heading">Our Flavors</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Discover the authentic taste of the Caribbean with our handcrafted spice blends and local food offerings.
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-10">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${filter === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                    All Products
                </button>
                {categories.map(category => (
                    <button
                        key={category.id}
                        onClick={() => setFilter(category.id)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${filter === category.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            {filteredProducts.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No products found in this category.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
