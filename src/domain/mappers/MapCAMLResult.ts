import { ContextService } from "../../services/ContextService";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import * as moment from "moment";
import { User } from "../models/types/User";
import { Enums } from "../../globals/Enums";
import { Config } from "../../globals/Config";
import { PEPI_PEPIDetails } from "../models/PEPI_PEPIDetails";
import { PEPI_QuestionText } from "../models/PEPI_QuestionText";
import { PEPI_CombineReviews } from "../models/PEPI_CombineReviews";
import { PEPI_SpecialReviews } from "../models/PEPI_SpecialReviews";
import { PEPI_SplitReviews } from "../models/PEPI_SplitReviews";
import { PEPI_SplitAdmin } from "../models/PEPI_SplitAdmin";
import { PEPI_CombineAdmin } from "../models/PEPI_CombineAdmin";

export default class MapCAMLResult extends ContextService {
  constructor(AppContext: WebPartContext, Lcid: number) {
    super(AppContext);
  }

  // Mapping results based on provided type
  public static map(items: any, type: Enums.ItemResultType): any[] {
    let allResults: any[] = [];
    items.forEach((item) => {
      let result: any;
      switch (type) {
        case Enums.ItemResultType.PEPI_PEPIDetails:
          result = this.mapPEPIDetails(item);
          break;
        case Enums.ItemResultType.PEPI_ItemID:
          result = this.mapPEPIItemID(item);
          break;
        case Enums.ItemResultType.PEPI_QuestionText:
          result = this.mapPEPIQuestionText(item);
          break;
        case Enums.ItemResultType.PEPI_CombineReviews:
          result = this.mapCombineReviews(item);
          break;
        case Enums.ItemResultType.PEPI_CombineAdmin:
          result = this.mapCombineAdmin(item);
          break;
        case Enums.ItemResultType.PEPI_SplitReviews:
          result = this.mapSplitReviews(item);
          break;
        case Enums.ItemResultType.PEPI_SplitAdmin:
          result = this.mapSplitAdmin(item);
          break;
        case Enums.ItemResultType.PEPI_SpecialReviews:
          result = this.mapSpecialReviews(item);
          break;
      }
      allResults.push(result);
    });
    return allResults;
  }

