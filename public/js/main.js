
///
/// This is the list of things that are available for interested participants to get
/// Typically a creator defines these and is expected to define these
///

let items = [
{
	cid:"futureofmicropaymentsconf",
	pid:"20200901_applause",
	value:"0.25",
	currency:"usd",
	name:"Applause",
	descr:"One unit of applause 👏🏾",
	icon:"👏🏾"
},
{
	cid:"futureofmicropaymentsconf",
	pid:"20200901_donation",
	value:"0.50",
	currency:"usd",
	name:"Donation",
	descr:"One breath of a child is a treasured gift 🧧",
	icon:"🧧"
},
{
	cid:"futureofmicropaymentsconf",
	pid:"20200901_bronze",
	value:"1.00",
    mask:1, // mask against other items in this category
    limit:1, // limit to one per person
    total:50,
    confirm:1, // require confirmation for this larger purchase
    currency:"usd",
    name:"Future Of Micropayments Bronze Membership Pass",
    descr:"Join the conference and meet people designing the future of money",
    art:"/art/money_cyber.jpg",
    icon:"🥉"
},
{
	cid:"futureofmicropaymentsconf",
	pid:"20200901_silver",
	value:"2.00",
    mask:1, // mask against other items in this category
    limit:1, // limit to one 
    total:50,
    confirm:1, // require confirmation for this larger purchase
    currency:"usd",
    name:"Future Of Micropayments Silver Membership Pass",
    descr:"Join the conference and get a full conference pdf summary after",
    art:"/art/money_costarica.jpg",
    icon:"🥈"
},

{
	cid:"futureofmicropaymentsconf",
	pid:"20200901_gold",
	value:"3.00",
    mask:1, // mask against other items in this category
    limit:1, // limit to one
    total:50,
    confirm:1, // require confirmation for this larger purchase
    currency:"usd",
    name:"Future Of Micropayments Gold Membership Pass",
    descr:"Join the conference, get all the above and matchmaking",
    art:"/art/money_singapore.jpg",
    icon:"🥇"
},

{
	cid:"futureofmicropaymentsconf",
	pid:"20200901_Unenennium",
	value:"5.00",
    mask:1, // mask against other items in this category
    limit:1, // limit to one 
    total:50,
    confirm:1, // require confirmation for this larger purchase
    currency:"usd",
    name:"Future Of Micropayments Unenennium Membership Pass",
    descr:"Join the conference, get all the above and a sponsorship badge next to your name",
    art:"/art/money_surinam.jpg",
    icon:"🏅"
},
]

///
/// basic bootstrap
///		- dynamically generate a storefront basically
///

async function main() {
	if(typeof WallabyItemCard === 'undefined') {
		console.error("Card not defined")
		return
	}
	let div = document.querySelector("#participation_options")
	for(let i = 0; i < items.length; i++) {
		let item = items[i]
		let enhanced = await WallabyAPI.query(item)
		if(!enhanced || enhanced.error) {
			console.error("sad")
			console.error(enhanced)
			continue
		}
		let card = new WallabyItemCard(enhanced)
		div.appendChild(card)
	}
}

window.addEventListener('DOMContentLoaded', main)

// test - this seems to work - i can call into the server from here
window.addEventListener('DOMContentLoaded', async () => {
	let results = await WallabyAPI.query()
	console.log("********** testing ordinary api hit ********")
	console.log(results)
})

