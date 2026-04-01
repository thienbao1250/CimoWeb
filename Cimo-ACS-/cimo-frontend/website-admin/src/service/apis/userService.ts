import IUsers from 'types/users';
import BaseAdminService from '../core/baseAdminService';
import axiosClient from 'utils/axiosClient';

class UserService extends BaseAdminService<IUsers> {
  constructor() {
    super('/so-users');
  }

  async updateUserRole(userId: string, roleId: string[]) {
    return await axiosClient.patch(`/so-users/${userId}`, { soRoleIds: [roleId] });
  }

  async removeRole(userId: string, roleId: string) {
    return await axiosClient.patch(`/so-users/${userId}/remove-role/${roleId}`);
  }
}

export default new UserService();
