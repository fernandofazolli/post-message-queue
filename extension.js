const vscode = require('vscode');
const { default: axios } = require('axios');
const path = require('path');


var config = {
	headers: {
		'Content-Length': 0,
		'Content-Type': 'text/plain'
	}
};

function activate(context) {

	console.log('Congratulations, your extension "post-message-queue" is now active!');

	let disposable = vscode.commands.registerCommand('post-message-queue.postMessage', async function () {
		
		let message = messageToSend();

		for (let i = 0; i < message.length; i++) {
			await sendToQueue(message[i])
		}

		vscode.window.showInformationMessage('Activemq-Post [ ' + message.length + ' messages to ' + queueName() + ']');
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;


var sendToQueue = (item) => {
	return axios.post(
		'http://admin:admin@localhost:8161/api/message?destination=queue://' + queueName(),
		item,
		config
	).then(() => {
		//vscode.window.showInformationMessage('Activemq-Post [ ' + item + ' ]');
		return
	}).catch((error) => {
		console.error(error)
		vscode.window.showErrorMessage('Activemq-Post Error [' + error + ' when send '+ item +']');
		return
	})
}

var queueName = () => {
	let customQueueName = vscode.window.activeTextEditor.document.getText().match("<==.*==>");
	if(customQueueName) {
		return customQueueName[0].replace("<==","").replace("==>","").trim();
	} else {
		let fileName = vscode.window.activeTextEditor.document.fileName.split(path.sep);
		return fileName[fileName.length - 1];
	}	
}

var messageToSend = () => {
	return vscode.window.activeTextEditor.document.getText(vscode.window.activeTextEditor.selection).split("\n");
}

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
