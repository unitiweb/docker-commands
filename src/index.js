#! /usr/bin/env node

require('dotenv').config()

const Config = require('./utils/Config')
const Command = require('./utils/Command')

const cfg = new Config()
const cmd = new Command(cfg)

if (!cmd.hasErrors()) {
    cmd.execute()
}
