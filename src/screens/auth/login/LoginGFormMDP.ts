import { TextFieldMDP } from "../../../components/form/fileds/TextFieldMDP";
import { GenericFormMDP } from "../../../components/form/GenericFormMDP";
import { Rules } from "../../../components/form/rules";

export class LoginGFormMDP extends GenericFormMDP {
    constructor(props: {}) {
        super({myRefName: 'LoginFormRef'});

        this.addField(new TextFieldMDP({
            dataSelectorKey:"emailId",
            label:"sdsd",
            className:'col-12',
            mandatory: true,
            rules: [Rules.EMail],
        }))
        .addField(new TextFieldMDP({
            dataSelectorKey:"password",
            label:"sdsd",
            className:'col-12',
            rules: [Rules.Password],
            mandatory: true
        }))
    }   
}