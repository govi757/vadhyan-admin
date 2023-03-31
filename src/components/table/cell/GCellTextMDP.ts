
import GColumnCellMDP from '../GColumnCellMDP';
import GCellText from './GCellText';
export default class GCellTextMDP implements GColumnCellMDP {
    
    dataSelectorKey: string | undefined;
    component: any = GCellText;
    constructor({
        dataSelectorKey
    }: {  dataSelectorKey?: string }) {
        this.dataSelectorKey = dataSelectorKey;
    }
    
    getMetaData(): object {
        return {
            component: this.component,
            props: {
                dataSelectorKey: this.dataSelectorKey,
            }
        }
    }

}