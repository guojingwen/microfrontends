// 劫持hash 和history相关事件
// 在劫持后处理子应用相关逻辑
import { EventType } from '../types';
import { getAppListStatus } from '../utils';
import {
  runBootstrap,
  runMounted,
  runUnMounted,
  runBeforeLoad,
} from '../lifeCycle/index';
const originPush = window.history.pushState;
const originReplace = window.history.replaceState;

// 存储原本路由相关事件逻辑
const capturedListener: Record<EventType, Function[]> = {
  // hashchange callback
  hashchange: [],
  //   popstate callback
  popstate: [],
};

let historyEvent: PopStateEvent | null = null;

let lastUrl: string | null = null;

export const reRoute = (url: string) => {
  // 主应用生命周期
  if (url !== lastUrl) {
    // 不是当前URL再执行生命周期
    // 根据当前应用生命周期状态 执行相应生命周期
    const { actives, unmounts } = getAppListStatus();
    Promise.all(
      unmounts
        .map(async (app) => {
          await runUnMounted(app);
        })
        .concat(
          actives.map(async (app) => {
            await runBeforeLoad(app);
            await runBootstrap(app);
            await runMounted(app);
          })
        )
    ).then(() => {
      callCapturedListeners();
    });
  }

  lastUrl = url || location.href;
};

const handleUrlChange = () => {
  reRoute(location.href);
};

const hasListeners = (name: EventType, fn: Function): boolean => {
  return !!capturedListener[name].filter((listener) => listener === fn).length;
};

// 手写事件代理
const hackEventListener = (func: Function): any => {
  return function (name: string, fn: Function) {
    if (name === 'hashchange' || name === 'popstate') {
      if (!hasListeners(name, fn)) {
        capturedListener[name].push(fn);
        return;
      } else {
        //   存在 remove
        capturedListener[name] = capturedListener[name].filter(
          (listener) => listener !== fn
        );
      }
    }

    // 执行其他原本事件逻辑
    return func.apply(window, arguments);
  };
};

export const hackRoute = () => {
  // 重写方法
  window.history.pushState = (...args) => {
    originPush.apply(window.history, args);

    historyEvent = new PopStateEvent('popstate'); // 课程中可以先不处理
    reRoute(args[2] as string);
  };

  window.history.replaceState = (...args) => {
    originReplace.apply(window.history, args);
    historyEvent = new PopStateEvent('popstate'); // 课程中可以先不处理
    reRoute(args[2] as string);
  };

  window.addEventListener('hashchange', () => handleUrlChange);
  window.addEventListener('popstate', () => handleUrlChange);

  // 不干扰原本事件相关处理逻辑 不影响子应用对应事件回调执行
  window.addEventListener = hackEventListener(window.addEventListener);
  window.removeEventListener = hackEventListener(window.removeEventListener);
};

export function callCapturedListeners() {
  if (historyEvent) {
    Object.keys(capturedListener).forEach((eventName) => {
      const listeners = capturedListener[eventName as EventType];
      if (listeners.length) {
        listeners.forEach((listener) => {
          // @ts-ignore
          listener.call(this, historyEvent);
        });
      }
    });
    historyEvent = null;
  }
}

export function cleanCapturedListeners() {
  capturedListener['hashchange'] = [];
  capturedListener['popstate'] = [];
}
