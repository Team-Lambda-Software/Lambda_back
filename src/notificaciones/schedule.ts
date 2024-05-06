// app.module.ts o el módulo específico donde quieras usar cron jobs

import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from '../tasks/tasks.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    // otros módulos necesarios
  ],
  providers: [TasksService],
  // otros proveedores
})
export class AppModule {}
