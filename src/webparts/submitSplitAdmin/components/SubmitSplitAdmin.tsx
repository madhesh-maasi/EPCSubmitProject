import * as React from 'react';
import styles from './SubmitSplitAdmin.module.scss';
import { ISubmitSplitAdminProps } from './ISubmitSplitAdminProps';
import { ISubmitSplitAdminState } from './ISubmitSplitAdminState';
import { escape } from '@microsoft/sp-lodash-subset';

import { Dropdown, TextField, IDropdownOption, IStackTokens, Label, PrimaryButton, Stack, MessageBar, MessageBarType, Spinner, SpinnerSize } from '@fluentui/react';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { DateTimePicker, DateConvention, TimeConvention, TimeDisplayControlType } from '@pnp/spfx-controls-react/lib/DateTimePicker';
import MapResult from "../../../domain/mappers/MapResult";
import { User } from "../../../domain/models/types/User";
import { Config } from "../../../globals/Config";
import { Enums } from "../../../globals/Enums";
import ListItemService from "../../../services/ListItemService";
import UserService from "../../../services/UserService";
import WebService from "../../../services/WebService";

import { PEPI_SplitAdmin } from "../../../domain/models/PEPI_SplitAdmin";

export default class SubmitSplitAdmin extends React.Component<ISubmitSplitAdminProps, ISubmitSplitAdminState> {
  private listSplitAdminItemService: ListItemService;
  private hasEditItemPermission: boolean = true;
  constructor(props: any) {
    super(props);
    this.state = {
      IsCreateMode: (this.props.ItemID == undefined || this.props.ItemID == null || this.props.ItemID == 0) ? true : false,
      hasEditItemPermission: false,
      IsLoading: true,
      AppContext: this.props.AppContext,
      DisableSaveButton: true,
      SplitAdmin: new PEPI_SplitAdmin(),
      IsShowForm: false,
      NewItemID: 0,
    };
    this.onChangeReviewerName = this.onChangeReviewerName.bind(this);
    this.onGETREVIEWS = this.onGETREVIEWS.bind(this);

    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onChangeSourceReviewID = this.onChangeSourceReviewID.bind(this);
    this.onChangeHourstoReview = this.onChangeHourstoReview.bind(this);
    this.onChangeTitleofnewSplitReview = this.onChangeTitleofnewSplitReview.bind(this);

    // this.onSave = this.onSave.bind(this);
    // this.onCancel = this.onCancel.bind(this);
    // this.onChangeSourceReviewID = this.onChangeSourceReviewID.bind(this);
    // this.onChangeHourstoReview = this.onChangeHourstoReview.bind(this);
    // this.onChangeTitleofnewSplitReview = this.onChangeTitleofnewSplitReview.bind(this);
  }
  public async componentDidMount() {
    debugger;
    if (this.state.IsCreateMode) { }
    else {
      this.listSplitAdminItemService = new ListItemService(this.props.AppContext, Config.ListNames.SplitAdmin);
      this.hasEditItemPermission = await this.listSplitAdminItemService.CheckCurrentUserCanEditItem(this.props.ItemID);
      const SplitAdminDetails: PEPI_SplitAdmin = await this.listSplitAdminItemService.getItemUsingCAML(this.props.ItemID, [], undefined, Enums.ItemResultType.PEPI_SplitAdmin);
      this.setState({
        IsLoading: false,
        hasEditItemPermission: this.hasEditItemPermission,
        SplitAdmin: SplitAdminDetails,
        IsShowForm: true,
      });
    }
  }
  private async onChangeReviewerName(items: any[]) {
    let curretState = this.state.SplitAdmin;
    if (items != null && items.length > 0) {
      curretState.RevieweeName = await MapResult.map(items[0], Enums.MapperType.PnPControlResult, Enums.ItemResultType.User);
      curretState.RevieweeNameEmail = curretState.RevieweeName.Email;
      this.onFormTextFieldValueChange(curretState);
    }
  }
  private async onGETREVIEWS(): Promise<void> {
    const CombineAdmin = this.state.SplitAdmin;
    let data = {};
    const columns = Config.CombineAdminListColumns;
    data[columns.RevieweeNameId] = CombineAdmin.RevieweeName.Id;

    if (this.state.IsCreateMode) {
      this.listSplitAdminItemService = new ListItemService(this.props.AppContext, Config.ListNames.SplitAdmin);
      debugger;
      await this.listSplitAdminItemService.createItem(data).then(r => {
        console.log(r);
        //r.data.ID
        this.setState({ NewItemID: r.data.ID });
      });
      this.setState({ IsShowForm: true });
    }
  }

