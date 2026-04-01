import BaseAdminService from "service/core/baseAdminService";
import IParents from "types/parents";

class ParentService extends BaseAdminService<IParents> {
    constructor() {
        super("/so-parents");
    }
}

export default new ParentService();