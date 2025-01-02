export interface IMapper<TDomain, TORM> {
    toDomain(orm: TORM): TDomain;
    toPersistence(domain: TDomain): TORM;
}