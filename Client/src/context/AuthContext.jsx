import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [admin, setAdmin] = useState(null);

    const [loading, setLoading] = useState(true);

    // ================= GET PROFILE =================

    const getProfile = async () => {

        try {

            const res = await API.get(
                "/admin/profile",
                {
                    withCredentials: true
                }
            );

            setAdmin(res.data.adminData);

        } catch (error) {

            console.log(error);

            setAdmin(null);

        } finally {

            setLoading(false);
        }
    };

    // ================= INITIAL LOAD =================

    useEffect(() => {

        getProfile();

    }, []);

    return (
        <AuthContext.Provider
            value={{
                admin,
                setAdmin,
                loading,
                getProfile
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);