import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRoleLoading, setIsRoleLoading] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setLoading(true);
            if (currentUser) {
                setIsRoleLoading(true);
                try {
                    console.log("Auth user detected:", currentUser.uid);
                    // Fetch role from Firestore
                    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                    if (userDoc.exists()) {
                        const role = userDoc.data().role;
                        console.log("Role found:", role);
                        setUser({ ...currentUser, role });
                    } else {
                        console.warn("User profile not found in Firestore for UID:", currentUser.uid);
                        setUser(currentUser);
                    }
                } catch (error) {
                    console.error("AuthContext - Error fetching user role:", error);
                    if (error.code === 'permission-denied') {
                        // Mark specifically that we are blocked by rules
                        setUser({ ...currentUser, role: 'unauthorized_blocked' });
                    } else {
                        setUser(currentUser);
                    }
                } finally {
                    setIsRoleLoading(false);
                }
            } else {
                setUser(null);
                setIsRoleLoading(false);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const value = {
        user,
        loading,
        isRoleLoading,
        userRole: user?.role || null,
        isAdmin: !!user?.role && ['admin', 'super_admin'].includes(user.role),
        isSuperAdmin: user?.role === 'super_admin',
        signOut: () => signOut(auth),
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    return useContext(AuthContext);
};
