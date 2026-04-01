import axiosClient from 'utils/axiosClient';

class AuthService {
  constructor() {}

  login(credential: string, secret: string) {
    return axiosClient.post(`/auth/login`, { credential, secret });
  }

  getProfile() {
    return axiosClient.get(`/auth/me`);
  }
}

export default new AuthService();
