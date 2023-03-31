import { Box, Button, Grid } from "@mui/material";
import { createElement } from "react";
import ModelComponent from "../generic/ModelComponent";
import { Rules, RuleValidation } from "./rules";
interface IProps {
  fieldMetaDataList?: any[];
  value?: any;
  onInput?: (value: any) => void;
}
export default class GenericForm extends ModelComponent<IProps, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      error: {},
    };
  }

  handleOnInput(value: any, key: string) {
    const modelValue = this.props.value;
    modelValue[key] = value;
    if (this.props.onInput) this.props.onInput(modelValue);
  }

  validateInput() {
    console.log(this.props.value,"this.props.value", this.props.fieldMetaDataList)
    const error = this.state.error;
    this.props.fieldMetaDataList?.forEach(filedMetaData => {
        const ruleValidation = new RuleValidation();
        const errorMsg = ruleValidation.validateValueWithRule(this.props.value,filedMetaData.dataSelectorKey,filedMetaData.rules)
        error[filedMetaData.dataSelectorKey ] = errorMsg;
    });
    this.setState({
        error
    })
  }



  render() {
    console.log(this.props.value, this.state.error);
    return (
      <div className="col-12">
        <form className="d-flex align-center justify-center flex-column">
        <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {this.props.fieldMetaDataList?.map((fieldMetaData, index) => {
            return (
                <Grid key={index} item xs={12}>
              <div >
                {createElement(fieldMetaData.component, {
                  ...fieldMetaData.props,
                  onInput: (value: any) =>
                    this.handleOnInput(value, fieldMetaData.dataSelectorKey),
                  error: (this.state.error[fieldMetaData.dataSelectorKey] !=='' && !!this.state.error[fieldMetaData.dataSelectorKey])?true: false,
                  helperText: this.state.error[fieldMetaData.dataSelectorKey]
                })}
              </div>
              </Grid>
            );
          })}
          
          
          </Grid>
          </Box>
          
          <Button className="my-4" variant="outlined" onClick={() =>  this.validateInput()}>Submit</Button>
        </form>
      </div>
    );
  }
}

