import { IMapper } from "../../../../domain/interfaces/mapper.interface";

export abstract class BaseMapper<TDomain, TORM> implements IMapper<TDomain, TORM> {
    abstract toDomain(orm: TORM): TDomain;
    abstract toPersistence(domain: TDomain): TORM;
}