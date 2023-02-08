import * as React from "react";
import styles from "./SubmitSpecialReviews.module.scss";
import { ISubmitSpecialReviewsProps } from "./ISubmitSpecialReviewsProps";
import { ISubmitSpecialReviewsState } from "./ISubmitSpecialReviewsState";
import { escape } from "@microsoft/sp-lodash-subset";

import {
  Dropdown,
  DatePicker,
  TextField,
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
import {
  DateTimePicker,
  DateConvention,
  TimeConvention,
  TimeDisplayControlType,
} from "@pnp/spfx-controls-react/lib/DateTimePicker";
import MapResult from "../../../domain/mappers/MapResult";
import { User } from "../../../domain/models/types/User";
import { Config } from "../../../globals/Config";
import { Enums } from "../../../globals/Enums";
import ListItemService from "../../../services/ListItemService";
import UserService from "../../../services/UserService";
import WebService from "../../../services/WebService";

import { PEPI_SpecialReviews } from "../../../domain/models/PEPI_SpecialReviews";

export default class SubmitSpecialReviews extends React.Component<
  ISubmitSpecialReviewsProps,
  ISubmitSpecialReviewsState
> {
  private ServiceLineOptions: IDropdownOption[] = [];
  private ProjectStatusOptions: IDropdownOption[] = [];
  private ListItemService: ListItemService;
  private hasEditItemPermission: boolean = true;
  constructor(props: any) {
    super(props);
    this.state = {
      IsCreateMode:
        this.props.ItemID == undefined ||
        this.props.ItemID == null ||
        this.props.ItemID == 0
          ? true
          : false,
      hasEditItemPermission: false,
      IsLoading: true,
      AppContext: this.props.AppContext,
      SpecialReviews: new PEPI_SpecialReviews(),
      DisableSaveButton: true,
    };
    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onchangedLastDateHoursBilled =
      this.onchangedLastDateHoursBilled.bind(this);
    this.onChangeRevieweeName = this.onChangeRevieweeName.bind(this);
    this.onChangeLeadMDName = this.onChangeLeadMDName.bind(this);
    this.onChangeReviewerName = this.onChangeReviewerName.bind(this);

    this.onChangeProjectCode = this.onChangeProjectCode.bind(this);
    this.onChangeProjectName = this.onChangeProjectName.bind(this);
    this.onChangeHoursWorked = this.onChangeHoursWorked.bind(this);
    this.onChangeJobTitle = this.onChangeJobTitle.bind(this);
    this.onChangeProjectStatus = this.onChangeProjectStatus.bind(this);
    this.onChangeEmployeeNumber = this.onChangeEmployeeNumber.bind(this);
  }
  public async componentDidMount() {
    this.FillProjectStatusOptions();
    this.FillServiceLineOptions();
    if (this.state.IsCreateMode) {
    } else {
      this.ListItemService = new ListItemService(
        this.props.AppContext,
        Config.ListNames.SpecialReviews
      );
      this.hasEditItemPermission =
        await this.ListItemService.CheckCurrentUserCanEditItem(
          this.props.ItemID
        );
      const SpecialReviewsDetails: PEPI_SpecialReviews =
        await this.ListItemService.getItemUsingCAML(
          this.props.ItemID,
          [],
          undefined,
          Enums.ItemResultType.PEPI_SpecialReviews
        );
      this.setState({
        IsLoading: false,
        hasEditItemPermission: this.hasEditItemPermission,
        SpecialReviews: SpecialReviewsDetails,
      });
    }
  }
  private async FillProjectStatusOptions() {
    this.ListItemService = new ListItemService(
      this.props.AppContext,
      Config.ListNames.SpecialReviews
    );
    let GetServiceLine = await this.ListItemService.getFieldChoices(
      Config.SpecialReviewsListColumns.ProjectStatus
    );
    let GetServiceLineOption: any[] = [];
    if (GetServiceLine != undefined) {
      var j = 0;
      for (var i = 0; i < Object.keys(GetServiceLine).length; i++) {
        var qData = {};
        qData["text"] = GetServiceLine[Object.keys(GetServiceLine)[i]];
        qData["key"] = GetServiceLine[Object.keys(GetServiceLine)[i]];
        GetServiceLineOption.push(qData);
      }
    }
    this.ProjectStatusOptions = GetServiceLineOption;
    this.setState({
      IsLoading: false,
    });
  }
  private async FillServiceLineOptions() {
    this.ListItemService = new ListItemService(
      this.props.AppContext,
      Config.ListNames.SpecialReviews
    );
    let GetServiceLine = await this.ListItemService.getFieldChoices(
      Config.SpecialReviewsListColumns.JobTitle
    );
    let GetServiceLineOption: any[] = [];
    if (GetServiceLine != undefined) {
      var j = 0;
      for (var i = 0; i < Object.keys(GetServiceLine).length; i++) {
        var qData = {};
        qData["text"] = GetServiceLine[Object.keys(GetServiceLine)[i]];
        qData["key"] = GetServiceLine[Object.keys(GetServiceLine)[i]];
        GetServiceLineOption.push(qData);
      }
    }
    this.ServiceLineOptions = GetServiceLineOption;
    this.setState({
      IsLoading: false,
    });
  }
  private async onChangeRevieweeName(items: any[]) {
    let curretState = this.state.SpecialReviews;
    if (items != null && items.length > 0) {
      curretState.RevieweeName = await MapResult.map(
        items[0],
        Enums.MapperType.PnPControlResult,
        Enums.ItemResultType.User
      );
      curretState.RevieweeNameEmail = curretState.RevieweeName.Email;
    }
  }

  private async onChangeLeadMDName(items: any[]) {
    let curretState = this.state.SpecialReviews;
    if (items != null && items.length > 0) {
      curretState.LeadMDName = await MapResult.map(
        items[0],
        Enums.MapperType.PnPControlResult,
        Enums.ItemResultType.User
      );
      curretState.LeadMDNameEmail = curretState.LeadMDName.Email;
    }
  }

  private async onChangeReviewerName(items: any[]) {
    let curretState = this.state.SpecialReviews;
    if (items != null && items.length > 0) {
      curretState.ReviewerName = await MapResult.map(
        items[0],
        Enums.MapperType.PnPControlResult,
        Enums.ItemResultType.User
      );
      curretState.ReviewerNameEmail = curretState.ReviewerName.Email;
    }
  }

  private async onChangeProjectCode(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string
  ) {
    let curretState = this.state.SpecialReviews;
    curretState.ProjectCode = newValue;
    this.onFormTextFieldValueChange(curretState);
  }
  private async onChangeProjectName(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string
  ) {
    let curretState = this.state.SpecialReviews;
    curretState.Title = newValue;
    this.onFormTextFieldValueChange(curretState);
  }
  private async onChangeHoursWorked(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string
  ) {
    // const re = /^[0-9\b]+$/;
    // if (newValue === '' || re.test(newValue)) {
    let curretState = this.state.SpecialReviews;
    curretState.HoursWorked = newValue;
    this.onFormTextFieldValueChange(curretState);
    //}
  }
  private async onChangeEmployeeNumber(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string
  ) {
    const re = /^[0-9\b]+$/;
    if (newValue === "" || re.test(newValue)) {
      let curretState = this.state.SpecialReviews;
      curretState.EmployeeNumber = newValue;
      this.onFormTextFieldValueChange(curretState);
    }
  }

  private onChangeJobTitle(newValue: string): void {
    let curretState = this.state.SpecialReviews;
    curretState.JobTitle = newValue;
    this.onFormTextFieldValueChange(curretState);
  }
  private onChangeProjectStatus(newValue: string): void {
    let curretState = this.state.SpecialReviews;
    curretState.ProjectStatus = newValue;
    this.onFormTextFieldValueChange(curretState);
  }

  private onchangedLastDateHoursBilled(date: any): void {
    let curretState = this.state.SpecialReviews;
    curretState.LastHoursBilled = date;
    this.onFormTextFieldValueChange(curretState);
  }

  private async onSave(): Promise<void> {
    const SpecialReviews = this.state.SpecialReviews;
    let data = {};
    const columns = Config.SpecialReviewsListColumns;
    data[Config.BaseColumns.Title] = SpecialReviews.Title;
    data[columns.RevieweeNameId] = SpecialReviews.RevieweeName.Id;
    data[columns.LeadMDNameId] = SpecialReviews.LeadMDName.Id;

    data[columns.ProjectCode] = SpecialReviews.ProjectCode;
    data[columns.HoursWorked] = SpecialReviews.HoursWorked;
    data[columns.JobTitle] = SpecialReviews.JobTitle;
    data[columns.ProjectStatus] = SpecialReviews.ProjectStatus;
    data[columns.LastHoursBilled] = SpecialReviews.LastHoursBilled;
    data[columns.ReviewerNameId] = SpecialReviews.ReviewerName.Id;
    data[columns.EmployeeNumber] = SpecialReviews.EmployeeNumber;

    this.ListItemService = new ListItemService(
      this.props.AppContext,
      Config.ListNames.SpecialReviews
    );
    if (this.state.IsCreateMode) {
      await this.ListItemService.createItem(data);
      this.gotoListPage();
    } else {
      await this.ListItemService.updateItem(this.props.ItemID, data);
      this.gotoListPage();
    }
  }
  private async onCancel(): Promise<void> {
    this.gotoListPage();
  }
  private gotoListPage() {
    let returnURL =
      this.props.AppContext.pageContext.web.absoluteUrl +
      Config.Links.HomePageLink;
    window.location.href = returnURL;
    return false;
  }
  private isNumber(evt) {
    evt = evt ? evt : window.event;
    var charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 44) {
      return false;
    }
    return true;
  }
  private validateSave(updateDetails: PEPI_SpecialReviews): boolean {
    let valid: boolean = false;
    const details = updateDetails;
    if (!this.hasEditItemPermission) {
      valid = true;
    }
    if (
      updateDetails.Title != "" &&
      updateDetails.RevieweeNameEmail != "" &&
      updateDetails.LeadMDNameEmail != "" &&
      updateDetails.ProjectCode != "" &&
      updateDetails.HoursWorked != "" &&
      updateDetails.Title != undefined &&
      updateDetails.RevieweeNameEmail != undefined &&
      updateDetails.LeadMDNameEmail != undefined &&
      updateDetails.ProjectCode != undefined &&
      updateDetails.HoursWorked != undefined
    ) {
      valid = true;
    }
    return valid;
  }

  private onFormTextFieldValueChange(updateDetails: PEPI_SpecialReviews) {
    let allowSave: boolean = true;
    allowSave = this.validateSave(updateDetails);
    this.setState({
      SpecialReviews: updateDetails,
      DisableSaveButton: !allowSave,
    });
  }
  private _onFormatDate = (date: Date): string => {
    return (
      date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear()
    );
  };
  public render(): React.ReactElement<ISubmitSpecialReviewsProps> {
    function handleKeyPress(e) {
      var key = e.key;
      var regex = /[0-9]|\,/;
      if (!regex.test(key)) {
        e.preventDefault();
      } else {
        console.log("You pressed a key: " + key);
      }
    }
    return (
      <React.Fragment>
        <div className={styles.submitSpecialReviews}>
          <div className={styles.container}>
            <div className={styles.logoImg} title="logo"></div>
            <hr className={styles.hr}></hr>
            <div className={styles.row}>
              <div className={styles.divCompetency}>
                <Label>
                  <b>CREATE A SPECIAL REVIEW</b>
                </Label>
              </div>
              <div className={styles.divCompetency}>
                <Label>
                  {" "}
                  Use to create a review for a project not entered into Agresso,
                  create a copy of an existing review already in progress, or
                  rebuild a review accidentally deleted from the Projects list.
                </Label>
              </div>
              <hr className={styles.hr}></hr>

              <div className={styles.SRrow}>
                <div className={styles.lblReviewIDs}>
                  <Label>
                    <b>Project Name</b>
                    <span style={{ color: "#ff0000" }}> * </span>
                  </Label>
                </div>
                <div className={styles.txtReviewIDs}>
                  <TextField
                    disabled={
                      this.state.SpecialReviews.SpecialReviewStatus ==
                      "Completed"
                    }
                    resizable={false}
                    multiline={false}
                    value={this.state.SpecialReviews.Title}
                    onChange={this.onChangeProjectName}
                    className={styles.Multilinetextarea}
                  ></TextField>
                </div>
              </div>

              <div className={styles.SRrow}>
                <div className={styles.lblReviewIDs}>
                  <Label>
                    <b>Reviewee Name</b>
                    <span style={{ color: "#ff0000" }}> * </span>
                  </Label>
                </div>
                <div
                  className={
                    this.state.SpecialReviews.SpecialReviewStatus == "Completed"
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
                    selectedItems={this.onChangeRevieweeName}
                    defaultSelectedUsers={[
                      this.state.SpecialReviews.RevieweeNameEmail,
                    ]}
                    resolveDelay={1000}
                  />
                </div>
              </div>
              <div className={styles.SRrow}>
                <div className={styles.lblReviewIDs}>
                  <Label>
                    <b>Lead MD Name</b>
                    <span style={{ color: "#ff0000" }}> * </span>
                  </Label>
                </div>
                <div className={styles.clsPeoplepicker}>
                  <PeoplePicker
                    disabled={
                      this.state.SpecialReviews.SpecialReviewStatus ==
                      "Completed"
                    }
                    context={this.props.AppContext}
                    personSelectionLimit={1}
                    groupName={""} // Leave this blank in case you want to filter from all users
                    showtooltip={true}
                    ensureUser={true}
                    showHiddenInUI={false}
                    principalTypes={[PrincipalType.User]}
                    selectedItems={this.onChangeLeadMDName}
                    defaultSelectedUsers={[
                      this.state.SpecialReviews.LeadMDNameEmail,
                    ]}
                    resolveDelay={1000}
                  />
                </div>
              </div>

              <div className={styles.SRrow}>
                <div className={styles.lblReviewIDs}>
                  <Label>
                    <b>Project Code</b>
                    <span style={{ color: "#ff0000" }}> * </span>
                  </Label>
                </div>
                <div className={styles.txtReviewIDs}>
                  <TextField
                    disabled={
                      this.state.SpecialReviews.SpecialReviewStatus ==
                      "Completed"
                    }
                    resizable={false}
                    multiline={false}
                    value={this.state.SpecialReviews.ProjectCode}
                    onChange={this.onChangeProjectCode}
                    className={styles.Multilinetextarea}
                  ></TextField>{" "}
                </div>
              </div>
              <div className={styles.SRrow}>
                <div className={styles.lblReviewIDs}>
                  <Label>
                    <b>Hours Worked</b>
                    <span style={{ color: "#ff0000" }}> * </span>
                  </Label>
                </div>
                <div className={styles.txtReviewIDs}>
                  <TextField
                    disabled={
                      this.state.SpecialReviews.SpecialReviewStatus ==
                      "Completed"
                    }
                    onKeyPress={(e) => handleKeyPress(e)}
                    resizable={false}
                    multiline={false}
                    value={this.state.SpecialReviews.HoursWorked}
                    onChange={this.onChangeHoursWorked}
                    className={styles.Multilinetextarea}
                  ></TextField>{" "}
                </div>
              </div>
              <div className={styles.SRrow}>
                <div className={styles.lblReviewIDs}>
                  <Label>
                    <b>Job Title</b>
                  </Label>
                  <Label>
                    <b>(Determines review template)</b>
                  </Label>
                </div>
                <div className={styles.txtReviewIDs}>
                  <Dropdown
                    disabled={
                      this.state.SpecialReviews.SpecialReviewStatus ==
                      "Completed"
                    }
                    className={styles.dropServiceLine}
                    options={this.ServiceLineOptions}
                    selectedKey={this.state.SpecialReviews.JobTitle}
                    onChange={(e, selectedOption) => {
                      this.onChangeJobTitle(selectedOption.text);
                    }}
                  />
                </div>
              </div>
              <div className={styles.SRrow}>
                <div className={styles.lblReviewIDs}>
                  <Label>
                    <b>Project Status</b>
                  </Label>
                </div>
                <div className={styles.txtReviewIDs}>
                  <Dropdown
                    disabled={
                      this.state.SpecialReviews.SpecialReviewStatus ==
                      "Completed"
                    }
                    className={styles.dropServiceLine}
                    options={this.ProjectStatusOptions}
                    selectedKey={this.state.SpecialReviews.ProjectStatus}
                    onChange={(e, selectedOption) => {
                      this.onChangeProjectStatus(selectedOption.text);
                    }}
                  />
                </div>
              </div>
              <div className={styles.SRrow}>
                <div className={styles.lblReviewIDs}>
                  <Label>
                    <b>Last Hours Billed</b>
                  </Label>
                  <Label>
                    <b>(if known)</b>
                  </Label>
                </div>
                <div className={styles.txtReviewIDs}>
                  {/* <DateTimePicker
                    dateConvention={DateConvention.Date}
                    timeConvention={TimeConvention.Hours12}
                    timeDisplayControlType={TimeDisplayControlType.Dropdown}
                    showLabels={false}
                    value={this.state.SpecialReviews.LastHoursBilled}
                    onChange={this.onchangedLastDateHoursBilled}
                  /> */}
                  <DatePicker
                    disabled={
                      this.state.SpecialReviews.SpecialReviewStatus ==
                      "Completed"
                    }
                    onSelectDate={this.onchangedLastDateHoursBilled}
                    value={this.state.SpecialReviews.LastHoursBilled}
                    formatDate={this._onFormatDate}
                  />
                </div>
              </div>
              {/* <div className={styles.SRrow}>
                <div className={styles.lblReviewIDs}>
                  <Label><b>Reviewer Name</b></Label>
                  <Label><b>(if known)</b></Label>
                </div>
                <div className={styles.clsPeoplepicker}>
                  <PeoplePicker
                    context={this.props.AppContext}
                    personSelectionLimit={1}
                    groupName={""} // Leave this blank in case you want to filter from all users    
                    showtooltip={true}
                    ensureUser={true}
                    showHiddenInUI={false}
                    principalTypes={[PrincipalType.User]}
                    selectedItems={this.onChangeReviewerName}
                    defaultSelectedUsers={[this.state.SpecialReviews.ReviewerNameEmail]}
                    resolveDelay={1000} />
                </div>
              </div> */}
              <div className={styles.SRrow}>
                <div className={styles.lblReviewIDs}>
                  <Label>
                    <b>Employee Number</b>
                  </Label>
                  <Label>
                    <b>(if known)</b>
                  </Label>
                </div>
                <div className={styles.txtReviewIDs}>
                  <TextField
                    disabled={
                      this.state.SpecialReviews.SpecialReviewStatus ==
                      "Completed"
                    }
                    resizable={false}
                    multiline={false}
                    value={this.state.SpecialReviews.EmployeeNumber}
                    onKeyPress={this.isNumber}
                    onChange={this.onChangeEmployeeNumber}
                    className={styles.Multilinetextarea}
                  ></TextField>{" "}
                </div>
              </div>
              {/* <div className={styles.divFullWidth}> */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                {this.state.SpecialReviews.SpecialReviewStatus !=
                "Completed" ? (
                  <PrimaryButton
                    className={
                      this.state.DisableSaveButton
                        ? styles.btnSave
                        : styles.btnSaveEnable
                    }
                    disabled={this.state.DisableSaveButton}
                    text="CREATE NEW REVIEW"
                    onClick={this.onSave}
                  ></PrimaryButton>
                ) : null}
                <PrimaryButton
                  className={styles.btnCancel}
                  // text="Cancel"
                  text="Close"
                  onClick={this.onCancel}
                ></PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
