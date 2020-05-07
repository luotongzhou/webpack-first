import '@/index.less'
import './css/index.css'
import '@/hello.js'

if (module && module.hot) {
	module.hot.accept()
}

if (DEV === 'dev') {
	console.log('dev')
} else {
	console.log('prod')
}
class Animal {
	constructor(name) {
		this.name = name
	}
	getName() {
		return this.name + 11
	}
}

fetch('/user')
	.then((res) => res.json())
	.then((data) => {
		console.log(data)
	})

fetch('/login/account', {
	method: 'POST',
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json'
	},
	body: JSON.stringify({
		username: 'admin',
		password: '8888881'
	})
})
	.then((response) => response.json())
	.then((data) => console.log(data))
	.catch((err) => console.log(err))

const dog = new Animal('dog')
console.log(dog.getName())
