// Execute listTabs when display.html is loaded
document.addEventListener("DOMContentLoaded", listTabs);

function getTabs() {
	// Return tabs.Tab object for tabs in the current window

	// ONLY ACTIVE WINDOW
	// return browser.tabs.query({ currentWindow: true });

	// EVERY WINDOW BUT THE ACTIVE WINDOW
	// return browser.tabs.query({ currentWindow: false });

	// ALL WINDOWS
	return browser.tabs.query({});
}

function redirectToTab(e, link, id) {
	e.preventDefault();
	getTabs().then(function (tabs) {
		for (let tab of tabs) {
			if (tab.url == link && tab.id == id) {
				// e.target.innerHTML = 'found'+tab.url+' '+tab.id+' '+tabLink;
				browser.tabs.update(tab.id, {
					active: true
				});
				browser.windows.update(tab.windowId, {
					focused: true
				});
			}
		}
	});
}

function dispQR(url) {
	let hide = document.querySelector('.switchTabs');
	let disp = document.querySelector('.qrCode');

	let body = document.querySelector('body');
	let deets = document.createElement('p');
	let back = document.createElement('button');

	// body.textContent = '';
	hide.style.display = 'none';
	disp.style.display = 'block';
	back.textContent = 'Display all the websites';

	let code = kjua(
		{
			render: 'canvas',
			text: url,
			size: 250,
		});

	// deets.setAttribute('style', 'white-space: pre;');

	// Use textContent instead
	// ---------------------------------------------------------
	deets.classList.add('text-center', 'text-muted', 'text-break');
	back.classList.add('text-center', 'alert', 'alert-danger', 'btn');

	back.setAttribute('style', 'margin: auto; display: block;');
	// body.setAttribute('style', 'height: auto;');

	deets.innerHTML = 'Please scan the QR Code with<br>your phone camera or<br>a QR code reader';
	// ---------------------------------------------------------

	back.onclick = function () {
		body.removeChild(code);
		body.removeChild(deets);
		body.removeChild(back);
		hide.style.display = 'block';
		disp.style.display = 'none';
	}

	body.appendChild(code);
	body.appendChild(deets);
	body.appendChild(back);
};

function listTabs() {
	getTabs().then(function (tabs) {
		let tabsList = document.getElementById('tabList');
		let currentTabs = document.createDocumentFragment();
		let tabCounter = 1;
		let winCounter = 1;
		let tab;

		// Clear the content of tabList to keep refreshing the data 
		// everytime you click on the extension
		tabsList.textContent = '';

		let window = Infinity;

		for (tab of tabs) {

			if (tab.windowId != window) {
				let newWindow = document.createElement('p');
				newWindow.textContent = 'Window ' + winCounter;

				newWindow.setAttribute('style', 'white-space: pre; margin: 7px auto 5px auto; height: auto; width: auto;');
				newWindow.classList.add('para', 'alert', 'alert-dark');

				currentTabs.appendChild(newWindow);

				// Updating and reseting variables
				tabCounter = 1;
				winCounter += 1;
				window = tab.windowId;
			}

			let ul = document.createElement('ul');
			let btn = document.createElement('a');
			let tabLink = document.createElement('a');
			let br = document.createElement('br');
			// let time = new Date(tab.lastAccessed).toLocaleString();
			// For button
			let img = document.createElement('img');
			let fig = document.createElement('figure');
			let figCaption = document.createElement('figcaption');

			tabLink.textContent = tabCounter + '. ' + (tab.title || tab.id);
			// tabLink.textContent += ' \r\n\tLast accessed: ' + time;
			figCaption.textContent = 'Display QR Code';

			// This is used to add linebreak in textContent.
			tabLink.setAttribute('style', 'white-space: pre;');
			tabLink.setAttribute('href', tab.url);
			tabLink.setAttribute('data-id', tab.id);
			img.setAttribute('src', 'QR.png');
			img.setAttribute('alt', 'QR Code Img');
			btn.setAttribute('role', 'button');
			btn.setAttribute('href', '#');
			btn.setAttribute('style', 'width: 100px;');
			// Displaying the QR Code by sending the link
			// btn.onclick = dispQR(tabLink.getAttribute('href'));

			btn.onclick = () => dispQR(tabLink.getAttribute('href'));
			tabLink.onclick = () => redirectToTab(event, tabLink.getAttribute('href'), tabLink.getAttribute('data-id'));

			if (tab.active) {
				tabLink.classList.add('active');
			}

			// list-group-item, list-group-item-action are used to display the anchor tags nicely
			// overflow-auto is used to handle text that's longer than the popup
			tabLink.classList.add('list-group-item', 'list-group-item-action', 'overflow-auto');
			btn.classList.add('list-group-item', 'list-group-item-action', 'overflow-auto', 'btn', 'btn-outline-dark', 'button');
			fig.classList.add('mx-auto', 'd-block');
			ul.classList.add('list-group', 'list-group-horizontal');

			fig.appendChild(img);
			fig.appendChild(figCaption);
			btn.appendChild(fig);
			ul.appendChild(tabLink);
			ul.appendChild(btn);
			currentTabs.appendChild(ul);
			// currentTabs.appendChild(br);

			tabCounter += 1;
		}
		tabsList.appendChild(currentTabs);
	});
}