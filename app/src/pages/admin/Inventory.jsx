import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { Save, AlertTriangle, CheckCircle } from 'lucide-react';

export default function Inventory() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [updates, setUpdates] = useState({});

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const q = query(collection(db, 'products'), orderBy('name', 'asc'));
            const snap = await getDocs(q);
            setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error('Error fetching inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = (id, value) => {
        setUpdates(prev => ({ ...prev, [id]: parseInt(value) || 0 }));
    };

    const handleSave = async (id) => {
        if (updates[id] === undefined) return;

        try {
            setSaving(id);
            await updateDoc(doc(db, 'products', id), {
                stock_quantity: updates[id]
            });
            // Update local state
            setProducts(prev => prev.map(p => p.id === id ? { ...p, stock_quantity: updates[id] } : p));
            // Remove from updates
            const newUpdates = { ...updates };
            delete newUpdates[id];
            setUpdates(newUpdates);
        } catch (error) {
            alert('Error updating stock: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-6xl">
            <h1 className="text-2xl font-bold mb-6">Inventory Management</h1>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 text-sans">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Current Stock</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Threshold</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Update Qty</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan="5" className="px-6 py-4 text-center">Loading inventory...</td></tr>
                        ) : products.length === 0 ? (
                            <tr><td colSpan="5" className="px-6 py-4 text-center">No products found.</td></tr>
                        ) : (
                            products.map((p) => {
                                const currentQty = updates[p.id] !== undefined ? updates[p.id] : p.stock_quantity;
                                const isLowStock = currentQty <= (p.low_stock_threshold || 10);

                                return (
                                    <tr key={p.id} className={isLowStock ? 'bg-red-50' : ''}>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{p.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">{p.stock_quantity}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{p.low_stock_threshold || 10}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {isLowStock ? (
                                                <span className="flex items-center gap-1 text-red-600 font-bold text-sm">
                                                    <AlertTriangle size={14} /> Low Stock
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-green-600 font-semibold text-sm">
                                                    <CheckCircle size={14} /> Healthy
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex justify-end gap-2">
                                                <input
                                                    type="number"
                                                    value={updates[p.id] !== undefined ? updates[p.id] : p.stock_quantity}
                                                    onChange={(e) => handleQuantityChange(p.id, e.target.value)}
                                                    className="w-20 px-2 py-1 border border-gray-300 rounded focus:border-primary focus:outline-none text-right"
                                                />
                                                <button
                                                    onClick={() => handleSave(p.id)}
                                                    disabled={updates[p.id] === undefined || saving === p.id}
                                                    className="bg-gray-800 text-white p-1 rounded hover:bg-black disabled:opacity-30 transition-colors"
                                                    title="Save Change"
                                                >
                                                    <Save size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
