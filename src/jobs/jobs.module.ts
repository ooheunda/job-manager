import { Module } from '@nestjs/common';

import { JobsController } from '@/jobs/jobs.controller';
import { JobsRepository } from '@/jobs/jobs.repository';
import { JobsService } from '@/jobs/jobs.service';

@Module({
  controllers: [JobsController],
  providers: [JobsService, JobsRepository],
})
export class JobsModule {}
