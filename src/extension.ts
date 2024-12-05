import * as vscode from 'vscode';
import axios from 'axios';

export function activate(context: vscode.ExtensionContext) {
    console.log('AI Code Helper extension is now active!');

    let disposable = vscode.commands.registerCommand('aiCodeHelper.completeCode', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return vscode.window.showInformationMessage('No editor is open');
        }

        const currentText = editor.document.getText(editor.selection);

        try {
            const response = await axios.post(
                'https://api.openai.com/v1/completions', 
                {
                    model: 'gpt-3.5-turbo', // or another model version
                    prompt: `Complete the following code: ${currentText}`,
                    max_tokens: 100,
                },
                {
                    headers: {
                        'Authorization': 'Bearer your-openai-access-token',
                    },
                }
            );

            const aiCode = response.data.choices[0].text;
            editor.edit((editBuilder) => {
                editBuilder.replace(editor.selection, aiCode);
            });
        } catch (error: unknown) { // Explicitly typing the error as `unknown`
            if (error instanceof Error) {
                vscode.window.showErrorMessage(`Failed to fetch AI suggestion: ${error.message}`);
            } else {
                vscode.window.showErrorMessage('An unknown error occurred');
            }
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
