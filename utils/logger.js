import chalk from 'chalk';

export const errLogger = (err) => {
    console.log(chalk.red('!') + ` Execution failed. Reason: ${chalk.yellow(err.response.data.msg)}`)
}
