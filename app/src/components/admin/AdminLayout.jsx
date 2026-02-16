import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Tags,
    LogOut,
    FolderTree,
    Weight
} from 'lucide-react';

export default function AdminLayout() {
    const { user, loading, isRoleLoading, isAdmin, signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Only make routing decisions once both Auth and Role loading are finished
        if (!loading && !isRoleLoading) {
            console.log("Admin Guard - User:", user?.uid, "isAdmin:", isAdmin);
            if (!user) {
                console.log("No user found, redirecting to login");
                navigate('/admin/login');
            } else if (!isAdmin) {
                console.log("User is not an admin, signing out and redirecting");
                // Explicitly check if we are already on the login page to avoid loops
                if (location.pathname !== '/admin/login') {
                    signOut().then(() => navigate('/admin/login?error=unauthorized'));
                }
            }
        }
    }, [user, loading, isRoleLoading, isAdmin, navigate, signOut, location.pathname]);

    if (loading || isRoleLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user || !isAdmin) return null;

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out z-30 lg:translate-x-0 lg:static">
                <div className="p-6 border-b border-slate-800 flex flex-col">
                    <h2 className="text-xl font-bold">GOU PA NOU</h2>
                    <span className="text-xs text-slate-400 uppercase tracking-wider">Admin Panel</span>
                    {user?.role && (
                        <span className="mt-2 text-[10px] bg-primary/20 text-primary-light px-2 py-1 rounded inline-block w-fit uppercase font-bold">
                            {user.role.replace('_', ' ')}
                        </span>
                    )}
                </div>

                <nav className="p-4 space-y-2">
                    <Link
                        to="/admin"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin') ? 'bg-primary text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>

                    <Link
                        to="/admin/products"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/products') ? 'bg-primary text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <Package size={20} />
                        <span>Products</span>
                    </Link>

                    <Link
                        to="/admin/orders"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/orders') ? 'bg-primary text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <ShoppingCart size={20} />
                        <span>Orders</span>
                    </Link>

                    <Link
                        to="/admin/inventory"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/inventory') ? 'bg-primary text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <Weight size={20} />
                        <span>Inventory</span>
                    </Link>

                    <Link
                        to="/admin/categories"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/categories') ? 'bg-primary text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <FolderTree size={20} />
                        <span>Categories</span>
                    </Link>

                    <Link
                        to="/admin/promotions"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/promotions') ? 'bg-primary text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <Tags size={20} />
                        <span>Promotions</span>
                    </Link>
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
                    <button
                        onClick={signOut}
                        className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 overflow-y-auto">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
