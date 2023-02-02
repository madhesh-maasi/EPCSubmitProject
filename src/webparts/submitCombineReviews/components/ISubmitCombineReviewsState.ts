import { IBaseInterface } from "../../../interfaces/IBaseInterface";
import { PEPI_CombineReviews } from "../../../domain/models/PEPI_CombineReviews";
import { Enums } from "../../../globals/Enums";


export interface ISubmitCombineReviewsState extends IBaseInterface {
    CombineReviews: PEPI_CombineReviews;
    IsCreateMode:boolean;
    hasEditItemPermission : boolean;
    DisableSaveButton:boolean;
} 
