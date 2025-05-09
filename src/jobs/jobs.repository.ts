import { Injectable } from '@nestjs/common';
import { Config, JsonDB } from 'node-json-db';

import { JobStatus } from '@/jobs/types';
import { Job } from '@/jobs/types';
@Injectable()
export class JobsRepository {
  private readonly jobsDb: JsonDB;
  private readonly jobsIndexDb: JsonDB;
  private jobsIndex: number;

  constructor() {
    this.jobsDb = new JsonDB(new Config('data/jobs.json', true, true));
    this.jobsIndexDb = new JsonDB(new Config('data/jobs-index.json', true, true));
  }

  async onModuleInit(): Promise<void> {
    this.jobsIndex = await this.getJobsIndex();
  }

  async createJob(title: string, description: string, status: JobStatus): Promise<Job> {
    const newJob: Job = {
      id: crypto.randomUUID(),
      title,
      description,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await Promise.all([
      this.jobsDb.push('/jobs[]', newJob),
      this.jobsIndexDb.push(`/jobsIndex/${newJob.id}`, this.jobsIndex),
    ]).catch((error) => {
      throw error;
    });

    this.jobsIndex++;

    return newJob;
  }

  private async getJobsIndex(): Promise<number> {
    try {
      const jobs = await this.jobsDb.getData('/jobs');
      return jobs.length - 1;
    } catch (error) {
      return 0;
    }
  }
}
