import * as React from "react";
import styles from "../SubmitPepiProject.module.scss";
import {
  Dropdown,
  DatePicker,
  IDropdownOption,
  IStackTokens,
  Label,
  PrimaryButton,
  TextField,
  Stack,
  MessageBar,
  MessageBarType,
  Spinner,
  SpinnerSize,
} from "@fluentui/react";
import {
  DateTimePicker,
  DateConvention,
  TimeConvention,
  TimeDisplayControlType,
} from "@pnp/spfx-controls-react/lib/DateTimePicker";
import { DefaultButton, IconButton } from "@fluentui/react/lib/Button";
import { Guid } from "@microsoft/sp-core-library";
import { IAnalyticsState } from "./IAnalyticsState";
import { IAnalyticsProps } from "./IAnalyticsProps";
import { PEPI_QuestionText } from "../../../../domain/models/PEPI_QuestionText";
import { Config } from "../../../../globals/Config";
import { Enums } from "../../../../globals/Enums";
import ListItemService from "../../../../services/ListItemService";
import AllQuestionText from "../PEPIAllQuestionText/QuestionText";
import { PEPI_PEPIDetails } from "../../../../domain/models/PEPI_PEPIDetails";
import {
  PeoplePicker,
  PrincipalType,
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import MapResult from "../../../../domain/mappers/MapResult";

export default class Manager extends React.Component<
  IAnalyticsProps,
  IAnalyticsState
> {
  private modifiedRows: PEPI_QuestionText[] = [];
  // private Options: IDropdownOption[] = [];
  private listPEPIProjectsItemService: ListItemService;
  // private listQuestionItemService: ListItemService;
  constructor(props: any) {
    super(props);
    this.state = {
      revieweePermission: false,
      AppContext: props.AppContext,
      IsLoading: false,
      IsSelectedEmployeeInvalid: false,
      EditMode: false,
      IsReviewee: true,
      IsReviewer: true,
      IsLeadMD: true,
      IsAcknowledgement: true,
      IsApprovaed: true,
      Options: this.props.Options,
      ApepiDetails: props.APEPIDetail,
      ApepiQuestionText: props.APEPIQuestionText,
      ReplaceUsermail: "",
      // Section A1 State
      A11E:
        this.props.APEPIDetail.A11E == undefined
          ? 0
          : this.props.APEPIDetail.A11E,
      A12E:
        this.props.APEPIDetail.A12E == undefined
          ? 0
          : this.props.APEPIDetail.A12E,
      A13E:
        this.props.APEPIDetail.A13E == undefined
          ? 0
          : this.props.APEPIDetail.A13E,
      A14E:
        this.props.APEPIDetail.A14E == undefined
          ? 0
          : this.props.APEPIDetail.A14E,
      A15E:
        this.props.APEPIDetail.A15E == undefined
          ? 0
          : this.props.APEPIDetail.A15E,
      A11R:
        this.props.APEPIDetail.A11R == undefined
          ? 0
          : this.props.APEPIDetail.A11R,
      A12R:
        this.props.APEPIDetail.A12R == undefined
          ? 0
          : this.props.APEPIDetail.A12R,
      A13R:
        this.props.APEPIDetail.A13R == undefined
          ? 0
          : this.props.APEPIDetail.A13R,
      A14R:
        this.props.APEPIDetail.A14R == undefined
          ? 0
          : this.props.APEPIDetail.A14R,
      A15R:
        this.props.APEPIDetail.A15R == undefined
          ? 0
          : this.props.APEPIDetail.A15R,
      A11D:
        Number(this.resetNAValue(this.props.APEPIDetail.A11R)) -
        Number(this.resetNAValue(this.props.APEPIDetail.A11E)),
      A12D:
        Number(this.resetNAValue(this.props.APEPIDetail.A12R)) -
        Number(this.resetNAValue(this.props.APEPIDetail.A12E)),
      A13D:
        Number(this.resetNAValue(this.props.APEPIDetail.A13R)) -
        Number(this.resetNAValue(this.props.APEPIDetail.A13E)),
      A14D:
        Number(this.resetNAValue(this.props.APEPIDetail.A14R)) -
        Number(this.resetNAValue(this.props.APEPIDetail.A14E)),
      A15D:
        Number(this.resetNAValue(this.props.APEPIDetail.A15R)) -
        Number(this.resetNAValue(this.props.APEPIDetail.A15E)),
      A1EE:
        this.props.APEPIDetail.A1EE == undefined
          ? 0
          : this.props.APEPIDetail.A1EE,
      A1RR:
        this.props.APEPIDetail.A1RR == undefined
          ? 0
          : this.props.APEPIDetail.A1RR,
      A1DD: Number(
        parseFloat(
          (
            Number(
              this.props.APEPIDetail.A1RR == undefined
                ? 0
                : this.props.APEPIDetail.A1RR
            ) -
            Number(
              this.props.APEPIDetail.A1EE == undefined
                ? 0
                : this.props.APEPIDetail.A1EE
            )
          ).toString()
        ).toFixed(2)
      ),

      // Section A2 State
      A21E:
        this.props.APEPIDetail.A21E == undefined
          ? 0
          : this.props.APEPIDetail.A21E,
      A22E:
        this.props.APEPIDetail.A22E == undefined
          ? 0
          : this.props.APEPIDetail.A22E,
      A23E:
        this.props.APEPIDetail.A23E == undefined
          ? 0
          : this.props.APEPIDetail.A23E,
      A24E:
        this.props.APEPIDetail.A24E == undefined
          ? 0
          : this.props.APEPIDetail.A24E,
      A21R:
        this.props.APEPIDetail.A21R == undefined
          ? 0
          : this.props.APEPIDetail.A21R,
      A22R:
        this.props.APEPIDetail.A22R == undefined
          ? 0
          : this.props.APEPIDetail.A22R,
      A23R:
        this.props.APEPIDetail.A23R == undefined
          ? 0
          : this.props.APEPIDetail.A23R,
      A24R:
        this.props.APEPIDetail.A24R == undefined
          ? 0
          : this.props.APEPIDetail.A24R,
      A21D:
        Number(this.resetNAValue(this.props.APEPIDetail.A21R)) -
        Number(this.resetNAValue(this.props.APEPIDetail.A21E)),
      A22D:
        Number(this.resetNAValue(this.props.APEPIDetail.A22R)) -
        Number(this.resetNAValue(this.props.APEPIDetail.A22E)),
      A23D:
        Number(this.resetNAValue(this.props.APEPIDetail.A23R)) -
        Number(this.resetNAValue(this.props.APEPIDetail.A23E)),
      A24D:
        Number(this.resetNAValue(this.props.APEPIDetail.A24R)) -
        Number(this.resetNAValue(this.props.APEPIDetail.A24E)),

      A2EE:
        this.props.APEPIDetail.A2EE == undefined
          ? 0
          : this.props.APEPIDetail.A2EE,
      A2RR:
        this.props.APEPIDetail.A2RR == undefined
          ? 0
          : this.props.APEPIDetail.A2RR,
      A2DD: Number(
        parseFloat(
          (
            Number(
              this.props.APEPIDetail.A2RR == undefined
                ? 0
                : this.props.APEPIDetail.A2RR
            ) -
            Number(
              this.props.APEPIDetail.A2EE == undefined
                ? 0
                : this.props.APEPIDetail.A2EE
            )
          ).toString()
        ).toFixed(2)
      ),

      // Section A3 State
      A31E:
        this.props.APEPIDetail.A31E == undefined
          ? 0
          : this.props.APEPIDetail.A31E,
      A32E:
        this.props.APEPIDetail.A32E == undefined
          ? 0
          : this.props.APEPIDetail.A32E,
      A33E:
        this.props.APEPIDetail.A33E == undefined
          ? 0
          : this.props.APEPIDetail.A33E,
      A31R:
        this.props.APEPIDetail.A31R == undefined
          ? 0
          : this.props.APEPIDetail.A31R,
      A32R:
        this.props.APEPIDetail.A32R == undefined
          ? 0
          : this.props.APEPIDetail.A32R,
      A33R:
        this.props.APEPIDetail.A33R == undefined
          ? 0
          : this.props.APEPIDetail.A33R,
      A31D:
        Number(this.resetNAValue(this.props.APEPIDetail.A31R)) -
        Number(this.resetNAValue(this.props.APEPIDetail.A31E)),
      A32D:
        Number(this.resetNAValue(this.props.APEPIDetail.A32R)) -
        Number(this.resetNAValue(this.props.APEPIDetail.A32E)),
      A33D:
        Number(this.resetNAValue(this.props.APEPIDetail.A33R)) -
        Number(this.resetNAValue(this.props.APEPIDetail.A33E)),

      A3EE:
        this.props.APEPIDetail.A3EE == undefined
          ? 0
          : this.props.APEPIDetail.A3EE,
      A3RR:
        this.props.APEPIDetail.A3RR == undefined
          ? 0
          : this.props.APEPIDetail.A3RR,
      //A3DD : Number(this.props.APEPIDetail.A3RR == undefined ? 0:this.props.APEPIDetail.A3RR) - Number(this.props.APEPIDetail.A3EE == undefined ? 0:this.props.APEPIDetail.A3EE),
      A3DD: Number(
        parseFloat(
          (
            Number(
              this.props.APEPIDetail.A3RR == undefined
                ? 0
                : this.props.APEPIDetail.A3RR
            ) -
            Number(
              this.props.APEPIDetail.A3EE == undefined
                ? 0
                : this.props.APEPIDetail.A3EE
            )
          ).toString()
        ).toFixed(2)
      ),

      AAvgEE:
        this.props.APEPIDetail.AAvgEE == undefined
          ? 0
          : this.props.APEPIDetail.AAvgEE,
      AAvgER:
        this.props.APEPIDetail.AAvgER == undefined
          ? 0
          : this.props.APEPIDetail.AAvgER,
      SctionTotalAD: Number(
        parseFloat(
          (
            Number(
              this.props.APEPIDetail.AAvgER == undefined
                ? 0
                : this.props.APEPIDetail.AAvgER
            ) -
            Number(
              this.props.APEPIDetail.AAvgEE == undefined
                ? 0
                : this.props.APEPIDetail.AAvgEE
            )
          ).toString()
        ).toFixed(2)
      ),

      //  // Section B1 State

      B1EE:
        this.props.APEPIDetail.B1EE == undefined
          ? 0
          : this.props.APEPIDetail.B1EE,
      B1RR:
        this.props.APEPIDetail.B1RR == undefined
          ? 0
          : this.props.APEPIDetail.B1RR,

      B1DD:
        Number(
          this.props.APEPIDetail.B1RR == undefined
            ? 0
            : this.props.APEPIDetail.B1RR
        ) -
        Number(
          this.props.APEPIDetail.B1EE == undefined
            ? 0
            : this.props.APEPIDetail.B1EE
        ),
      B2EE:
        this.props.APEPIDetail.B2EE == undefined
          ? 0
          : this.props.APEPIDetail.B2EE,
      B2RR:
        this.props.APEPIDetail.B2RR == undefined
          ? 0
          : this.props.APEPIDetail.B2RR,
      //B2DD: Number(this.props.APEPIDetail.B2RR == undefined ? 0 : this.props.APEPIDetail.B2RR) - Number(this.props.APEPIDetail.B2EE == undefined ? 0 : this.props.APEPIDetail.B2EE),
      B2DD: Number(
        parseFloat(
          (
            Number(
              this.props.APEPIDetail.B2RR == undefined
                ? 0
                : this.props.APEPIDetail.B2RR
            ) -
            Number(
              this.props.APEPIDetail.B2EE == undefined
                ? 0
                : this.props.APEPIDetail.B2EE
            )
          ).toString()
        ).toFixed(2)
      ),
      B3EE:
        this.props.APEPIDetail.B3EE == undefined
          ? 0
          : this.props.APEPIDetail.B3EE,
      B3RR:
        this.props.APEPIDetail.B3RR == undefined
          ? 0
          : this.props.APEPIDetail.B3RR,
      //B3DD : Number(this.props.APEPIDetail.B3RR == undefined ? 0:this.props.APEPIDetail.B3RR) - Number(this.props.APEPIDetail.B3EE == undefined ? 0:this.props.APEPIDetail.B3EE),
      B3DD: Number(
        parseFloat(
          (
            Number(
              this.props.APEPIDetail.B3RR == undefined
                ? 0
                : this.props.APEPIDetail.B3RR
            ) -
            Number(
              this.props.APEPIDetail.B3EE == undefined
                ? 0
                : this.props.APEPIDetail.B3EE
            )
          ).toString()
        ).toFixed(2)
      ),

      B4EE:
        this.props.APEPIDetail.B4EE == undefined
          ? 0
          : this.props.APEPIDetail.B4EE,
      B4RR:
        this.props.APEPIDetail.B4RR == undefined
          ? 0
          : this.props.APEPIDetail.B4RR,
      //B4DD : Number(this.props.APEPIDetail.B4RR == undefined ? 0:this.props.APEPIDetail.B4RR) - Number(this.props.APEPIDetail.B4EE == undefined ? 0:this.props.APEPIDetail.B4EE),
      B4DD: Number(
        parseFloat(
          (
            Number(
              this.props.APEPIDetail.B4RR == undefined
                ? 0
                : this.props.APEPIDetail.B4RR
            ) -
            Number(
              this.props.APEPIDetail.B4EE == undefined
                ? 0
                : this.props.APEPIDetail.B4EE
            )
          ).toString()
        ).toFixed(2)
      ),

      B11E:
        this.props.APEPIDetail.B11E == undefined
          ? 0
          : this.props.APEPIDetail.B11E,
      B12E:
        this.props.APEPIDetail.B12E == undefined
          ? 0
          : this.props.APEPIDetail.B12E,
      B11R:
        this.props.APEPIDetail.B11R == undefined
          ? 0
          : this.props.APEPIDetail.B11R,
      B12R:
        this.props.APEPIDetail.B12R == undefined
          ? 0
          : this.props.APEPIDetail.B12R,
      B11D:
        Number(this.resetNAValue(this.props.APEPIDetail.B11R)) -
        Number(this.resetNAValue(this.props.APEPIDetail.B11E)),
      B12D:
        Number(this.resetNAValue(this.props.APEPIDetail.B12R)) -
        Number(this.resetNAValue(this.props.APEPIDetail.B12E)),

      //  // Section B2 State
      B21E:
        this.props.APEPIDetail.B21E == undefined
          ? 0
          : this.props.APEPIDetail.B21E,
      B22E:
        this.props.APEPIDetail.B22E == undefined
          ? 0
          : this.props.APEPIDetail.B22E,
      B23E:
        this.props.APEPIDetail.B23E == undefined
          ? 0
          : this.props.APEPIDetail.B23E,
      B21R:
        this.props.APEPIDetail.B21R == undefined
          ? 0
          : this.props.APEPIDetail.B21R,
      B22R:
        this.props.APEPIDetail.B22R == undefined
          ? 0
          : this.props.APEPIDetail.B22R,
      B23R:
        this.props.APEPIDetail.B23R == undefined
          ? 0
          : this.props.APEPIDetail.B23R,
      B21D:
        Number(this.resetNAValue(this.props.APEPIDetail.B21R)) -
        Number(this.resetNAValue(this.props.APEPIDetail.B21E)),
      B22D:
        Number(this.resetNAValue(this.props.APEPIDetail.B22R)) -
        Number(this.resetNAValue(this.props.APEPIDetail.B22E)),
      B23D:
        Number(this.resetNAValue(this.props.APEPIDetail.B23R)) -
        Number(this.resetNAValue(this.props.APEPIDetail.B23E)),

      //  // Section B3 State

      B31E:
        this.props.APEPIDetail.B31E == undefined
          ? 0
          : this.props.APEPIDetail.B31E,
      B32E:
        this.props.APEPIDetail.B32E == undefined
          ? 0
          : this.props.APEPIDetail.B32E,
      B33E:
        this.props.APEPIDetail.B33E == undefined
          ? 0
          : this.props.APEPIDetail.B33E,
      B31R:
        this.props.APEPIDetail.B31R == undefined
          ? 0
          : this.props.APEPIDetail.B31R,
      B32R:
        this.props.APEPIDetail.B32R == undefined
          ? 0
          : this.props.APEPIDetail.B32R,
      B33R:
        this.props.APEPIDetail.B33R == undefined
          ? 0
          : this.props.APEPIDetail.B33R,
      B31D:
        Number(this.resetNAValue(this.props.APEPIDetail.B31R)) -
        Number(this.resetNAValue(this.props.APEPIDetail.B31E)),
      B32D:
        Number(this.resetNAValue(this.props.APEPIDetail.B32R)) -
        Number(this.resetNAValue(this.props.APEPIDetail.B32E)),
      B33D:
        Number(this.resetNAValue(this.props.APEPIDetail.B33R)) -
        Number(this.resetNAValue(this.props.APEPIDetail.B33E)),

      //  // Section B4 State

      B41E:
        this.props.APEPIDetail.B41E == undefined
          ? 0
          : this.props.APEPIDetail.B41E,
      B42E:
        this.props.APEPIDetail.B42E == undefined
          ? 0
          : this.props.APEPIDetail.B42E,
      B43E:
        this.props.APEPIDetail.B43E == undefined
          ? 0
          : this.props.APEPIDetail.B43E,
      B41R:
        this.props.APEPIDetail.B41R == undefined
          ? 0
          : this.props.APEPIDetail.B41R,
      B42R:
        this.props.APEPIDetail.B42R == undefined
          ? 0
          : this.props.APEPIDetail.B42R,
      B43R:
        this.props.APEPIDetail.B43R == undefined
          ? 0
          : this.props.APEPIDetail.B43R,
      B41D:
        Number(this.resetNAValue(this.props.APEPIDetail.B41R)) -
        Number(this.resetNAValue(this.props.APEPIDetail.B41E)),
      B42D:
        Number(this.resetNAValue(this.props.APEPIDetail.B42R)) -
        Number(this.resetNAValue(this.props.APEPIDetail.B42E)),
      B43D:
        Number(this.resetNAValue(this.props.APEPIDetail.B43R)) -
        Number(this.resetNAValue(this.props.APEPIDetail.B43E)),

      //B43D : Number(parseFloat((Number(this.props.APEPIDetail.B43R == undefined ? 0:this.props.APEPIDetail.B43R) - Number(this.props.APEPIDetail.B43E == undefined ? 0:this.props.APEPIDetail.B43E))).toString()).toFixed(2))

      BAvgEE:
        this.props.APEPIDetail.BAvgEE == undefined
          ? 0
          : this.props.APEPIDetail.BAvgEE,
      BAvgER:
        this.props.APEPIDetail.BAvgER == undefined
          ? 0
          : this.props.APEPIDetail.BAvgER,
      SctionTotalBD: Number(
        parseFloat(
          (
            Number(
              this.props.APEPIDetail.BAvgER == undefined
                ? 0
                : this.props.APEPIDetail.BAvgER
            ) -
            Number(
              this.props.APEPIDetail.BAvgEE == undefined
                ? 0
                : this.props.APEPIDetail.BAvgEE
            )
          ).toString()
        ).toFixed(2)
      ),
      //SctionTotalAD: Number(parseFloat((Number(this.props.APEPIDetail.AAvgER == undefined ? 0 : this.props.APEPIDetail.AAvgER) - Number(this.props.APEPIDetail.AAvgEE == undefined ? 0 : this.props.APEPIDetail.AAvgEE)).toString()).toFixed(2)),

      //  // Section C1 State

      CAvgEE:
        this.props.APEPIDetail.CAvgEE == undefined
          ? 0
          : this.props.APEPIDetail.CAvgEE,
      CAvgER:
        this.props.APEPIDetail.CAvgER == undefined
          ? 0
          : this.props.APEPIDetail.CAvgER,
      //SctionTotalCD: 0,
      SctionTotalCD: Number(
        parseFloat(
          (
            Number(
              this.props.APEPIDetail.CAvgER == undefined
                ? 0
                : this.props.APEPIDetail.CAvgER
            ) -
            Number(
              this.props.APEPIDetail.CAvgEE == undefined
                ? 0
                : this.props.APEPIDetail.CAvgEE
            )
          ).toString()
        ).toFixed(2)
      ),

      C1EE:
        this.props.APEPIDetail.C1EE == undefined
          ? 0
          : this.props.APEPIDetail.C1EE,
      C1RR:
        this.props.APEPIDetail.C1RR == undefined
          ? 0
          : this.props.APEPIDetail.C1RR,
      C2EE:
        this.props.APEPIDetail.C1EE == undefined
          ? 0
          : this.props.APEPIDetail.C2EE,
      C2RR:
        this.props.APEPIDetail.C1RR == undefined
          ? 0
          : this.props.APEPIDetail.C2RR,
      C3EE:
        this.props.APEPIDetail.C1EE == undefined
          ? 0
          : this.props.APEPIDetail.C3EE,
      C3RR:
        this.props.APEPIDetail.C1RR == undefined
          ? 0
          : this.props.APEPIDetail.C3RR,
      C1DD: Number(
        parseFloat(
          (
            Number(
              this.props.APEPIDetail.C1RR == undefined
                ? 0
                : this.props.APEPIDetail.C1RR
            ) -
            Number(
              this.props.APEPIDetail.C1EE == undefined
                ? 0
                : this.props.APEPIDetail.C1EE
            )
          ).toString()
        ).toFixed(2)
      ),
      C2DD: Number(
        parseFloat(
          (
            Number(
              this.props.APEPIDetail.C2RR == undefined
                ? 0
                : this.props.APEPIDetail.C2RR
            ) -
            Number(
              this.props.APEPIDetail.C2EE == undefined
                ? 0
                : this.props.APEPIDetail.C2EE
            )
          ).toString()
        ).toFixed(2)
      ),
      C3DD: Number(
        parseFloat(
          (
            Number(
              this.props.APEPIDetail.C3RR == undefined
                ? 0
                : this.props.APEPIDetail.C3RR
            ) -
            Number(
              this.props.APEPIDetail.C3EE == undefined
                ? 0
                : this.props.APEPIDetail.C3EE
            )
          ).toString()
        ).toFixed(2)
      ),

      C11E:
        this.props.APEPIDetail.C11E == undefined
          ? 0
          : this.props.APEPIDetail.C11E,
      C12E:
        this.props.APEPIDetail.C12E == undefined
          ? 0
          : this.props.APEPIDetail.C12E,
      C13E:
        this.props.APEPIDetail.C13E == undefined
          ? 0
          : this.props.APEPIDetail.C13E,
      C11R:
        this.props.APEPIDetail.C11R == undefined
          ? 0
          : this.props.APEPIDetail.C11R,
      C12R:
        this.props.APEPIDetail.C12R == undefined
          ? 0
          : this.props.APEPIDetail.C12R,
      C13R:
        this.props.APEPIDetail.C13R == undefined
          ? 0
          : this.props.APEPIDetail.C13R,
      C11D:
        Number(this.resetNAValue(this.props.APEPIDetail.C11R)) -
        Number(this.resetNAValue(this.props.APEPIDetail.C11E)),
      C12D:
        Number(this.resetNAValue(this.props.APEPIDetail.C12R)) -
        Number(this.resetNAValue(this.props.APEPIDetail.C12E)),
      C13D:
        Number(this.resetNAValue(this.props.APEPIDetail.C13R)) -
        Number(this.resetNAValue(this.props.APEPIDetail.C13E)),

      //  // Section C2 State

      C21E:
        this.props.APEPIDetail.C21E == undefined
          ? 0
          : this.props.APEPIDetail.C21E,
      C22E:
        this.props.APEPIDetail.C22E == undefined
          ? 0
          : this.props.APEPIDetail.C22E,
      C23E:
        this.props.APEPIDetail.C23E == undefined
          ? 0
          : this.props.APEPIDetail.C23E,
      C24E:
        this.props.APEPIDetail.C24E == undefined
          ? 0
          : this.props.APEPIDetail.C24E,
      C21R:
        this.props.APEPIDetail.C21R == undefined
          ? 0
          : this.props.APEPIDetail.C21R,
      C22R:
        this.props.APEPIDetail.C22R == undefined
          ? 0
          : this.props.APEPIDetail.C22R,
      C23R:
        this.props.APEPIDetail.C23R == undefined
          ? 0
          : this.props.APEPIDetail.C23R,
      C24R:
        this.props.APEPIDetail.C24R == undefined
          ? 0
          : this.props.APEPIDetail.C24R,
      C21D:
        Number(this.resetNAValue(this.props.APEPIDetail.C21R)) -
        Number(this.resetNAValue(this.props.APEPIDetail.C21E)),
      C22D:
        Number(this.resetNAValue(this.props.APEPIDetail.C22R)) -
        Number(this.resetNAValue(this.props.APEPIDetail.C22E)),
      C23D:
        Number(this.resetNAValue(this.props.APEPIDetail.C23R)) -
        Number(this.resetNAValue(this.props.APEPIDetail.C23E)),
      C24D:
        Number(this.resetNAValue(this.props.APEPIDetail.C24R)) -
        Number(this.resetNAValue(this.props.APEPIDetail.C24E)),

      //  // Section C3 State

      C31E:
        this.props.APEPIDetail.C31E == undefined
          ? 0
          : this.props.APEPIDetail.C31E,
      C32E:
        this.props.APEPIDetail.C32E == undefined
          ? 0
          : this.props.APEPIDetail.C32E,
      C33E:
        this.props.APEPIDetail.C33E == undefined
          ? 0
          : this.props.APEPIDetail.C33E,
      C31R:
        this.props.APEPIDetail.C31R == undefined
          ? 0
          : this.props.APEPIDetail.C31R,
      C32R:
        this.props.APEPIDetail.C32R == undefined
          ? 0
          : this.props.APEPIDetail.C32R,
      C33R:
        this.props.APEPIDetail.C33R == undefined
          ? 0
          : this.props.APEPIDetail.C33R,
      C31D:
        Number(this.resetNAValue(this.props.APEPIDetail.C31R)) -
        Number(this.resetNAValue(this.props.APEPIDetail.C31E)),
      C32D:
        Number(this.resetNAValue(this.props.APEPIDetail.C32R)) -
        Number(this.resetNAValue(this.props.APEPIDetail.C32E)),
      C33D:
        Number(this.resetNAValue(this.props.APEPIDetail.C33R)) -
        Number(this.resetNAValue(this.props.APEPIDetail.C33E)),

      //
      SctionTotalDE: this.props.SctionTotalDE,
      SctionTotalDR: this.props.SctionTotalDR,
      SctionTotalDD: Number(
        parseFloat(
          Number(this.props.SctionTotalDR - this.props.SctionTotalDE).toString()
        ).toFixed(2)
      ),
      OverallCoreE: 0,
      OverallCoreR: 0,
      OverallPerformance:
        this.props.APEPIDetail.OverallPerformance == undefined
          ? 0
          : this.props.APEPIDetail.OverallPerformance,
      E1EE:
        this.props.APEPIDetail.E1EE == undefined
          ? ""
          : this.props.APEPIDetail.E1EE,
      E1ER:
        this.props.APEPIDetail.E1ER == undefined
          ? ""
          : this.props.APEPIDetail.E1ER,
      F1EE:
        this.props.APEPIDetail.F1EE == undefined
          ? ""
          : this.props.APEPIDetail.F1EE,
      F1ER:
        this.props.APEPIDetail.F1ER == undefined
          ? ""
          : this.props.APEPIDetail.F1ER,
      G1EE:
        this.props.APEPIDetail.G1EE == undefined
          ? ""
          : this.props.APEPIDetail.G1EE,
      G1ER:
        this.props.APEPIDetail.G1ER == undefined
          ? ""
          : this.props.APEPIDetail.G1ER,
      H1EE:
        this.props.APEPIDetail.G1EE == undefined
          ? ""
          : this.props.APEPIDetail.H1EE,
      H1ER:
        this.props.APEPIDetail.G1ER == undefined
          ? ""
          : this.props.APEPIDetail.G1ER,
    };

    this.onREVIEWEESaveDRAFT = this.onREVIEWEESaveDRAFT.bind(this);
    this.onREVIEWEEApproved = this.onREVIEWEEApproved.bind(this);

    this.onREVIEWERSaveDRAFT = this.onREVIEWERSaveDRAFT.bind(this);
    this.onREVIEWERApproved = this.onREVIEWERApproved.bind(this);
    this.onREVERTTOREVIEEE = this.onREVERTTOREVIEEE.bind(this);

    this.onLEADMDApproved = this.onLEADMDApproved.bind(this);
    this.onREVERTTOREVIEER = this.onREVERTTOREVIEER.bind(this);

    this.onFinalSAVEDRAFT = this.onFinalSAVEDRAFT.bind(this);
    this.onSUBMITTOFINALREVIEW = this.onSUBMITTOFINALREVIEW.bind(this);

    this.onFormFieldValueChange = this.onFormFieldValueChange.bind(this);
    this.onChangeE1EE = this.onChangeE1EE.bind(this);
    this.onChangeE1ER = this.onChangeE1ER.bind(this);
    this.onChangeF1EE = this.onChangeF1EE.bind(this);
    this.onChangeF1ER = this.onChangeF1ER.bind(this);
    this.onChangeG1EE = this.onChangeG1EE.bind(this);
    this.onChangeG1ER = this.onChangeG1ER.bind(this);
    this.onChangeH1EE = this.onChangeH1EE.bind(this);
    this.onChangeH1ER = this.onChangeH1ER.bind(this);
    this.onChangeH1EL = this.onChangeH1EL.bind(this);

    this.onChangeRevertToReviewee = this.onChangeRevertToReviewee.bind(this);
    this.onChangeRevertToReviewer = this.onChangeRevertToReviewer.bind(this);
    this.onchangedPerformanceDiscussionDate =
      this.onchangedPerformanceDiscussionDate.bind(this);
    this.onReplacemeSave = this.onReplacemeSave.bind(this);
    this.onChangeReplaceme = this.onChangeReplaceme.bind(this);
    this.onChangeAcknowledgement = this.onChangeAcknowledgement.bind(this);
    this.formatDate = this.formatDate.bind(this);
  }

  // Updating review details updated in child components
  private onFormFieldValueChange(updateDetails) {
    let DSectionReviewee = 0;
    let DSectionReviewer = 0;
    let DSectionDifference = 0;
    updateDetails.map((element, index) => {
      //!   DSectionReviewee =
      //     DSectionReviewee + Number(updateDetails[index].Reviewee);
      //   DSectionReviewer =
      //     DSectionReviewer + Number(updateDetails[index].Reviewer);
      //   DSectionDifference =
      //     DSectionDifference + Number(updateDetails[index].Difference);
      // });

      DSectionReviewee =
        DSectionReviewee +
        Number(
          updateDetails[index].Reviewee == "0.5"
            ? 0
            : updateDetails[index].Reviewee
        );
      DSectionReviewer =
        DSectionReviewer +
        Number(
          updateDetails[index].Reviewer == "0.5"
            ? 0
            : updateDetails[index].Reviewer
        );
      DSectionDifference =
        DSectionDifference + Number(updateDetails[index].Difference);
    });
    // this.setState({SctionTotalDE : DSectionReviewee /updateDetails.length });
    // this.setState({SctionTotalDR : DSectionReviewer /updateDetails.length });

    let avgDSectionReviewee =
      Number(DSectionReviewee) /
      updateDetails.filter((e) => e.Reviewee != 0 && e.Reviewee != 0.5).length;
    this.setState({
      SctionTotalDE: Number(
        parseFloat(
          (isNaN(avgDSectionReviewee) ? 0 : avgDSectionReviewee).toString()
        ).toFixed(2)
      ),
    });
    let avgDSectionReviewer =
      Number(DSectionReviewer) /
      updateDetails.filter((e) => e.Reviewer != 0 && e.Reviewer != 0.5).length;
    this.setState({
      SctionTotalDR: Number(
        parseFloat(
          (isNaN(avgDSectionReviewer) ? 0 : avgDSectionReviewer).toString()
        ).toFixed(2)
      ),
    });
    let avgDDifference =
      Number(DSectionDifference) /
      updateDetails.filter(
        (e) =>
          e.QuestionText != "N/A" &&
          (e.Reviewee != "0.5" || e.Reviewer != "0.5")
      ).length;
    // let avgDDifference =
    //   Number(DSectionDifference) /
    //   updateDetails.filter((e) => e.Difference != 0).length;
    // this.setState({
    //   SctionTotalDD: Number(
    //     parseFloat(
    //       (isNaN(avgDDifference) ? 0 : avgDDifference).toString()
    //     ).toFixed(2)
    //   ),
    // });
    this.setState({
      SctionTotalDD: Number(
        parseFloat(
          Number(
            (isNaN(avgDSectionReviewer) ? 0 : avgDSectionReviewer) -
              (isNaN(avgDSectionReviewee) ? 0 : avgDSectionReviewee)
          ).toString()
        ).toFixed(2)
      ),
    });

    //! this.setState({
    //   SctionTotalDE: Number(
    //     parseFloat(
    //       (Number(DSectionReviewee) / updateDetails.length).toString()
    //     ).toFixed(2)
    //   ),
    // });
    // this.setState({
    //   SctionTotalDR: Number(
    //     parseFloat(
    //       (Number(DSectionReviewer) / updateDetails.length).toString()
    //     ).toFixed(2)
    //   ),
    // });
    // this.setState({
    //   SctionTotalDD: Number(
    //     parseFloat(
    //       (Number(DSectionDifference) / updateDetails.length).toString()
    //     ).toFixed(2)
    //   ),
    // });

    this.setState({
      ApepiQuestionText: updateDetails,
    });
  }
  public async componentDidMount() {
    this.FillOptions();
    this.onFormFieldValueChange(this.props.APEPIQuestionText);
    if (
      this.props.APEPIDetail.StatusOfReview ==
        Config.StatusOfReview.AwaitingReviewee &&
      (this.props.APEPIDetail.Reviewee.Email == this.props.loggeduseremail ||
        this.props.isAdmin)
    ) {
      this.setState({ IsReviewee: false });
      //! Technorucs
      this.setState({
        // Section A1 State
        revieweePermission: true,
        A11R: 0,
        A12R: 0,
        A13R: 0,
        A14R: 0,
        A15R: 0,
        A11D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.A11E)),
        A12D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.A12E)),
        A13D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.A13E)),
        A14D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.A14E)),
        A15D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.A15E)),

        A1RR: 0,
        A1DD: Number(
          parseFloat(
            (
              0 -
              Number(
                this.props.APEPIDetail.A1EE == undefined
                  ? 0
                  : this.props.APEPIDetail.A1EE
              )
            ).toString()
          ).toFixed(2)
        ),

        // Section A2 State
        A21R: 0,
        A22R: 0,
        A23R: 0,
        A24R: 0,
        A21D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.A21E)),
        A22D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.A22E)),
        A23D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.A23E)),
        A24D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.A24E)),
        A2RR: 0,
        A2DD: Number(
          parseFloat(
            (
              0 -
              Number(
                this.props.APEPIDetail.A2EE == undefined
                  ? 0
                  : this.props.APEPIDetail.A2EE
              )
            ).toString()
          ).toFixed(2)
        ),

        // Section A3 State
        A31R: 0,
        A32R: 0,
        A33R: 0,
        A31D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.A31E)),
        A32D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.A32E)),
        A33D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.A33E)),
        A3RR: 0,

        A3DD: Number(
          parseFloat(
            (
              0 -
              Number(
                this.props.APEPIDetail.A3EE == undefined
                  ? 0
                  : this.props.APEPIDetail.A3EE
              )
            ).toString()
          ).toFixed(2)
        ),
        AAvgER: 0,
        SctionTotalAD: Number(
          parseFloat(
            (
              0 -
              Number(
                this.props.APEPIDetail.AAvgEE == undefined
                  ? 0
                  : this.props.APEPIDetail.AAvgEE
              )
            ).toString()
          ).toFixed(2)
        ),

        B1RR: 0,
        B1DD:
          0 -
          Number(
            this.props.APEPIDetail.B1EE == undefined
              ? 0
              : this.props.APEPIDetail.B1EE
          ),

        B2RR: 0,
        B2DD: Number(
          parseFloat(
            (
              0 -
              Number(
                this.props.APEPIDetail.B2EE == undefined
                  ? 0
                  : this.props.APEPIDetail.B2EE
              )
            ).toString()
          ).toFixed(2)
        ),

        B3RR: 0,
        B3DD: Number(
          parseFloat(
            (
              0 -
              Number(
                this.props.APEPIDetail.B3EE == undefined
                  ? 0
                  : this.props.APEPIDetail.B3EE
              )
            ).toString()
          ).toFixed(2)
        ),

        B4RR: 0,

        B4DD: Number(
          parseFloat(
            (
              0 -
              Number(
                this.props.APEPIDetail.B4EE == undefined
                  ? 0
                  : this.props.APEPIDetail.B4EE
              )
            ).toString()
          ).toFixed(2)
        ),
        // Section B1 State
        B11R: 0,
        B12R: 0,
        B11D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.B11E)),
        B12D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.B12E)),

        // Section B2 State
        B21R: 0,
        B22R: 0,
        B23R: 0,
        B21D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.B21E)),
        B22D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.B22E)),
        B23D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.B23E)),

        // Section B3 State

        B31R: 0,
        B32R: 0,
        B33R: 0,
        B31D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.B31E)),
        B32D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.B32E)),
        B33D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.B33E)),

        //Section B4 State

        B41R: 0,
        B42R: 0,
        B43R: 0,
        B41D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.B41E)),
        B42D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.B42E)),
        B43D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.B43E)),
        BAvgER: 0,
        SctionTotalBD: Number(
          parseFloat(
            (
              0 -
              Number(
                this.props.APEPIDetail.BAvgEE == undefined
                  ? 0
                  : this.props.APEPIDetail.BAvgEE
              )
            ).toString()
          ).toFixed(2)
        ),
        // Section C1 State

        CAvgER: 0,

        SctionTotalCD: Number(
          parseFloat(
            (
              0 -
              Number(
                this.props.APEPIDetail.CAvgEE == undefined
                  ? 0
                  : this.props.APEPIDetail.CAvgEE
              )
            ).toString()
          ).toFixed(2)
        ),

        C1RR: 0,

        C2RR: 0,

        C3RR: 0,
        C1DD: Number(
          parseFloat(
            (
              0 -
              Number(
                this.props.APEPIDetail.C1EE == undefined
                  ? 0
                  : this.props.APEPIDetail.C1EE
              )
            ).toString()
          ).toFixed(2)
        ),
        C2DD: Number(
          parseFloat(
            (
              0 -
              Number(
                this.props.APEPIDetail.C2EE == undefined
                  ? 0
                  : this.props.APEPIDetail.C2EE
              )
            ).toString()
          ).toFixed(2)
        ),
        C3DD: Number(
          parseFloat(
            (
              0 -
              Number(
                this.props.APEPIDetail.C3EE == undefined
                  ? 0
                  : this.props.APEPIDetail.C3EE
              )
            ).toString()
          ).toFixed(2)
        ),
        C11R: 0,
        C12R: 0,
        C13R: 0,
        C11D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.C11E)),
        C12D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.C12E)),
        C13D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.C13E)),

        //Section C2 State

        C21R: 0,
        C22R: 0,
        C23R: 0,
        C24R: 0,
        C21D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.C21E)),
        C22D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.C22E)),
        C23D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.C23E)),
        C24D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.C24E)),

        // Section C3 State

        C31R: 0,
        C32R: 0,
        C33R: 0,
        C31D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.C31E)),
        C32D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.C32E)),
        C33D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.C33E)),

        SctionTotalDR: 0,
        SctionTotalDD: Number(
          parseFloat(Number(0 - this.props.SctionTotalDE).toString()).toFixed(2)
        ),
        OverallCoreR: 0,
        OverallPerformance:
          this.props.APEPIDetail.OverallPerformance == undefined
            ? 0
            : this.props.APEPIDetail.OverallPerformance,
        E1ER: "",

        F1ER: "",

        G1ER: "",

        H1ER: "",
      });
      let curretState = this.state.ApepiDetails;
      curretState.E1ER = "";
      curretState.F1ER = "";
      curretState.G1ER = "";
      curretState.H1ER = "";
      this.setState({
        ApepiDetails: curretState,
      });
    } else if (
      this.props.APEPIDetail.StatusOfReview ==
        Config.StatusOfReview.AwaitingReviewer &&
      (this.props.APEPIDetail.Reviewer.Email == this.props.loggeduseremail ||
        this.props.isAdmin)
    ) {
      this.setState({ IsReviewer: false });
    } else if (
      this.props.APEPIDetail.StatusOfReview ==
        Config.StatusOfReview.AwaitingLeadMD &&
      (this.props.APEPIDetail.LeadMD.Email == this.props.loggeduseremail ||
        this.props.isAdmin)
    ) {
      this.setState({ IsLeadMD: false });
    } else if (
      this.props.APEPIDetail.StatusOfReview ==
        Config.StatusOfReview.AwaitingAcknowledgement &&
      (this.props.APEPIDetail.Reviewee.Email == this.props.loggeduseremail ||
        this.props.isAdmin)
    ) {
      this.setState({ IsAcknowledgement: false });
    } else if (
      this.props.APEPIDetail.StatusOfReview ==
      Config.StatusOfReview.Acknowledged
    ) {
      this.setState({ IsApprovaed: false });
    } else if (
      this.props.APEPIDetail.StatusOfReview ==
        Config.StatusOfReview.AwaitingLeadMD &&
      (this.props.APEPIDetail.Reviewer.Email == this.props.loggeduseremail ||
        this.props.isAdmin)
    ) {
      /* Deva change */
      this.setState({
        revieweePermission: false,
      })
    } else {
      //! Technorucs
      this.setState({
        // Section A1 State
        revieweePermission: true,
        A11R: 0,
        A12R: 0,
        A13R: 0,
        A14R: 0,
        A15R: 0,
        A11D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.A11E)),
        A12D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.A12E)),
        A13D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.A13E)),
        A14D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.A14E)),
        A15D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.A15E)),

        A1RR: 0,
        A1DD: Number(
          parseFloat(
            (
              0 -
              Number(
                this.props.APEPIDetail.A1EE == undefined
                  ? 0
                  : this.props.APEPIDetail.A1EE
              )
            ).toString()
          ).toFixed(2)
        ),

        // Section A2 State
        A21R: 0,
        A22R: 0,
        A23R: 0,
        A24R: 0,
        A21D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.A21E)),
        A22D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.A22E)),
        A23D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.A23E)),
        A24D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.A24E)),
        A2RR: 0,
        A2DD: Number(
          parseFloat(
            (
              0 -
              Number(
                this.props.APEPIDetail.A2EE == undefined
                  ? 0
                  : this.props.APEPIDetail.A2EE
              )
            ).toString()
          ).toFixed(2)
        ),

        // Section A3 State
        A31R: 0,
        A32R: 0,
        A33R: 0,
        A31D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.A31E)),
        A32D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.A32E)),
        A33D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.A33E)),
        A3RR: 0,

        A3DD: Number(
          parseFloat(
            (
              0 -
              Number(
                this.props.APEPIDetail.A3EE == undefined
                  ? 0
                  : this.props.APEPIDetail.A3EE
              )
            ).toString()
          ).toFixed(2)
        ),
        AAvgER: 0,
        SctionTotalAD: Number(
          parseFloat(
            (
              0 -
              Number(
                this.props.APEPIDetail.AAvgEE == undefined
                  ? 0
                  : this.props.APEPIDetail.AAvgEE
              )
            ).toString()
          ).toFixed(2)
        ),

        B1RR: 0,
        B1DD:
          0 -
          Number(
            this.props.APEPIDetail.B1EE == undefined
              ? 0
              : this.props.APEPIDetail.B1EE
          ),

        B2RR: 0,
        B2DD: Number(
          parseFloat(
            (
              0 -
              Number(
                this.props.APEPIDetail.B2EE == undefined
                  ? 0
                  : this.props.APEPIDetail.B2EE
              )
            ).toString()
          ).toFixed(2)
        ),

        B3RR: 0,
        B3DD: Number(
          parseFloat(
            (
              0 -
              Number(
                this.props.APEPIDetail.B3EE == undefined
                  ? 0
                  : this.props.APEPIDetail.B3EE
              )
            ).toString()
          ).toFixed(2)
        ),

        B4RR: 0,

        B4DD: Number(
          parseFloat(
            (
              0 -
              Number(
                this.props.APEPIDetail.B4EE == undefined
                  ? 0
                  : this.props.APEPIDetail.B4EE
              )
            ).toString()
          ).toFixed(2)
        ),
        // Section B1 State
        B11R: 0,
        B12R: 0,
        B11D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.B11E)),
        B12D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.B12E)),

        // Section B2 State
        B21R: 0,
        B22R: 0,
        B23R: 0,
        B21D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.B21E)),
        B22D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.B22E)),
        B23D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.B23E)),

        // Section B3 State

        B31R: 0,
        B32R: 0,
        B33R: 0,
        B31D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.B31E)),
        B32D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.B32E)),
        B33D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.B33E)),

        //Section B4 State

        B41R: 0,
        B42R: 0,
        B43R: 0,
        B41D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.B41E)),
        B42D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.B42E)),
        B43D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.B43E)),
        BAvgER: 0,
        SctionTotalBD: Number(
          parseFloat(
            (
              0 -
              Number(
                this.props.APEPIDetail.BAvgEE == undefined
                  ? 0
                  : this.props.APEPIDetail.BAvgEE
              )
            ).toString()
          ).toFixed(2)
        ),
        // Section C1 State

        CAvgER: 0,

        SctionTotalCD: Number(
          parseFloat(
            (
              0 -
              Number(
                this.props.APEPIDetail.CAvgEE == undefined
                  ? 0
                  : this.props.APEPIDetail.CAvgEE
              )
            ).toString()
          ).toFixed(2)
        ),

        C1RR: 0,

        C2RR: 0,

        C3RR: 0,
        C1DD: Number(
          parseFloat(
            (
              0 -
              Number(
                this.props.APEPIDetail.C1EE == undefined
                  ? 0
                  : this.props.APEPIDetail.C1EE
              )
            ).toString()
          ).toFixed(2)
        ),
        C2DD: Number(
          parseFloat(
            (
              0 -
              Number(
                this.props.APEPIDetail.C2EE == undefined
                  ? 0
                  : this.props.APEPIDetail.C2EE
              )
            ).toString()
          ).toFixed(2)
        ),
        C3DD: Number(
          parseFloat(
            (
              0 -
              Number(
                this.props.APEPIDetail.C3EE == undefined
                  ? 0
                  : this.props.APEPIDetail.C3EE
              )
            ).toString()
          ).toFixed(2)
        ),
        C11R: 0,
        C12R: 0,
        C13R: 0,
        C11D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.C11E)),
        C12D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.C12E)),
        C13D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.C13E)),

        //Section C2 State

        C21R: 0,
        C22R: 0,
        C23R: 0,
        C24R: 0,
        C21D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.C21E)),
        C22D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.C22E)),
        C23D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.C23E)),
        C24D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.C24E)),

        // Section C3 State

        C31R: 0,
        C32R: 0,
        C33R: 0,
        C31D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.C31E)),
        C32D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.C32E)),
        C33D: 0 - Number(this.resetNAValue(this.props.APEPIDetail.C33E)),

        SctionTotalDR: 0,
        SctionTotalDD: Number(
          parseFloat(Number(0 - this.props.SctionTotalDE).toString()).toFixed(2)
        ),
        OverallCoreR: 0,
        OverallPerformance:
          this.props.APEPIDetail.OverallPerformance == undefined
            ? 0
            : this.props.APEPIDetail.OverallPerformance,
        E1ER: "",

        F1ER: "",

        G1ER: "",

        H1ER: "",
      });
    }
    // // // //this.state.ApepiDetails.PerformanceDiscussion
    // // let curretState = this.state.ApepiDetails;
    // // curretState.PerformanceDiscussion = new Date();
    // // this.onFormTextFieldValueChange(curretState);
    // // // //this.setState({ApepiDetails.PerformanceDiscussion : new Date()});

    //this.setState({IsReviewer : false});
  }

  private gotoListPage() {
    let returnURL =
      this.props.AppContext.pageContext.web.absoluteUrl +
      Config.Links.HomePageLink;
    window.location.href = returnURL;
    return false;
  }
  // FillOptions
  private async FillOptions() {
    //this.props.Options = [{text:'0',key: 0} ,{text:'1',key: 1},{text:'2',key: 2},{text:'3',key: 3},{text:'4',key: 4}];
  }

  private async onREVIEWEESaveDRAFT(): Promise<void> {
    let ApepiQuestionText = this.state.ApepiQuestionText;
    const pepiDetails = this.state.ApepiDetails;
    let data = {};
    const columns = Config.PEPIProjectsListColumns;
    // section A
    data[columns.A1EE] = Number(this.state.A1EE);
    data[columns.A2EE] = Number(this.state.A2EE);
    data[columns.A3EE] = Number(this.state.A3EE);
    data[columns.A11E] = Number(this.state.A11E);
    data[columns.A12E] = Number(this.state.A12E);
    data[columns.A13E] = Number(this.state.A13E);
    data[columns.A14E] = Number(this.state.A14E);
    data[columns.A15E] = Number(this.state.A15E);
    data[columns.A21E] = Number(this.state.A21E);
    data[columns.A22E] = Number(this.state.A22E);
    data[columns.A23E] = Number(this.state.A23E);
    data[columns.A24E] = Number(this.state.A24E);
    data[columns.A31E] = Number(this.state.A31E);
    data[columns.A32E] = Number(this.state.A32E);
    data[columns.A33E] = Number(this.state.A33E);
    // Section B
    data[columns.B1EE] = Number(this.state.B1EE);
    data[columns.B2EE] = Number(this.state.B2EE);
    data[columns.B3EE] = Number(this.state.B3EE);
    data[columns.B4EE] = Number(this.state.B4EE);
    data[columns.B11E] = Number(this.state.B11E);
    data[columns.B12E] = Number(this.state.B12E);
    data[columns.B21E] = Number(this.state.B21E);
    data[columns.B22E] = Number(this.state.B22E);
    data[columns.B23E] = Number(this.state.B23E);
    data[columns.B31E] = Number(this.state.B31E);
    data[columns.B32E] = Number(this.state.B32E);
    data[columns.B33E] = Number(this.state.B33E);
    data[columns.B41E] = Number(this.state.B41E);
    data[columns.B42E] = Number(this.state.B42E);
    data[columns.B43E] = Number(this.state.B43E);

    //Section C
    data[columns.C1EE] = Number(this.state.C1EE);
    data[columns.C2EE] = Number(this.state.C2EE);
    data[columns.C3EE] = Number(this.state.C3EE);
    data[columns.C11E] = Number(this.state.C11E);
    data[columns.C12E] = Number(this.state.C12E);
    data[columns.C13E] = Number(this.state.C13E);
    data[columns.C21E] = Number(this.state.C21E);
    data[columns.C22E] = Number(this.state.C22E);
    data[columns.C23E] = Number(this.state.C23E);
    data[columns.C24E] = Number(this.state.C24E);
    data[columns.C31E] = Number(this.state.C31E);
    data[columns.C32E] = Number(this.state.C32E);
    data[columns.C33E] = Number(this.state.C33E);
    data[columns.AAvgEE] = Number(this.state.AAvgEE);
    data[columns.BAvgEE] = Number(this.state.BAvgEE);
    data[columns.CAvgEE] = Number(this.state.CAvgEE);

    data[columns.E1EE] = this.state.ApepiDetails.E1EE;
    data[columns.F1EE] = this.state.ApepiDetails.F1EE;
    data[columns.G1EE] = this.state.ApepiDetails.G1EE;
    data[columns.H1EE] = this.state.ApepiDetails.H1EE;

    data[columns.Complexity] = this.props.APEPIDetail.Complexity;

    /* Deva changes start */
    data[columns.OverallPerformance] = String(this.state.OverallPerformance);
    /* Deva changes end */
    
    //Section D
    //  if(ApepiQuestionText[0] != ""){

    //  }

    const D11E = ApepiQuestionText.map((item) => item.Reviewee).join(";");
    data[columns.D11E] = D11E;

    this.listPEPIProjectsItemService = new ListItemService(
      this.props.AppContext,
      Config.ListNames.PEPIProjects
    );
    await this.listPEPIProjectsItemService.updateItem(
      this.props.APEPIDetail.ID,
      data
    );
    this.gotoListPage();
  }

  private async onREVIEWEEApproved(): Promise<void> {
    let ApepiQuestionText = this.state.ApepiQuestionText;
    const pepiDetails = this.state.ApepiDetails;
    let data = {};
    const columns = Config.PEPIProjectsListColumns;

    data[columns.StatusOfReview] = Config.StatusOfReview.AwaitingReviewer;
    data[columns.Complexity] = this.props.APEPIDetail.Complexity;
    data[columns.Submitted] = Config.SubmittedNumber[2];
    // section A
    data[columns.A1EE] = Number(this.state.A1EE);
    data[columns.A2EE] = Number(this.state.A2EE);
    data[columns.A3EE] = Number(this.state.A3EE);
    data[columns.A11E] = Number(this.state.A11E);
    data[columns.A12E] = Number(this.state.A12E);
    data[columns.A13E] = Number(this.state.A13E);
    data[columns.A14E] = Number(this.state.A14E);
    data[columns.A15E] = Number(this.state.A15E);
    data[columns.A21E] = Number(this.state.A21E);
    data[columns.A22E] = Number(this.state.A22E);
    data[columns.A23E] = Number(this.state.A23E);
    data[columns.A24E] = Number(this.state.A24E);
    data[columns.A31E] = Number(this.state.A31E);
    data[columns.A32E] = Number(this.state.A32E);
    data[columns.A33E] = Number(this.state.A33E);
    // Section B
    data[columns.B1EE] = Number(this.state.B1EE);
    data[columns.B2EE] = Number(this.state.B2EE);
    data[columns.B3EE] = Number(this.state.B3EE);
    data[columns.B4EE] = Number(this.state.B4EE);
    data[columns.B11E] = Number(this.state.B11E);
    data[columns.B12E] = Number(this.state.B12E);
    data[columns.B21E] = Number(this.state.B21E);
    data[columns.B22E] = Number(this.state.B22E);
    data[columns.B23E] = Number(this.state.B23E);
    data[columns.B31E] = Number(this.state.B31E);
    data[columns.B32E] = Number(this.state.B32E);
    data[columns.B33E] = Number(this.state.B33E);
    data[columns.B41E] = Number(this.state.B41E);
    data[columns.B42E] = Number(this.state.B42E);
    data[columns.B43E] = Number(this.state.B43E);

    //Section C
    data[columns.C1EE] = Number(this.state.C1EE);
    data[columns.C2EE] = Number(this.state.C2EE);
    data[columns.C3EE] = Number(this.state.C3EE);
    data[columns.C11E] = Number(this.state.C11E);
    data[columns.C12E] = Number(this.state.C12E);
    data[columns.C13E] = Number(this.state.C13E);
    data[columns.C21E] = Number(this.state.C21E);
    data[columns.C22E] = Number(this.state.C22E);
    data[columns.C23E] = Number(this.state.C23E);
    data[columns.C24E] = Number(this.state.C24E);
    data[columns.C31E] = Number(this.state.C31E);
    data[columns.C32E] = Number(this.state.C32E);
    data[columns.C33E] = Number(this.state.C33E);
    data[columns.AAvgEE] = Number(this.state.AAvgEE);
    data[columns.BAvgEE] = Number(this.state.BAvgEE);
    data[columns.CAvgEE] = Number(this.state.CAvgEE);
    data[columns.E1EE] = this.state.ApepiDetails.E1EE;
    data[columns.F1EE] = this.state.ApepiDetails.F1EE;
    data[columns.G1EE] = this.state.ApepiDetails.G1EE;
    data[columns.H1EE] = this.state.ApepiDetails.H1EE;

    const D11E = ApepiQuestionText.map((item) => item.Reviewee).join(";");
    data[columns.D11E] = D11E;

    this.listPEPIProjectsItemService = new ListItemService(
      this.props.AppContext,
      Config.ListNames.PEPIProjects
    );
    await this.listPEPIProjectsItemService.updateItem(
      this.props.APEPIDetail.ID,
      data
    );
    this.gotoListPage();
  }

  private async onREVIEWERSaveDRAFT(): Promise<void> {
    let ApepiQuestionText = this.state.ApepiQuestionText;
    const pepiDetails = this.state.ApepiDetails;
    let data = {};
    const columns = Config.PEPIProjectsListColumns;

    data[columns.Complexity] = this.props.APEPIDetail.Complexity;
    // section A
    data[columns.A1RR] = Number(this.state.A1RR);
    data[columns.A2RR] = Number(this.state.A2RR);
    data[columns.A3RR] = Number(this.state.A3RR);
    data[columns.A11R] = Number(this.state.A11R);
    data[columns.A12R] = Number(this.state.A12R);
    data[columns.A13R] = Number(this.state.A13R);
    data[columns.A14R] = Number(this.state.A14R);
    data[columns.A15R] = Number(this.state.A15R);
    data[columns.A21R] = Number(this.state.A21R);
    data[columns.A22R] = Number(this.state.A22R);
    data[columns.A23R] = Number(this.state.A23R);
    data[columns.A24R] = Number(this.state.A24R);
    data[columns.A31R] = Number(this.state.A31R);
    data[columns.A32R] = Number(this.state.A32R);
    data[columns.A33R] = Number(this.state.A33R);
    // Section B
    data[columns.B1RR] = Number(this.state.B1RR);
    data[columns.B2RR] = Number(this.state.B2RR);
    data[columns.B3RR] = Number(this.state.B3RR);
    data[columns.B4RR] = Number(this.state.B4RR);
    data[columns.B11R] = Number(this.state.B11R);
    data[columns.B12R] = Number(this.state.B12R);
    data[columns.B21R] = Number(this.state.B21R);
    data[columns.B22R] = Number(this.state.B22R);
    data[columns.B23R] = Number(this.state.B23R);
    data[columns.B31R] = Number(this.state.B31R);
    data[columns.B32R] = Number(this.state.B32R);
    data[columns.B33R] = Number(this.state.B33R);
    data[columns.B41R] = Number(this.state.B41R);
    data[columns.B42R] = Number(this.state.B42R);
    data[columns.B43R] = Number(this.state.B43R);

    //Section C
    data[columns.C1RR] = Number(this.state.C1RR);
    data[columns.C2RR] = Number(this.state.C2RR);
    data[columns.C3RR] = Number(this.state.C3RR);
    data[columns.C11R] = Number(this.state.C11R);
    data[columns.C12R] = Number(this.state.C12R);
    data[columns.C13R] = Number(this.state.C13R);
    data[columns.C21R] = Number(this.state.C21R);
    data[columns.C22R] = Number(this.state.C22R);
    data[columns.C23R] = Number(this.state.C23R);
    data[columns.C24R] = Number(this.state.C24R);
    data[columns.C31R] = Number(this.state.C31R);
    data[columns.C32R] = Number(this.state.C32R);
    data[columns.C33R] = Number(this.state.C33R);
    data[columns.AAvgER] = Number(this.state.AAvgER);
    data[columns.BAvgER] = Number(this.state.BAvgER);
    data[columns.CAvgER] = Number(this.state.CAvgER);

    data[columns.OverallPerformance] = String(this.state.OverallPerformance);

    data[columns.E1ER] = this.state.ApepiDetails.E1ER;
    data[columns.F1ER] = this.state.ApepiDetails.F1ER;
    data[columns.G1ER] = this.state.ApepiDetails.G1ER;
    // data[columns.H1ER] = this.state.ApepiDetails.H1ER;
    data[columns.H1ER] = this.state.ApepiDetails.H1ER;
    data[columns.PerformanceDiscussion] =
      this.state.ApepiDetails.PerformanceDiscussion;
    const D11R = ApepiQuestionText.map((item) => item.Reviewer).join(";");
    data[columns.D11R] = D11R;

    this.listPEPIProjectsItemService = new ListItemService(
      this.props.AppContext,
      Config.ListNames.PEPIProjects
    );
    await this.listPEPIProjectsItemService.updateItem(
      this.props.APEPIDetail.ID,
      data
    );
    this.gotoListPage();
  }

  private async onREVIEWERApproved(): Promise<void> {
    let ApepiQuestionText = this.state.ApepiQuestionText;
    const pepiDetails = this.state.ApepiDetails;
    let data = {};
    const columns = Config.PEPIProjectsListColumns;

    data[columns.StatusOfReview] = Config.StatusOfReview.AwaitingLeadMD;
    data[columns.Submitted] = Config.SubmittedNumber[4];
    data[columns.Complexity] = this.props.APEPIDetail.Complexity;
    // data[columns.Submitted] = Config.SubmittedNumber[4];
    // section A
    // section A
    data[columns.A1RR] = Number(this.state.A1RR);
    data[columns.A2RR] = Number(this.state.A2RR);
    data[columns.A3RR] = Number(this.state.A3RR);
    data[columns.A11R] = Number(this.state.A11R);
    data[columns.A12R] = Number(this.state.A12R);
    data[columns.A13R] = Number(this.state.A13R);
    data[columns.A14R] = Number(this.state.A14R);
    data[columns.A15R] = Number(this.state.A15R);
    data[columns.A21R] = Number(this.state.A21R);
    data[columns.A22R] = Number(this.state.A22R);
    data[columns.A23R] = Number(this.state.A23R);
    data[columns.A24R] = Number(this.state.A24R);
    data[columns.A31R] = Number(this.state.A31R);
    data[columns.A32R] = Number(this.state.A32R);
    data[columns.A33R] = Number(this.state.A33R);
    // Section B
    data[columns.B1RR] = Number(this.state.B1RR);
    data[columns.B2RR] = Number(this.state.B2RR);
    data[columns.B3RR] = Number(this.state.B3RR);
    data[columns.B4RR] = Number(this.state.B4RR);
    data[columns.B11R] = Number(this.state.B11R);
    data[columns.B12R] = Number(this.state.B12R);
    data[columns.B21R] = Number(this.state.B21R);
    data[columns.B22R] = Number(this.state.B22R);
    data[columns.B23R] = Number(this.state.B23R);
    data[columns.B31R] = Number(this.state.B31R);
    data[columns.B32R] = Number(this.state.B32R);
    data[columns.B33R] = Number(this.state.B33R);
    data[columns.B41R] = Number(this.state.B41R);
    data[columns.B42R] = Number(this.state.B42R);
    data[columns.B43R] = Number(this.state.B43R);

    //Section C
    data[columns.C1RR] = Number(this.state.C1RR);
    data[columns.C2RR] = Number(this.state.C2RR);
    data[columns.C3RR] = Number(this.state.C3RR);
    data[columns.C11R] = Number(this.state.C11R);
    data[columns.C12R] = Number(this.state.C12R);
    data[columns.C13R] = Number(this.state.C13R);
    data[columns.C21R] = Number(this.state.C21R);
    data[columns.C22R] = Number(this.state.C22R);
    data[columns.C23R] = Number(this.state.C23R);
    data[columns.C24R] = Number(this.state.C24R);
    data[columns.C31R] = Number(this.state.C31R);
    data[columns.C32R] = Number(this.state.C32R);
    data[columns.C33R] = Number(this.state.C33R);
    data[columns.AAvgER] = Number(this.state.AAvgER);
    data[columns.BAvgER] = Number(this.state.BAvgER);
    data[columns.CAvgER] = Number(this.state.CAvgER);

    data[columns.OverallPerformance] = String(this.state.OverallPerformance);

    data[columns.E1ER] = this.state.ApepiDetails.E1ER;
    data[columns.F1ER] = this.state.ApepiDetails.F1ER;
    data[columns.G1ER] = this.state.ApepiDetails.G1ER;
    data[columns.H1ER] = this.state.ApepiDetails.H1ER;
    data[columns.PerformanceDiscussion] =
      this.state.ApepiDetails.PerformanceDiscussion;
    const D11R = ApepiQuestionText.map((item) => item.Reviewer).join(";");
    data[columns.D11R] = D11R;

    this.listPEPIProjectsItemService = new ListItemService(
      this.props.AppContext,
      Config.ListNames.PEPIProjects
    );
    await this.listPEPIProjectsItemService.updateItem(
      this.props.APEPIDetail.ID,
      data
    );

    this.gotoListPage();
  }

  private async onREVERTTOREVIEEE(): Promise<void> {
    const pepiDetails = this.state.ApepiDetails;
    let data = {};
    const columns = Config.PEPIProjectsListColumns;
    data[columns.StatusOfReview] = Config.StatusOfReview.AwaitingReviewee;
    data[columns.Submitted] = Config.SubmittedNumber[3];
    // data[columns.RevertToReviewee] = Number(
    //   this.state.ApepiDetails.RevertToReviewee
    // );

    data[columns.RevertToReviewee] = this.state.ApepiDetails.RevertToReviewee;

    //! Technorucs

    let ApepiQuestionText = this.state.ApepiQuestionText;
    // section A
    data[columns.A1RR] = Number(this.state.A1RR);
    data[columns.A2RR] = Number(this.state.A2RR);
    data[columns.A3RR] = Number(this.state.A3RR);
    data[columns.A11R] = Number(this.state.A11R);
    data[columns.A12R] = Number(this.state.A12R);
    data[columns.A13R] = Number(this.state.A13R);
    data[columns.A14R] = Number(this.state.A14R);
    data[columns.A15R] = Number(this.state.A15R);
    data[columns.A21R] = Number(this.state.A21R);
    data[columns.A22R] = Number(this.state.A22R);
    data[columns.A23R] = Number(this.state.A23R);
    data[columns.A24R] = Number(this.state.A24R);
    data[columns.A31R] = Number(this.state.A31R);
    data[columns.A32R] = Number(this.state.A32R);
    data[columns.A33R] = Number(this.state.A33R);
    // Section B
    data[columns.B1RR] = Number(this.state.B1RR);
    data[columns.B2RR] = Number(this.state.B2RR);
    data[columns.B3RR] = Number(this.state.B3RR);
    data[columns.B4RR] = Number(this.state.B4RR);
    data[columns.B11R] = Number(this.state.B11R);
    data[columns.B12R] = Number(this.state.B12R);
    data[columns.B21R] = Number(this.state.B21R);
    data[columns.B22R] = Number(this.state.B22R);
    data[columns.B23R] = Number(this.state.B23R);
    data[columns.B31R] = Number(this.state.B31R);
    data[columns.B32R] = Number(this.state.B32R);
    data[columns.B33R] = Number(this.state.B33R);
    data[columns.B41R] = Number(this.state.B41R);
    data[columns.B42R] = Number(this.state.B42R);
    data[columns.B43R] = Number(this.state.B43R);

    //Section C
    data[columns.C1RR] = Number(this.state.C1RR);
    data[columns.C2RR] = Number(this.state.C2RR);
    data[columns.C3RR] = Number(this.state.C3RR);
    data[columns.C11R] = Number(this.state.C11R);
    data[columns.C12R] = Number(this.state.C12R);
    data[columns.C13R] = Number(this.state.C13R);
    data[columns.C21R] = Number(this.state.C21R);
    data[columns.C22R] = Number(this.state.C22R);
    data[columns.C23R] = Number(this.state.C23R);
    data[columns.C24R] = Number(this.state.C24R);
    data[columns.C31R] = Number(this.state.C31R);
    data[columns.C32R] = Number(this.state.C32R);
    data[columns.C33R] = Number(this.state.C33R);
    data[columns.AAvgER] = Number(this.state.AAvgER);
    data[columns.BAvgER] = Number(this.state.BAvgER);
    data[columns.CAvgER] = Number(this.state.CAvgER);

    data[columns.OverallPerformance] = String(this.state.OverallPerformance);

    data[columns.E1ER] = this.state.ApepiDetails.E1ER;
    data[columns.F1ER] = this.state.ApepiDetails.F1ER;
    data[columns.G1ER] = this.state.ApepiDetails.G1ER;
    data[columns.H1ER] = this.state.ApepiDetails.H1ER;
    data[columns.PerformanceDiscussion] =
      this.state.ApepiDetails.PerformanceDiscussion;
    const D11R = ApepiQuestionText.map((item) => item.Reviewer).join(";");
    data[columns.D11R] = D11R;

    this.listPEPIProjectsItemService = new ListItemService(
      this.props.AppContext,
      Config.ListNames.PEPIProjects
    );
    await this.listPEPIProjectsItemService.updateItem(
      this.props.APEPIDetail.ID,
      data
    );
    this.gotoListPage();
  }

  private async onLEADMDApproved(): Promise<void> {
    const pepiDetails = this.state.ApepiDetails;
    let data = {};
    const columns = Config.PEPIProjectsListColumns;
    data[columns.StatusOfReview] =
      Config.StatusOfReview.AwaitingAcknowledgement;
    data[columns.Submitted] = Config.SubmittedNumber[6];
    data[columns.H1EL] = this.state.ApepiDetails.H1EL;
    this.listPEPIProjectsItemService = new ListItemService(
      this.props.AppContext,
      Config.ListNames.PEPIProjects
    );
    await this.listPEPIProjectsItemService.updateItem(
      this.props.APEPIDetail.ID,
      data
    );
    this.gotoListPage();
  }

  private async onREVERTTOREVIEER(): Promise<void> {
    const pepiDetails = this.state.ApepiDetails;
    let data = {};
    const columns = Config.PEPIProjectsListColumns;
    data[columns.Submitted] = Config.SubmittedNumber[5];
    data[columns.StatusOfReview] = Config.StatusOfReview.AwaitingReviewer;
    // data[columns.RevertToReviewer] = Number(
    //   this.state.ApepiDetails.RevertToReviewer
    // );
    data[columns.RevertToReviewer] = this.state.ApepiDetails.RevertToReviewer;
    this.listPEPIProjectsItemService = new ListItemService(
      this.props.AppContext,
      Config.ListNames.PEPIProjects
    );
    await this.listPEPIProjectsItemService.updateItem(
      this.props.APEPIDetail.ID,
      data
    );
    this.gotoListPage();
  }

  private async onFinalSAVEDRAFT(): Promise<void> {
    const pepiDetails = this.state.ApepiDetails;
    let data = {};
    const columns = Config.PEPIProjectsListColumns;
    data[columns.AcknowledgementComments] =
      this.state.ApepiDetails.AcknowledgementComments;
    this.listPEPIProjectsItemService = new ListItemService(
      this.props.AppContext,
      Config.ListNames.PEPIProjects
    );
    await this.listPEPIProjectsItemService.updateItem(
      this.props.APEPIDetail.ID,
      data
    );
    this.gotoListPage();
  }

  private async onSUBMITTOFINALREVIEW(): Promise<void> {
    const pepiDetails = this.state.ApepiDetails;
    let data = {};
    const columns = Config.PEPIProjectsListColumns;
    data[columns.StatusOfReview] = Config.StatusOfReview.Acknowledged;
    data[columns.Submitted] = Config.SubmittedNumber[7];
    data[columns.AcknowledgementComments] =
      this.state.ApepiDetails.AcknowledgementComments;
    this.listPEPIProjectsItemService = new ListItemService(
      this.props.AppContext,
      Config.ListNames.PEPIProjects
    );
    await this.listPEPIProjectsItemService.updateItem(
      this.props.APEPIDetail.ID,
      data
    );
    this.gotoListPage();
  }

  //! private onChangeA1(newValue: string, TRValue: string): void {
  //   let AverageA1E = 0;
  //   let AverageA1R = 0;

  //   if (TRValue == "A11E") {
  //     this.setState({ A11E: Number(newValue) });
  //     let vallblA11D = Number(this.state.A11R) - Number(newValue);
  //     this.setState({ A11D: vallblA11D });
  //     AverageA1E =
  //       (Number(newValue) +
  //         Number(this.state.A12E) +
  //         Number(this.state.A13E) +
  //         Number(this.state.A14E) +
  //         Number(this.state.A15E)) /
  //       5;
  //     this.setState({ A1EE: AverageA1E });
  //     // let valA11ED = (Number(vallblA11D) + Number(this.state.A12D) + Number(this.state.A13D) + Number(this.state.A14D) + Number(this.state.A15D)) / 5;
  //     // this.setState({ A1DD: valA11ED });
  //     //this.setState({ A1DD: this.state.A1RR - AverageA1E});
  //     this.setState({
  //       A1DD: Number(
  //         parseFloat(Number(this.state.A1RR - AverageA1E).toString()).toFixed(2)
  //       ),
  //     });
  //   } else if (TRValue == "A12E") {
  //     this.setState({ A12E: Number(newValue) });
  //     let vallblA12D = Number(this.state.A12R) - Number(newValue);
  //     this.setState({ A12D: vallblA12D });
  //     AverageA1E =
  //       (Number(this.state.A11E) +
  //         Number(newValue) +
  //         Number(this.state.A13E) +
  //         Number(this.state.A14E) +
  //         Number(this.state.A15E)) /
  //       5;
  //     this.setState({ A1EE: AverageA1E });
  //     // let valA12ED = (Number(this.state.A12D) + Number(vallblA12D) + Number(this.state.A13D) + Number(this.state.A14D) + Number(this.state.A15D)) / 5;
  //     // this.setState({ A1DD: valA12ED });
  //     this.setState({
  //       A1DD: Number(
  //         parseFloat(Number(this.state.A1RR - AverageA1E).toString()).toFixed(2)
  //       ),
  //     });
  //   } else if (TRValue == "A13E") {
  //     this.setState({ A13E: Number(newValue) });
  //     let vallblA13D = Number(this.state.A13R) - Number(newValue);
  //     this.setState({ A13D: vallblA13D });
  //     AverageA1E =
  //       (Number(this.state.A11E) +
  //         Number(this.state.A12E) +
  //         Number(newValue) +
  //         Number(this.state.A14E) +
  //         Number(this.state.A15E)) /
  //       5;
  //     this.setState({ A1EE: AverageA1E });
  //     // let valA13ED = (Number(this.state.A11D) + Number(this.state.A12D) + Number(vallblA13D) + Number(this.state.A14D) + Number(this.state.A15D)) / 5;
  //     // this.setState({ A1DD: valA13ED });
  //     this.setState({
  //       A1DD: Number(
  //         parseFloat(Number(this.state.A1RR - AverageA1E).toString()).toFixed(2)
  //       ),
  //     });
  //   } else if (TRValue == "A14E") {
  //     this.setState({ A14E: Number(newValue) });
  //     let vallblA14D = Number(this.state.A14R) - Number(newValue);
  //     this.setState({ A14D: vallblA14D });
  //     AverageA1E =
  //       (Number(this.state.A11E) +
  //         Number(this.state.A12E) +
  //         Number(this.state.A13E) +
  //         Number(newValue) +
  //         Number(this.state.A15E)) /
  //       5;
  //     this.setState({ A1EE: AverageA1E });
  //     // let valA14ED = (Number(this.state.A11D) + Number(this.state.A12D) + Number(this.state.A13D) + Number(vallblA14D) + Number(this.state.A15D)) / 5;
  //     // this.setState({ A1DD: valA14ED });
  //     this.setState({
  //       A1DD: Number(
  //         parseFloat(Number(this.state.A1RR - AverageA1E).toString()).toFixed(2)
  //       ),
  //     });
  //   } else if (TRValue == "A15E") {
  //     this.setState({ A15E: Number(newValue) });
  //     let vallblA15D = Number(this.state.A15R) - Number(newValue);
  //     this.setState({ A15D: vallblA15D });
  //     AverageA1E =
  //       (Number(this.state.A11E) +
  //         Number(this.state.A12E) +
  //         Number(this.state.A13E) +
  //         Number(this.state.A14E) +
  //         Number(newValue)) /
  //       5;
  //     this.setState({ A1EE: AverageA1E });
  //     // let valA15ED = (Number(this.state.A11D) + Number(this.state.A12D) + Number(this.state.A13D) + Number(this.state.A14D) + Number(vallblA15D)) / 5;
  //     // this.setState({ A1DD: valA15ED });
  //     this.setState({
  //       A1DD: Number(
  //         parseFloat(Number(this.state.A1RR - AverageA1E).toString()).toFixed(2)
  //       ),
  //     });
  //   } else if (TRValue == "A11R") {
  //     this.setState({ A11R: Number(newValue) });
  //     let vallblA11ED = Number(newValue) - Number(this.state.A11E);
  //     this.setState({ A11D: vallblA11ED });
  //     AverageA1R =
  //       (Number(newValue) +
  //         Number(this.state.A12R) +
  //         Number(this.state.A13R) +
  //         Number(this.state.A14R) +
  //         Number(this.state.A15R)) /
  //       5;
  //     this.setState({ A1RR: AverageA1R });
  //     // let valA11RD = (Number(vallblA11ED) + Number(this.state.A12D) + Number(this.state.A13D) + Number(this.state.A14D) + Number(this.state.A15D)) / 5;
  //     // this.setState({ A1DD: valA11RD });
  //     //this.setState({ A1DD: AverageA1R - this.state.A1EE});
  //     this.setState({
  //       A1DD: Number(
  //         parseFloat(Number(AverageA1R - this.state.A1EE).toString()).toFixed(2)
  //       ),
  //     });
  //   } else if (TRValue == "A12R") {
  //     this.setState({ A12R: Number(newValue) });
  //     let vallblA12ED = Number(newValue) - Number(this.state.A12E);

  //     this.setState({ A12D: vallblA12ED });
  //     AverageA1R =
  //       (Number(this.state.A11R) +
  //         Number(newValue) +
  //         Number(this.state.A13R) +
  //         Number(this.state.A14R) +
  //         Number(this.state.A15R)) /
  //       5;
  //     this.setState({ A1RR: AverageA1R });

  //     // let valA12RD = (Number(this.state.A11D) + Number(vallblA12ED) + Number(this.state.A13D) + Number(this.state.A14D) + Number(this.state.A15D)) / 5;
  //     // this.setState({ A1DD: valA12RD });
  //     this.setState({
  //       A1DD: Number(
  //         parseFloat(Number(AverageA1R - this.state.A1EE).toString()).toFixed(2)
  //       ),
  //     });
  //   } else if (TRValue == "A13R") {
  //     this.setState({ A13R: Number(newValue) });
  //     let vallblA13ED = Number(newValue) - Number(this.state.A13E);
  //     this.setState({ A13D: vallblA13ED });
  //     AverageA1R =
  //       (Number(this.state.A11R) +
  //         Number(this.state.A12R) +
  //         Number(newValue) +
  //         Number(this.state.A14R) +
  //         Number(this.state.A15R)) /
  //       5;
  //     this.setState({ A1RR: AverageA1R });

  //     // let valA11RD = (Number(this.state.A11D) + Number(this.state.A12D) + Number(vallblA13ED) + Number(this.state.A14D) + Number(this.state.A15D)) / 5;
  //     // this.setState({ A1DD: valA11RD });
  //     this.setState({
  //       A1DD: Number(
  //         parseFloat(Number(AverageA1R - this.state.A1EE).toString()).toFixed(2)
  //       ),
  //     });
  //   } else if (TRValue == "A14R") {
  //     this.setState({ A14R: Number(newValue) });
  //     let vallblA14ED = Number(newValue) - Number(this.state.A14E);
  //     this.setState({ A14D: vallblA14ED });
  //     AverageA1R =
  //       (Number(this.state.A11R) +
  //         Number(this.state.A12R) +
  //         Number(this.state.A13R) +
  //         Number(newValue) +
  //         Number(this.state.A15R)) /
  //       5;
  //     this.setState({ A1RR: AverageA1R });

  //     // let valA11RD = (Number(this.state.A11D) + Number(this.state.A12D) + Number(this.state.A13D) + Number(vallblA14ED) + Number(this.state.A15D)) / 5;
  //     // this.setState({ A1DD: valA11RD });
  //     this.setState({
  //       A1DD: Number(
  //         parseFloat(Number(AverageA1R - this.state.A1EE).toString()).toFixed(2)
  //       ),
  //     });
  //   } else if (TRValue == "A15R") {
  //     this.setState({ A15R: Number(newValue) });
  //     let vallblA15ED = Number(newValue) - Number(this.state.A15E);
  //     this.setState({ A15D: vallblA15ED });
  //     AverageA1R =
  //       (Number(this.state.A11R) +
  //         Number(this.state.A12R) +
  //         Number(this.state.A13R) +
  //         Number(this.state.A14R) +
  //         Number(newValue)) /
  //       5;
  //     this.setState({ A1RR: AverageA1R });

  //     // let valA11RD = (Number(this.state.A11D) + Number(this.state.A12D) + Number(this.state.A13D) + Number(this.state.A14D) + Number(vallblA15ED)) / 5;
  //     // this.setState({ A1DD: valA11RD });
  //     this.setState({
  //       A1DD: Number(
  //         parseFloat(Number(AverageA1R - this.state.A1EE).toString()).toFixed(2)
  //       ),
  //     });
  //   } else {
  //   }
  //   //let TotalAE =
  //   let A1E = Number(
  //     parseFloat(
  //       (
  //         (Number(AverageA1E) +
  //           Number(this.state.A2EE) +
  //           Number(this.state.A3EE)) /
  //         3
  //       ).toString()
  //     ).toFixed(2)
  //   );
  //   let A1R = Number(
  //     parseFloat(
  //       (
  //         (Number(AverageA1R) +
  //           Number(this.state.A2RR) +
  //           Number(this.state.A3RR)) /
  //         3
  //       ).toString()
  //     ).toFixed(2)
  //   );

  //   this.setState({ AAvgEE: A1E });
  //   this.setState({ AAvgER: A1R });
  //   // this.setState({ SctionTotalAD: A1R - A1E });
  //   this.setState({
  //     SctionTotalAD: Number(
  //       parseFloat(Number(A1R - A1E).toString()).toFixed(2)
  //     ),
  //   });
  //   //SctionTotalAD
  // }
  // private onChangeA2(newValue: string, TRValue: string): void {
  //   let AverageA2E = 0;
  //   let AverageA2R = 0;
  //   if (TRValue == "A21E") {
  //     this.setState({ A21E: Number(newValue) });
  //     let vallblA21D = Number(this.state.A21R) - Number(newValue);
  //     this.setState({ A21D: vallblA21D });
  //     AverageA2E =
  //       (Number(newValue) +
  //         Number(this.state.A22E) +
  //         Number(this.state.A23E) +
  //         Number(this.state.A24E)) /
  //       4;
  //     this.setState({ A2EE: AverageA2E });
  //     // let valA21ED = (Number(vallblA21D) + Number(this.state.A22D) + Number(this.state.A23D) + Number(this.state.A24D)) / 4;
  //     // this.setState({ A2DD: valA21ED });
  //     this.setState({ A2DD: this.state.A2RR - AverageA2E });
  //   } else if (TRValue == "A22E") {
  //     this.setState({ A22E: Number(newValue) });
  //     let vallblA22D = Number(this.state.A22R) - Number(newValue);
  //     this.setState({ A22D: vallblA22D });
  //     AverageA2E =
  //       (Number(this.state.A21E) +
  //         Number(newValue) +
  //         Number(this.state.A23E) +
  //         Number(this.state.A24E)) /
  //       4;
  //     this.setState({ A2EE: AverageA2E });
  //     // let valA22ED = (Number(this.state.A22D) + Number(vallblA22D) + Number(this.state.A23D) + Number(this.state.A24D)) / 4;
  //     // this.setState({ A2DD: valA22ED });
  //     this.setState({ A2DD: this.state.A2RR - AverageA2E });
  //   } else if (TRValue == "A23E") {
  //     this.setState({ A23E: Number(newValue) });
  //     let vallblA23D = Number(this.state.A23R) - Number(newValue);
  //     this.setState({ A23D: vallblA23D });
  //     AverageA2E =
  //       (Number(this.state.A21E) +
  //         Number(this.state.A22E) +
  //         Number(newValue) +
  //         Number(this.state.A24E)) /
  //       4;
  //     this.setState({ A2EE: AverageA2E });
  //     // let valA23ED = (Number(this.state.A21D) + Number(this.state.A22D) + Number(vallblA23D) + Number(this.state.A24D)) / 4;
  //     // this.setState({ A2DD: valA23ED });
  //     this.setState({ A2DD: this.state.A2RR - AverageA2E });
  //   } else if (TRValue == "A24E") {
  //     this.setState({ A24E: Number(newValue) });
  //     let vallblA24D = Number(this.state.A24R) - Number(newValue);
  //     this.setState({ A24D: vallblA24D });
  //     AverageA2E =
  //       (Number(this.state.A21E) +
  //         Number(this.state.A22E) +
  //         Number(this.state.A23E) +
  //         Number(newValue)) /
  //       4;
  //     this.setState({ A2EE: AverageA2E });
  //     // let valA24ED = (Number(this.state.A21D) + Number(this.state.A22D) + Number(this.state.A23D) + Number(vallblA24D)) / 4;
  //     // this.setState({ A2DD: valA24ED });
  //     this.setState({ A2DD: this.state.A2RR - AverageA2E });
  //   } else if (TRValue == "A21R") {
  //     this.setState({ A21R: Number(newValue) });
  //     let vallblA21ED = Number(newValue) - Number(this.state.A21E);
  //     this.setState({ A21D: vallblA21ED });
  //     AverageA2R =
  //       (Number(newValue) +
  //         Number(this.state.A22R) +
  //         Number(this.state.A23R) +
  //         Number(this.state.A24R)) /
  //       4;
  //     this.setState({ A2RR: AverageA2R });
  //     // let valA21RD = (Number(vallblA21ED) + Number(this.state.A22D) + Number(this.state.A23D) + Number(this.state.A24D)) / 4;
  //     // this.setState({ A2DD: valA21RD });
  //     this.setState({ A2DD: AverageA2R - this.state.A2EE });
  //   } else if (TRValue == "A22R") {
  //     this.setState({ A22R: Number(newValue) });
  //     let vallblA22ED = Number(newValue) - Number(this.state.A22E);

  //     this.setState({ A22D: vallblA22ED });
  //     AverageA2R =
  //       (Number(this.state.A21R) +
  //         Number(newValue) +
  //         Number(this.state.A23R) +
  //         Number(this.state.A24R)) /
  //       4;
  //     this.setState({ A2RR: AverageA2R });

  //     // let valA22RD = (Number(this.state.A21D) + Number(vallblA22ED) + Number(this.state.A23D) + Number(this.state.A24D)) / 4;
  //     // this.setState({ A2DD: valA22RD });
  //     this.setState({ A2DD: AverageA2R - this.state.A2EE });
  //   } else if (TRValue == "A23R") {
  //     this.setState({ A23R: Number(newValue) });
  //     let vallblA23ED = Number(newValue) - Number(this.state.A23E);
  //     this.setState({ A23D: vallblA23ED });
  //     AverageA2R =
  //       (Number(this.state.A21R) +
  //         Number(this.state.A22R) +
  //         Number(newValue) +
  //         Number(this.state.A24R)) /
  //       4;
  //     this.setState({ A2RR: AverageA2R });
  //     // let valA21RD = (Number(this.state.A21D) + Number(this.state.A22D) + Number(vallblA23ED) + Number(this.state.A24D)) / 4;
  //     // this.setState({ A2DD: valA21RD });
  //     this.setState({ A2DD: AverageA2R - this.state.A2EE });
  //   } else if (TRValue == "A24R") {
  //     this.setState({ A24R: Number(newValue) });
  //     let vallblA24ED = Number(newValue) - Number(this.state.A24E);
  //     this.setState({ A24D: vallblA24ED });
  //     AverageA2R =
  //       (Number(this.state.A21R) +
  //         Number(this.state.A22R) +
  //         Number(this.state.A23R) +
  //         Number(newValue)) /
  //       4;
  //     this.setState({ A2RR: AverageA2R });
  //     // let valA21RD = (Number(this.state.A21D) + Number(this.state.A22D) + Number(this.state.A23D) + Number(vallblA24ED)) / 4;
  //     // this.setState({ A2DD: valA21RD });
  //     this.setState({ A2DD: AverageA2R - this.state.A2EE });
  //   } else {
  //   }
  //   //let SctionTotalAE = Number(parseFloat(((Number(AverageA3E) + Number(this.state.dropAverageA11E) + Number(this.state.dropAverageA2E)  )/3).toString()).toFixed(2));
  //   let A2E = Number(
  //     parseFloat(
  //       (
  //         (Number(this.state.A1EE) +
  //           Number(AverageA2E) +
  //           Number(this.state.A3EE)) /
  //         3
  //       ).toString()
  //     ).toFixed(2)
  //   );
  //   let A2R = Number(
  //     parseFloat(
  //       (
  //         (Number(this.state.A1RR) +
  //           Number(AverageA2R) +
  //           Number(this.state.A3RR)) /
  //         3
  //       ).toString()
  //     ).toFixed(2)
  //   );
  //   this.setState({ AAvgEE: A2E });
  //   this.setState({ AAvgER: A2R });
  //   //this.setState({ SctionTotalAD: A2R - A2E });
  //   this.setState({
  //     SctionTotalAD: Number(
  //       parseFloat(Number(A2R - A2E).toString()).toFixed(2)
  //     ),
  //   });
  // }
  // private onChangeA3(newValue: string, TRValue: string): void {
  //   let AverageA3E = 0;
  //   let AverageA3R = 0;
  //   if (TRValue == "A31E") {
  //     this.setState({ A31E: Number(newValue) });
  //     let vallblA31D = Number(this.state.A31R) - Number(newValue);
  //     this.setState({ A31D: vallblA31D });
  //     AverageA3E = Number(
  //       parseFloat(
  //         (
  //           (Number(newValue) +
  //             Number(this.state.A32E) +
  //             Number(this.state.A33E)) /
  //           3
  //         ).toString()
  //       ).toFixed(2)
  //     );
  //     this.setState({ A3EE: AverageA3E });
  //     // let valA31ED = (Number(vallblA31D) + Number(this.state.A32D) + Number(this.state.A33D)) / 3;
  //     // valA31ED = Number(parseFloat(valA31ED.toString()).toFixed(2));
  //     // this.setState({ A3DD: valA31ED });

  //     //this.setState({ A3DD:  this.state.A3RR - AverageA3E });
  //     this.setState({
  //       A3DD: Number(
  //         parseFloat(Number(this.state.A3RR - AverageA3E).toString()).toFixed(2)
  //       ),
  //     });
  //   } else if (TRValue == "A32E") {
  //     this.setState({ A32E: Number(newValue) });
  //     let vallblA32D = Number(this.state.A32R) - Number(newValue);
  //     this.setState({ A32D: vallblA32D });
  //     AverageA3E = Number(
  //       parseFloat(
  //         (
  //           (Number(this.state.A31E) +
  //             Number(newValue) +
  //             Number(this.state.A33E)) /
  //           3
  //         ).toString()
  //       ).toFixed(2)
  //     );
  //     this.setState({ A3EE: AverageA3E });
  //     // let valA32ED = (Number(this.state.A31D) + Number(vallblA32D) + Number(this.state.A33D)) / 3;
  //     // valA32ED = Number(parseFloat(valA32ED.toString()).toFixed(2));
  //     // this.setState({ A3DD: valA32ED });
  //     this.setState({
  //       A3DD: Number(
  //         parseFloat(Number(this.state.A3RR - AverageA3E).toString()).toFixed(2)
  //       ),
  //     });
  //   } else if (TRValue == "A33E") {
  //     this.setState({ A33E: Number(newValue) });
  //     let vallblA33D = Number(this.state.A33R) - Number(newValue);
  //     this.setState({ A33D: vallblA33D });

  //     AverageA3E = Number(
  //       parseFloat(
  //         (
  //           (Number(this.state.A31E) +
  //             Number(this.state.A32E) +
  //             Number(newValue)) /
  //           3
  //         ).toString()
  //       ).toFixed(2)
  //     );
  //     this.setState({ A3EE: AverageA3E });

  //     // let valA33ED = (Number(this.state.A31D) + Number(this.state.A32D) + Number(vallblA33D)) / 3;
  //     // valA33ED = Number(parseFloat(valA33ED.toString()).toFixed(2));
  //     // this.setState({ A3DD: valA33ED });
  //     this.setState({
  //       A3DD: Number(
  //         parseFloat(Number(this.state.A3RR - AverageA3E).toString()).toFixed(2)
  //       ),
  //     });
  //   } else if (TRValue == "A31R") {
  //     this.setState({ A31R: Number(newValue) });
  //     let vallblA31ED = Number(newValue) - Number(this.state.A31E);
  //     this.setState({ A31D: vallblA31ED });
  //     AverageA3R = Number(
  //       parseFloat(
  //         (
  //           (Number(newValue) +
  //             Number(this.state.A32R) +
  //             Number(this.state.A33R)) /
  //           3
  //         ).toString()
  //       ).toFixed(2)
  //     );
  //     this.setState({ A3RR: Number(AverageA3R) });
  //     // let valA31RD = (Number(vallblA31ED) + Number(this.state.A32D) + Number(this.state.A33D)) / 3;
  //     // valA31RD = Number(parseFloat(valA31RD.toString()).toFixed(2));
  //     // this.setState({ A3DD: valA31RD });
  //     //this.setState({ A3DD: AverageA3R - this.state.A3EE});
  //     this.setState({
  //       A3DD: Number(
  //         parseFloat(Number(AverageA3R - this.state.A3EE).toString()).toFixed(2)
  //       ),
  //     });
  //   } else if (TRValue == "A32R") {
  //     this.setState({ A32R: Number(newValue) });
  //     let vallblA32ED = Number(newValue) - Number(this.state.A32E);
  //     this.setState({ A32D: vallblA32ED });
  //     AverageA3R = Number(
  //       parseFloat(
  //         (
  //           (Number(this.state.A31R) +
  //             Number(newValue) +
  //             Number(this.state.A33R)) /
  //           3
  //         ).toString()
  //       ).toFixed(2)
  //     );
  //     this.setState({ A3RR: AverageA3R });
  //     // let valA32RD = (Number(this.state.A31D) + Number(vallblA32ED) + Number(this.state.A33D)) / 3;
  //     // valA32RD = Number(parseFloat(valA32RD.toString()).toFixed(2));
  //     // this.setState({ A3DD: valA32RD });
  //     this.setState({
  //       A3DD: Number(
  //         parseFloat(Number(AverageA3R - this.state.A3EE).toString()).toFixed(2)
  //       ),
  //     });
  //   } else if (TRValue == "A33R") {
  //     this.setState({ A33R: Number(newValue) });
  //     let vallblA33ED = Number(newValue) - Number(this.state.A33E);
  //     this.setState({ A33D: vallblA33ED });
  //     AverageA3R = Number(
  //       parseFloat(
  //         (
  //           (Number(this.state.A31R) +
  //             Number(this.state.A32R) +
  //             Number(newValue)) /
  //           3
  //         ).toString()
  //       ).toFixed(2)
  //     );
  //     this.setState({ A3RR: AverageA3R });
  //     // let valA33RD = (Number(this.state.A31D) + Number(this.state.A32D) + Number(vallblA33ED)) / 3;
  //     // valA33RD = Number(parseFloat(valA33RD.toString()).toFixed(2));
  //     // this.setState({ A3DD: valA33RD });

  //     this.setState({
  //       A3DD: Number(
  //         parseFloat(Number(AverageA3R - this.state.A3EE).toString()).toFixed(2)
  //       ),
  //     });
  //   } else {
  //   }
  //   //let SctionTotalAE = Number(parseFloat(((Number(AverageA3E) + Number(this.state.dropAverageA11E) + Number(this.state.dropAverageA2E)  )/3).toString()).toFixed(2));
  //   let A3E = Number(
  //     parseFloat(
  //       (
  //         (Number(AverageA3E) +
  //           Number(this.state.A1EE) +
  //           Number(this.state.A2EE)) /
  //         3
  //       ).toString()
  //     ).toFixed(2)
  //   );
  //   let A3R = Number(
  //     parseFloat(
  //       (
  //         (Number(AverageA3R) +
  //           Number(this.state.A1RR) +
  //           Number(this.state.A2RR)) /
  //         3
  //       ).toString()
  //     ).toFixed(2)
  //   );
  //   this.setState({ AAvgEE: A3E });
  //   this.setState({ AAvgER: A3R });
  //   this.setState({
  //     SctionTotalAD: Number(
  //       parseFloat(Number(A3R - A3E).toString()).toFixed(2)
  //     ),
  //   });
  // }
  // private onChangeB1(newValue: string, TRValue: string): void {
  //   debugger;
  //   let AverageB1E = 0;
  //   let AverageB1R = 0;
  //   if (TRValue == "B11E") {
  //     this.setState({ B11E: Number(newValue) });
  //     let vallblB11D = Number(this.state.B11R) - Number(newValue);
  //     this.setState({ B11D: vallblB11D });
  //     AverageB1E = Number(
  //       parseFloat(
  //         ((Number(newValue) + Number(this.state.B12E)) / 2).toString()
  //       ).toFixed(2)
  //     );
  //     this.setState({ B1EE: AverageB1E });
  //     // let valB11ED = (Number(vallblB11D) + Number(this.state.B12D)) / 2;
  //     // valB11ED = Number(parseFloat(valB11ED.toString()).toFixed(2));
  //     // this.setState({ B1DD: valB11ED });

  //     this.setState({ B1DD: this.state.B1RR - AverageB1E });
  //   } else if (TRValue == "B12E") {
  //     this.setState({ B12E: Number(newValue) });
  //     let vallblB12D = Number(this.state.B12R) - Number(newValue);
  //     this.setState({ B12D: vallblB12D });
  //     AverageB1E = Number(
  //       parseFloat(
  //         ((Number(this.state.B11E) + Number(newValue)) / 2).toString()
  //       ).toFixed(2)
  //     );
  //     this.setState({ B1EE: AverageB1E });
  //     // let valB12ED = (Number(this.state.B11D) + Number(vallblB12D)) / 2;
  //     // valB12ED = Number(parseFloat(valB12ED.toString()).toFixed(2));
  //     // this.setState({ B1DD: valB12ED });

  //     this.setState({ B1DD: this.state.B1RR - AverageB1E });
  //   } else if (TRValue == "B11R") {
  //     this.setState({ B11R: Number(newValue) });
  //     let vallblB11ED = Number(newValue) - Number(this.state.B11E);
  //     this.setState({ B11D: vallblB11ED });
  //     AverageB1R = Number(
  //       parseFloat(
  //         ((Number(newValue) + Number(this.state.B12R)) / 2).toString()
  //       ).toFixed(2)
  //     );
  //     this.setState({ B1RR: Number(AverageB1R) });
  //     // let valB11RD = (Number(vallblB11ED) + Number(this.state.B12D)) / 2;
  //     // valB11RD = Number(parseFloat(valB11RD.toString()).toFixed(2));
  //     // this.setState({ B1DD: valB11RD });
  //     this.setState({ B1DD: AverageB1R - this.state.B1EE });
  //   } else if (TRValue == "B12R") {
  //     this.setState({ B12R: Number(newValue) });
  //     let vallblB12ED = Number(newValue) - Number(this.state.B12E);
  //     this.setState({ B12D: vallblB12ED });
  //     AverageB1R = Number(
  //       parseFloat(
  //         ((Number(this.state.B11R) + Number(newValue)) / 2).toString()
  //       ).toFixed(2)
  //     );
  //     this.setState({ B1RR: AverageB1R });
  //     // let valB12RD = (Number(this.state.B11D) + Number(vallblB12ED)) / 2;
  //     // valB12RD = Number(parseFloat(valB12RD.toString()).toFixed(2));
  //     // this.setState({ B1DD: valB12RD });

  //     this.setState({ B1DD: AverageB1R - this.state.B1EE });
  //   }
  //   let B1E = Number(
  //     parseFloat(
  //       (
  //         (Number(AverageB1E) +
  //           Number(this.state.B2EE) +
  //           Number(this.state.B3EE) +
  //           Number(this.state.B4EE)) /
  //         4
  //       ).toString()
  //     ).toFixed(2)
  //   );
  //   let B1R = Number(
  //     parseFloat(
  //       (
  //         (Number(AverageB1R) +
  //           Number(this.state.B2RR) +
  //           Number(this.state.B3RR) +
  //           Number(this.state.B4RR)) /
  //         4
  //       ).toString()
  //     ).toFixed(2)
  //   );
  //   this.setState({ BAvgEE: B1E });
  //   this.setState({ BAvgER: B1R });
  //   //this.setState({ SctionTotalBD: B1R - B1E });
  //   this.setState({
  //     SctionTotalBD: Number(
  //       parseFloat(Number(B1R - B1E).toString()).toFixed(2)
  //     ),
  //   });
  // }
  // //!Old code
  // // private onChangeB2(newValue: string, TRValue: string): void {
  // //   debugger;
  // //   let AverageB2E = 0;
  // //   let AverageB2R = 0;
  // //   if (TRValue == "B21E") {

  // //     this.setState({ B21E: Number(newValue) });
  // //     let vallblB21D = Number(this.state.B21R) - Number(newValue);
  // //     this.setState({ B21D: vallblB21D });
  // //     AverageB2E = Number(parseFloat(((Number(newValue) + Number(this.state.B22E) + Number(this.state.B23E)) / 3).toString()).toFixed(2));
  // //     this.setState({ B2EE: AverageB2E });
  // //     this.setState({ B2DD: this.state.B2RR - AverageB2E });

  // //   }
  // //   else if (TRValue == "B22E") {
  // //     this.setState({ B22E: Number(newValue) });
  // //     let vallblB22D = Number(this.state.B22R) - Number(newValue);
  // //     this.setState({ B22D: vallblB22D });
  // //     AverageB2E = Number(parseFloat(((Number(this.state.B21E) + Number(this.state.B23E) + Number(newValue)) / 3).toString()).toFixed(2));
  // //     this.setState({ B2EE: AverageB2E });
  // //     this.setState({ B2DD: this.state.B2RR - AverageB2E });
  // //   }
  // //   else if (TRValue == "B23E") {
  // //     this.setState({ B23E: Number(newValue) });
  // //     let vallblB23D = Number(this.state.B23R) - Number(newValue);
  // //     this.setState({ B23D: vallblB23D });
  // //     AverageB2E = Number(parseFloat(((Number(this.state.B21E) + Number(this.state.B22E) + Number(newValue)) / 3).toString()).toFixed(2));
  // //     this.setState({ B2EE: AverageB2E });
  // //     this.setState({ B2DD: this.state.B2RR - AverageB2E });
  // //   }
  // //   else if (TRValue == "B21R") {
  // //     this.setState({ B21R: Number(newValue) });
  // //     let vallblB21ED = Number(newValue) - Number(this.state.B21E);
  // //     this.setState({ B21D: vallblB21ED });
  // //     AverageB2R = Number(parseFloat(((Number(newValue) + Number(this.state.B22R) + Number(this.state.B23R)) / 3).toString()).toFixed(2));
  // //     this.setState({ B2RR: Number(AverageB2R) });
  // //     this.setState({ B2DD: AverageB2R - this.state.B2EE });
  // //   }
  // //   else if (TRValue == "B22R") {
  // //     this.setState({ B22R: Number(newValue) });
  // //     let vallblB22ED = Number(newValue) - Number(this.state.B22E);
  // //     this.setState({ B22D: vallblB22ED });
  // //     AverageB2R = Number(parseFloat(((Number(this.state.B21R) + Number(newValue) + Number(this.state.B23R)) / 3).toString()).toFixed(2));
  // //     this.setState({ B2RR: AverageB2R });
  // //     this.setState({ B2DD: AverageB2R - this.state.B2EE });

  // //   }
  // //   else if (TRValue == "B23R") {
  // //     this.setState({ B23R: Number(newValue) });
  // //     let vallblB23ED = Number(newValue) - Number(this.state.B23E);
  // //     this.setState({ B23D: vallblB23ED });
  // //     AverageB2R = Number(parseFloat(((Number(this.state.B21R) + Number(newValue) + Number(this.state.B22R)) / 3).toString()).toFixed(2));
  // //     this.setState({ B2RR: AverageB2R });
  // //     this.setState({ B2DD: AverageB2R - this.state.B2EE });

  // //   }
  // //   let B2E = Number(parseFloat(((Number(AverageB2E) + Number(this.state.B1EE) + Number(this.state.B3EE) + Number(this.state.B4EE)) / 4).toString()).toFixed(2));
  // //   let B2R = Number(parseFloat(((Number(AverageB2R) + Number(this.state.B1RR) + Number(this.state.B3RR) + Number(this.state.B4RR)) / 4).toString()).toFixed(2));
  // //   this.setState({ BAvgEE: B2E });
  // //   this.setState({ BAvgER: B2R });
  // //   this.setState({ SctionTotalBD: Number(parseFloat(Number(B2R - B2E).toString()).toFixed(2)) });
  // // }
  // private onChangeB2(newValue: string, TRValue: string): void {
  //   debugger;
  //   let AverageB2E = 0;
  //   let AverageB2R = 0;
  //   if (TRValue == "B21E") {
  //     this.setState({ B21E: Number(newValue) });
  //     let vallblB21D = Number(this.state.B21R) - Number(newValue);
  //     this.setState({ B21D: vallblB21D });
  //     AverageB2E = Number(
  //       parseFloat(
  //         (
  //           (Number(newValue) +
  //             Number(this.state.B22E) +
  //             Number(this.state.B23E)) /
  //           3
  //         ).toString()
  //       ).toFixed(2)
  //     );
  //     this.setState({ B2EE: AverageB2E });
  //     //this.setState({ B2DD: this.state.B2RR - AverageB2E });
  //     this.setState({
  //       B2DD: Number(
  //         parseFloat(Number(this.state.B2RR - AverageB2E).toString()).toFixed(2)
  //       ),
  //     });
  //   } else if (TRValue == "B22E") {
  //     this.setState({ B22E: Number(newValue) });
  //     let vallblB22D = Number(this.state.B22R) - Number(newValue);
  //     this.setState({ B22D: vallblB22D });
  //     AverageB2E = Number(
  //       parseFloat(
  //         (
  //           (Number(this.state.B21E) +
  //             Number(this.state.B23E) +
  //             Number(newValue)) /
  //           3
  //         ).toString()
  //       ).toFixed(2)
  //     );
  //     this.setState({ B2EE: AverageB2E });
  //     //this.setState({ B2DD: this.state.B2RR - AverageB2E });
  //     this.setState({
  //       B2DD: Number(
  //         parseFloat(Number(this.state.B2RR - AverageB2E).toString()).toFixed(2)
  //       ),
  //     });
  //   } else if (TRValue == "B23E") {
  //     this.setState({ B23E: Number(newValue) });
  //     let vallblB23D = Number(this.state.B23R) - Number(newValue);
  //     this.setState({ B23D: vallblB23D });
  //     AverageB2E = Number(
  //       parseFloat(
  //         (
  //           (Number(this.state.B21E) +
  //             Number(this.state.B22E) +
  //             Number(newValue)) /
  //           3
  //         ).toString()
  //       ).toFixed(2)
  //     );
  //     this.setState({ B2EE: AverageB2E });
  //     //this.setState({ B2DD: this.state.B2RR - AverageB2E });
  //     this.setState({
  //       B2DD: Number(
  //         parseFloat(Number(this.state.B2RR - AverageB2E).toString()).toFixed(2)
  //       ),
  //     });
  //   } else if (TRValue == "B21R") {
  //     this.setState({ B21R: Number(newValue) });
  //     let vallblB21ED = Number(newValue) - Number(this.state.B21E);
  //     this.setState({ B21D: vallblB21ED });
  //     AverageB2R = Number(
  //       parseFloat(
  //         (
  //           (Number(newValue) +
  //             Number(this.state.B22R) +
  //             Number(this.state.B23R)) /
  //           3
  //         ).toString()
  //       ).toFixed(2)
  //     );
  //     this.setState({ B2RR: Number(AverageB2R) });
  //     //this.setState({ B2DD: AverageB2R - this.state.B2EE });
  //     this.setState({
  //       B2DD: Number(
  //         parseFloat(Number(AverageB2R - this.state.B2EE).toString()).toFixed(2)
  //       ),
  //     });
  //   } else if (TRValue == "B22R") {
  //     this.setState({ B22R: Number(newValue) });
  //     let vallblB22ED = Number(newValue) - Number(this.state.B22E);
  //     this.setState({ B22D: vallblB22ED });
  //     AverageB2R = Number(
  //       parseFloat(
  //         (
  //           (Number(this.state.B21R) +
  //             Number(newValue) +
  //             Number(this.state.B23R)) /
  //           3
  //         ).toString()
  //       ).toFixed(2)
  //     );
  //     this.setState({ B2RR: AverageB2R });
  //     //this.setState({ B2DD: AverageB2R - this.state.B2EE });
  //     this.setState({
  //       B2DD: Number(
  //         parseFloat(Number(AverageB2R - this.state.B2EE).toString()).toFixed(2)
  //       ),
  //     });
  //   } else if (TRValue == "B23R") {
  //     this.setState({ B23R: Number(newValue) });
  //     let vallblB23ED = Number(newValue) - Number(this.state.B23E);
  //     this.setState({ B23D: vallblB23ED });
  //     AverageB2R = Number(
  //       parseFloat(
  //         (
  //           (Number(this.state.B21R) +
  //             Number(newValue) +
  //             Number(this.state.B22R)) /
  //           3
  //         ).toString()
  //       ).toFixed(2)
  //     );
  //     this.setState({ B2RR: AverageB2R });
  //     //this.setState({ B2DD: AverageB2R - this.state.B2EE });
  //     this.setState({
  //       B2DD: Number(
  //         parseFloat(Number(AverageB2R - this.state.B2EE).toString()).toFixed(2)
  //       ),
  //     });
  //   }
  //   let B2E = Number(
  //     parseFloat(
  //       (
  //         (Number(AverageB2E) +
  //           Number(this.state.B1EE) +
  //           Number(this.state.B3EE) +
  //           Number(this.state.B4EE)) /
  //         4
  //       ).toString()
  //     ).toFixed(2)
  //   );
  //   let B2R = Number(
  //     parseFloat(
  //       (
  //         (Number(AverageB2R) +
  //           Number(this.state.B1RR) +
  //           Number(this.state.B3RR) +
  //           Number(this.state.B4RR)) /
  //         4
  //       ).toString()
  //     ).toFixed(2)
  //   );
  //   this.setState({ BAvgEE: B2E });
  //   this.setState({ BAvgER: B2R });
  //   this.setState({
  //     SctionTotalBD: Number(
  //       parseFloat(Number(B2R - B2E).toString()).toFixed(2)
  //     ),
  //   });
  // }
  // private onChangeB3(newValue: string, TRValue: string): void {
  //   debugger;
  //   let AverageB3E = 0;
  //   let AverageB3R = 0;

  //   if (TRValue == "B31E") {
  //     this.setState({ B31E: Number(newValue) });
  //     let vallblB31D = Number(this.state.B31R) - Number(newValue);
  //     this.setState({ B31D: vallblB31D });
  //     AverageB3E = Number(
  //       parseFloat(
  //         (
  //           (Number(newValue) +
  //             Number(this.state.B32E) +
  //             Number(this.state.B33E)) /
  //           3
  //         ).toString()
  //       ).toFixed(2)
  //     );
  //     this.setState({ B3EE: AverageB3E });
  //     // let valB31ED = (Number(vallblB31D) + Number(this.state.B32D) + Number(this.state.B33D)) / 3;
  //     // valB31ED = Number(parseFloat(valB31ED.toString()).toFixed(2));
  //     // this.setState({ B3DD: valB31ED });
  //     // this.setState({ B3DD: this.state.B3RR - AverageB3E });
  //     this.setState({
  //       B3DD: Number(
  //         parseFloat(Number(this.state.B3RR - AverageB3E).toString()).toFixed(2)
  //       ),
  //     });
  //   } else if (TRValue == "B32E") {
  //     this.setState({ B32E: Number(newValue) });
  //     let vallblB32D = Number(this.state.B32R) - Number(newValue);
  //     this.setState({ B32D: vallblB32D });
  //     AverageB3E = Number(
  //       parseFloat(
  //         (
  //           (Number(this.state.B31E) +
  //             Number(newValue) +
  //             Number(this.state.B33E)) /
  //           3
  //         ).toString()
  //       ).toFixed(2)
  //     );
  //     this.setState({ B3EE: AverageB3E });
  //     // let valB32ED = (Number(this.state.B31D) + Number(vallblB32D) + Number(this.state.B33D)) / 3;
  //     // valB32ED = Number(parseFloat(valB32ED.toString()).toFixed(2));
  //     //this.setState({ B3DD: valB32ED });
  //     this.setState({
  //       B3DD: Number(
  //         parseFloat(Number(this.state.B3RR - AverageB3E).toString()).toFixed(2)
  //       ),
  //     });
  //   } else if (TRValue == "B33E") {
  //     this.setState({ B33E: Number(newValue) });
  //     let vallblB33D = Number(this.state.B33R) - Number(newValue);
  //     this.setState({ B33D: vallblB33D });
  //     AverageB3E = Number(
  //       parseFloat(
  //         (
  //           (Number(this.state.B31E) +
  //             Number(this.state.B32E) +
  //             Number(newValue)) /
  //           3
  //         ).toString()
  //       ).toFixed(2)
  //     );
  //     this.setState({ B3EE: AverageB3E });
  //     // let valB33ED = (Number(this.state.B31D) + Number(vallblB33D) + Number(this.state.B32D)) / 3;
  //     // valB33ED = Number(parseFloat(valB33ED.toString()).toFixed(2));
  //     // this.setState({ B3DD: valB33ED });
  //     this.setState({
  //       B3DD: Number(
  //         parseFloat(Number(this.state.B3RR - AverageB3E).toString()).toFixed(2)
  //       ),
  //     });
  //   } else if (TRValue == "B31R") {
  //     this.setState({ B31R: Number(newValue) });
  //     let vallblB31ED = Number(newValue) - Number(this.state.B31E);
  //     this.setState({ B31D: vallblB31ED });
  //     AverageB3R = Number(
  //       parseFloat(
  //         (
  //           (Number(newValue) +
  //             Number(this.state.B32R) +
  //             Number(this.state.B33R)) /
  //           3
  //         ).toString()
  //       ).toFixed(2)
  //     );
  //     this.setState({ B3RR: Number(AverageB3R) });
  //     //   let valB31RD = (Number(vallblB31ED) + Number(this.state.B32D) + Number(this.state.B33D)) / 3;
  //     //   valB31RD = Number(parseFloat(valB31RD.toString()).toFixed(2));
  //     //  // this.setState({ B3DD: valB31RD });
  //     //  this.setState({ B3DD: AverageB3R - this.state.B3EE});
  //     this.setState({
  //       B3DD: Number(
  //         parseFloat(Number(AverageB3R - this.state.B3EE).toString()).toFixed(2)
  //       ),
  //     });
  //   } else if (TRValue == "B32R") {
  //     this.setState({ B32R: Number(newValue) });
  //     let vallblB32ED = Number(newValue) - Number(this.state.B32E);
  //     this.setState({ B32D: vallblB32ED });
  //     AverageB3R = Number(
  //       parseFloat(
  //         (
  //           (Number(this.state.B31R) +
  //             Number(newValue) +
  //             Number(this.state.B33R)) /
  //           3
  //         ).toString()
  //       ).toFixed(2)
  //     );
  //     this.setState({ B3RR: AverageB3R });
  //     //   let valB32RD = (Number(this.state.B31D) + Number(vallblB32ED) + Number(this.state.B33D)) / 2;
  //     //   valB32RD = Number(parseFloat(valB32RD.toString()).toFixed(2));
  //     //  // this.setState({ B3DD: valB32RD });
  //     //  this.setState({ B3DD: AverageB3R - this.state.B3EE});
  //     this.setState({
  //       B3DD: Number(
  //         parseFloat(Number(AverageB3R - this.state.B3EE).toString()).toFixed(2)
  //       ),
  //     });
  //   } else if (TRValue == "B33R") {
  //     this.setState({ B33R: Number(newValue) });
  //     let vallblB33ED = Number(newValue) - Number(this.state.B33E);
  //     this.setState({ B33D: vallblB33ED });
  //     AverageB3R = Number(
  //       parseFloat(
  //         (
  //           (Number(this.state.B31R) +
  //             Number(this.state.B32R) +
  //             Number(newValue)) /
  //           3
  //         ).toString()
  //       ).toFixed(2)
  //     );
  //     this.setState({ B3RR: AverageB3R });
  //     //   let valB33RD = (Number(this.state.B31D) + Number(this.state.B33D) + Number(vallblB33ED)) / 3;
  //     //   valB33RD = Number(parseFloat(valB33RD.toString()).toFixed(2));
  //     //  // this.setState({ B3DD: valB33RD });
  //     //  this.setState({ B3DD: AverageB3R - this.state.B3EE});
  //     this.setState({
  //       B3DD: Number(
  //         parseFloat(Number(AverageB3R - this.state.B3EE).toString()).toFixed(2)
  //       ),
  //     });
  //   }

  //   let B3E = Number(
  //     parseFloat(
  //       (
  //         (Number(AverageB3E) +
  //           Number(this.state.B1EE) +
  //           Number(this.state.B2EE) +
  //           Number(this.state.B4EE)) /
  //         4
  //       ).toString()
  //     ).toFixed(2)
  //   );
  //   let B3R = Number(
  //     parseFloat(
  //       (
  //         (Number(AverageB3R) +
  //           Number(this.state.B1RR) +
  //           Number(this.state.B2RR) +
  //           Number(this.state.B4RR)) /
  //         4
  //       ).toString()
  //     ).toFixed(2)
  //   );

  //   this.setState({ BAvgEE: B3E });
  //   this.setState({ BAvgER: B3R });
  //   //this.setState({ SctionTotalBD: B3R - B3E });
  //   this.setState({
  //     SctionTotalBD: Number(
  //       parseFloat(Number(B3R - B3E).toString()).toFixed(2)
  //     ),
  //   });
  // }
  // private onChangeB4(newValue: string, TRValue: string): void {
  //   debugger;
  //   let AverageB4E = 0;
  //   let AverageB4R = 0;
  //   if (TRValue == "B41E") {
  //     this.setState({ B41E: Number(newValue) });
  //     let vallblB41D = Number(this.state.B41R) - Number(newValue);
  //     this.setState({ B41D: vallblB41D });
  //     AverageB4E = Number(
  //       parseFloat(
  //         (
  //           (Number(newValue) +
  //             Number(this.state.B42E) +
  //             Number(this.state.B43E)) /
  //           3
  //         ).toString()
  //       ).toFixed(2)
  //     );
  //     this.setState({ B4EE: AverageB4E });
  //     // let valB41ED = (Number(vallblB41D) + Number(this.state.B42D) + Number(this.state.B43D)) / 3;
  //     // valB41ED = Number(parseFloat(valB41ED.toString()).toFixed(2));
  //     // this.setState({ B4DD: valB41ED });
  //     // this.setState({ B4DD: this.state.B4RR - AverageB4E });
  //     this.setState({
  //       B4DD: Number(
  //         parseFloat(Number(this.state.B4RR - AverageB4E).toString()).toFixed(2)
  //       ),
  //     });
  //   } else if (TRValue == "B42E") {
  //     this.setState({ B42E: Number(newValue) });
  //     let vallblB42D = Number(this.state.B42R) - Number(newValue);
  //     this.setState({ B42D: vallblB42D });
  //     AverageB4E = Number(
  //       parseFloat(
  //         (
  //           (Number(this.state.B41E) +
  //             Number(newValue) +
  //             Number(this.state.B43E)) /
  //           3
  //         ).toString()
  //       ).toFixed(2)
  //     );
  //     this.setState({ B4EE: AverageB4E });
  //     // let valB42ED = (Number(this.state.B41D) + Number(vallblB42D) + Number(this.state.B43D)) / 3;
  //     // valB42ED = Number(parseFloat(valB42ED.toString()).toFixed(2));
  //     //this.setState({ B4DD: valB42ED });
  //     //this.setState({ B4DD: this.state.B4RR - AverageB4E });
  //     this.setState({
  //       B4DD: Number(
  //         parseFloat(Number(this.state.B4RR - AverageB4E).toString()).toFixed(2)
  //       ),
  //     });
  //   } else if (TRValue == "B43E") {
  //     this.setState({ B43E: Number(newValue) });
  //     let vallblB43D = Number(this.state.B43R) - Number(newValue);
  //     this.setState({ B43D: vallblB43D });
  //     AverageB4E = Number(
  //       parseFloat(
  //         (
  //           (Number(this.state.B41E) +
  //             Number(this.state.B42E) +
  //             Number(newValue)) /
  //           3
  //         ).toString()
  //       ).toFixed(2)
  //     );
  //     this.setState({ B4EE: AverageB4E });
  //     // let valB43ED = (Number(this.state.B41D) + Number(vallblB43D) + Number(this.state.B42D)) / 3;
  //     // valB43ED = Number(parseFloat(valB43ED.toString()).toFixed(2));
  //     // this.setState({ B4DD: valB43ED });
  //     // this.setState({ B4DD: this.state.B4RR - AverageB4E });
  //     this.setState({
  //       B4DD: Number(
  //         parseFloat(Number(this.state.B4RR - AverageB4E).toString()).toFixed(2)
  //       ),
  //     });
  //   } else if (TRValue == "B41R") {
  //     this.setState({ B41R: Number(newValue) });
  //     let vallblB41ED = Number(newValue) - Number(this.state.B41E);
  //     this.setState({ B41D: vallblB41ED });
  //     AverageB4R = Number(
  //       parseFloat(
  //         (
  //           (Number(newValue) +
  //             Number(this.state.B42R) +
  //             Number(this.state.B43R)) /
  //           3
  //         ).toString()
  //       ).toFixed(2)
  //     );
  //     this.setState({ B4RR: Number(AverageB4R) });
  //     // let valB41RD = (Number(vallblB41ED) + Number(this.state.B42D) + Number(this.state.B43D)) / 3;
  //     // valB41RD = Number(parseFloat(valB41RD.toString()).toFixed(2));
  //     // this.setState({ B4DD: valB41RD });
  //     // this.setState({ B4DD: AverageB4R - this.state.B4EE});
  //     this.setState({
  //       B4DD: Number(
  //         parseFloat(Number(AverageB4R - this.state.B4EE).toString()).toFixed(2)
  //       ),
  //     });
  //   } else if (TRValue == "B42R") {
  //     this.setState({ B42R: Number(newValue) });
  //     let vallblB42ED = Number(newValue) - Number(this.state.B42E);
  //     this.setState({ B42D: vallblB42ED });
  //     AverageB4R = Number(
  //       parseFloat(
  //         (
  //           (Number(this.state.B41R) +
  //             Number(newValue) +
  //             Number(this.state.B43R)) /
  //           3
  //         ).toString()
  //       ).toFixed(2)
  //     );
  //     this.setState({ B4RR: AverageB4R });
  //     // let valB42RD = (Number(this.state.B41D) + Number(vallblB42ED) + Number(this.state.B43D)) / 2;
  //     // valB42RD = Number(parseFloat(valB42RD.toString()).toFixed(2));
  //     // this.setState({ B4DD: valB42RD });
  //     //this.setState({ B4DD: AverageB4R - this.state.B4EE});
  //     this.setState({
  //       B4DD: Number(
  //         parseFloat(Number(AverageB4R - this.state.B4EE).toString()).toFixed(2)
  //       ),
  //     });
  //   } else if (TRValue == "B43R") {
  //     this.setState({ B43R: Number(newValue) });
  //     let vallblB43ED = Number(newValue) - Number(this.state.B43E);
  //     this.setState({ B43D: vallblB43ED });
  //     AverageB4R = Number(
  //       parseFloat(
  //         (
  //           (Number(this.state.B41R) +
  //             Number(this.state.B42R) +
  //             Number(newValue)) /
  //           3
  //         ).toString()
  //       ).toFixed(2)
  //     );
  //     this.setState({ B4RR: AverageB4R });
  //     // let valB43RD = (Number(this.state.B41D) + Number(this.state.B43D) + Number(vallblB43ED)) / 3;
  //     // valB43RD = Number(parseFloat(valB43RD.toString()).toFixed(2));
  //     // this.setState({ B4DD: valB43RD });
  //     //this.setState({ B4DD: AverageB4R - this.state.B4EE});
  //     this.setState({
  //       B4DD: Number(
  //         parseFloat(Number(AverageB4R - this.state.B4EE).toString()).toFixed(2)
  //       ),
  //     });
  //   }
  //   //this.setState({ BAvgEE: Number(parseFloat(((Number(AverageB4E) + Number(this.state.B1EE) + Number(this.state.B3EE) + Number(this.state.B2EE)) / 4).toString()).toFixed(2)) });
  //   //this.setState({ BAvgER: Number(parseFloat(((Number(AverageB4R) + Number(this.state.B1RR) + Number(this.state.B3RR) + Number(this.state.B2RR)) / 4).toString()).toFixed(2)) });
  //   let B4E = Number(
  //     parseFloat(
  //       (
  //         (Number(AverageB4E) +
  //           Number(this.state.B1EE) +
  //           Number(this.state.B3EE) +
  //           Number(this.state.B2EE)) /
  //         4
  //       ).toString()
  //     ).toFixed(2)
  //   );
  //   let B4R = Number(
  //     parseFloat(
  //       (
  //         (Number(AverageB4R) +
  //           Number(this.state.B1RR) +
  //           Number(this.state.B3RR) +
  //           Number(this.state.B2RR)) /
  //         4
  //       ).toString()
  //     ).toFixed(2)
  //   );
  //   this.setState({ BAvgEE: B4E });
  //   this.setState({ BAvgER: B4R });
  //   //this.setState({ SctionTotalBD: B4R - B4E });
  //   this.setState({
  //     SctionTotalBD: Number(
  //       parseFloat(Number(B4R - B4E).toString()).toFixed(2)
  //     ),
  //   });
  // }
  // private onChangeC1(newValue: string, TRValue: string): void {
  //   debugger;
  //   let AverageC1E = 0;
  //   let AverageC1R = 0;
  //   if (TRValue == "C11E") {
  //     this.setState({ C11E: Number(newValue) });
  //     let vallblC11D = Number(this.state.C11R) - Number(newValue);
  //     this.setState({ C11D: vallblC11D });
  //     AverageC1E = Number(
  //       parseFloat(
  //         (
  //           (Number(newValue) +
  //             Number(this.state.C12E) +
  //             Number(this.state.C13E)) /
  //           3
  //         ).toString()
  //       ).toFixed(2)
  //     );
  //     this.setState({ C1EE: AverageC1E });
  //     // let valC11ED = (Number(vallblC11D) + Number(this.state.C12D) + Number(this.state.C13D)) / 3;
  //     // valC11ED = Number(parseFloat(valC11ED.toString()).toFixed(2));
  //     // this.setState({ C1DD: valC11ED });

  //     this.setState({
  //       C1DD: Number(
  //         parseFloat(Number(this.state.C1RR - AverageC1E).toString()).toFixed(2)
  //       ),
  //     });
  //   } else if (TRValue == "C12E") {
  //     this.setState({ C12E: Number(newValue) });
  //     let vallblC12D = Number(this.state.C12R) - Number(newValue);
  //     this.setState({ C12D: vallblC12D });
  //     AverageC1E = Number(
  //       parseFloat(
  //         (
  //           (Number(this.state.C11E) +
  //             Number(newValue) +
  //             Number(this.state.C13E)) /
  //           3
  //         ).toString()
  //       ).toFixed(2)
  //     );
  //     this.setState({ C1EE: AverageC1E });
  //     // let valC12ED = (Number(this.state.C11D) + Number(vallblC12D) + Number(this.state.C13D)) / 3;
  //     // valC12ED = Number(parseFloat(valC12ED.toString()).toFixed(2));
  //     // this.setState({ C1DD: valC12ED });
  //     this.setState({
  //       C1DD: Number(
  //         parseFloat(Number(this.state.C1RR - AverageC1E).toString()).toFixed(2)
  //       ),
  //     });
  //   } else if (TRValue == "C13E") {
  //     this.setState({ C13E: Number(newValue) });
  //     let vallblC13D = Number(this.state.C13R) - Number(newValue);
  //     this.setState({ C13D: vallblC13D });
  //     AverageC1E = Number(
  //       parseFloat(
  //         (
  //           (Number(this.state.C11E) +
  //             Number(this.state.C12E) +
  //             Number(newValue)) /
  //           3
  //         ).toString()
  //       ).toFixed(2)
  //     );
  //     this.setState({ C1EE: AverageC1E });
  //     // let valC13ED = (Number(this.state.C11D) + Number(vallblC13D) + Number(this.state.C12D)) / 3;
  //     // valC13ED = Number(parseFloat(valC13ED.toString()).toFixed(2));
  //     // this.setState({ C1DD: valC13ED });
  //     this.setState({
  //       C1DD: Number(
  //         parseFloat(Number(this.state.C1RR - AverageC1E).toString()).toFixed(2)
  //       ),
  //     });
  //   } else if (TRValue == "C11R") {
  //     this.setState({ C11R: Number(newValue) });
  //     let vallblC11ED = Number(newValue) - Number(this.state.C11E);
  //     this.setState({ C11D: vallblC11ED });
  //     AverageC1R = Number(
  //       parseFloat(
  //         (
  //           (Number(newValue) +
  //             Number(this.state.C12R) +
  //             Number(this.state.C13R)) /
  //           3
  //         ).toString()
  //       ).toFixed(2)
  //     );
  //     this.setState({ C1RR: Number(AverageC1R) });
  //     // let valC11RD = (Number(vallblC11ED) + Number(this.state.C12D) + Number(this.state.C13D)) / 3;
  //     // valC11RD = Number(parseFloat(valC11RD.toString()).toFixed(2));
  //     // this.setState({ C1DD: valC11RD });

  //     //this.setState({ C1DD: AverageC1R - this.state.C1EE});
  //     this.setState({
  //       C1DD: Number(
  //         parseFloat(Number(AverageC1R - this.state.C1EE).toString()).toFixed(2)
  //       ),
  //     });
  //   } else if (TRValue == "C12R") {
  //     this.setState({ C12R: Number(newValue) });
  //     let vallblC12ED = Number(newValue) - Number(this.state.C12E);
  //     this.setState({ C12D: vallblC12ED });
  //     AverageC1R = Number(
  //       parseFloat(
  //         (
  //           (Number(this.state.C11R) +
  //             Number(newValue) +
  //             Number(this.state.C13R)) /
  //           3
  //         ).toString()
  //       ).toFixed(2)
  //     );
  //     this.setState({ C1RR: AverageC1R });
  //     // let valC12RD = (Number(this.state.C11D) + Number(vallblC12ED) + Number(this.state.C13D)) / 2;
  //     // valC12RD = Number(parseFloat(valC12RD.toString()).toFixed(2));
  //     // this.setState({ C1DD: valC12RD });
  //     this.setState({
  //       C1DD: Number(
  //         parseFloat(Number(AverageC1R - this.state.C1EE).toString()).toFixed(2)
  //       ),
  //     });
  //   } else if (TRValue == "C13R") {
  //     this.setState({ C13R: Number(newValue) });
  //     let vallblC13ED = Number(newValue) - Number(this.state.C13E);
  //     this.setState({ C13D: vallblC13ED });
  //     AverageC1R = Number(
  //       parseFloat(
  //         (
  //           (Number(this.state.C11R) +
  //             Number(this.state.C12R) +
  //             Number(newValue)) /
  //           3
  //         ).toString()
  //       ).toFixed(2)
  //     );
  //     this.setState({ C1RR: AverageC1R });
  //     // let valC13RD = (Number(this.state.C11D) + Number(this.state.C13D) + Number(vallblC13ED)) / 3;
  //     // valC13RD = Number(parseFloat(valC13RD.toString()).toFixed(2));
  //     // this.setState({ C1DD: valC13RD });

  //     this.setState({
  //       C1DD: Number(
  //         parseFloat(Number(AverageC1R - this.state.C1EE).toString()).toFixed(2)
  //       ),
  //     });
  //   }

  //   let C1E = Number(
  //     parseFloat(
  //       (
  //         (Number(AverageC1E) +
  //           Number(this.state.C2EE) +
  //           Number(this.state.C3EE)) /
  //         3
  //       ).toString()
  //     ).toFixed(2)
  //   );
  //   let C1R = Number(
  //     parseFloat(
  //       (
  //         (Number(AverageC1R) +
  //           Number(this.state.C2RR) +
  //           Number(this.state.C3RR)) /
  //         3
  //       ).toString()
  //     ).toFixed(2)
  //   );
  //   this.setState({ CAvgEE: C1E });
  //   this.setState({ CAvgER: C1R });
  //   //this.setState({ SctionTotalCD: C1R - C1E });
  //   this.setState({
  //     SctionTotalCD: Number(
  //       parseFloat(Number(C1R - C1E).toString()).toFixed(2)
  //     ),
  //   });
  // }
  // private onChangeC2(newValue: string, TRValue: string): void {
  //   debugger;
  //   let AverageC2E = 0;
  //   let AverageC2R = 0;
  //   if (TRValue == "C21E") {
  //     this.setState({ C21E: Number(newValue) });
  //     let vallblC21D = Number(this.state.C21R) - Number(newValue);
  //     this.setState({ C21D: vallblC21D });
  //     AverageC2E =
  //       (Number(newValue) +
  //         Number(this.state.C22E) +
  //         Number(this.state.C23E) +
  //         Number(this.state.C24E)) /
  //       4;
  //     this.setState({ C2EE: AverageC2E });
  //     // let valC21ED = (Number(vallblC21D) + Number(this.state.C22D) + Number(this.state.C23D) + Number(this.state.C24D)) / 4;
  //     // this.setState({ C2DD: valC21ED });
  //     this.setState({ C2DD: this.state.C2RR - AverageC2E });
  //   } else if (TRValue == "C22E") {
  //     this.setState({ C22E: Number(newValue) });
  //     let vallblC22D = Number(this.state.C22R) - Number(newValue);
  //     this.setState({ C22D: vallblC22D });
  //     AverageC2E =
  //       (Number(this.state.C21E) +
  //         Number(newValue) +
  //         Number(this.state.C23E) +
  //         Number(this.state.C24E)) /
  //       4;
  //     this.setState({ C2EE: AverageC2E });
  //     // let valC22ED = (Number(this.state.C22D) + Number(vallblC22D) + Number(this.state.C23D) + Number(this.state.C24D)) / 4;
  //     // this.setState({ C2DD: valC22ED });
  //     this.setState({ C2DD: this.state.C2RR - AverageC2E });
  //   } else if (TRValue == "C23E") {
  //     this.setState({ C23E: Number(newValue) });
  //     let vallblC23D = Number(this.state.C23R) - Number(newValue);
  //     this.setState({ C23D: vallblC23D });
  //     AverageC2E =
  //       (Number(this.state.C21E) +
  //         Number(this.state.C22E) +
  //         Number(newValue) +
  //         Number(this.state.C24E)) /
  //       4;
  //     this.setState({ C2EE: AverageC2E });
  //     // let valC23ED = (Number(this.state.C21D) + Number(this.state.C22D) + Number(vallblC23D) + Number(this.state.C24D)) / 4;
  //     // this.setState({ C2DD: valC23ED });
  //     this.setState({ C2DD: this.state.C2RR - AverageC2E });
  //   } else if (TRValue == "C24E") {
  //     this.setState({ C24E: Number(newValue) });
  //     let vallblC24D = Number(this.state.C24R) - Number(newValue);
  //     this.setState({ C24D: vallblC24D });
  //     AverageC2E =
  //       (Number(this.state.C21E) +
  //         Number(this.state.C22E) +
  //         Number(this.state.C23E) +
  //         Number(newValue)) /
  //       4;
  //     this.setState({ C2EE: AverageC2E });
  //     // let valC24ED = (Number(this.state.C21D) + Number(this.state.C22D) + Number(this.state.C23D) + Number(vallblC24D)) / 4;
  //     // this.setState({ C2DD: valC24ED });
  //     this.setState({ C2DD: this.state.C2RR - AverageC2E });
  //   } else if (TRValue == "C21R") {
  //     this.setState({ C21R: Number(newValue) });
  //     let vallblC21ED = Number(newValue) - Number(this.state.C21E);
  //     this.setState({ C21D: vallblC21ED });
  //     AverageC2R =
  //       (Number(newValue) +
  //         Number(this.state.C22R) +
  //         Number(this.state.C23R) +
  //         Number(this.state.C24R)) /
  //       4;
  //     this.setState({ C2RR: AverageC2R });
  //     // let valC21RD = (Number(vallblC21ED) + Number(this.state.C22D) + Number(this.state.C23D) + Number(this.state.C24D)) / 4;
  //     // this.setState({ C2DD: valC21RD });

  //     this.setState({ C2DD: AverageC2R - this.state.C2EE });
  //   } else if (TRValue == "C22R") {
  //     this.setState({ C22R: Number(newValue) });
  //     let vallblC22ED = Number(newValue) - Number(this.state.C22E);

  //     this.setState({ C22D: vallblC22ED });
  //     AverageC2R =
  //       (Number(this.state.C21R) +
  //         Number(newValue) +
  //         Number(this.state.C23R) +
  //         Number(this.state.C24R)) /
  //       4;
  //     this.setState({ C2RR: AverageC2R });

  //     // let valC22RD = (Number(this.state.C21D) + Number(vallblC22ED) + Number(this.state.C23D) + Number(this.state.C24D)) / 4;
  //     // this.setState({ C2DD: valC22RD });
  //     this.setState({ C2DD: AverageC2R - this.state.C2EE });
  //   } else if (TRValue == "C23R") {
  //     this.setState({ C23R: Number(newValue) });
  //     let vallblC23ED = Number(newValue) - Number(this.state.C23E);
  //     this.setState({ C23D: vallblC23ED });
  //     AverageC2R =
  //       (Number(this.state.C21R) +
  //         Number(this.state.C22R) +
  //         Number(newValue) +
  //         Number(this.state.C24R)) /
  //       4;
  //     this.setState({ C2RR: AverageC2R });
  //     // let valC21RD = (Number(this.state.C21D) + Number(this.state.C22D) + Number(vallblC23ED) + Number(this.state.C24D)) / 4;
  //     // this.setState({ C2DD: valC21RD });
  //     this.setState({ C2DD: AverageC2R - this.state.C2EE });
  //   } else if (TRValue == "C24R") {
  //     this.setState({ C24R: Number(newValue) });
  //     let vallblC24ED = Number(newValue) - Number(this.state.C24E);
  //     this.setState({ C24D: vallblC24ED });
  //     AverageC2R =
  //       (Number(this.state.C21R) +
  //         Number(this.state.C22R) +
  //         Number(this.state.C23R) +
  //         Number(newValue)) /
  //       4;
  //     this.setState({ C2RR: AverageC2R });
  //     // let valC21RD = (Number(this.state.C21D) + Number(this.state.C22D) + Number(this.state.C23D) + Number(vallblC24ED)) / 4;
  //     // this.setState({ C2DD: valC21RD });
  //     this.setState({ C2DD: AverageC2R - this.state.C2EE });
  //   } else {
  //   }
  //   //let SctionTotalAE = Number(parseFloat(((Number(AverageA3E) + Number(this.state.dropAverageA11E) + Number(this.state.dropAverageC2E)  )/3).toString()).toFixed(2));
  //   let C2E = Number(
  //     parseFloat(
  //       (
  //         (Number(AverageC2E) +
  //           Number(this.state.C1EE) +
  //           Number(this.state.C3EE)) /
  //         3
  //       ).toString()
  //     ).toFixed(2)
  //   );
  //   let C2R = Number(
  //     parseFloat(
  //       (
  //         (Number(AverageC2R) +
  //           Number(this.state.C1RR) +
  //           Number(this.state.C3RR)) /
  //         3
  //       ).toString()
  //     ).toFixed(2)
  //   );
  //   this.setState({ CAvgEE: C2E });
  //   this.setState({ CAvgER: C2R });
  //   // this.setState({ SctionTotalCD: C2R - C2E });
  //   this.setState({
  //     SctionTotalCD: Number(
  //       parseFloat(Number(C2R - C2E).toString()).toFixed(2)
  //     ),
  //   });
  // }
  // private onChangeC3(newValue: string, TRValue: string): void {
  //   debugger;
  //   let AverageC3E = 0;
  //   let AverageC3R = 0;
  //   if (TRValue == "C31E") {
  //     this.setState({ C31E: Number(newValue) });
  //     let vallblC31D = Number(this.state.C31R) - Number(newValue);
  //     this.setState({ C31D: vallblC31D });
  //     AverageC3E = Number(
  //       parseFloat(
  //         (
  //           (Number(newValue) +
  //             Number(this.state.C32E) +
  //             Number(this.state.C33E)) /
  //           3
  //         ).toString()
  //       ).toFixed(2)
  //     );
  //     this.setState({ C3EE: AverageC3E });
  //     // let valC31ED = (Number(vallblC31D) + Number(this.state.C32D) + Number(this.state.C33D)) / 3;
  //     // valC31ED = Number(parseFloat(valC31ED.toString()).toFixed(2));
  //     // this.setState({ C3DD: valC31ED });
  //     //this.setState({ C3DD: this.state.C3RR - AverageC3E});
  //     this.setState({
  //       C3DD: Number(
  //         parseFloat(Number(this.state.C3RR - AverageC3E).toString()).toFixed(2)
  //       ),
  //     });
  //   } else if (TRValue == "C32E") {
  //     this.setState({ C32E: Number(newValue) });
  //     let vallblC32D = Number(this.state.C32R) - Number(newValue);
  //     this.setState({ C32D: vallblC32D });
  //     AverageC3E = Number(
  //       parseFloat(
  //         (
  //           (Number(this.state.C31E) +
  //             Number(newValue) +
  //             Number(this.state.C33E)) /
  //           3
  //         ).toString()
  //       ).toFixed(2)
  //     );
  //     this.setState({ C3EE: AverageC3E });
  //     // let valC32ED = (Number(this.state.C31D) + Number(vallblC32D) + Number(this.state.C33D)) / 3;
  //     // valC32ED = Number(parseFloat(valC32ED.toString()).toFixed(2));
  //     // this.setState({ C3DD: valC32ED });
  //     this.setState({
  //       C3DD: Number(
  //         parseFloat(Number(this.state.C3RR - AverageC3E).toString()).toFixed(2)
  //       ),
  //     });
  //   } else if (TRValue == "C33E") {
  //     this.setState({ C33E: Number(newValue) });
  //     let vallblC33D = Number(this.state.C33R) - Number(newValue);
  //     this.setState({ C33D: vallblC33D });
  //     AverageC3E = Number(
  //       parseFloat(
  //         (
  //           (Number(this.state.C31E) +
  //             Number(this.state.C32E) +
  //             Number(newValue)) /
  //           3
  //         ).toString()
  //       ).toFixed(2)
  //     );
  //     this.setState({ C3EE: AverageC3E });
  //     // let valC33ED = (Number(this.state.C31D) + Number(vallblC33D) + Number(this.state.C32D)) / 3;
  //     // valC33ED = Number(parseFloat(valC33ED.toString()).toFixed(2));
  //     // this.setState({ C3DD: valC33ED });
  //     this.setState({
  //       C3DD: Number(
  //         parseFloat(Number(this.state.C3RR - AverageC3E).toString()).toFixed(2)
  //       ),
  //     });
  //   } else if (TRValue == "C31R") {
  //     this.setState({ C31R: Number(newValue) });
  //     let vallblC31ED = Number(newValue) - Number(this.state.C31E);
  //     this.setState({ C31D: vallblC31ED });
  //     AverageC3R = Number(
  //       parseFloat(
  //         (
  //           (Number(newValue) +
  //             Number(this.state.C32R) +
  //             Number(this.state.C33R)) /
  //           3
  //         ).toString()
  //       ).toFixed(2)
  //     );
  //     this.setState({ C3RR: Number(AverageC3R) });
  //     // let valC31RD = (Number(vallblC31ED) + Number(this.state.C32D) + Number(this.state.C33D)) / 3;
  //     // valC31RD = Number(parseFloat(valC31RD.toString()).toFixed(2));
  //     // this.setState({ C3DD: valC31RD });
  //     //this.setState({ C3DD: AverageC3R - this.state.C3EE });
  //     this.setState({
  //       C3DD: Number(
  //         parseFloat(Number(AverageC3R - this.state.C3EE).toString()).toFixed(2)
  //       ),
  //     });
  //   } else if (TRValue == "C32R") {
  //     this.setState({ C32R: Number(newValue) });
  //     let vallblC32ED = Number(newValue) - Number(this.state.C32E);
  //     this.setState({ C32D: vallblC32ED });
  //     AverageC3R = Number(
  //       parseFloat(
  //         (
  //           (Number(this.state.C31R) +
  //             Number(newValue) +
  //             Number(this.state.C33R)) /
  //           3
  //         ).toString()
  //       ).toFixed(2)
  //     );
  //     this.setState({ C3RR: AverageC3R });
  //     // let valC32RD = (Number(this.state.C31D) + Number(vallblC32ED) + Number(this.state.C33D)) / 2;
  //     // valC32RD = Number(parseFloat(valC32RD.toString()).toFixed(2));
  //     // this.setState({ C3DD: valC32RD });
  //     this.setState({
  //       C3DD: Number(
  //         parseFloat(Number(AverageC3R - this.state.C3EE).toString()).toFixed(2)
  //       ),
  //     });
  //   } else if (TRValue == "C33R") {
  //     this.setState({ C33R: Number(newValue) });
  //     let vallblC33ED = Number(newValue) - Number(this.state.C33E);
  //     this.setState({ C33D: vallblC33ED });
  //     AverageC3R = Number(
  //       parseFloat(
  //         (
  //           (Number(this.state.C31R) +
  //             Number(this.state.C32R) +
  //             Number(newValue)) /
  //           3
  //         ).toString()
  //       ).toFixed(2)
  //     );
  //     this.setState({ C3RR: AverageC3R });
  //     // let valC33RD = (Number(this.state.C31D) + Number(this.state.C33D) + Number(vallblC33ED)) / 3;
  //     // valC33RD = Number(parseFloat(valC33RD.toString()).toFixed(2));
  //     // this.setState({ C3DD: valC33RD });
  //     this.setState({
  //       C3DD: Number(
  //         parseFloat(Number(AverageC3R - this.state.C3EE).toString()).toFixed(2)
  //       ),
  //     });
  //   }
  //   let C3E = Number(
  //     parseFloat(
  //       (
  //         (Number(AverageC3E) +
  //           Number(this.state.C2EE) +
  //           Number(this.state.C1EE)) /
  //         3
  //       ).toString()
  //     ).toFixed(2)
  //   );
  //   let C3R = Number(
  //     parseFloat(
  //       (
  //         (Number(AverageC3R) +
  //           Number(this.state.C2RR) +
  //           Number(this.state.C2RR)) /
  //         3
  //       ).toString()
  //     ).toFixed(2)
  //   );
  //   this.setState({ CAvgEE: C3E });
  //   this.setState({ CAvgER: C3R });
  //   // this.setState({ SctionTotalCD: C3R - C3E });
  //   this.setState({
  //     SctionTotalCD: Number(
  //       parseFloat(Number(C3R - C3E).toString()).toFixed(2)
  //     ),
  //   });
  // }

  private getAverageCalculation(a, b, c, d, e) {
    a = a == 0.5 ? 0 : a;
    b = b == 0.5 ? 0 : b;
    c = c == 0.5 ? 0 : c;
    d = d == 0.5 ? 0 : d;
    e = e == 0.5 ? 0 : e;
    let aCount = a > 0 ? 1 : 0;
    let bCount = b > 0 ? 1 : 0;
    let cCount = c > 0 ? 1 : 0;
    let dCount = d > 0 ? 1 : 0;
    let eCount = e > 0 ? 1 : 0;
    let AverageOutput =
      (a + b + c + d + e) / (aCount + bCount + cCount + dCount + eCount);
    AverageOutput = isNaN(AverageOutput) ? 0 : AverageOutput;
    // return AverageOutput;
    return AverageOutput % 1 == 0 ? AverageOutput : AverageOutput.toFixed(2);
  }
  private resetNAValue(val) {
    return val == 0.5 || val == undefined ? 0 : val;
  }
  private onChangeA1(newValue: string, TRValue: string): void {
    console.log(newValue);
    console.log(TRValue);
    //! let AverageA1E = 0;
    // let AverageA1R = 0;
    let AverageA1E = this.state.A1EE;
    let AverageA1R = this.state.A1RR;
    if (TRValue == "A11E") {
      this.setState({ A11E: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblA11D =
        Number(this.resetNAValue(this.state.A11R)) -
        Number(newValue == "NA" ? 0 : newValue);
      this.setState({ A11D: vallblA11D });
      AverageA1E = Number(
        this.getAverageCalculation(
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.A12E)),
          Number(this.resetNAValue(this.state.A13E)),
          Number(this.resetNAValue(this.state.A14E)),
          Number(this.resetNAValue(this.state.A15E))
        )
      );
      //  !Old Code
      // (Number(newValue) +
      //   Number(this.resetNAValue(this.state.A12E)) +
      //   Number(this.resetNAValue(this.state.A13E)) +
      //   Number(this.resetNAValue(this.state.A14E)) +
      //   Number(this.resetNAValue(this.state.A15E))) /
      // 5;
      this.setState({ A1EE: AverageA1E });
      // let valA11ED = (Number(vallblA11D) + Number(this.state.A12D) + Number(this.state.A13D) + Number(this.state.A14D) + Number(this.state.A15D)) / 5;
      // this.setState({ A1DD: valA11ED });
      //this.setState({ A1DD: this.state.A1RR - AverageA1E});
      this.setState({
        A1DD: Number(
          parseFloat(Number(this.state.A1RR - AverageA1E).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "A12E") {
      this.setState({ A12E: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblA12D =
        Number(this.state.A12R) - Number(newValue == "NA" ? 0 : newValue);
      this.setState({ A12D: vallblA12D });
      AverageA1E = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.A11E)),
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.A13E)),
          Number(this.resetNAValue(this.state.A14E)),
          Number(this.resetNAValue(this.state.A15E))
        )
      );
      // ! (Number(this.resetNAValue(this.state.A11E)) +
      //   Number(newValue) +
      //   Number(this.resetNAValue(this.state.A13E)) +
      //   Number(this.resetNAValue(this.state.A14E)) +
      //   Number(this.resetNAValue(this.state.A15E))) /
      // 5;
      this.setState({ A1EE: AverageA1E });
      // let valA12ED = (Number(this.state.A12D) + Number(vallblA12D) + Number(this.state.A13D) + Number(this.state.A14D) + Number(this.state.A15D)) / 5;
      // this.setState({ A1DD: valA12ED });
      this.setState({
        A1DD: Number(
          parseFloat(Number(this.state.A1RR - AverageA1E).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "A13E") {
      this.setState({ A13E: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblA13D =
        Number(this.state.A13R) - Number(newValue == "NA" ? 0 : newValue);
      this.setState({ A13D: vallblA13D });
      AverageA1E = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.A11E)),
          Number(this.resetNAValue(this.state.A12E)),
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.A14E)),
          Number(this.resetNAValue(this.state.A15E))
        )
      );

      // !(Number(this.resetNAValue(this.state.A11E)) +
      //   Number(this.resetNAValue(this.state.A12E)) +
      //   Number(newValue) +
      //   Number(this.resetNAValue(this.state.A14E)) +
      //   Number(this.resetNAValue(this.state.A15E))) /
      // 5;
      this.setState({ A1EE: AverageA1E });
      // let valA13ED = (Number(this.state.A11D) + Number(this.state.A12D) + Number(vallblA13D) + Number(this.state.A14D) + Number(this.state.A15D)) / 5;
      // this.setState({ A1DD: valA13ED });
      this.setState({
        A1DD: Number(
          parseFloat(Number(this.state.A1RR - AverageA1E).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "A14E") {
      this.setState({ A14E: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblA14D =
        Number(this.resetNAValue(this.state.A14R)) -
        Number(newValue == "NA" ? 0 : newValue);
      this.setState({ A14D: vallblA14D });
      AverageA1E = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.A11E)),
          Number(this.resetNAValue(this.state.A12E)),
          Number(this.resetNAValue(this.state.A13E)),
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.A15E))
        )
      );
      //! (Number(this.resetNAValue(this.state.A11E)) +
      //   Number(this.resetNAValue(this.state.A12E)) +
      //   Number(this.resetNAValue(this.state.A13E)) +
      //   Number(newValue) +
      //   Number(this.resetNAValue(this.state.A15E))) /
      // 5;
      this.setState({ A1EE: AverageA1E });
      // let valA14ED = (Number(this.state.A11D) + Number(this.state.A12D) + Number(this.state.A13D) + Number(vallblA14D) + Number(this.state.A15D)) / 5;
      // this.setState({ A1DD: valA14ED });
      this.setState({
        A1DD: Number(
          parseFloat(Number(this.state.A1RR - AverageA1E).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "A15E") {
      this.setState({ A15E: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblA15D =
        Number(this.state.A15R) - Number(newValue == "NA" ? 0 : newValue);
      this.setState({ A15D: vallblA15D });
      AverageA1E = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.A11E)),
          Number(this.resetNAValue(this.state.A12E)),
          Number(this.resetNAValue(this.state.A13E)),
          Number(this.resetNAValue(this.state.A14E)),
          Number(newValue === "NA" ? "0.5" : newValue)
        )
      );
      //! (Number(this.resetNAValue(this.state.A11E)) +
      //   Number(this.resetNAValue(this.state.A12E)) +
      //   Number(this.resetNAValue(this.state.A13E)) +
      //   Number(this.resetNAValue(this.state.A14E)) +
      //   Number(newValue)) /
      // 5;
      this.setState({ A1EE: AverageA1E });
      // let valA15ED = (Number(this.state.A11D) + Number(this.state.A12D) + Number(this.state.A13D) + Number(this.state.A14D) + Number(vallblA15D)) / 5;
      // this.setState({ A1DD: valA15ED });
      this.setState({
        A1DD: Number(
          parseFloat(Number(this.state.A1RR - AverageA1E).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "A11R") {
      this.setState({ A11R: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblA11ED =
        Number(newValue == "NA" ? 0 : newValue) -
        Number(this.resetNAValue(this.state.A11E));
      this.setState({ A11D: vallblA11ED });
      AverageA1R = Number(
        this.getAverageCalculation(
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.A12R)),
          Number(this.resetNAValue(this.state.A13R)),
          Number(this.resetNAValue(this.state.A14R)),
          Number(this.resetNAValue(this.state.A15R))
        )
      );
      //! (Number(newValue === "NA" ? "0.5" : newValue) +
      //   Number(this.state.A12R) +
      //   Number(this.state.A13R) +
      //   Number(this.state.A14R) +
      //   Number(this.state.A15R)) /
      // 5;
      this.setState({ A1RR: AverageA1R });
      // let valA11RD = (Number(vallblA11ED) + Number(this.state.A12D) + Number(this.state.A13D) + Number(this.state.A14D) + Number(this.state.A15D)) / 5;
      // this.setState({ A1DD: valA11RD });
      //this.setState({ A1DD: AverageA1R - this.state.A1EE});
      this.setState({
        A1DD: Number(
          parseFloat(Number(AverageA1R - this.state.A1EE).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "A12R") {
      this.setState({ A12R: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblA12ED =
        Number(newValue == "NA" ? 0 : newValue) -
        Number(this.resetNAValue(this.state.A12E));

      this.setState({ A12D: vallblA12ED });
      AverageA1R = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.A11R)),
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.A13R)),
          Number(this.resetNAValue(this.state.A14R)),
          Number(this.resetNAValue(this.state.A15R))
        )
      );
      //! (Number(this.state.A11R) +
      //   Number(newValue) +
      //   Number(this.state.A13R) +
      //   Number(this.state.A14R) +
      //   Number(this.state.A15R)) /
      //   5;
      this.setState({ A1RR: AverageA1R });

      // let valA12RD = (Number(this.state.A11D) + Number(vallblA12ED) + Number(this.state.A13D) + Number(this.state.A14D) + Number(this.state.A15D)) / 5;
      // this.setState({ A1DD: valA12RD });
      this.setState({
        A1DD: Number(
          parseFloat(Number(AverageA1R - this.state.A1EE).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "A13R") {
      this.setState({ A13R: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblA13ED =
        Number(newValue == "NA" ? 0 : newValue) -
        Number(this.resetNAValue(this.state.A13E));
      this.setState({ A13D: vallblA13ED });
      AverageA1R = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.A11R)),
          Number(this.resetNAValue(this.state.A12R)),
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.A14R)),
          Number(this.resetNAValue(this.state.A15R))
        )
      );
      //! (Number(this.state.A11R) +
      //   Number(this.state.A12R) +
      //   Number(newValue) +
      //   Number(this.state.A14R) +
      //   Number(this.state.A15R)) /
      // 5;
      this.setState({ A1RR: AverageA1R });

      // let valA11RD = (Number(this.state.A11D) + Number(this.state.A12D) + Number(vallblA13ED) + Number(this.state.A14D) + Number(this.state.A15D)) / 5;
      // this.setState({ A1DD: valA11RD });
      this.setState({
        A1DD: Number(
          parseFloat(Number(AverageA1R - this.state.A1EE).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "A14R") {
      this.setState({ A14R: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblA14ED =
        Number(newValue == "NA" ? 0 : newValue) -
        Number(this.resetNAValue(this.state.A14E));
      this.setState({ A14D: vallblA14ED });
      AverageA1R = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.A11R)),
          Number(this.resetNAValue(this.state.A12R)),
          Number(this.resetNAValue(this.state.A13R)),
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.A15R))
        )
      );
      // !(Number(this.state.A11R) +
      //   Number(this.state.A12R) +
      //   Number(this.state.A13R) +
      //   Number(newValue) +
      //   Number(this.state.A15R)) /
      // 5;
      this.setState({ A1RR: AverageA1R });

      // let valA11RD = (Number(this.state.A11D) + Number(this.state.A12D) + Number(this.state.A13D) + Number(vallblA14ED) + Number(this.state.A15D)) / 5;
      // this.setState({ A1DD: valA11RD });
      this.setState({
        A1DD: Number(
          parseFloat(Number(AverageA1R - this.state.A1EE).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "A15R") {
      this.setState({ A15R: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblA15ED =
        Number(newValue == "NA" ? 0 : newValue) -
        Number(this.resetNAValue(this.state.A15E));
      this.setState({ A15D: vallblA15ED });
      AverageA1R = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.A11R)),
          Number(this.resetNAValue(this.state.A12R)),
          Number(this.resetNAValue(this.state.A13R)),
          Number(this.resetNAValue(this.state.A14R)),
          Number(newValue === "NA" ? "0.5" : newValue)
        )
      );
      // ! (Number(this.state.A11R) +
      //   Number(this.state.A12R) +
      //   Number(this.state.A13R) +
      //   Number(this.state.A14R) +
      //   Number(newValue)) /
      // 5;
      this.setState({ A1RR: AverageA1R });

      // let valA11RD = (Number(this.state.A11D) + Number(this.state.A12D) + Number(this.state.A13D) + Number(this.state.A14D) + Number(vallblA15ED)) / 5;
      // this.setState({ A1DD: valA11RD });
      this.setState({
        A1DD: Number(
          parseFloat(Number(AverageA1R - this.state.A1EE).toString()).toFixed(2)
        ),
      });
    } else {
    }
    //let TotalAE =

    let A1E = Number(
      parseFloat(
        (
          (Number(AverageA1E) +
            Number(this.state.A2EE) +
            Number(this.state.A3EE)) /
          ((AverageA1E != 0 ? 1 : 0) +
            (this.state.A2EE != 0 ? 1 : 0) +
            (this.state.A3EE != 0 ? 1 : 0))
        ).toString()
      ).toFixed(2)
    );
    A1E = isNaN(A1E) ? 0 : A1E;
    let A1R = Number(
      parseFloat(
        (
          (Number(AverageA1R) +
            Number(this.state.A2RR) +
            Number(this.state.A3RR)) /
          ((AverageA1R != 0 ? 1 : 0) +
            (this.state.A2RR != 0 ? 1 : 0) +
            (this.state.A3RR != 0 ? 1 : 0))
        ).toString()
      ).toFixed(2)
    );
    A1R = isNaN(A1R) ? 0 : A1R;
    this.setState({ AAvgEE: A1E });
    this.setState({ AAvgER: A1R });
    // this.setState({ SctionTotalAD: A1R - A1E });
    this.setState({
      SctionTotalAD: Number(
        parseFloat(Number(A1R - A1E).toString()).toFixed(2)
      ),
    });
    //SctionTotalAD
  }
  private onChangeA2(newValue: string, TRValue: string): void {
    let AverageA2E = 0;
    let AverageA2R = 0;
    let ctdNewValue = this.props.Options.filter((e) => e.text === newValue)[0]
      .key;
    console.log(this.props.Options);
    // newValue = newValue === "NA" || newValue === "" ? "0" : newValue;
    if (TRValue == "A21E") {
      this.setState({ A21E: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblA21D =
        Number(this.resetNAValue(this.state.A21R)) -
        Number(newValue == "NA" ? 0 : newValue);
      this.setState({ A21D: vallblA21D });
      AverageA2E = Number(
        this.getAverageCalculation(
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.A22E)),
          Number(this.resetNAValue(this.state.A23E)),
          Number(this.resetNAValue(this.state.A24E)),
          0
        )
      );
      //! (Number(newValue) +
      //   Number(this.resetNAValue(this.state.A22E)) +
      //   Number(this.resetNAValue(this.state.A23E)) +
      //   Number(this.resetNAValue(this.state.A24E))) /
      // 4;
      this.setState({ A2EE: AverageA2E });
      // let valA21ED = (Number(vallblA21D) + Number(this.state.A22D) + Number(this.state.A23D) + Number(this.state.A24D)) / 4;
      // this.setState({ A2DD: valA21ED });
      // this.setState({ A2DD: this.state.A2RR - AverageA2E });
      this.setState({
        A2DD: Number(
          parseFloat(Number(this.state.A2RR - AverageA2E).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "A22E") {
      this.setState({ A22E: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblA22D =
        Number(this.resetNAValue(this.state.A22R)) -
        Number(newValue == "NA" ? 0 : newValue);
      this.setState({ A22D: vallblA22D });
      AverageA2E = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.A21E)),
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.A23E)),
          Number(this.resetNAValue(this.state.A24E)),
          0
        )
      );
      // !(Number(this.resetNAValue(this.state.A21E)) +
      //   Number(newValue) +
      //   Number(this.resetNAValue(this.state.A23E)) +
      //   Number(this.resetNAValue(this.state.A24E))) /
      // 4;
      this.setState({ A2EE: AverageA2E });
      // let valA22ED = (Number(this.state.A22D) + Number(vallblA22D) + Number(this.state.A23D) + Number(this.state.A24D)) / 4;
      // this.setState({ A2DD: valA22ED });
      // this.setState({ A2DD: this.state.A2RR - AverageA2E });
      this.setState({
        A2DD: Number(
          parseFloat(Number(this.state.A2RR - AverageA2E).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "A23E") {
      this.setState({ A23E: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblA23D =
        Number(this.resetNAValue(this.state.A23R)) -
        Number(newValue == "NA" ? 0 : newValue);
      this.setState({ A23D: vallblA23D });
      AverageA2E = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.A21E)),
          Number(this.resetNAValue(this.state.A22E)),
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.A24E)),
          0
        )
      );
      // (Number(this.resetNAValue(this.state.A21E)) +
      //   Number(this.resetNAValue(this.state.A22E)) +
      //   Number(newValue) +
      //   Number(this.resetNAValue(this.state.A24E))) /
      // 4;
      this.setState({ A2EE: AverageA2E });
      // let valA23ED = (Number(this.state.A21D) + Number(this.state.A22D) + Number(vallblA23D) + Number(this.state.A24D)) / 4;
      // this.setState({ A2DD: valA23ED });
      // this.setState({ A2DD: this.state.A2RR - AverageA2E });
      this.setState({
        A2DD: Number(
          parseFloat(Number(this.state.A2RR - AverageA2E).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "A24E") {
      this.setState({ A24E: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblA24D =
        Number(this.resetNAValue(this.state.A24R)) -
        Number(newValue == "NA" ? 0 : newValue);
      this.setState({ A24D: vallblA24D });
      AverageA2E = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.A21E)),
          Number(this.resetNAValue(this.state.A22E)),
          Number(this.resetNAValue(this.state.A23E)),
          Number(newValue === "NA" ? "0.5" : newValue),
          0
        )
      );
      //! (Number(this.resetNAValue(this.state.A21E)) +
      //   Number(this.resetNAValue(this.state.A22E)) +
      //   Number(this.resetNAValue(this.state.A23E)) +
      //   Number(newValue)) /
      //   4;
      this.setState({ A2EE: AverageA2E });
      // let valA24ED = (Number(this.state.A21D) + Number(this.state.A22D) + Number(this.state.A23D) + Number(vallblA24D)) / 4;
      // this.setState({ A2DD: valA24ED });
      // this.setState({ A2DD: this.state.A2RR - AverageA2E });
      this.setState({
        A2DD: Number(
          parseFloat(Number(this.state.A2RR - AverageA2E).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "A21R") {
      this.setState({ A21R: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblA21ED =
        Number(newValue == "NA" ? 0 : newValue) -
        Number(this.resetNAValue(this.state.A21E));
      this.setState({ A21D: vallblA21ED });
      AverageA2R = Number(
        this.getAverageCalculation(
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.A22R)),
          Number(this.resetNAValue(this.state.A23R)),
          Number(this.resetNAValue(this.state.A24R)),
          0
        )
      );
      // !(Number(newValue) +
      //   Number(this.state.A22R) +
      //   Number(this.state.A23R) +
      //   Number(this.state.A24R)) /
      // 4;
      this.setState({ A2RR: AverageA2R });
      // let valA21RD = (Number(vallblA21ED) + Number(this.state.A22D) + Number(this.state.A23D) + Number(this.state.A24D)) / 4;
      // this.setState({ A2DD: valA21RD });
      // this.setState({ A2DD: AverageA2R - this.state.A2EE });
      this.setState({
        A2DD: Number(
          parseFloat(Number(AverageA2R - this.state.A2EE).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "A22R") {
      this.setState({ A22R: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblA22ED =
        Number(newValue == "NA" ? 0 : newValue) -
        Number(this.resetNAValue(this.state.A22E));

      this.setState({ A22D: vallblA22ED });
      AverageA2R = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.A21R)),
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.A23R)),
          Number(this.resetNAValue(this.state.A24R)),
          0
        )
      );
      //! (Number(this.state.A21R) +
      //   Number(newValue) +
      //   Number(this.state.A23R) +
      //   Number(this.state.A24R)) /
      // 4;
      this.setState({ A2RR: AverageA2R });

      // let valA22RD = (Number(this.state.A21D) + Number(vallblA22ED) + Number(this.state.A23D) + Number(this.state.A24D)) / 4;
      // this.setState({ A2DD: valA22RD });
      // this.setState({ A2DD: AverageA2R - this.state.A2EE });
      this.setState({
        A2DD: Number(
          parseFloat(Number(AverageA2R - this.state.A2EE).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "A23R") {
      this.setState({ A23R: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblA23ED =
        Number(newValue == "NA" ? 0 : newValue) -
        Number(this.resetNAValue(this.state.A23E));
      this.setState({ A23D: vallblA23ED });
      AverageA2R = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.A21R)),
          Number(this.resetNAValue(this.state.A22R)),
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.A24R)),
          0
        )
      );
      // !(Number(this.state.A21R) +
      //   Number(this.state.A22R) +
      //   Number(newValue) +
      //   Number(this.state.A24R)) /
      // 4;
      this.setState({ A2RR: AverageA2R });
      // let valA21RD = (Number(this.state.A21D) + Number(this.state.A22D) + Number(vallblA23ED) + Number(this.state.A24D)) / 4;
      // this.setState({ A2DD: valA21RD });
      // this.setState({ A2DD: AverageA2R - this.state.A2EE });
      this.setState({
        A2DD: Number(
          parseFloat(Number(AverageA2R - this.state.A2EE).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "A24R") {
      this.setState({ A24R: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblA24ED =
        Number(newValue == "NA" ? 0 : newValue) -
        Number(this.resetNAValue(this.state.A24E));
      this.setState({ A24D: vallblA24ED });
      AverageA2R = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.A21R)),
          Number(this.resetNAValue(this.state.A22R)),
          Number(this.resetNAValue(this.state.A23R)),
          Number(newValue === "NA" ? "0.5" : newValue),
          0
        )
      );
      //! (Number(this.state.A21R) +
      //   Number(this.state.A22R) +
      //   Number(this.state.A23R) +
      //   Number(newValue)) /
      // 4;
      this.setState({ A2RR: AverageA2R });
      // let valA21RD = (Number(this.state.A21D) + Number(this.state.A22D) + Number(this.state.A23D) + Number(vallblA24ED)) / 4;
      // this.setState({ A2DD: valA21RD });
      // this.setState({ A2DD: AverageA2R - this.state.A2EE });
      this.setState({
        A2DD: Number(
          parseFloat(Number(AverageA2R - this.state.A2EE).toString()).toFixed(2)
        ),
      });
    } else {
    }
    //let SctionTotalAE = Number(parseFloat(((Number(AverageA3E) + Number(this.state.dropAverageA11E) + Number(this.state.dropAverageA2E)  )/3).toString()).toFixed(2));
    let A2E = Number(
      parseFloat(
        (
          (Number(this.state.A1EE) +
            Number(AverageA2E) +
            Number(this.state.A3EE)) /
          ((this.state.A1EE != 0 ? 1 : 0) +
            (AverageA2E != 0 ? 1 : 0) +
            (this.state.A3EE != 0 ? 1 : 0))
        )
          // ((this.state.A1EE !== 0 ? 1 : 0) +
          //   (AverageA2E !== 0 ? 1 : 0) +
          //   (this.state.A3EE !== 0 ? 1 : 0))
          // Changes in Tec
          .toString()
      ).toFixed(2)
    );
    A2E = isNaN(A2E) ? 0 : A2E;
    let A2R = Number(
      parseFloat(
        (
          (Number(this.state.A1RR) +
            Number(AverageA2R) +
            Number(this.state.A3RR)) /
          ((this.state.A1RR != 0 ? 1 : 0) +
            (AverageA2R != 0 ? 1 : 0) +
            (this.state.A3RR != 0 ? 1 : 0))
        ).toString()
      ).toFixed(2)
    );
    A2R = isNaN(A2R) ? 0 : A2R;
    this.setState({ AAvgEE: A2E });
    this.setState({ AAvgER: A2R });
    //this.setState({ SctionTotalAD: A2R - A2E });
    this.setState({
      SctionTotalAD: Number(
        parseFloat(Number(A2R - A2E).toString()).toFixed(2)
      ),
    });
  }
  private onChangeA3(newValue: string, TRValue: string): void {
    let AverageA3E = 0;
    let AverageA3R = 0;
    let ctdNewValue = this.props.Options.filter((e) => e.text === newValue)[0]
      .key;
    console.log(this.props.Options);
    // newValue = newValue === "NA" || newValue === "" ? "0" : newValue;
    if (TRValue == "A31E") {
      this.setState({ A31E: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblA31D =
        Number(this.resetNAValue(this.state.A31R)) -
        Number(newValue == "NA" ? 0 : newValue);
      this.setState({ A31D: vallblA31D });
      AverageA3E = Number(
        this.getAverageCalculation(
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.A32E)),
          Number(this.resetNAValue(this.state.A33E)),
          0,
          0
        )
      );

      //! AverageA3E = Number(
      //   parseFloat(
      //     (
      //       (Number(newValue) +
      //         Number(this.resetNAValue(this.state.A32E)) +
      //         Number(this.resetNAValue(this.state.A33E))) /
      //       3
      //     ).toString()
      //   ).toFixed(2)
      // );
      this.setState({ A3EE: AverageA3E });
      // let valA31ED = (Number(vallblA31D) + Number(this.state.A32D) + Number(this.state.A33D)) / 3;
      // valA31ED = Number(parseFloat(valA31ED.toString()).toFixed(2));
      // this.setState({ A3DD: valA31ED });

      //this.setState({ A3DD:  this.state.A3RR - AverageA3E });
      this.setState({
        A3DD: Number(
          parseFloat(Number(this.state.A3RR - AverageA3E).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "A32E") {
      this.setState({ A32E: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblA32D =
        Number(this.resetNAValue(this.state.A32R)) -
        Number(newValue == "NA" ? 0 : newValue);
      this.setState({ A32D: vallblA32D });
      AverageA3E = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.A31E)),
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.A33E)),
          0,
          0
        )
      );
      //! AverageA3E = Number(
      //   parseFloat(
      //     (
      //       (Number(this.resetNAValue(this.state.A31E)) +
      //         Number(newValue) +
      //         Number(this.resetNAValue(this.state.A33E))) /
      //       3
      //     ).toString()
      //   ).toFixed(2)
      // );
      this.setState({ A3EE: AverageA3E });
      // let valA32ED = (Number(this.state.A31D) + Number(vallblA32D) + Number(this.state.A33D)) / 3;
      // valA32ED = Number(parseFloat(valA32ED.toString()).toFixed(2));
      // this.setState({ A3DD: valA32ED });
      this.setState({
        A3DD: Number(
          parseFloat(Number(this.state.A3RR - AverageA3E).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "A33E") {
      this.setState({ A33E: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblA33D =
        Number(this.resetNAValue(this.state.A33R)) -
        Number(newValue == "NA" ? 0 : newValue);
      this.setState({ A33D: vallblA33D });
      AverageA3E = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.A31E)),
          Number(this.resetNAValue(this.state.A32E)),
          Number(newValue === "NA" ? "0.5" : newValue),
          0,
          0
        )
      );
      //! AverageA3E = Number(
      //   parseFloat(
      //     (
      //       (Number(this.resetNAValue(this.state.A31E)) +
      //         Number(this.resetNAValue(this.state.A32E)) +
      //         Number(newValue)) /
      //       3
      //     ).toString()
      //   ).toFixed(2)
      // );
      this.setState({ A3EE: AverageA3E });

      // let valA33ED = (Number(this.state.A31D) + Number(this.state.A32D) + Number(vallblA33D)) / 3;
      // valA33ED = Number(parseFloat(valA33ED.toString()).toFixed(2));
      // this.setState({ A3DD: valA33ED });
      this.setState({
        A3DD: Number(
          parseFloat(Number(this.state.A3RR - AverageA3E).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "A31R") {
      this.setState({ A31R: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblA31ED =
        Number(newValue == "NA" ? 0 : newValue) -
        Number(this.resetNAValue(this.state.A31E));
      this.setState({ A31D: vallblA31ED });
      AverageA3R = Number(
        this.getAverageCalculation(
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.A32R)),
          Number(this.resetNAValue(this.state.A33R)),
          0,
          0
        )
      );
      //! AverageA3R = Number(
      //   parseFloat(
      //     (
      //       (Number(newValue) +
      //         Number(this.state.A32R) +
      //         Number(this.state.A33R)) /
      //       3
      //     ).toString()
      //   ).toFixed(2)
      // );
      this.setState({ A3RR: Number(AverageA3R) });
      // let valA31RD = (Number(vallblA31ED) + Number(this.state.A32D) + Number(this.state.A33D)) / 3;
      // valA31RD = Number(parseFloat(valA31RD.toString()).toFixed(2));
      // this.setState({ A3DD: valA31RD });
      //this.setState({ A3DD: AverageA3R - this.state.A3EE});
      this.setState({
        A3DD: Number(
          parseFloat(Number(AverageA3R - this.state.A3EE).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "A32R") {
      this.setState({ A32R: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblA32ED =
        Number(newValue == "NA" ? 0 : newValue) -
        Number(this.resetNAValue(this.state.A32E));
      this.setState({ A32D: vallblA32ED });
      AverageA3R = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.A31R)),
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.A33R)),
          0,
          0
        )
      );
      // !AverageA3R = Number(
      //   parseFloat(
      //     (
      //       (Number(this.state.A31R) +
      //         Number(newValue) +
      //         Number(this.state.A33R)) /
      //       3
      //     ).toString()
      //   ).toFixed(2)
      // );
      this.setState({ A3RR: AverageA3R });
      // let valA32RD = (Number(this.state.A31D) + Number(vallblA32ED) + Number(this.state.A33D)) / 3;
      // valA32RD = Number(parseFloat(valA32RD.toString()).toFixed(2));
      // this.setState({ A3DD: valA32RD });
      this.setState({
        A3DD: Number(
          parseFloat(Number(AverageA3R - this.state.A3EE).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "A33R") {
      this.setState({ A33R: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblA33ED =
        Number(newValue == "NA" ? 0 : newValue) -
        Number(this.resetNAValue(this.state.A33E));
      this.setState({ A33D: vallblA33ED });
      AverageA3R = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.A31R)),
          Number(this.resetNAValue(this.state.A32R)),
          Number(newValue === "NA" ? "0.5" : newValue),
          0,
          0
        )
      );
      //! AverageA3R = Number(
      //   parseFloat(
      //     (
      //       (Number(this.state.A31R) +
      //         Number(this.state.A32R) +
      //         Number(newValue)) /
      //       3
      //     ).toString()
      //   ).toFixed(2)
      // );
      this.setState({ A3RR: AverageA3R });
      // let valA33RD = (Number(this.state.A31D) + Number(this.state.A32D) + Number(vallblA33ED)) / 3;
      // valA33RD = Number(parseFloat(valA33RD.toString()).toFixed(2));
      // this.setState({ A3DD: valA33RD });

      this.setState({
        A3DD: Number(
          parseFloat(Number(AverageA3R - this.state.A3EE).toString()).toFixed(2)
        ),
      });
    } else {
    }
    //let SctionTotalAE = Number(parseFloat(((Number(AverageA3E) + Number(this.state.dropAverageA11E) + Number(this.state.dropAverageA2E)  )/3).toString()).toFixed(2));
    let A3E = Number(
      parseFloat(
        (
          (Number(AverageA3E) +
            Number(this.state.A1EE) +
            Number(this.state.A2EE)) /
          ((AverageA3E != 0 ? 1 : 0) +
            (this.state.A1EE != 0 ? 1 : 0) +
            (this.state.A2EE != 0 ? 1 : 0))
        ).toString()
      ).toFixed(2)
    );
    A3E = isNaN(A3E) ? 0 : A3E;
    let A3R = Number(
      parseFloat(
        (
          (Number(AverageA3R) +
            Number(this.state.A1RR) +
            Number(this.state.A2RR)) /
          ((AverageA3R != 0 ? 1 : 0) +
            (this.state.A1RR != 0 ? 1 : 0) +
            (this.state.A2RR != 0 ? 1 : 0))
        ).toString()
      ).toFixed(2)
    );
    A3R = isNaN(A3R) ? 0 : A3R;
    this.setState({ AAvgEE: A3E });
    this.setState({ AAvgER: A3R });
    this.setState({
      SctionTotalAD: Number(
        parseFloat(Number(A3R - A3E).toString()).toFixed(2)
      ),
    });
  }

  private onChangeB1(newValue: string, TRValue: string): void {
    debugger;
    let AverageB1E = 0;
    let AverageB1R = 0;
    let ctdNewValue = this.props.Options.filter((e) => e.text === newValue)[0]
      .key;
    console.log(this.props.Options);
    // newValue = newValue === "NA" || newValue === "" ? "0" : newValue;
    if (TRValue == "B11E") {
      this.setState({ B11E: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblB11D =
        Number(this.resetNAValue(this.state.B11R)) -
        Number(newValue == "NA" ? 0 : newValue);
      this.setState({ B11D: vallblB11D });
      AverageB1E = Number(
        this.getAverageCalculation(
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.B12E)),
          0,
          0,
          0
        )
      );
      //! AverageB1E = Number(
      //   parseFloat(
      //     (
      //       (Number(newValue) + Number(this.resetNAValue(this.state.B12E))) /
      //       2
      //     ).toString()
      //   ).toFixed(2)
      //   // !Technorucs
      // );
      this.setState({ B1EE: AverageB1E });
      // let valB11ED = (Number(vallblB11D) + Number(this.state.B12D)) / 2;
      // valB11ED = Number(parseFloat(valB11ED.toString()).toFixed(2));
      // this.setState({ B1DD: valB11ED });

      // this.setState({ B1DD: this.state.B1RR - AverageB1E });
      this.setState({
        B1DD: Number(
          parseFloat(Number(this.state.B1RR - AverageB1E).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "B12E") {
      this.setState({ B12E: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblB12D =
        Number(this.resetNAValue(this.state.B12R)) -
        Number(newValue == "NA" ? 0 : newValue);
      this.setState({ B12D: vallblB12D });
      AverageB1E = AverageB1E = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.B11E)),
          Number(newValue === "NA" ? "0.5" : newValue),
          0,
          0,
          0
        )
      );
      // AverageB1E = Number(
      //   parseFloat(
      //     (
      //       (Number(this.resetNAValue(this.state.B11E)) + Number(newValue)) /
      //       2
      //     ).toString()
      //   ).toFixed(2)
      // );
      this.setState({ B1EE: AverageB1E });
      // let valB12ED = (Number(this.state.B11D) + Number(vallblB12D)) / 2;
      // valB12ED = Number(parseFloat(valB12ED.toString()).toFixed(2));
      // this.setState({ B1DD: valB12ED });

      // this.setState({ B1DD: this.state.B1RR - AverageB1E });
      this.setState({
        B1DD: Number(
          parseFloat(Number(this.state.B1RR - AverageB1E).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "B11R") {
      this.setState({ B11R: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblB11ED =
        Number(newValue == "NA" ? 0 : newValue) -
        Number(this.resetNAValue(this.state.B11E));
      this.setState({ B11D: vallblB11ED });
      AverageB1R = Number(
        this.getAverageCalculation(
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.B12R)),
          0,
          0,
          0
        )
      );
      //! AverageB1R = Number(
      //   parseFloat(
      //     ((Number(newValue) + Number(this.state.B12R)) / 2).toString()
      //   ).toFixed(2)
      // );
      this.setState({ B1RR: Number(AverageB1R) });
      // let valB11RD = (Number(vallblB11ED) + Number(this.state.B12D)) / 2;
      // valB11RD = Number(parseFloat(valB11RD.toString()).toFixed(2));
      // this.setState({ B1DD: valB11RD });
      // this.setState({ B1DD: AverageB1R - this.state.B1EE });
      this.setState({
        B1DD: Number(
          parseFloat(Number(AverageB1R - this.state.B1EE).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "B12R") {
      this.setState({ B12R: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblB12ED =
        Number(newValue == "NA" ? 0 : newValue) -
        Number(this.resetNAValue(this.state.B12E));
      this.setState({ B12D: vallblB12ED });
      AverageB1R = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.B11R)),
          Number(newValue === "NA" ? "0.5" : newValue),
          0,
          0,
          0
        )
      );
      //! AverageB1R = Number(
      //   parseFloat(
      //     ((Number(this.state.B11R) + Number(newValue)) / 2).toString()
      //   ).toFixed(2)
      // );
      this.setState({ B1RR: AverageB1R });
      // let valB12RD = (Number(this.state.B11D) + Number(vallblB12ED)) / 2;
      // valB12RD = Number(parseFloat(valB12RD.toString()).toFixed(2));
      // this.setState({ B1DD: valB12RD });

      // this.setState({ B1DD: AverageB1R - this.state.B1EE });
      this.setState({
        B1DD: Number(
          parseFloat(Number(AverageB1R - this.state.B1EE).toString()).toFixed(2)
        ),
      });
    }
    let B1E = Number(
      parseFloat(
        (
          (Number(AverageB1E) +
            Number(this.state.B2EE) +
            Number(this.state.B3EE) +
            Number(this.state.B4EE)) /
          ((AverageB1E != 0 ? 1 : 0) +
            (this.state.B2EE != 0 ? 1 : 0) +
            (this.state.B3EE != 0 ? 1 : 0) +
            (this.state.B4EE != 0 ? 1 : 0))
        ).toString()
      ).toFixed(2)
    );
    B1E = isNaN(B1E) ? 0 : B1E;
    let B1R = Number(
      parseFloat(
        (
          (Number(AverageB1R) +
            Number(this.state.B2RR) +
            Number(this.state.B3RR) +
            Number(this.state.B4RR)) /
          ((AverageB1R != 0 ? 1 : 0) +
            (this.state.B2RR != 0 ? 1 : 0) +
            (this.state.B3RR != 0 ? 1 : 0) +
            (this.state.B4RR != 0 ? 1 : 0))
        ).toString()
      ).toFixed(2)
    );
    B1R = isNaN(B1R) ? 0 : B1R;
    this.setState({ BAvgEE: B1E });
    this.setState({ BAvgER: B1R });
    //this.setState({ SctionTotalBD: B1R - B1E });
    this.setState({
      SctionTotalBD: Number(
        parseFloat(Number(B1R - B1E).toString()).toFixed(2)
      ),
    });
  }
  private onChangeB2(newValue: string, TRValue: string): void {
    debugger;
    let AverageB2E = 0;
    let AverageB2R = 0;
    let ctdNewValue = this.props.Options.filter((e) => e.text === newValue)[0]
      .key;
    console.log(this.props.Options);
    // newValue = newValue === "NA" || newValue === "" ? "0" : newValue;
    if (TRValue == "B21E") {
      this.setState({ B21E: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblB21D =
        Number(this.resetNAValue(this.state.B21R)) -
        Number(newValue == "NA" ? 0 : newValue);
      this.setState({ B21D: vallblB21D });
      AverageB2E = Number(
        this.getAverageCalculation(
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.B22E)),
          Number(this.resetNAValue(this.state.B23E)),
          0,
          0
        )
      );
      //! AverageB2E = Number(
      //   parseFloat(
      //     (
      //       (Number(newValue) +
      //         Number(this.resetNAValue(this.state.B22E)) +
      //         Number(this.resetNAValue(this.state.B23E))) /
      //       3
      //     ).toString()
      //   ).toFixed(2)
      // );
      this.setState({ B2EE: AverageB2E });
      //this.setState({ B2DD: this.state.B2RR - AverageB2E });
      this.setState({
        B2DD: Number(
          parseFloat(Number(this.state.B2RR - AverageB2E).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "B22E") {
      this.setState({ B22E: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblB22D =
        Number(this.resetNAValue(this.state.B22R)) -
        Number(newValue == "NA" ? 0 : newValue);
      this.setState({ B22D: vallblB22D });
      AverageB2E = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.B21E)),
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.B23E)),
          0,
          0
        )
      );
      //! AverageB2E = Number(
      //   parseFloat(
      //     (
      //       (Number(this.resetNAValue(this.state.B21E)) +
      //         Number(this.resetNAValue(this.state.B23E)) +
      //         Number(newValue)) /
      //       3
      //     ).toString()
      //   ).toFixed(2)
      // );
      this.setState({ B2EE: AverageB2E });
      //this.setState({ B2DD: this.state.B2RR - AverageB2E });
      this.setState({
        B2DD: Number(
          parseFloat(Number(this.state.B2RR - AverageB2E).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "B23E") {
      this.setState({ B23E: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblB23D =
        Number(this.resetNAValue(this.state.B23R)) -
        Number(newValue == "NA" ? 0 : newValue);
      this.setState({ B23D: vallblB23D });
      AverageB2E = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.B21E)),
          Number(this.resetNAValue(this.state.B22E)),
          Number(newValue === "NA" ? "0.5" : newValue),
          0,
          0
        )
      );
      // ! AverageB2E = Number(
      //   parseFloat(
      //     (
      //       (Number(this.resetNAValue(this.state.B21E)) +
      //         Number(this.resetNAValue(this.state.B22E)) +
      //         Number(newValue)) /
      //       3
      //     ).toString()
      //   ).toFixed(2)
      // );
      this.setState({ B2EE: AverageB2E });
      //this.setState({ B2DD: this.state.B2RR - AverageB2E });
      this.setState({
        B2DD: Number(
          parseFloat(Number(this.state.B2RR - AverageB2E).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "B21R") {
      this.setState({ B21R: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblB21ED =
        Number(newValue == "NA" ? 0 : newValue) -
        Number(this.resetNAValue(this.state.B21E));
      this.setState({ B21D: vallblB21ED });
      AverageB2R = Number(
        this.getAverageCalculation(
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.B22R)),
          Number(this.resetNAValue(this.state.B23R)),
          0,
          0
        )
      );
      //! AverageB2R = Number(
      //   parseFloat(
      //     (
      //       (Number(newValue) +
      //         Number(this.state.B22R) +
      //         Number(this.state.B23R)) /
      //       3
      //     ).toString()
      //   ).toFixed(2)
      // );
      this.setState({ B2RR: Number(AverageB2R) });
      //this.setState({ B2DD: AverageB2R - this.state.B2EE });
      this.setState({
        B2DD: Number(
          parseFloat(Number(AverageB2R - this.state.B2EE).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "B22R") {
      this.setState({ B22R: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblB22ED =
        Number(newValue == "NA" ? 0 : newValue) -
        Number(this.resetNAValue(this.state.B22E));
      this.setState({ B22D: vallblB22ED });
      AverageB2R = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.B21R)),
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.B23R)),
          0,
          0
        )
      );
      //! AverageB2R = Number(
      //   parseFloat(
      //     (
      //       (Number(this.state.B21R) +
      //         Number(newValue) +
      //         Number(this.state.B23R)) /
      //       3
      //     ).toString()
      //   ).toFixed(2)
      // );
      this.setState({ B2RR: AverageB2R });
      //this.setState({ B2DD: AverageB2R - this.state.B2EE });
      this.setState({
        B2DD: Number(
          parseFloat(Number(AverageB2R - this.state.B2EE).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "B23R") {
      this.setState({ B23R: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblB23ED =
        Number(newValue == "NA" ? 0 : newValue) -
        Number(this.resetNAValue(this.state.B23E));
      this.setState({ B23D: vallblB23ED });
      AverageB2R = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.B21R)),
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.B22R)),
          0,
          0
        )
      );
      //! AverageB2R = Number(
      //   parseFloat(
      //     (
      //       (Number(this.state.B21R) +
      //         Number(newValue) +
      //         Number(this.state.B22R)) /
      //       3
      //     ).toString()
      //   ).toFixed(2)
      // );
      this.setState({ B2RR: AverageB2R });
      //this.setState({ B2DD: AverageB2R - this.state.B2EE });
      this.setState({
        B2DD: Number(
          parseFloat(Number(AverageB2R - this.state.B2EE).toString()).toFixed(2)
        ),
      });
    }
    let B2E = Number(
      parseFloat(
        (
          (Number(AverageB2E) +
            Number(this.state.B1EE) +
            Number(this.state.B3EE) +
            Number(this.state.B4EE)) /
          ((AverageB2E != 0 ? 1 : 0) +
            (this.state.B1EE != 0 ? 1 : 0) +
            (this.state.B3EE != 0 ? 1 : 0) +
            (this.state.B4EE != 0 ? 1 : 0))
        ).toString()
      ).toFixed(2)
    );
    B2E = isNaN(B2E) ? 0 : B2E;
    let B2R = Number(
      parseFloat(
        (
          (Number(AverageB2R) +
            Number(this.state.B1RR) +
            Number(this.state.B3RR) +
            Number(this.state.B4RR)) /
          ((AverageB2R != 0 ? 1 : 0) +
            (this.state.B1RR != 0 ? 1 : 0) +
            (this.state.B3RR != 0 ? 1 : 0) +
            (this.state.B4RR != 0 ? 1 : 0))
        ).toString()
      ).toFixed(2)
    );
    B2R = isNaN(B2R) ? 0 : B2R;
    this.setState({ BAvgEE: B2E });
    this.setState({ BAvgER: B2R });
    this.setState({
      SctionTotalBD: Number(
        parseFloat(Number(B2R - B2E).toString()).toFixed(2)
      ),
    });
  }
  private onChangeB3(newValue: string, TRValue: string): void {
    debugger;
    let AverageB3E = 0;
    let AverageB3R = 0;
    let ctdNewValue = this.props.Options.filter((e) => e.text === newValue)[0]
      .key;
    console.log(this.props.Options);
    // newValue = newValue === "NA" || newValue === "" ? "0" : newValue;
    if (TRValue == "B31E") {
      this.setState({ B31E: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblB31D =
        Number(this.resetNAValue(this.state.B31R)) -
        Number(newValue == "NA" ? 0 : newValue);
      this.setState({ B31D: vallblB31D });
      AverageB3E = Number(
        this.getAverageCalculation(
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.B32E)),
          Number(this.resetNAValue(this.state.B33E)),
          0,
          0
        )
      );
      //! AverageB3E = Number(
      //   parseFloat(
      //     (
      //       (Number(newValue) +
      //         Number(this.resetNAValue(this.state.B32E)) +
      //         Number(this.resetNAValue(this.state.B33E))) /
      //       3
      //     ).toString()
      //   ).toFixed(2)
      // );
      this.setState({ B3EE: AverageB3E });
      // let valB31ED = (Number(vallblB31D) + Number(this.state.B32D) + Number(this.state.B33D)) / 3;
      // valB31ED = Number(parseFloat(valB31ED.toString()).toFixed(2));
      // this.setState({ B3DD: valB31ED });
      // this.setState({ B3DD: this.state.B3RR - AverageB3E });
      this.setState({
        B3DD: Number(
          parseFloat(Number(this.state.B3RR - AverageB3E).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "B32E") {
      this.setState({ B32E: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblB32D =
        Number(this.resetNAValue(this.state.B32R)) -
        Number(newValue == "NA" ? 0 : newValue);
      this.setState({ B32D: vallblB32D });
      AverageB3E = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.B31E)),
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.B33E)),
          0,
          0
        )
      );
      //! AverageB3E = Number(
      //   parseFloat(
      //     (
      //       (Number(this.resetNAValue(this.state.B31E)) +
      //         Number(newValue) +
      //         Number(this.resetNAValue(this.state.B33E))) /
      //       3
      //     ).toString()
      //   ).toFixed(2)
      // );
      this.setState({ B3EE: AverageB3E });
      // let valB32ED = (Number(this.state.B31D) + Number(vallblB32D) + Number(this.state.B33D)) / 3;
      // valB32ED = Number(parseFloat(valB32ED.toString()).toFixed(2));
      //this.setState({ B3DD: valB32ED });
      this.setState({
        B3DD: Number(
          parseFloat(Number(this.state.B3RR - AverageB3E).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "B33E") {
      this.setState({ B33E: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblB33D =
        Number(this.resetNAValue(this.state.B33R)) -
        Number(newValue == "NA" ? 0 : newValue);
      this.setState({ B33D: vallblB33D });
      AverageB3E = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.B31E)),
          Number(this.resetNAValue(this.state.B32E)),
          Number(newValue === "NA" ? "0.5" : newValue),
          0,
          0
        )
      );
      //! AverageB3E = Number(
      //   parseFloat(
      //     (
      //       (Number(this.resetNAValue(this.state.B31E)) +
      //         Number(this.resetNAValue(this.state.B32E)) +
      //         Number(newValue)) /
      //       3
      //     ).toString()
      //   ).toFixed(2)
      // );
      this.setState({ B3EE: AverageB3E });
      // let valB33ED = (Number(this.state.B31D) + Number(vallblB33D) + Number(this.state.B32D)) / 3;
      // valB33ED = Number(parseFloat(valB33ED.toString()).toFixed(2));
      // this.setState({ B3DD: valB33ED });
      this.setState({
        B3DD: Number(
          parseFloat(Number(this.state.B3RR - AverageB3E).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "B31R") {
      this.setState({ B31R: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblB31ED =
        Number(newValue == "NA" ? 0 : newValue) -
        Number(this.resetNAValue(this.state.B31E));
      this.setState({ B31D: vallblB31ED });
      AverageB3R = Number(
        this.getAverageCalculation(
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.B32R)),
          Number(this.resetNAValue(this.state.B33R)),
          0,
          0
        )
      );
      //! AverageB3R = Number(
      //   parseFloat(
      //     (
      //       (Number(newValue) +
      //         Number(this.state.B32R) +
      //         Number(this.state.B33R)) /
      //       3
      //     ).toString()
      //   ).toFixed(2)
      // );
      this.setState({ B3RR: Number(AverageB3R) });
      //   let valB31RD = (Number(vallblB31ED) + Number(this.state.B32D) + Number(this.state.B33D)) / 3;
      //   valB31RD = Number(parseFloat(valB31RD.toString()).toFixed(2));
      //  // this.setState({ B3DD: valB31RD });
      //  this.setState({ B3DD: AverageB3R - this.state.B3EE});
      this.setState({
        B3DD: Number(
          parseFloat(Number(AverageB3R - this.state.B3EE).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "B32R") {
      this.setState({ B32R: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblB32ED =
        Number(newValue == "NA" ? 0 : newValue) -
        Number(this.resetNAValue(this.state.B32E));
      this.setState({ B32D: vallblB32ED });
      AverageB3R = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.B31R)),
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.B33R)),
          0,
          0
        )
      );
      //! AverageB3R = Number(
      //   parseFloat(
      //     (
      //       (Number(this.state.B31R) +
      //         Number(newValue) +
      //         Number(this.state.B33R)) /
      //       3
      //     ).toString()
      //   ).toFixed(2)
      // );
      this.setState({ B3RR: AverageB3R });
      //   let valB32RD = (Number(this.state.B31D) + Number(vallblB32ED) + Number(this.state.B33D)) / 2;
      //   valB32RD = Number(parseFloat(valB32RD.toString()).toFixed(2));
      //  // this.setState({ B3DD: valB32RD });
      //  this.setState({ B3DD: AverageB3R - this.state.B3EE});
      this.setState({
        B3DD: Number(
          parseFloat(Number(AverageB3R - this.state.B3EE).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "B33R") {
      this.setState({ B33R: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblB33ED =
        Number(newValue == "NA" ? 0 : newValue) -
        Number(this.resetNAValue(this.state.B33E));
      this.setState({ B33D: vallblB33ED });
      AverageB3R = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.B31R)),
          Number(this.resetNAValue(this.state.B32R)),
          Number(newValue === "NA" ? "0.5" : newValue),
          0,
          0
        )
      );
      //! AverageB3R = Number(
      //   parseFloat(
      //     (
      //       (Number(this.state.B31R) +
      //         Number(this.state.B32R) +
      //         Number(newValue)) /
      //       3
      //     ).toString()
      //   ).toFixed(2)
      // );
      this.setState({ B3RR: AverageB3R });
      //   let valB33RD = (Number(this.state.B31D) + Number(this.state.B33D) + Number(vallblB33ED)) / 3;
      //   valB33RD = Number(parseFloat(valB33RD.toString()).toFixed(2));
      //  // this.setState({ B3DD: valB33RD });
      //  this.setState({ B3DD: AverageB3R - this.state.B3EE});
      this.setState({
        B3DD: Number(
          parseFloat(Number(AverageB3R - this.state.B3EE).toString()).toFixed(2)
        ),
      });
    }

    let B3E = Number(
      parseFloat(
        (
          (Number(AverageB3E) +
            Number(this.state.B1EE) +
            Number(this.state.B2EE) +
            Number(this.state.B4EE)) /
          ((AverageB3E != 0 ? 1 : 0) +
            (this.state.B1EE != 0 ? 1 : 0) +
            (this.state.B2EE != 0 ? 1 : 0) +
            (this.state.B4EE != 0 ? 1 : 0))
        ).toString()
      ).toFixed(2)
    );
    B3E = isNaN(B3E) ? 0 : B3E;
    let B3R = Number(
      parseFloat(
        (
          (Number(AverageB3R) +
            Number(this.state.B1RR) +
            Number(this.state.B2RR) +
            Number(this.state.B4RR)) /
          ((AverageB3R != 0 ? 1 : 0) +
            (this.state.B1RR != 0 ? 1 : 0) +
            (this.state.B2RR != 0 ? 1 : 0) +
            (this.state.B4RR != 0 ? 1 : 0))
        ).toString()
      ).toFixed(2)
    );
    B3R = isNaN(B3R) ? 0 : B3R;
    this.setState({ BAvgEE: B3E });
    this.setState({ BAvgER: B3R });
    //this.setState({ SctionTotalBD: B3R - B3E });
    this.setState({
      SctionTotalBD: Number(
        parseFloat(Number(B3R - B3E).toString()).toFixed(2)
      ),
    });
  }
  private onChangeB4(newValue: string, TRValue: string): void {
    debugger;
    let AverageB4E = 0;
    let AverageB4R = 0;
    let ctdNewValue = this.props.Options.filter((e) => e.text === newValue)[0]
      .key;
    console.log(this.props.Options);
    // newValue = newValue === "NA" || newValue === "" ? "0" : newValue;
    if (TRValue == "B41E") {
      this.setState({ B41E: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblB41D =
        Number(this.resetNAValue(this.state.B41R)) -
        Number(newValue == "NA" ? 0 : newValue);
      this.setState({ B41D: vallblB41D });
      AverageB4E = Number(
        this.getAverageCalculation(
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.B42E)),
          Number(this.resetNAValue(this.state.B43E)),
          0,
          0
        )
      );
      //! AverageB4E = Number(
      //   parseFloat(
      //     (
      //       (Number(newValue) +
      //         Number(this.resetNAValue(this.state.B42E)) +
      //         Number(this.resetNAValue(this.state.B43E))) /
      //       3
      //     ).toString()
      //   ).toFixed(2)
      // );
      this.setState({ B4EE: AverageB4E });
      // let valB41ED = (Number(vallblB41D) + Number(this.state.B42D) + Number(this.state.B43D)) / 3;
      // valB41ED = Number(parseFloat(valB41ED.toString()).toFixed(2));
      // this.setState({ B4DD: valB41ED });
      // this.setState({ B4DD: this.state.B4RR - AverageB4E });
      this.setState({
        B4DD: Number(
          parseFloat(Number(this.state.B4RR - AverageB4E).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "B42E") {
      this.setState({ B42E: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblB42D =
        Number(this.resetNAValue(this.state.B42R)) -
        Number(newValue == "NA" ? 0 : newValue);
      this.setState({ B42D: vallblB42D });
      AverageB4E = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.B41E)),
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.B43E)),
          0,
          0
        )
      );
      //! AverageB4E = Number(
      //   parseFloat(
      //     (
      //       (Number(this.resetNAValue(this.state.B41E)) +
      //         Number(newValue) +
      //         Number(this.resetNAValue(this.state.B43E))) /
      //       3
      //     ).toString()
      //   ).toFixed(2)
      // );
      this.setState({ B4EE: AverageB4E });
      // let valB42ED = (Number(this.state.B41D) + Number(vallblB42D) + Number(this.state.B43D)) / 3;
      // valB42ED = Number(parseFloat(valB42ED.toString()).toFixed(2));
      //this.setState({ B4DD: valB42ED });
      //this.setState({ B4DD: this.state.B4RR - AverageB4E });
      this.setState({
        B4DD: Number(
          parseFloat(Number(this.state.B4RR - AverageB4E).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "B43E") {
      this.setState({ B43E: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblB43D =
        Number(this.resetNAValue(this.state.B43R)) -
        Number(newValue == "NA" ? 0 : newValue);
      this.setState({ B43D: vallblB43D });
      AverageB4E = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.B41E)),
          Number(this.resetNAValue(this.state.B42E)),
          Number(newValue === "NA" ? "0.5" : newValue),
          0,
          0
        )
      );
      //! AverageB4E = Number(
      //   parseFloat(
      //     (
      //       (Number(this.resetNAValue(this.state.B41E)) +
      //         Number(this.resetNAValue(this.state.B42E)) +
      //         Number(newValue)) /
      //       3
      //     ).toString()
      //   ).toFixed(2)
      // );
      this.setState({ B4EE: AverageB4E });
      // let valB43ED = (Number(this.state.B41D) + Number(vallblB43D) + Number(this.state.B42D)) / 3;
      // valB43ED = Number(parseFloat(valB43ED.toString()).toFixed(2));
      // this.setState({ B4DD: valB43ED });
      // this.setState({ B4DD: this.state.B4RR - AverageB4E });
      this.setState({
        B4DD: Number(
          parseFloat(Number(this.state.B4RR - AverageB4E).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "B41R") {
      this.setState({ B41R: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblB41ED =
        Number(newValue == "NA" ? 0 : newValue) -
        Number(this.resetNAValue(this.state.B41E));
      this.setState({ B41D: vallblB41ED });
      AverageB4R = Number(
        this.getAverageCalculation(
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.B42R)),
          Number(this.resetNAValue(this.state.B43R)),
          0,
          0
        )
      );
      //! AverageB4R = Number(
      //   parseFloat(
      //     (
      //       (Number(newValue) +
      //         Number(this.state.B42R) +
      //         Number(this.state.B43R)) /
      //       3
      //     ).toString()
      //   ).toFixed(2)
      // );
      this.setState({ B4RR: Number(AverageB4R) });
      // let valB41RD = (Number(vallblB41ED) + Number(this.state.B42D) + Number(this.state.B43D)) / 3;
      // valB41RD = Number(parseFloat(valB41RD.toString()).toFixed(2));
      // this.setState({ B4DD: valB41RD });
      // this.setState({ B4DD: AverageB4R - this.state.B4EE});
      this.setState({
        B4DD: Number(
          parseFloat(Number(AverageB4R - this.state.B4EE).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "B42R") {
      this.setState({ B42R: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblB42ED =
        Number(newValue == "NA" ? 0 : newValue) -
        Number(this.resetNAValue(this.state.B42E));
      this.setState({ B42D: vallblB42ED });
      AverageB4R = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.B41R)),
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.B43R)),
          0,
          0
        )
      );
      //! AverageB4R = Number(
      //   parseFloat(
      //     (
      //       (Number(this.state.B41R) +
      //         Number(newValue) +
      //         Number(this.state.B43R)) /
      //       3
      //     ).toString()
      //   ).toFixed(2)
      // );
      this.setState({ B4RR: AverageB4R });
      // let valB42RD = (Number(this.state.B41D) + Number(vallblB42ED) + Number(this.state.B43D)) / 2;
      // valB42RD = Number(parseFloat(valB42RD.toString()).toFixed(2));
      // this.setState({ B4DD: valB42RD });
      //this.setState({ B4DD: AverageB4R - this.state.B4EE});
      this.setState({
        B4DD: Number(
          parseFloat(Number(AverageB4R - this.state.B4EE).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "B43R") {
      this.setState({ B43R: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblB43ED =
        Number(newValue == "NA" ? 0 : newValue) -
        Number(this.resetNAValue(this.state.B43E));
      this.setState({ B43D: vallblB43ED });
      AverageB4R = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.B41R)),
          Number(this.resetNAValue(this.state.B42R)),
          Number(newValue === "NA" ? "0.5" : newValue),
          0,
          0
        )
      );
      //! AverageB4R = Number(
      //   parseFloat(
      //     (
      //       (Number(this.state.B41R) +
      //         Number(this.state.B42R) +
      //         Number(newValue)) /
      //       3
      //     ).toString()
      //   ).toFixed(2)
      // );
      this.setState({ B4RR: AverageB4R });
      // let valB43RD = (Number(this.state.B41D) + Number(this.state.B43D) + Number(vallblB43ED)) / 3;
      // valB43RD = Number(parseFloat(valB43RD.toString()).toFixed(2));
      // this.setState({ B4DD: valB43RD });
      //this.setState({ B4DD: AverageB4R - this.state.B4EE});
      this.setState({
        B4DD: Number(
          parseFloat(Number(AverageB4R - this.state.B4EE).toString()).toFixed(2)
        ),
      });
    }
    //this.setState({ BAvgEE: Number(parseFloat(((Number(AverageB4E) + Number(this.state.B1EE) + Number(this.state.B3EE) + Number(this.state.B2EE)) / 4).toString()).toFixed(2)) });
    //this.setState({ BAvgER: Number(parseFloat(((Number(AverageB4R) + Number(this.state.B1RR) + Number(this.state.B3RR) + Number(this.state.B2RR)) / 4).toString()).toFixed(2)) });
    let B4E = Number(
      parseFloat(
        (
          (Number(AverageB4E) +
            Number(this.state.B1EE) +
            Number(this.state.B3EE) +
            Number(this.state.B2EE)) /
          ((AverageB4E != 0 ? 1 : 0) +
            (this.state.B1EE != 0 ? 1 : 0) +
            (this.state.B3EE != 0 ? 1 : 0) +
            (this.state.B2EE != 0 ? 1 : 0))
        ).toString()
      ).toFixed(2)
    );
    B4E = isNaN(B4E) ? 0 : B4E;
    let B4R = Number(
      parseFloat(
        (
          (Number(AverageB4R) +
            Number(this.state.B1RR) +
            Number(this.state.B3RR) +
            Number(this.state.B2RR)) /
          ((AverageB4R != 0 ? 1 : 0) +
            (this.state.B1RR != 0 ? 1 : 0) +
            (this.state.B3RR != 0 ? 1 : 0) +
            (this.state.B2RR != 0 ? 1 : 0))
        ).toString()
      ).toFixed(2)
    );
    B4R = isNaN(B4R) ? 0 : B4R;
    this.setState({ BAvgEE: B4E });
    this.setState({ BAvgER: B4R });
    //this.setState({ SctionTotalBD: B4R - B4E });
    this.setState({
      SctionTotalBD: Number(
        parseFloat(Number(B4R - B4E).toString()).toFixed(2)
      ),
    });
  }

  private onChangeC1(newValue: string, TRValue: string): void {
    debugger;
    let AverageC1E = 0;
    let AverageC1R = 0;
    let ctdNewValue = this.props.Options.filter((e) => e.text === newValue)[0]
      .key;
    console.log(this.props.Options);
    // newValue = newValue === "NA" || newValue === "" ? "0" : newValue;
    if (TRValue == "C11E") {
      this.setState({ C11E: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblC11D =
        Number(this.resetNAValue(this.state.C11R)) -
        Number(newValue == "NA" ? 0 : newValue);
      this.setState({ C11D: vallblC11D });
      AverageC1E = Number(
        this.getAverageCalculation(
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.C12E)),
          Number(this.resetNAValue(this.state.C13E)),
          0,
          0
        )
      );
      //! AverageC1E = Number(
      //   parseFloat(
      //     (
      //       (Number(newValue) +
      //         Number(this.resetNAValue(this.state.C12E)) +
      //         Number(this.resetNAValue(this.state.C13E))) /
      //       3
      //     ).toString()
      //   ).toFixed(2)
      // );
      this.setState({ C1EE: AverageC1E });
      // let valC11ED = (Number(vallblC11D) + Number(this.state.C12D) + Number(this.state.C13D)) / 3;
      // valC11ED = Number(parseFloat(valC11ED.toString()).toFixed(2));
      // this.setState({ C1DD: valC11ED });

      this.setState({
        C1DD: Number(
          parseFloat(Number(this.state.C1RR - AverageC1E).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "C12E") {
      this.setState({ C12E: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblC12D =
        Number(this.resetNAValue(this.state.C12R)) -
        Number(newValue == "NA" ? 0 : newValue);
      this.setState({ C12D: vallblC12D });
      AverageC1E = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.C11E)),
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.C13E)),
          0,
          0
        )
      );
      //! AverageC1E = Number(
      //   parseFloat(
      //     (
      //       (Number(this.resetNAValue(this.state.C11E)) +
      //         Number(newValue) +
      //         Number(this.resetNAValue(this.state.C13E))) /
      //       3
      //     ).toString()
      //   ).toFixed(2)
      // );
      this.setState({ C1EE: AverageC1E });
      // let valC12ED = (Number(this.state.C11D) + Number(vallblC12D) + Number(this.state.C13D)) / 3;
      // valC12ED = Number(parseFloat(valC12ED.toString()).toFixed(2));
      // this.setState({ C1DD: valC12ED });
      this.setState({
        C1DD: Number(
          parseFloat(Number(this.state.C1RR - AverageC1E).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "C13E") {
      this.setState({ C13E: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblC13D =
        Number(this.resetNAValue(this.state.C13R)) -
        Number(newValue == "NA" ? 0 : newValue);
      this.setState({ C13D: vallblC13D });
      AverageC1E = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.C11E)),
          Number(this.resetNAValue(this.state.C12E)),
          Number(newValue === "NA" ? "0.5" : newValue),
          0,
          0
        )
      );
      // AverageC1E = Number(
      //   parseFloat(
      //     (
      //       (Number(this.resetNAValue(this.state.C11E)) +
      //         Number(this.resetNAValue(this.state.C12E)) +
      //         Number(newValue)) /
      //       3
      //     ).toString()
      //   ).toFixed(2)
      // );
      this.setState({ C1EE: AverageC1E });
      // let valC13ED = (Number(this.state.C11D) + Number(vallblC13D) + Number(this.state.C12D)) / 3;
      // valC13ED = Number(parseFloat(valC13ED.toString()).toFixed(2));
      // this.setState({ C1DD: valC13ED });
      this.setState({
        C1DD: Number(
          parseFloat(Number(this.state.C1RR - AverageC1E).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "C11R") {
      this.setState({ C11R: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblC11ED =
        Number(newValue == "NA" ? 0 : newValue) -
        Number(this.resetNAValue(this.state.C11E));
      this.setState({ C11D: vallblC11ED });
      AverageC1R = Number(
        this.getAverageCalculation(
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.C12R)),
          Number(this.resetNAValue(this.state.C13R)),
          0,
          0
        )
      );
      //! AverageC1R = Number(
      //   parseFloat(
      //     (
      //       (Number(newValue) +
      //         Number(this.state.C12R) +
      //         Number(this.state.C13R)) /
      //       3
      //     ).toString()
      //   ).toFixed(2)
      // );
      this.setState({ C1RR: Number(AverageC1R) });
      // let valC11RD = (Number(vallblC11ED) + Number(this.state.C12D) + Number(this.state.C13D)) / 3;
      // valC11RD = Number(parseFloat(valC11RD.toString()).toFixed(2));
      // this.setState({ C1DD: valC11RD });

      //this.setState({ C1DD: AverageC1R - this.state.C1EE});
      this.setState({
        C1DD: Number(
          parseFloat(Number(AverageC1R - this.state.C1EE).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "C12R") {
      this.setState({ C12R: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblC12ED =
        Number(newValue == "NA" ? 0 : newValue) -
        Number(this.resetNAValue(this.state.C12E));
      this.setState({ C12D: vallblC12ED });
      AverageC1R = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.C11R)),
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.C13R)),
          0,
          0
        )
      );
      //! AverageC1R = Number(
      //   parseFloat(
      //     (
      //       (Number(this.state.C11R) +
      //         Number(newValue) +
      //         Number(this.state.C13R)) /
      //       3
      //     ).toString()
      //   ).toFixed(2)
      // );
      this.setState({ C1RR: AverageC1R });
      // let valC12RD = (Number(this.state.C11D) + Number(vallblC12ED) + Number(this.state.C13D)) / 2;
      // valC12RD = Number(parseFloat(valC12RD.toString()).toFixed(2));
      // this.setState({ C1DD: valC12RD });
      this.setState({
        C1DD: Number(
          parseFloat(Number(AverageC1R - this.state.C1EE).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "C13R") {
      this.setState({ C13R: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblC13ED =
        Number(newValue == "NA" ? 0 : newValue) -
        Number(this.resetNAValue(this.state.C13E));
      this.setState({ C13D: vallblC13ED });
      AverageC1R = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.C11R)),
          Number(this.resetNAValue(this.state.C12R)),
          Number(newValue === "NA" ? "0.5" : newValue),
          0,
          0
        )
      );
      //! AverageC1R = Number(
      //   parseFloat(
      //     (
      //       (Number(this.state.C11R) +
      //         Number(this.state.C12R) +
      //         Number(newValue)) /
      //       3
      //     ).toString()
      //   ).toFixed(2)
      // );
      this.setState({ C1RR: AverageC1R });
      // let valC13RD = (Number(this.state.C11D) + Number(this.state.C13D) + Number(vallblC13ED)) / 3;
      // valC13RD = Number(parseFloat(valC13RD.toString()).toFixed(2));
      // this.setState({ C1DD: valC13RD });

      this.setState({
        C1DD: Number(
          parseFloat(Number(AverageC1R - this.state.C1EE).toString()).toFixed(2)
        ),
      });
    }

    let C1E = Number(
      parseFloat(
        (
          (Number(AverageC1E) +
            Number(this.state.C2EE) +
            Number(this.state.C3EE)) /
          ((AverageC1E != 0 ? 1 : 0) +
            (this.state.C2EE != 0 ? 1 : 0) +
            (this.state.C3EE != 0 ? 1 : 0))
        ).toString()
      ).toFixed(2)
    );
    C1E = isNaN(C1E) ? 0 : C1E;
    let C1R = Number(
      parseFloat(
        (
          (Number(AverageC1R) +
            Number(this.state.C2RR) +
            Number(this.state.C3RR)) /
          ((AverageC1R != 0 ? 1 : 0) +
            (this.state.C2RR != 0 ? 1 : 0) +
            (this.state.C3RR != 0 ? 1 : 0))
        ).toString()
      ).toFixed(2)
    );
    C1R = isNaN(C1R) ? 0 : C1R;
    this.setState({ CAvgEE: C1E });
    this.setState({ CAvgER: C1R });
    //this.setState({ SctionTotalCD: C1R - C1E });
    this.setState({
      SctionTotalCD: Number(
        parseFloat(Number(C1R - C1E).toString()).toFixed(2)
      ),
    });
  }
  private onChangeC2(newValue: string, TRValue: string): void {
    debugger;
    let AverageC2E = 0;
    let AverageC2R = 0;
    let ctdNewValue = this.props.Options.filter((e) => e.text === newValue)[0]
      .key;
    console.log(this.props.Options);
    // newValue = newValue === "NA" || newValue === "" ? "0" : newValue;
    if (TRValue == "C21E") {
      this.setState({ C21E: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblC21D =
        Number(this.resetNAValue(this.state.C21R)) -
        Number(newValue == "NA" ? 0 : newValue);
      this.setState({ C21D: vallblC21D });
      AverageC2E = Number(
        this.getAverageCalculation(
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.C22E)),
          Number(this.resetNAValue(this.state.C23E)),
          Number(this.resetNAValue(this.state.C24E)),
          0
        )
      );
      //! AverageC2E =
      //   (Number(newValue) +
      //     Number(this.resetNAValue(this.state.C22E)) +
      //     Number(this.resetNAValue(this.state.C23E)) +
      //     Number(this.resetNAValue(this.state.C24E))) /
      //   4;
      this.setState({ C2EE: AverageC2E });
      // let valC21ED = (Number(vallblC21D) + Number(this.state.C22D) + Number(this.state.C23D) + Number(this.state.C24D)) / 4;
      // this.setState({ C2DD: valC21ED });
      // this.setState({ C2DD: this.state.C2RR - AverageC2E });
      this.setState({
        C2DD: Number(
          parseFloat(Number(this.state.C2RR - AverageC2E).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "C22E") {
      this.setState({ C22E: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblC22D =
        Number(this.resetNAValue(this.state.C22R)) -
        Number(newValue == "NA" ? 0 : newValue);
      this.setState({ C22D: vallblC22D });
      AverageC2E = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.C21E)),
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.C23E)),
          Number(this.resetNAValue(this.state.C24E)),
          0
        )
      );
      //! AverageC2E =
      //   (Number(this.resetNAValue(this.state.C21E)) +
      //     Number(newValue) +
      //     Number(this.resetNAValue(this.state.C23E)) +
      //     Number(this.resetNAValue(this.state.C24E))) /
      //   4;
      this.setState({ C2EE: AverageC2E });
      // let valC22ED = (Number(this.state.C22D) + Number(vallblC22D) + Number(this.state.C23D) + Number(this.state.C24D)) / 4;
      // this.setState({ C2DD: valC22ED });
      // this.setState({ C2DD: this.state.C2RR - AverageC2E });
      this.setState({
        C2DD: Number(
          parseFloat(Number(this.state.C2RR - AverageC2E).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "C23E") {
      this.setState({ C23E: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblC23D =
        Number(this.resetNAValue(this.state.C23R)) -
        Number(newValue == "NA" ? 0 : newValue);
      this.setState({ C23D: vallblC23D });
      AverageC2E = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.C21E)),
          Number(this.resetNAValue(this.state.C22E)),
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.C24E)),
          0
        )
      );
      //! AverageC2E =
      //   (Number(this.resetNAValue(this.state.C21E)) +
      //     Number(this.resetNAValue(this.state.C22E)) +
      //     Number(newValue) +
      //     Number(this.resetNAValue(this.state.C24E))) /
      //   4;
      this.setState({ C2EE: AverageC2E });
      // let valC23ED = (Number(this.state.C21D) + Number(this.state.C22D) + Number(vallblC23D) + Number(this.state.C24D)) / 4;
      // this.setState({ C2DD: valC23ED });
      // this.setState({ C2DD: this.state.C2RR - AverageC2E });
      this.setState({
        C2DD: Number(
          parseFloat(Number(this.state.C2RR - AverageC2E).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "C24E") {
      this.setState({ C24E: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblC24D =
        Number(this.resetNAValue(this.state.C24R)) -
        Number(newValue == "NA" ? 0 : newValue);
      this.setState({ C24D: vallblC24D });
      AverageC2E = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.C21E)),
          Number(this.resetNAValue(this.state.C22E)),
          Number(this.resetNAValue(this.state.C23E)),
          Number(newValue === "NA" ? "0.5" : newValue),
          0
        )
      );
      //! AverageC2E =
      //   (Number(this.resetNAValue(this.state.C21E)) +
      //     Number(this.resetNAValue(this.state.C22E)) +
      //     Number(this.resetNAValue(this.state.C23E)) +
      //     Number(newValue)) /
      //   4;
      this.setState({ C2EE: AverageC2E });
      // let valC24ED = (Number(this.state.C21D) + Number(this.state.C22D) + Number(this.state.C23D) + Number(vallblC24D)) / 4;
      // this.setState({ C2DD: valC24ED });
      // this.setState({ C2DD: this.state.C2RR - AverageC2E });
      this.setState({
        C2DD: Number(
          parseFloat(Number(this.state.C2RR - AverageC2E).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "C21R") {
      this.setState({ C21R: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblC21ED =
        Number(newValue == "NA" ? 0 : newValue) -
        Number(this.resetNAValue(this.state.C21E));
      this.setState({ C21D: vallblC21ED });
      AverageC2R = Number(
        this.getAverageCalculation(
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.C22R)),
          Number(this.resetNAValue(this.state.C23R)),
          Number(this.resetNAValue(this.state.C24R)),
          0
        )
      );
      //! AverageC2R =
      //   (Number(newValue) +
      //     Number(this.state.C22R) +
      //     Number(this.state.C23R) +
      //     Number(this.state.C24R)) /
      //   4;
      this.setState({ C2RR: AverageC2R });
      // let valC21RD = (Number(vallblC21ED) + Number(this.state.C22D) + Number(this.state.C23D) + Number(this.state.C24D)) / 4;
      // this.setState({ C2DD: valC21RD });

      // this.setState({ C2DD: AverageC2R - this.state.C2EE });
      this.setState({
        C2DD: Number(
          parseFloat(Number(AverageC2R - this.state.C2EE).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "C22R") {
      this.setState({ C22R: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblC22ED =
        Number(newValue == "NA" ? 0 : newValue) -
        Number(this.resetNAValue(this.state.C22E));

      this.setState({ C22D: vallblC22ED });
      AverageC2R = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.C21R)),
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.C23R)),
          Number(this.resetNAValue(this.state.C24R)),
          0
        )
      );
      //! AverageC2R =
      //   (Number(this.state.C21R) +
      //     Number(newValue) +
      //     Number(this.state.C23R) +
      //     Number(this.state.C24R)) /
      //   4;
      this.setState({ C2RR: AverageC2R });

      // let valC22RD = (Number(this.state.C21D) + Number(vallblC22ED) + Number(this.state.C23D) + Number(this.state.C24D)) / 4;
      // this.setState({ C2DD: valC22RD });
      // this.setState({ C2DD: AverageC2R - this.state.C2EE });
      this.setState({
        C2DD: Number(
          parseFloat(Number(AverageC2R - this.state.C2EE).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "C23R") {
      this.setState({ C23R: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblC23ED =
        Number(newValue == "NA" ? 0 : newValue) -
        Number(this.resetNAValue(this.state.C23E));
      this.setState({ C23D: vallblC23ED });
      AverageC2R = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.C21R)),
          Number(this.resetNAValue(this.state.C22R)),
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.C24R)),
          0
        )
      );
      //! AverageC2R =
      //   (Number(this.state.C21R) +
      //     Number(this.state.C22R) +
      //     Number(newValue) +
      //     Number(this.state.C24R)) /
      //   4;
      this.setState({ C2RR: AverageC2R });
      // let valC21RD = (Number(this.state.C21D) + Number(this.state.C22D) + Number(vallblC23ED) + Number(this.state.C24D)) / 4;
      // this.setState({ C2DD: valC21RD });
      // this.setState({ C2DD: AverageC2R - this.state.C2EE });
      this.setState({
        C2DD: Number(
          parseFloat(Number(AverageC2R - this.state.C2EE).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "C24R") {
      this.setState({ C24R: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblC24ED =
        Number(newValue == "NA" ? 0 : newValue) -
        Number(this.resetNAValue(this.state.C24E));
      this.setState({ C24D: vallblC24ED });
      AverageC2R = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.C21R)),
          Number(this.resetNAValue(this.state.C22R)),
          Number(this.resetNAValue(this.state.C23R)),
          Number(newValue === "NA" ? "0.5" : newValue),
          0
        )
      );
      //! AverageC2R =
      //   (Number(this.state.C21R) +
      //     Number(this.state.C22R) +
      //     Number(this.state.C23R) +
      //     Number(newValue)) /
      //   4;
      this.setState({ C2RR: AverageC2R });
      // let valC21RD = (Number(this.state.C21D) + Number(this.state.C22D) + Number(this.state.C23D) + Number(vallblC24ED)) / 4;
      // this.setState({ C2DD: valC21RD });
      // this.setState({ C2DD: AverageC2R - this.state.C2EE });
      this.setState({
        C2DD: Number(
          parseFloat(Number(AverageC2R - this.state.C2EE).toString()).toFixed(2)
        ),
      });
    } else {
    }
    //let SctionTotalAE = Number(parseFloat(((Number(AverageA3E) + Number(this.state.dropAverageA11E) + Number(this.state.dropAverageC2E)  )/3).toString()).toFixed(2));
    let C2E = Number(
      parseFloat(
        (
          (Number(AverageC2E) +
            Number(this.state.C1EE) +
            Number(this.state.C3EE)) /
          ((AverageC2E != 0 ? 1 : 0) +
            (this.state.C1EE != 0 ? 1 : 0) +
            (this.state.C3EE != 0 ? 1 : 0))
        ).toString()
      ).toFixed(2)
    );
    C2E = isNaN(C2E) ? 0 : C2E;
    let C2R = Number(
      parseFloat(
        (
          (Number(AverageC2R) +
            Number(this.state.C1RR) +
            Number(this.state.C3RR)) /
          ((AverageC2R != 0 ? 1 : 0) +
            (this.state.C1RR != 0 ? 1 : 0) +
            (this.state.C3RR != 0 ? 1 : 0))
        ).toString()
      ).toFixed(2)
    );
    C2R = isNaN(C2R) ? 0 : C2R;
    this.setState({ CAvgEE: C2E });
    this.setState({ CAvgER: C2R });
    // this.setState({ SctionTotalCD: C2R - C2E });
    this.setState({
      SctionTotalCD: Number(
        parseFloat(Number(C2R - C2E).toString()).toFixed(2)
      ),
    });
  }
  private onChangeC3(newValue: string, TRValue: string): void {
    debugger;
    let AverageC3E = 0;
    let AverageC3R = 0;
    let ctdNewValue = this.props.Options.filter((e) => e.text === newValue)[0]
      .key;
    console.log(this.props.Options);
    // newValue = newValue === "NA" || newValue === "" ? "0" : newValue;
    if (TRValue == "C31E") {
      this.setState({ C31E: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblC31D =
        Number(this.resetNAValue(this.state.C31R)) -
        Number(newValue == "NA" ? 0 : newValue);
      this.setState({ C31D: vallblC31D });
      AverageC3E = Number(
        this.getAverageCalculation(
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.C32E)),
          Number(this.resetNAValue(this.state.C33E)),
          0,
          0
        )
      );
      //! AverageC3E = Number(
      //   parseFloat(
      //     (
      //       (Number(newValue) +
      //         Number(this.resetNAValue(this.state.C32E)) +
      //         Number(this.resetNAValue(this.state.C33E))) /
      //       3
      //     ).toString()
      //   ).toFixed(2)
      // );
      this.setState({ C3EE: AverageC3E });
      // let valC31ED = (Number(vallblC31D) + Number(this.state.C32D) + Number(this.state.C33D)) / 3;
      // valC31ED = Number(parseFloat(valC31ED.toString()).toFixed(2));
      // this.setState({ C3DD: valC31ED });
      //this.setState({ C3DD: this.state.C3RR - AverageC3E});
      this.setState({
        C3DD: Number(
          parseFloat(Number(this.state.C3RR - AverageC3E).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "C32E") {
      this.setState({ C32E: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblC32D =
        Number(this.resetNAValue(this.state.C32R)) -
        Number(newValue == "NA" ? 0 : newValue);
      this.setState({ C32D: vallblC32D });
      AverageC3E = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.C31E)),
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.C33E)),
          0,
          0
        )
      );
      //! AverageC3E = Number(
      //   parseFloat(
      //     (
      //       (Number(this.resetNAValue(this.state.C31E)) +
      //         Number(newValue) +
      //         Number(this.resetNAValue(this.state.C33E))) /
      //       3
      //     ).toString()
      //   ).toFixed(2)
      // );
      this.setState({ C3EE: AverageC3E });
      // let valC32ED = (Number(this.state.C31D) + Number(vallblC32D) + Number(this.state.C33D)) / 3;
      // valC32ED = Number(parseFloat(valC32ED.toString()).toFixed(2));
      // this.setState({ C3DD: valC32ED });
      this.setState({
        C3DD: Number(
          parseFloat(Number(this.state.C3RR - AverageC3E).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "C33E") {
      this.setState({ C33E: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblC33D =
        Number(this.resetNAValue(this.state.C33R)) -
        Number(newValue == "NA" ? 0 : newValue);
      this.setState({ C33D: vallblC33D });
      AverageC3E = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.C31E)),
          Number(this.resetNAValue(this.state.C32E)),
          Number(newValue === "NA" ? "0.5" : newValue),
          0,
          0
        )
      );
      //! AverageC3E = Number(
      //   parseFloat(
      //     (
      //       (Number(this.resetNAValue(this.state.C31E)) +
      //         Number(this.resetNAValue(this.state.C32E)) +
      //         Number(newValue)) /
      //       3
      //     ).toString()
      //   ).toFixed(2)
      // );
      this.setState({ C3EE: AverageC3E });
      // let valC33ED = (Number(this.state.C31D) + Number(vallblC33D) + Number(this.state.C32D)) / 3;
      // valC33ED = Number(parseFloat(valC33ED.toString()).toFixed(2));
      // this.setState({ C3DD: valC33ED });
      this.setState({
        C3DD: Number(
          parseFloat(Number(this.state.C3RR - AverageC3E).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "C31R") {
      this.setState({ C31R: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblC31ED =
        Number(newValue == "NA" ? 0 : newValue) -
        Number(this.resetNAValue(this.state.C31E));
      this.setState({ C31D: vallblC31ED });
      AverageC3R = Number(
        this.getAverageCalculation(
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.C32R)),
          Number(this.resetNAValue(this.state.C33R)),
          0,
          0
        )
      );
      //! AverageC3R = Number(
      //   parseFloat(
      //     (
      //       (Number(newValue) +
      //         Number(this.state.C32R) +
      //         Number(this.state.C33R)) /
      //       3
      //     ).toString()
      //   ).toFixed(2)
      // );
      this.setState({ C3RR: Number(AverageC3R) });
      // let valC31RD = (Number(vallblC31ED) + Number(this.state.C32D) + Number(this.state.C33D)) / 3;
      // valC31RD = Number(parseFloat(valC31RD.toString()).toFixed(2));
      // this.setState({ C3DD: valC31RD });
      //this.setState({ C3DD: AverageC3R - this.state.C3EE });
      this.setState({
        C3DD: Number(
          parseFloat(Number(AverageC3R - this.state.C3EE).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "C32R") {
      this.setState({ C32R: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblC32ED =
        Number(newValue == "NA" ? 0 : newValue) -
        Number(this.resetNAValue(this.state.C32E));
      this.setState({ C32D: vallblC32ED });
      AverageC3R = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.C31R)),
          Number(newValue === "NA" ? "0.5" : newValue),
          Number(this.resetNAValue(this.state.C33R)),
          0,
          0
        )
      );
      //! AverageC3R = Number(
      //   parseFloat(
      //     (
      //       (Number(this.state.C31R) +
      //         Number(newValue) +
      //         Number(this.state.C33R)) /
      //       3
      //     ).toString()
      //   ).toFixed(2)
      // );
      this.setState({ C3RR: AverageC3R });
      // let valC32RD = (Number(this.state.C31D) + Number(vallblC32ED) + Number(this.state.C33D)) / 2;
      // valC32RD = Number(parseFloat(valC32RD.toString()).toFixed(2));
      // this.setState({ C3DD: valC32RD });
      this.setState({
        C3DD: Number(
          parseFloat(Number(AverageC3R - this.state.C3EE).toString()).toFixed(2)
        ),
      });
    } else if (TRValue == "C33R") {
      this.setState({ C33R: Number(newValue === "NA" ? "0.5" : newValue) });
      let vallblC33ED =
        Number(newValue == "NA" ? 0 : newValue) -
        Number(this.resetNAValue(this.state.C33E));
      this.setState({ C33D: vallblC33ED });
      AverageC3R = Number(
        this.getAverageCalculation(
          Number(this.resetNAValue(this.state.C31R)),
          Number(this.resetNAValue(this.state.C32R)),
          Number(newValue === "NA" ? "0.5" : newValue),
          0,
          0
        )
      );
      //! AverageC3R = Number(
      //   parseFloat(
      //     (
      //       (Number(this.state.C31R) +
      //         Number(this.state.C32R) +
      //         Number(newValue)) /
      //       3
      //     ).toString()
      //   ).toFixed(2)
      // );
      this.setState({ C3RR: AverageC3R });
      // let valC33RD = (Number(this.state.C31D) + Number(this.state.C33D) + Number(vallblC33ED)) / 3;
      // valC33RD = Number(parseFloat(valC33RD.toString()).toFixed(2));
      // this.setState({ C3DD: valC33RD });
      this.setState({
        C3DD: Number(
          parseFloat(Number(AverageC3R - this.state.C3EE).toString()).toFixed(2)
        ),
      });
    }
    let C3E = Number(
      parseFloat(
        (
          (Number(AverageC3E) +
            Number(this.state.C2EE) +
            Number(this.state.C1EE)) /
          ((AverageC3E != 0 ? 1 : 0) +
            (this.state.C2EE != 0 ? 1 : 0) +
            (this.state.C1EE != 0 ? 1 : 0))
        ).toString()
      ).toFixed(2)
    );
    C3E = isNaN(C3E) ? 0 : C3E;
    let C3R = Number(
      parseFloat(
        (
          (Number(AverageC3R) +
            Number(this.state.C2RR) +
            Number(this.state.C1RR)) /
          ((AverageC3R != 0 ? 1 : 0) +
            (this.state.C2RR != 0 ? 1 : 0) +
            (this.state.C1RR != 0 ? 1 : 0))
        ).toString()
      ).toFixed(2)
    );
    C3R = isNaN(C3R) ? 0 : C3R;
    this.setState({ CAvgEE: C3E });
    this.setState({ CAvgER: C3R });
    // this.setState({ SctionTotalCD: C3R - C3E });
    this.setState({
      SctionTotalCD: Number(
        parseFloat(Number(C3R - C3E).toString()).toFixed(2)
      ),
    });
  }

  private OnchangeOverallPerformance(newValue: string): void {
    this.setState({
      OverallPerformance: Number(newValue === "NA" ? "0.5" : newValue),
    });
  }

  private onChangeE1EE(event): void {
    //this.setState({ E1EE: newValue,});
    let curretState = this.state.ApepiDetails;
    curretState.E1EE = event.target.value;
    this.onFormTextFieldValueChange(curretState);
  }
  private onChangeE1ER(event): void {
    //this.setState({ E1ER: newValue,});
    let curretState = this.state.ApepiDetails;
    curretState.E1ER = event.target.value;
    this.onFormTextFieldValueChange(curretState);
  }
  private onChangeF1EE(event): void {
    //this.setState({ F1EE: newValue,});
    let curretState = this.state.ApepiDetails;
    curretState.F1EE = event.target.value;
    this.onFormTextFieldValueChange(curretState);
  }
  private onChangeF1ER(event): void {
    //this.setState({ F1ER: newValue,});
    let curretState = this.state.ApepiDetails;
    curretState.F1ER = event.target.value;
    this.onFormTextFieldValueChange(curretState);
  }
  private onChangeG1EE(event): void {
    //this.setState({ G1EE: newValue,});
    let curretState = this.state.ApepiDetails;
    curretState.G1EE = event.target.value;
    this.onFormTextFieldValueChange(curretState);
  }
  private onChangeG1ER(event): void {
    //this.setState({ G1ER: newValue,});
    let curretState = this.state.ApepiDetails;
    curretState.G1ER = event.target.value;
    this.onFormTextFieldValueChange(curretState);
  }
  private onChangeH1EE(event): void {
    //this.setState({ H1EE: newValue,});
    let curretState = this.state.ApepiDetails;
    curretState.H1EE = event.target.value;
    this.onFormTextFieldValueChange(curretState);
  }
  private onChangeH1ER(event): void {
    //this.setState({ H1ER: newValue,});
    let curretState = this.state.ApepiDetails;
    curretState.H1ER = event.target.value;
    this.onFormTextFieldValueChange(curretState);
  }
  private onChangeH1EL(event): void {
    //this.setState({ H1ER: newValue,});
    let curretState = this.state.ApepiDetails;
    curretState.H1EL = event.target.value;
    this.onFormTextFieldValueChange(curretState);
  }
  private onChangeAcknowledgement(event): void {
    debugger;
    //this.setState({ H1ER: newValue,});
    let curretState = this.state.ApepiDetails;
    curretState.AcknowledgementComments = event.target.value;
    this.onFormTextFieldValueChange(curretState);
  }
  private onChangeRevertToReviewee(event): void {
    //this.setState({ H1ER: newValue,});
    let curretState = this.state.ApepiDetails;
    curretState.RevertToReviewee = event.target.value;
    this.onFormTextFieldValueChange(curretState);
  }
  private onChangeRevertToReviewer(event): void {
    //this.setState({ H1ER: newValue,});
    let curretState = this.state.ApepiDetails;
    curretState.RevertToReviewer = event.target.value;
    this.onFormTextFieldValueChange(curretState);
  }

  private onchangedPerformanceDiscussionDate(date: any): void {
    // this.setState({ endDate: date });
    let curretState = this.state.ApepiDetails;
    curretState.PerformanceDiscussion = date;
    this.onFormTextFieldValueChange(curretState);
  }
  //onchangedPerformanceDiscussionDate

  private onFormTextFieldValueChange(updateDetails: PEPI_PEPIDetails) {
    //let allowSave: boolean = true;
    //allowSave = this.validateSave(updateDetails);
    this.setState({
      ApepiDetails: updateDetails,
    });
  }

  //! Technorucs
  private isValidREVIEWEEApproved(): boolean {
    let ApepiQuestionText = this.state.ApepiQuestionText;
    let sectionD = ApepiQuestionText.filter(
      (item) =>
        (item.Reviewee == "" || Number(item.Reviewee) == 0) &&
        item.QuestionText != "N/A"
    );

    let valid: boolean = false;
    if (
      sectionD.length == 0 &&
      this.props.APEPIDetail.Complexity &&
      // this.state.A1EE != 0 &&
      // this.state.A2EE != 0 &&
      // this.state.A3EE != 0 &&
      this.state.A11E != 0 &&
      this.state.A12E != 0 &&
      this.state.A13E != 0 &&
      this.state.A14E != 0 &&
      this.state.A15E != 0 &&
      this.state.A21E != 0 &&
      this.state.A22E != 0 &&
      this.state.A23E != 0 &&
      this.state.A24E != 0 &&
      this.state.A31E != 0 &&
      this.state.A32E != 0 &&
      this.state.A33E != 0 &&
      // this.state.B1EE != 0 &&
      // this.state.B2EE != 0 &&
      // this.state.B3EE != 0 &&
      // this.state.B4EE != 0 &&
      this.state.B11E != 0 &&
      this.state.B12E != 0 &&
      this.state.B21E != 0 &&
      this.state.B22E != 0 &&
      this.state.B23E != 0 &&
      this.state.B31E != 0 &&
      this.state.B32E != 0 &&
      this.state.B33E != 0 &&
      this.state.B41E != 0 &&
      this.state.B42E != 0 &&
      this.state.B43E != 0 &&
      // this.state.C1EE != 0 &&
      // this.state.C2EE != 0 &&
      // this.state.C3EE != 0 &&
      this.state.C11E != 0 &&
      this.state.C12E != 0 &&
      this.state.C13E != 0 &&
      this.state.C21E != 0 &&
      this.state.C22E != 0 &&
      this.state.C23E != 0 &&
      this.state.C24E != 0 &&
      this.state.C31E != 0 &&
      this.state.C32E != 0 &&
      this.state.C33E != 0 &&
      this.state.ApepiDetails.E1EE &&
      this.state.ApepiDetails.F1EE &&
      this.state.ApepiDetails.G1EE &&
      this.state.ApepiDetails.H1EE
    ) {
      valid = true;
    }
    return valid;
  }

  //! Technorucs
  private isValidREVIEWERApproved(): boolean {
    let ApepiQuestionText = this.state.ApepiQuestionText;
    let sectionD = ApepiQuestionText.filter(
      (item) =>
        (item.Reviewer == "" || Number(item.Reviewer) == 0) &&
        item.QuestionText != "N/A"
    );

    let valid: boolean = false;
    if (
      sectionD.length == 0 &&
      this.props.APEPIDetail.Complexity &&
      // this.state.A1RR != 0 &&
      // this.state.A2RR != 0 &&
      // this.state.A3RR != 0 &&
      this.state.A11R != 0 &&
      this.state.A12R != 0 &&
      this.state.A13R != 0 &&
      this.state.A14R != 0 &&
      this.state.A15R != 0 &&
      this.state.A21R != 0 &&
      this.state.A22R != 0 &&
      this.state.A23R != 0 &&
      this.state.A24R != 0 &&
      this.state.A31R != 0 &&
      this.state.A32R != 0 &&
      this.state.A33R != 0 &&
      // this.state.B1RR != 0 &&
      // this.state.B2RR != 0 &&
      // this.state.B3RR != 0 &&
      // this.state.B4RR != 0 &&
      this.state.B11R != 0 &&
      this.state.B12R != 0 &&
      this.state.B21R != 0 &&
      this.state.B22R != 0 &&
      this.state.B23R != 0 &&
      this.state.B31R != 0 &&
      this.state.B32R != 0 &&
      this.state.B33R != 0 &&
      this.state.B41R != 0 &&
      this.state.B42R != 0 &&
      this.state.B43R != 0 &&
      // this.state.C1RR != 0 &&
      // this.state.C2RR != 0 &&
      // this.state.C3RR != 0 &&
      this.state.C11R != 0 &&
      this.state.C12R != 0 &&
      this.state.C13R != 0 &&
      this.state.C21R != 0 &&
      this.state.C22R != 0 &&
      this.state.C23R != 0 &&
      this.state.C24R != 0 &&
      this.state.C31R != 0 &&
      this.state.C32R != 0 &&
      this.state.C33R != 0 &&
      this.state.ApepiDetails.E1ER &&
      this.state.ApepiDetails.F1ER &&
      this.state.ApepiDetails.G1ER &&
      this.state.ApepiDetails.H1ER &&
      this.state.OverallPerformance != 0 &&
      this.state.ApepiDetails.PerformanceDiscussion
    ) {
      valid = true;
    }
    return valid;
  }

  private async onChangeReplaceme(items: any[]) {
    let curretState = this.state.ApepiDetails;
    curretState.SubstituteUser = await MapResult.map(
      items[0],
      Enums.MapperType.PnPControlResult,
      Enums.ItemResultType.User
    );
    //curretState.ReplaceUsermailString = await MapResult.map(items[0], Enums.MapperType.PnPControlResult, Enums.ItemResultType.User);
    curretState.ReplaceUsermailString = curretState.SubstituteUser.Email;
    this.setState({
      ApepiDetails: curretState,
    });

    //this.setState({ ReplaceUsermailString: curretState.SubstituteUser.Email });
    this.setState({ IsSelectedEmployeeInvalid: true });
    this.onFormTextFieldValueChange(curretState);
  }

  public async onReplacemeSave() {
    const pepiDetails = this.state.ApepiDetails;
    let data = {};
    const columns = Config.PEPIProjectsListColumns;
    data[columns.Submitted] = Config.SubmittedNumber[8];
    data[columns.SubstituteUserId] = pepiDetails.SubstituteUser.Id;
    this.listPEPIProjectsItemService = new ListItemService(
      this.props.AppContext,
      Config.ListNames.PEPIProjects
    );
    await this.listPEPIProjectsItemService.updateItem(
      this.state.ApepiDetails.ID,
      data
    );
    this.gotoListPage();
  }
  public formatDate = (date?: Date): string => {
    if (!date) return "";
    const month = date.getMonth() + 1; // + 1 because 0 indicates the first Month of the Year.
    const day = date.getDate();
    const year = date.getFullYear();

    let curretState = this.state.ApepiDetails;
    curretState.PerformanceDiscussion = date;
    this.onFormTextFieldValueChange(curretState);

    return `${month}/${day}/${year}`;
  };

  private _onFormatDate = (date: Date): string => {
    debugger;
    return (
      date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear()
    );
  };

  public render(): React.ReactElement<IAnalyticsProps> {
    return this.props.DisableSection == true ? (
      <React.Fragment></React.Fragment>
    ) : (
      // <div className={styles.sectionContent}>
      <div>
        <div>
          {((this.props.hasEditItemPermission &&
            this.state.ApepiDetails.StatusOfReview ==
              Config.StatusOfReview.AwaitingReviewer) ||
            this.state.ApepiDetails.StatusOfReview ==
              Config.StatusOfReview.AwaitingLeadMD) && (
            <div className={styles.ReplaceMerow}>
              <div className={styles.col25Right}>
                <PeoplePicker
                  context={this.props.AppContext}
                  personSelectionLimit={1}
                  groupName={""} // Leave this blank in case you want to filter from all users
                  showtooltip={true}
                  ensureUser={true}
                  showHiddenInUI={false}
                  principalTypes={[PrincipalType.User]}
                  resolveDelay={1000}
                  selectedItems={this.onChangeReplaceme}
                  defaultSelectedUsers={
                    this.state.IsSelectedEmployeeInvalid
                      ? []
                      : [this.state.ApepiDetails.ReplaceUsermailString]
                  }
                />
              </div>
              {this.props.hasEditItemPermission && (
                <div>
                  <div className={styles.col25Right}>
                    <PrimaryButton
                      className={styles.btnReplaceMe}
                      text="Replace me"
                      onClick={this.onReplacemeSave}
                    ></PrimaryButton>
                  </div>
                  <div className={styles.col25left}>
                    <Label>
                      <b>Should you be reviewing this person?</b> If not, enter
                      your replacement in the box at left and click{" "}
                      <b> Replace Me.</b>
                    </Label>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className={styles.divCompetency}>
          <Label>
            <b>Competency Attribute Rating Instructions:</b> Rate each
            behavioral statement using the Competency Attribute Rating Scale
            provided in the drop-down field (scale definitions provided below).
            You must make a choice for every field
          </Label>
        </div>

        {/* Deva Changes start */}
        <div
          style={{ position: "relative", zIndex: "1000", margin: "16px -8px" }}
        >
          <Label>
            <b>
              To view the Competency Attributes Rating Scale{" "}
              <a
                href="https://itinfoalvarezandmarsal.sharepoint.com/:p:/r/sites/pepiperfmgt/_layouts/15/Doc.aspx?sourcedoc=%7BD69BE130-FB74-4BEE-B8FF-57961954A48A%7D&file=Competency%20Attribute%20Rating%20Scale.pptx&action=edit&mobileredirect=true"
                target="_blank"
                data-interception="off"
              >
                click here.
              </a>
            </b>
          </Label>
        </div>
        {/* Deva Changes end */}

        {/* <div className={styles.divTablesectionContent}>
          <table className={styles.tablewraper}>
            <tr>
              <td className={styles.boldlabelSr} colSpan={2}>
                Competency Attribute Rating Scale (Apply same scale for all
                attributes)
              </td>
              <td className={styles.boldlabel}></td>
            </tr>
            <tr>
              <td className={styles.boldlabelSr}>5</td>
              <td className={styles.boldlabelTxt}>Exceptional</td>
              <td>
                Consistently demonstrates this attribute all the time, in all
                situations, is sought out by clients and/or colleagues for
                counsel and assistance; widely recognized as a role model and
                teaches others.
              </td>
            </tr>
            <tr>
              <td className={styles.boldlabelSr}>4</td>
              <td className={styles.boldlabelTxt}>Exceeds Expectation</td>
              <td>
                Consistently demonstrates this attribute all the time, in all
                situations, and is sought out by clients and/or colleagues for
                assistance.
              </td>
            </tr>
            <tr>
              <td className={styles.boldlabelSr}>3</td>
              <td className={styles.boldlabelTxt}>Performs Well</td>
              <td>
                Consistently demonstrates this attribute all the time, in most
                situations.
              </td>
            </tr>
            <tr>
              <td className={styles.boldlabelSr}>2</td>
              <td className={styles.boldlabelTxt}>Needs Improvement</td>
              <td>Inconsistently demonstrates this attribute.</td>
            </tr>
            <tr>
              <td className={styles.boldlabelSr}>1</td>
              <td className={styles.boldlabelTxt}>Unsatisfactory</td>
              <td>Seldomly demonstrates this attribute.</td>
            </tr>
            <tr>
              <td className={styles.boldlabelSr}>NA</td>
              <td className={styles.boldlabelTxt}>Not applicable</td>
              <td>
                Has not yet hed opportunity to demonstrate attribute and/or
                attribute does not apply.
              </td>
            </tr>
          </table>
        </div> */}

        {/* SECTION A1: DELIVERY EXCELLENCE */}
        <div className={styles.divbox}>
          {" "}
          <label className={styles.boxlable}>
            SECTION A: DELIVERY EXCELLENCE
          </label>{" "}
        </div>
        <div className={styles.divboxWithoutboder}>
          {" "}
          <label className={styles.boxlablewithundrline}>
            A1. Practical and Operational Orientation
          </label>{" "}
        </div>
        <div className={styles.sectionContent}>
          <table className={styles.tableWithoutboder}>
            <tr>
              <td className={styles.tablewidth}></td>{" "}
              <td className={styles.tablelable}> Reviewee </td>{" "}
              <td className={styles.tablelable}>Reviewer</td>{" "}
              <td className={styles.tablelable}> Difference</td>
            </tr>

            <tr>
              <td>
                <label className={styles.tablelable}>
                  {" "}
                  Develop Own Point of View (POV) -{" "}
                </label>{" "}
                Asks questions to gather all relevant information, surfaces all
                assumptions and perspectives; seeks other's opinions and
                perspectives to build a team POV.
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewee}
                  options={this.props.Options}
                  selectedKey={Number(this.state.A11E)}
                  onChange={(e, selectedOption) => {
                    this.onChangeA1(selectedOption.text, "A11E");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewer}
                  options={this.props.Options}
                  selectedKey={Number(this.state.A11R)}
                  onChange={(e, selectedOption) => {
                    this.onChangeA1(selectedOption.text, "A11R");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                <label>{this.state.A11D}</label>
              </td>
            </tr>
            <tr>
              <td>
                <label className={styles.tablelable}>
                  {" "}
                  Issue Resolution -{" "}
                </label>
                Identifies and interprets links between differing points-of-view
                and seeks to close gaps in knowledge about the situation to
                effectively validate, disprove and/or modify assumptions (team
                and client).
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewee}
                  options={this.props.Options}
                  selectedKey={Number(this.state.A12E)}
                  onChange={(e, selectedOption) => {
                    this.onChangeA1(selectedOption.text, "A12E");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewer}
                  options={this.props.Options}
                  selectedKey={Number(this.state.A12R)}
                  onChange={(e, selectedOption) => {
                    this.onChangeA1(selectedOption.text, "A12R");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                <label>{this.state.A12D}</label>
              </td>
            </tr>

            <tr>
              <td>
                <label className={styles.tablelable}>
                  {" "}
                  Implementation Focus -{" "}
                </label>
                Develops and manages aspects of operational programs with
                direction, considering time and talent constraints, as well as
                identified operational risks.
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewee}
                  options={this.props.Options}
                  selectedKey={Number(this.state.A13E)}
                  onChange={(e, selectedOption) => {
                    this.onChangeA1(selectedOption.text, "A13E");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewer}
                  options={this.props.Options}
                  selectedKey={Number(this.state.A13R)}
                  onChange={(e, selectedOption) => {
                    this.onChangeA1(selectedOption.text, "A13R");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                <label>{this.state.A13D}</label>
              </td>
            </tr>
            <tr>
              <td>
                <label className={styles.tablelable}> Risk Management - </label>
                Identifies potential obstacles and risks in achieving objectives
                and creates contingency plans and alternative solutions,
                communicating effectively internally and with the client.
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewee}
                  options={this.props.Options}
                  selectedKey={Number(this.state.A14E)}
                  onChange={(e, selectedOption) => {
                    this.onChangeA1(selectedOption.text, "A14E");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewer}
                  options={this.props.Options}
                  selectedKey={Number(this.state.A14R)}
                  onChange={(e, selectedOption) => {
                    this.onChangeA1(selectedOption.text, "A14R");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {this.state.A14D}</label>
              </td>
            </tr>
            <tr>
              <td>
                <label className={styles.tablelable}> Storyboarding - </label>
                Guides team to develop illustrative proofs of concepts that draw
                logical conclusions to effectively communicate client issues and
                opportunities clearly and concisely.
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewee}
                  options={this.props.Options}
                  selectedKey={Number(this.state.A15E)}
                  onChange={(e, selectedOption) => {
                    this.onChangeA1(selectedOption.text, "A15E");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewer}
                  options={this.props.Options}
                  selectedKey={Number(this.state.A15R)}
                  onChange={(e, selectedOption) => {
                    this.onChangeA1(selectedOption.text, "A15R");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {this.state.A15D}</label>
              </td>
            </tr>
            <tr className={styles.divbox}>
              <td>
                <label className={styles.tablelable}>
                  {" "}
                  SECTION A1 COMPETENCY AVERAGE{" "}
                </label>
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label>{Number(this.state.A1EE).toFixed(2)}</label>
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label>{Number(this.state.A1RR).toFixed(2)}</label>
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label>{Number(this.state.A1DD).toFixed(2)}</label>
              </td>
            </tr>
          </table>
        </div>

        {/* A2. Problem-Solving & Perspective */}
        <div className={styles.divboxWithoutboder}>
          {" "}
          <label className={styles.boxlablewithundrline}>
            A2. Problem-Solving & Perspective
          </label>{" "}
        </div>
        <div className={styles.sectionContent}>
          <table className={styles.tableWithoutboder}>
            <tr>
              <td className={styles.tablewidth}></td>{" "}
              <td className={styles.tablelable}> Reviewee </td>{" "}
              <td className={styles.tablelable}>Reviewer</td>{" "}
              <td className={styles.tablelable}> Difference</td>
            </tr>
            <tr>
              <td>
                <label className={styles.tablelable}> Info Gathering - </label>
                Guides team members in information gathering approach and
                activities and probes client and internal team, to ensure all
                relevant sources of information are pursued and considered
                (external and internal).
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewee}
                  options={this.props.Options}
                  selectedKey={Number(this.state.A21E)}
                  onChange={(e, selectedOption) => {
                    this.onChangeA2(selectedOption.text, "A21E");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewer}
                  options={this.props.Options}
                  selectedKey={Number(this.state.A21R)}
                  onChange={(e, selectedOption) => {
                    this.onChangeA2(selectedOption.text, "A21R");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                <label> {this.state.A21D} </label>
              </td>
            </tr>

            <tr>
              <td>
                <label className={styles.tablelable}> Analyzing - </label>
                Produces own analyses and is able to direct others in doing so;
                Output is reliable and leads to accurate conclusions.
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewee}
                  options={this.props.Options}
                  selectedKey={Number(this.state.A22E)}
                  onChange={(e, selectedOption) => {
                    this.onChangeA2(selectedOption.text, "A22E");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewer}
                  options={this.props.Options}
                  selectedKey={Number(this.state.A22R)}
                  onChange={(e, selectedOption) => {
                    this.onChangeA2(selectedOption.text, "A22R");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {this.state.A22D}</label>
              </td>
            </tr>

            <tr>
              <td>
                <label className={styles.tablelable}>
                  {"Pattern Recognition - "}
                </label>
                Guides team in finding trends and relationships in emerging fact
                pattern, and identifying and integrating new or related lines of
                research to lead to complete conclusions.
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewee}
                  options={this.props.Options}
                  selectedKey={Number(this.state.A23E)}
                  onChange={(e, selectedOption) => {
                    this.onChangeA2(selectedOption.text, "A23E");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewer}
                  options={this.props.Options}
                  selectedKey={Number(this.state.A23R)}
                  onChange={(e, selectedOption) => {
                    this.onChangeA2(selectedOption.text, "A23R");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {this.state.A23D}</label>
              </td>
            </tr>
            <tr>
              <td>
                <label className={styles.tablelable}> Problem Solving - </label>
                Develops fact-based conclusions, assimilating information from
                an array of relevant sources, and leveraging previous
                experience.
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewee}
                  options={this.props.Options}
                  selectedKey={Number(this.state.A24E)}
                  onChange={(e, selectedOption) => {
                    this.onChangeA2(selectedOption.text, "A24E");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewer}
                  options={this.props.Options}
                  selectedKey={Number(this.state.A24R)}
                  onChange={(e, selectedOption) => {
                    this.onChangeA2(selectedOption.text, "A24R");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {this.state.A24D}</label>
              </td>
            </tr>
            <tr className={styles.divbox}>
              <td>
                <label className={styles.tablelable}>
                  {" "}
                  SECTION A2 COMPETENCY AVERAGE{" "}
                </label>
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {Number(this.state.A2EE).toFixed(2)}</label>
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {Number(this.state.A2RR).toFixed(2)}</label>
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {Number(this.state.A2DD).toFixed(2)}</label>
              </td>
            </tr>
          </table>
        </div>

        {/* A3. Preparation and Delivery */}
        <div className={styles.divboxWithoutboder}>
          {" "}
          <label className={styles.boxlablewithundrline}>
            A3. Preparation and Delivery
          </label>{" "}
        </div>
        <div className={styles.sectionContent}>
          <table className={styles.tableWithoutboder}>
            <tr>
              <td className={styles.tablewidth}></td>{" "}
              <td className={styles.tablelable}> Reviewee </td>{" "}
              <td className={styles.tablelable}>Reviewer</td>{" "}
              <td className={styles.tablelable}> Difference</td>
            </tr>
            <tr>
              <td>
                <label className={styles.tablelable}> Preparation - </label>Sets
                client context for the team & assists team in preparing required
                materials & presentations for interacts with client team.
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewee}
                  options={this.props.Options}
                  selectedKey={Number(this.state.A31E)}
                  onChange={(e, selectedOption) => {
                    this.onChangeA3(selectedOption.text, "A31E");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewer}
                  options={this.props.Options}
                  selectedKey={Number(this.state.A31R)}
                  onChange={(e, selectedOption) => {
                    this.onChangeA3(selectedOption.text, "A31R");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                <label> {this.state.A31D} </label>
              </td>
            </tr>

            <tr>
              <td>
                <label className={styles.tablelable}>Work Management - </label>
                Develops effective workplans for assigned workstreams, and
                assigns and delegates work in alignment with plans; Monitors
                projects and deliverables against deadlines; Helps team navigate
                ambiguous and/or changing situations, flexing work assignments
                as needed.
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewee}
                  options={this.props.Options}
                  selectedKey={Number(this.state.A32E)}
                  onChange={(e, selectedOption) => {
                    this.onChangeA3(selectedOption.text, "A32E");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewer}
                  options={this.props.Options}
                  selectedKey={Number(this.state.A32R)}
                  onChange={(e, selectedOption) => {
                    this.onChangeA3(selectedOption.text, "A32R");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                <label> {this.state.A32D} </label>
              </td>
            </tr>

            <tr>
              <td>
                <label className={styles.tablelable}>Issue Ownership - </label>
                Takes accountability for client and broader team issues and
                problems, assisting the team in doing the same; Helps team adapt
                to changing situations and priorities and persevere on issue
                resolution, despite obstacles.
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewee}
                  options={this.props.Options}
                  selectedKey={Number(this.state.A33E)}
                  onChange={(e, selectedOption) => {
                    this.onChangeA3(selectedOption.text, "A33E");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewer}
                  options={this.props.Options}
                  selectedKey={Number(this.state.A33R)}
                  onChange={(e, selectedOption) => {
                    this.onChangeA3(selectedOption.text, "A33R");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                <label> {this.state.A33D} </label>
              </td>
            </tr>
            <tr className={styles.divbox}>
              <td>
                <label className={styles.tablelable}>
                  {" "}
                  SECTION A3 COMPETENCY AVERAGE{" "}
                </label>
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {Number(this.state.A3EE).toFixed(2)}</label>
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {Number(this.state.A3RR).toFixed(2)} </label>
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {Number(this.state.A3DD).toFixed(2)} </label>
              </td>
            </tr>
            <tr className={styles.divboxWithoutboder}>
              <td className={styles.finalsctionTD}>
                <label className={styles.tablelable}>
                  {" "}
                  SECTION A COMPETENCY AVERAGE{" "}
                </label>
              </td>
              <td className={styles.finalsctionTD}>
                {" "}
                <label> {Number(this.state.AAvgEE).toFixed(2)}</label>
              </td>
              <td className={styles.finalsctionTD}>
                {" "}
                <label> {Number(this.state.AAvgER).toFixed(2)}</label>
              </td>
              <td className={styles.finalsctionTD}>
                {" "}
                <label> {Number(this.state.SctionTotalAD).toFixed(2)}</label>
              </td>
            </tr>
          </table>
        </div>

        {/* SECTION B: VALUE CREATION */}
        <div className={styles.divbox}>
          {" "}
          <label className={styles.boxlable}>
            SECTION B: VALUE CREATION
          </label>{" "}
        </div>
        <div className={styles.divboxWithoutboder}>
          {" "}
          <label className={styles.boxlablewithundrline}>
            B1. PEPI Culture Stewardship
          </label>
        </div>
        <div className={styles.sectionContent}>
          <table className={styles.tableWithoutboder}>
            <tr>
              <td className={styles.tablewidth}></td>{" "}
              <td className={styles.tablelable}> Reviewee </td>{" "}
              <td className={styles.tablelable}>Reviewer</td>{" "}
              <td className={styles.tablelable}> Difference</td>
            </tr>
            <tr>
              <td>
                <label className={styles.tablelable}>A&M Values - </label>Adopts
                A&M values as guiding principles that direct behavior,
                decision-making and interactions.
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewee}
                  options={this.props.Options}
                  selectedKey={Number(this.state.B11E)}
                  onChange={(e, selectedOption) => {
                    this.onChangeB1(selectedOption.text, "B11E");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewer}
                  options={this.props.Options}
                  selectedKey={Number(this.state.B11R)}
                  onChange={(e, selectedOption) => {
                    this.onChangeB1(selectedOption.text, "B11R");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {this.state.B11D}</label>
              </td>
            </tr>
            <tr>
              <td>
                <label className={styles.tablelable}>PEPI Way - </label>Plans
                and coordinates activities and initiatives that build the
                business and PEPI's capabilities; Encourages team to leverage
                and create PEPI best practices.
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewee}
                  options={this.props.Options}
                  selectedKey={Number(this.state.B12E)}
                  onChange={(e, selectedOption) => {
                    this.onChangeB1(selectedOption.text, "B12E");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewer}
                  options={this.props.Options}
                  selectedKey={Number(this.state.B12R)}
                  onChange={(e, selectedOption) => {
                    this.onChangeB1(selectedOption.text, "B12R");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {this.state.B12D}</label>
              </td>
            </tr>
            <tr className={styles.divbox}>
              <td>
                <label className={styles.tablelable}>
                  {" "}
                  SECTION B1 COMPETENCY AVERAGE{" "}
                </label>
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {Number(this.state.B1EE).toFixed(2)}</label>
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {Number(this.state.B1RR).toFixed(2)} </label>
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {Number(this.state.B1DD).toFixed(2)} </label>
              </td>
            </tr>
          </table>
        </div>

        {/* B2. Targeted Management & Development of Others */}
        <div className={styles.divboxWithoutboder}>
          {" "}
          <label className={styles.boxlablewithundrline}>
            B2. Targeted Management & Development of Others
          </label>
        </div>
        <div className={styles.sectionContent}>
          <table className={styles.tableWithoutboder}>
            <tr>
              <td className={styles.tablewidth}></td>{" "}
              <td className={styles.tablelable}> Reviewee </td>{" "}
              <td className={styles.tablelable}>Reviewer</td>{" "}
              <td className={styles.tablelable}> Difference</td>
            </tr>
            <tr>
              <td>
                <label className={styles.tablelable}>
                  {"Performance Feedback - "}
                </label>
                Provides timely, objective, direct, constructive and actionable
                feedback on-the-job and within context of the PEPI performance
                process for staff.
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewee}
                  options={this.props.Options}
                  selectedKey={Number(this.state.B21E)}
                  onChange={(e, selectedOption) => {
                    this.onChangeB2(selectedOption.text, "B21E");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewer}
                  options={this.props.Options}
                  selectedKey={Number(this.state.B21R)}
                  onChange={(e, selectedOption) => {
                    this.onChangeB2(selectedOption.text, "B21R");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {this.state.B21D}</label>
              </td>
            </tr>
            <tr>
              <td>
                <label className={styles.tablelable}>
                  Effective Delegation -{" "}
                </label>
                Delegates tasks according to team members' abilities and
                motivation, provides guidance as needed, and maintains
                accountability for end-result of work completed by others.
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewee}
                  options={this.props.Options}
                  selectedKey={Number(this.state.B22E)}
                  onChange={(e, selectedOption) => {
                    this.onChangeB2(selectedOption.text, "B22E");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewer}
                  options={this.props.Options}
                  selectedKey={Number(this.state.B22R)}
                  onChange={(e, selectedOption) => {
                    this.onChangeB2(selectedOption.text, "B22R");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {this.state.B22D}</label>
              </td>
            </tr>
            <tr>
              <td>
                <label className={styles.tablelable}>Learning Culture - </label>
                Participates in and encourages team members to participate in
                PEPI training and development activities as scheduled; Provides
                individualized on-the-job coaching to team members.
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewee}
                  options={this.props.Options}
                  selectedKey={Number(this.state.B23E)}
                  onChange={(e, selectedOption) => {
                    this.onChangeB2(selectedOption.text, "B23E");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewer}
                  options={this.props.Options}
                  selectedKey={Number(this.state.B23R)}
                  onChange={(e, selectedOption) => {
                    this.onChangeB2(selectedOption.text, "B23R");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {this.state.B23D}</label>
              </td>
            </tr>
            <tr className={styles.divbox}>
              <td>
                <label className={styles.tablelable}>
                  {" "}
                  SECTION B2 COMPETENCY AVERAGE{" "}
                </label>
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {Number(this.state.B2EE).toFixed(2)}</label>
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {Number(this.state.B2RR).toFixed(2)} </label>
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {Number(this.state.B2DD).toFixed(2)} </label>
              </td>
            </tr>
          </table>
        </div>

        {/* B3. Effective Relationship & Team Building */}
        <div className={styles.divboxWithoutboder}>
          {" "}
          <label className={styles.boxlablewithundrline}>
            B3. Effective Relationship & Team Building
          </label>
        </div>
        <div className={styles.sectionContent}>
          <table className={styles.tableWithoutboder}>
            <tr>
              <td className={styles.tablewidth}></td>{" "}
              <td className={styles.tablelable}> Reviewee </td>{" "}
              <td className={styles.tablelable}>Reviewer</td>{" "}
              <td className={styles.tablelable}> Difference</td>
            </tr>
            <tr>
              <td>
                <label className={styles.tablelable}>Team Work - </label>{" "}
                Promotes a team environment where diverse ideas and opinions are
                encouraged within and across boundaries (e.g., business units,
                client and internal, industry, boards, etc.).
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewee}
                  options={this.props.Options}
                  selectedKey={Number(this.state.B31E)}
                  onChange={(e, selectedOption) => {
                    this.onChangeB3(selectedOption.text, "B31E");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewer}
                  options={this.props.Options}
                  selectedKey={Number(this.state.B31R)}
                  onChange={(e, selectedOption) => {
                    this.onChangeB3(selectedOption.text, "B31R");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {this.state.B31D}</label>
              </td>
            </tr>
            <tr>
              <td>
                <label className={styles.tablelable}>Trust Building - </label>
                Engenders trust and builds followership by demonstrating respect
                of others and others’ points-of-view, as well as using facts and
                influential communication..
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewee}
                  options={this.props.Options}
                  selectedKey={Number(this.state.B32E)}
                  onChange={(e, selectedOption) => {
                    this.onChangeB3(selectedOption.text, "B32E");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewer}
                  options={this.props.Options}
                  selectedKey={Number(this.state.B32R)}
                  onChange={(e, selectedOption) => {
                    this.onChangeB3(selectedOption.text, "B32R");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {this.state.B32D}</label>
              </td>
            </tr>
            <tr>
              <td>
                <label className={styles.tablelable}>Client Handling - </label>
                Engages intentionally, objectively, and in a straightforward
                manner with client team members to build strong client team
                relationships as vehicles for improving project delivery and
                overall outcomes.
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewee}
                  options={this.props.Options}
                  selectedKey={Number(this.state.B33E)}
                  onChange={(e, selectedOption) => {
                    this.onChangeB3(selectedOption.text, "B33E");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewer}
                  options={this.props.Options}
                  selectedKey={Number(this.state.B33R)}
                  onChange={(e, selectedOption) => {
                    this.onChangeB3(selectedOption.text, "B33R");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {this.state.B33D}</label>
              </td>
            </tr>
            <tr className={styles.divbox}>
              <td>
                <label className={styles.tablelable}>
                  {" "}
                  SECTION B3 COMPETENCY AVERAGE{" "}
                </label>
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {Number(this.state.B3EE).toFixed(2)}</label>
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {Number(this.state.B3RR).toFixed(2)} </label>
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {Number(this.state.B3DD).toFixed(2)} </label>
              </td>
            </tr>
          </table>
        </div>
        {/* B4. Results-Oriented Business Development */}
        <div className={styles.divboxWithoutboder}>
          {" "}
          <label className={styles.boxlablewithundrline}>
            B4. Results-Oriented Business Development
          </label>
        </div>
        <div className={styles.sectionContent}>
          <table className={styles.tableWithoutboder}>
            <tr>
              <td className={styles.tablewidth}></td>{" "}
              <td className={styles.tablelable}> Reviewee </td>{" "}
              <td className={styles.tablelable}>Reviewer</td>{" "}
              <td className={styles.tablelable}> Difference</td>
            </tr>
            <tr>
              <td>
                <label className={styles.tablelable}>
                  Relationship Building -{" "}
                </label>{" "}
                Intentionally transitions project relationships (PEPI, Big A&M,
                Private Equity and Portfolio Companies) into longer-term
                business relationships by providing skilled resources who
                deliver practical and impactful solutions.
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewee}
                  options={this.props.Options}
                  selectedKey={Number(this.state.B41E)}
                  onChange={(e, selectedOption) => {
                    this.onChangeB4(selectedOption.text, "B41E");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewer}
                  options={this.props.Options}
                  selectedKey={Number(this.state.B41R)}
                  onChange={(e, selectedOption) => {
                    this.onChangeB4(selectedOption.text, "B41R");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {this.state.B41D}</label>
              </td>
            </tr>
            <tr>
              <td>
                <label className={styles.tablelable}>
                  Business Development -{" "}
                </label>
                Identifies opportunities to expand and generate new work in
                existing projects at existing clients.
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewee}
                  options={this.props.Options}
                  selectedKey={Number(this.state.B42E)}
                  onChange={(e, selectedOption) => {
                    this.onChangeB4(selectedOption.text, "B42E");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewer}
                  options={this.props.Options}
                  selectedKey={Number(this.state.B42R)}
                  onChange={(e, selectedOption) => {
                    this.onChangeB4(selectedOption.text, "B42R");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {this.state.B42D}</label>
              </td>
            </tr>
            <tr>
              <td>
                <label className={styles.tablelable}>Client Alignment - </label>{" "}
                Understands client motivations, culture, working and
                communication styles, and structures team to align to and be
                effective within client context.
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewee}
                  options={this.props.Options}
                  selectedKey={Number(this.state.B43E)}
                  onChange={(e, selectedOption) => {
                    this.onChangeB4(selectedOption.text, "B43E");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewer}
                  options={this.props.Options}
                  selectedKey={Number(this.state.B43R)}
                  onChange={(e, selectedOption) => {
                    this.onChangeB4(selectedOption.text, "B43R");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {this.state.B43D}</label>
              </td>
            </tr>
            <tr className={styles.divbox}>
              <td>
                <label className={styles.tablelable}>
                  {" "}
                  SECTION B4 COMPETENCY AVERAGE{" "}
                </label>
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {Number(this.state.B4EE).toFixed(2)}</label>
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {Number(this.state.B4RR).toFixed(2)} </label>
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {Number(this.state.B4DD).toFixed(2)} </label>
              </td>
            </tr>
            <tr className={styles.divboxWithoutboder}>
              <td className={styles.finalsctionTD}>
                <label className={styles.tablelable}>
                  {" "}
                  SECTION B COMPETENCY AVERAGE{" "}
                </label>
              </td>
              <td className={styles.finalsctionTD}>
                {" "}
                <label> {Number(this.state.BAvgEE).toFixed(2)}</label>
              </td>
              <td className={styles.finalsctionTD}>
                {" "}
                <label> {Number(this.state.BAvgER).toFixed(2)}</label>
              </td>
              <td className={styles.finalsctionTD}>
                {" "}
                <label> {Number(this.state.SctionTotalBD).toFixed(2)}</label>
              </td>
            </tr>
          </table>
        </div>

        {/* SECTION C: PERSONAL IMPACT */}
        <div className={styles.divbox}>
          {" "}
          <label className={styles.boxlable}>
            SECTION C: PERSONAL IMPACT
          </label>{" "}
        </div>
        <div className={styles.divboxWithoutboder}>
          {" "}
          <label className={styles.boxlablewithundrline}>
            C1. Emotional Awareness & Response
          </label>
        </div>
        <div className={styles.sectionContent}>
          <table className={styles.tableWithoutboder}>
            <tr>
              <td className={styles.tablewidth}></td>{" "}
              <td className={styles.tablelable}> Reviewee </td>{" "}
              <td className={styles.tablelable}>Reviewer</td>{" "}
              <td className={styles.tablelable}> Difference</td>
            </tr>
            <tr>
              <td>
                <label className={styles.tablelable}>
                  Engaging and Adapting -{" "}
                </label>{" "}
                Identifies preferred communication and learning styles of
                others, considers own and others' emotional states and
                environmental circumstances, and adapts effectively to engage a
                single stakeholder in productive interactions.
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewee}
                  options={this.props.Options}
                  selectedKey={Number(this.state.C11E)}
                  onChange={(e, selectedOption) => {
                    this.onChangeC1(selectedOption.text, "C11E");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewer}
                  options={this.props.Options}
                  selectedKey={Number(this.state.C11R)}
                  onChange={(e, selectedOption) => {
                    this.onChangeC1(selectedOption.text, "C11R");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {this.state.C11D}</label>
              </td>
            </tr>
            <tr>
              <td>
                <label className={styles.tablelable}>Flexibility - </label>{" "}
                Selects the right leadership style, based on the situation, as
                well as the capabilities, motivations and commitment level to
                drive individual and team performance.
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewee}
                  options={this.props.Options}
                  selectedKey={Number(this.state.C12E)}
                  onChange={(e, selectedOption) => {
                    this.onChangeC1(selectedOption.text, "C12E");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewer}
                  options={this.props.Options}
                  selectedKey={Number(this.state.C12R)}
                  onChange={(e, selectedOption) => {
                    this.onChangeC1(selectedOption.text, "C12R");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label>{this.state.C12D}</label>
              </td>
            </tr>
            <tr>
              <td>
                <label className={styles.tablelable}>
                  Conflict Resolution -{" "}
                </label>
                Takes the lead in finding common ground and achieving positive
                outcomes in conflict situations, only engaging leadership if
                appropriate.
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewee}
                  options={this.props.Options}
                  selectedKey={Number(this.state.C13E)}
                  onChange={(e, selectedOption) => {
                    this.onChangeC1(selectedOption.text, "C13E");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewer}
                  options={this.props.Options}
                  selectedKey={Number(this.state.C13R)}
                  onChange={(e, selectedOption) => {
                    this.onChangeC1(selectedOption.text, "C13R");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label>{this.state.C13D}</label>
              </td>
            </tr>
            <tr className={styles.divbox}>
              <td>
                <label className={styles.tablelable}>
                  {" "}
                  SECTION C1 COMPETENCY AVERAGE{" "}
                </label>
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {Number(this.state.C1EE).toFixed(2)}</label>
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {Number(this.state.C1RR).toFixed(2)} </label>
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {Number(this.state.C1DD).toFixed(2)} </label>
              </td>
            </tr>
          </table>
        </div>

        {/* C2. Impactful Communication */}
        <div className={styles.divboxWithoutboder}>
          {" "}
          <label className={styles.boxlablewithundrline}>
            C2. Impactful Communication
          </label>
        </div>
        <div className={styles.sectionContent}>
          <table className={styles.tableWithoutboder}>
            <tr>
              <td className={styles.tablewidth}></td>{" "}
              <td className={styles.tablelable}> Reviewee </td>{" "}
              <td className={styles.tablelable}>Reviewer</td>{" "}
              <td className={styles.tablelable}> Difference</td>
            </tr>
            <tr>
              <td>
                <label className={styles.tablelable}>
                  Active Dialoguing -{" "}
                </label>
                Listens without bias to understand the essence of other's ideas,
                engaging in two-way dialogue to surface misunderstanding,
                assumptions and sources of resistance to enable effective
                processing of ideas.
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewee}
                  options={this.props.Options}
                  selectedKey={Number(this.state.C21E)}
                  onChange={(e, selectedOption) => {
                    this.onChangeC2(selectedOption.text, "C21E");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewer}
                  options={this.props.Options}
                  selectedKey={Number(this.state.C21R)}
                  onChange={(e, selectedOption) => {
                    this.onChangeC2(selectedOption.text, "C21R");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label>{this.state.C21D}</label>
              </td>
            </tr>
            <tr>
              <td>
                <label className={styles.tablelable}>
                  Meeting Management -{" "}
                </label>
                Facilitates <u>project</u> meetings to drive to intended
                outcomes, anticipating and answering unscripted questions,
                applying effective time management and standard meeting
                facilitation skills.
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewee}
                  options={this.props.Options}
                  selectedKey={Number(this.state.C22E)}
                  onChange={(e, selectedOption) => {
                    this.onChangeC2(selectedOption.text, "C22E");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewer}
                  options={this.props.Options}
                  selectedKey={Number(this.state.C22R)}
                  onChange={(e, selectedOption) => {
                    this.onChangeC2(selectedOption.text, "C22R");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label>{this.state.C22D}</label>
              </td>
            </tr>
            <tr>
              <td>
                <label className={styles.tablelable}>
                  Oral Communication -{" "}
                </label>
                Reads audience and adjusts messaging, tone, focus, non-verbals,
                and discussion duration as audience responds and/or situation
                evolves.
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewee}
                  options={this.props.Options}
                  selectedKey={Number(this.state.C23E)}
                  onChange={(e, selectedOption) => {
                    this.onChangeC2(selectedOption.text, "C23E");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewer}
                  options={this.props.Options}
                  selectedKey={Number(this.state.C23R)}
                  onChange={(e, selectedOption) => {
                    this.onChangeC2(selectedOption.text, "C23R");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label>{this.state.C23D}</label>
              </td>
            </tr>
            <tr>
              <td>
                <label className={styles.tablelable}>
                  Written Communication -{" "}
                </label>
                Converts ideas into well-written, client-ready communications
                (e.g., readout) in alignment with audience needs; accurately
                summarizing information, considering the right style and level
                of detail for intended audience.
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewee}
                  options={this.props.Options}
                  selectedKey={Number(this.state.C24E)}
                  onChange={(e, selectedOption) => {
                    this.onChangeC2(selectedOption.text, "C24E");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewer}
                  options={this.props.Options}
                  selectedKey={Number(this.state.C24R)}
                  onChange={(e, selectedOption) => {
                    this.onChangeC2(selectedOption.text, "C24R");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label>{this.state.C24D}</label>
              </td>
            </tr>
            <tr className={styles.divbox}>
              <td>
                <label className={styles.tablelable}>
                  {" "}
                  SECTION C2 COMPETENCY AVERAGE{" "}
                </label>
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {Number(this.state.C2EE).toFixed(2)}</label>
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {Number(this.state.C2RR).toFixed(2)} </label>
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {Number(this.state.C2DD).toFixed(2)} </label>
              </td>
            </tr>
          </table>
        </div>

        {/* C3. Personal Development */}
        <div className={styles.divboxWithoutboder}>
          {" "}
          <label className={styles.boxlablewithundrline}>
            C3. Personal Development
          </label>
        </div>
        <div className={styles.sectionContent}>
          <table className={styles.tableWithoutboder}>
            <tr>
              <td className={styles.tablewidth}></td>
              <td className={styles.tablelable}> Reviewee </td>
              <td className={styles.tablelable}>Reviewer</td>
              <td className={styles.tablelable}> Difference</td>
            </tr>
            <tr>
              <td>
                <label className={styles.tablelable}>
                  Skill Development -{" "}
                </label>
                Seeks roles and opportunities, solicits feedback regularly, and
                participates in formal training and mentoring to develop
                capabilities and skill set.
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewee}
                  options={this.props.Options}
                  selectedKey={Number(this.state.C31E)}
                  onChange={(e, selectedOption) => {
                    this.onChangeC3(selectedOption.text, "C31E");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewer}
                  options={this.props.Options}
                  selectedKey={Number(this.state.C31R)}
                  onChange={(e, selectedOption) => {
                    this.onChangeC3(selectedOption.text, "C31R");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {this.state.C31D}</label>
              </td>
            </tr>
            <tr>
              <td>
                <label className={styles.tablelable}>Knowledge Growth - </label>
                Seeks the challenge of unfamiliar tasks and responsibilities;
                Seeks counsel and is willing to experiment to improve and / or
                find solutions.
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewee}
                  options={this.props.Options}
                  selectedKey={Number(this.state.C32E)}
                  onChange={(e, selectedOption) => {
                    this.onChangeC3(selectedOption.text, "C32E");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewer}
                  options={this.props.Options}
                  selectedKey={Number(this.state.C32R)}
                  onChange={(e, selectedOption) => {
                    this.onChangeC3(selectedOption.text, "C32R");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label>{this.state.C32D}</label>
              </td>
            </tr>
            <tr>
              <td>
                <label className={styles.tablelable}>Accepts Feedback - </label>
                Accepts feedback with an open mind and has the ability to act on
                it; Learns from own mistakes and the mistakes of others; Seeks
                peer and upward feedback with same as zeal as from above.
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewee}
                  options={this.props.Options}
                  selectedKey={Number(this.state.C33E)}
                  onChange={(e, selectedOption) => {
                    this.onChangeC3(selectedOption.text, "C33E");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                <Dropdown
                  disabled={this.state.IsReviewer}
                  options={this.props.Options}
                  selectedKey={Number(this.state.C33R)}
                  onChange={(e, selectedOption) => {
                    this.onChangeC3(selectedOption.text, "C33R");
                  }}
                />
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {this.state.C33D}</label>
              </td>
            </tr>
            <tr className={styles.divbox}>
              <td>
                <label className={styles.tablelable}>
                  {" "}
                  SECTION C3 COMPETENCY AVERAGE{" "}
                </label>
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {Number(this.state.C3EE).toFixed(2)}</label>
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {Number(this.state.C3RR).toFixed(2)} </label>
              </td>
              <td className={styles.doppadding}>
                {" "}
                <label> {Number(this.state.C3DD).toFixed(2)} </label>
              </td>
            </tr>
            <tr className={styles.divboxWithoutboder}>
              <td className={styles.finalsctionTD}>
                <label className={styles.tablelable}>
                  {" "}
                  SECTION C COMPETENCY AVERAGE{" "}
                </label>
              </td>
              <td className={styles.finalsctionTD}>
                {" "}
                <label> {Number(this.state.CAvgEE).toFixed(2)}</label>
              </td>
              <td className={styles.finalsctionTD}>
                {" "}
                <label> {Number(this.state.CAvgER).toFixed(2)}</label>
              </td>
              <td className={styles.finalsctionTD}>
                {" "}
                <label> {Number(this.state.SctionTotalCD).toFixed(2)}</label>
              </td>
            </tr>
          </table>
        </div>

        {/* SECTION D: SERVICE LINE */}

        <div className={styles.divbox}>
          {" "}
          <label className={styles.boxlable}>
            SECTION D: SERVICE LINE
          </label>{" "}
        </div>
        {this.state.ApepiQuestionText != null && (
          <AllQuestionText
            AppContext={this.props.AppContext}
            hasEditItemPermission={this.props.hasEditItemPermission}
            IsLoading={this.state.IsLoading}
            QuestionText={this.state.ApepiQuestionText}
            Options={this.props.Options}
            APEPIDetail={this.state.ApepiDetails}
            SctionTotalDE={this.state.SctionTotalDE}
            SctionTotalDR={this.state.SctionTotalDR}
            SctionTotalDD={this.state.SctionTotalDD}
            IsReviewee={this.state.IsReviewee}
            IsReviewer={this.state.IsReviewer}
            IsAwaitingReviewee={this.state.revieweePermission}
            //  SERVICELINEReviewee = {0}
            //  SERVICELINEReviewer = {0}
            //  SERVICELINEDifference = {0}
            onFormFieldValueChange={this.onFormFieldValueChange}
          ></AllQuestionText>
        )}

        {/* SECTION E: STRENGTHS */}
        <div className={styles.divbox}>
          {" "}
          <label className={styles.boxlable}>SECTION E: STRENGTHS</label>{" "}
        </div>
        <div className={styles.sectionContent}>
          <fieldset>
            {" "}
            <legend>Reviewee Comments</legend>{" "}
            <TextField
              multiline={true}
              rows={4}
              disabled={this.state.IsReviewee}
              value={this.state.ApepiDetails.E1EE}
              onChange={this.onChangeE1EE}
              className={styles.Multilinetextarea}
            ></TextField>{" "}
          </fieldset>
          <fieldset>
            {" "}
            <legend>Reviewer Comments</legend>{" "}
            <TextField
              multiline={true}
              rows={4}
              disabled={this.state.IsReviewer}
              value={
                this.state.revieweePermission
                  ? ""
                  : this.state.ApepiDetails.E1ER
              }
              onChange={this.onChangeE1ER}
              className={styles.Multilinetextarea}
            ></TextField>
          </fieldset>
        </div>

        {/* SECTION F: AREAS FOR IMPROVEMENT */}
        <div className={styles.divbox}>
          {" "}
          <label className={styles.boxlable}>
            SECTION F: AREAS FOR IMPROVEMENT
          </label>{" "}
        </div>
        <div className={styles.sectionContent}>
          <fieldset>
            {" "}
            <legend>Reviewee Comments</legend>{" "}
            <TextField
              multiline={true}
              rows={4}
              disabled={this.state.IsReviewee}
              value={this.state.ApepiDetails.F1EE}
              onChange={this.onChangeF1EE}
              className={styles.Multilinetextarea}
            ></TextField>{" "}
          </fieldset>
          <fieldset>
            {" "}
            <legend>Reviewer Comments</legend>{" "}
            <TextField
              multiline={true}
              rows={4}
              disabled={this.state.IsReviewer}
              value={
                this.state.revieweePermission
                  ? ""
                  : this.state.ApepiDetails.F1ER
              }
              onChange={this.onChangeF1ER}
              className={styles.Multilinetextarea}
            ></TextField>
          </fieldset>
        </div>

        {/* SECTION G: TRAINING NEEDS */}
        <div className={styles.divbox}>
          {" "}
          <label className={styles.boxlable}>
            SECTION G: TRAINING NEEDS
          </label>{" "}
        </div>
        <div className={styles.sectionContent}>
          <fieldset>
            {" "}
            <legend>Reviewee Comments</legend>
            <TextField
              multiline={true}
              rows={4}
              disabled={this.state.IsReviewee}
              value={this.state.ApepiDetails.G1EE}
              onChange={this.onChangeG1EE}
              className={styles.Multilinetextarea}
            ></TextField>{" "}
          </fieldset>
          <fieldset>
            {" "}
            <legend>Reviewer Comments</legend>
            <TextField
              multiline={true}
              rows={4}
              disabled={this.state.IsReviewer}
              value={
                this.state.revieweePermission
                  ? ""
                  : this.state.ApepiDetails.G1ER
              }
              onChange={this.onChangeG1ER}
              className={styles.Multilinetextarea}
            ></TextField>
          </fieldset>
        </div>

        {/* SECTION H: OVERALL PROJECT PERFORMANCE FEEDBACK */}
        <div className={styles.divbox}>
          {" "}
          <label className={styles.boxlable}>
            SECTION H: OVERALL PROJECT PERFORMANCE FEEDBACK
          </label>{" "}
        </div>
        <div className={styles.sectionContent}>
          <fieldset>
            {" "}
            <legend>Reviewee Comments</legend>
            <TextField
              multiline={true}
              rows={4}
              disabled={this.state.IsReviewee}
              value={this.state.ApepiDetails.H1EE}
              onChange={this.onChangeH1EE}
              className={styles.Multilinetextarea}
            ></TextField>{" "}
          </fieldset>
          <fieldset>
            {" "}
            <legend>Reviewer Comments</legend>
            <TextField
              multiline={true}
              rows={4}
              disabled={this.state.IsReviewer}
              value={
                this.state.revieweePermission
                  ? ""
                  : this.state.ApepiDetails.H1ER
              }
              onChange={this.onChangeH1ER}
              className={styles.Multilinetextarea}
            ></TextField>
          </fieldset>
          <fieldset>
            {" "}
            <legend>Lead MD Comments</legend>
            <TextField
              multiline={true}
              rows={4}
              disabled={this.state.IsLeadMD}
              value={
                this.state.revieweePermission
                  ? ""
                  : this.state.ApepiDetails.H1EL
              }
              onChange={this.onChangeH1EL}
              className={styles.Multilinetextarea}
            ></TextField>
          </fieldset>
        </div>

        {this.props.APEPIDetail.StatusOfReview !=
          Config.StatusOfReview.AwaitingReviewee && (
          <>
            <div className={styles.row}>
              <Label>
                <b>Overall Performance Rating Instructions:</b> To assign the
                Overall Performance Rating, you will need to consider the
                calculated Overall Core Competency Rating as well as identified
                strengths and areas for improvement. After consideration of
                these inputs, you will need to manually assign the Overall
                Performance Rating from the drop-down scale (scale definitions
                provided below).
              </Label>
            </div>

            {/* Deva changes start */}
            <div
              style={{
                position: "relative",
                zIndex: "1000",
                margin: "16px -8px",
              }}
            >
              <Label>
                <b>
                  To view the Overall Performance Rating Scale{" "}
                  <a
                    href="https://itinfoalvarezandmarsal.sharepoint.com/:p:/r/sites/pepiperfmgt/_layouts/15/Doc.aspx?sourcedoc=%7B47314452-203C-4C97-BE9F-ED52EDEB8DDC%7D&file=Overall%20Performance%20Rating%20Scale.pptx&action=edit&mobileredirect=true"
                    target="_blank"
                    data-interception="off"
                  >
                    click here.
                  </a>
                </b>
              </Label>
            </div>
            {/* Deva changes end */}

            {/* <div className={styles.sectionContent}>
              <table className={styles.tablewraper}>
                <tr>
                  <td className={styles.boldlabelSrNewHeader} colSpan={2}>
                    Overall Performance Rating Scale
                  </td>
                  <td className={styles.boldlabelTxtNew}></td>
                </tr>
                <tr>
                  <td className={styles.boldlabelSrNew}>5</td>
                  <td className={styles.boldlabelTxtNew}>Exceptional</td>
                  <td className={styles.boldlabelTxttd}>
                    Consistently exceeds expectations; sought out by clients
                    and/or colleagues for counsel and assistance; widely
                    recognized as a role model and teaches others. Reserved for
                    truly outstanding performers.
                  </td>
                </tr>
                <tr>
                  <td className={styles.boldlabelSrNew}>4</td>
                  <td className={styles.boldlabelTxtNew}>
                    Exceeds Expectation
                  </td>
                  <td className={styles.boldlabelTxttd}>
                    Consistently meets and frequently exceeds expectations;
                    demonstrates strong performance that adds value beyond the
                    scope of the current role.
                  </td>
                </tr>
                <tr>
                  <td className={styles.boldlabelSrNew}>3</td>
                  <td className={styles.boldlabelTxtNew}>Performs Well</td>
                  <td className={styles.boldlabelTxttd}>
                    Consistently meets expectations; demonstrates capable
                    performance and is dependable, competent, and knowledgeable;
                    requires only modest performance adjustment to enhance
                    contribution
                  </td>
                </tr>
                <tr>
                  <td className={styles.boldlabelSrNew}>2</td>
                  <td className={styles.boldlabelTxtNew}>Needs Improvement</td>
                  <td className={styles.boldlabelTxttd}>
                    Inconsistently meets expectations; improvement is needed in
                    one or more significant aspects that are critical to the
                    position.
                  </td>
                </tr>
                <tr>
                  <td className={styles.boldlabelSrNew}>1</td>
                  <td className={styles.boldlabelTxtNew}>Unsatisfactory</td>
                  <td className={styles.boldlabelTxttd}>
                    Seldomly meets expectations; significant improvement is
                    needed in multiple job expectations.
                  </td>
                </tr>
              </table>
            </div> */}
          </>
        )}

        <div className={styles.sectionContent}>
          <div className={styles.sectionContent}>
            <table className={styles.tableWithoutboder}>
              <tr>
                <td></td>
                <td className={styles.tablelable}> Delivery Excellence </td>
                <td className={styles.tablelable}>Value Creation</td>
                <td className={styles.tablelable}> Personal Impact</td>
                <td className={styles.tablelable}> Service Line </td>
                <td className={styles.tablelable}> Overall Core Competency</td>
                {this.state.ApepiDetails.StatusOfReview !=
                  Config.StatusOfReview.AwaitingReviewee && (
                  <td className={styles.tablelable}>
                    {" "}
                    OVERALL PERFORMANCE RATING
                  </td>
                )}
              </tr>
              <tr>
                <td className={styles.tdWith}>
                  <label className={styles.tablelable}>
                    REVIEWEE AVERAGES{" "}
                  </label>
                </td>
                <td
                  style={{
                    textAlign: "center",
                  }}
                >
                  {" "}
                  <label> {Number(this.state.AAvgEE).toFixed(2)}</label>
                </td>
                <td
                  style={{
                    textAlign: "center",
                  }}
                >
                  {" "}
                  <label> {Number(this.state.BAvgEE).toFixed(2)}</label>
                </td>
                <td
                  style={{
                    textAlign: "center",
                  }}
                >
                  {" "}
                  <label> {Number(this.state.CAvgEE).toFixed(2)}</label>
                </td>
                <td
                  style={{
                    textAlign: "center",
                  }}
                >
                  {" "}
                  <label> {Number(this.state.SctionTotalDE).toFixed(2)}</label>
                </td>
                <td
                  style={{
                    textAlign: "center",
                  }}
                >
                  {" "}
                  <label>
                    {" "}
                    {Number(
                      parseFloat(
                        this.getAverageCalculation(
                          // (Number(this.state.AAvgEE) +
                          //   Number(this.state.BAvgEE) +
                          //   Number(this.state.CAvgEE) +
                          //   Number(this.state.SctionTotalDE)) /
                          // 4
                          Number(this.resetNAValue(this.state.AAvgEE)),
                          Number(this.resetNAValue(this.state.BAvgEE)),
                          Number(this.resetNAValue(this.state.CAvgEE)),
                          Number(this.state.SctionTotalDE),
                          0
                        ).toString()
                      )
                    ).toFixed(2)}
                  </label>
                </td>
                {this.state.ApepiDetails.StatusOfReview !=
                  Config.StatusOfReview.AwaitingReviewee && (
                  <td className={styles.doppadding}>
                    <Dropdown
                      disabled={this.state.IsReviewer}
                      options={this.props.Options}
                      selectedKey={
                        this.state.revieweePermission
                          ? 0
                          : Number(this.state.OverallPerformance)
                      }
                      onChange={(e, selectedOption) => {
                        this.OnchangeOverallPerformance(selectedOption.text);
                      }}
                    />
                  </td>
                )}
              </tr>
              {this.props.APEPIDetail.StatusOfReview !=
                Config.StatusOfReview.AwaitingReviewee && (
                <tr>
                  <td className={styles.tdWith}>
                    <label className={styles.tablelable}>
                      REVIEWER AVERAGES
                    </label>
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                    }}
                  >
                    {" "}
                    <label> {Number(this.state.AAvgER).toFixed(2)}</label>
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                    }}
                  >
                    {" "}
                    <label> {Number(this.state.BAvgER).toFixed(2)}</label>
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                    }}
                  >
                    {" "}
                    <label> {Number(this.state.CAvgER).toFixed(2)}</label>
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                    }}
                  >
                    {" "}
                    <label>
                      {" "}
                      {Number(this.state.SctionTotalDR).toFixed(2)}
                    </label>
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                    }}
                  >
                    {" "}
                    <label>
                      {" "}
                      {Number(
                        parseFloat(
                          this.getAverageCalculation(
                            Number(this.resetNAValue(this.state.AAvgER)),
                            Number(this.resetNAValue(this.state.BAvgER)),
                            Number(this.resetNAValue(this.state.CAvgER)),
                            Number(this.state.SctionTotalDR),
                            0
                          ).toString()
                        )
                      ).toFixed(2)}
                    </label>
                  </td>
                </tr>
              )}
            </table>
          </div>
        </div>

        {this.state.IsReviewee && (
          <div className={styles.row}>
            <div className={styles.col25left}>
              <Label>
                <b>DISCUSSION WITH REVIEWEE HELD ON</b>
              </Label>
            </div>
            <div className={styles.col25RightDate}>
              {/* <DateTimePicker
                  dateConvention={DateConvention.Date}
                  timeConvention={TimeConvention.Hours12}
                  timeDisplayControlType={TimeDisplayControlType.Dropdown}
                  showLabels={false}
                  value={this.state.ApepiDetails.PerformanceDiscussion}
                  onChange={this.onchangedPerformanceDiscussionDate}
                /> */}
              <DatePicker
                disabled={
                  // !this.state.IsLeadMD ||
                  // !this.state.IsAcknowledgement ||
                  // !this.state.IsApprovaed ||

                  this.state.IsReviewer
                }
                onSelectDate={this.onchangedPerformanceDiscussionDate}
                value={
                  this.state.revieweePermission
                    ? null
                    : this.state.ApepiDetails.PerformanceDiscussion
                }
                formatDate={this._onFormatDate}
              />
            </div>
            <div></div>
          </div>
        )}

        {!this.state.IsReviewee && (
          <div className={styles.sectionContent}>
            <div className={styles.row}>
              <Label>
                <b>REVIEWEE: </b> Once you select a rating for all drop-down
                fields in the sections above and complete all text areas, the
                Submit button below will highlight in green. If you are ready to
                submit, click <b>Submit to Reviewer for Approval</b>. Not ready
                yet? You can <b>Save Draft</b> to preserve your inputs prior to
                submitting to the Reviewer.
              </Label>
            </div>
            <div className={styles.row}>
              <Label className={styles.Noteunderline}>
                <b>Note : </b>
              </Label>
            </div>
            <div className={styles.row}>
              <Label>
                <b>
                  {" "}
                  To identify a different Reviewer or Lead MD to perform this
                  review,{" "}
                </b>{" "}
                change the corresponding field(s) at the top of this form before
                submitting.
              </Label>
            </div>

            {this.props.hasEditItemPermission && (
              <div className={styles.btncol25leftForReviewer}>
                <div
                  className={styles.divFullWidth}
                  style={{
                    justifyContent: "flex-start",
                  }}
                >
                  <PrimaryButton
                    className={styles.btnSAVEDRAFTForReviewer}
                    text="SAVE DRAFT"
                    onClick={this.onREVIEWEESaveDRAFT}
                  ></PrimaryButton>
                </div>
                <div
                  className={styles.divFullWidth}
                  style={{
                    justifyContent: "flex-start",
                  }}
                >
                  <PrimaryButton
                    disabled={!this.isValidREVIEWEEApproved()}
                    className={
                      this.isValidREVIEWEEApproved()
                        ? styles.btnApproved
                        : styles.btnDisable
                    }
                    text="SUBMIT TO REVIEWER FOR APPROVAL "
                    onClick={this.onREVIEWEEApproved}
                  ></PrimaryButton>
                </div>
              </div>
            )}
            <div className={styles.btncol25leftForReviewer}>
              <Label>
                <b>
                  When you have chosen all the drop-down fields and completed
                  all text areas the Submit button will turn green and be
                  enabled.
                </b>
              </Label>{" "}
            </div>
          </div>
        )}

        {!this.state.IsReviewer && (
          <div className={styles.sectionContent}>
            <div className={styles.row}>
              <Label>
                <b>REVIEWER: </b> Once you select a rating for all drop-down
                fields in the sections above, complete all text areas, choose an{" "}
                <b>Overall Performance Rating and hold a Reviewee discussion</b>
                , the Submit button below will highlight in Green. If you are
                ready to submit, click <b>Submit to Lead MD for Approval</b>.
                Not ready yet? Click <b>Save Draft</b> to preserve your inputs
                prior to submitting to the Lead MD..
              </Label>
            </div>
            <div className={styles.row}>
              <Label className={styles.Noteunderline}>
                <b> Notes : </b>
              </Label>
            </div>
            <div className={styles.row}>
              <Label>
                <b> To revert this form back to the Reviewee,</b> complete the
                gray section below and click <b>Revert to Reviewee</b>.
              </Label>
            </div>
            <div className={styles.row}>
              <Label>
                <b>
                  {" "}
                  To substitute a different Reviewer to perform this review,
                </b>{" "}
                enter the new name at the top of the form and click{" "}
                <b>Replace Me.</b> Your current inputs will be saved, and the
                review will be assigned to the new person.
              </Label>
            </div>
            <div className={styles.row}>
              <Label>
                <b> To identify a new Lead MD,</b>change the Lead MD name at the
                top of this form..
              </Label>
            </div>

            {this.props.hasEditItemPermission && (
              <div className={styles.row}>
                <div className={styles.divLEADMDApproved}>
                  {/* <div className={styles.divFullWidth}> */}
                  <PrimaryButton
                    className={styles.btnSAVEDRAFTForReviewer}
                    text="SAVE DRAFT"
                    onClick={this.onREVIEWERSaveDRAFT}
                  ></PrimaryButton>
                  <PrimaryButton
                    disabled={!this.isValidREVIEWERApproved()}
                    className={
                      this.isValidREVIEWERApproved()
                        ? styles.btnApprovedForReviewer
                        : styles.btnDisable
                    }
                    text="SUBMIT TO LEAD MD FOR APPROVAL "
                    onClick={this.onREVIEWERApproved}
                  ></PrimaryButton>
                  {/* </div> */}
                </div>
                <div className={styles.btncol25leftForReviewer}>
                  <Label>
                    <b>
                      When you have chosen all the drop-down fields, completed
                      all text areas, selected an Overall Performance Rating and
                      held a Reviewee discussion the Submit button will turn
                      green and be enabled.
                    </b>
                  </Label>
                </div>
              </div>
            )}
            {this.props.hasEditItemPermission && (
              <div className={styles.rowOptionalReversion}>
                <div className={styles.col25left}>
                  <Label> Optional Reversion Comment (visible)</Label>
                </div>
                <div className={styles.col25left}>
                  {" "}
                  <textarea
                    style={{
                      width: "100%",
                    }}
                    // value={this.state.ApepiDetails.RevertToReviewee}
                    onChange={this.onChangeRevertToReviewee}
                  ></textarea>{" "}
                </div>
                <div className={styles.col25left}>
                  <PrimaryButton
                    className={styles.btnREVERT}
                    text="REVERT TO REVIEWEE"
                    onClick={this.onREVERTTOREVIEEE}
                  >
                    {" "}
                  </PrimaryButton>{" "}
                </div>
              </div>
            )}
          </div>
        )}
        {!this.state.IsLeadMD && (
          <div className={styles.row}>
            <div className={styles.row}>
              <Label>
                <b>LEAD MD: </b>When you have finished assessing the review,
                click <b>Submit to Reviewee for Acknowledgment.</b>
              </Label>
            </div>
            <div className={styles.row}>
              <Label className={styles.Noteunderline}>
                <b>Notes : </b>
              </Label>
            </div>
            <div className={styles.row}>
              <Label>
                <b> To revert this form back to the Reviewer,</b> complete the
                gray section below and click<b> Revert to Reviewer. </b>
              </Label>
            </div>
            <div className={styles.row}>
              <Label>
                <b>
                  {" "}
                  To substitute a different Lead MD to perform this review,
                </b>{" "}
                enter the new name at the top of the form and click{" "}
                <b> Replace Me. </b>Your current inputs will be saved, and the
                review will be assigned to the new person.
              </Label>
            </div>

            <div className={styles.divbtnREVIEWEEFORAcknowledgment}>
              {this.props.hasEditItemPermission && (
                <div className={styles.divFullWidth}>
                  <PrimaryButton
                    style={{
                      justifyContent: "flex-start",
                    }}
                    disabled={!this.state.ApepiDetails.H1EL}
                    className={
                      this.state.ApepiDetails.H1EL
                        ? styles.btnApproved
                        : styles.btnDisable
                    }
                    // className={styles.btnApproved}
                    text="SUBMIT TO REVIEWEE FOR ACKNOWLEDGEMENT "
                    onClick={this.onLEADMDApproved}
                  ></PrimaryButton>
                </div>
              )}
            </div>
            {this.props.hasEditItemPermission && (
              <div className={styles.rowOptionalReversion}>
                <div className={styles.col25left}>
                  <Label> Optional Reversion Comment (visible)</Label>
                </div>
                <div className={styles.col25left}>
                  {" "}
                  <textarea
                    style={{
                      width: "100%",
                    }}
                    // value={this.state.ApepiDetails.RevertToReviewer}
                    onChange={this.onChangeRevertToReviewer}
                  ></textarea>{" "}
                </div>
                <div className={styles.col25left}>
                  <PrimaryButton
                    className={styles.btnREVERT}
                    text="REVERT TO REVIEWER"
                    onClick={this.onREVERTTOREVIEER}
                  >
                    {" "}
                  </PrimaryButton>{" "}
                </div>
              </div>
            )}
          </div>
        )}
        {!this.state.IsAcknowledgement && (
          <div className={styles.sectionContent}>
            <div className={styles.row}>
              <Label>
                <b>REVIEWEE: </b>When you have finished reviewing the
                performance appraisal, complete the section below and click{" "}
                <b> Submit Final Review. </b>
              </Label>
            </div>
            <div className={styles.row}>
              <Label>
                <b>REVIEWEE ACKNOWLEDGEMENT COMMENTS: </b>(Comments are optional
                and visible to the Reviewer and Lead MD.)
              </Label>
            </div>
            <div>
              <fieldset>
                {" "}
                <legend></legend>{" "}
                <textarea
                  className={styles.Multilinetextarea}
                  onChange={this.onChangeAcknowledgement}
                  value={this.state.ApepiDetails.AcknowledgementComments}
                ></textarea>
              </fieldset>
            </div>
            {this.props.hasEditItemPermission && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div className={styles.col25left}>
                  <PrimaryButton
                    className={styles.btnSAVEDRAFT}
                    text="SAVE DRAFT"
                    onClick={this.onFinalSAVEDRAFT}
                  ></PrimaryButton>
                </div>
                <div className={styles.col25left}>
                  <PrimaryButton
                    className={styles.btnApproved}
                    text="SUBMIT TO FINAL REVIEW "
                    onClick={this.onSUBMITTOFINALREVIEW}
                  ></PrimaryButton>
                </div>
              </div>
            )}
          </div>
        )}

        {/* {this.state.IsReviewee && ( */}
        <div className={styles.divFullWidth}>
          <fieldset className={styles.divFullWidth}>
            {" "}
            <legend>Signoff History</legend>{" "}
            <textarea
              disabled={true}
              value={this.state.ApepiDetails.SignoffHistory}
              className={styles.Multilinetextarea}
            ></textarea>
          </fieldset>
        </div>
        {/* )} */}
      </div>
    );
  }
}
