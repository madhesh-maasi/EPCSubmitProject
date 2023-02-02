import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ISubmitSplitAdminProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  AppContext: WebPartContext;
  value:any;
  ItemID: number;
}
