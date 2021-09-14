const chalk = require('chalk')
const inquirer = require('inquirer')

export enum NOTIFY_TYPE {
    default = 'default',
    success = 'success',
    warning = 'warning',
    tip = 'tip',
    error = 'error'
}

export const notify: (msg: any, type?: NOTIFY_TYPE) => void = (msg, type = NOTIFY_TYPE.default) => {
    if (typeof (msg === 'object')) msg = JSON.stringify(msg)
    switch (type) {
        case NOTIFY_TYPE.success:
            console.log(chalk.green(msg))
            break;
        case NOTIFY_TYPE.warning:
            console.log(chalk.yellow(msg))
            break;
        case NOTIFY_TYPE.error:
            console.log(chalk.red(msg))
            break;
        case NOTIFY_TYPE.tip:
            console.log(chalk.blue(msg))
            break;
        default:
            console.log(msg)
            break;
    }
}

export const prompt = async (message: string): Promise<string> => {
    const questions = [
        {
            type: 'input',
            name: 'key',
            message: message
        }
    ]
    return inquirer.prompt(questions).then(_answers => {
        return _answers['key']
    })
}