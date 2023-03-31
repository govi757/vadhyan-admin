import MDP from "../../generic/MDP";
import { Rules } from "../rules";


export default interface FFieldMDP extends MDP {
  dataSelectorKey: string
  label: string;
  rules?: Rules[]
}


