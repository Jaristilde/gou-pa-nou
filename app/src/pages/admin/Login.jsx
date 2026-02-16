import { useState } from 'react';
import { auth, db } from '../../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isRegistering, setIsRegistering] = useState(false);
    const navigate = useNavigate();

    const handleAction = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isRegistering) {
                console.log("Registering first admin...");
                const res = await createUserWithEmailAndPassword(auth, email, password);
                const uid = res.user.uid;

                // Create user profile in Firestore with super_admin role
                const userDocRef = doc(db, 'users', uid);
                await setDoc(userDocRef, {
                    email: email.toLowerCase(),
                    role: 'super_admin',
                    created_at: new Date()
                });

                console.log("Admin documentation created in Firestore for UID:", uid);

                // Explicitly wait 500ms to allow Firestore replication if needed
                await new Promise(resolve => setTimeout(resolve, 500));

                alert('Admin account created! You can now log in.');
                setIsRegistering(false);
                setEmail('');
                setPassword('');
            } else {
                console.log("Attempting sign in...");
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const uid = userCredential.user.uid;
                console.log("Sign in successful, fetching role for UID:", uid);

                // Check if the user has a role in Firestore
                const userDoc = await getDoc(doc(db, 'users', uid));

                if (userDoc.exists()) {
                    const role = userDoc.data().role;
                    console.log("Role verified as:", role);
                    if (['admin', 'super_admin'].includes(role)) {
                        navigate('/admin');
                    } else {
                        await signOut(auth);
                        setError('Access Denied: You do not have administrator privileges.');
                    }
                } else {
                    console.warn("No role document found for UID:", uid);
                    await signOut(auth);
                    setError('Access Denied: Admin role record not found. If you created this account in the Firebase Console, you must create a document in the "users" collection with a "role" field.');
                }
            }
        } catch (error) {
            console.error("Login/Register error:", error);
            if (error.code === 'auth/invalid-credential') {
                setError('Invalid email or password.');
            } else if (error.code === 'auth/network-request-failed') {
                setError('Network error. Please check your internet connection or Firebase config.');
            } else if (error.code === 'permission-denied') {
                setError('Database access denied. Please check your Firestore security rules.');
            } else {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async () => {
        try {
            await signOut(auth);
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = '/admin/login';
        } catch (err) {
            window.location.reload();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                        <Lock className="w-6 h-6 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
                    <p className="text-gray-500 mt-2">Sign in to manage your store</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6 text-sm">
                        <p className="font-bold mb-1 underline">Security/Database Error:</p>
                        {error}
                        <p className="mt-2 text-[10px] text-red-500">
                            Check console for full technical details.
                        </p>
                    </div>
                )}

                <form onSubmit={handleAction} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-800 hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors"
                    >
                        {loading ? 'Validating Permissions...' : (isRegistering ? 'Step 1: Create Admin Access' : 'Secure Admin Login')}
                    </button>

                    <div className="flex flex-col gap-4 text-center">
                        <button
                            type="button"
                            onClick={() => setIsRegistering(!isRegistering)}
                            className="text-xs text-primary hover:underline font-bold uppercase tracking-widest"
                        >
                            {isRegistering ? 'Back to Login' : 'First Time Setup: Create First Admin'}
                        </button>

                        <button
                            type="button"
                            onClick={handleReset}
                            className="text-[10px] text-gray-400 hover:text-red-500 transition-colors flex items-center justify-center gap-1"
                        >
                            <span>Stuck in a loop?</span>
                            <span className="underline font-bold">Clear Cache & Sign Out</span>
                        </button>
                    </div>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-[10px] text-gray-400">
                    <p className="font-bold mb-1">Connection Diagnostics:</p>
                    <ul className="list-disc pl-4 space-y-1">
                        <li>Environment: {import.meta.env.MODE}</li>
                        <li>Database ID: {db.app.options.projectId}</li>
                        <li>Connection State: {navigator.onLine ? 'Connected' : 'Offline'}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
