$(document).ready(function () {

    var emailInfo = [];

    $("#emailInfo").submit(function (e) {
        e.preventDefault();
        $email = $("input[name=emailAddress]").val() + "--" + $("input[name=pass]").val();

        var encrypted = CryptoJS.AES.encrypt($email, "$$$$@@@@");

        chrome.storage.sync.set({ "email": encrypted }, function () {
            $("#emailContainer").css("display", "none");
            $("#wholeContainer").css("display", "inherit");
        });

    });


    $("#reset").click(function () {
        chrome.storage.sync.remove("email", function () {
            $("#emailContainer").css("display", "inherit");
            $("#wholeContainer").css("display", "none");
        });
        /*var encrypted = CryptoJS.AES.encrypt("message","$$$$@@@@");
        
        var decrypted = CryptoJS.AES.decrypt(encrypted,"$$$$@@@@");
        alert(decrypted.toString(CryptoJS.enc.Utf8));  */
    });


    chrome.storage.sync.get("email", function (value) {
        var val = (CryptoJS.AES.decrypt(value.email, "$$$$@@@@")).toString(CryptoJS.enc.Utf8);;
        if (val) {
            emailInfo = val.split("--");
            //alert(emailInfo[0] +" "+emailInfo[1]);
            $("#emailContainer").css("display", "none");
            $("#wholeContainer").css("display", "inherit");
        }
    });




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

    $("#upload").change(function () {
        $uploadUrl = "https://mailerg.000webhostapp.com/upload.php";

        var value = document.getElementById("upload");
        var file = value.files[0];

        var form_data = new FormData();

        form_data.append('file', file);

        $.ajax({
            type: "POST",
            url: $uploadUrl,
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            encode: true
        }).done(function (data) {
            $status = JSON.parse(data);
            if ($status.statusOut == "uploaded") {
                $("#status").text("Status : File Succesfully Attached");
            } else {
                $("#status").text("Status : Might Some Network Problem");
            }
        }).fail(function (data) {
            $status = JSON.parse(data);
            if ($status.statusOut == "failedSize") {
                $("#status").text("Status : File Size Is >100Kb");
            } else {
                $("#status").text("Status : Error ,Contact The Administrator");
            }
        })
    });

    $("#data").submit(function (event) {

        event.preventDefault();

        $url = "https://mailerg.000webhostapp.com/mailToFile.php";

        $("#loader").css("visibility", "visible");
        $("#container").css("visibility", "hidden");

        var dataForm = new FormData(this);
        dataForm.append("Semail",emailInfo[0]);
        dataForm.append("Spass",emailInfo[1]);

        $.ajax({
            type: "POST",
            url: $url,
            data: dataForm,
            contentType: false,
            cache: false,
            processData: false,
            encode: true
        }).done(function (data) {
            $("#loader").css("visibility", "hidden");
            $("#container").css("visibility", "visible");
            $arr = JSON.parse(data);
            chrome.storage.sync.set({ "process": "ended" }, function () {

                if ($arr.statusOut == "Success") {
                    chrome.notifications.create({
                        type: "basic",
                        title: "Mailer Sending Status!",
                        message: $arr.statusOut + " : Your Message Has Been Sent!",
                        contextMessage: "Message Status!!",
                        iconUrl: "gg.png",
                    });
                } else {
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
