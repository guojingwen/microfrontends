import { IInternalAppInfo } from './types';
import { getAppList } from './appList/index';
import { match } from 'path-to-regexp'; // 进行复杂的路由匹配
import { EAppStatus } from './enum';
export const getAppListStatus = () => {
  // 根据注册传入的appList
  // 匹配当前路由
  // 返回对应状态

  //   需要渲染的应用列表
  const actives: IInternalAppInfo[] = [];
  //   需要卸载的应用列表
  const unmounts: IInternalAppInfo[] = [];
  //   需要注册的子应用列表
  const list = getAppList() as IInternalAppInfo[];
  //   路由匹配 返回状态
  list.forEach((app: IInternalAppInfo) => {
    //   match 返回一个用于将路径转化为参数的函数
    // end false 不匹配到字符串末尾
    const isActive = match(app.activeRule, { end: false })(location.pathname);
    switch (app.status) {
      case EAppStatus.NOT_LOADED:
      case EAppStatus.UNMOUNTED: {
        isActive && actives.push(app);
        break;
      }
      case EAppStatus.MOUNTED: {
        !isActive && unmounts.push(app);
        break;
      }
    }
  });

  return { actives, unmounts };
};

export function getCompletionBaseURL(url: string) {
  return url.startsWith('//') ? `${location.protocol}${url}` : url;
}

export function getCompletionURL(src: string | null, baseURI: string) {
  if (!src) return src;
  if (/^(https|http)/.test(src)) return src;

  return new URL(src, getCompletionBaseURL(baseURI)).toString();
}
