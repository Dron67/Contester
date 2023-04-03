export interface User {
  login: string;
  lastName: string;
  firstName: string;
  secondName?: string;
  organization?: string;
  password: string;
  role?: boolean;
  imageSrc?: string;
  _id?: string;
}

export interface Setting {
  name: string;
  file: string;
  commander: string;
  _id?: string;
}

export interface Message {
  message: string;
}

export interface Competition {
  name: string;
  timeStart: string;
  timeEnd: string;
  _id?: string;
}

export interface Task {
  name: string;
  condition: string;
  competition: string;
  limitTime: number;
  limitMemory: number;
  checker: string;
  language: string;
  _id?: string;
}

export interface Test {
  input: string;
  pattern: string;
  task: string;
  _id?: string;
}

export interface Solve {
  task: string;
  user: string;
  language: string;
  result?: string;
  date?: string;
  time?: string;
  test?: string;
  error?: string;
  memory?: string;
  code: string;
  message?: string;
  taskName?: string;
  _id?: string;
}
export interface Table {
  userId: {
    taskId: {
      col_solve: number;
      isAccept: boolean;
      posl_time: string;
    };
    ball: number;
    fio: string;
    time: string;
  };
}
