import MDP from "../generic/MDP";


export default interface GColumnCellMDP extends MDP {
    onClick?: (item: any) => void;
}


