import { IBaseInterface } from "../../../interfaces/IBaseInterface";
import { PEPI_CombineAdmin } from "../../../domain/models/PEPI_CombineAdmin";
import { Enums } from "../../../globals/Enums";


export interface ISubmitCombineAdminState extends IBaseInterface {
    CombineAdmin: PEPI_CombineAdmin;
    IsCreateMode:boolean;
    hasEditItemPermission : boolean;
    DisableSaveButton:boolean;
    IsShowForm:boolean;
    NewItemID:number;
} 