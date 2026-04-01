
export default interface IStudents {
    id?: string;
    name: string;
    gender: boolean;
    dob: string;
    phone: string;
    email: string;
    address: string;
    nationalId: string;
    isDeleted?: boolean;
    soClassId?: string;
    soParentId?: string[];
}

