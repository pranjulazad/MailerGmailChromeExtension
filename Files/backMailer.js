$(document).ready(function () {

    $("#loader").css("visibility", "visible");
    $("#container").css("visibility", "hidden");

    var failedCount = 0;
    var checkValue = setInterval(checkProcess, 1000);
    function checkProcess() {
        chrome.storage.sync.get('process', function (data) {
            failedCount += 1;
            if (data.process == "ended" || data.process == undefined) {
                clearInterval(checkValue);
                $("#loader").css("visibility", "hidden");
                $("#container").css("visibility", "visible");
            }

        })
        if (failedCount > 5) {
            chrome.storage.sync.set({ "process": "ended" })
            clearInterval(checkValue);
            $("#loader").css("visibility", "hidden");
            $("#container").css("visibility", "visible");
        }

    }

    $("#data").submit(function (event) {

        event.preventDefault();

        $url = "http://localhost/extensionData/mailToFile.php";

        $("#loader").css("visibility", "visible");
        $("#container").css("visibility", "hidden");

        chrome.storage.sync.set({ "process": "running" });

        

        $.ajax({
            type: "POST",
            url: $url,
            data: new FormData(this),
            contentType: false,
            cache: false,
            processData: false,
            encode: true
        }).done(function (data) {
            $("#loader").css("visibility", "hidden");
            $("#container").css("visibility", "visible");
            chrome.storage.sync.set({ "process": "ended" }, function () {
                $arr = JSON.parse(data);

                if($arr.statusOut == "Success"){

                chrome.notifications.create({
                    type: "basic",
                    title: "Mailer Sending Status!",
                    message: $arr.statusOut + " : Your Message Has Been Sent!",
                    contextMessage: "Message Status!!",
                    iconUrl: "gg.png",
                });
                }else{
                chrome.notifications.create({
                    type: "basic",
                    title: "Mailer Sending Status!",
                    message: $arr.statusOut + " : Some Network Problem Or Other Issue!",
                    contextMessage: "Message Status!!",
                    iconUrl: "gg.png",
                });
            }
            });
            

        }).fail(function (data) {
            $("#loader").css("visibility", "hidden");
            $("#container").css("visibility", "visible");
            chrome.storage.sync.set({ "process": "ended" }, function () {
                $arr = JSON.parse(data);
                chrome.notifications.create({
                    type: "basic",
                    title: "Gmail Sending Status!",
                    message: $arr.statusOut + " : Your Message Sending Failed",
                    contextMessage: "Gmail Notifier!!",
                    iconUrl: "gg.png",
                });
            });
        })
    })
})
