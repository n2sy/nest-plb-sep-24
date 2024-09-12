import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';
import { FirstMiddleware } from './first/first.middleware';
import { SecondMiddleware } from './second/second.middleware';
import { MorganMiddleware } from '@nest-middlewares/morgan';
import { HelmetMiddleware } from '@nest-middlewares/helmet';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookModule } from './book/book.module';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    TaskModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 8889,
      username: 'root',
      password: 'root', // ''
      database: 'bibplb',
      autoLoadEntities: true,
      synchronize: true,
    }),
    BookModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //consumer.apply(FirstMiddleware).forRoutes('task/search*');

    // consumer.apply(FirstMiddleware).forRoutes(
    //   {
    //     path: 'task*',
    //     method: RequestMethod.GET,
    //   },
    //   {
    //     path: 'task*',
    //     method: RequestMethod.POST,
    //   },
    // );
    consumer.apply(SecondMiddleware).forRoutes('');
    consumer.apply(FirstMiddleware).forRoutes('');
    MorganMiddleware.configure('dev');
    consumer.apply(MorganMiddleware).forRoutes('');
    HelmetMiddleware.configure({});
    consumer.apply(HelmetMiddleware).forRoutes('task*');
  }
}
