// Function to get + decode API key
const getKey = () => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(["openai-key"], (result) => {
            if (result["openai-key"]) {
                const decodedKey = atob(result["openai-key"]);
                resolve(decodedKey);
            }
        });
    });
};

const generate = async (prompt) => {
    // Get the API key from storage
    const key = await getKey();
    const url = "https://api.openai.com/v1/completions";
  
    // Call completions endpoint
    const completionResponse = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });
  
    // Select the top choice and send back
    const completion = await completionResponse.json();
    const choices = completion.choices;
  
    if (choices && choices.length > 0) {
      return choices.pop();
    } else {
      throw new Error("No completion choices available.");
    }
  };

const generateCompletionAction = async (info) => {
    try {
        const {selectionText} = info;
        TODO: const basePromptPrefix = `
        
   

        `;
        const baseCompletion = await generate(`${basePromptPrefix}${selectionText}`);
        console.log(baseCompletion.text);
    } catch (error) {
        console.log(error);
    };
};

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "context-run",
        title: "Generate blog post",
        contexts: ["selection"],
    });
});

chrome.contextMenus.onClicked.addListener(generateCompletionAction);