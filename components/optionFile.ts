const fs = require('fs')
const path = require('path')

export const readFile = async (file: string) => {
    const data = await fs.readFileSync(path.resolve(__dirname, file), 'utf-8')
    return data
}

export const writeFile = async (file: string, fileData: any, option?: {}) => {
    const data = await fs.writeFileSync(path.resolve(__dirname, file), fileData, option)
    return data
}

export const readWhiteList = async (): Promise<string[]> => {
    const data = await readFile('../whiteList.txt')
    return data.split(/[(\r\n)\r\n]+/)
}

export const readAndWriteStartAccout = async (replceAccount: string) => {
    const data = await readFile('../config.json')
    const parseData = JSON.parse(data)
    parseData.START_ACCOUNT = replceAccount
    // 写入当前账号
    writeFile('../config.json', JSON.stringify(parseData))
    return replceAccount
}

export enum SEND_STATUS {
    success = 'SUCCESS',
    error = 'ERROR'
}

export const writeDataListFile = async ({
    account, hash, status, time
}: {
    account: string,
    hash: string,
    status: SEND_STATUS,
    time: number
}) => {
    const str = `| ${status} | ${account} | ${hash} | ${time} |  

`
    writeFile('../distribute.txt', str, {
        flag: 'a'               // 追加写入文件，如果文件不存在则创建文件
    })
}
