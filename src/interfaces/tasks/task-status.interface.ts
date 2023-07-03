export enum TaskStatusEnum {
  None = 0,
  Pending = 1,
  Signed = 2,
  Sent = 3,
  Confirmed = 4,
  Predicting = 8,
  Error = 9,
}

export interface TaskStatus {
  currentId: number;
  status: TaskStatusEnum;
}
