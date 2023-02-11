import * as React from "react";
import styles from "../SubmitPepiProject.module.scss";
import {
  Dropdown,
  IDropdownOption,
  IStackTokens,
  Label,
  PrimaryButton,
  Stack,
  MessageBar,
  MessageBarType,
  Spinner,
  SpinnerSize,
} from "@fluentui/react";
import { IQuestionTextState } from "./IQuestionTextState";
import { IQuestionTextProps } from "./IQuestionTextProps";
import { PEPI_PEPIQuestionText } from "../../../../domain/models/PEPI_PEPIQuestionText";

export default class QuestionText extends React.Component<
  IQuestionTextProps,
  IQuestionTextState
> {
  // private Options: IDropdownOption[] = [];
  private modifiedRows: PEPI_PEPIQuestionText[] = [];
  constructor(props: any) {
    // alert("Hello");
    super(props);
    this.state = {
      AppContext: props.AppContext,
      IsLoading: false,
      AQuestionText: this.props.QuestionText,
      APEPIDetail: this.props.APEPIDetail,
      Options: this.props.Options,
      // D11E : this.props.SERVICELINEReviewee,
      // D11R : this.props.SERVICELINEReviewer,
      // D11D : this.props.SERVICELINEDifference,
      name: "",
      value: " ",
    };
    this.ResetModifiedRows(undefined);
    this.onChangeD1 = this.onChangeD1.bind(this);
  }
  public async componentDidMount() {
    //     if (this.props.QuestionText.length == 0) {
    //      let tempArr=[{
    //       Difference: "N/A",
    // QuestionText: "Not Applicable for Selected Service Line",
    // Reviewee: "N/A",
    // Reviewer: "N/A",
    //      }]
    //      this.setState({
    //       ModifiedQuestions: tempArr
    //     });
    //     }
    // this.FillOptions();
    //   this.props.APEPIDetail.D11E.split(';').map((item,index) => {
    //     this.modifiedRows[index].Reviewee =  item
    //   });
    //   this.props.APEPIDetail.D11R.split(';').map((item,index) => {
    //     this.modifiedRows[index].Reviewer =  item
    //   });
    //   this.props.onFormFieldValueChange(this.modifiedRows);
  }
  private ResetModifiedRows(rows: PEPI_PEPIQuestionText[]) {
    // debugger;
    this.modifiedRows = [];
    if (rows != undefined) {
      rows.forEach((item) => {
        this.modifiedRows.push({ ...item });
      });
    } else {
      if (this.state.AQuestionText != null) {
        this.state.AQuestionText.forEach((item) => {
          this.modifiedRows.push({ ...item });
        });
      }
    }
  }
  private getAverageCalculation(a, b, c, d, e) {
    a = a == 0.5 ? 0 : a;
    b = b == 0.5 ? 0 : b;
    c = c == 0.5 ? 0 : c;
    d = d == 0.5 ? 0 : d;
    e = e == 0.5 ? 0 : e;
    let aCount = a > 0 ? 1 : 0;
    let bCount = b > 0 ? 1 : 0;
    let cCount = c > 0 ? 1 : 0;
    let dCount = d > 0 ? 1 : 0;
    let eCount = e > 0 ? 1 : 0;
    let AverageOutput =
      (a + b + c + d + e) / (aCount + bCount + cCount + dCount + eCount);
    AverageOutput = isNaN(AverageOutput) ? 0 : AverageOutput;
    return AverageOutput;
  }
  private resetNAValue(val) {
    return val == 0.5 || val == undefined ? 0 : val;
  }
  private onChangeD1(newValue: string, TRValue: string, index: number): void {
    if (TRValue == "D11E") {
      let vallblA11D =
        Number(this.resetNAValue(this.modifiedRows[index].Reviewer)) -
        Number(newValue === "NA" ? 0 : newValue);
      this.modifiedRows[index].Difference = vallblA11D.toString();
      this.modifiedRows[index].Reviewee = newValue === "NA" ? "0.5" : newValue;
    } else if (TRValue == "D11R") {
      let vallblA11D =
        Number(newValue === "NA" ? 0 : newValue) -
        Number(this.resetNAValue(this.modifiedRows[index].Reviewee));
      this.modifiedRows[index].Difference = vallblA11D.toString();
      this.modifiedRows[index].Reviewer = newValue === "NA" ? "0.5" : newValue;
    }
    this.props.onFormFieldValueChange(this.modifiedRows);
  }

  // FillOptions
  private async FillOptions() {
    // this.Options = [{text:'0',key: 0} ,{text:'1',key: 1},{text:'2',key: 2},{text:'3',key: 3},{text:'4',key: 4}];
  }

  public render(): React.ReactElement<IQuestionTextProps> {
    return (
      <div className={styles.sectionContent}>
        <table className={styles.tableSectionD}>
          <tr>
            <td></td>
            <td className={styles.tablelable}> Reviewee </td>
            <td className={styles.tablelable}>Reviewer</td>
            <td className={styles.tablelable}> Difference</td>
          </tr>

          {this.props.QuestionText.map((element, index) => {
            let Question = element.QuestionText.split("-");
            let FirstQuestionText = element.QuestionText.split("-")[0];
            let allQuestionText = "";
            for (var i = 1; i < Object.keys(Question).length; i++) {
              if (i == Object.keys(Question).length - 1) {
                allQuestionText += Question[Object.keys(Question)[i]];
              } else {
                allQuestionText += Question[Object.keys(Question)[i]] + "-";
              }
            }
            //! let allQuestionText = "";
            // for (var i = 1; i < Object.keys(Question).length; i++) {
            //   allQuestionText += Question[Object.keys(Question)[i]];
            // }

            //!Old code
            // return <tr>
            //     {/* <td> <label className={styles.tablelable}> {element.QuestionText.split('-')[0]} - </label> {element.QuestionText.split('-')[1]}</td> */}
            //     <td> <label className={styles.tablelable}> {FirstQuestionText} - </label> {allQuestionText}</td>
            //     <td className={styles.tablelable}><Dropdown disabled={this.props.IsReviewee} options={this.props.Options} selectedKey={Number(element.Reviewee)} onChange={(e, selectedOption) => { this.onChangeD1(selectedOption.text, "D11E", index); }} /> </td>
            //     <td className={styles.tablelable}><Dropdown disabled={this.props.IsReviewer} options={this.props.Options} selectedKey={Number(element.Reviewer)} onChange={(e, selectedOption) => { this.onChangeD1(selectedOption.text, "D11R", index); }} /></td>
            //     <td className={styles.tablelable}><label>{element.Difference} </label></td>
            // </tr>;

            return (
              <tr>
                <td
                  style={{
                    paddingTop: "2%",
                    width: "80%",
                  }}
                >
                  {" "}
                  <label className={styles.tablelable}>
                    {" "}
                    {FirstQuestionText} -{" "}
                  </label>{" "}
                  {allQuestionText}
                </td>
                <td className={styles.doppadding}>
                  <Dropdown
                    disabled={
                      this.props.IsReviewee || FirstQuestionText == "N/A"
                    }
                    options={this.props.Options}
                    selectedKey={Number(element.Reviewee)}
                    onChange={(e, selectedOption) => {
                      this.onChangeD1(selectedOption.text, "D11E", index);
                    }}
                  />{" "}
                </td>
                <td className={styles.doppadding}>
                  <Dropdown
                    disabled={
                      this.props.IsReviewer || FirstQuestionText == "N/A"
                    }
                    options={this.props.Options}
                    // selectedKey={Number(element.Reviewer)}
                    selectedKey={
                      this.props.IsAwaitingReviewee
                        ? ""
                        : Number(element.Reviewer)
                    }
                    onChange={(e, selectedOption) => {
                      this.onChangeD1(selectedOption.text, "D11R", index);
                    }}
                  />
                </td>
                <td className={styles.doppadding}>
                  <label>
                    {this.props.IsAwaitingReviewee
                      ? 0 - Number(this.resetNAValue(element.Reviewee))
                      : element.Difference}{" "}
                  </label>
                </td>
              </tr>
            );
          })}

          {this.props.QuestionText.length == 0 ? (
            <tr>
              <td
                style={{
                  // paddingTop: "2%",
                  width: "80%",
                }}
              >
                <label className={styles.tablelable}>
                  {"Not Applicable for Selected Service Line"}
                </label>
              </td>
              <td className={styles.doppadding}>{"N/A"}</td>
              <td className={styles.doppadding}>{"N/A"}</td>
              <td className={styles.doppadding}>
                <label>{"N/A"}</label>
              </td>
            </tr>
          ) : null}
          <tr className={styles.divbox}>
            <td>
              <label className={styles.tablelable}>
                {" "}
                SECTION D COMPETENCY AVERAGE{" "}
              </label>
            </td>
            <td className={styles.doppadding}>
              {" "}
              <label>{this.props.SctionTotalDE}</label>
            </td>
            <td className={styles.doppadding}>
              {" "}
              <label>{this.props.SctionTotalDR}</label>
            </td>
            <td className={styles.doppadding}>
              {" "}
              <label>{this.props.SctionTotalDD}</label>
            </td>
          </tr>
        </table>
      </div>
    );
  }
}
