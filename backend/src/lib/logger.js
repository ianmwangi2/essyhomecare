export const log = {
  info: (message, meta = {}) => {
    const timestamp = new Date().toISOString()
    console.log(JSON.stringify({ level: 'info', timestamp, message, ...meta }))
  },
  error: (message, error) => {
    const timestamp = new Date().toISOString()
    console.error(JSON.stringify({ level: 'error', timestamp, message, error: error?.message || error || null }))
  }
}
