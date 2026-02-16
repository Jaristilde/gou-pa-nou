import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { Plus, Pencil, Trash2, X, Check, Tags } from 'lucide-react';

export default function Promotions() {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        discount_type: 'percentage',
        discount_value: '',
        is_active: true
    });

    useEffect(() => {
        fetchPromotions();
    }, []);

    const fetchPromotions = async () => {
        try {
            setLoading(true);
            const q = query(collection(db, 'promotions'), orderBy('code', 'asc'));
            const snap = await getDocs(q);
            setPromotions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error('Error fetching promotions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'promotions'), {
                ...formData,
                discount_value: parseFloat(formData.discount_value),
                created_at: serverTimestamp()
            });
            setIsAdding(false);
            setFormData({ code: '', discount_type: 'percentage', discount_value: '', is_active: true });
            fetchPromotions();
        } catch (error) {
            alert('Error adding promotion: ' + error.message);
        }
    };

    const toggleStatus = async (promo) => {
        try {
            await updateDoc(doc(db, 'promotions', promo.id), {
                is_active: !promo.is_active
            });
            fetchPromotions();
        } catch (error) {
            alert('Error updating status: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this promotion code?')) return;
        try {
            await deleteDoc(doc(db, 'promotions', id));
            fetchPromotions();
        } catch (error) {
            alert('Error deleting: ' + error.message);
        }
    };

    return (
        <div className="max-w-5xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Promotions & Coupons</h1>
                    <p className="text-gray-500 text-sm">Create and manage discount codes for your customers.</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark transition-colors"
                >
                    <Plus size={20} />
                    New Promo Code
                </button>
            </div>

            {isAdding && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-primary/20 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-900 uppercase text-xs tracking-widest">Create New Promotion</h3>
                        <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600">
                            <X size={20} />
                        </button>
                    </div>
                    <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="md:col-span-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Code</label>
                            <input
                                type="text"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                placeholder="SUMMER20"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
                            <select
                                value={formData.discount_type}
                                onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                            >
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed Amount ($)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Value</label>
                            <input
                                type="number"
                                value={formData.discount_value}
                                onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                                placeholder="20"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-primary-dark transition-colors h-[42px]"
                        >
                            Save Code
                        </button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-12 text-center text-gray-400 font-sans">Checking for active promotions...</div>
                ) : promotions.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <Tags size={48} className="mx-auto text-gray-300 mb-4" />
                        <h4 className="font-bold text-gray-900">No promo codes yet</h4>
                        <p className="text-gray-500 mt-1">Create your first discount code to start your marketing campaign!</p>
                    </div>
                ) : (
                    promotions.map((promo) => (
                        <div key={promo.id} className={`bg-white p-6 rounded-2xl shadow-sm border transition-shadow hover:shadow-md ${promo.is_active ? 'border-gray-100' : 'border-gray-200 grayscale'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-black tracking-widest uppercase">
                                    {promo.code}
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => toggleStatus(promo)} className={`p-2 rounded-lg transition-colors ${promo.is_active ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-100'}`} title={promo.is_active ? 'Disable' : 'Enable'}>
                                        <Check size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(promo.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-2xl font-black text-gray-900">
                                    {promo.discount_type === 'percentage' ? `${promo.discount_value}%` : `$${promo.discount_value}`}
                                    <span className="text-sm font-normal text-gray-500 ml-2 uppercase tracking-wide">off</span>
                                </p>
                                <p className="text-xs text-gray-400 font-medium">Valid for all products</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
