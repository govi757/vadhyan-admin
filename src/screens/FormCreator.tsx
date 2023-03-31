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
  
  export class FormCreator extends ModelComponent<any, IState> {
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
      const unwantedSpaceRemovedString = smileData
        .replace(/[\r\n\t]+/gm, "")
        .trim();
      const splittedCodeWithData = unwantedSpaceRemovedString
        .split("data")[1]
        ?.split(/\((.*?)\)/);
      let columns: Column[] = [];
      splittedCodeWithData[1].split(",").map((item: any) => {
        columns.push({
          dataSelectorKey: item.split(":")[0],
          label: item.split(":")[0],
          included: true,
          type: "FTextFieldMDP",
        });
      });
  
      this.setState({
        columns,
        title: this.state.title||splittedCodeWithData[0],
      });
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
      
    }
    generateCode() {
      const {title,columns} = this.state;
      const imports = columns.map(item => item.type);
      const uniqueImportList = imports.filter((item, index) => imports.indexOf(item) === index);
      console.log(imports,uniqueImportList);
      const code = `import FFormMDP, { FFormChildMDP } from "@/components/generic/form/FFormMDP";\n
      import FTextFieldMDP from "@/components/generic/form/field/FTextFieldMDP"; \n
      ${uniqueImportList.reduce((acc,curValue) => acc + `import ${curValue} from "@/components/generic/form/field/${curValue}"; \n`,"")}
      export default class ${title}FFormMDP  extends FFormMDP {
          childMDP = new FFormChildMDP();
          parent: any;
          constructor({ parent }: { parent: any }) {
              super({ myRefName: "${title}Ref"});
              this.parent = parent;
              this
              ${
                  columns.filter(col => col.included).reduce((acc: string,currVal) => {
                  
                      return acc + `.addField(
                        new ${currVal.type}({
                            parentMDP: this.childMDP,
                            dataSelectorKey: "accountNumber",
                            label: "Account Number",
                        })
                      )`
                  },'')
              }
          }
      }
      `
      const importStatement = `import ${title}FFormMDP from './${title}FFormMDP'`;
      const metaDataName = `${this.toCamelCase(title)}FFormMetaData`
      const metaDataCode = `get ${metaDataName}() {
          return new ${title}FFormMDP({parent: this}).getMetaData()
      }`;
      const componentCode = `  <component
      v-if="!!${metaDataName}"
      :ref="${metaDataName}.myRefName"
      :is="${metaDataName}.componentName"
      :value="selectModel(input, undefined)"
      @input="(newValue) => updateModel(input, newValue, undefined)"
      v-bind="${metaDataName}.props"
    ></component>`
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
                  Generate Form
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
                        <option value={"FTextFieldMDP"}>Normal</option>
                        <option value={"FCurrencyFieldMDP"}>Currency</option>
                        <option value={"FSelectDateFieldMDP"}>DateTime</option>
                        <option value={"FCFAWSUploadFileFieldMDP"}>AWS File</option>
                        <option value={"FSelectFieldMDP"}>Select</option>
                        
                        
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
  