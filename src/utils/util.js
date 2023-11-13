import data from '../resource/reportData.json';

const msgData =  data.errMsgList;

// 定义重置报告数据结构
const reportData = {
	projectDetail: {
		projectName: data.projectName,
		projectPath: data.projectPath,
		pageNums: data.pageNums,
		fileNums: data.fileNums,
	},
	filesMenu: {},
	errMessage: [],
};

let filesTree = {};

/**
 * @description: 获得工程文件目录信息
 * @param {Object} tree
 * @param {string} pathKey
 * @return {Object}
 */
function getFilesMenu (tree, pathKey = '') {
	let pathTree = tree;
	let pathNames = Object.keys(pathTree);
	let label = pathNames[0];
	pathTree = pathTree[pathNames[0]];
	pathNames = Object.keys(pathTree);

	if (pathNames.length === 0) {
		return {
			key: pathKey ? `${pathKey}/${label}` : label,
			label: label
		}
	}
	while (pathNames.length === 1 && Object.keys(pathTree[pathNames[0]]).length !== 0) {
		label = label +'/' + pathNames[0];
		pathTree = pathTree[pathNames[0]];
		pathNames = Object.keys(pathTree);
	}
	return {
		key: pathKey ? `${pathKey}/${label}` : label,
		label: label,
		children: pathNames.map((pathName) => {
			return getFilesMenu({[pathName]: pathTree[pathName]}, pathKey ? `${pathKey}/${label}` : label);
		})
	}
}

/**
 * @description: 分解错误信息路径，并添加到树状结构中
 * @param {strng} pathStr
 * @return {*}
 */
function addFilePath(pathStr) {
	const pathArr = pathStr.split('/');
	let tree = filesTree;
	pathArr.forEach((path) => {
		if (!tree[path]) {
			tree[path] = {};
		}
		tree = tree[path];
	})
}

/**
 * @description: 在返回的内容中加入错误信息
 * @param {Object} errMessage
 * @return {*}
 */
function addErrMessage (errMessages) {
	errMessages.forEach((errMessage) => {
		const {pathKeys, pathLabels} = getErrMessagePathKeys(errMessage.filePath, reportData.filesMenu);
		reportData.errMessage.push({
			...errMessage,
			pathKeys,
			pathLabels,
		});
	})
}

/**
 * @description: 获得异常信息路径对应的菜单键值
 * @param {string} filePath
 * @param {Array} filesMenu
 * @return {Array}
 */
function getErrMessagePathKeys (filePath, filesMenu) {
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
					pathLabels
				};
			}
		}
	}
	return {
		pathKeys,
		pathLabels
	};
}

/**
 * @description: 重置报告数据信息
 * @return {Object}
 */
export function getReportData() {
	msgData.forEach((errMessage) => {
		addFilePath(errMessage.filePath);
	})
	reportData.filesMenu = [getFilesMenu(filesTree)];
	addErrMessage(msgData);
	console.log('!!!!!!!!!!!!!!!!tree: ', reportData);
	return reportData;
}




