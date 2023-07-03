import {
  TaskStatus,
  TaskStatusEnum,
} from "interfaces/tasks/task-status.interface";
import { TaskManager } from "modules/taskManager";
import { useEffect, useState } from "react";
import { TaskBlock } from "./TaskBlock";

interface TaskBlockListViewProps {
  manager: TaskManager;
}
const TaskBlockListView = ({ manager }: TaskBlockListViewProps) => {
  const [status, setStatus] = useState<TaskStatus>({
    currentId: 0,
    status: TaskStatusEnum.None,
  });
  useEffect(() => {
    manager.subscribeStatus(setStatus);
  }, []);

  // console.log(status)

  return (
    <div className="border-t">
      {status.status !== TaskStatusEnum.None &&
        manager.tasks.map((task, index, arr) => {
          return (
            <TaskBlock
              key={index}
              task={task}
              taskIndex={index}
              tasksLength={arr.length}
              isCurrent={status.currentId === index}
            />
          );
        })}
      <hr className="-mt-[1.5px]" />
    </div>
  );
};

export default TaskBlockListView;
