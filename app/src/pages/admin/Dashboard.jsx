import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { Package, ShoppingBag, AlertCircle, Tags, ChevronRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalProducts: 0,
        totalCategories: 0,
        lowStockItems: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const productsSnap = await getDocs(collection(db, 'products'));
            const ordersSnap = await getDocs(collection(db, 'orders'));
            const categoriesSnap = await getDocs(collection(db, 'categories'));

            const products = productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            setStats({
                totalOrders: ordersSnap.size,
                totalProducts: productsSnap.size,
                totalCategories: categoriesSnap.size,
                lowStockItems: products.filter(p => p.stock_quantity <= (p.low_stock_threshold || 10))
            });
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-gray-900">Store Overview</h1>
                <p className="text-gray-500">Welcome back! Here is what is happening with your shop today.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <ShoppingBag size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Orders</p>
                        <p className="text-2xl font-bold">{loading ? '...' : stats.totalOrders}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                        <Package size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Active Products</p>
                        <p className="text-2xl font-bold">{loading ? '...' : stats.totalProducts}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                        <Tags size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Categories</p>
                        <p className="text-2xl font-bold">{loading ? '...' : stats.totalCategories}</p>
                    </div>
                </div>

                <div className={`bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4 ${stats.lowStockItems.length > 0 ? 'border-red-200 bg-red-50' : 'border-gray-100'}`}>
                    <div className={`p-3 rounded-lg ${stats.lowStockItems.length > 0 ? 'bg-red-100 text-red-600' : 'bg-gray-50 text-gray-400'}`}>
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Low Stock Alerts</p>
                        <p className={`text-2xl font-bold ${stats.lowStockItems.length > 0 ? 'text-red-600' : ''}`}>
                            {loading ? '...' : stats.lowStockItems.length}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Low Stock List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <AlertCircle size={18} className="text-red-500" />
                            Stock Attention Required
                        </h3>
                        <Link to="/admin/inventory" className="text-primary text-sm font-semibold hover:underline flex items-center">
                            Manage Inventory <ChevronRight size={16} />
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {loading ? (
                            <div className="p-8 text-center text-gray-500">Loading alerts...</div>
                        ) : stats.lowStockItems.length === 0 ? (
                            <div className="p-12 text-center">
                                <p className="text-gray-400">All products are well stocked!</p>
                            </div>
                        ) : (
                            stats.lowStockItems.map(item => (
                                <div key={item.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                    <div>
                                        <p className="font-medium text-gray-900">{item.name}</p>
                                        <p className="text-xs text-gray-500">Current Qty: <span className="text-red-600 font-bold">{item.stock_quantity}</span></p>
                                    </div>
                                    <Link to={`/admin/products/${item.id}`} className="p-2 text-gray-400 hover:text-primary transition-colors">
                                        <ChevronRight size={20} />
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Actions / Tips */}
                <div className="space-y-6">
                    <div className="bg-slate-900 text-white p-8 rounded-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold mb-2">Need to launch a sale?</h3>
                            <p className="text-slate-400 mb-6">Create discount codes to boost your seasonal sales.</p>
                            <Link to="/admin/promotions" className="bg-primary hover:bg-red-800 text-white px-6 py-2 rounded-lg font-bold inline-block transition-colors">
                                Create Promotion
                            </Link>
                        </div>
                        <Tags size={120} className="absolute -right-4 -bottom-4 text-white/5 rotate-12" />
                    </div>

                    <div className="bg-green-50 border border-green-100 p-6 rounded-xl flex gap-4">
                        <div className="p-2 bg-green-100 text-green-700 rounded-full h-fit">
                            <TrendingUp size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-green-900">Pro Tip</h4>
                            <p className="text-sm text-green-800">
                                Keeping your inventory updated ensures customers never see a "Sold Out" message on products you still have in the warehouse.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
