import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ISubmitCombineReviewsProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  AppContext: WebPartContext;
  value:any;
  ItemID: number;
}
