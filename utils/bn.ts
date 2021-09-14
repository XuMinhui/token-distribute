import BigNumber from "bignumber.js"

export const wrapperBn = (tar: number | string): BigNumber => {
    return new BigNumber(tar)
}

export const fromWei: (tar: BigNumber | string | number, decimals?: string | number, fixed?: number) => BigNumber = (tar, decimals = 18, fixed = 4) => {
    return new BigNumber(tar).div(new BigNumber(10).pow(decimals)).dp(fixed)
}

export const toWei: (tar: BigNumber | string | number, decimals?: string | number) => BigNumber = (tar, decimals = 18) => {
    return new BigNumber(tar).times(new BigNumber(10).pow(decimals))
}

export const calGas: (tar: BigNumber | string | number) => string = (tar) => {
    return toWei(tar, 9).dp(0).toString()
}