// Production server for admin frontend on port 5174
const express = require('express')
const path = require('path')

const app = express()
const PORT = process.env.ADMIN_PORT || 5174
const distDir = path.join(__dirname, 'dist-admin')

app.use(express.static(distDir))
app.get('*', (req, res) => {
  res.sendFile(path.join(distDir, 'index.html'), (err) => {
    if (err) res.status(500).send('Admin app not found')
  })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Admin frontend running on http://localhost:${PORT}`)
})
