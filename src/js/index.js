import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './containers/App'
import configureStore from './store/configureStore'
import { autobind } from 'core-decorators'

const store = configureStore()

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

/*
	ES7 CODE - for Testing
*/

// @decorators...

class MyClass {
  static state = {
		isLoading: false
	}

  @autobind
  onChange() {}

  @autobind
  handleSubmit() {}
}

// async/await...

const resources = [
	// "posts",    //	100 items
	// "comments", //	500 items
	// "albums",   //	100 items
	// "photos",   // 5000 items
	// "todos",    //	200 items
	"users"     //	10 items
];

async function getResource() {
	const resResponse = await fetch( `https://jsonplaceholder.typicode.com/${resources[0]}` );

	return resResponse.json();
}

( async () => {
	try {
		const resourceArr = await getResource();
		resourceArr.map( console.log );
	} catch( err ) {
		console.error( err );
	}
})();
