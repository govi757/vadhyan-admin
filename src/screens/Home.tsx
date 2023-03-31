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
import _ from "lodash";
import { NavLink } from "react-router-dom";

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
  metaDataCode?: string;
}

export class Home extends ModelComponent<any, IState> {
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
      importStatement: "",
    };
  }


  render() {
    return (
      <div>
        <NavLink
          preventScrollReset={false}
          to="/form"
          className={"mx-5"}
          style={{ textDecoration: "none" }}
        >
          Form
        </NavLink>

        <NavLink
          preventScrollReset={false}
          to="/table"
          className={({ isActive, isPending }) =>
            isPending ? "pending" : isActive ? "active" : "pending"
          }
          style={{ textDecoration: "none" }}
        >
          Table
        </NavLink>
      </div>
    );
  }
}