  private async onCancel(): Promise<void> {
    this.gotoListPage();
  }
  private async onSave(): Promise<void> {
    const SplitAdmin = this.state.SplitAdmin;
    let data = {};
    const columns = Config.SplitAdminListColumns;
    data[Config.BaseColumns.Title] = SplitAdmin.Title;
    data[columns.HourstoReview] = Number(SplitAdmin.HourstoReview);
    data[columns.SourceReviewID] = Number(SplitAdmin.SourceReviewID);
    data[columns.RevieweeNameId] = SplitAdmin.RevieweeName.Id;

    if (this.state.IsCreateMode) {
      this.listSplitAdminItemService = new ListItemService(this.props.AppContext, Config.ListNames.SplitAdmin);
      //await this.listSplitAdminItemService.createItem(data);
      await this.listSplitAdminItemService.updateItem(this.state.NewItemID, data);
      this.gotoListPage();
    }
    else {
      this.listSplitAdminItemService = new ListItemService(this.props.AppContext, Config.ListNames.SplitAdmin);
      await this.listSplitAdminItemService.updateItem(this.props.ItemID, data);
      this.gotoListPage();
    }

  }

  private gotoListPage() {
    let returnURL = this.props.AppContext.pageContext.web.absoluteUrl + Config.Links.HomePageLink;
    window.location.href = returnURL;
    return false;
  }
  private onChangeSourceReviewID(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue: string): void {
    const re = /^[0-9\b]+$/;
    if (newValue === '' || re.test(newValue)) {
      let curretState = this.state.SplitAdmin;
      curretState.SourceReviewID = newValue;
      this.onFormTextFieldValueChange(curretState);
    }
  }

  private onChangeHourstoReview(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue: string): void {
    const re = /^[0-9\b]+$/;
    if (newValue === '' || re.test(newValue)) {
      let curretState = this.state.SplitAdmin;
      curretState.HourstoReview = newValue;
      this.onFormTextFieldValueChange(curretState);
    }
  }

  private onChangeTitleofnewSplitReview(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue: string): void {
    let curretState = this.state.SplitAdmin;
    curretState.Title = newValue;
    this.onFormTextFieldValueChange(curretState);
  }

