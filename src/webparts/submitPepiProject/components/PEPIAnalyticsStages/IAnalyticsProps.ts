import { WebPartContext } from "@microsoft/sp-webpart-base";
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
export interface IAnalyticsProps extends IBaseInterface {
  isAdmin?: boolean;
  loggeduseremail?: string;
  AppContext: WebPartContext;
  DisableSection: boolean;
  APEPIDetail: PEPI_PEPIDetails;
  APEPIQuestionText: any;
  Options: IDropdownOption[];
  SctionTotalDE: number;
  SctionTotalDR: number;
  hasEditItemPermission: boolean;
  ReplaceUsermail: string;
  onFormFieldValueChange: (PEPI_PEPIDetails) => any;
}
