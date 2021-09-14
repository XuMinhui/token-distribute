import { checkBaseInfo, get1155Balance, getBaseInfo } from "./components/checkInfo"
const { START_ACCOUNT } = require('./config.json')
import { notify, NOTIFY_TYPE, sleep } from "./utils"
import { web3 } from './web3'
import { NFT_1155_ABI } from "./web3/abi"
import { signTransaction } from './components/sendTransaction'
import { TAR_NFT_ADDR, TAR_NFT_TOKEN_ID } from "./const"
import { readAndWriteStartAccout, readWhiteList, SEND_STATUS, writeDataListFile } from "./components/optionFile"
import { emitter, eventListener } from './components/eventListener'

// 函数入口
(async () => {
    // 检查基本信息
    const checkStatus = await checkBaseInfo().catch(() => { notify('初始化错误，请检查', NOTIFY_TYPE.error) })

    // 读取分发文件列表

    const whiteList = await readWhiteList()
    const startAccount = await readAndWriteStartAccout(START_ACCOUNT)
    const index = whiteList.indexOf(startAccount)
    if (checkStatus) satrtSendDis(index)

    // 执行分发合约
    // TODO approve
    // 绑定订阅函数
    eventListener()
})()

export const satrtSendDis: (currentIndex?: number) => void = async (currentIndex = 0) => {
    const whiteList = await readWhiteList()
    if (!whiteList[currentIndex]) return notify(`列表空投发放完成---`, NOTIFY_TYPE.error)
    const currentAccount = await readAndWriteStartAccout(whiteList[currentIndex])
    notify(`当前正在给 ${currentAccount} 发放空投`)
    sendDisTranstion(currentAccount, currentIndex)
}

const sendDisTranstion = async (to: string, currentIndex: number) => {
    const { defaultSender, nonce, chainId } = await getBaseInfo()
    const nft_CT = new web3.eth.Contract(NFT_1155_ABI, TAR_NFT_ADDR)
    const { balance: nft_balance } = await get1155Balance(nft_CT, defaultSender, TAR_NFT_TOKEN_ID)
    notify(`当前剩余 NFT 余额：${nft_balance} 个`, NOTIFY_TYPE.tip)

    // 定义交易参数
    const _from = defaultSender
    const _to = to
    const _ids = TAR_NFT_TOKEN_ID
    const _amounts = 1
    const _data = '0x00'

    const txData = nft_CT.methods.safeTransferFrom(_from, _to, _ids, _amounts, _data).encodeABI()
    const signTx = await signTransaction({
        sender: defaultSender,
        tarContract: TAR_NFT_ADDR,
        fromData: txData,
        nonceId: nonce,
        chainId
    })

    let tempHash = null

    web3.eth.sendSignedTransaction(signTx.rawTransaction)
        .on('transactionHash', (hash: any) => {
            tempHash = hash
            notify(`Pendding Hash: ${hash}`, NOTIFY_TYPE.success)
        })
        .once('receipt', (receipt: any) => {
            notify(`本次交易执行成功：to - ${to}`, NOTIFY_TYPE.tip)
            writeDataListFile({
                account: _to,
                hash: tempHash,
                status: SEND_STATUS.success,
                time: new Date().getTime()
            })
            emitter.emit('continueDis', { currentIndex: currentIndex + 1 })
        }).once('error', (err: any) => {
            notify(`本次交易操作失败：to - ${to}`, NOTIFY_TYPE.error)
            writeDataListFile({
                account: _to,
                hash: tempHash,
                status: SEND_STATUS.error,
                time: new Date().getTime()
            })
            notify(`2 秒后将重新发起交易`, NOTIFY_TYPE.error)
            emitter.emit('continueDis', { currentIndex })
        })
}