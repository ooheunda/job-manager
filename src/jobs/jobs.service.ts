import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { PageQueryDto } from '@/common/dto';
import { CreateJobDto, JobResData, JobsResData, SearchJobQueryDto } from '@/jobs/dto';
import { JobsRepository } from '@/jobs/jobs.repository';
import { JobStatus } from '@/jobs/types';

@Injectable()
export class JobsService {
  constructor(private readonly jobsRepository: JobsRepository) {}

  async findAllJobs(pageQueryDto: PageQueryDto): Promise<JobsResData> {
    const { page = 1, limit = 10 } = pageQueryDto;
    const jobs = await this.jobsRepository.findAllJobs(page, limit);

    return { jobs };
  }

  async searchJobs(searchJobQueryDto: SearchJobQueryDto): Promise<JobsResData> {
    const { page = 1, limit = 10, search = '', status } = searchJobQueryDto;
    const jobs = await this.jobsRepository.searchJobs(page, limit, search, status);

    return { jobs };
  }

  async findJobById(id: string): Promise<JobResData> {
    const job = await this.jobsRepository.findJobById(id);

    if (!job) {
      throw new NotFoundException('작업을 찾을 수 없습니다.');
    }

    return { job };
  }

  async createJob(createJobDto: CreateJobDto): Promise<JobResData> {
    const { title, description, status = JobStatus.PENDING } = createJobDto;
    const createdJob = await this.jobsRepository.createJob(title, description, status);

    return { job: createdJob };
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async updatePendingJobs(): Promise<void> {
    await this.jobsRepository.updatePendingJobs();
  }
}
