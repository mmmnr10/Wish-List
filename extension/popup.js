document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById('addBtn');
  const preview = document.getElementById('preview');
  
  let currentUrl = '';

  // Hämta den aktiva tabben i webläsaren
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    currentUrl = tab.url;
    
    // Visa länk i popupen (förkortad för ui)
    preview.innerText = 'Vald länk:\n' + tab.title;
  });

  addBtn.addEventListener('click', () => {
    if (!currentUrl) return;
    
    // För en optimal hantering av session cookies, 
    // öppnar vi snabbt och magiskt upp din Dashboard och fyller i länken automatiskt
    const appUrl = `http://localhost:3000/dashboard?addUrl=${encodeURIComponent(currentUrl)}`;
    
    chrome.tabs.create({ url: appUrl });
  });
});
