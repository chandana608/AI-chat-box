const promptInput = document.querySelector("#prompt");
const chatContainer = document.querySelector(".chat-container");
const imageBtn = document.querySelector("#image");
const imageInput = document.querySelector("#image-input");
const submitBtn = document.querySelector("#submit");

const Api_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyC5P0KZPe0IFG6iFTViii-EK9IUzC3s8to";

const allowedTypes = ["image/jpeg", "image/png"];

let user = {
    message: "",
    file: {
        mime_type: null,
        data: null
    },
    url: ""
};

function isValidURL(str) {
    try {
        new URL(str);
        return true;
    } catch {
        return false;
    }
}

function formatResponseToHtml(text) {
    const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    let html = "", inList = false;

    lines.forEach(line => {
        if (/^\d+\.\s+/.test(line)) {
            if (inList) { html += "</ul>"; inList = false; }
            html += `<h3>${line}</h3>`;
        } else if (/^[-*•]\s+/.test(line)) {
            if (!inList) { html += "<ul>"; inList = true; }
            html += `<li>${line.replace(/^[-*•]\s+/, "")}</li>`;
        } else {
            if (inList) { html += "</ul>"; inList = false; }
            html += `<p>${line}</p>`;
        }
    });

    if (inList) html += "</ul>";
    return html;
}

function createChatBox(html, className) {
    const div = document.createElement("div");
    div.className = className;
    div.innerHTML = html;
    return div;
}

// --- Database Integration ---

async function saveMessage(sender, message, image = "") {
    await fetch("chat_api.php?action=save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender, message, image })
    });
}

async function loadMessages() {
    const res = await fetch("chat_api.php?action=load");
    const messages = await res.json();
    chatContainer.innerHTML = "";
    messages.forEach(msg => {
        let imageHtml = msg.image ? `<img src=\"data:image/*;base64,${msg.image}\" class=\"chooseimg\" alt=\"Uploaded Image\"/>` : "";
        let html = `
            <img src="${msg.sender === 'user' ? 'user.png' : 'ai.png'}" alt="${msg.sender}" width="50">
            <div class="${msg.sender}-chat-area">
                <p>${msg.message}</p>
                ${imageHtml}
            </div>`;
        let box = createChatBox(html, `${msg.sender}-chat-box`);
        chatContainer.appendChild(box);
    });
    chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
}

// Load messages on page load
window.addEventListener("DOMContentLoaded", loadMessages);

function handlechatResponse(inputValue) {
    const input = inputValue.trim();

    if (!input && !user.file.data) return;

    // Determine if the input is a URL or text
    if (isValidURL(input)) {
        user.url = input;
        user.message = `Please analyze this URL: ${input}`;
    } else {
        user.message = input;
        user.url = "";
    }

    // Image-only fallback
    if (!user.message && user.file.data) {
        user.message = "Describe this image.";
    }

    const imageHtml = user.file.data
        ? `<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" alt="Uploaded Image"/>`
        : "";

    const userChatHtml = `
        <img src="user.png" alt="User" width="50">
        <div class="user-chat-area">
            <p>${user.message}</p>
            ${imageHtml}
        </div>`;

    const userBox = createChatBox(userChatHtml, "user-chat-box");
    chatContainer.appendChild(userBox);
    chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });

    promptInput.value = "";

    // Save user message to DB
    saveMessage("user", user.message, user.file.data || "");

    setTimeout(() => {
        const aiLoadingHtml = `
            <img src="ai.png" alt="AI" width="50">
            <div class="ai-chat-area">
                <img src="loading.gif" alt="Loading..." width="50">
            </div>`;
        const aiBox = createChatBox(aiLoadingHtml, "ai-chat-box");
        chatContainer.appendChild(aiBox);
        generateResponse(aiBox);
    }, 500);
}

async function generateResponse(aiChatBox) {
    const aiTextContainer = aiChatBox.querySelector(".ai-chat-area");

    const parts = [];
    if (user.message) parts.push({ text: user.message });
    if (user.url) parts.push({ text: `URL: ${user.url}` });
    if (user.file.data) {
        parts.push({
            inline_data: {
                mime_type: user.file.mime_type,
                data: user.file.data
            }
        });
    }

    const requestOption = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts }] })
    };

    try {
        const response = await fetch(Api_Url, requestOption);
        const data = await response.json();

        const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        aiTextContainer.innerHTML = aiText
            ? formatResponseToHtml(aiText.replace(/\*\*(.*?)\*\*/g, "$1").trim())
            : "⚠️ AI returned an empty or invalid response.";

        // Save AI message to DB
        if (aiText) {
            await saveMessage("ai", aiText.replace(/\*\*(.*?)\*\*/g, "$1").trim());
        }
    } catch (error) {
        console.error("Error:", error);
        aiTextContainer.textContent = "⚠️ An error occurred while getting the response.";
    } finally {
        chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
        user.file = { mime_type: null, data: null };
        user.url = "";
    }
}

// Trigger by Enter key
promptInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        handlechatResponse(promptInput.value);
    }
});

// Trigger by submit button
submitBtn.addEventListener("click", () => {
    handlechatResponse(promptInput.value);
});

// Handle image file upload
imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file || !allowedTypes.includes(file.type)) {
        alert("Please upload a JPG or PNG image.");
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const base64string = e.target.result.split(",")[1];
        user.file = {
            mime_type: file.type,
            data: base64string
        };
    };
    reader.readAsDataURL(file);
});

// Open file picker
imageBtn.addEventListener("click", () => {
    imageInput.click();
});
