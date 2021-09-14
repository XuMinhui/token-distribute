import { EventEmitter } from 'events'
import { satrtSendDis } from '../app';
export const emitter = new EventEmitter();
import { notify, NOTIFY_TYPE } from "../utils"

export const eventListener = async () => {
    // 发放成功后触发
    emitter.on('continueDis', (args: {
        currentIndex: number
    }) => {
        notify(`休息 2 秒后，将继续分发`, NOTIFY_TYPE.tip)
        notify(`----------------------------------------------------------------------------`, NOTIFY_TYPE.error)

        setTimeout(() => {
            satrtSendDis(args.currentIndex)
        }, 2000)
    })
}