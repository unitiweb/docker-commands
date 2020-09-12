const output = require('./output')
const shell = require('shelljs')

/**
 * Parse the commands and other values from the config
 */
class Command
{
    /**
     * Set class members using the given config
     *
     * @param config The Config class
     */
    constructor(config) {
        const cfg = config.get()
        this.commands = cfg.commands || []
        this.command = cfg.command || null
        this.args = cfg.args || []
        this.description = null
        this.exec = []
        this.errors = false
        this.parseCommands()
    }

    /**
     * Get the commands to be executed
     *
     * @returns array
     */
    execute() {

        output.headerLine(true, false)
        output.header('Executing Commands', false, false)

        if (this.description) {
            output.description(this.description)
        }
        output.headerLine(true, false, '-')

        output.commands(this.exec)
        output.headerLine(false, false, '-')

        for (let k in this.exec) {
            shell.exec(this.exec[k], {async: false});
        }

        output.spacer()
    }

    /**
     * Check if there are any errors
     *
     * @returns boolean
     */
    hasErrors() {
        return this.errors
    }

    /**
     * Parse the commands to set the commands to execute
     */
    parseCommands() {
        let cmd = this.commands[this.command];

        for (let k in this.args) {
            const v = this.args[k]
            if (cmd[v]) {
                cmd = cmd[v];
            } else {
                this.errors = true
                output.error(`The command "${v}" does not exist`)
                return;
            }
        }

        // If there are errors don't continue to process
        if (this.hasErrors()) return;

        if (cmd.default !== undefined) {
            cmd = cmd.default
        }

        if (this.getType(cmd) === 'string') {
            this.exec = [cmd]
        } else if (this.getType(cmd) === 'array') {
            this.exec = cmd
        } else if (this.getType(cmd.commands) === 'string') {
            this.description = cmd.description || null
            this.exec = [cmd.commands]
        } else if (this.getType(cmd.commands) === 'array') {
            this.description = cmd.description || null
            this.exec = cmd.commands
        } else {
            output.error('The command could not be found')
            this.errors = true
        }
    }

    /**
     *
     * @param variable The variable to test
     *
     * @returns string || array || object
     */
    getType(variable) {
        if (typeof variable === 'string') {
            return 'string'
        } else if (Array.isArray(variable)) {
            return 'array'
        } else if (typeof variable === 'object') {
            return 'object'
        }

        output.error('The type was unknown')
        this.error = true

        return undefined
    }
}

module.exports = Command
