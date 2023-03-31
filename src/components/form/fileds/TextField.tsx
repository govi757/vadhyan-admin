import { ReactNode } from "react";
import ModelComponent from "../../generic/ModelComponent";
import TextField from '@mui/material/TextField';

interface IProps {
  value?: string;
  onInput?: (val: any) => void;
}

interface IState {}
export default class GTextField extends ModelComponent<IProps, IState> {
  handleNewValue(newVal: any) {
    if (this.props.onInput) this.props.onInput(newVal.target.value);
  }

  render(): ReactNode {
    return (
      <TextField
        {...this.props}
        type="text"
        value={this.selectModel(this.props.value, undefined)}
        onInput={(newVal) => this.handleNewValue(newVal)}
      ></TextField>
    );
  }
}
