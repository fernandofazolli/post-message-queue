const vscode = require('vscode');
const { default: axios } = require('axios');

var config = {
    headers: {
        'Content-Length': 0,
        'Content-Type': 'text/plain'
    }
};
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	
	console.log('Congratulations, your extension "post-message-queue" is now active!');

	let disposable = vscode.commands.registerCommand('post-message-queue.postMessage',async function() {
	let message = messageToSend();

	for (let i = 0; i < message.length; i++) {
		await sendToQueue(message[i])
	}
	  
	//   Promise.all(message.map(info => sendToQueue(info))).then(results => {
	// 	  console.log(results);
	//   }).catch(err => {
	// 	  console.log(err);
	//   });


	// message.forEach(async (item) => {	
	// 	console.log(item); 
	// 	await sendToQueue(item); 	
	// 	});	
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;


var  sendToQueue = (item) => {
	return axios.post(
		'http://admin:admin@localhost:8161/api/message?destination=queue://'+ queueName(),
		item, 
		  config
	  ).then(() => {			 
		vscode.window.showInformationMessage('Activemq-Post [ ' + item+' ]');
		return
	  })
	  .catch((error) => {
		console.error(error)
		vscode.window.showErrorMessage('Activemq-Post Error [' + error + ']');
		return
	  })
}

var queueName = () => {
	let fileName = vscode.window.activeTextEditor.document.fileName.split('/');
	return fileName[fileName.length-1];
}

var messageToSend = () => {
	return vscode.window.activeTextEditor.document.getText(vscode.window.activeTextEditor.selection).split("\n");
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
