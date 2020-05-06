import './index.less'
import './css/index.css'

if(module && module.hot) {
	module.hot.accept()
}
class Animal {
	constructor(name) {
		this.name = name
	}
	getName() {
		return this.name + 11
	}
}

const dog = new Animal('dog')
console.log(dog.getName())
