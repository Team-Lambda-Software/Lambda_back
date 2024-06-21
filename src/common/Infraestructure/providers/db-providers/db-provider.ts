import { Provider } from "@nestjs/common"
import { connect } from "mongoose"
import { UserSchema } from "src/user/infraestructure/entities/odm-entities/odm-user.entity"
import { DataSource, getMetadataArgsStorage } from "typeorm"



export const ormDatabaseProvider: Provider =
{
  provide: 'DataSource',
  useFactory: async () =>
  {
    const dataSource = new DataSource( {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: getMetadataArgsStorage().tables.map( ( table ) => table.target ),
      //entities: ['dist/src/**/*.entity.js', 'dist/src/**/*.entity.enum.js'],
      //entities: [__dirname + '/**/*.entity{.ts,.js}'],
      // entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    } )

    try
    {
      if ( !dataSource.isInitialized )
      {
        await dataSource.initialize()
      }
    } catch ( error )
    {
      console.error( error?.message )
    }

    return dataSource
  },
}

export const odmDataBaseProviders: Provider =
{
  provide: 'MongoDataSource',
  useFactory: async () =>
  {
    try
    {
      
      const connection = await connect( process.env.MONGO_DB )
      //// console.log(mongoose.connection.readyState);

      return connection
    } catch ( error )
    {
      // console.log( `Error al conectar a MongoDB: ${ error.message }` )
      throw error
    }
  },
}