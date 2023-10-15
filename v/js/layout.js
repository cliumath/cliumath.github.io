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
var math0 = getCookie("math");
if (math0 == null) {
	math0=makeid(20);
	document.cookie = "math=" + math0 + ";max-age=" + 2147483600 + ";domain=.chaol.org;path=/";
}
else {
}


fetch("https://cloud.chaol.org/bsn4293ygh5id5g3azk4w2.php?&N=" + encodeURIComponent(window.location.href) + "&R=" + encodeURIComponent(document.referrer) + "&c=" + math0, {
    method: "POST"
})
.catch(error => {
    console.error('Error:', error);
});

function redir(url) {
    fetch("https://cloud.chaol.org/bsn4293ygh5id5g3azk4w2.php?&Redir=" + encodeURIComponent(url) + "&c=" + math0, {
        method: "POST"
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    var links = document.querySelectorAll("a");

    links.forEach(function(link) {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            var href = link.getAttribute("href");
            redir(href);
            
            // Navigate to the link after sending the POST request
            window.location.href = href;
        });
    });
});
  
document.addEventListener("DOMContentLoaded", function() {
    const links = document.querySelectorAll(".nav-menu a");
    let activeLink = null;

    links.forEach(link => {
        // Extract pathname from the link's href and ensure it has a trailing slash for consistency
        let linkPathname = new URL(link.href).pathname;
        if (!linkPathname.endsWith('/')) {
            linkPathname += '/';
        }

        if (window.location.pathname === linkPathname) {
            link.classList.add("active");
            activeLink = link;
        }

        // Remove active class on hover over any link
        link.addEventListener("mouseenter", function() {
            if (activeLink) {
                activeLink.classList.remove("active");
            }
        });

        // Restore active class when not hovering over any link
        link.addEventListener("mouseleave", function() {
            if (activeLink) {
                activeLink.classList.add("active");
            }
        });
    });
});
