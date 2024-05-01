import * as fs from 'fs'
import * as path from 'path'
import pino, { StreamEntry } from 'pino'
import dotenv from 'dotenv'
dotenv.config()

const logDirectory = process.env.LOG_DIRECTORY || 'logs'
const logPath = path.resolve(logDirectory)

if (!fs.existsSync(logPath)) {
  fs.mkdirSync(logPath)
}

const createWriteStream = (filename: string) => fs.createWriteStream(path.resolve(logPath, filename), { flags: 'a' })

const streams: StreamEntry[] = [
  {
    level: 'info',
    stream: process.stdout,
  },
  {
    level: 'debug',
    stream: createWriteStream('debug.log'),
  },
  {
    level: 'error',
    stream: createWriteStream('error.log'),
  },
  {
    level: 'warn',
    stream: createWriteStream('warn.log'),
  },
  {
    level: 'fatal',
    stream: createWriteStream('fatal.log'),
  },
]

const logger = pino(
  {
    level: process.env.LOG_LEVEL || 'debug',
  },
  pino.multistream(streams)
)

export default logger
