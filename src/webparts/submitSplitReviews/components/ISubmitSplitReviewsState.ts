import { IBaseInterface } from "../../../interfaces/IBaseInterface";
import { PEPI_SplitReviews } from "../../../domain/models/PEPI_SplitReviews";
export interface ISubmitSplitReviewsState extends IBaseInterface {
    IsCreateMode: boolean;
    hasEditItemPermission: boolean;
    SplitReviews : PEPI_SplitReviews;
    DisableSaveButton:boolean;
}