import MDP from "../generic/MDP";
import GCellTextMDP from "./cell/GCellTextMDP";
import GColumnCellMDP from "./GColumnCellMDP";

export default class FColumnMDP implements MDP {

    label: string;
    dataSelectorKey: string | undefined;
    align: string = "left";
    sortable?: boolean;
    columnCellMDP?: GColumnCellMDP;
    hidden: boolean;
    width?: string;
    enableCopy?: boolean;
    enableGroupBy?: boolean;

    constructor(props: {
        label: string;
        dataSelectorKey?: string ;
        align?: string;
        sortable?: boolean;
        columnCellMDP?: GColumnCellMDP;
        hidden?: boolean;
        width?: string
        enableCopy?: boolean;
        enableGroupBy?: boolean;
    }) {
        this.label = props.label;
        this.dataSelectorKey = props.dataSelectorKey;
        this.align = props.align||"left";
        this.sortable = props.sortable || true;
        this.hidden = props.hidden || false;
        this.columnCellMDP = props.columnCellMDP || new GCellTextMDP({dataSelectorKey: this.dataSelectorKey});
        this.width = props.width;
        this.enableCopy = props.enableCopy;
        this.enableGroupBy = props.enableGroupBy;
    }

    getMetaData(): object {
        return {

        }
    }
}