export const sleep = async (time: number): Promise<NodeJS.Timeout> => {
    return await setTimeout(() => { }, time * 1000)
}