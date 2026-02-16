import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
    return (
        <article className="product-card h-full flex flex-col">
            <Link to={`/products/${product.slug || product.id}`}>
                <div className="product-card__image relative">
                    {product.stock_quantity <= 0 && (
                        <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                            Sold Out
                        </span>
                    )}
                    {product.stock_quantity > 0 && product.stock_quantity < 10 && (
                        <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                            Low Stock
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
                    <span className="product-card__price text-xl font-bold text-primary">${product.price}</span>
                    <Link
                        to={`/products/${product.slug || product.id}`}
                        className={`btn btn--primary text-sm ${product.stock_quantity <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {product.stock_quantity > 0 ? 'View Details' : 'Sold Out'}
                    </Link>
                </div>
            </div>
        </article>
    );
}
