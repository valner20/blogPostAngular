import { postFinal } from "./postModel"
import { likes } from "./likes"
export interface pagination <T>{
    current: number,
    total: number,
    total_count: number,
    next: string | null,
    previous: string | null,
    result:  T[]
}
