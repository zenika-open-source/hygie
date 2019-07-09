export interface KeyValueEnvFileInterface {
  [key: string]: string | boolean | number;
}

export interface ProjectEnvFileInterface {
  name: string;
  envs: KeyValueEnvFileInterface;
}

export interface EnvFileInterface {
  projects: ProjectEnvFileInterface[];
}
