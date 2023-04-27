// This namespace contains solution specific Configuration items
export namespace Config {
  export const Search_RowLimit = 250;
  export const List_ThresholdLimit = 5000;

  // Date Formats
  export const DateFormatMoment = "";

  export const ListNames = {
    PEPIProjects: "PEPIProjects",
    QuestionText: "Question Text",
    Mentor: "Mentor",
    CombineReviews: "Combine Reviews",
    SpecialReviews: "Special Reviews",
    SplitReviews: "Split Reviews",
    SplitAdmin: "Split Admin",
    CombineAdmin: "Combine Admin",
  };

  export const ListCAMLFields = {};

  // List sharepoint generated columns with internal name
  export const BaseColumns = {
    Id: "Id",
    Title: "Title",
    ModifedBy: "Editor",
    ModifiedOn: "Modified",
  };

  // Key Value pair of PEPI Projects list column title and internal names
  export const PEPIProjectsListColumns = {
    ProjectStartDate: "Project_x0020_Start_x0020_Date",
    ProjectEndDate: "Project_x0020_End_x0020_Date",
    LastHoursBilled: "Last_x0020_Hours_x0020_Billed",
    SignoffHistory: "Signoff_x0020_History",
    StatusOfReview: "Status_x0020_of_x0020_Review",
    RevieweeName: "Reviewee_x0020_Name",
    ReviewerNameId: "Reviewer_x0020_NameId",
    ReviewerName: "Reviewer_x0020_Name",
    RevieweeNameId: "Reviewee_x0020_NameId",
    LeadMDNameId: "Lead_x0020_MD_x0020_NameId",
    LeadMDName: "Lead_x0020_MD_x0020_Name",
    SubstituteUserId: "SubstituteUserId",
    SubstituteUser: "SubstituteUser",
    Submitted: "Submitted",
    ServiceLines: "Service_x0020_Lines",
    Complexity: "Complexity",

    HoursWorked: "Hours_x0020_Worked",
    ProjectCode: "Project_x0020_Code",
    HomeOffice: "Home_x0020_Office",
    JobTitle: "JobTitle1",
    FiscalYear: "Fiscal_x0020_Year",

    AAvgEE: "AAvgEE",
    AAvgER: "AAvgER",
    BAvgEE: "BAvgEE",
    BAvgER: "BAvgER",
    CAvgEE: "CAvgEE",
    CAvgER: "CAvgER",

    A1EE: "A1EE",
    A1RR: "A1ER",
    A2EE: "A2EE",
    A2RR: "A2ER",
    A3EE: "A3EE",
    A3RR: "A3ER",
    B1EE: "B1EE",
    B1RR: "B1ER",
    B2EE: "B2EE",
    B2RR: "B2ER",
    B3EE: "B3EE",
    B3RR: "B3ER",
    B4EE: "B4EE",
    B4RR: "B4ER",
    C1EE: "C1EE",
    C1RR: "C1ER",
    C2EE: "C2EE",
    C2RR: "C2ER",
    C3EE: "C3EE",
    C3RR: "C3ER",

    A11E: "A11E",
    A12E: "A12E",
    A13E: "A13E",
    A14E: "A14E",
    A15E: "A15E",
    A11R: "A11R",
    A12R: "A12R",
    A13R: "A13R",
    A14R: "A14R",
    A15R: "A15R",

    A11D: "A11D",
    A12D: "A12D",
    A13D: "A13D",
    A14D: "A14D",
    A15D: "A15D",

    A21E: "A21E",
    A22E: "A22E",
    A23E: "A23E",
    A24E: "A24E",
    A25E: "A25E",
    A21R: "A21R",
    A22R: "A22R",
    A23R: "A23R",
    A24R: "A24R",
    A25R: "A25R",

    A21D: "A21D",
    A22D: "A22D",
    A23D: "A23D",
    A24D: "A24D",
    A25D: "A25D",

    A31E: "A31E",
    A32E: "A32E",
    A33E: "A33E",
    A31R: "A31R",
    A32R: "A32R",
    A33R: "A33R",
    A31D: "A31D",
    A32D: "A32D",
    A33D: "A33D",

    // Section B

    B11E: "B11E",
    B12E: "B12E",
    B11R: "B11R",
    B12R: "B12R",
    B11D: "B11D",
    B12D: "B12D",

    B21E: "B21E",
    B22E: "B22E",
    B23E: "B23E",
    B21R: "B21R",
    B22R: "B22R",
    B23R: "B23R",
    B21D: "B21D",
    B22D: "B22D",
    B23D: "B23D",

    B31E: "B31E",
    B32E: "B32E",
    B33E: "B33E",
    B31R: "B31R",
    B32R: "B32R",
    B33R: "B33R",
    B31D: "B31D",
    B32D: "B32D",
    B33D: "B33D",

    B41E: "B41E",
    B42E: "B42E",
    B43E: "B43E",
    B41R: "B41R",
    B42R: "B42R",
    B43R: "B43R",
    B41D: "B41D",
    B42D: "B42D",
    B43D: "B43D",

    // Section C

    C11E: "C11E",
    C12E: "C12E",
    C13E: "C13E",
    C11R: "C11R",
    C12R: "C12R",
    C13R: "C13R",
    C11D: "C11D",
    C12D: "C12D",
    C13D: "C13D",

    C21E: "C21E",
    C22E: "C22E",
    C23E: "C23E",
    C24E: "C24E",
    C21R: "C21R",
    C22R: "C22R",
    C23R: "C23R",
    C24R: "C24R",
    C21D: "C21D",
    C22D: "C22D",
    C23D: "C23D",
    C24D: "C24D",

    C31E: "C31E",
    C32E: "C32E",
    C33E: "C33E",
    C31R: "C31R",
    C32R: "C32R",
    C33R: "C33R",
    C31D: "C31D",
    C32D: "C32D",
    C33D: "C33D",

    D11E: "D11E",
    D11R: "D11R",

    E1EE: "E1EE",
    E1ER: "E1ER",
    F1EE: "F1EE",
    F1ER: "F1ER",
    G1EE: "G1EE",
    G1ER: "G1ER",
    H1EE: "H1EE",
    H1ER: "H1ER",
    H1EL: "H1EL",
    AcknowledgementComments: "AcknowledgementComments",
    PerformanceDiscussion: "PerformanceDiscussion",
    RevertToReviewee: "RevertToReviewee",
    RevertToReviewer: "RevertToReviewer",
    OverallPerformance: "OverallPerformance",

    /* Deva changes start */
    SBU: "SBU",
    /* Deva changes end */
  };

