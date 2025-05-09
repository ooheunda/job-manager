import { Test, TestingModule } from '@nestjs/testing';

import { CreateJobDto } from '@/jobs/dto';
import { JobsRepository } from '@/jobs/jobs.repository';
import { JobsService } from '@/jobs/jobs.service';
import { JobStatus } from '@/jobs/types';

describe('JobsService', () => {
  let service: JobsService;
  let mockRepo: jest.Mocked<JobsRepository>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [JobsService, { provide: JobsRepository, useValue: { createJob: jest.fn() } }],
    }).compile();

    service = module.get<JobsService>(JobsService);
    mockRepo = module.get<jest.Mocked<JobsRepository>>(JobsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(mockRepo).toBeDefined();
  });

  describe('createJob', () => {
    let mockCreateJobDto: CreateJobDto;
    beforeEach(() => {
      mockCreateJobDto = {
        title: 'title',
        description: 'description',
        status: JobStatus.PENDING,
      };
    });

    it('작업을 성공적으로 생성한다', async () => {
      const result = await service.createJob(mockCreateJobDto);

      expect(result).toHaveProperty('job');
      expect(mockRepo.createJob).toHaveBeenCalledWith(
        mockCreateJobDto.title,
        mockCreateJobDto.description,
        JobStatus.PENDING,
      );
    });

    it('status가 없으면 기본값으로 PENDING을 사용한다', async () => {
      mockCreateJobDto.status = undefined;
      const result = await service.createJob(mockCreateJobDto);

      expect(result).toHaveProperty('job');
      expect(mockRepo.createJob).toHaveBeenCalledWith(
        mockCreateJobDto.title,
        mockCreateJobDto.description,
        JobStatus.PENDING,
      );
    });
  });
});
