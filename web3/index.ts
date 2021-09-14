const Web3 = require('web3')

const { RPC } = require('../config.json')

export const web3 = new Web3(RPC)