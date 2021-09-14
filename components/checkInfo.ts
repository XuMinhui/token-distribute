import { TAR_NFT_ADDR, TAR_NFT_TOKEN_ID } from "../const"
import { fromWei, notify, NOTIFY_TYPE, prompt } from "../utils"
import { web3 } from "../web3"
import { NFT_1155_ABI } from "../web3/abi"
const { PRIVATE_KEY } = require('../config.json')
const nft_CT = new web3.eth.Contract(NFT_1155_ABI, TAR_NFT_ADDR)

export const checkBaseInfo: () => Promise<boolean | void> = async () => {
    // 开始检查基本信息
    const { defaultSender, chainId, balance } = await getBaseInfo()

    if (!defaultSender) return notify(`账户初始化失败`, NOTIFY_TYPE.error)
    if (!chainId) return notify(`网络初始化失败`, NOTIFY_TYPE.error)
    if (!chainId) return notify(`余额获取失败`, NOTIFY_TYPE.error)
    const { name, balance: nft_balance } = await get1155Balance(nft_CT, defaultSender, TAR_NFT_TOKEN_ID)

    notify(`账户初始化成功：${defaultSender}`, NOTIFY_TYPE.success)
    notify(`网络初始化成功: ChainId--${chainId}`, NOTIFY_TYPE.success)
    notify(`当前余额剩余: ${balance.toString()} ETH / BNB    ${name}余额：${nft_balance} 个`, NOTIFY_TYPE.tip)


    const pt = await prompt('请按 Y 继续执行')
    return pt === 'Y'
}


export const getBaseInfo: () => Promise<any> = async () => {
    const defaultSender = web3.eth.accounts.wallet.add(PRIVATE_KEY).address
    const chainId = await web3.eth.getChainId()
    const balance = fromWei(await web3.eth.getBalance(defaultSender))
    const nonce = await web3.eth.getTransactionCount(defaultSender)

    return {
        defaultSender, chainId, balance, nonce
    }
}

export const get1155Balance: (tar_CT: any, account: string, tokenId: string) => Promise<any> = async (tar_CT, account, tokenId) => {
    return {
        balance: await tar_CT.methods.balanceOf(account, tokenId).call(),
        name: `NFT_1155[${tokenId}]`
    }
}