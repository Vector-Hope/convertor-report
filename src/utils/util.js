import data from '../resource/reportData.json';

const msgData = data.errMsgList;

// 定义重置报告数据结构
const reportData = {
  projectDetail: {
    projectName: data.projectName || '未定义',
    projectPath: data.projectPath || '未知',
    pagesNum: data.pagesNum || 0,
    filesNum: data.filesNum || 0,
  },
  filesMenu: {},
  errMessage: [],
};

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
 * @description: 分解错误信息路径，并添加到树状结构中
 * @param {Array<Object>} msgData
 * @return {Object}
 */
function getFilesTree(msgData) {
  const filesTree = {};
  msgData.forEach((errMessage) => {
    const pathArr = errMessage.filePath.split('/');
    let tree = filesTree;
    pathArr.forEach((path) => {
      if (!tree[path]) {
        tree[path] = {};
      }
      tree = tree[path];
    });
  });
  return filesTree;
}

/**
 * @description: 在返回的内容中加入错误信息
 * @param {Object} errMessage
 * @return {*}
 */
function addErrMessage(errMessages, projectFilesMenu) {
  errMessages.forEach((errMessage) => {
    const { pathKeys, pathLabels } = getErrMessagePathKeys(errMessage.filePath, projectFilesMenu);
    const messageNum = errMessage.errCodeList ? errMessage.errCodeList.length : 1;
    reportData.errMessage.push({
      ...errMessage,
      messageNum,
      pathKeys: ['projectDirectory', ...pathKeys],
      pathLabels: ['工程目录', ...pathLabels],
    });
  });
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
    if (filePath.startsWith(filesMenu[menuIndex].key)) {
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
 * @description: 重置报告数据信息
 * @return {Object}
 */
export function getReportData() {
  const errMsgList = data.errMsgList;
  const filesTree = getFilesTree(errMsgList);
  const projectFilesMenu = getFilesMenu(filesTree);
  defaultOpen(projectFilesMenu);
  reportData.filesMenu = {
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
      children: projectFilesMenu,
    },
  };
  addErrMessage(msgData, projectFilesMenu);
  return reportData;
}
