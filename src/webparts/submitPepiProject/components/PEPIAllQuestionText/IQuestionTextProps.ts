import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IBaseInterface } from "../../../../interfaces/IBaseInterface";
import { PEPI_PEPIDetails } from "../../../../domain/models/PEPI_PEPIDetails";
import { PEPI_QuestionText } from "../../../../domain/models/PEPI_QuestionText";
import { Dropdown, IDropdownOption, IStackTokens, Label, PrimaryButton, Stack, MessageBar, MessageBarType, Spinner, SpinnerSize } from '@fluentui/react';

export interface IQuestionTextProps extends IBaseInterface {
    AppContext: WebPartContext;
    hasEditItemPermission : boolean;
    QuestionText : any;
    APEPIDetail : PEPI_PEPIDetails;
    Options : IDropdownOption[] ;
    // SERVICELINEReviewee : any;
    // SERVICELINEReviewer : any;
    // SERVICELINEDifference : any;
     onFormFieldValueChange:  any;   
     SctionTotalDE :number;
     SctionTotalDR :number;
     SctionTotalDD :number;
     IsReviewee: boolean;
     IsReviewer: boolean;

    // APEPIDetail : PEPI_PEPIDetails;
    // APEPIQuestionText : PEPI_QuestionText[];
    // onFormFieldValueChange: (PEPI_PEPIDetails) => any;   
}