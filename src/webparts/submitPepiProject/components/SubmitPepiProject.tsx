import * as React from "react";
import styles from "./SubmitPepiProject.module.scss";
import { ISubmitPepiProjectProps } from "./ISubmitPepiProjectProps";
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
import {
  PeoplePicker,
  PrincipalType,
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { ISubmitPEPIprojectState } from "./ISubmitPEPIprojectState";
import { PEPI_PEPIDetails } from "../../../domain/models/PEPI_PEPIDetails";
import { PEPI_QuestionText } from "../../../domain/models/PEPI_QuestionText";

import SeniorDirector from "../components/PEPIAnalyticsStages/SeniorDirector";
import Director from "../components/PEPIAnalyticsStages/Director";
import SeniorAssociate from "../components/PEPIAnalyticsStages/SeniorAssociate";
import Associate from "../components/PEPIAnalyticsStages/Associate";
import Analytics from "../components/PEPIAnalyticsStages/Analytics";
import Manager from "../components/PEPIAnalyticsStages/Manager";

import MapResult from "../../../domain/mappers/MapResult";
import { User } from "../../../domain/models/types/User";
import { Config } from "../../../globals/Config";
import { Enums } from "../../../globals/Enums";
import ListItemService from "../../../services/ListItemService";
import UserService from "../../../services/UserService";
import WebService from "../../../services/WebService";
import { PEPI_PEPIQuestionText } from "../../../domain/models/PEPI_PEPIQuestionText";
import QuestionText from "../components/PEPIAllQuestionText/QuestionText";

export default class SubmitPepiProject extends React.Component<
  ISubmitPepiProjectProps,
  ISubmitPEPIprojectState
> {
  private Options: IDropdownOption[] = [];
  private ServiceLineOptions: IDropdownOption[] = [];
  private ComplexityOptions: IDropdownOption[] = [];
  private listPEPIProjectsItemService: ListItemService;
  private listQuestionItemService: ListItemService;
  private listGetServiceLine: ListItemService;
  private userService: UserService;
  private webService: WebService;
  private hasEditItemPermission: boolean = true;
  constructor(props: any) {
    super(props);
    // this._childSelect = this._childSelect.bind(this);
    this.state = {
      IsCreateMode:
        this.props.ItemID == undefined ||
        this.props.ItemID == null ||
        this.props.ItemID == 0
          ? true
          : false,
      //CurrentUserRoles: [],
      hasEditItemPermission: false,
      IsLoading: true,
      AppContext: this.props.AppContext,
      CurrentUserRoles: [],
      DisableSubmitButton: true,
      PEPIDetails: new PEPI_PEPIDetails(),
      PEPIQuestionText: new PEPI_QuestionText(),
      TempPEPIQuestionText: [],
      SubmitCompleted: false,
      SubmitStarted: false,
      IsAnalyticsDisable: false,
      DisableNewFormOprtion: false,
      IsSelectedEmployeeInvalid: false,
      LeadMDEmail: "",
      ReviewerEmail: "",
      RevieweeName: "",
      ReplaceUsermail: "",

      SctionTotalDE: 0,
      SctionTotalDR: 0,
      ComplexityOptions: "",
    };
    this.onSTARTREVIEWSave = this.onSTARTREVIEWSave.bind(this);
    this.onDecline = this.onDecline.bind(this);
    this.onChangeReviewerName = this.onChangeReviewerName.bind(this);
    this.onChangeLeadMDName = this.onChangeLeadMDName.bind(this);
    this.onChangeServiceLineValue = this.onChangeServiceLineValue.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  private onFormFieldValueChange(updateDetails: PEPI_PEPIDetails) {
    let allowSave: boolean = true;
    this.setState({
      PEPIDetails: updateDetails,
      DisableNewFormOprtion: !allowSave,
    });
  }
  public async componentDidMount() {
    //alert("hi 1");
    let DESum = 0;
    let DRSum = 0;
    // this.Options = [{ text: '0', key: 0 }, { text: '1', key: 1 }, { text: '2', key: 2 }, { text: '3', key: 3 }, { text: '4', key: 4 }];
    this.Options = [
      { text: "", key: 0 },
      { text: "NA", key: 0.5 },
      { text: "1", key: 1 },
      { text: "1.5", key: 1.5 },
      { text: "2", key: 2 },
      { text: "2.5", key: 2.5 },
      { text: "3", key: 3 },
      { text: "3.5", key: 3.5 },
      { text: "4", key: 4 },
      { text: "4.5", key: 4.5 },
      { text: "5", key: 5 },
    ];
    ////debugger;
    this.FillServiceLineOptions();
    this.userService = new UserService(this.props.AppContext);
    this.webService = new WebService(this.props.AppContext);
    const userRoles: Enums.UserRoles[] = await this.GetCurrentUserRoles();

    /// debugger;

    if (this.state.IsCreateMode) {
      this.setState({ IsAnalyticsDisable: true });
      let curretState = this.state.PEPIDetails;
      curretState.ServiceLine = "Please select a value";
      this.setState({ PEPIDetails: curretState });
    } else {
      let curretState = this.state.PEPIDetails;
      curretState.ServiceLine =
        !curretState.ServiceLine ||
        curretState.ServiceLine == "" ||
        curretState.ServiceLine == null
          ? "Please select a value"
          : curretState.ServiceLine;

      this.setState({ IsAnalyticsDisable: false });
      this.setState({
        DisableNewFormOprtion: this.state.PEPIDetails.StatusOfReview == "",
      });

      this.listPEPIProjectsItemService = new ListItemService(
        this.props.AppContext,
        Config.ListNames.PEPIProjects
      );
      this.hasEditItemPermission =
        await this.listPEPIProjectsItemService.CheckCurrentUserCanEditItem(
          this.props.ItemID
        );
      this.listQuestionItemService = new ListItemService(
        this.props.AppContext,
        Config.ListNames.QuestionText
      );
      const pepiDetails: PEPI_PEPIDetails =
        await this.listPEPIProjectsItemService.getItemUsingCAML(
          this.props.ItemID,
          [],
          undefined,
          Enums.ItemResultType.PEPI_PEPIDetails
        );
      // const AllpepiQuestionText;

      //if (pepiDetails.JobTitle != undefined && pepiDetails.ServiceLine != undefined) {
      const AllpepiQuestionText: PEPI_QuestionText[] =
        await this.listQuestionItemService.getQuestionTextItemUsingCAML(
          pepiDetails.ServiceLine,
          pepiDetails.JobTitle,
          [],
          undefined,
          Enums.ItemResultType.PEPI_QuestionText
        );
      //}
      const commaD11E =
        pepiDetails.D11E == undefined ? [] : pepiDetails.D11E.split(";");
      const commaD11R =
        pepiDetails.D11R == undefined ? [] : pepiDetails.D11R.split(";");

      let QuestionText: any[] = [];
      if (AllpepiQuestionText != undefined) {
        //  debugger;
        var j = 0;
        for (var i = 0; i < Object.keys(AllpepiQuestionText).length; i++) {
          if (Object.keys(AllpepiQuestionText)[i].indexOf("Q") == 0) {
            var qData = {};
            qData["QuestionText"] =
              AllpepiQuestionText[Object.keys(AllpepiQuestionText)[i]];
            let DE = commaD11E[j] == undefined ? 0 : commaD11E[j];
            let DR = commaD11R[j] == undefined ? 0 : commaD11R[j];
            qData["Reviewee"] = DE;
            qData["Reviewer"] = DR;
            qData["Difference"] = Number(DR) - Number(DE);
            j++;
            QuestionText.push(qData);
          }
        }
        for (let index = 0; index < commaD11E.length; index++) {
          DESum = DESum + Number(commaD11E[index]);
        }
        for (let index = 0; index < commaD11R.length; index++) {
          DRSum = DRSum + Number(commaD11R[index]);
        }
      }
      let AvgDE = 0;
      let AvgDR = 0;
      if (commaD11E.length > 0) {
        AvgDE = DESum / commaD11E.length;
      }
      if (commaD11R.length > 0) {
        AvgDR = DRSum / commaD11R.length;
      }
      pepiDetails.ServiceLine =
        pepiDetails.ServiceLine == "" || !pepiDetails.ServiceLine
          ? "Please select a value"
          : pepiDetails.ServiceLine;
      this.setState({
        IsLoading: false,
        CurrentUserRoles: userRoles,
        PEPIDetails: pepiDetails,
        LeadMDEmail: pepiDetails.LeadMD.Email,
        ReviewerEmail: pepiDetails.Reviewer.Email,
        RevieweeName: pepiDetails.Reviewee.Title,

        ReplaceUsermail: pepiDetails.Replaceme.Email,
        TempPEPIQuestionText: QuestionText,
        SctionTotalDE: AvgDE,
        SctionTotalDR: AvgDR,
        hasEditItemPermission: this.hasEditItemPermission,
      });
      console.log(QuestionText);
    }
    if (
      this.state.PEPIDetails.ServiceLine != "Please select a value" &&
      this.state.PEPIDetails.ServiceLine != "" &&
      this.state.PEPIDetails.ServiceLine != undefined &&
      this.state.LeadMDEmail != "" &&
      this.state.ReviewerEmail != ""
    ) {
      this.setState({ DisableSubmitButton: false });
    } else {
      this.setState({ DisableSubmitButton: true });
    }
  }
  private async FillServiceLineOptions() {
    //debugger;
    this.listGetServiceLine = new ListItemService(
      this.props.AppContext,
      Config.ListNames.PEPIProjects
    );
    let GetServiceLine = await this.listGetServiceLine.getFieldChoices(
      Config.PEPIProjectsListColumns.ServiceLines
    );
    let GetServiceLineOption: any[] = [];

    var qData = {};
    qData["text"] = "Please select a value";
    qData["key"] = "Please select a value";
    GetServiceLineOption.push(qData);

    if (GetServiceLine != undefined) {
      var j = 0;
      for (var i = 0; i < Object.keys(GetServiceLine).length; i++) {
        var qData = {};
        qData["text"] = GetServiceLine[Object.keys(GetServiceLine)[i]];
        qData["key"] = GetServiceLine[Object.keys(GetServiceLine)[i]];
        GetServiceLineOption.push(qData);
      }
    }
    // debugger;
    this.ServiceLineOptions = GetServiceLineOption;
    //this.ServiceLineOptions = [{ text: 'COMOPS', key: 'COMOPS' }, { text: ' MAS -Merger integration', key: ' MAS -Merger integration' }, { text: 'MAS - Human Capital', key: 'MAS - Human Capital' }, { text: 'MAS - information Technology', key: 'MAS - information Technology' }, { text: 'CFO Scs', key: 'CFO Scs' }, { text: 'IRAS', key: 'IRAS' }, { text: 'Other', key: 'Other' }];
    this.ComplexityOptions = [
      { text: "Low", key: "Low" },
      { text: "Medium", key: "Medium" },
      { text: "High", key: "High" },
    ];
  }
  // Deciding the roles associated with current user
  private async GetCurrentUserRoles(): Promise<Enums.UserRoles[]> {
    let result: Enums.UserRoles[] = [];
    // Checking user is site collection admin  or member of 'DI Admin Group'
    const isSiteCollectionAdmin: boolean =
      await this.userService.CheckCurrentUserIsAdmin();
    const ownerGroupName: string =
      await this.webService.GetAssociatedOwnerGroupName();
    const isMemberOfOwnersGroup: boolean =
      await this.userService.CheckCurrentUserInSPGroup(ownerGroupName);
    if (isSiteCollectionAdmin || isMemberOfOwnersGroup) {
      result.push(Enums.UserRoles.SuperAdmin);
    }
    return result;
  }
  private async onChangeReviewerName(items: any[]) {
    // debugger;
    let PEPIDetails = this.state.PEPIDetails;
    if (items != null && items.length > 0) {
      PEPIDetails.Reviewer = await MapResult.map(
        items[0],
        Enums.MapperType.PnPControlResult,
        Enums.ItemResultType.User
      );
    } else {
      PEPIDetails.Reviewer = new User();
      this.setState({ IsSelectedEmployeeInvalid: true });
    }
    this.setState({ ReviewerEmail: PEPIDetails.Reviewer.Email });
    this.onFormFieldValueChange(PEPIDetails);
    if (
      this.state.PEPIDetails.ServiceLine != "Please select a value" &&
      this.state.PEPIDetails.ServiceLine != "" &&
      this.state.PEPIDetails.ServiceLine != undefined &&
      this.state.LeadMDEmail != "" &&
      PEPIDetails.Reviewer.Email != ""
    ) {
      this.setState({ DisableSubmitButton: false });
    } else {
      this.setState({ DisableSubmitButton: true });
    }
  }
  private async onChangeLeadMDName(items: any[]) {
    // debugger;
    let PEPIDetails = this.state.PEPIDetails;
    if (items != null && items.length > 0) {
      PEPIDetails.LeadMD = await MapResult.map(
        items[0],
        Enums.MapperType.PnPControlResult,
        Enums.ItemResultType.User
      );
    } else {
      PEPIDetails.LeadMD = new User();
      this.setState({ IsSelectedEmployeeInvalid: true });
    }
    this.setState({ LeadMDEmail: PEPIDetails.LeadMD.Email });
    //this.onFormFieldValueChange(PEPIDetails);
    if (
      this.state.PEPIDetails.ServiceLine != "Please select a value" &&
      this.state.PEPIDetails.ServiceLine != "" &&
      this.state.PEPIDetails.ServiceLine != undefined &&
      PEPIDetails.LeadMD.Email != "" &&
      this.state.ReviewerEmail != ""
    ) {
      this.setState({ DisableSubmitButton: false });
    } else {
      this.setState({ DisableSubmitButton: true });
    }
  }

  public async onChangeServiceLineValue(newValue: string) {
    let curretState = this.state.PEPIDetails;
    curretState.ServiceLine = newValue;
    this.setState({
      PEPIDetails: curretState,
    });
    if (
      this.state.PEPIDetails.ServiceLine != "Please select a value" &&
      this.state.PEPIDetails.ServiceLine != undefined &&
      this.state.LeadMDEmail != "" &&
      this.state.ReviewerEmail != ""
    ) {
      this.setState({ DisableSubmitButton: false });
    } else {
      this.setState({ DisableSubmitButton: true });
    }
  }

  public async onChangeComplexity(newValue: string) {
    let curretState = this.state.PEPIDetails;
    curretState.Complexity = newValue;
    this.setState({
      PEPIDetails: curretState,
    });
  }
  private onChangeHoursWorked(event) {
    // debugger;
    let curretState = this.state.PEPIDetails;
    curretState.HoursWorked = event.target.value;
    this.setState({
      PEPIDetails: curretState,
    });
  }
  private async onDecline(): Promise<void> {
    let data = {};
    const columns = Config.PEPIProjectsListColumns;
    data[columns.StatusOfReview] = Config.StatusOfReview.Declined;
    this.listPEPIProjectsItemService = new ListItemService(
      this.props.AppContext,
      Config.ListNames.PEPIProjects
    );
    await this.listPEPIProjectsItemService.updateItem(this.props.ItemID, data);
    this.gotoListPage();
  }
  // private async onSTARTREVIEWSave(): Promise<void> {
  //   const pepiDetails = this.state.PEPIDetails;
  //   let data = {};
  //   const columns = Config.PEPIProjectsListColumns;
  //   data[Config.BaseColumns.Title] = ".";
  //   data[columns.RevieweeNameId] = pepiDetails.Reviewer.Id;
  //   data[columns.LeadMDNameId] = pepiDetails.LeadMD.Id;
  //   data[columns.ReviewerNameId] = pepiDetails.Reviewer.Id;
  //   data[columns.ServiceLines] = pepiDetails.ServiceLine;
  //   data[columns.StatusOfReview] = Config.StatusOfReview.AwaitingReviewee;
  //   data[columns.Submitted] = Config.SubmittedNumber[99];

  //   this.listPEPIProjectsItemService = new ListItemService(
  //     this.props.AppContext,
  //     Config.ListNames.PEPIProjects
  //   );
  //   if (this.state.IsCreateMode || !this.state.PEPIDetails.StatusOfReview) {
  //     // Creating item
  //     await this.listPEPIProjectsItemService.createItem(data);
  //     this.gotoListPage();
  //   }
  // }
  private async onSTARTREVIEWSave(): Promise<void> {
    const pepiDetails = this.state.PEPIDetails;
    let data = {};
    const columns = Config.PEPIProjectsListColumns;
    // data[Config.BaseColumns.Title] = ".";
    data[columns.RevieweeNameId] = pepiDetails.Reviewer.Id;
    data[columns.LeadMDNameId] = pepiDetails.LeadMD.Id;
    data[columns.ReviewerNameId] = pepiDetails.Reviewer.Id;
    data[columns.ServiceLines] = pepiDetails.ServiceLine;
    data[columns.StatusOfReview] = Config.StatusOfReview.AwaitingReviewee;
    data[columns.Submitted] = Config.SubmittedNumber[99];

    this.listPEPIProjectsItemService = new ListItemService(
      this.props.AppContext,
      Config.ListNames.PEPIProjects
    );
    if (this.state.IsCreateMode || !this.state.PEPIDetails.StatusOfReview) {
      // Creating item
      await this.listPEPIProjectsItemService.updateItem(
        this.props.ItemID,
        data
      );
      this.gotoListPage();
    }
  }
  private async onCancel(): Promise<void> {
    this.gotoListPage();
  }
  // Redirect user to 'Employee Summary' Listing page
  private gotoListPage() {
    let returnURL =
      this.props.AppContext.pageContext.web.absoluteUrl +
      Config.Links.HomePageLink;
    window.location.href = returnURL;
    return false;
  }
  public render(): React.ReactElement<ISubmitPepiProjectProps> {
    return (
      <React.Fragment>
        <div className={styles.SubmitPepiProject}>
          <div className={styles.container}>
            <div className={styles.logoImg} title="logo"></div>

            {/* Basic Project/Staff Info */}

            {/* New From */}
            {this.state.IsCreateMode && (
              <div>
                <div className={styles.row}>
                  <div className={styles.Newcol25Right}>
                    <Label>
                      <b>Reviewee: </b>
                    </Label>
                  </div>
                  <div className={styles.Newcol25left}>
                    <Label> {this.state.RevieweeName}</Label>
                  </div>
                  <div className={styles.Newcol25Right}>
                    <Label>
                      <b>Hours Worked: </b>
                    </Label>
                  </div>
                  <div className={styles.Newcol25left}>
                    <Label></Label>
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.Newcol25Right}>
                    {" "}
                    <Label>
                      <b>Engagement: </b>
                    </Label>
                  </div>
                  <div className={styles.Newcol25left}>
                    {" "}
                    <Label>{this.state.PEPIDetails.Title}</Label>
                  </div>
                  <div className={styles.Newcol25Right}>
                    {" "}
                    <Label>
                      <b>Job Role:</b>
                    </Label>
                  </div>
                  <div className={styles.Newcol25left}>
                    {" "}
                    <Label>{this.state.PEPIDetails.JobTitle}</Label>
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.Newcol25Right}>
                    {" "}
                    <Label>
                      <b>Project Code: </b>
                    </Label>
                  </div>
                  <div className={styles.Newcol25left}>
                    {" "}
                    <Label>{this.state.PEPIDetails.ProjectCode}</Label>
                  </div>
                  <div className={styles.col25leftServiceLine}>
                    <Label>
                      <b>Service Line: </b>
                      <span style={{ color: "#ff0000" }}>*</span>
                    </Label>
                  </div>
                  <div className={styles.Newcol25left}>
                    <Dropdown
                      placeholder="Please select a value"
                      className={styles.dropServiceLine}
                      options={this.ServiceLineOptions}
                      selectedKey={this.state.PEPIDetails.ServiceLine}
                      onChange={(e, selectedOption) => {
                        this.onChangeServiceLineValue(selectedOption.text);
                      }}
                      disabled={
                        this.state.PEPIDetails.StatusOfReview != ""
                          ? true
                          : false
                      }
                      // disabled={this.state.DisableNewFormOprtion}
                    />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.Newcol25Right}>
                    {" "}
                    <Label>
                      <b>Home Office: </b>
                    </Label>
                  </div>
                  <div className={styles.Newcol25left}>
                    {" "}
                    <Label>{this.state.PEPIDetails.HomeOffice}</Label>
                  </div>
                </div>

                <div className={styles.container}>
                  <div className={styles.divCompetency}>
                    <Label>
                      <b>INSTRUCTIONS:</b> To start a review, Select the Service
                      Line you are assigned to, enter the Reviewer’s name
                      (starting with the last name, first name) in the Reviewer
                      box below. The Lead MD has been pre-populated from the
                      project data imported from Agresso, but you have the
                      option to change the Lead MD if needed. Once completed,
                      click Start Review.
                    </Label>
                  </div>
                </div>
                <div className={styles.row}>
                  <div
                    className={
                      this.state.PEPIDetails.StatusOfReview ==
                      Config.StatusOfReview.AwaitingReviewer
                        ? styles.col25leftReplaseMe
                        : styles.col25left
                    }
                  >
                    <Label>
                      <b>Reviewer Name:</b>
                      <span style={{ color: "#ff0000" }}>*</span>
                    </Label>
                  </div>
                  <div
                    className={
                      this.state.PEPIDetails.StatusOfReview ==
                      Config.StatusOfReview.AwaitingLeadMD
                        ? styles.col25leftReplaseMe
                        : styles.col25left
                    }
                  >
                    <Label>
                      <b>Lead MD:</b>
                      <span style={{ color: "#ff0000" }}>*</span>
                    </Label>
                  </div>
                </div>
              </div>
            )}

            {/* Edit From */}
            {!this.state.IsCreateMode && (
              <div>
                <div className={styles.row}>
                  <div className={styles.Newcol25Right}>
                    <Label>
                      <b>Reviewee: </b>
                    </Label>
                  </div>
                  <div className={styles.Newcol25left}>
                    <Label> {this.state.RevieweeName}</Label>
                  </div>
                  <div className={styles.Newcol25Right}>
                    {" "}
                    <Label>
                      <b>Job Role:</b>
                    </Label>
                  </div>
                  <div className={styles.Newcol25left}>
                    {" "}
                    <Label>{this.state.PEPIDetails.JobTitle}</Label>
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.Newcol25Right}>
                    {" "}
                    <Label>
                      <b>Engagement: </b>
                    </Label>
                  </div>
                  <div className={styles.Newcol25left}>
                    {" "}
                    <Label>{this.state.PEPIDetails.Title}</Label>
                  </div>
                  <div className={styles.Newcol25Right}>
                    {" "}
                    <Label>
                      <b>Fiscal Year: </b>
                    </Label>
                  </div>
                  <div className={styles.Newcol25left}>
                    {" "}
                    <Label>{this.state.PEPIDetails.FiscalYear}</Label>
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.Newcol25Right}>
                    {" "}
                    <Label>
                      <b>Project Code: </b>
                    </Label>
                  </div>
                  <div className={styles.Newcol25left}>
                    {" "}
                    <Label>{this.state.PEPIDetails.ProjectCode}</Label>
                  </div>
                  <div className={styles.Newcol25Right}>
                    {" "}
                    <Label>
                      <b>Home Office: </b>
                    </Label>
                  </div>
                  <div className={styles.Newcol25left}>
                    {" "}
                    <Label>{this.state.PEPIDetails.HomeOffice}</Label>
                  </div>
                </div>
                <div className={styles.row}>
                  {/* <div className={styles.Newcol25Right}>
                    <Label></Label>
                  </div>
                  <div className={styles.Newcol25left}>
                    <Label></Label>
                  </div> */}
                  <div className={styles.Newcol25Right}>
                    {" "}
                    <Label>
                      <b>Hours Worked: </b>
                    </Label>
                  </div>
                  <div className={styles.Newcol25left}>
                    {" "}
                    <Label>{this.state.PEPIDetails.HoursWorked}</Label>
                  </div>
                  <div className={styles.col25leftServiceLine}>
                    <Label>
                      <b>Service Line: </b>
                      <span style={{ color: "#ff0000" }}>*</span>
                    </Label>
                  </div>
                  <div className={styles.Newcol25left}>
                    <Dropdown
                      disabled={
                        this.state.PEPIDetails.StatusOfReview != ""
                          ? true
                          : false
                      }
                      className={styles.dropServiceLine}
                      options={this.ServiceLineOptions}
                      selectedKey={this.state.PEPIDetails.ServiceLine}
                      onChange={(e, selectedOption) => {
                        this.onChangeServiceLineValue(selectedOption.text);
                      }}
                      // disabled={this.state.DisableNewFormOprtion}
                    />
                  </div>
                </div>
                {!this.state.IsCreateMode &&
                  // <div className={styles.row}>
                  //   <div className={styles.Newcol25Right}>
                  //     <Label>
                  //       <b>Hours Worked: </b>
                  //     </Label>
                  //   </div>
                  //   <div className={styles.Newcol25left}>
                  //     <Label>{this.state.PEPIDetails.HoursWorked}</Label>
                  //     {/* <input
                  //       type="Number"
                  //       value={this.state.PEPIDetails.HoursWorked}
                  //       onChange={this.onChangeHoursWorked}
                  //     /> */}
                  //   </div>
                  //   <div className={styles.Newcol25Right}>
                  //     <Label></Label>
                  //   </div>
                  //   <div className={styles.Newcol25Right}>
                  //     <Label></Label>
                  //   </div>
                  // </div>
                  null}
                <div className={styles.container}>
                  <div className={styles.divCompetency}>
                    <Label>
                      <b>INSTRUCTIONS:</b> To start a review, Select the Service
                      Line you are assigned to, enter the Reviewer’s name
                      (starting with the last name, first name) in the Reviewer
                      box below. The Lead MD has been pre-populated from the
                      project data imported from Agresso, but you have the
                      option to change the Lead MD if needed. Once completed,
                      click Start Review.
                    </Label>
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.divCompetency}>
                    <div className={styles.highlightedInstruction}>
                      {this.state.PEPIDetails.StatusOfReview ==
                        Config.StatusOfReview.Split && (
                        <b>
                          This review was split into at least one additional
                          review.
                        </b>
                      )}
                      {this.state.PEPIDetails.StatusOfReview ==
                        Config.StatusOfReview.Combined && (
                        <b>This review is now a part of a Combined Review.</b>
                      )}
                      {this.state.PEPIDetails.StatusOfReview ==
                        Config.StatusOfReview.Declined && (
                        <b>
                          This review was declined by{" "}
                          {this.state.PEPIDetails.ModifiedBy.Title} on{" "}
                          {this.state.PEPIDetails.ModifiedOnFormatted}
                        </b>
                      )}
                    </div>
                  </div>
                </div>

                {this.state.PEPIDetails.StatusOfReview !=
                  Config.StatusOfReview.Split &&
                  this.state.PEPIDetails.StatusOfReview !=
                    Config.StatusOfReview.Combined &&
                  this.state.PEPIDetails.StatusOfReview !=
                    Config.StatusOfReview.Declined && (
                    <div className={`${styles.row} ${styles.dFlex}`}>
                      <div
                        className={
                          this.state.PEPIDetails.StatusOfReview ==
                          Config.StatusOfReview.AwaitingReviewer
                            ? styles.col25leftReplaseMe
                            : styles.col25left
                        }
                      >
                        <Label>
                          <b>Reviewer Name:</b>
                          <span style={{ color: "#ff0000" }}>*</span>
                        </Label>
                        <div
                          className={
                            this.state.PEPIDetails.StatusOfReview
                              ? styles.clsPeoplepicker
                              : styles.clsPeoplepickerEnable
                          }
                        >
                          <PeoplePicker
                            context={this.props.AppContext}
                            personSelectionLimit={1}
                            groupName={""} // Leave this blank in case you want to filter from all users
                            showtooltip={true}
                            ensureUser={true}
                            showHiddenInUI={false}
                            principalTypes={[PrincipalType.User]}
                            selectedItems={this.onChangeReviewerName}
                            defaultSelectedUsers={[this.state.ReviewerEmail]}
                            disabled={this.state.DisableNewFormOprtion}
                            resolveDelay={1000}
                          />
                        </div>
                      </div>
                      <div
                        className={
                          this.state.PEPIDetails.StatusOfReview ==
                          Config.StatusOfReview.AwaitingLeadMD
                            ? styles.col25leftReplaseMe
                            : styles.col25left
                        }
                      >
                        <Label>
                          <b>Lead MD:</b>
                          <span style={{ color: "#ff0000" }}>*</span>
                        </Label>
                        <div
                          className={
                            this.state.PEPIDetails.StatusOfReview
                              ? styles.clsPeoplepicker
                              : styles.clsPeoplepickerEnable
                          }
                        >
                          <PeoplePicker
                            context={this.props.AppContext}
                            personSelectionLimit={1}
                            groupName={""} // Leave this blank in case you want to filter from all users
                            showtooltip={true}
                            ensureUser={true}
                            showHiddenInUI={false}
                            principalTypes={[PrincipalType.User]}
                            resolveDelay={1000}
                            selectedItems={this.onChangeLeadMDName}
                            disabled={this.state.DisableNewFormOprtion}
                            defaultSelectedUsers={[this.state.LeadMDEmail]}
                          />
                        </div>
                      </div>
                      {!this.state.IsCreateMode &&
                        this.state.PEPIDetails.StatusOfReview != "" &&
                        this.state.PEPIDetails.StatusOfReview && (
                          // <div>
                          <>
                            <div className={styles.col25left}>
                              <Label>
                                <b>Complexity:</b>
                              </Label>
                              <div>
                                <Dropdown
                                  options={this.ComplexityOptions}
                                  selectedKey={
                                    this.state.PEPIDetails.Complexity
                                  }
                                  onChange={(e, selectedOption) => {
                                    this.onChangeComplexity(
                                      selectedOption.text
                                    );
                                  }}
                                />{" "}
                              </div>
                            </div>
                            <div className={styles.col25left}>
                              <Label>
                                <b>Review Status:</b>
                              </Label>
                              <div>
                                <Label>
                                  {this.state.PEPIDetails.StatusOfReview}
                                </Label>
                              </div>
                            </div>
                          </>
                          // </div>
                        )}

                      {!this.state.PEPIDetails.StatusOfReview &&
                        Number(this.state.PEPIDetails.HoursWorked) < 80 && (
                          // this.state.PEPIDetails.StatusOfReview == "" &&
                          // <div className={styles.col25left}>\
                          // <PrimaryButton text="START REVIEW" aria-disabled={this.state.DisableSaveButton} disabled={this.state.DisableSaveButton} hidden={this.state.DisableSaveButton} onClick={this.onSTARTREVIEWSave} ></PrimaryButton>
                          // </div>
                          <div className={styles.col25left}>
                            You may choose to Decline the entire review
                          </div>
                        )}

                      {!this.state.PEPIDetails.StatusOfReview && (
                        // this.state.PEPIDetails.StatusOfReview == "" &&
                        // <div className={styles.col25left}>\
                        // <PrimaryButton text="START REVIEW" aria-disabled={this.state.DisableSaveButton} disabled={this.state.DisableSaveButton} hidden={this.state.DisableSaveButton} onClick={this.onSTARTREVIEWSave} ></PrimaryButton>
                        // </div>
                        <div
                          className={`${styles.col25left} ${styles.SubmitDeclineBtnSection}`}
                        >
                          {!this.state.PEPIDetails.StatusOfReview &&
                            Number(this.state.PEPIDetails.HoursWorked) < 80 && (
                              // this.state.PEPIDetails.StatusOfReview == "" &&
                              // <div className={styles.col25left}>\
                              // <PrimaryButton text="START REVIEW" aria-disabled={this.state.DisableSaveButton} disabled={this.state.DisableSaveButton} hidden={this.state.DisableSaveButton} onClick={this.onSTARTREVIEWSave} ></PrimaryButton>
                              // </div>
                              <div>
                                <PrimaryButton
                                  className={styles.btnSTARTREVIEW}
                                  // disabled={this.state.DisableSubmitButton}
                                  text="DECLINE"
                                  onClick={this.onDecline}
                                />
                              </div>
                            )}
                          <div>
                            <PrimaryButton
                              style={{
                                background: this.state.DisableSubmitButton
                                  ? "#ff9"
                                  : "rgba(73,233,10,.8156862745098039)",
                              }}
                              className={styles.btnSTARTREVIEW}
                              disabled={this.state.DisableSubmitButton}
                              text="START REVIEW"
                              onClick={this.onSTARTREVIEWSave}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
              </div>
            )}

            {/* {this.state.PEPIDetails.StatusOfReview !=
              Config.StatusOfReview.Split &&
              this.state.PEPIDetails.StatusOfReview !=
                Config.StatusOfReview.Combined &&
              this.state.PEPIDetails.StatusOfReview !=
                Config.StatusOfReview.Declined && (
                <div className={styles.row}>
                  <div
                    className={
                      this.state.PEPIDetails.StatusOfReview ==
                      Config.StatusOfReview.AwaitingReviewer
                        ? styles.col25leftReplaseMe
                        : styles.col25left
                    }
                  >
                    <PeoplePicker
                      context={this.props.AppContext}
                      personSelectionLimit={1}
                      groupName={""} // Leave this blank in case you want to filter from all users
                      showtooltip={true}
                      ensureUser={true}
                      showHiddenInUI={false}
                      principalTypes={[PrincipalType.User]}
                      selectedItems={this.onChangeReviewerName}
                      defaultSelectedUsers={
                        this.state.IsSelectedEmployeeInvalid
                          ? []
                          : [this.state.ReviewerEmail]
                      }
                      disabled={this.state.DisableNewFormOprtion}
                      resolveDelay={1000}
                    />
                  </div>
                  <div
                    className={
                      this.state.PEPIDetails.StatusOfReview ==
                      Config.StatusOfReview.AwaitingLeadMD
                        ? styles.col25leftReplaseMe
                        : styles.col25left
                    }
                  >
                    <PeoplePicker
                      context={this.props.AppContext}
                      personSelectionLimit={1}
                      groupName={""} // Leave this blank in case you want to filter from all users
                      showtooltip={true}
                      ensureUser={true}
                      showHiddenInUI={false}
                      principalTypes={[PrincipalType.User]}
                      resolveDelay={1000}
                      selectedItems={this.onChangeLeadMDName}
                      disabled={this.state.DisableNewFormOprtion}
                      defaultSelectedUsers={
                        this.state.IsSelectedEmployeeInvalid
                          ? []
                          : [this.state.LeadMDEmail]
                      }
                    />
                  </div>

                  {!this.state.IsCreateMode && (
                    <div>
                      <div className={styles.col25left}>
                        <Dropdown
                          options={this.ComplexityOptions}
                          selectedKey={this.state.PEPIDetails.Complexity}
                          onChange={(e, selectedOption) => {
                            this.onChangeComplexity(selectedOption.text);
                          }}
                        />{" "}
                      </div>
                      <div className={styles.col25left}>
                        {" "}
                        <Label>{this.state.PEPIDetails.StatusOfReview}</Label>
                      </div>
                    </div>
                  )}

                  {this.state.IsCreateMode && (
                    // <div className={styles.col25left}>\
                    // <PrimaryButton text="START REVIEW" aria-disabled={this.state.DisableSaveButton} disabled={this.state.DisableSaveButton} hidden={this.state.DisableSaveButton} onClick={this.onSTARTREVIEWSave} ></PrimaryButton>
                    // </div>
                    <div className={styles.divFullWidth}>
                      <PrimaryButton
                        className={styles.btnSTARTREVIEW}
                        disabled={this.state.DisableSubmitButton}
                        text="START REVIEW"
                        onClick={this.onSTARTREVIEWSave}
                      ></PrimaryButton>
                    </div>
                  )}
                </div>
              )} */}
          </div>
          <div className={styles.row}></div>

          {this.state.PEPIDetails.JobTitle != null &&
            this.state.PEPIDetails.StatusOfReview !=
              Config.StatusOfReview.Split &&
            this.state.PEPIDetails.StatusOfReview !=
              Config.StatusOfReview.Combined &&
            this.state.PEPIDetails.StatusOfReview !=
              Config.StatusOfReview.Declined &&
            this.state.PEPIDetails.StatusOfReview && (
              <div>
                {this.state.PEPIDetails.JobTitle == Config.JobRole.Analyst && (
                  <Analytics
                    AppContext={this.props.AppContext}
                    hasEditItemPermission={this.state.hasEditItemPermission}
                    IsLoading={this.state.IsLoading}
                    APEPIDetail={this.state.PEPIDetails}
                    APEPIQuestionText={this.state.TempPEPIQuestionText}
                    DisableSection={this.state.IsAnalyticsDisable}
                    Options={this.Options}
                    SctionTotalDE={this.state.SctionTotalDE}
                    SctionTotalDR={this.state.SctionTotalDR}
                    ReplaceUsermail={this.state.ReplaceUsermail}
                    onFormFieldValueChange={this.onFormFieldValueChange}
                  ></Analytics>
                )}
                {this.state.PEPIDetails.JobTitle == Config.JobRole.Manager && (
                  <Manager
                    AppContext={this.props.AppContext}
                    hasEditItemPermission={this.state.hasEditItemPermission}
                    IsLoading={this.state.IsLoading}
                    APEPIDetail={this.state.PEPIDetails}
                    APEPIQuestionText={this.state.TempPEPIQuestionText}
                    DisableSection={this.state.IsAnalyticsDisable}
                    Options={this.Options}
                    SctionTotalDE={this.state.SctionTotalDE}
                    SctionTotalDR={this.state.SctionTotalDR}
                    ReplaceUsermail={this.state.ReplaceUsermail}
                    onFormFieldValueChange={this.onFormFieldValueChange}
                  ></Manager>
                )}
                {this.state.PEPIDetails.JobTitle ==
                  Config.JobRole.Associate && (
                  <Associate
                    AppContext={this.props.AppContext}
                    hasEditItemPermission={this.state.hasEditItemPermission}
                    IsLoading={this.state.IsLoading}
                    APEPIDetail={this.state.PEPIDetails}
                    APEPIQuestionText={this.state.TempPEPIQuestionText}
                    DisableSection={this.state.IsAnalyticsDisable}
                    Options={this.Options}
                    SctionTotalDE={this.state.SctionTotalDE}
                    SctionTotalDR={this.state.SctionTotalDR}
                    ReplaceUsermail={this.state.ReplaceUsermail}
                    onFormFieldValueChange={this.onFormFieldValueChange}
                  ></Associate>
                )}
                {this.state.PEPIDetails.JobTitle ==
                  Config.JobRole.SeniorAssociate && (
                  <SeniorAssociate
                    AppContext={this.props.AppContext}
                    hasEditItemPermission={this.state.hasEditItemPermission}
                    IsLoading={this.state.IsLoading}
                    APEPIDetail={this.state.PEPIDetails}
                    APEPIQuestionText={this.state.TempPEPIQuestionText}
                    DisableSection={this.state.IsAnalyticsDisable}
                    Options={this.Options}
                    SctionTotalDE={this.state.SctionTotalDE}
                    SctionTotalDR={this.state.SctionTotalDR}
                    ReplaceUsermail={this.state.ReplaceUsermail}
                    onFormFieldValueChange={this.onFormFieldValueChange}
                  ></SeniorAssociate>
                )}
                {this.state.PEPIDetails.JobTitle == Config.JobRole.Director && (
                  <Director
                    AppContext={this.props.AppContext}
                    hasEditItemPermission={this.state.hasEditItemPermission}
                    IsLoading={this.state.IsLoading}
                    APEPIDetail={this.state.PEPIDetails}
                    APEPIQuestionText={this.state.TempPEPIQuestionText}
                    DisableSection={this.state.IsAnalyticsDisable}
                    Options={this.Options}
                    SctionTotalDE={this.state.SctionTotalDE}
                    SctionTotalDR={this.state.SctionTotalDR}
                    ReplaceUsermail={this.state.ReplaceUsermail}
                    onFormFieldValueChange={this.onFormFieldValueChange}
                  ></Director>
                )}
                {this.state.PEPIDetails.JobTitle ==
                  Config.JobRole.SeniorDirector && (
                  <SeniorDirector
                    AppContext={this.props.AppContext}
                    hasEditItemPermission={this.state.hasEditItemPermission}
                    IsLoading={this.state.IsLoading}
                    APEPIDetail={this.state.PEPIDetails}
                    APEPIQuestionText={this.state.TempPEPIQuestionText}
                    DisableSection={this.state.IsAnalyticsDisable}
                    Options={this.Options}
                    SctionTotalDE={this.state.SctionTotalDE}
                    SctionTotalDR={this.state.SctionTotalDR}
                    ReplaceUsermail={this.state.ReplaceUsermail}
                    onFormFieldValueChange={this.onFormFieldValueChange}
                  ></SeniorDirector>
                )}
              </div>
            )}

          <div className={styles.divFullWidth}>
            <PrimaryButton
              className={styles.btnCancel}
              text="Close"
              onClick={this.onCancel}
            ></PrimaryButton>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
