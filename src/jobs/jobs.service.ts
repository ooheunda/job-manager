import { Injectable } from '@nestjs/common';

import { JobsRepository } from '@/jobs/jobs.repository';

@Injectable()
export class JobsService {
  constructor(private readonly jobsRepository: JobsRepository) {}
}
