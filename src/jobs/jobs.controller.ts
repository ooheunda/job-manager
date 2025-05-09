import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { PageQueryDto } from '@/common/dto';
import { CreateJobDto, JobResDto, JobsResDto, SearchJobQueryDto } from '@/jobs/dto';
import { JobsService } from '@/jobs/jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  @ApiOperation({ summary: '작업 목록 조회 API' })
  @ApiOkResponse({ type: JobsResDto })
  async findAllJobs(@Query() pageQueryDto: PageQueryDto): Promise<JobsResDto> {
    const jobs = await this.jobsService.findAllJobs(pageQueryDto);

    return new JobsResDto(true, '작업 목록 조회 성공', jobs, null);
  }

  @Get('search')
  @ApiOperation({ summary: '작업 검색 API' })
  @ApiOkResponse({ type: JobsResDto })
  async searchJobs(@Query() searchJobQueryDto: SearchJobQueryDto): Promise<JobsResDto> {
    const jobs = await this.jobsService.searchJobs(searchJobQueryDto);

    return new JobsResDto(true, '작업 검색 성공', jobs, null);
  }

  @Get(':id')
  @ApiOperation({ summary: '작업 상세 조회 API' })
  @ApiOkResponse({ type: JobResDto })
  @ApiNotFoundResponse({ description: '작업을 찾을 수 없습니다.' })
  async findJobById(@Param('id') id: string): Promise<JobResDto> {
    const job = await this.jobsService.findJobById(id);

    return new JobResDto(true, '작업 조회 성공', job, null);
  }

  @Post()
  @ApiOperation({ summary: '작업 생성 API' })
  @ApiCreatedResponse({ type: JobResDto })
  async createJob(@Body() createJobDto: CreateJobDto): Promise<JobResDto> {
    const createdJob = await this.jobsService.createJob(createJobDto);

    return new JobResDto(true, '작업 생성 성공', createdJob, null);
  }
}
