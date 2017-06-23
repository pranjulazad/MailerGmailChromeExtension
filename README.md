# MailerGmailChromeExtension
First Go through the provided manifest.json file if you are working in chrome Extension!!!

Befor using It You have to make changes in some files for your browser....

1.) In backMailer.js file on line '31' there is a variable $url that have linked with some address, that address is my localhost xampp
related address but if you want to keep that file which named mailToFile.php(server file) (you can see clearly and provided in repository)
on your online hosting websites then link that address to send the data after submitting the 'form(HTML)' in backMailer.js file.

2.)In mailToFile.php file on line '31' (coincidentally!!) Same you have to require that PHPMailerAutoload.php file So Link It Accordingly

3.)In manifest.json , In the permissions property I have provided my localhost you just change it with some your related links where actually you kept your mailToFile.php file.

4.)Any problem You Encounter in this process or in the Extension ... Let ME know>>

HAVE FUN!!!!!!!!!
