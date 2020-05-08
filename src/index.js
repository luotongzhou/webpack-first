import '@/index.less'
import './css/index.css'
import '@/hello.js'
// import 'lodash'
// import moment from 'moment';
// import 'moment/locale/zh-cn'
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
		return this.name + 123
	}
}

fetch('/user')
	.then(res => res.json())
	.then(data => {
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
		password: '888888'
	})
})
	.then(response => response.json())
	.then(data => console.log(data))
	.catch(err => console.log(err))
// console.log(moment.now())
const dog = new Animal('dog')
console.log(dog.getName())

