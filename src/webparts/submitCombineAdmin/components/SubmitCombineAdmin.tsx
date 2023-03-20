import * as React from "react";
import styles from "./SubmitCombineAdmin.module.scss";
import { ISubmitCombineAdminProps } from "./ISubmitCombineAdminProps";
import { ISubmitCombineAdminState } from "./ISubmitCombineAdminState";
import { escape } from "@microsoft/sp-lodash-subset";

import { MapDetailsList } from "../../../domain/mappers/MapDetailsList";

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

import { PEPI_CombineAdmin } from "../../../domain/models/PEPI_CombineAdmin";

export default class SubmitCombineAdmin extends React.Component<
  ISubmitCombineAdminProps,
  ISubmitCombineAdminState
> {
  private ServiceLineOptions: IDropdownOption[] = [];
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
      CombineAdmin: new PEPI_CombineAdmin(),
      DisableSaveButton: true,
      IsShowForm: false,
      NewItemID: 0,
    };

    this.onGETREVIEWS = this.onGETREVIEWS.bind(this);
    this.onChangeReviewerName = this.onChangeReviewerName.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onChangeReviewIDs = this.onChangeReviewIDs.bind(this);
    this.onchangedLastDateHoursBilled =
      this.onchangedLastDateHoursBilled.bind(this);
    this.onChangeTitleofCombinedReview =
      this.onChangeTitleofCombinedReview.bind(this);
    this.onChangeJobTitle = this.onChangeJobTitle.bind(this);
  }
  public async componentDidMount() {
    debugger;
    this.FillServiceLineOptions();
    if (this.state.IsCreateMode) {
    } else {
      this.ListItemService = new ListItemService(
        this.props.AppContext,
        Config.ListNames.CombineAdmin
      );
      this.hasEditItemPermission =
        await this.ListItemService.CheckCurrentUserCanEditItem(
          this.props.ItemID
        );
      const CombineAdminDetails: PEPI_CombineAdmin =
        await this.ListItemService.getItemUsingCAML(
          this.props.ItemID,
          [],
          undefined,
          Enums.ItemResultType.PEPI_CombineAdmin
        );
      this.setState({
        IsLoading: false,
        hasEditItemPermission: this.hasEditItemPermission,
        CombineAdmin: CombineAdminDetails,
        IsShowForm: true,
      });
    }
  }

  private async FillServiceLineOptions() {
    this.ListItemService = new ListItemService(
      this.props.AppContext,
      Config.ListNames.CombineAdmin
    );
    let GetServiceLine = await this.ListItemService.getFieldChoices(
      Config.CombineAdminListColumns.JobTitle
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

  private async onGETREVIEWS(): Promise<void> {
    this.setState({
      IsShowForm: false,
    });
    const CombineAdmin = this.state.CombineAdmin;
    let data = {};
    const columns = Config.CombineAdminListColumns;
    data[columns.RevieweeNameId] = CombineAdmin.ReviewerName.Id;

    if (this.state.IsCreateMode) {
      this.ListItemService = new ListItemService(
        this.props.AppContext,
        Config.ListNames.CombineAdmin
      );
      debugger;
      await this.ListItemService.createItem(data).then((r) => {
        console.log(r);
        //r.data.ID
        this.setState({ NewItemID: r.data.ID });
      });
      this.setState({ IsShowForm: true });
    }
  }
  private async onChangeReviewerName(items: any[]) {
    let curretState = this.state.CombineAdmin;
    if (items != null && items.length > 0) {
      curretState.ReviewerName = await MapResult.map(
        items[0],
        Enums.MapperType.PnPControlResult,
        Enums.ItemResultType.User
      );
      curretState.ReviewerNameEmail = curretState.ReviewerName.Email;
      this.onFormTextFieldValueChange(curretState);
    }
  }
  private async onSave(): Promise<void> {
    const CombineAdmin = this.state.CombineAdmin;
    let data = {};
    const columns = Config.CombineAdminListColumns;
    data[Config.BaseColumns.Title] = CombineAdmin.Title;
    data[columns.ReviewIDs] = CombineAdmin.ReviewIDs;
    data[columns.JobTitle] = CombineAdmin.JobTitle;
    data[columns.LastHoursBilled] = CombineAdmin.LastHoursBilled;
    data[columns.RevieweeNameId] = CombineAdmin.ReviewerName.Id;
    if (this.state.IsCreateMode) {
      this.ListItemService = new ListItemService(
        this.props.AppContext,
        Config.ListNames.CombineAdmin
      );
      //await this.ListItemService.updateItem(this.props.ItemID, data);
      await this.ListItemService.updateItem(this.state.NewItemID, data);
      //await this.ListItemService.createItem(data);
      this.gotoListPage();
    } else {
      this.ListItemService = new ListItemService(
        this.props.AppContext,
        Config.ListNames.CombineAdmin
      );
      await this.ListItemService.updateItem(this.props.ItemID, data);

      //await this.ListItemService.createItem(data);
      this.gotoListPage();
    }
  }
  private gotoListPage() {
    let returnURL =
      this.props.AppContext.pageContext.web.absoluteUrl +
      Config.Links.HomePageLink;
    window.location.href = returnURL;
    return false;
  }
  private async onCancel(): Promise<void> {
    this.gotoListPage();
  }
  private onChangeReviewIDs(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string
  ): void {
    let curretState = this.state.CombineAdmin;
    curretState.ReviewIDs = newValue;
    this.onFormTextFieldValueChange(curretState);
  }
  private onChangeTitleofCombinedReview(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string
  ): void {
    let curretState = this.state.CombineAdmin;
    curretState.Title = newValue;
    this.onFormTextFieldValueChange(curretState);
  }
  private onchangedLastDateHoursBilled(date: any): void {
    let curretState = this.state.CombineAdmin;
    curretState.LastHoursBilled = date;
    this.onFormTextFieldValueChange(curretState);
  }
  private onChangeJobTitle(newValue: string): void {
    let curretState = this.state.CombineAdmin;
    curretState.JobTitle = newValue;
    this.onFormTextFieldValueChange(curretState);
  }

  private onFormTextFieldValueChange(updateDetails: PEPI_CombineAdmin) {
    let allowSave: boolean = true;
    allowSave = this.validateSave(updateDetails);
    this.setState({
      CombineAdmin: updateDetails,
      DisableSaveButton: !allowSave,
    });
  }
  private validateSave(updateDetails: PEPI_CombineAdmin): boolean {
    let valid: boolean = false;
    const details = updateDetails;
    if (!this.hasEditItemPermission) {
      valid = true;
    }
    if (
      updateDetails.Title != "" &&
      updateDetails.Title != undefined &&
      updateDetails.ReviewIDs != "" &&
      updateDetails.ReviewIDs != undefined &&
      updateDetails.JobTitle != "" &&
      updateDetails.JobTitle != undefined &&
      updateDetails.LastHoursBilled != null
    ) {
      valid = true;
    }
    return valid;
  }
  private _onFormatDate = (date: Date): string => {
    debugger;
    return (
      date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear()
    );
  };

  public render(): React.ReactElement<ISubmitCombineAdminProps> {
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
        <div className={styles.submitCombineAdmin}>
          <div className={styles.container}>
            <div className={styles.logoImg} title="logo"></div>
            <hr className={styles.hr}></hr>
            <div className={styles.row}>
              <div className={styles.lblTopText}>
                <div className={styles.divCompetency}>
                  <Label>
                    <b>Combined Review:</b> If you would like to combine
                    multiple projects into one review.
                  </Label>
                </div>
                <div className={styles.divCompetency}>
                  <Label>
                    <b style={{ color: "#ff0000" }}>INSTRUCTIONS: </b>Enter the
                    Reviewee’s name in the box below, then click{" "}
                    <b>Get Reviews</b> to retrieve all associated reviews.
                    Locate the ID numbers of the reviews you want to combine and
                    enter them in the box labeled <b>Review IDs to combine</b>,
                    separated by commas without spaces. Complete the{" "}
                    <b>
                      Title of Combined Review, Project Start & End Dates, Last
                      Date Hours Billed
                    </b>
                    , and <b>Job Title</b>, then click{" "}
                    <b>Create Combined Review</b>.
                  </Label>
                </div>
                <hr className={styles.hr}></hr>
              </div>

              <div className={styles.row}>
                <div className={styles.lblReviewIDs}>
                  <Label className={styles.lblText}>
                    <b>Reviewee Name</b>
                    <span style={{ color: "#ff0000" }}> * </span>
                  </Label>
                </div>
                <div
                  className={
                    !this.state.IsCreateMode
                      ? styles.clsPeoplepicker
                      : styles.clsPeoplepickerEnable
                  }
                >
                  <PeoplePicker
                    disabled={!this.state.IsCreateMode}
                    context={this.props.AppContext}
                    personSelectionLimit={1}
                    groupName={""} // Leave this blank in case you want to filter from all users
                    showtooltip={true}
                    ensureUser={true}
                    showHiddenInUI={false}
                    principalTypes={[PrincipalType.User]}
                    selectedItems={this.onChangeReviewerName}
                    defaultSelectedUsers={[
                      this.state.CombineAdmin.ReviewerNameEmail,
                    ]}
                    resolveDelay={1000}
                  />
                </div>
                {this.state.IsCreateMode && (
                  <div
                    // className={styles.txtReviewIDs}
                    className={styles.btnReviewIDs}
                  >
                    <PrimaryButton
                      className={styles.btnGETREVIEW}
                      text="GET REVIEWS"
                      onClick={this.onGETREVIEWS}
                    ></PrimaryButton>
                  </div>
                )}
              </div>

              {this.state.IsShowForm && (
                <div>
                  <div className={styles.row}>
                    <div className={styles.lblReviewIDs}>
                      {/* <hr></hr> */}
                      <Label className={styles.lblText}>
                        <b>Review IDs to combine</b>
                        <span style={{ color: "#ff0000" }}> * </span>
                      </Label>
                      <Label className={styles.lblText}>
                        <b>
                          Separate with commas - no spaces. Example: 12,15,20
                        </b>
                      </Label>
                    </div>
                    <div className={styles.txtReviewIDs}>
                      <TextField
                        disabled={!this.state.IsCreateMode}
                        onKeyPress={(e) => handleKeyPress(e)}
                        resizable={false}
                        multiline={false}
                        value={this.state.CombineAdmin.ReviewIDs}
                        onChange={this.onChangeReviewIDs}
                        className={styles.Multilinetextarea}
                      ></TextField>{" "}
                    </div>
                  </div>

                  <div className={styles.row}>
                    {/* <div className={styles.lblTitle}> */}
                    <div className={styles.lblReviewIDs}>
                      {/* <hr></hr> */}
                      <Label className={styles.lblText}>
                        <b>Title of Combined Review</b>
                        <span style={{ color: "#ff0000" }}> * </span>
                      </Label>
                    </div>
                    <div className={styles.txtReviewIDs}>
                      <TextField
                        disabled={!this.state.IsCreateMode}
                        resizable={false}
                        multiline={false}
                        value={this.state.CombineAdmin.Title}
                        onChange={this.onChangeTitleofCombinedReview}
                        className={styles.Multilinetextarea}
                      ></TextField>{" "}
                    </div>
                  </div>
                  <div className={styles.row}>
                    {/* <div className={styles.lblTitle}> */}
                    <div className={styles.lblReviewIDs}>
                      {/* <hr></hr> */}
                      <Label className={styles.lblText}>
                        <b>Last Date Hours Billed</b>
                        <span style={{ color: "#ff0000" }}> * </span>
                      </Label>
                    </div>
                    <div className={styles.txtReviewIDs}>
                      {/* <DateTimePicker
                        dateConvention={DateConvention.Date}
                        timeConvention={TimeConvention.Hours12}
                        timeDisplayControlType={TimeDisplayControlType.Dropdown}
                        showLabels={false}
                        value={this.state.CombineAdmin.LastHoursBilled}
                        onChange={this.onchangedLastDateHoursBilled}
                      /> */}
                      <DatePicker
                        disabled={!this.state.IsCreateMode}
                        onSelectDate={this.onchangedLastDateHoursBilled}
                        value={this.state.CombineAdmin.LastHoursBilled}
                        formatDate={this._onFormatDate}
                      />
                    </div>
                  </div>

                  <div className={styles.row}>
                    {/* <div className={styles.lblTitle}> */}
                    <div className={styles.lblReviewIDs}>
                      {/* <hr></hr> */}
                      <Label className={styles.lblText}>
                        <b>Job Title</b>
                        <span style={{ color: "#ff0000" }}> * </span>
                      </Label>
                    </div>{" "}
                    <div className={styles.txtReviewIDs}>
                      <Dropdown
                        disabled={!this.state.IsCreateMode}
                        className={styles.dropServiceLine}
                        options={this.ServiceLineOptions}
                        selectedKey={this.state.CombineAdmin.JobTitle}
                        onChange={(e, selectedOption) => {
                          this.onChangeJobTitle(selectedOption.text);
                        }}
                      />
                    </div>
                  </div>

                  <div className={styles.divFullWidth}>
                    {(this.state.hasEditItemPermission ||
                      this.state.IsCreateMode) && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                        }}
                      >
                        {this.state.IsCreateMode ? (
                          <PrimaryButton
                            className={
                              this.state.DisableSaveButton
                                ? styles.btnSave
                                : styles.btnSaveEnable
                            }
                            disabled={this.state.DisableSaveButton}
                            text="CREATE COMBINED REVIEW"
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
                    )}
                    {/* {!this.state.IsCreateMode && (
                      <PrimaryButton
                        className={styles.btnCancel}
                        text="Close"
                        onClick={this.onCancel}
                      ></PrimaryButton>
                    )} */}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {this.state.IsShowForm ? (
          <>
            {this.state.CombineAdmin.ReviewerNameEmail && (
              <>
                <Label
                  style={{
                    marginTop: 10,
                    fontWeight: "bold",
                    fontSize: 16,
                  }}
                >
                  Unstarted, Uncombined reviews.
                </Label>
                <MapDetailsList
                  ViewId={1}
                  AppContext={this.props.AppContext}
                  ReviewerName={this.state.CombineAdmin.ReviewerName}
                />
              </>
            )}
          </>
        ) : null}
      </React.Fragment>
    );
  }
}
