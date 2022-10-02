import { IAppInfo, IInternalAppInfo } from '../types';
import { EAppStatus } from '../enum';
let appList: IAppInfo[] = [];

export const setAppList = (list: IAppInfo[]): void => {
  appList = list;
  appList.map((app) => {
    (app as IInternalAppInfo).status = EAppStatus.NOT_LOADED;
  });
};

export const getAppList = () => {
  return appList;
};

// 存储全局应用信息
