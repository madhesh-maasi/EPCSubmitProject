import { IFilePickerResult } from "@pnp/spfx-controls-react/lib/FilePicker";
import { IBaseInterface } from "../../../../interfaces/IBaseInterface";
import { PEPI_PEPIDetails } from "../../../../domain/models/PEPI_PEPIDetails";
import { PEPI_QuestionText } from "../../../../domain/models/PEPI_QuestionText";
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

export interface IQuestionTextState extends IBaseInterface {
  AQuestionText: any;
  APEPIDetail: PEPI_PEPIDetails;
  Options: IDropdownOption[];
  // D11E : number;
  // D11R : number;
  // D11D : number;
  name: string;
  value: string;
}
