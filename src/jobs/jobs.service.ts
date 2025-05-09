import { Injectable } from '@nestjs/common';

import { CreateJobDto, JobResData } from '@/jobs/dto';
import { JobsRepository } from '@/jobs/jobs.repository';
import { JobStatus } from '@/jobs/types';

@Injectable()
export class JobsService {
  constructor(private readonly jobsRepository: JobsRepository) {}

  async createJob(createJobDto: CreateJobDto): Promise<JobResData> {
    const { title, description, status = JobStatus.PENDING } = createJobDto;
    const createdJob = await this.jobsRepository.createJob(title, description, status);

    return { job: createdJob };
  }
}
