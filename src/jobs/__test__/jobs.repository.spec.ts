import { Test, TestingModule } from '@nestjs/testing';

import { JobsRepository } from '@/jobs/jobs.repository';

describe('JobsRepository', () => {
  let repository: JobsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobsRepository],
    }).compile();

    repository = module.get<JobsRepository>(JobsRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