  //#region "Solution Related Mappers"
  private static mapPEPIDetails(item: any) {
    //debugger;
    let result = new PEPI_PEPIDetails();

    result.ProjectStartDate =
      item[Config.PEPIProjectsListColumns.ProjectStartDate];
    result.ProjectEndDate = item[Config.PEPIProjectsListColumns.ProjectEndDate];
    result.LastHoursBilled =
      item[Config.PEPIProjectsListColumns.LastHoursBilled];

    result.Title = item[Config.BaseColumns.Title];
    result.ID = item.ID;
    result.Reviewee = this.mapUser(
      item[Config.PEPIProjectsListColumns.RevieweeName]
    );
    result.LeadMD = this.mapUser(
      item[Config.PEPIProjectsListColumns.LeadMDName]
    );
    result.Reviewer = this.mapUser(
      item[Config.PEPIProjectsListColumns.ReviewerName]
    );
    result.Replaceme = this.mapUser(
      item[Config.PEPIProjectsListColumns.SubstituteUser]
    );
    result.ReplaceUsermailString = this.mapUser(
      item[Config.PEPIProjectsListColumns.SubstituteUser]
    ).Email;
    result.StatusOfReview = item[Config.PEPIProjectsListColumns.StatusOfReview];
    result.ServiceLine = item[Config.PEPIProjectsListColumns.ServiceLines];
    result.Complexity = item[Config.PEPIProjectsListColumns.Complexity];
    result.HoursWorked = item[Config.PEPIProjectsListColumns.HoursWorked];
    result.ProjectCode = item[Config.PEPIProjectsListColumns.ProjectCode];
    result.FiscalYear = item[Config.PEPIProjectsListColumns.FiscalYear];
    result.HomeOffice = item[Config.PEPIProjectsListColumns.HomeOffice];

    //let SignoffHistory = item[Config.PEPIProjectsListColumns.SignoffHistory].split(";");
    let SignoffHistory = item[Config.PEPIProjectsListColumns.SignoffHistory]
      ? item[Config.PEPIProjectsListColumns.SignoffHistory].split(";")
      : "";
    let html = "";
    for (var i = 0; i < Object.keys(SignoffHistory).length; i++) {
      if (SignoffHistory[Object.keys(SignoffHistory)[i]] != " ") {
        html += SignoffHistory[Object.keys(SignoffHistory)[i]].trim() + "\n";
      }
    }
    // html += "</table>";

    // const parseLines = (SignoffHistory) => SignoffHistory.replace(";", "\n");

    result.SignoffHistory = html;
    //result.SignoffHistory = SignoffHistory;

    //result.SignoffHistory = item[Config.PEPIProjectsListColumns.SignoffHistory];

    result.A1EE = item[Config.PEPIProjectsListColumns.A1EE];
    result.A1RR = item[Config.PEPIProjectsListColumns.A1RR];

    //let aa=Number(parseFloat(((this.state.A1DD ).toString()).toFixed(2)))
    result.A2EE = item[Config.PEPIProjectsListColumns.A2EE];
    result.A2RR = item[Config.PEPIProjectsListColumns.A2RR];
    result.A3EE = item[Config.PEPIProjectsListColumns.A3EE];
    result.A3RR = item[Config.PEPIProjectsListColumns.A3RR];

    result.B1EE = item[Config.PEPIProjectsListColumns.B1EE];
    result.B1RR = item[Config.PEPIProjectsListColumns.B1RR];
    result.B2EE = item[Config.PEPIProjectsListColumns.B2EE];
    result.B2RR = item[Config.PEPIProjectsListColumns.B2RR];
    result.B3EE = item[Config.PEPIProjectsListColumns.B3EE];
    result.B3RR = item[Config.PEPIProjectsListColumns.B3RR];
    result.B4EE = item[Config.PEPIProjectsListColumns.B4EE];
    result.B4RR = item[Config.PEPIProjectsListColumns.B4RR];

    result.C1EE = item[Config.PEPIProjectsListColumns.C1EE];
    result.C1RR = item[Config.PEPIProjectsListColumns.C1RR];
    result.C2EE = item[Config.PEPIProjectsListColumns.C2EE];
    result.C2RR = item[Config.PEPIProjectsListColumns.C2RR];
    result.C3EE = item[Config.PEPIProjectsListColumns.C3EE];
    result.C3RR = item[Config.PEPIProjectsListColumns.C3RR];

    result.AAvgEE = item[Config.PEPIProjectsListColumns.AAvgEE];
    result.AAvgER = item[Config.PEPIProjectsListColumns.AAvgER];
    result.BAvgEE = item[Config.PEPIProjectsListColumns.BAvgEE];
    result.BAvgER = item[Config.PEPIProjectsListColumns.BAvgER];
    result.CAvgEE = item[Config.PEPIProjectsListColumns.CAvgEE];
    result.CAvgER = item[Config.PEPIProjectsListColumns.CAvgER];

    result.E1EE = item[Config.PEPIProjectsListColumns.E1EE];
    result.E1ER = item[Config.PEPIProjectsListColumns.E1ER];
    result.F1EE = item[Config.PEPIProjectsListColumns.F1EE];
    result.F1ER = item[Config.PEPIProjectsListColumns.F1ER];
    result.G1EE = item[Config.PEPIProjectsListColumns.G1EE];
    result.G1ER = item[Config.PEPIProjectsListColumns.G1ER];
    result.H1EE = item[Config.PEPIProjectsListColumns.H1EE];
    result.H1ER = item[Config.PEPIProjectsListColumns.H1ER];
    result.H1EL = item[Config.PEPIProjectsListColumns.H1EL];

    result.A11E = item[Config.PEPIProjectsListColumns.A11E];
    result.A12E = item[Config.PEPIProjectsListColumns.A12E];
    result.A13E = item[Config.PEPIProjectsListColumns.A13E];
    result.A14E = item[Config.PEPIProjectsListColumns.A14E];
    result.A15E = item[Config.PEPIProjectsListColumns.A15E];
    result.A11R = item[Config.PEPIProjectsListColumns.A11R];
    result.A12R = item[Config.PEPIProjectsListColumns.A12R];
    result.A13R = item[Config.PEPIProjectsListColumns.A13R];
    result.A14R = item[Config.PEPIProjectsListColumns.A14R];
    result.A15R = item[Config.PEPIProjectsListColumns.A15R];

    result.A21E = item[Config.PEPIProjectsListColumns.A21E];
    result.A22E = item[Config.PEPIProjectsListColumns.A22E];
    result.A23E = item[Config.PEPIProjectsListColumns.A23E];
    result.A24E = item[Config.PEPIProjectsListColumns.A24E];
    result.A21R = item[Config.PEPIProjectsListColumns.A21R];
    result.A22R = item[Config.PEPIProjectsListColumns.A22R];
    result.A23R = item[Config.PEPIProjectsListColumns.A23R];
    result.A24R = item[Config.PEPIProjectsListColumns.A24R];

    result.A31E = item[Config.PEPIProjectsListColumns.A31E];
    result.A32E = item[Config.PEPIProjectsListColumns.A32E];
    result.A33E = item[Config.PEPIProjectsListColumns.A33E];
    result.A31R = item[Config.PEPIProjectsListColumns.A31R];
    result.A32R = item[Config.PEPIProjectsListColumns.A32R];
    result.A33R = item[Config.PEPIProjectsListColumns.A33R];

    result.B11E = item[Config.PEPIProjectsListColumns.B11E];
    result.B12E = item[Config.PEPIProjectsListColumns.B12E];
    result.B11R = item[Config.PEPIProjectsListColumns.B11R];
    result.B12R = item[Config.PEPIProjectsListColumns.B12R];
    result.B21E = item[Config.PEPIProjectsListColumns.B21E];
    result.B22E = item[Config.PEPIProjectsListColumns.B22E];
    result.B23E = item[Config.PEPIProjectsListColumns.B23E];
    result.B21R = item[Config.PEPIProjectsListColumns.B21R];
    result.B22R = item[Config.PEPIProjectsListColumns.B22R];
    result.B23R = item[Config.PEPIProjectsListColumns.B23R];
    result.B31E = item[Config.PEPIProjectsListColumns.B31E];
    result.B32E = item[Config.PEPIProjectsListColumns.B32E];
    result.B33E = item[Config.PEPIProjectsListColumns.B33E];
    result.B31R = item[Config.PEPIProjectsListColumns.B31R];
    result.B32R = item[Config.PEPIProjectsListColumns.B32R];
    result.B33R = item[Config.PEPIProjectsListColumns.B33R];
    result.B41E = item[Config.PEPIProjectsListColumns.B41E];
    result.B42E = item[Config.PEPIProjectsListColumns.B42E];
    result.B43E = item[Config.PEPIProjectsListColumns.B43E];
    result.B41R = item[Config.PEPIProjectsListColumns.B41R];
    result.B42R = item[Config.PEPIProjectsListColumns.B42R];
    result.B43R = item[Config.PEPIProjectsListColumns.B43R];

    result.C11E = item[Config.PEPIProjectsListColumns.C11E];
    result.C12E = item[Config.PEPIProjectsListColumns.C12E];
    result.C13E = item[Config.PEPIProjectsListColumns.C13E];
    result.C11R = item[Config.PEPIProjectsListColumns.C11R];
    result.C12R = item[Config.PEPIProjectsListColumns.C12R];
    result.C13R = item[Config.PEPIProjectsListColumns.C13R];
    result.C21E = item[Config.PEPIProjectsListColumns.C21E];
    result.C22E = item[Config.PEPIProjectsListColumns.C22E];
    result.C23E = item[Config.PEPIProjectsListColumns.C23E];
    result.C24E = item[Config.PEPIProjectsListColumns.C24E];
    result.C21R = item[Config.PEPIProjectsListColumns.C21R];
    result.C22R = item[Config.PEPIProjectsListColumns.C22R];
    result.C23R = item[Config.PEPIProjectsListColumns.C23R];
    result.C24R = item[Config.PEPIProjectsListColumns.C24R];
    result.C31E = item[Config.PEPIProjectsListColumns.C31E];
    result.C32E = item[Config.PEPIProjectsListColumns.C32E];
    result.C33E = item[Config.PEPIProjectsListColumns.C33E];
    result.C31R = item[Config.PEPIProjectsListColumns.C31R];
    result.C32R = item[Config.PEPIProjectsListColumns.C32R];
    result.C33R = item[Config.PEPIProjectsListColumns.C33R];

    result.D11E = item[Config.PEPIProjectsListColumns.D11E];
    result.D11R = item[Config.PEPIProjectsListColumns.D11R];

    result.OverallPerformance =
      item[Config.PEPIProjectsListColumns.OverallPerformance];

    result.RevertToReviewee =
      item[Config.PEPIProjectsListColumns.RevertToReviewee];
    result.RevertToReviewer =
      item[Config.PEPIProjectsListColumns.RevertToReviewer];
    result.JobTitle = item[Config.PEPIProjectsListColumns.JobTitle];
    // JobTitle
    //debugger;
    result.PerformanceDiscussion =
      item[Config.PEPIProjectsListColumns.PerformanceDiscussion] == ""
        ? new Date()
        : new Date(item[Config.PEPIProjectsListColumns.PerformanceDiscussion]);
    //this.props.APEPIDetail.E1EE == undefined ? "":this.props.APEPIDetail.E1EE

    result.ModifiedBy = this.mapUser(item[Config.BaseColumns.ModifedBy]);
    result.ModifiedOnFormatted = this.mapDateWithFormat(
      item[Config.BaseColumns.ModifiedOn]
    );

    return result;
  }
  private static mapPEPIQuestionText(item: any) {
    let result = new PEPI_QuestionText();

    result.Title = item[Config.BaseColumns.Title];
    result.ID = item.ID;
    result.Q1 = item[Config.PEPIQuestionTextListColumns.Q1];
    result.Q2 = item[Config.PEPIQuestionTextListColumns.Q2];
    result.Q3 = item[Config.PEPIQuestionTextListColumns.Q3];
    result.Q4 = item[Config.PEPIQuestionTextListColumns.Q4];
    result.Q5 = item[Config.PEPIQuestionTextListColumns.Q5];
    result.Q6 = item[Config.PEPIQuestionTextListColumns.Q6];
    result.Q7 = item[Config.PEPIQuestionTextListColumns.Q7];
    result.Q8 = item[Config.PEPIQuestionTextListColumns.Q8];
    result.Q9 = item[Config.PEPIQuestionTextListColumns.Q9];
    result.Q10 = item[Config.PEPIQuestionTextListColumns.Q10];
    return result;
  }
  private static mapCombineReviews(item: any) {
    let result = new PEPI_CombineReviews();
    result.CombinedReviewStatus =
      item[Config.CombineReviewsListColumns.CombinedReviewStatus];
    result.Title = item[Config.BaseColumns.Title];
    result.ID = item.ID;
    result.ReviewIDs = item[Config.CombineReviewsListColumns.ReviewIDs];
    result.JobTitle = item[Config.CombineReviewsListColumns.JobTitle];
    result.ProjectManager = this.mapUser(
      item[Config.CombineReviewsListColumns.ProjectManager]
    );
    result.ProjectStartDate =
      item[Config.CombineReviewsListColumns.ProjectStartDate];
    result.ProjectEndDate =
      item[Config.CombineReviewsListColumns.ProjectEndDate];
    result.LastHoursBilled =
      item[Config.CombineReviewsListColumns.LastHoursBilled] == ""
        ? new Date()
        : new Date(item[Config.CombineReviewsListColumns.LastHoursBilled]);
    // result.LastHoursBilled = item[Config.CombineReviewsListColumns.LastHoursBilled];
    result.NewReviewID = item[Config.CombineReviewsListColumns.NewReviewID];

    return result;
  }
  private static mapCombineAdmin(item: any) {
    let result = new PEPI_CombineAdmin();
    result.CombinedAdminStatus =
      item[Config.CombineAdminListColumns.CombinedAdminStatus];
    result.Title = item[Config.BaseColumns.Title];
    result.ID = item.ID;
    result.ReviewIDs = item[Config.CombineAdminListColumns.ReviewIDs];
    result.JobTitle = item[Config.CombineAdminListColumns.JobTitle];
    result.ProjectManager = this.mapUser(
      item[Config.CombineAdminListColumns.ProjectManager]
    );
    result.ReviewerName = this.mapUser(
      item[Config.CombineAdminListColumns.RevieweeName]
    );
    result.ReviewerNameEmail = this.mapUser(
      item[Config.CombineAdminListColumns.RevieweeName]
    ).Email;
    result.ProjectStartDate =
      item[Config.CombineAdminListColumns.ProjectStartDate];
    result.ProjectEndDate = item[Config.CombineAdminListColumns.ProjectEndDate];
    result.LastHoursBilled =
      item[Config.CombineAdminListColumns.LastHoursBilled] == ""
        ? new Date()
        : new Date(item[Config.CombineReviewsListColumns.LastHoursBilled]);
    // result.LastHoursBilled = item[Config.CombineReviewsListColumns.LastHoursBilled];
    result.NewReviewID = item[Config.CombineAdminListColumns.NewReviewID];

    return result;
  }
  private static mapSpecialReviews(item: any) {
    let result = new PEPI_SpecialReviews();
    result.Title = item[Config.BaseColumns.Title];
    result.ID = item.ID;
    result.SpecialReviewStatus =
      item[Config.SpecialReviewsListColumns.SpecialReviewStatus];
    result.LeadMDName = this.mapUser(
      item[Config.SpecialReviewsListColumns.LeadMDName]
    );
    result.RevieweeName = this.mapUser(
      item[Config.SpecialReviewsListColumns.RevieweeName]
    );
    result.ReviewerName = this.mapUser(
      item[Config.SpecialReviewsListColumns.ReviewerName]
    );

    result.LeadMDNameEmail = this.mapUser(
      item[Config.SpecialReviewsListColumns.LeadMDName]
    ).Email;
    result.RevieweeNameEmail = this.mapUser(
      item[Config.SpecialReviewsListColumns.RevieweeName]
    ).Email;
    result.ReviewerNameEmail = this.mapUser(
      item[Config.SpecialReviewsListColumns.ReviewerName]
    ).Email;

    result.EmployeeNumber =
      item[Config.SpecialReviewsListColumns.EmployeeNumber];
    result.HoursWorked = item[Config.SpecialReviewsListColumns.HoursWorked];
    result.JobTitle = item[Config.SpecialReviewsListColumns.JobTitle];

    result.LastHoursBilled =
      item[Config.SpecialReviewsListColumns.LastHoursBilled] == ""
        ? new Date()
        : new Date(item[Config.SpecialReviewsListColumns.LastHoursBilled]);

    //result.LastHoursBilled = item[Config.SpecialReviewsListColumns.LastHoursBilled];

    result.NewReviewID = item[Config.SpecialReviewsListColumns.NewReviewID];
    result.ProjectCode = item[Config.SpecialReviewsListColumns.ProjectCode];
    result.ProjectStatus = item[Config.SpecialReviewsListColumns.ProjectStatus];

    return result;
  }
  private static mapSplitReviews(item: any) {
    let result = new PEPI_SplitReviews();
    result.SplitReviewStatus =
      item[Config.SplitReviewsListColumns.SplitReviewStatus];
    result.Title = item[Config.BaseColumns.Title];
    result.ID = item.ID;
    result.SourceReviewID = item[Config.SplitReviewsListColumns.SourceReviewID];
    result.HourstoReview = item[Config.SplitReviewsListColumns.HourstoReview];
    result.SplitReviewID = item[Config.SplitReviewsListColumns.SplitReviewID];

    return result;
  }
  private static mapSplitAdmin(item: any) {
    debugger;
    let result = new PEPI_SplitAdmin();
    result.Title = item[Config.BaseColumns.Title];
    result.SplitAdminStatus =
      item[Config.SplitAdminListColumns.SplitAdminStatus];
    result.ID = item.ID;
    result.SourceReviewID = item[Config.SplitAdminListColumns.SourceReviewID];
    result.HourstoReview = item[Config.SplitAdminListColumns.HourstoReview];
    result.SplitReviewID = item[Config.SplitAdminListColumns.SplitReviewID];
    result.RevieweeName = this.mapUser(
      item[Config.SplitAdminListColumns.RevieweeName]
    );
    result.RevieweeNameEmail = this.mapUser(
      item[Config.SplitAdminListColumns.RevieweeName]
    ).Email;
    return result;
  }

