import { Test, TestingModule } from '@nestjs/testing';

import { PageQueryDto } from '@/common/dto';
import { BusinessException } from '@/common/exceptions';
import { CreateJobDto, SearchJobQueryDto } from '@/jobs/dto';
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
        {
          provide: JobsRepository,
          useValue: {
            findAllJobs: jest.fn(),
            searchJobs: jest.fn(),
            findJobById: jest.fn(),
            createJob: jest.fn(),
            updatePendingJobs: jest.fn(),
          },
        },
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

  describe('searchJobs', () => {
    let mockSearchJobQueryDto: SearchJobQueryDto;

    beforeEach(() => {
      mockSearchJobQueryDto = {
        page: 1,
        limit: 10,
        search: 'title',
        status: JobStatus.PENDING,
      };
    });

    it('성공적으로 작업을 검색한다', async () => {
      mockRepo.searchJobs.mockResolvedValue(mockJobs);

      const result = await service.searchJobs(mockSearchJobQueryDto);

      expect(result).toHaveProperty('jobs');
      expect(result.jobs).toBeInstanceOf(Array);
      expect(mockRepo.searchJobs).toHaveBeenCalledWith(
        mockSearchJobQueryDto.page,
        mockSearchJobQueryDto.limit,
        mockSearchJobQueryDto.search,
        mockSearchJobQueryDto.status,
      );
    });

    it('page 쿼리 파라미터가 없으면 기본값으로 1을 사용한다', async () => {
      mockSearchJobQueryDto.page = undefined;
      mockRepo.searchJobs.mockResolvedValue(mockJobs);

      await service.searchJobs(mockSearchJobQueryDto);

      expect(mockRepo.searchJobs).toHaveBeenCalledWith(
        1,
        mockSearchJobQueryDto.limit,
        mockSearchJobQueryDto.search,
        mockSearchJobQueryDto.status,
      );
    });

    it('limit 쿼리 파라미터가 없으면 기본값으로 10을 사용한다', async () => {
      mockSearchJobQueryDto.limit = undefined;
      mockRepo.searchJobs.mockResolvedValue(mockJobs);

      await service.searchJobs(mockSearchJobQueryDto);

      expect(mockRepo.searchJobs).toHaveBeenCalledWith(
        mockSearchJobQueryDto.page,
        10,
        mockSearchJobQueryDto.search,
        mockSearchJobQueryDto.status,
      );
    });

    it('search 쿼리 파라미터가 없으면 모든 title을 검색한다', async () => {
      mockSearchJobQueryDto.search = undefined;
      mockRepo.searchJobs.mockResolvedValue(mockJobs);

      await service.searchJobs(mockSearchJobQueryDto);

      expect(mockRepo.searchJobs).toHaveBeenCalledWith(
        mockSearchJobQueryDto.page,
        mockSearchJobQueryDto.limit,
        '',
        mockSearchJobQueryDto.status,
      );
    });

    it('status 쿼리 파라미터가 없으면 모든 status를 검색한다', async () => {
      mockSearchJobQueryDto.status = undefined;
      mockRepo.searchJobs.mockResolvedValue(mockJobs);

      await service.searchJobs(mockSearchJobQueryDto);

      expect(mockRepo.searchJobs).toHaveBeenCalledWith(
        mockSearchJobQueryDto.page,
        mockSearchJobQueryDto.limit,
        mockSearchJobQueryDto.search,
        undefined, // 그대로 넘김
      );
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

      await expect(service.findJobById(mockJobId)).rejects.toThrow(BusinessException);
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

  describe('updatePendingJobs', () => {
    it('성공적으로 대기 중인 작업을 업데이트한다', async () => {
      await service.updatePendingJobs();

      expect(mockRepo.updatePendingJobs).toHaveBeenCalled();
    });
  });
});
