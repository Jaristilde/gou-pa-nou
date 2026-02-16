import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useCart } from '../context/CartContext';
import { Minus, Plus, ShoppingCart, ArrowLeft } from 'lucide-react';

export default function ProductDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                // Try to find by slug first
                const q = query(collection(db, 'products'), where('slug', '==', slug));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const docData = querySnapshot.docs[0];
                    setProduct({ id: docData.id, ...docData.data() });
                } else {
                    // Fallback: try by ID directly (if slug is actually an ID)
                    const docRef = doc(db, 'products', slug);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setProduct({ id: docSnap.id, ...docSnap.data() });
                    } else {
                        console.error("No such product!");
                        navigate('/shop');
                    }
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchProduct();
    }, [slug, navigate]);

    const handleAddToCart = () => {
        if (!product) return;
        setAdding(true);
        addToCart(product, quantity);
        setTimeout(() => setAdding(false), 500);
    };

    if (loading) return (
        <div className="container section min-h-[60vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    if (!product) return null;

    return (
        <div className="container section">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-500 hover:text-primary mb-8"
            >
                <ArrowLeft size={20} />
                Back to Shop
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="product-detail__image bg-gray-50 rounded-lg overflow-hidden">
                    <img
                        src={product.image_url || 'https://placehold.co/600x600'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="product-detail__content">
                    <span className="text-primary font-bold uppercase tracking-wider text-sm mb-2 block">
                        {product.category === 'spice' ? 'Spice Blend' : 'Local Menu'}
                    </span>
                    <h1 className="text-4xl font-bold mb-4 font-heading">{product.name}</h1>
                    <div className="text-2xl font-bold text-gray-900 mb-6">${product.price}</div>

                    <div className="prose text-gray-600 mb-8">
                        <p>{product.description}</p>
                    </div>

                    {product.stock_quantity > 0 ? (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <span className="font-medium text-gray-700">Quantity:</span>
                                <div className="flex items-center border border-gray-300 rounded-md">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="p-2 hover:bg-gray-100 disabled:opacity-50"
                                        disabled={quantity <= 1}
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="w-12 text-center font-medium">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                                        className="p-2 hover:bg-gray-100 disabled:opacity-50"
                                        disabled={quantity >= product.stock_quantity}
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                                <span className="text-sm text-gray-500">
                                    {product.stock_quantity} available
                                </span>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    className={`flex-1 btn btn--primary py-3 flex items-center justify-center gap-2 ${adding ? 'bg-green-600 border-green-600' : ''}`}
                                >
                                    <ShoppingCart size={20} />
                                    {adding ? 'Added to Cart!' : 'Add to Cart'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                            Out of Stock. Please check back later.
                        </div>
                    )}

                    <div className="mt-12 border-t border-gray-200 pt-8">
                        <h3 className="font-bold text-lg mb-4">Product Details</h3>
                        <ul className="space-y-2 text-gray-600">
                            <li>• Authentic Caribbean Recipe</li>
                            <li>• 100% Natural Ingredients</li>
                            <li>• No MSG or Preservatives</li>
                            {product.category === 'spice' && <li>• Net Weight: 4 oz / 113g</li>}
                        </ul>

                        {product.ingredients && (
                            <div className="mt-6">
                                <h4 className="font-semibold text-md mb-2">Ingredients:</h4>
                                <p className="text-gray-600">{product.ingredients}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
