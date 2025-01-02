const TYPES = {
    EventBus: Symbol.for('EventBus'),
    EventBusClient: Symbol.for('EventBusClient'),
    CacheClient: Symbol.for("CacheClient"),
    CacheRepository: Symbol.for("CacheRepository"),
    HttpServer: Symbol.for("HttpServer"),
    AccountRepository: Symbol.for("AccountRepository"),
    TransactionRepository: Symbol.for("TransactionRepository"),
    SqlClient: Symbol.for("SqlClient"),
};

export { TYPES };