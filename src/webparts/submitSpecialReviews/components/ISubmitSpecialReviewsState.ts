
import { IBaseInterface } from "../../../interfaces/IBaseInterface";
import { PEPI_SpecialReviews } from "../../../domain/models/PEPI_SpecialReviews";
import { Enums } from "../../../globals/Enums";


export interface ISubmitSpecialReviewsState extends IBaseInterface {
    SpecialReviews: PEPI_SpecialReviews;
    IsCreateMode: boolean;
    hasEditItemPermission: boolean;
    DisableSaveButton:boolean;
} 