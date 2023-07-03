import {
  TaskStatus,
  TaskStatusEnum,
} from "interfaces/tasks/task-status.interface";
import { BehaviorSubject } from "rxjs";
import { TaskBase } from "./tasks/TaskBase";
import { Signer } from "ethers";
import { AmountsStatus } from "./tasks/AmountStatus";
import { TokenAmount } from "interfaces/token-amount.interface";
import { metamaskSwitchChain } from "utils";

export class TaskManager {
  private status: BehaviorSubject<TaskStatus>;
  public predictedAmountStatus: AmountsStatus;
  public doneAmountStatus: AmountsStatus;
  public tasks: TaskBase<any>[];

  constructor(inputAssets: TokenAmount[]) {
    this.doneAmountStatus = new AmountsStatus(inputAssets);
    this.predictedAmountStatus = new AmountsStatus(inputAssets);
    this.status = new BehaviorSubject<TaskStatus>({
      currentId: 0,
      status: TaskStatusEnum.None,
    });
    this.tasks = [];
  }

  pushTasks(tasks: TaskBase<any>[]) {
    this.tasks.push(...tasks);
  }

  subscribeStatus(fun: (status: TaskStatus) => void) {
    this.status.subscribe(fun);
  }

  async run(signer: Signer) {
    const current = this.status.getValue();
    const thisTask = this.tasks[current.currentId];

    const currChainId = await signer.getChainId();
    if (currChainId !== thisTask.chainId) {
      const result = await metamaskSwitchChain(thisTask.chainId);
      if (!result.ok) return;
      signer = result.signer!;
    }

    const subscribtion = thisTask.subscribe(({ status }) => {
      this.status.next({
        currentId: current.currentId,
        status: status,
      });
    });
    await thisTask.run(this.doneAmountStatus, signer);
    subscribtion.unsubscribe();

    this.predictedAmountStatus = this.doneAmountStatus.clone();

    const nextId = current.currentId + 1;
    this.status.next({
      currentId: nextId,
      status: TaskStatusEnum.Predicting,
    });

    // predict next steps
    await this.predict();

    this.status.next({
      currentId: nextId,
      status: TaskStatusEnum.Pending,
    });
  }

  async predict() {
    const current = this.status.getValue();
    if (current.status !== TaskStatusEnum.None)
      this.status.next({
        currentId: current.currentId,
        status: TaskStatusEnum.Predicting,
      });

    const fromTaskId =
      Number(
        [TaskStatusEnum.Sent, TaskStatusEnum.Confirmed].includes(current.status)
      ) + current.currentId;
    for await (const task of this.tasks.slice(fromTaskId)) {
      task.beforePredict();
      this.predictedAmountStatus = await task.predict(
        this.predictedAmountStatus
      );
      task.afterPredict();
    }

    this.status.next({
      currentId: current.currentId,
      status: TaskStatusEnum.Pending,
    });
  }
}
