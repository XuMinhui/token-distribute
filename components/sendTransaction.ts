import { getBaseInfo } from './checkInfo'
import { EventEmitter } from 'events'
import { web3 } from '../web3'
import { calGas } from '../utils'

const { RPC: CURRENT_RPC, PRIVATE_KEY } = require('../config.json')


const gas = 200000
const maxFeePerGas = 5.2

interface ISendTxArgs {
    sender: string,
    tarContract: string,
    fromData: string,
    nonceId: number,
    chainId: number
}

export const signTransaction = async ({
    sender, tarContract, fromData, nonceId, chainId
}: ISendTxArgs, _options?: any): Promise<any> => {

    const common = chainId === 56 ? {
        customChain: {
            name: 'Binance Smart Chain',
            networkId: 56,
            chainId: 56
        }
    } : {
        customChain: {
            name: 'Rinkeby Chain',
            networkId: 4,
            chainId: 4
        }
    }

    const newTx = {
        from: sender,
        to: tarContract,
        gas: gas,
        maxFeePerGas: calGas(maxFeePerGas),
        data: fromData,
        nonce: nonceId,
        common
    }

    return await web3.eth.accounts.signTransaction(newTx, PRIVATE_KEY)
    // .then(signed => {
    //     web3.eth.sendSignedTransaction(signed.rawTransaction)
    // })

    // return web3.eth.sendSignedTransaction(signed.rawTransaction)
    // .on('transactionHash', (hash: any) => {

    // }).once('receipt', (res: any) => {

    // }).once('error', (err: any) => {

    // })
}