  private onFormTextFieldValueChange(updateDetails: PEPI_SplitAdmin) {
    let allowSave: boolean = true;
    allowSave = this.validateSave(updateDetails);
    this.setState({
      SplitAdmin: updateDetails,
      DisableSaveButton: !allowSave,
    });
  }
  private validateSave(updateDetails: PEPI_SplitAdmin): boolean {
    let valid: boolean = false;
    const details = updateDetails;
    if (!this.hasEditItemPermission) {
      valid = true;
    }
    if (updateDetails.SourceReviewID != "" && updateDetails.Title != "" && updateDetails.SourceReviewID != undefined && updateDetails.Title != undefined) {
      valid = true;
    }
    return valid;
  }
  public render(): React.ReactElement<ISubmitSplitAdminProps> {
    function handleKeyPress(e) {
      var key = e.key;
      var regex = /[0-9]|\,/;
      if (!regex.test(key)
      ) {
        e.preventDefault();
      }
      else {
        console.log("You pressed a key: " + key);
      }
    }
    return (
      <React.Fragment>
        <div className={styles.submitSplitAdmin}>
          <div className={styles.container}>

            <div className={styles.logoImg} title="logo"></div>
            <hr className={styles.hr}></hr>
            <div className={styles.row}>
              <div className={styles.lblTopText}>
                <div className={styles.divCompetency}>
                  <Label><b>Split Review:</b> If you would like to split a long-term project into multiple reviews.</Label>
                </div>
                <div className={styles.divCompetency}>
                  <Label><b style={{ color: '#ff0000' }}>INSTRUCTIONS: </b> Enter the Reviewee’s name in the box below and click <b>Get Reviews</b> to retrieve all associated reviews.  Locate the ID number of the review you would like to split and enter it in the box labeled <b>Source Review ID</b>. Complete the <b>Hours to Review</b> and <b>Title of new Split Review</b>, then click <b>Create Split Review</b>.</Label>
                </div>
                <hr className={styles.hr}></hr>
              </div>

              <div className={styles.row}>
                <div className={styles.lblReviewIDs}>
                  <Label className={styles.lblText}><b>Reviewee Name</b><span style={{ color: '#ff0000' }}>*</span></Label>
                </div>
                <div className={styles.txtReviewIDs}>
                  <PeoplePicker
                    context={this.props.AppContext}
                    personSelectionLimit={1}
                    groupName={""} // Leave this blank in case you want to filter from all users    
                    showtooltip={true}
                    ensureUser={true}
                    showHiddenInUI={false}
                    principalTypes={[PrincipalType.User]}
                    selectedItems={this.onChangeReviewerName}
                    defaultSelectedUsers={[this.state.SplitAdmin.RevieweeNameEmail]}
                    resolveDelay={1000} />
                </div>
                {(this.state.IsCreateMode) &&
                  <div className={styles.txtReviewIDs}>
                    <PrimaryButton className={styles.btnGETREVIEW} text="GET REVIEWS" onClick={this.onGETREVIEWS} ></PrimaryButton>
                  </div>
                }
              </div>

              {(this.state.IsShowForm) &&
                <div>

                  <hr className={styles.hr}></hr>

                  <div className={styles.row}>
                    <div> <hr></hr>
                      <div className={styles.lblSourceReviewID}> <Label><b>Source Review ID (Choose from below): </b><span style={{ color: '#ff0000' }}>*</span></Label></div>
                      <div className={styles.txtSourceReviewID}> <TextField onKeyPress={(e) => handleKeyPress(e)} resizable={false} multiline={false} value={this.state.SplitAdmin.SourceReviewID} onChange={this.onChangeSourceReviewID} className={styles.Multilinetextarea}></TextField>   </div>

                    </div><div>
                      <div className={styles.lblHourstoReview}> <Label><b>Hours to Review </b></Label></div>
                      <div className={styles.txtHourstoReview}><TextField onKeyPress={(e) => handleKeyPress(e)} resizable={false} multiline={false} value={this.state.SplitAdmin.HourstoReview} onChange={this.onChangeHourstoReview} className={styles.Multilinetextarea}></TextField>   </div>
                    </div>
                  </div>

                  <div className={styles.row}>
                    <hr></hr>
                    <div className={styles.lblTitleOfSplitReview}>
                      <Label className={styles.lblText}><b>Title of new Split Review</b></Label>
                      <Label className={styles.lblText}><b>(Example: Acme Software Implementation - Phase 1) </b></Label>
                    </div>
                    <div className={styles.Newcol25left}>
                      <TextField resizable={false} multiline={false} value={this.state.SplitAdmin.Title} onChange={this.onChangeTitleofnewSplitReview} className={styles.Multilinetextarea}></TextField>
                    </div>
                  </div>

                  {/* <div className={styles.divFullWidth}>
                    {(this.state.hasEditItemPermission || this.state.IsCreateMode) &&
                      <PrimaryButton className={styles.btnSave} disabled={this.state.DisableSaveButton} text="CREATE SPLIT REVIEW" onClick={this.onSave} ></PrimaryButton>
                    }
                    <PrimaryButton className={styles.btnCancel} text="Cancel" onClick={this.onCancel} ></PrimaryButton>
                  </div> */}
                  <div className={styles.divFullWidth}>
                    {(this.state.IsCreateMode) &&
                      <div>
                        <PrimaryButton className={styles.btnSave} disabled={this.state.DisableSaveButton} text="CREATE SPLIT REVIEW" onClick={this.onSave} ></PrimaryButton>
                        <PrimaryButton className={styles.btnCancel} text="Cancel" onClick={this.onCancel} ></PrimaryButton>
                      </div>
                    }
                    {(!this.state.IsCreateMode) &&
                      <PrimaryButton className={styles.btnCancel} text="Close" onClick={this.onCancel} ></PrimaryButton>
                    }
                  </div>
                </div>
              }


            </div>
          </div>
        </div>
      </React.Fragment>

    );
  }
}
