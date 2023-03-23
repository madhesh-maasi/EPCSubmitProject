import * as React from "react";
import styles from "./SubmitCombineReviews.module.scss";
import { ISubmitCombineReviewsProps } from "./ISubmitCombineReviewsProps";
import { ISubmitCombineReviewsState } from "./ISubmitCombineReviewsState";
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

import { PEPI_CombineReviews } from "../../../domain/models/PEPI_CombineReviews";
import { MapDetailsList } from "../../../domain/mappers/MapDetailsList";
import '../../../style/styles.css';

export default class SubmitCombineReviews extends React.Component<
  ISubmitCombineReviewsProps,
  ISubmitCombineReviewsState
> {
  private ServiceLineOptions: IDropdownOption[] = [];
  private ListItemService: ListItemService;
  private hasEditItemPermission: boolean = true;
  private userService: UserService;
  userServiceDetails: User;
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
      CombineReviews: new PEPI_CombineReviews(),
      DisableSaveButton: true,
    };
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
    this.FillServiceLineOptions();
    if (this.state.IsCreateMode) {
    } else {
      this.ListItemService = new ListItemService(
        this.props.AppContext,
        Config.ListNames.CombineReviews
      );
      this.hasEditItemPermission =
        await this.ListItemService.CheckCurrentUserCanEditItem(
          this.props.ItemID
        );
      const CombineReviewsDetails: PEPI_CombineReviews =
        await this.ListItemService.getItemUsingCAML(
          this.props.ItemID,
          [],
          undefined,
          Enums.ItemResultType.PEPI_CombineReviews
        );
      this.userService = new UserService(this.props.AppContext);
      this.userServiceDetails = await this.userService.GetCurrentUserProfile();
      this.setState({
        IsLoading: false,
        hasEditItemPermission: this.hasEditItemPermission,
        CombineReviews: CombineReviewsDetails,
      });
    }
  }
  private async FillServiceLineOptions() {
    this.ListItemService = new ListItemService(
      this.props.AppContext,
      Config.ListNames.CombineReviews
    );
    let GetServiceLine = await this.ListItemService.getFieldChoices(
      Config.CombineReviewsListColumns.JobTitle
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
  }
  private onChangeReviewIDs(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string
  ): void {
    let curretState = this.state.CombineReviews;
    curretState.ReviewIDs = newValue;
    this.onFormTextFieldValueChange(curretState);
  }
  private onChangeTitleofCombinedReview(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string
  ): void {
    let curretState = this.state.CombineReviews;
    curretState.Title = newValue;
    this.onFormTextFieldValueChange(curretState);
  }
  private onchangedLastDateHoursBilled(date: any): void {
    let curretState = this.state.CombineReviews;
    curretState.LastHoursBilled = date;
    this.onFormTextFieldValueChange(curretState);
  }
  private onChangeJobTitle(newValue: string): void {
    let curretState = this.state.CombineReviews;
    curretState.JobTitle = newValue;
    this.onFormTextFieldValueChange(curretState);
  }

  private onFormTextFieldValueChange(updateDetails: PEPI_CombineReviews) {
    let allowSave: boolean = true;
    allowSave = this.validateSave(updateDetails);
    this.setState({
      CombineReviews: updateDetails,
      DisableSaveButton: !allowSave,
    });
  }
  private isNumber(evt) {
    evt = evt ? evt : window.event;
    var charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 44) {
      return false;
    }
    return true;
  }
  private validateSave(updateDetails: PEPI_CombineReviews): boolean {
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
      updateDetails.JobTitle != undefined
    ) {
      valid = true;
    }
    return valid;
  }

  private gotoListPage() {
    let returnURL =
      this.props.AppContext.pageContext.web.absoluteUrl +
      Config.Links.HomePageLink;
    window.location.href = returnURL;
    return false;
  }

  private async onSave(): Promise<void> {
    const CombineReviews = this.state.CombineReviews;
    let data = {};
    const columns = Config.CombineReviewsListColumns;
    data[Config.BaseColumns.Title] = CombineReviews.Title;
    data[columns.ReviewIDs] = CombineReviews.ReviewIDs;
    data[columns.JobTitle] = CombineReviews.JobTitle;
    data[columns.LastHoursBilled] = CombineReviews.LastHoursBilled;

    if (this.state.IsCreateMode) {
      this.ListItemService = new ListItemService(
        this.props.AppContext,
        Config.ListNames.CombineReviews
      );
      await this.ListItemService.createItem(data);
      this.gotoListPage();
    }
  }
  private async onCancel(): Promise<void> {
    this.gotoListPage();
  }
  private _onFormatDate = (date: Date): string => {
    debugger;
    return (
      date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear()
    );
  };

  public render(): React.ReactElement<ISubmitCombineReviewsProps> {
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
        <div className={styles.submitCombineReviews}>
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
                    <b>INSTRUCTIONS:</b> Locate the ID numbers of the reviews
                    you want to combine and enter them in the box labeled
                    <b> Review IDs to combine</b>, separated by commas without
                    spaces. Complete the{" "}
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
                    <b>Review IDs to combine</b>
                    <span style={{ color: "#ff0000" }}> * </span>
                  </Label>
                  <Label className={styles.lblText}>
                    <b>Separate with commas - no spaces. Example: 12,15,20</b>
                  </Label>
                </div>
                <div className={styles.txtReviewIDs}>
                  <TextField
                    disabled={!this.state.IsCreateMode}
                    onKeyPress={(e) => handleKeyPress(e)}
                    resizable={false}
                    multiline={false}
                    value={this.state.CombineReviews.ReviewIDs}
                    onChange={this.onChangeReviewIDs}
                    className={styles.Multilinetextarea}
                  ></TextField>{" "}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.lblReviewIDs}>
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
                    value={this.state.CombineReviews.Title}
                    onChange={this.onChangeTitleofCombinedReview}
                    className={styles.Multilinetextarea}
                  ></TextField>{" "}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.lblReviewIDs}>
                  <Label className={styles.lblText}>
                    <b>Last Date Hours Billed</b>
                  </Label>
                </div>
                <div className={styles.txtReviewIDs}>
                  {/* <DateTimePicker
                   //formatDate={(date: Date): string => {return  date.toLocaleDateString("nl/NL",{month:'short',day:'2-digit',year:'numeric'});}}
                    dateConvention={DateConvention.Date}
                    timeConvention={TimeConvention.Hours12}
                    timeDisplayControlType={TimeDisplayControlType.Dropdown}
                    showLabels={false}
                    value={this.state.CombineReviews.LastHoursBilled}
                    onChange={this.onchangedLastDateHoursBilled}
                  /> */}
                  <DatePicker
                    disabled={!this.state.IsCreateMode}
                    onSelectDate={this.onchangedLastDateHoursBilled}
                    value={this.state.CombineReviews.LastHoursBilled}
                    formatDate={this._onFormatDate}
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.lblReviewIDs}>
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
                    selectedKey={this.state.CombineReviews.JobTitle}
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
                        // className={styles.btnSave}
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
          </div>
        </div>
        {this.userServiceDetails && (
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
              ReviewerName={this.userServiceDetails}
            />
          </>
        )}
      </React.Fragment>
    );
  }
}
