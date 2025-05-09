import { BaseResDto } from '@/common/dto';
import { Job } from '@/jobs/types';

export interface JobResData {
  job: Job;
}

export interface JobsResData {
  jobs: Job[];
}

export class JobResDto extends BaseResDto<JobResData> {}

export class JobsResDto extends BaseResDto<JobsResData> {}
