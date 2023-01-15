import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { DataSource } from 'typeorm';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      type: 'better-sqlite3',
      database: configService.get<string>('DB_PATH'),
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
