import { IAppInfo, ILifeCycle } from './types';

import { setAppList, getAppList } from './appList/index';
import { setLifeCycle } from './lifeCycle/index';
import { hackRoute, reRoute } from './route/index';

export const registerMicroApps = (
  appList: IAppInfo[],
  lifeCycle?: ILifeCycle
) => {
  appList && setAppList(appList);
  lifeCycle && setLifeCycle(lifeCycle);
};

export const start = () => {
  const list = getAppList();
  if (!list.length) {
    throw new Error('请先注册应用');
  }

  hackRoute();
  reRoute(window.location.href);
};
