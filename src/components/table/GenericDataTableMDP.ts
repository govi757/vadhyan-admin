import GenericDataTable from "./GenericDataTable";


export class GenericDataTableMDP {
    component: any = GenericDataTable;
    myRefName: string;
    columnList: any[] = [];

    constructor({ myRefName }: { myRefName: string }) {
        this.myRefName = myRefName;
    }

    addColumn(newField: any) {
        this.columnList.push(newField);
        return this;
    }
    
    getMetaData(): object {
        return {
            component: this.component,
            myRefName: this.myRefName,
            props: {
                fieldMetaDataList: this.columnList.map(column => column.getMetaData())
            }
        }
    }
}