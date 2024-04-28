


export interface IMapper<D, P>
{

    fromDomainToPersistence ( domain: D ): Promise<P>

    fromPersistenceToDomain ( persistence: P ): Promise<D>
}