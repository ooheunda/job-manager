import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { PageQueryDto } from '@/common/dto';
import { CreateJobDto } from '@/jobs/dto';
import { JobsRepository } from '@/jobs/jobs.repository';
import { JobsService } from '@/jobs/jobs.service';
import { Job, JobStatus } from '@/jobs/types';

describe('JobsService', () => {
  let service: JobsService;
  let mockRepo: jest.Mocked<JobsRepository>;

  let mockJob: Job;
  let mockJobs: Job[];

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        { provide: JobsRepository, useValue: { createJob: jest.fn(), findAllJobs: jest.fn(), findJobById: jest.fn() } },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
    mockRepo = module.get<jest.Mocked<JobsRepository>>(JobsRepository);

    mockJob = {
      id: 'uuid-uuid-uuid-uuid',
      title: 'title',
      description: 'description',
      status: JobStatus.PENDING,
      createdAt: '2025-05-09T03:14:46.098Z',
      updatedAt: '2025-05-09T03:14:46.098Z',
    };
    mockJobs = [mockJob];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(mockRepo).toBeDefined();
  });

  describe('findAllJobs', () => {
    let mockPageQueryDto: PageQueryDto;

    beforeEach(() => {
      mockPageQueryDto = {
        page: 1,
        limit: 10,
      };
    });

    it('작업 목록을 성공적으로 조회한다', async () => {
      mockRepo.findAllJobs.mockResolvedValue(mockJobs);

      const result = await service.findAllJobs(mockPageQueryDto);

      expect(result).toHaveProperty('jobs');
      expect(result.jobs).toBeInstanceOf(Array);
      expect(mockRepo.findAllJobs).toHaveBeenCalledWith(mockPageQueryDto.page, mockPageQueryDto.limit);
    });

    it('page 쿼리 파라미터가 없으면 기본값으로 1을 사용한다', async () => {
      mockPageQueryDto.page = undefined;
      mockRepo.findAllJobs.mockResolvedValue(mockJobs);

      await service.findAllJobs(mockPageQueryDto);

      expect(mockRepo.findAllJobs).toHaveBeenCalledWith(1, mockPageQueryDto.limit);
    });

    it('limit 쿼리 파라미터가 없으면 기본값으로 10을 사용한다', async () => {
      mockPageQueryDto.limit = undefined;
      mockRepo.findAllJobs.mockResolvedValue(mockJobs);

      await service.findAllJobs(mockPageQueryDto);

      expect(mockRepo.findAllJobs).toHaveBeenCalledWith(mockPageQueryDto.page, 10);
    });
  });

  describe('findJobById', () => {
    let mockJobId: string;

    beforeEach(() => {
      mockJobId = 'uuid-uuid-uuid-uuid';
    });

    it('작업을 성공적으로 조회한다', async () => {
      mockRepo.findJobById.mockResolvedValue(mockJob);

      const result = await service.findJobById(mockJobId);

      expect(result).toHaveProperty('job');
      expect(mockRepo.findJobById).toHaveBeenCalledWith(mockJobId);
    });

    it('작업을 찾을 수 없으면 404 예외를 던진다', async () => {
      mockRepo.findJobById.mockResolvedValue(null);

      await expect(service.findJobById(mockJobId)).rejects.toThrow(NotFoundException);
    });
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
