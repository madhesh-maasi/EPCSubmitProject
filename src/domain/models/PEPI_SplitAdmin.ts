import { User } from "./types/User";
export class PEPI_SplitAdmin {
  public ID: number;
  public Title?: string;
  public SourceReviewID: string;
  public HourstoReview: string;
  public SplitReviewID: string;
  public RevieweeNameEmail: string;
  public RevieweeName: User;
  public SplitAdminStatus?: string;
}
