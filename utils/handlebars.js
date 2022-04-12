const path = require('path')
var nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'email2022test@gmail.com',
        pass: 'Abcdef123!'
    }
});

const handlebarOptions = {
    viewEngine: {
        extName: ".handlebars",
        partialsDir: path.resolve('./template'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./template'),
    extName: ".handlebars",
}



const sendEmail = (receiver) => {
    var mailOptions = {
        from: 'email2022test@gmail.com',
        to: receiver,
        subject: 'Thank you for subscribing',
        template: 'email',
        context: {
            title: 'Title Here',
            text: "lorm ipsum"
        },

    };


    var mailOption2 = {
        from: 'email2022test@gmail.com',
        to: 'email2022test@gmail.com',
        subject: 'NEW SUBSCRIPTION FROM EKALY',
        text: '->' + receiver + ' signed to Ekaly newsletter'

    };

    transporter.sendMail(mailOption2, function (error, info) {
        if (error) {
            console.log(error);
            return false;
        } else {
            console.log('Email sent: ' + info.response);
            return true;
        }
    });

    transporter.use('compile', hbs(handlebarOptions));

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            return false;
        } else {
            console.log('Email sent: ' + info.response);
            return true;
        }
    });

}

module.exports.sendEmail = sendEmail