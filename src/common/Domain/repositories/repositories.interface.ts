import { Entity } from "../domain-object/entity.interface"



export interface IRepository<V, A extends Entity<V>>{

    findOneById (id: V): Promise<A>

}