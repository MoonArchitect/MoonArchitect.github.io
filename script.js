const nContent = 6;
const previewURLs = ['content/Previews/Preview_Expansion.png', 'content/Previews/Preview_2.png', 'content/Previews/Preview_5.png', 'content/Previews/Preview_3.png', 'content/Previews/Preview_1.png', 'content/Previews/Preview_4.png'];
const videoURLs = ['content/Video/Expansion_compressed.mp4', 'content/Video/1024k_compressed.mp4', 'content/Video/TwoDisks_compressed.mp4', 'content/Video/LDisk_compressed.mp4', 'content/Video/512k_compressed.mp4', 'content/Video/TwoDisks2_compressed.mp4'];
var navPoints = [],
    contentDOMs = [],
    navBar, root, videoSrc, videoDOM;
var previousScroll = -9999,
    scrollTransition = false,
    highlighted = 0,
    contentOffset = 0,
    navBarClicked = false,
    contentClicked = false,
    sideMenuShown = false,
    sideMenuAnimationPlays = false;

document.addEventListener("DOMContentLoaded", function() {
    root = document.documentElement;
    const sideMenu = document.getElementById("content-container");
    const contentContainer = document.getElementById("content-container");
    navBar = document.getElementById("nav-bar");
    videoSrc = document.getElementById("video-source");
    videoDOM = document.getElementById("video");

    videoDOM.src = videoURLs[0];
    setTimeout(() => { videoDOM.style.opacity = 1; videoDOM.playbackRate = 2.0; }, 300);

    for (var i = 0; i < nContent; i++) {
        var div = document.createElement("div");
        div.classList.add("content");
        div.id = "content-" + i;
        div.style.backgroundImage = "url(" + previewURLs[i % previewURLs.length] + ")";
        div.onclick = (event) => {
            if (!contentClicked) {
                contentClicked = true
                setTimeout(() => { contentClicked = false }, 300);

                newHighlight = parseInt(event.target.id.slice(-1));
                updateContentFocus(newHighlight);
            }
        }

        contentContainer.appendChild(div);


        var navPoint = document.createElement("div");
        navPoint.classList.add("nav-point");
        navPoint.id = "nav-point-" + i;
        navPoint.onclick = (event) => {
            newHighlight = parseInt(event.target.id.slice(-1));
            updateContentFocus(newHighlight);
        }

        navBar.appendChild(navPoint);
    }

    var div = document.createElement("div");
    div.id = "fix";
    contentContainer.appendChild(div);


    const tempSideMenu = document.getElementById("side-menu");
    onMouseEvent = (event) => {
        if (!sideMenuAnimationPlays) {
            var p = event.clientX - tempSideMenu.getBoundingClientRect().right;

            if (sideMenuShown && p > 0) {
                root.style.setProperty("--translateContent", "-20%");
                root.style.setProperty("--contentOpacity", "0");
                root.style.setProperty("--highlightedContentOpacity", "0");
                sideMenuShown = false;
                sideMenuAnimationPlays = true;
                setTimeout(() => { sideMenuAnimationPlays = false; }, 200);
            } else if (!sideMenuShown && (event.clientX < 150 || event.clientX < tempSideMenu.getBoundingClientRect().width * 0.7)) {
                root.style.setProperty("--translateContent", "0%");
                root.style.setProperty("--contentOpacity", "0.6");
                root.style.setProperty("--highlightedContentOpacity", "1");
                sideMenuShown = true;
                sideMenuAnimationPlays = true;
                setTimeout(() => { sideMenuAnimationPlays = false; }, 200);
            }
        }
    }
    window.addEventListener("mousemove", onMouseEvent);
    window.addEventListener("click", onMouseEvent);

    for (var i = 0; i < nContent; i++) {
        navPoints.push(document.getElementById("nav-point-" + i));
        contentDOMs.push(document.getElementById("content-" + i));
    }

    navPoints[highlighted].classList.toggle("nav-point-highlighted");
    contentDOMs[highlighted].classList.toggle("content-highlighted");


    const navBarRect = navBar.getBoundingClientRect();
    const contentRect = contentDOMs[highlighted].getBoundingClientRect();
    const shift = navBarRect.top + navBarRect.height / 2 - contentRect.top - contentRect.height / 2;
    contentOffset = shift;
    root.style.setProperty("--scroll-px", contentOffset + "px");

    sideMenu.addEventListener("wheel", (event) => {
        if (!scrollTransition && event.timeStamp - previousScroll < 100) {

            if (event.deltaY > 0 && highlighted < nContent - 1 || event.deltaY < 0 && highlighted > 0) {
                updateContentFocus(highlighted + (event.deltaY > 0 ? 1 : -1));
            } else {
                setTimeout(() => { scrollTransition = false }, 50)
            }

        }
        previousScroll = event.timeStamp;
    })


    root.style.setProperty("--translateContent", "0%");
    root.style.setProperty("--contentOpacity", "0.6");
    root.style.setProperty("--highlightedContentOpacity", "1");
    sideMenuShown = true;
    sideMenuAnimationPlays = true;
    setTimeout(() => { sideMenuAnimationPlays = false; }, 1500);
});

function updateContentFocus(newHighlight) {
    if (!sideMenuShown)
        return;

    if (highlighted != newHighlight) {
        navPoints[highlighted].classList.toggle("nav-point-highlighted");
        contentDOMs[highlighted].classList.toggle("content-highlighted");
        navPoints[newHighlight].classList.toggle("nav-point-highlighted");
        contentDOMs[newHighlight].classList.toggle("content-highlighted");
    }

    const navBarRect = navBar.getBoundingClientRect();
    navBarCentre = navBarRect.top + navBarRect.height / 2;

    const contentRect = contentDOMs[newHighlight].getBoundingClientRect();

    var resize = highlighted != newHighlight ? window.innerHeight * 0.1 : 0;
    var shift = navBarCentre - contentRect.top + resize - (contentRect.height + resize) / 2;

    if (newHighlight < highlighted)
        shift = navBarCentre - contentRect.top - (contentRect.height + resize) / 2;

    contentOffset += shift;
    root.style.setProperty("--scroll-px", contentOffset + "px");


    if (newHighlight != highlighted) {
        videoDOM.style.opacity = 0;
        setTimeout(() => { videoDOM.style.opacity = 1; }, 350);
        setTimeout(() => { 
            videoDOM.src = videoURLs[newHighlight];
            if (newHighlight == 0)
                videoDOM.playbackRate = 2.0;
            else
                videoDOM.playbackRate = 1.0;
        }, 160);
    }

    highlighted = newHighlight;
    scrollTransition = true;
    setTimeout(() => { scrollTransition = false }, 250)
}
