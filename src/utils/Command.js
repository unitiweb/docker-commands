const output = require('./output')
const shell = require('shelljs')
const path = require('path')
const { cleanLines } = require('./helpers')

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
        this.basePath = cfg.basePath
        this.commands = cfg.commands || []
        this.command = cfg.command || null
        this.args = cfg.args || []
        this.description = null
        this.path = ''
        this.exec = []
        this.errors = false
        this.parseCommands()
    }

    /**
     * Get the commands to be executed
     *
     * @returns array
     */
    async execute() {
        output.headerLine(true, false)
        output.header('Executing Commands', false, false)

        if (this.description && this.description.length > 0) {
            output.description(this.description)
        }

        output.headerLine(true, false, '-')
        output.commands(this.exec)
        output.headerLine(false, false, '-')

        for (let i = 0; i < this.exec.length; i++) {
            const cmd = this.exec[i]
            await this.executeCommand(cmd)
        }

        output.spacer()
    }

    async executeCommand(cmd) {
        // Set working directory
        let cdPath = this.basePath
        if (cmd.path && cmd.path !== '') {
            cdPath = path.join('/', cdPath, cmd.path)
        }

        // Execute commands
        output.spacer()
        for (let ii = 0; ii < cmd.commands.length; ii++) {
            let command = cmd.commands[ii].trim()

            // Only add the params if params is not empty
            // And, if this is the last command in the list of commands
            if (cmd.params.length > 0 && ii === (cmd.commands.length - 1)) {
                command = command + ' ' + cmd.params
            }

            await this.run(cdPath, command + ' ' + cmd.params)
        }
    }

    async run(path, command) {
        shell.cd(path).exec(cleanLines(command), {async: false});
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

        // Displays the stack-commander version
        if (this.command === '--version') {
            this.addToExec('', ['echo stack-commander v' + this.getVersion()], true)
            return;
        }

        let cmd = this.commands[this.command.trim()]
        let params = ''

        // Walk down to the end of the command path
        for (let k in this.args) {
            const v = this.args[k]
            if (cmd[v]) {
                cmd = cmd[v]
            } else {
                // Add command params and remove as current args[k]
                if (v.length > 0) {
                    params = params + v
                    delete this.args[k]
                }
            }
        }

        // If there are errors don't continue to process
        if (this.hasErrors()) return;

        // If the top level command object has default this use it's object instead
        if (cmd.default !== undefined) {
            cmd = cmd.default
        }

        // Reset exec to an empty array
        this.exec = []

        if (this.getType(cmd) === 'string') {
            /* Example:
                stack:
                  commands:
                    one: echo This is a command
             */
            this.addToExec('', [cmd], params)
        } else if (this.getType(cmd) === 'array') {
            /* Example:
                stack:
                  commands:
                    one:
                      - echo Command One
                      - echo Command Two
             */
            this.addToExec('', cmd, params)
        } else if (this.getType(cmd.commands) === 'string') {
            /* Example:
                stack:
                  commands:
                    one:
                      description: This is test three
                      commands: echo Command One
             */
            this.description = cmd.description || null
            this.addToExec(cmd.path || '', [cmd.commands], params)
        } else if (this.getType(cmd.commands) === 'object') {
            /* Example:
                stack:
                  commands:
                    one:
                      description: This is test three
                      commands:
                        0:
                          path: first_dir
                          commands: echo Command Zero
                        1:
                          path: first_dir/second_dir
                          commands:
                            - echo Command One A
                            - echo Command One B
             */
            this.description = cmd.description || null
            this.exec = this.execFromObject(cmd.commands, params)
        } else if (this.getType(cmd.commands) === 'array') {
            /* Example:
                stack:
                  commands:
                    one:
                      description: This is test three
                      path: some_dir/other_dir
                      commands:
                        - echo Command One A
                        - echo Command One B
             */
            this.description = cmd.description || null
            this.addToExec(cmd.path || '', cmd.commands, params)
        } else {
            output.error('The command could not be found')
            this.errors = true
        }
    }

    /**
     * Add a formatted object to the this.exec array
     *
     * @param path The path if any
     * @param commands An array of commands
     * @param params The command params if any
     */
    addToExec(path, commands, params) {
        this.exec.push({
            path: path,
            commands: commands,
            params: params
        })
    }

    /**
     * Format the list of commands if commands is of type 'object'
     *
     * @param commands The commands object/array to format
     * @param params The list of command params if any
     *
     * @returns array
     */
    execFromObject(commands, params) {
        const list = []

        for (let key in commands) {
            const path = commands[key].path
            let cmds = commands[key].commands
            if (this.getType(cmds) === 'string') {
                cmds = [cmds]
            }
            list.push({
                path,
                commands: cmds,
                params
            })
        }

        return list
    }

    /**
     * Get the type of the given variable
     *
     * @param variable The variable to test
     *
     * @returns string || undefined
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

    /**
     * Get the version for stack-commander
     *
     * @returns {string}
     */
    getVersion() {
        return shell.exec('npm view stack-commander version').stdout
    }
}

module.exports = Command
