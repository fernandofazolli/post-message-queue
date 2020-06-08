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

	let disposable = vscode.commands.registerCommand('post-message-queue.postMessage', function () {
    let message = messageToSend();
		axios.post(
			'http://admin:admin@localhost:8161/api/message?destination=queue://'+ queueName(),
			message, 
			  config
		  ).then(() => {
			vscode.window.showInformationMessage('Activemq-Post [ ' + message+' ]');
		  })
		  .catch((error) => {
			console.error(error)
			vscode.window.showErrorMessage('Activemq-Post Error [' + error + ']');
		  })		
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

var queueName = () => {
	let fileName = vscode.window.activeTextEditor.document.fileName.split('/');
	return fileName[fileName.length-1];
}

var messageToSend = () => {
	return vscode.window.activeTextEditor.document.getText(vscode.window.activeTextEditor.selection);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
