import { useCallback, useEffect, useState } from "react";
import { cn } from "utils";
import { getTaskBlock } from "./blocks";
import { TaskBase } from "modules/taskManager/tasks/TaskBase";
import { RxDotFilled } from "react-icons/rx";
import { TaskStatusEnum } from "interfaces/tasks/task-status.interface";

interface TaskData {
  status: TaskStatusEnum;
  [key: string]: any;
}

interface TaskBlockProps {
  task: TaskBase<TaskData>;
  isCurrent: boolean;
  tasksLength: number;
  taskIndex: number;
}
export const TaskBlock = ({
  task,
  isCurrent,
  tasksLength,
  taskIndex,
}: TaskBlockProps) => {
  const Block = useCallback(getTaskBlock(task.name), [task.name]);
  const [data, setData] = useState<TaskData>({ status: TaskStatusEnum.None });
  useEffect(() => {
    task.subscribe(setData);
  }, []);

  return data.status !== TaskStatusEnum.None ? (
    <div className="flex items-center">
      <div className="pl-1 pr-4 w-8 flex flex-col items-center">
        <div
          className={cn(
            "border-l h-[24px]",
            taskIndex > 0 ? "border-neutral-200" : "border-transparent"
          )}
        />
        <RxDotFilled
          size={28}
          className={cn(
            "-m-[5px]",
            [TaskStatusEnum.Pending, TaskStatusEnum.Predicting].includes(
              data.status
            )
              ? isCurrent
                ? "text-primary-300"
                : "text-neutral-300"
              : [TaskStatusEnum.Signed, TaskStatusEnum.Sent].includes(
                  data.status
                )
              ? "text-primary-600 animate-pulse"
              : data.status === TaskStatusEnum.Confirmed
              ? "text-green-600"
              : "text-red-500"
          )}
        />
        <div
          className={cn(
            "border-l h-[24px]",
            taskIndex < tasksLength - 1
              ? "border-neutral-200"
              : "border-transparent"
          )}
        />
      </div>
      <div className="flex-1">
        <Block {...(data as any)} />
      </div>
    </div>
  ) : null;
};
