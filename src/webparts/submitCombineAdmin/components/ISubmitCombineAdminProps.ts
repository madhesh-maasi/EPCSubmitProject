import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ISubmitCombineAdminProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  AppContext: WebPartContext;
  value:any;
  ItemID: number;
}
