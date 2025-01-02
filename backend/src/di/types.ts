const TYPES = {
    EventBus: Symbol.for('EventBus'),
    EventBusClient: Symbol.for('EventBusClient'),
    CacheClient: Symbol.for("CacheClient"),
    CacheRepository: Symbol.for("CacheRepository"),
    HttpServer: Symbol.for("HttpServer"),
    AccountRepository: Symbol.for("AccountRepository"),
    TransactionRepository: Symbol.for("TransactionRepository"),
    SqlClient: Symbol.for("SqlClient"),
    OrmRepository: Symbol.for("OrmRepository"),
    BaseRepository: Symbol.for("BaseRepository"),
    BaseMapper: Symbol.for("BaseMapper"),
    AccountMapper: Symbol.for("AccountMapper"),
    TransactionMapper: Symbol.for("TransactionMapper"),
    UpdateAccountStatusUseCase: Symbol.for("UpdateAccountStatusUseCase"),
    CreateTransactionUseCase: Symbol.for("CreateTransactionUseCase"),
    ProcessTransactionUseCase: Symbol.for("ProcessTransactionUseCase"),
    TransactionEventHandler: Symbol.for("TransactionEventHandler"),
    BaseController: Symbol.for("BaseController"),
    AccountController: Symbol.for("AccountController"),
};

export { TYPES };