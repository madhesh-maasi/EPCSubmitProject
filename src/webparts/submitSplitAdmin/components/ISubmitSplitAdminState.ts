import { IBaseInterface } from "../../../interfaces/IBaseInterface";
import { PEPI_SplitAdmin } from "../../../domain/models/PEPI_SplitAdmin";
import { Enums } from "../../../globals/Enums";


export interface ISubmitSplitAdminState extends IBaseInterface {
    SplitAdmin: PEPI_SplitAdmin;
    IsCreateMode:boolean;
    hasEditItemPermission : boolean;
    DisableSaveButton:boolean;
    IsShowForm:boolean;
    NewItemID:number;
} 