import {
    Box,
    Button,
    Card,
    Checkbox,
    Input,
    TextareaAutosize,
    TextField,
  } from "@mui/material";
  import React, { createElement } from "react";
  import { Col } from "react-bootstrap";
  import ModelComponent from "../components/generic/ModelComponent";
  import { FaCopy } from "react-icons/fa";
  import _ from 'lodash';
  
  interface Column {
    label: string;
    dataSelectorKey: string;
    included?: boolean;
    type?: string;
  }
  
  interface IState {
    smileData: string;
    title?: string;
    columns: Column[];
    code: string;
    importStatement?: string;
    componentCode?: string;
    metaDataCode?:string
  }
  
  export class TableCreator extends ModelComponent<any, IState> {
    constructor(props: any) {
      super(props);
      this.state = {
        smileData: `data FiPaymentDetails(paymentId: string, clientFileNumber: string, paymentType: PAYMENT_TYPE, paymentProvider: PAYMENT_PROVIDER , paymentMode:PAYMENT_MODE?,
          accountNumber: string?, accountHolderName: string?, accountType: ACCOUNT_TYPE?, ifscCode: string?, umrn: string?, eMandateId: string?, presentedDate: string?, 
          totalAmount: number, spaAmount: number, feeAmount: number?, msfAmount: number?, paymentRefNumber: string, remoteTxnRefNumber:string?, remoteTxnRefDetails: object? , achSeqNumber: string?, 
          status: PAYMENT_STATUS , source: string? , details: string?, receivedBy: string?, refId: string?,settledTo: string?, settledToId: string?
     )`,
        columns: [],
        code: "",
        metaDataCode: "",
        importStatement:""
      };
    }
  
    copyCode(type: string) {
      const state: any = this.state;
      navigator.clipboard.writeText(state[type]).then(
        function () {
          alert(" Copying to clipboard was successful!");
        },
        function (err) {}
      );
    }
  
    generateTable() {
      const {
        smileData = `data FiPaymentDetails(paymentId: string, clientFileNumber: string, paymentType: PAYMENT_TYPE, paymentProvider: PAYMENT_PROVIDER , paymentMode:PAYMENT_MODE?,
          accountNumber: string?, accountHolderName: string?, accountType: ACCOUNT_TYPE?, ifscCode: string?, umrn: string?, eMandateId: string?, presentedDate: string?, 
          totalAmount: number, spaAmount: number, feeAmount: number?, msfAmount: number?, paymentRefNumber: string, remoteTxnRefNumber:string?, remoteTxnRefDetails: object? , achSeqNumber: string?, 
          status: PAYMENT_STATUS , source: string? , details: string?, receivedBy: string?, refId: string?,settledTo: string?, settledToId: string?
     )`,
      } = this.state;
      console.log(smileData.trim());
      const unwantedSpaceRemovedString = smileData
        .replace(/[\r\n\t]+/gm, "")
        .trim();
      const splittedCodeWithData = unwantedSpaceRemovedString
        .split("data")[1]
        ?.split(/\((.*?)\)/);
      let columns: Column[] = [];
      console.log(splittedCodeWithData[1].split(","), "splittedCodeWithData");
      splittedCodeWithData[1].split(",").map((item: any) => {
        columns.push({
          dataSelectorKey: item.split(":")[0],
          label: item.split(":")[0],
          included: true,
          type: "addColumn",
        });
      });
  
      this.setState({
        columns,
        title: this.state.title||splittedCodeWithData[0],
      });
      console.log(columns);
    }
  
    handleCheckBox(column: Column) {
      const index = this.state.columns.findIndex(
        (itm) => itm.dataSelectorKey === column.dataSelectorKey
      );
      if (index !== -1) {
        const newCols = this.state.columns;
        newCols[index].included = !newCols[index].included;
        this.setState({
          columns: newCols,
        });
      }
    }
  
    changeColumnState(event: any, column: Column, columnDataSelectorKey: any) {
      const index = this.state.columns.findIndex(
        (itm) => itm.dataSelectorKey === column.dataSelectorKey
      );
      if (index !== -1) {
        const newCols: any = this.state.columns;
        newCols[index][columnDataSelectorKey] = event.target.value;
        this.setState({
          columns: newCols,
        });
      }
    }
  
    handleSelect(val: any, column: any) {
      console.log(val.target.value, column);
    }
    generateCode() {
      const {title,columns} = this.state;
      const code = `import FDataTableMDP from "@/components/generic/table/FDataTableMDP";\n
      export default class ${title}FDataTableMDP  extends FDataTableMDP {
          parent: any;
          constructor({ parent }: { parent: any }) {
              super({title: "${title}", myRefName: "${title}Ref"});
              this.parent = parent;
              this
              ${
                  columns.filter(col => col.included).reduce((acc: string,currVal) => {
                  
                      return acc + `.${currVal.type}({
                          label:"${this.generateLabel(currVal.label)}",
                          dataSelectorKey: "${currVal.dataSelectorKey.trim()}"
                      })`
                  },'')
              }
          }
      }
      `
      const importStatement = `import ${title}FDataTableMDP from './${title}FDataTableMDP'`;
      const metaDataName = `${this.toCamelCase(title)}FDataTableMetaData`
      const metaDataCode = `get ${metaDataName}() {
          return new ${title}FDataTableMDP({parent: this}).getMetaData()
      }`;
      const componentCode = `  <component
      v-if="!!${metaDataName}"
      :ref="${metaDataName}.myRefName"
      :is="${metaDataName}.componentName"
      :value="[]"
      v-bind="${metaDataName}.props"
    ></component>`
      console.log(code);
      this.setState({
          code,
          importStatement,
          componentCode,
          metaDataCode
      },() => {
          // this.copyCode()
      })
    }
  
  
    generateLabel(label: string) {
      const result = label.replace(/([A-Z])/g, " $1").trim();
      const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
      return finalResult;
    }
  
    toCamelCase(text: string="") {
      return _.camelCase(text);
    }
  
    render() {
      return (
        <Box>
          <div className="d-flex  justify-content-center align-center">
            <div className="col-7" style={{ position: "relative" }}>
              <Card elevation={12} className=" p-4 mx-2 mt-5">
              <TextField
                  variant="outlined"
                  placeholder="Title"
                  className="col-12 my-2"
                  label="Title"
                  onInput={(newVal: any) =>
                    this.setState({ title: newVal.target.value })
                  }
                />
                <TextField
                  variant="outlined"
                  placeholder="Enter the smile data here"
                  className="col-12"
                  multiline
                  label="Enter the smile data here"
                  minRows={8}
                  onInput={(newVal: any) =>
                    this.setState({ smileData: newVal.target.value })
                  }
                />
  
                <Button
                  variant="outlined"
                  className="mt-3"
                  onClick={() => this.generateTable()}
                >
                  Generate Table
                </Button>
              </Card>
  
  
              <Card elevation={12} className=" p-4 mx-2 mt-5">
              <FaCopy
                  onClick={() => this.copyCode('importStatement')}
                  style={{
                    position: "absolute",
                    right: "20px",
                    cursor: "pointer",
                  }}
                />
                <h3 className="pb-3">Import statement</h3>
                
                <pre>{this.state.importStatement}</pre>
              </Card>
  
  
  
  
              <Card elevation={12} className=" p-4 mx-2 mt-5">
                
                <FaCopy
                  onClick={() => this.copyCode('metaDataCode')}
                  style={{
                    position: "absolute",
                    right: "20px",
                    cursor: "pointer",
                  }}
                />
                <h3 className="pb-3">MetaData Code</h3>
                <pre>{this.state.metaDataCode}</pre>
              </Card>
  
  
  
  
              <Card elevation={12} className=" p-4 mx-2 mt-5">
                <FaCopy
                  onClick={() => this.copyCode('componentCode')}
                  style={{
                    position: "absolute",
                    right: "20px",
                    cursor: "pointer",
                  }}
                />
                <h3 className="pb-3">Component Code</h3>
                <pre>{this.state.componentCode}</pre>
              </Card>
  
              <Card elevation={12} className=" p-4 mx-2 mt-5">
                <FaCopy
                  onClick={() => this.copyCode('code')}
                  style={{
                    position: "absolute",
                    right: "20px",
                    cursor: "pointer",
                  }}
                />
                <h3 className="pb-3">Table Code</h3>
                <pre>{this.state.code}</pre>
              </Card>
              
            </div>
            <div className="col-5 ">
              <Card elevation={12} className="p-4 mx-3 mt-5">
                <Button onClick={() => this.generateCode()}>Generate Code</Button>
                {this.state.columns.map((column: any, index: number) => {
                  return (
                    <div className="d-flex align-items-center">
                      <Checkbox
                        checked={column.included}
                        onChange={(val) => this.handleCheckBox(column)}
                      />
                      <span className="col-3">{column.label}</span>
                      <select
                        value={column.type}
                        onInput={(val) =>
                          this.changeColumnState(val, column, "type")
                        }
                      >
                        <option value={"addColumn"}>Normal</option>
                        <option value={"addCurrencyColumn"}>Currency</option>
                        <option value={"addNumberColumn"}>Number</option>
                        <option value={"addDateTimeColumn"}>DateTime</option>
                        <option value={"addDateColumn"}>Date</option>
                        <option value={"addClientFileNumberColumn"}>
                          ClientFileNumber
                        </option>
                        <option value={"addClientNameColumn"}>ClientName</option>
                        <option value={"addClientFileStatusColumn"}>
                          ClientFileStatus
                        </option>
                        <option value={"addStatusColumn"}>Status</option>
                        <option value={"addEMandateStatusColumn"}>
                          EMandataStatus
                        </option>
                        <option value={"addPaymentProviderColumn"}>
                          PaymentProvider
                        </option>
                        <option value={"addPaymentStatusColumn"}>
                          PaymentStatus
                        </option>
                      </select>
                    </div>
                  );
                })}
              </Card>
            </div>
          </div>
        </Box>
      );
    }
  }
  