  private static mapPEPIItemID(item: any): Number {
    return item["ID"];
  }

  // private static mapMentorDetails(item: any) {
  //     // let result = this.mapUser(item[Config.MentorListColumns.Mentor]);
  //     // return result;
  //     return;
  // }

  ////#endregion

  //#region "Common Mappers"

  // Mapping multiple user
  private static mapUsers(userEntries: any): User[] {
    let result: User[] = [];
    if (userEntries instanceof Array) {
      userEntries.forEach((user) => {
        result.push(this.mapUser(user));
      });
    } else {
      result.push(this.mapUser(userEntries));
    }

    return result;
  }

  // Mapping single user
  private static mapUser(user: any): User {
    // This in required, as in CAML it returns array even if it is single user
    if (user instanceof Array && user.length > 0) {
      user = user[0];
    }
    // Case : when it is null
    if (!user) {
      return new User();
    }
    let result: User = new User();
    result.Email = user["email"];
    result.Id = user["id"];
    result.LoginName = user["sip"];

    if (result.LoginName.indexOf("i:0#") < 0) {
      result.LoginName = "i:0#.f|membership|" + result.Email;
    }

    result.Title = user["title"];
    return result;
  }

  // Mapping boolean value
  private static mapBoolean(itemValue: any): boolean {
    if (itemValue) {
      let result: boolean;
      result = itemValue == "Yes" || itemValue.value == "1" ? true : false;
      return result;
    }
    return undefined;
  }

  // Mapping date field
  private static mapDate(dateField: any): Date {
    if (dateField) {
      return new Date(dateField);
    }
    return undefined;
  }

  // Mapping date field and return formatted date string
  private static mapDateWithFormat(dateField: any): string {
    if (dateField) {
      return moment(dateField).format("M/DD/YYYY");
    }
    return "";
  }

  //#endregion
}
