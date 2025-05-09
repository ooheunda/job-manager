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
    this.jobsIndex = await this.getJobsLength();
  }

  async findAllJobs(page: number, limit: number): Promise<Job[]> {
    const jobs = await this.getJobs();

    return this.paginateJobs(jobs, page, limit);
  }

  async searchJobs(page: number, limit: number, search: string, status: JobStatus): Promise<Job[]> {
    const jobs = await this.getJobs();

    const filteredJobs = jobs.filter((job) => {
      if (status) {
        return job.title.includes(search) && job.status === status;
      }

      return job.title.includes(search);
    });

    return this.paginateJobs(filteredJobs, page, limit);
  }

  async findJobById(id: string): Promise<Job> | null {
    try {
      const jobIndex = await this.getJobIndexById(id);
      const job = jobIndex !== null ? await this.getJobByIndex(jobIndex) : null;

      return job;
    } catch (error) {
      throw error;
    }
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

  private async getJobsLength(): Promise<number> {
    try {
      const jobs = await this.getJobs();
      return jobs.length;
    } catch (error) {
      return 0;
    }
  }

  private async getJobs(): Promise<Job[]> {
    try {
      const jobs = await this.jobsDb.getData('/jobs');
      return jobs;
    } catch (error) {
      return [];
    }
  }

  private async getJobByIndex(index: number): Promise<Job> | null {
    try {
      const job = await this.jobsDb.getData(`/jobs[${index}]`);
      return job;
    } catch (error) {
      return null;
    }
  }

  private async getJobIndexById(id: string): Promise<number> | null {
    try {
      const jobIndex = await this.jobsIndexDb.getData(`/jobsIndex/${id}`);
      return jobIndex;
    } catch (error) {
      return null;
    }
  }

  private paginateJobs(jobs: Job[], page: number, limit: number): Job[] {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return jobs.slice(startIndex, endIndex);
  }
}
