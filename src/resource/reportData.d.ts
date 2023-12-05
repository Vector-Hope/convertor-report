type reportData = {
  "projectName": string,          // 工程名称
  "projectPath": string,          // 工程路径
  "pagesNum": number,             // 页面数
  "filesNum": number,              // 文件数
  "errMsgList": Array<ErrMsgs>    // 异常信息列表
}

type ErrMsgs = {
  "title": string,                  // 异常信息名称
  "filePath": string,               // 异常路径
  "msgType": string,                // 异常类型 ===> 在修改意见当中需要根据异常类型索引到对应的修改意见
  "msgDescribe"?: string,               // 异常描述
  "errCodeList"?: Array<ErrCodeMsg>, // 异常代码信息列表
}

type ErrCodeMsg = {
  "describe"?: string,
  "codeBeforeConvert": {
    "filePath": string,     // 异常文件路径
    "code": string,         // 异常代码
    "location": Locations    // 异常代码位置
  },                        // 转换之前的异常代码信息
  "codeAfterConvert"?: {
    "filePath": string,     // 异常文件路径
    "code": string,         // 异常代码
    "location"?: Locations    // 异常代码位置
  },                        // 转换之后的异常代码信息
}

type Locations = {
  "start": {         // 开始位置
    "col": number,   // 行
    "row": number    // 列
  },
  "end"?: {           // 结束位置
    "col": number,   // 行
    "row": number    // 列
  }
}