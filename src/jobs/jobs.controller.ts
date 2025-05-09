import { Body, Controller, Post } from '@nestjs/common';

import { CreateJobDto, JobResDto } from '@/jobs/dto';
import { JobsService } from '@/jobs/jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  async createJob(@Body() createJobDto: CreateJobDto): Promise<JobResDto> {
    const createdJob = await this.jobsService.createJob(createJobDto);

    return new JobResDto(true, '작업 생성 성공', createdJob, null);
  }
}
