
///
/// javascript client library that third parties can use
/// the intent here is to have no dependencies on firebase or ripple or anything else - just a simplest possible api 
///

class WallabyAPIClass {

	constructor() {
		// prime the pump by getting back a session and user if any before any purchases occur
		this.query({event:"session"}).then(data=>{
			this.protypical_product=data
			console.log(data)
		})
	}

	async query(data={}) {
		if(!window.localStorage) {
			console.error("Sorry you cannot use this service")
			return
		}

if(data.event=="action") {
	if(!this.user) {
		if(this.session)
			document.location = "https://webwallaby.web.app/signup?session="+this.session.id
		else 
			alert("bad")
		return
	}
}


		try {
			data.session = {sid:window.localStorage.getItem("_wallaby_cached_sid") || 0 }
			const response = await fetch("https://webwallaby.web.app/api", {
				method: 'POST',
				mode: 'cors',
				cache: 'no-cache',
				credentials: 'same-origin',
				headers: {
					// 
					// 
//Access-Control-Request-Method: POST
//Access-Control-Request-Headers: X-PINGOTHER, Content-Type
					// 
					'Content-Type': 'application/json'
				},
				redirect: 'error',
				referrerPolicy: 'no-referrer',
				body: JSON.stringify(data)
			})
			let json = await response.json()
			data = Object.assign(data,json)
			window.localStorage.setItem("_wallaby_cached_sid",data.session.sid)
			this.session = data.session
			this.user = data.session.user
			console.log(data)
			return data
		} catch(err) {
			console.error(err)
			return {error:err}
		}
	}

	async widget(data) {
		data = await this.query(data)
		return new WallabyWidget(data)
	}
}

let WallabyAPI = new WallabyAPIClass()


///
/// This is a typical representation of something that one can get
/// It may be harder for a creator to define this - and the service can offer widgets here perhaps
/// But anybody who is serious about showing content will have their own version of this
///

class WallabyItemCard extends HTMLElement {

	constructor(data) {
		super()
		WallabyAPI.query(data).then(this.paint.bind(this))
	}

	async paint(data) {
		if(!data) {
			console.error("no data")
			return
		}

		this.innerHTML=
		`<div id="${data.id}" style="border:3px solid green;width:400x;padding:4px; margin:4px">
		<h2>${data.name}<h2>
		<p>${data.descr}</p>
		<br/>
		<img ${data.art?"visible":"hidden"} src="${data.art}" style="width:400px"></img>
		<br>
		</div>

		<div>
		</div>
		`

		// attach by hand due to wanting to pass a param

		this.children[0].appendChild(new WallabyWidget(data))

	}
}

customElements.define('wallaby-item-card', WallabyItemCard )


///
/// a helpful button to show buy now or view
///

class WallabyWidget extends HTMLElement {

	constructor(_data=false) {
		super()
		this.data=_data
	}

	connectedCallback() {
		if(!this.data) this.data = this.getAttribute("data")
		if(!this.data) return
		let data = this.data
		this.innerHTML=""
		let button = this.button = this.appendChild(document.createElement("button"))

		button.className="wallabybutton"

		var style = document.createElement('style')
		style.appendChild( document.createTextNode('.wallabybutton:hover{ background-color:#18304d }') )
		document.querySelector("head").appendChild(style)

		button.style = `box-shadow: 12px 10px 11px 0px #9fb4f2;
						background-color:#5b94f7;
						border-radius:28px;
						border:1px solid #4e6096;
						display:inline-block;
						cursor:pointer;
						color:#ffffff;
						font-family:Arial;
						font-size:17px;
						padding:16px 31px;
						text-decoration:none;
						text-shadow:0px 1px 0px #283966;
						`

		let msg = `$${data.value}, 0 of ${data.limit?parseInt(data.limit):"∞"} given ${!data.purchased?"GET":"VIEW"}`

console.log(data)
console.log(data.value)
console.log(data.limit)

		button.innerHTML = msg

		button.onclick = async ()=>{
			if(!this.data.purchased) {
				console.log("Button hit. Appears to not be owned.")
				this.data.event="action"
				let results = await WallabyAPI.query(this.data)
				console.log("Later this should go to purchase on success - for now just repaint button")
				// if results.purchased do something
				this.connectedCallback()
			} else {
				console.log("Button hit. Appears to already be owned. Attempt to goto purchase. Log views")
				this.data.event="view"
				let results = await WallabyAPI.query(this.data)
				// if results.purchased do something
				this.connectedCallback()
			}
		}
	}
}

customElements.define('wallaby-widget', WallabyWidget )




