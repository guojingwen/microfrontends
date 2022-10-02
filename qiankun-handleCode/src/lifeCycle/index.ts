import { ILifeCycle, IInternalAppInfo, IAppInfo } from '../types';
import { EAppStatus } from '../enum';
let lifeCycle: ILifeCycle = {};

export const setLifeCycle = (lifeCycles: ILifeCycle): void => {
  lifeCycle = lifeCycles;
};

export const getLifeCycle = () => {
  return lifeCycle;
};

// 存储全局生命周期
// 卸载
export const runUnMounted = async (app: IInternalAppInfo) => {
  app.status = EAppStatus.UNMOUNTING;
  await app.unmount?.(app);
  app.status = EAppStatus.NOT_MOUNTED;
  await runLifeCycle('unmounted', app);
};

// 初始化 只执行一次
export const runBootstrap = async (app: IInternalAppInfo) => {
  if (app.status !== EAppStatus.LOADED) {
    return app;
  }
  app.status = EAppStatus.BOOTSTRAPING;
  await app.bootstrap?.(app);
  app.status = EAppStatus.NOT_MOUNTED;
};
// 挂载 可多次执行
export const runMounted = async (app: IInternalAppInfo) => {
  app.status = EAppStatus.MOUNTING;
  await app.mount?.(app);
  app.status = EAppStatus.MOUNTED;
  // 处理对应子应用生命周期
  await runLifeCycle('mounted', app);
};

// 加载前
export const runBeforeLoad = async (app: IInternalAppInfo) => {
  app.status = EAppStatus.LOADING;
  await runLifeCycle('beforeLoad', app);

  // 加载子应用资源
  // app = await loadHTML(app)
  app.status = EAppStatus.LOADED;
};

const runLifeCycle = async (name: keyof ILifeCycle, app: IAppInfo) => {
  // lifeCycles - LifeCycles - 可选，全局的微应用生命周期钩子
  const fn = lifeCycle[name];
  if (fn instanceof Array) {
    await Promise.all(fn.map((item) => item(app)));
  } else {
    await fn?.(app);
  }
};
