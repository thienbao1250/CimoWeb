export default interface IRoles {
  id?: string;
  name: string;
  isDeleted?: boolean;
}

export type CreateRoleRequest = Omit<IRoles, 'id'>;
