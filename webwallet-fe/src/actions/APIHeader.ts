
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  

  if (!token) {
    window.document.location.href = '/login';
    alert('You are not authorized, Please login first');
    return;
  }

  return {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    }
  };
};
