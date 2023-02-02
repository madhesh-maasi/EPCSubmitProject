import { User } from "./types/User";

export class PEPI_CombineReviews {
    public ID: number;
    public Title?: string;
    public ReviewIDs: string;
    public ProjectManager: User;
    public ProjectStartDate:  Date;
    public ProjectEndDate: Date;
    public JobTitle: string;
    public LastHoursBilled: Date;
    public NewReviewID: string;
    
}