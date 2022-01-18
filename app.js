const express      = require('express'),
      bodyParser   = require('body-parser'),
      exphbs       = require('express-handlebars'),
      nodemailer   = require('nodemailer'),
      app          = express();

app.engine('handlebars', exphbs.engine({defaultLayout: false}));
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('contact');
});

app.post('/send', (req, res) => {
    let output = `
    <p> You have a new contact request </p>
    <h3> Contact Details </h3>
    <ul>
        <li> Name: ${req.body.name} </li>
        <li> Company: ${req.body.company} </li>
        <li> Email: ${req.body.email} </li>
        <li> Phone Number: ${req.body.phone} </li>
    </ul>

    <h3> Message </h3>
    <p> ${req.body.message} </p>`;

    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: 'youremail@email.com', 
            pass: 'yourpassword', 
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let mailOptions = {
        from: 'sender@gmail.com',
        to: 'reciever@gmail.com',
        subject: 'subject',
        text: 'text',
        html: output
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        res.render('contact', { msg: 'Email has been sent!' });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => `Listening on port ${PORT}`);