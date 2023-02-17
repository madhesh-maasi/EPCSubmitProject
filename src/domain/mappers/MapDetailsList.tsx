import * as React from "react";
import { Announced } from "@fluentui/react/lib/Announced";
import { TextField, ITextFieldStyles } from "@fluentui/react/lib/TextField";
import {
  DetailsList,
  DetailsListLayoutMode,
  Selection,
  IColumn,
  IDetailsListStyles,
  Persona,
  PersonaPresence,
  PersonaSize,
} from "@fluentui/react";
import { MarqueeSelection } from "@fluentui/react/lib/MarqueeSelection";
import { mergeStyles } from "@fluentui/react/lib/Styling";
import ListItemService from "../../services/ListItemService";
import { Enums } from "../../globals/Enums";
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { Web } from "@pnp/sp/webs";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { PEPI_PEPIDetails } from "../models/PEPI_PEPIDetails";
import { Config } from "../../globals/Config";
import { Label, SelectionMode } from "office-ui-fabric-react";
import MapResult from "./MapResult";

export interface IDetailsListBasicExampleItem {
  key: number;
  name: string;
  value: number;
}

export interface IDetailsListBasicExampleState {
  items: IDetailsListBasicExampleItem[];
  columns: IColumn[];
  Loader: boolean;
}

export interface IDetailsListProps {
  AppContext: WebPartContext;
  ReviewerName: any;
  ViewId: number;
}
let loggeduseremail;
let totalValue: number = 10;

export class MapDetailsList extends React.Component<
  // {},
  IDetailsListProps,
  IDetailsListBasicExampleState
