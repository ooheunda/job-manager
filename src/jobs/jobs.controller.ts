import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

import { PageQueryDto } from '@/common/dto';
import { CreateJobDto, JobResDto, JobsResDto } from '@/jobs/dto';
import { JobsService } from '@/jobs/jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  async findAllJobs(@Query() pageQueryDto: PageQueryDto): Promise<JobsResDto> {
    const jobs = await this.jobsService.findAllJobs(pageQueryDto);

    return new JobsResDto(true, '작업 목록 조회 성공', jobs, null);
  }

  @Get(':id')
  async findJobById(@Param('id') id: string): Promise<JobResDto> {
    const job = await this.jobsService.findJobById(id);

    return new JobResDto(true, '작업 조회 성공', job, null);
  }

  @Post()
  async createJob(@Body() createJobDto: CreateJobDto): Promise<JobResDto> {
    const createdJob = await this.jobsService.createJob(createJobDto);

    return new JobResDto(true, '작업 생성 성공', createdJob, null);
  }
}
