import * as React from "react";
import styles from "./SubmitSplitReviews.module.scss";
import { ISubmitSplitReviewsProps } from "./ISubmitSplitReviewsProps";
import { ISubmitSplitReviewsState } from "./ISubmitSplitReviewsState";
import { escape } from "@microsoft/sp-lodash-subset";
import {
  Dropdown,
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
  PeoplePicker,
  PrincipalType,
} from "@pnp/spfx-controls-react/lib/PeoplePicker";

import { PEPI_SplitReviews } from "../../../domain/models/PEPI_SplitReviews";

import MapResult from "../../../domain/mappers/MapResult";
import { User } from "../../../domain/models/types/User";
import { Config } from "../../../globals/Config";
import { Enums } from "../../../globals/Enums";
import ListItemService from "../../../services/ListItemService";
import UserService from "../../../services/UserService";
import WebService from "../../../services/WebService";

export default class SubmitSplitReviews extends React.Component<
  ISubmitSplitReviewsProps,
  ISubmitSplitReviewsState
> {
  private listSplitReviewsItemService: ListItemService;
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
      DisableSaveButton: true,
      SplitReviews: new PEPI_SplitReviews(),
    };
    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onChangeSourceReviewID = this.onChangeSourceReviewID.bind(this);
    this.onChangeHourstoReview = this.onChangeHourstoReview.bind(this);
    this.onChangeTitleofnewSplitReview =
      this.onChangeTitleofnewSplitReview.bind(this);
  }
  public async componentDidMount() {
    //  alert("Hi 4");
    if (this.state.IsCreateMode) {
    } else {
      this.listSplitReviewsItemService = new ListItemService(
        this.props.AppContext,
        Config.ListNames.SplitReviews
      );
      this.hasEditItemPermission =
        await this.listSplitReviewsItemService.CheckCurrentUserCanEditItem(
          this.props.ItemID
        );
      const SplitReviewsDetails: PEPI_SplitReviews =
        await this.listSplitReviewsItemService.getItemUsingCAML(
          this.props.ItemID,
          [],
          undefined,
          Enums.ItemResultType.PEPI_SplitReviews
        );

      this.setState({
        IsLoading: false,
        hasEditItemPermission: this.hasEditItemPermission,
        SplitReviews: SplitReviewsDetails,
      });
    }
  }
  private async onSave(): Promise<void> {
    const splitReviews = this.state.SplitReviews;
    let data = {};
    const columns = Config.SplitReviewsListColumns;
    data[Config.BaseColumns.Title] = splitReviews.Title;
    data[columns.HourstoReview] = Number(splitReviews.HourstoReview);
    data[columns.SourceReviewID] = Number(splitReviews.SourceReviewID);

    if (this.state.IsCreateMode) {
      this.listSplitReviewsItemService = new ListItemService(
        this.props.AppContext,
        Config.ListNames.SplitReviews
      );
      await this.listSplitReviewsItemService.createItem(data);
      this.gotoListPage();
    }
  }

  private async onCancel(): Promise<void> {
    this.gotoListPage();
  }

  private onChangeSourceReviewID(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string
  ): void {
    const re = /^[0-9\b]+$/;
    if (newValue === "" || re.test(newValue)) {
      let curretState = this.state.SplitReviews;
      curretState.SourceReviewID = newValue;
      this.onFormTextFieldValueChange(curretState);
    }
  }

  private onChangeHourstoReview(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string
  ): void {
    const re = /^[0-9\b]+$/;
    if (newValue === "" || re.test(newValue)) {
      let curretState = this.state.SplitReviews;
      curretState.HourstoReview = newValue;
      this.onFormTextFieldValueChange(curretState);
    }
  }
  private isNumber(evt) {
    evt = evt ? evt : window.event;
    var charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 44) {
      return false;
    }
    return true;
  }
  private onChangeTitleofnewSplitReview(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string
  ): void {
    let curretState = this.state.SplitReviews;
    curretState.Title = newValue;
    this.onFormTextFieldValueChange(curretState);
  }
  private onFormTextFieldValueChange(updateDetails: PEPI_SplitReviews) {
    let allowSave: boolean = true;
    allowSave = this.validateSave(updateDetails);
    this.setState({
      SplitReviews: updateDetails,
      DisableSaveButton: !allowSave,
    });
  }

  private gotoListPage() {
    let returnURL =
      this.props.AppContext.pageContext.web.absoluteUrl +
      Config.Links.HomePageLink;
    window.location.href = returnURL;
    return false;
  }
  private validateSave(updateDetails: PEPI_SplitReviews): boolean {
    let valid: boolean = false;
    const details = updateDetails;
    if (!this.hasEditItemPermission) {
      valid = true;
    }
    if (
      updateDetails.SourceReviewID != "" &&
      updateDetails.Title != "" &&
      updateDetails.SourceReviewID != undefined &&
      updateDetails.Title != undefined
    ) {
      valid = true;
    }
    return valid;
  }

  public render(): React.ReactElement<ISubmitSplitReviewsProps> {
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
      <div className={styles.SubmitSplitReviews}>
        <div className={styles.container}>
          <div className={styles.logoImg} title="logo"></div>

          <hr className={styles.hr}></hr>
          <div className={styles.lblTopText}>
            <div className={styles.divCompetency}>
              <Label>
                <b>Split Review:</b> If you would like to split a long-term
                project into multiple reviews.
              </Label>
            </div>
            <div className={styles.divCompetency}>
              <Label>
                <b>INSTRUCTIONS:</b> Locate the ID number of the review you
                would like to split and enter it in the box labeled{" "}
                <b> Source Review ID</b>. Enter the<b> Hours to Review </b> and{" "}
                <b>Title of new Split Review </b> in the boxes below, then
                <b> click Create Split Review</b>.
              </Label>
            </div>
          </div>
          <hr className={styles.hr}></hr>

          <div className={styles.row}>
            {" "}
            <div className={styles.lblReviewIDs}>
              {" "}
              <Label className={styles.lblText}>
                <b>Source Review ID (Choose from below): </b>
                <span style={{ color: "#ff0000" }}>*</span>
              </Label>
            </div>
            <div className={styles.txtReviewIDs}>
              {" "}
              <TextField
                disabled={
                  this.state.SplitReviews.SplitReviewStatus == "Completed"
                }
                onKeyPress={(e) => handleKeyPress(e)}
                resizable={false}
                multiline={false}
                value={this.state.SplitReviews.SourceReviewID}
                onChange={this.onChangeSourceReviewID}
                className={styles.Multilinetextarea}
              ></TextField>{" "}
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.lblReviewIDs}>
              {" "}
              <Label className={styles.lblText}>
                <b>Hours to Review </b>
                <span style={{ color: "#ff0000" }}>*</span>
              </Label>
            </div>
            <div className={styles.txtReviewIDs}>
              <TextField
                disabled={
                  this.state.SplitReviews.SplitReviewStatus == "Completed"
                }
                onKeyPress={(e) => handleKeyPress(e)}
                resizable={false}
                multiline={false}
                value={this.state.SplitReviews.HourstoReview}
                onChange={this.onChangeHourstoReview}
                className={styles.Multilinetextarea}
              ></TextField>{" "}
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.lblReviewIDs}>
              <Label className={styles.lblText}>
                <b>Title of new Split Review</b>
              </Label>
              <Label className={styles.lblText}>
                <b>(Example: Acme Software Implementation - Phase 1) </b>
                <span style={{ color: "#ff0000" }}>*</span>
              </Label>
            </div>
            <div className={styles.txtReviewIDs}>
              <TextField
                disabled={
                  this.state.SplitReviews.SplitReviewStatus == "Completed"
                }
                resizable={false}
                multiline={false}
                value={this.state.SplitReviews.Title}
                onChange={this.onChangeTitleofnewSplitReview}
                className={styles.Multilinetextarea}
              ></TextField>
            </div>
          </div>

          <div className={styles.divFullWidth}>
            {(this.state.hasEditItemPermission || this.state.IsCreateMode) && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                {this.state.SplitReviews.SplitReviewStatus != "Completed" ? (
                  <PrimaryButton
                    className={
                      this.state.DisableSaveButton
                        ? styles.btnSave
                        : styles.btnSaveEnable
                    }
                    disabled={this.state.DisableSaveButton}
                    text="CREATE SPLIT REVIEW"
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
    );
  }
}
