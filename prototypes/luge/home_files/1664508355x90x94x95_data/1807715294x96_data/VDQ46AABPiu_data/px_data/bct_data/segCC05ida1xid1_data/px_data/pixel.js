makePixelRequest("http://ad.yieldmanager.com/pixel?id=1382654&t=2","image");

function makePixelRequest(pixelURL,pixelType){

    if(pixelType == "javascript")
    {
        document.write('<script src="'+pixelURL+'" type="text\/javascript"><\/script>');
    }
    else
    {
        var img = new Image();
        img.src = pixelURL;
    }
}

