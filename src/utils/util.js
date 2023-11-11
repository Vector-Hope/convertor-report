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
	filesTree: {},
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
function addErrMessage (errMessage) {
	reportData.errMessage.push(errMessage);
}

/**
 * @description: 重置报告数据信息
 * @return {Object}
 */
export function getReportData() {
	msgData.forEach((errMessage, index) => {
		addFilePath(errMessage.filePath);
		addErrMessage(errMessage);
	})
	reportData.filesTree = getFilesMenu(filesTree);
	console.log('!!!!!!!!!!!!!!!!tree: ', reportData);
	return reportData;
}




