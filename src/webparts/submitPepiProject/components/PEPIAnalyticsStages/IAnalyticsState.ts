import { IFilePickerResult } from "@pnp/spfx-controls-react/lib/FilePicker";
import {
  Dropdown,
  IDropdownOption,
  IStackTokens,
  Label,
  PrimaryButton,
  Stack,
  MessageBar,
  MessageBarType,
  Spinner,
  SpinnerSize,
} from "@fluentui/react";
import { IBaseInterface } from "../../../../interfaces/IBaseInterface";
import { PEPI_PEPIDetails } from "../../../../domain/models/PEPI_PEPIDetails";
import { PEPI_QuestionText } from "../../../../domain/models/PEPI_QuestionText";
import { PEPI_PEPIQuestionText } from "../../../../domain/models/PEPI_PEPIQuestionText";

export interface IAnalyticsState extends IBaseInterface {
  revieweePermission?: boolean;
  leadMDPermission?: boolean;
  EditMode: boolean;
  Options: IDropdownOption[];
  ApepiDetails: PEPI_PEPIDetails;
  ApepiQuestionText: PEPI_PEPIQuestionText[];
  IsReviewee: boolean;
  IsReviewer: boolean;
  IsLeadMD: boolean;
  // IsPerformanceDiscussion?: boolean;
  IsApprovaed: boolean;
  IsAcknowledgement: boolean;
  IsSelectedEmployeeInvalid: boolean;
  ReplaceUsermail: string;
  //Section A1 State
  A11E: number;
  A12E: number;
  A13E: number;
  A14E: number;
  A15E: number;
  A11R: number;
  A12R: number;
  A13R: number;
  A14R: number;
  A15R: number;
  A11D: number;
  A12D: number;
  A13D: number;
  A14D: number;
  A15D: number;

  A1EE: number;
  A1RR: number;
  A1DD: any;

  // Section A2 State
  A21E: number;
  A22E: number;
  A23E: number;
  A24E: number;
  A21R: number;
  A22R: number;
  A23R: number;
  A24R: number;
  A21D: number;
  A22D: number;
  A23D: number;
  A24D: number;
  A2EE: number;
  A2RR: number;
  A2DD: number;

  // Section A3 State
  A31E: number;
  A32E: number;
  A33E: number;
  A31R: number;
  A32R: number;
  A33R: number;
  A31D: number;
  A32D: number;
  A33D: number;
  A3EE: number;
  A3RR: number;
  A3DD: number;

  AAvgEE: number;
  AAvgER: number;
  SctionTotalAD: number;

  // Section B1 State
  B11E: number;
  B12E: number;
  B11R: number;
  B12R: number;
  B11D: number;
  B12D: number;

  B1EE: number;
  B1RR: number;
  B1DD: number;

  // Section B2 State
  B21E: number;
  B22E: number;
  B23E: number;
  B21R: number;
  B22R: number;
  B23R: number;
  B21D: number;
  B22D: number;
  B23D: number;
  B2EE: number;
  B2RR: number;
  B2DD: number;

  // Section B3 State
  B31E: number;
  B32E: number;
  B33E: number;
  B31R: number;
  B32R: number;
  B33R: number;
  B31D: number;
  B32D: number;
  B33D: number;
  B3EE: number;
  B3RR: number;
  B3DD: number;

  // Section B4 State
  B41E: number;
  B42E: number;
  B43E: number;
  B41R: number;
  B42R: number;
  B43R: number;
  B41D: number;
  B42D: number;
  B43D: number;
  B4EE: number;
  B4RR: number;
  B4DD: number;

  BAvgEE: number;
  BAvgER: number;
  SctionTotalBD: number;

  CAvgEE: number;
  CAvgER: number;
  SctionTotalCD: number;

  // Section C1 State
  C11E: number;
  C12E: number;
  C13E: number;
  C11R: number;
  C12R: number;
  C13R: number;
  C11D: number;
  C12D: number;
  C13D: number;
  C1EE: number;
  C1RR: number;
  C1DD: number;

  // Section C2 State
  C21E: number;
  C22E: number;
  C23E: number;
  C24E: number;
  C21R: number;
  C22R: number;
  C23R: number;
  C24R: number;
  C21D: number;
  C22D: number;
  C23D: number;
  C24D: number;
  C2EE: number;
  C2RR: number;
  C2DD: number;

  // Section C3 State
  C31E: number;
  C32E: number;
  C33E: number;
  C31R: number;
  C32R: number;
  C33R: number;
  C31D: number;
  C32D: number;
  C33D: number;
  C3EE: number;
  C3RR: number;
  C3DD: number;

  SctionTotalDE: number;
  SctionTotalDR: number;
  SctionTotalDD: number;

  OverallCoreE: number;
  OverallCoreR: number;

  OverallPerformance: number;

  E1EE: string;
  E1ER: string;
  F1EE: string;
  F1ER: string;
  G1EE: string;
  G1ER: string;
  H1EE: string;
  H1ER: string;

  // // // //   // Section D1 State
  // // // //   D11E : number;
  // // // //   D12E : number;
  // // // //   D13E : number;
  // // // //   D14E : number;
  // // // //   D15E : number;
  // // // //   D16E : number;
  // // // //   D17E : number;
  // // // //   D18E : number;
  // // // //   D19E : number;
  // // // //   D110E : number;
  // // // //   D11R : number;
  // // // //   D12R : number;
  // // // //   D13R : number;
  // // // //   D14R : number;
  // // // //   D15R : number;
  // // // //   D16R : number;
  // // // //   D17R : number;
  // // // //   D18R : number;
  // // // //   D19R : number;
  // // // //   D110R : number;

  // // // //   D11D : number;
  // // // //   D12D : number;
  // // // //   D13D : number;
  // // // //   D14D : number;
  // // // //   D15D : number;
  // // // //   D16D : number;
  // // // //   D17D : number;
  // // // //   D18D : number;
  // // // //   D19D : number;
  // // // //   D110D : number;
}
