export interface KeyValueEnvFileInterface {
  [key: string]: string;
}

export interface ProjectEnvFileInterface {
  name: string;
  envs: KeyValueEnvFileInterface;
}

export interface EnvFileInterface {
  projects: ProjectEnvFileInterface[];
}