> {
  private _allItems: IDetailsListBasicExampleItem[];
  private _columns: IColumn[];
  private ListItemService: ListItemService;
  listPEPIProjectsItemService: ListItemService;
  private DetailsListStyles: Partial<IDetailsListStyles>;

  constructor(props: any) {
    super(props);

    loggeduseremail = this.props.AppContext.pageContext.user.email;

    this._columns = [
      {
        key: "column1",
        name: "ID",
        fieldName: "ID",
        minWidth: 40,
        maxWidth: 40,
        isResizable: true,
        onColumnClick: this._onColumnClick,
      },
      {
        key: "column2",
        name: "Project Name",
        fieldName: "ProjectName",
        minWidth: 100,
        maxWidth: 120,
        isResizable: true,
        onColumnClick: this._onColumnClick,
      },
      {
        key: "column3",
        name: "Project Code",
        fieldName: "ProjectCode",
        minWidth: 100,
        maxWidth: 100,
        isResizable: true,
        onColumnClick: this._onColumnClick,
      },
      {
        key: "column4",
        name: "Reviewer Name",
        fieldName: "ReviewerName",
        minWidth: 150,
        maxWidth: 170,
        isResizable: true,
        onColumnClick: this._onColumnClick,
        onRender: (item) => (
          <div
            title={item.ReviewerName}
            style={{
              display: "flex",
              marginTop: -2,
            }}
          >
            <div style={{ cursor: "pointer" }}>
              <Persona
                title={item.ReviewerName}
                size={PersonaSize.size24}
                presence={PersonaPresence.none}
                imageUrl={
                  "/_layouts/15/userphoto.aspx?size=S&username=" +
                  `${item.ReviewerNameEmail}`
                }
              />
            </div>
            <Label
              style={{
                marginTop: -1,
                color: "#858585",
                fontWeight: 400,
                fontSize: 12,
              }}
            >
              {item.ReviewerName}
            </Label>
          </div>
        ),
      },
      {
        key: "column5",
        name: "Lead MD Name",
        fieldName: "LeadName",
        minWidth: 150,
        maxWidth: 170,
        isResizable: true,
        onColumnClick: this._onColumnClick,
        onRender: (item) => (
          <div
            title={item.LeadName}
            style={{
              display: "flex",
              marginTop: -2,
            }}
          >
            <div style={{ cursor: "pointer" }}>
              <Persona
                title={item.LeadName}
                size={PersonaSize.size24}
                presence={PersonaPresence.none}
                imageUrl={
                  "/_layouts/15/userphoto.aspx?size=S&username=" +
                  `${item.LeadNameEmail}`
                }
              />
            </div>
            <Label
              style={{
                marginTop: -1,
                color: "#858585",
                fontWeight: 400,
                fontSize: 12,
              }}
            >
              {item.LeadName}
            </Label>
          </div>
        ),
      },
      {
        key: "column6",
        name: "Hours Worked",
        fieldName: "HoursWorked",
        minWidth: 100,
        maxWidth: 100,
        isResizable: true,
        onColumnClick: this._onColumnClick,
      },
      {
        key: "column7",
        name: "Project Start Date",
        fieldName: "ProjectStartDate",
        minWidth: 100,
        maxWidth: 120,
        isResizable: true,
        onColumnClick: this._onColumnClick,
      },
      {
        key: "column8",
        name: "Project End Date",
        fieldName: "ProjectEndDate",
        minWidth: 100,
        maxWidth: 120,
        isResizable: true,
        onColumnClick: this._onColumnClick,
      },
      {
        key: "column9",
        name: "Last Hours Billed",
        fieldName: "LastHoursBilled",
        minWidth: 100,
        maxWidth: 120,
        isResizable: true,
        onColumnClick: this._onColumnClick,
      },
    ];

    this.state = {
      Loader: false,
      items: [],
      columns: this._columns,
    };

    this.DetailsListStyles = {
      root: {
        width: "100%",
        overflowX: "none",

        selectors: {
          ".ms-DetailsRow-cell": {
            height: 45,
          },
          ".ms-DetailsRow-fields": {
            alignItems: "center",
          },
        },
        ".ms-DetailsHeader-cellName": {
          fontSize: "12px !important",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        },
      },

      headerWrapper: {
        flex: "0 0 auto",
      },
      contentWrapper: {
        flex: "1 1 auto",
        overflowY: "auto",
      },
    };
  }

  public async componentDidMount() {
    this.listPEPIProjectsItemService = new ListItemService(
      this.props.AppContext,
      Config.ListNames.PEPIProjects
    );
    let camlFilterConditions = "";

    if (this.props.ViewId == 1) {
      //RevieweeMeUnstarted
      camlFilterConditions = `<Where><And><Eq><FieldRef Name='Reviewee_x0020_Name' LookupId='TRUE'/><Value Type='User'>${this.props.ReviewerName.Id}</Value></Eq><Neq><FieldRef Name='Submitted'/><Value Type='Number'>1</Value></Neq></And></Where>`;
    } else if (this.props.ViewId == 2) {
      //RevieweeMeStatusOfReviewSplit
      camlFilterConditions = `<Where><And><Eq><FieldRef Name='Reviewee_x0020_Name' LookupId='TRUE'/><Value Type='User'>${this.props.ReviewerName.Id}</Value></Eq><Eq><FieldRef Name='Status_x0020_of_x0020_Review'/><Value Type='Text'>Split</Value></Eq></And></Where>`;
    } else if (this.props.ViewId == 3) {
      //RevieweeMeProjectStatusSplit
      camlFilterConditions = `<Where><And><Eq><FieldRef Name='Reviewee_x0020_Name' LookupId='TRUE'/><Value Type='User'>${this.props.ReviewerName.Id}</Value></Eq><Eq><FieldRef Name='Project_x0020_Status'/><Value Type='Text'>Split</Value></Eq></And></Where>`;
    }

    this.getThresholdData(
      [],
      undefined,
      camlFilterConditions,
      10000,
      Enums.ItemResultType.PEPI_PEPIDetails
    );
  }

  public async getThresholdData(
    selectFields: string[],
    orderByXML: string,
    camlFilterConditions: string | undefined,
    rowLimit: number | undefined,
    resultType: Enums.ItemResultType
  ) {
    let globalData = [];
    let viewXML =
      "<View Scope='RecursiveAll'><Query><OrderBy><FieldRef Name='ID' Ascending='FALSE'/></OrderBy>" +
      camlFilterConditions +
      "</Query><RowLimit Paged='TRUE'>500</RowLimit></View>";

    await sp.web.lists
      .getByTitle("PEPIProjects")
      .renderListDataAsStream({
        ViewXml: viewXML,
      })
      .then(async (items) => {
        globalData.push(...items.Row);
        if (items.NextHref && globalData.length < totalValue) {
          this.getPagedValues(
            globalData,
            selectFields,
            orderByXML,
            camlFilterConditions,
            rowLimit,
            resultType
          );
        } else {
          this.dataManipulationFunction(globalData, resultType);
        }
      });
  }

  public async getPagedValues(
    data,
    selectFields: string[],
    orderByXML: string,
    camlFilterConditions: string | undefined,
    rowLimit: number | undefined,
    resultType: Enums.ItemResultType
  ) {
    let globalData = data;
    let viewXML =
      "<View><Query><OrderBy><FieldRef Name='ID' Ascending='FALSE'/></OrderBy>" +
      camlFilterConditions +
      "</Query><RowLimit Paged='TRUE'>500</RowLimit></View>";

    await sp.web.lists
      .getByTitle("PEPIProjects")
      .renderListDataAsStream({
        ViewXml: viewXML,
      })
      .then(async (items) => {
        globalData.push(...items.Row);
        if (items.NextHref && globalData.length < totalValue) {
          this.getPagedValues(
            globalData,
            selectFields,
            orderByXML,
            camlFilterConditions,
            rowLimit,
            resultType
          );
        } else {
          this.dataManipulationFunction(globalData, resultType);
        }
      });
  }

  public async dataManipulationFunction(globalData, resultType) {
    let pepiDetails: any[] = await MapResult.map(
      globalData,
      Enums.MapperType.CAMLResult,
      resultType
    );
    console.log(pepiDetails, this.props.ViewId);
    if (this.props.ViewId == 1) {
      //RevieweeMeUnstarted
      pepiDetails = pepiDetails
        ? pepiDetails.filter((item) => {
            return (
              item.Reviewee.Email == this.props.ReviewerName.Email &&
              item.StatusOfReview == ""
            );
          })
        : [];
    } else if (this.props.ViewId == 2) {
      //RevieweeMeStatusOfReviewSplit
      pepiDetails = pepiDetails
        ? pepiDetails.filter((item) => {
            return item.Reviewee.Email == this.props.ReviewerName.Email;
          })
        : [];
    } else if (this.props.ViewId == 3) {
      //RevieweeMeProjectStatusSplit
      pepiDetails = pepiDetails
        ? pepiDetails.filter((item) => {
            return (
              item.Reviewee.Email == this.props.ReviewerName.Email &&
              item.StatusOfReview != "Acknowledged" &&
              item.StatusOfReview != "Declined"
            );
          })
        : [];
    }
    let tempArr = [];
    pepiDetails.forEach((arr) => {
      if (tempArr.length < totalValue) {
        tempArr.push({
          ID: arr.ID,
          ProjectName: arr.Title,
          ProjectCode: arr.ProjectCode,
          ReviewerName: arr.Reviewee ? arr.Reviewee.Title : "",
          ReviewerNameEmail: arr.Reviewee ? arr.Reviewee.Email : "",
          LeadName: arr.LeadMD ? arr.LeadMD.Title : "",
          LeadNameEmail: arr.LeadMD ? arr.LeadMD.Email : "",
          HoursWorked: arr.HoursWorked,
          ProjectStartDate: arr.ProjectStartDate,
          ProjectEndDate: arr.ProjectEndDate,
          LastHoursBilled: arr.LastHoursBilled,
        });
      }
    });
    this.setState({
      Loader: true,
      items: tempArr,
    });
  }

  private _onColumnClick = (
    ev: React.MouseEvent<HTMLElement>,
    column: IColumn
  ): void => {
    const { columns, items } = this.state;
    const newColumns: IColumn[] = columns.slice();
    const currColumn: IColumn = newColumns.filter(
      (currCol) => column.key === currCol.key
    )[0];
    newColumns.forEach((newCol: IColumn) => {
      if (newCol === currColumn) {
        currColumn.isSortedDescending = !currColumn.isSortedDescending;
        currColumn.isSorted = true;
      } else {
        newCol.isSorted = false;
        newCol.isSortedDescending = true;
      }
    });
    const newItems = _copyAndSort(
      items,
      currColumn.fieldName!,
      currColumn.isSortedDescending
    );
    this.setState({
      columns: newColumns,
      items: newItems,
    });
  };

  public render(): JSX.Element {
    const { items, columns } = this.state;

    return (
      <div>
        {this.state.Loader ? (
          <div
            style={{
              margin: "0 10px 0 10px",
            }}
          >
            <DetailsList
              items={items}
              columns={columns}
              styles={this.DetailsListStyles}
              selectionMode={SelectionMode.none}
              layoutMode={DetailsListLayoutMode.justified}
            />
            {items.length == 0 ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Label style={{ fontWeight: 600 }}>No data found !!!</Label>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }
}

function _copyAndSort<T>(
  items: T[],
  columnKey: string,
  isSortedDescending?: boolean
): T[] {
  const key = columnKey as keyof T;
  return items
    .slice(0)
    .sort((a: T, b: T) =>
      (isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1
    );
}
