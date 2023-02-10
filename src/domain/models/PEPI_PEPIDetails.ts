import { User } from "./types/User";

export class PEPI_PEPIDetails {
  public ProjectStartDate?: string;
  public ProjectEndDate?: string;
  public LastHoursBilled?: string;

  public ID: number;
  public Title?: string;
  public Submitted: number;
  public SignoffHistory: string;
  public Employee: User;
  public Reviewee: User;
  public Reviewer: User;

  public Replaceme: User;
  public ReplaceUsermailString: string;

  public SubstituteUser: User;
  public LeadMD: User;
  public ServiceLine: string;
  public StatusOfReview: string;
  public Complexity: string;

  public HoursWorked: string;
  public ProjectCode: string;
  public HomeOffice: string;
  public JobTitle: string;
  public FiscalYear: string;

  public IsReviewee: boolean;
  public IsReviewer: boolean;
  public IsLeadMD: boolean;
  public IsApprovaed: boolean;
  public IsAcknowledgement: boolean;

  public A1EE: number;
  public A1RR: number;
  public A1DD: number;
  public A11E: number;
  public A12E: number;
  public A13E: number;
  public A14E: number;
  public A15E: number;
  public A11R: number;
  public A12R: number;
  public A13R: number;
  public A14R: number;
  public A15R: number;
  public A11D: number;
  public A12D: number;
  public A13D: number;
  public A14D: number;
  public A15D: number;

  public A2EE: number;
  public A2RR: number;
  public A2DD: number;
  public A21E: number;
  public A22E: number;
  public A23E: number;
  public A24E: number;
  public A21R: number;
  public A22R: number;
  public A23R: number;
  public A24R: number;
  public A21D: number;
  public A22D: number;
  public A23D: number;
  public A24D: number;

  public A3EE: number;
  public A3RR: number;
  public A3DD: number;
  public A31E: number;
  public A32E: number;
  public A33E: number;
  public A31R: number;
  public A32R: number;
  public A33R: number;
  public A31D: number;
  public A32D: number;
  public A33D: number;

  public B1EE: number;
  public B1RR: number;
  public B2EE: number;
  public B2RR: number;
  public B3EE: number;
  public B3RR: number;
  public B4EE: number;
  public B4RR: number;

  public C1EE: number;
  public C1RR: number;
  public C2EE: number;
  public C2RR: number;
  public C3EE: number;
  public C3RR: number;

  public B11E: number;
  public B12E: number;
  public B11R: number;
  public B12R: number;
  public B21E: number;
  public B22E: number;
  public B23E: number;
  public B21R: number;
  public B22R: number;
  public B23R: number;
  public B31E: number;
  public B32E: number;
  public B33E: number;
  public B31R: number;
  public B32R: number;
  public B33R: number;
  public B41E: number;
  public B42E: number;
  public B43E: number;
  public B41R: number;
  public B42R: number;
  public B43R: number;

  public C11E: number;
  public C12E: number;
  public C13E: number;
  public C11R: number;
  public C12R: number;
  public C13R: number;
  public C21E: number;
  public C22E: number;
  public C23E: number;
  public C24E: number;
  public C21R: number;
  public C22R: number;
  public C23R: number;
  public C24R: number;

  public C31E: number;
  public C32E: number;
  public C33E: number;
  public C31R: number;
  public C32R: number;
  public C33R: number;

  public D11E: string;
  public D11R: string;

  // Avg
  public AAvgEE: number;
  public AAvgER: number;
  public AAvg: number;
  public BAvgEE: number;
  public BAvgER: number;
  public BAvg: number;
  public CAvgEE: number;
  public CAvgER: number;
  public CAvg: number;

  public OverallPerformance: number;

  public E1EE: string;
  public E1ER: string;
  public F1EE: string;
  public F1ER: string;
  public G1EE: string;
  public G1ER: string;
  public H1EE: string;
  public H1ER: string;
  public H1EL: string;
  public AcknowledgementComments: string;
  public PerformanceDiscussion: Date;

  public RevertToReviewee: string;
  public RevertToReviewer: string;

  public dropAverageA11D: number;

  public ModifiedBy: User;
  public ModifiedOn: Date;
  public ModifiedOnFormatted: string;
}