  export const PEPIQuestionTextListColumns = {
    Q1: "_x0051_1",
    Q2: "_x0051_2",
    Q3: "_x0051_3",
    Q4: "_x0051_4",
    Q5: "_x0051_5",
    Q6: "_x0051_6",
    Q7: "_x0051_7",
    Q8: "_x0051_8",
    Q9: "_x0051_9",
    Q10: "_x0051_10",
  };

  export const CombineReviewsListColumns = {
    ReviewIDs: "Review_x0020_IDs",
    ProjectManager: "Project_x0020_Manager",
    ProjectStartDate: "Project_x0020_Start_x0020_Date",
    ProjectEndDate: "Project_x0020_End_x0020_Date",
    JobTitle: "Job_x0020_Title",
    LastHoursBilled: "Last_x0020_Hours_x0020_Billed",
    NewReviewID: "New_x0020_Review_x0020_ID",
    CombinedReviewStatus: "CreateCombinedReview",
  };

  export const CombineAdminListColumns = {
    ReviewIDs: "Review_x0020_IDs",
    ProjectManager: "Project_x0020_Manager",
    ProjectStartDate: "Project_x0020_Start_x0020_Date",
    ProjectEndDate: "Project_x0020_End_x0020_Date",
    JobTitle: "JobTitle1",
    LastHoursBilled: "Last_x0020_Hours_x0020_Billed",
    NewReviewID: "New_x0020_Review_x0020_ID",
    RevieweeName: "Reviewee_x0020_Name",
    RevieweeNameId: "Reviewee_x0020_NameId",
    CombinedAdminStatus: "Create_x0020_Combined_x0020_Revi",

    /* Deva changes start */
    SBU: "SBU",
    /* Deva changes end */
  };

  export const SpecialReviewsListColumns = {
    EmployeeNumber: "Employee_x0020_Number",
    HoursWorked: "Hours_x0020_Worked",
    JobTitle: "JobTitle1",
    LastHoursBilled: "Last_x0020_Hours_x0020_Billed",
    LeadMDName: "Lead_x0020_MD_x0020_Name",
    LeadMDNameId: "Lead_x0020_MD_x0020_NameId",
    NewReviewID: "New_x0020_Review_x0020_ID",
    ProjectCode: "Project_x0020_Code",
    ProjectStatus: "Project_x0020_Status",
    RevieweeName: "Reviewee_x0020_Name",
    RevieweeNameId: "Reviewee_x0020_NameId",
    ReviewerName: "Reviewer_x0020_Name",
    ReviewerNameId: "Reviewer_x0020_NameId",
    SpecialReviewStatus: "SpecialReviewPermissionsAdmin",

    /* Deva changes start */
    SBU: "SBU",
    /* Deva changes end */
  };

  export const SplitReviewsListColumns = {
    SourceReviewID: "Source_x0020_Review_x0020_ID",
    HourstoReview: "Hours_x0020_to_x0020_Review",
    SplitReviewID: "Split_x0020_Review_x0020_ID",
    SplitReviewStatus: "CreateSplitReview",
  };

  export const SplitAdminListColumns = {
    SourceReviewID: "Source_x0020_Review_x0020_ID",
    HourstoReview: "Hours_x0020_to_x0020_Review",
    SplitReviewID: "Split_x0020_Review_x0020_ID",
    RevieweeName: "Reviewee_x0020_Name",
    RevieweeNameId: "Reviewee_x0020_NameId",
    SplitAdminStatus: "CreateSplitReviewAdmin",
  };

  export const Links = {
    PEPIProjectsListAllItems: "/Lists/EPEPIProjects/AllItems.aspx",
    HomePageLink: "/",
  };

  export const Strings = {
    NotApplicable: "NA",
    EmployeeAlreadyAdded:
      "Employee Details are already present for the current employee. Please select another employee name.",
  };

  export const StatusOfReview = {
    AwaitingReviewee: "Awaiting Reviewee",
    AwaitingReviewer: "Awaiting Reviewer",
    AwaitingLeadMD: "Awaiting Lead MD",
    AwaitingAcknowledgement: "Awaiting Acknowledgement",
    Acknowledged: "Acknowledged",
    Split: "Split",
    Combined: "Combined",
    Declined: "Declined",

    /* Deva changes start */
    // AwaitingPerformanceDiscussion: "Awaiting Performance Discussion"
    /* Deva changes end */
  };
  
  export const JobRole = {
    SeniorDirector: "Senior Director",
    Director: "Director",
    SeniorAssociate: "Senior Associate",
    Associate: "Associate",
    Manager: "Manager",
    Manager1: "Manager I",
    Analyst: "Analyst",
  };

  export const SubmittedNumber = {
    "0": 0,
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "99": 99,
    "100": 100,
  };
}
