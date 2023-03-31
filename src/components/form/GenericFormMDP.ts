import FFieldMDP from "./fileds/FFieldMDP";
import GenericForm from "./GenericForm";

export class GenericFormMDP {
    component: any = GenericForm;
    myRefName: string;
    fieldList: FFieldMDP[] = [];

    constructor({ myRefName }: { myRefName: string }) {
        this.myRefName = myRefName;
    }

    addField(newField: FFieldMDP) {
        this.fieldList.push(newField);
        return this;
    }
    getMetaData(): object {
        return {
            component: this.component,
            myRefName: this.myRefName,
            props: {
                fieldMetaDataList: this.fieldList.map(field => field.getMetaData())
            }
        }
    }
}