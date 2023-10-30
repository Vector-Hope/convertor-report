import data from '../resource/reportData.json';

// function fileNode(name) {
// 	this.name = name;
// 	this.filesList = [];
// }

const reportData = {
	errMessageNum: data.length,
	errTypeCount: {},
	filesTree: {},
	errMessage: [],
};

let filesTree = {};
let menuKeyIndex = 0;

/**
 * 
 * @param {Object} tree 
 * @returns {Object}
 */
function getFilesMenu (tree) {
	let pathTree = tree;
	let pathNames = Object.keys(pathTree);
	let label = pathNames[0];
	pathTree = pathTree[pathNames[0]];
	pathNames = Object.keys(pathTree);

	if (pathNames.length === 0) {
		return {
			key: menuKeyIndex ++,
			label: label
		}
	}
	while (pathNames.length === 1 && Object.keys(pathTree[pathNames[0]]).length !== 0) {
		label = label +'/' + pathNames[0];
		pathTree = pathTree[pathNames[0]];
		pathNames = Object.keys(pathTree);
	}
	return {
		key: menuKeyIndex ++,
		label: label,
		children: pathNames.map((pathName) => {
			return getFilesMenu({[pathName]: pathTree[pathName]});
		})
	}
}

/**
 * 分解错误信息路径，并添加到树状结构中
 * @param {string} pathStr 
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
 * 对不同类型错误进行数量统计
 * @param {string} type 
 */
function addErrTypeCount (type) {
	if (reportData.errTypeCount[type]) {
		reportData.errTypeCount[type] += 1;
	} else {
		reportData.errTypeCount[type] = 1;
	}
}

/**
 * 在返回的内容中加入错误信息
 * @param {Object} errMessage 
 */
function addErrMessage (errMessage) {
	reportData.errMessage.push(errMessage);
}

export function getReportData() {
	data.forEach((errMessage, index) => {
		addFilePath(errMessage.filePath);
		addErrTypeCount(errMessage.type);
		addErrMessage(errMessage);
	})
	console.log(filesTree);
	reportData.filesTree = getFilesMenu(filesTree);
	console.log(reportData.filesTree);
	return reportData;
}




