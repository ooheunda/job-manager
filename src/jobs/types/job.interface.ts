export enum JobStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
}

export interface Job {
  id: string; // uuid
  title: string;
  description: string;
  status: JobStatus;
  createdAt: string; // ISO
}

export interface JobIndex {
  [key: string]: number; // uuid: index 형태로 매핑
}
