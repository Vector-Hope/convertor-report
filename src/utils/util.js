import data from '../resource/reportData.json';
import suggestion from '../resource/suggestions.json';

/**
 * @description: 格式化路径为相对于项目根目录路径
 * @param {string} path
 * @param {string} rootPath
 * @return {string}
 */
function formatPath(path, rootPath = '') {
  let filePath = path.split('\\').join('/');
  if (rootPath && filePath.startsWith(rootPath)) {
    filePath = filePath.slice(rootPath.length);
  }
  return filePath;
}

/**
 * @description: 获得修改路径后的异常信息
 * @param {Object} oriErrMsg
 * @param {string} rootPath
 * @return {Object}
 */
function getMsgWithFormatPath(oriErrMsg, rootPath) {
  let filePath = formatPath(oriErrMsg.filePath, rootPath);
  const suggestionMsg = suggestion[oriErrMsg.msgType];
  const newErrMsg = {
    title: suggestionMsg ? suggestionMsg.msgTitle : '未定义',
    suggestion: suggestionMsg || {},
    msgType: oriErrMsg.msgType || 'undefined',
    msgDescribe: oriErrMsg.msgDescribe || '',
    filePath,
  };
  if (oriErrMsg.errCodeList) {
    newErrMsg.errCodeList = oriErrMsg.errCodeList.map((errCode) => {
      if (errCode.codeBeforeConvert) {
        errCode.codeBeforeConvert.filePath = formatPath(errCode.codeBeforeConvert.filePath, rootPath);
      }
      if (errCode.codeAfterConvert) {
        errCode.codeAfterConvert.filePath = formatPath(errCode.codeAfterConvert.filePath, rootPath);
      }
      return errCode;
    });
  }
  return newErrMsg;
}

/**
 * @description: 获得工程文件目录信息
 * @param {Object} tree
 * @param {string} pathKey
 * @return {Object}
 */
function getFilesMenu(tree, pathKey = '') {
  let pathTree = tree;
  let pathNames = Object.keys(pathTree);
  let label = pathNames[0];
  pathTree = pathTree[pathNames[0]];
  pathNames = Object.keys(pathTree);
  // 当该文件为最终的文件，而不是文件夹时，返回menu信息
  if (pathNames.length === 0) {
    const key = pathKey ? `${pathKey}/${label}` : label;
    return {
      [key]: {
        key: key,
        label: label,
        type: 'menuItem',
        isOpen: false,
        isSelect: false,
      },
    };
  }
  // 当该目录下只有一个文件，且这个文件是文件夹时，将pathName相连
  while (pathNames.length === 1 && Object.keys(pathTree[pathNames[0]]).length !== 0) {
    label = label + '/' + pathNames[0];
    pathTree = pathTree[pathNames[0]];
    pathNames = Object.keys(pathTree);
  }
  const key = pathKey ? `${pathKey}/${label}` : label;
  let children = {};
  pathNames.forEach((pathName) => {
    children = { ...children, ...getFilesMenu({ [pathName]: pathTree[pathName] }, key) };
  });
  return {
    [key]: {
      key: key,
      label: label,
      type: 'menuGroup',
      isOpen: false,
      isSelect: false,
      children: children,
    },
  };
}

/**
 * @description: 默认打开文件目录中第一个文件
 * @param {Object} filesMenu
 */
function defaultOpen(filesMenu) {
  if (!filesMenu) {
    return;
  }
  if (typeof filesMenu === 'object') {
    const pathKeys = Object.keys(filesMenu).sort();
    filesMenu[pathKeys[0]].isOpen = true;
    if (filesMenu[pathKeys[0]].children) {
      defaultOpen(filesMenu[pathKeys[0]].children);
    }
  }
}

/**
 * @description: 获得异常信息路径对应的菜单键值
 * @param {string} filePath
 * @param {Array<Object>} filesMenu
 * @return {Object}
 */
function getErrMessagePathKeys(filePath, filesMenu) {
  let pathKeys = [];
  let pathLabels = [];
  for (let menuIndex in filesMenu) {
    if (filePath === filesMenu[menuIndex].key) {
      return {
        pathKeys: [...pathKeys, filesMenu[menuIndex].key],
        pathLabels: [...pathLabels, filesMenu[menuIndex].label],
      };
    }
    const preKey = filesMenu[menuIndex].key + (filesMenu[menuIndex].type === 'menuGroup' ? '/' : '');
    if (filePath.startsWith(preKey)) {
      pathKeys.push(filesMenu[menuIndex].key);
      pathLabels.push(filesMenu[menuIndex].label);
      if (filesMenu[menuIndex].children) {
        const subPathKeys = getErrMessagePathKeys(filePath, filesMenu[menuIndex].children);
        pathKeys.push(...subPathKeys.pathKeys);
        pathLabels.push(...subPathKeys.pathLabels);
      } else {
        return {
          pathKeys,
          pathLabels,
        };
      }
    }
  }
  return {
    pathKeys,
    pathLabels,
  };
}

/**
 * @description: 解析异常信息列表获得新异常信息列表和工程文件目录
 * @param {Array} oriMsgList
 * @param {string} projectPath
 * @return {Object}
 */
function parseMsgList(oriMsgList, projectPath) {
  let rootPathArray = projectPath.split('/');
  rootPathArray.pop();
  rootPathArray.push('');
  let rootPath = rootPathArray.join('/');
  const filesTree = {};
  const msgListWithFormatPath = oriMsgList.map((errMsg) => {
    const newErrMsg = getMsgWithFormatPath(errMsg, rootPath);
    const pathArr = newErrMsg.filePath.split('/');
    let tree = filesTree;
    pathArr.forEach((path) => {
      if (!tree[path]) {
        tree[path] = {};
      }
      tree = tree[path];
    });
    return newErrMsg;
  });
  const filesMenu = getFilesMenu(filesTree);
  defaultOpen(filesMenu);
  const projectFilesMenu = {
    overView: {
      key: 'overView',
      label: '转换概览',
      isOpen: false,
      isSelect: true,
      type: 'menuItem',
    },
    projectDirectory: {
      key: 'projectDirectory',
      label: '工程目录',
      isOpen: true,
      isSelect: false,
      type: 'menuGroup',
      children: filesMenu,
    },
  };
  const newMsgList = msgListWithFormatPath.map((errMsg) => {
    const { pathKeys, pathLabels } = getErrMessagePathKeys(errMsg.filePath, filesMenu);
    const messageNum = errMsg.errCodeList ? errMsg.errCodeList.length : 1;
    return {
      ...errMsg,
      messageNum,
      pathKeys: ['projectDirectory', ...pathKeys],
      pathLabels: ['工程目录', ...pathLabels],
    };
  });
  return {
    filesMenu: projectFilesMenu,
    errMessage: newMsgList,
  };
}

/**
 * @description: 重置报告数据信息
 * @return {Object}
 */
export function getReportData() {
  // 定义重置报告数据结构
  let projectPath = data.projectPath ? formatPath(data.projectPath) : '';
  const { filesMenu, errMessage } = parseMsgList(data.errMsgList, projectPath);
  const reportData = {
    projectDetail: {
      projectName: data.projectName || '未定义',
      projectPath: projectPath || '未知',
      pagesNum: data.pagesNum || 0,
      filesNum: data.filesNum || 0,
    },
    filesMenu: filesMenu,
    errMessage: errMessage,
  };
  return reportData;
}
