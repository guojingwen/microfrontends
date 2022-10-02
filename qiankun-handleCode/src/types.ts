import { EAppStatus } from './enum';
export interface IAppInfo {
  name: string;
  entry: string;
  container: string;
  activeRule: string;
}
export type Lifecycle = (app: IAppInfo) => Promise<any>;

export interface ILifeCycle {
  beforeLoad?: Lifecycle | Lifecycle[];
  mounted?: Lifecycle | Lifecycle[];
  unmounted?: Lifecycle | Lifecycle[];
}

export interface IInternalAppInfo extends IAppInfo {
  status: EAppStatus;
  bootstrap?: Lifecycle;
  mount?: Lifecycle;
  unmount?: Lifecycle;
  proxy: any;
}

export type EventType = 'hashchange' | 'popstate';
