import { Result } from 'src/common/Application/result-handler/Result'
import { Categorie } from '../categories'

export interface ICategoriRepository {
    findCategorieById( id: Categorie): Promise<Result<Categorie>>;
}