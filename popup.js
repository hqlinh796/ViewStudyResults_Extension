chrome.runtime.onMessage.addListener(function (request, sender) {

  if (request.action == "getSource") {
    message.innerText = "";
    document.querySelector('#year').innerText = request.source.year || "";
    document.querySelector('#semester').innerText = request.source.semester || "";
    document.querySelector('#credit').innerText = request.source.totalCredits || "";
    document.querySelector('#GPA').innerText = request.source.GPA || "";
  }
});

function onWindowLoad() {
  let message = document.querySelector('#message');
  chrome.tabs.executeScript(null, {
    file: "getResult.js"
  }, function () {
    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
    if (chrome.runtime.lastError) {
      message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
    }
  });

}

window.onload = onWindowLoad;