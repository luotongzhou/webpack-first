const express = require('express')

const app = express()

app.get('/user', (req, res) => {
	res.json({ name: '罗同舟' })
})

app.listen(4000, () => {
  console.log('启动成功')
})
