import { IFilePickerResult } from "@pnp/spfx-controls-react/lib/FilePicker";
import { IBaseInterface } from "../../../interfaces/IBaseInterface";
import { PEPI_PEPIDetails } from "../../../domain/models/PEPI_PEPIDetails";
import { PEPI_QuestionText } from "../../../domain/models/PEPI_QuestionText";
import { PEPI_PEPIQuestionText } from "../../../domain/models/PEPI_PEPIQuestionText";
import { Enums } from "../../../globals/Enums";

export interface ISubmitPEPIprojectState extends IBaseInterface {
 //LableText:String,
 ReviewerName:string;
 LeadMDName:string;
 DisableSubmitButton : boolean;
 IsCreateMode: boolean;
 PEPIDetails: PEPI_PEPIDetails;
 PEPIQuestionText: PEPI_QuestionText;
 hasEditItemPermission : boolean;
 //TempPEPIQuestionText: PEPI_QuestionText[];
 TempPEPIQuestionText: PEPI_PEPIQuestionText[];
 SubmitCompleted: false;
 SubmitStarted: false;
 IsAnalyticsDisable : boolean;
 DisableNewFormOprtion : boolean;
 CurrentUserRoles: Enums.UserRoles[];
 IsSelectedEmployeeInvalid: boolean;
 LeadMDEmail : string;
 ReviewerEmail : string;
 RevieweeName : string;
 ReplaceUsermail : string;
 SctionTotalDE : number;
 SctionTotalDR : number;
 ComplexityOptions : string;
}