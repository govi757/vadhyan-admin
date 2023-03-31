import { Box, Card } from "@mui/material";
import React, { createElement } from "react";
import ModelComponent from "../../../components/generic/ModelComponent";
import { AdminData } from "../../../data";
import { LoginGFormMDP } from "./LoginGFormMDP";
import { TestTableMDP } from "./testtable";


export class Login extends ModelComponent<any,any> {
    constructor(props: any) {
        super(props);
        this.state = {
            loginData: new AdminData.LoginData()
        }
    }

    //metaData

    getLoginGFormMetaData(): any {
        return new LoginGFormMDP({}).getMetaData();
    }

    getTestTableMetaData(): any {
        return new TestTableMDP({myRefName: ""}).getMetaData();
    }

    //metaData

    render() {
        const loginForm = (this.getLoginGFormMetaData())
        const testTableMetaData = this.getTestTableMetaData();
        return(
            <Box>
            <div  className="d-flex justify-content-center align-center">
                
            <Card className="col-6 p-4 mt-5">
            Login
                {createElement(
                    loginForm.component,
                    {...loginForm.props,
                    value: this.state.loginData,
                    onInput: (newValue: any) => 
                        this.setState({
                            loginForm:  newValue
                        })
                    })}

            </Card>
            </div>
            </Box>
        )
    }
}