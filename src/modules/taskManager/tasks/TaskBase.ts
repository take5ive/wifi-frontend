import { Signer } from "ethers";
import { CHAINID } from "interfaces/config-data.interface";
import { TaskStatusEnum } from "interfaces/tasks/task-status.interface";
import { AmountsStatus } from "./AmountStatus";
import { BehaviorSubject } from "rxjs";

interface TaskData {
  status: TaskStatusEnum;
}

export abstract class TaskBase<DataType extends TaskData> {
  chainId: CHAINID;
  name: string;
  sentAt: Date | null;
  confirmedAt: Date | null;
  error: string | null;

  private data: BehaviorSubject<DataType>;

  constructor(chainId: CHAINID, name: string, data: Omit<DataType, "status">) {
    this.chainId = chainId;
    this.name = name;
    this.sentAt = null;
    this.confirmedAt = null;
    this.error = null;
    this.data = new BehaviorSubject<DataType>({
      ...data,
      status: TaskStatusEnum.None,
    } as unknown as DataType);
  }

  beforeRun() {
    // Switch Chain은 TaskManager에서 한다.
    this.sentAt = new Date();
    this.changeStatus(TaskStatusEnum.Signed);
  }
  afterRun() {
    this.confirmedAt = new Date();
  }

  beforePredict() {
    const data = this.getData();
    if (data.status !== TaskStatusEnum.None) {
      this.changeStatus(TaskStatusEnum.Predicting);
    }
  }
  afterPredict() {
    this.data.next({
      ...this.data.getValue(),
      status: TaskStatusEnum.Pending,
    });
  }
  onError(error: any) {
    this.error = error;
  }

  getData() {
    return this.data.getValue();
  }

  changeStatus(newStatus: TaskStatusEnum) {
    const { status, ...currData } = this.data.getValue();
    this.data.next({
      ...currData,
      status: newStatus,
    } as DataType);
  }

  changeData(newData: Partial<Omit<DataType, "status">>) {
    const { status, ...currData } = this.data.getValue();
    this.data.next({
      status,
      ...currData,
      ...newData,
    } as DataType);
  }

  subscribe(callback: (data: DataType) => void) {
    return this.data.subscribe(callback);
  }

  abstract run(
    doneAmountStatus: AmountsStatus,
    signer: Signer
  ): Promise<AmountsStatus>;

  abstract predict(predictAmountStatus: AmountsStatus): Promise<AmountsStatus>;
  // : Promise<TaskResult>;
}
