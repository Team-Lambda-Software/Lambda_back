import { getMetadataArgsStorage } from "typeorm"
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions"


export const ormConfig: PostgresConnectionOptions = {
    type: "postgres",
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: getMetadataArgsStorage().tables.map( ( table ) => table.target ),
    synchronize: true,
} 