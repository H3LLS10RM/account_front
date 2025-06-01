
export const initializeAuth = () => {

};

export const setAuthHeader = () => {
    // Больше не переопределяем fetch
};

export const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('jwt');
    window.location.href = '/login';
};

export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const getToken = () => {
    return localStorage.getItem('jwt') || localStorage.getItem('authToken');
};