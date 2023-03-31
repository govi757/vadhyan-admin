
import { Rules } from "../rules";
import FFieldMDP from "./FFieldMDP";
import GTextField from "./TextField";

export class TextFieldMDP implements FFieldMDP {
    dataSelectorKey: string;
    label: string;
    rules: Rules[] = [];
    className?: string = '';
    mandatory?: boolean = false;
    component = GTextField;


    constructor(props:{
        dataSelectorKey: string;
        label: string;
        rules? : Rules[];
        className?: string;
        mandatory?: boolean;
    }) {
        this.dataSelectorKey = props.dataSelectorKey;
        this.label=props.label;
        this.rules = props.rules || [];
        this.className = props.className;
        this.mandatory = props.mandatory;
    }

    getRules() {
        let rules: Rules[] = [];
        if(this.mandatory) {
            rules.push(Rules.Required)
        }
        return [...rules, ...this.rules]

    }
    

    getMetaData(): object {
        return {
            component: this.component,
            dataSelectorKey: this.dataSelectorKey,
            rules: this.getRules(),
            props: {
                placeholder: this.label,
                className: this.className
            }
        }
    }
    
}