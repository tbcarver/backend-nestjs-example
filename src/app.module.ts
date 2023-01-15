import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { DataSource } from 'typeorm';

@Module({
  imports: [ConfigModule.forRoot(),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: () => ({
      type: 'better-sqlite3',
      database: 'database/sqlite3/backend_nestjs_example.sqlite3',
      synchronize: true,
      logging: false,
      entities: ['dist/**/*.entity{.ts,.js}'],
      subscribers: [],
    }),
    dataSourceFactory: async (options) => {
      const dataSource = await new DataSource(options).initialize();
      return dataSource;
    },
  }),
    AuthModule,
    PostModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
