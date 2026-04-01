export default interface ICheckIns {
    id?: string;
    soStudentId: string[];
    soClassesId: string;
    soUserId: string;
    checkType: string;
    checkDate: string;
    note?: string;
    isDeleted?: boolean
}