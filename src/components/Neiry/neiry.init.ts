import { number } from "zod";

export const initialNeiryState = [[0],[0],[0]] as [number[],number[],number[]]

// {
//     windowSizeMs:60000,
//     values:[({
//         alpha:0,
//         beta:0,
//         gamma:0
//     })]
// }
 export type NeiryState = typeof initialNeiryState;