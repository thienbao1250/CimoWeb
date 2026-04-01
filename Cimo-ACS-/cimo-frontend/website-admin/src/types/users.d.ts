export default interface IUsers {
  id?: string;
  name: string;
  username: string;
  dob: string;
  password?: string;
  isDeleted?: boolean;
  soRoleIds?: string[];
}

export type CreateUserRequest = Omit<IUsers, 'id'>;
