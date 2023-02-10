import * as React from "react";
import { Announced } from "@fluentui/react/lib/Announced";
import { TextField, ITextFieldStyles } from "@fluentui/react/lib/TextField";
import {
  DetailsList,
  DetailsListLayoutMode,
  Selection,
  IColumn,
  IDetailsListStyles,
} from "@fluentui/react/lib/DetailsList";
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

export interface IDetailsListBasicExampleItem {
  key: number;
  name: string;
  value: number;
}

export interface IDetailsListBasicExampleState {
  items: IDetailsListBasicExampleItem[];
  columns: IColumn[];
}

export interface IDetailsListProps {
  AppContext: WebPartContext;
}
let loggeduseremail;
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
        minWidth: 50,
        maxWidth: 100,
        isResizable: true,
        onColumnClick: this._onColumnClick,
      },
      {
        key: "column2",
        name: "Project Name",
        fieldName: "ProjectName",
        minWidth: 100,
        maxWidth: 100,
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
        minWidth: 100,
        maxWidth: 100,
        isResizable: true,
        onColumnClick: this._onColumnClick,
      },
      {
        key: "column5",
        name: "Lead MD Name",
        fieldName: "LeadName",
        minWidth: 100,
        maxWidth: 100,
        isResizable: true,
        onColumnClick: this._onColumnClick,
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
        maxWidth: 150,
        isResizable: true,
        onColumnClick: this._onColumnClick,
      },
      {
        key: "column8",
        name: "Project End Date",
        fieldName: "ProjectEndDate",
        minWidth: 100,
        maxWidth: 150,
        isResizable: true,
        onColumnClick: this._onColumnClick,
      },
      {
        key: "column9",
        name: "Last Hours Billed",
        fieldName: "LastHoursBilled",
        minWidth: 100,
        maxWidth: 100,
        isResizable: true,
        onColumnClick: this._onColumnClick,
      },
    ];

    this.state = {
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
        },
        ".ms-DetailsHeader-cellName": {
          fontSize: "12px !important",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        },
      },

      headerWrapper: {},
      contentWrapper: {},
    };
  }

  public async componentDidMount() {
    this.listPEPIProjectsItemService = new ListItemService(
      this.props.AppContext,
      Config.ListNames.PEPIProjects
    );
    const camlFilterConditions =
      "<Where><IsNull><FieldRef Name='Project_x0020_Status'/></IsNull> </Where>";
    const pepiDetails =
      await this.listPEPIProjectsItemService.getItemsUsingCAML(
        [],
        undefined,
        camlFilterConditions,
        5000,
        Enums.ItemResultType.PEPI_PEPIDetails
      );

    let tempArr = [];
    pepiDetails.forEach((arr) => {
      tempArr.push({
        ID: arr.ID,
        ProjectName: arr.Title,
        ProjectCode: arr.ProjectCode,
        ReviewerName: arr.Reviewee ? arr.Reviewee.Title : "",
        ReviewerNameEmail: arr.Reviewee ? arr.Reviewee.Email : "",
        LeadName: arr.LeadMD ? arr.LeadMD.Title : "",
        LeadNameEmail: arr.LeadMD ? arr.LeadMD.Email : "",
        HoursWorked: arr.HoursWorked,
        ProjectStartDate: arr[Config.PEPIProjectsListColumns.ProjectStartDate],
        ProjectEndDate: arr[Config.PEPIProjectsListColumns.ProjectEndDate],
        LastHoursBilled: arr[Config.PEPIProjectsListColumns.LastHoursBilled],
      });
    });
    this.setState({
      items: tempArr,
    });
    console.log(pepiDetails);
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
      <div
        style={{
          marginTop: 10,
        }}
      >
        <DetailsList
          items={items}
          columns={columns}
          styles={this.DetailsListStyles}
          setKey="set"
          layoutMode={DetailsListLayoutMode.justified}
          selectionPreservedOnEmptyClick={true}
          ariaLabelForSelectionColumn="Toggle selection"
          ariaLabelForSelectAllCheckbox="Toggle selection for all items"
          checkButtonAriaLabel="select row"
        />
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
