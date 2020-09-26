const yaml = require('js-yaml')
const fs = require('fs')
const output = require('./output')

class Config {
    /**
     * Set class members and parse the config file
     *
     * @param path The base path for the config file
     * @param file The name of the config file (defaults to stack.yml)
     */
    constructor(path, file) {
        this.path = path || process.cwd()
        this.file = file || 'stack.yml'
        this.config = []
        this.errors = false
        this.loadConfig()
    }

    /**
     * Get the configuration object
     *
     * @returns object
     */
    get() {
        return this.config
    }

    /**
     * Load the configuration from the config file
     */
    loadConfig() {
        const args = this.processArgs()
        const cfg = this.loadFile()

        // Default configuration
        this.config = {
            basePath: this.path,
            command: args.command,
            args: args.values,
            commands: cfg.stack.commands
        }
    }

    /**
     * Load the config yaml file and return
     *
     * @returns object
     */
    loadFile() {
        const configPath = this.path + '/' + this.file

        try {
            if (fs.existsSync(configPath)) {
                return yaml.safeLoad(fs.readFileSync(configPath, 'utf8'))
            }else {
                output.error('The config file (' + configPath + ') does not exist')
                this.errors = true
            }
        } catch(err) {
            output.error(err.message)
            this.errors = true
        }
    }

    /**
     * Get and parse the command line arguments
     *
     * @returns {values: [], command: string}
     */
    processArgs() {
        const args = process.argv

        // Remove the first two args. They are not needed or wanted
        if (args.length >= 3) {
            args.shift()
            args.shift()
        }

        // Re-Format the args
        const cfg = {
            command: args[0].toLowerCase(),
            values: []
        }

        // Remove the command from the args
        args.shift()

        if (Array.isArray(args)) {
            if (args.length >= 1) {
                args.forEach(arg => cfg.values.push(arg))
            }
        }

        return cfg
    }
}

module.exports = Config
