const diskStatus = require("./diskspace/diskspace.service");
var cron = require("node-cron");
const { transporter, SENDMAIL } = require("./mailer/mailer.service");
const data = diskStatus();

cron.schedule("0 8 * * *", async () => {
  const e = await data;
  if (e.space.trim() == "95") {
    try {
      const options = {
        from: "Amovil Alertas <amovilalertas@gmail.com>",
        to: "cristian.ayala@amovil.co",
        subject: `Disk Usage ${new Date().toDateString()}`,
        text: JSON.stringify(e, null, 2),
        html: HTML_TEMPLATE(JSON.stringify(e, null, 2)),
      };
      await SENDMAIL(options, (info) => {
        console.log("Email sent successfully");
        console.log("MESSAGE ID: ", info.messageId);
      });
      await waitFor();
    } catch (error) {
      console.log(error, "error");
    }
  }
});

const HTML_TEMPLATE = (text) => {
  return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>NodeMailer Email Template</title>
          <style>
            .container {
              width: 100%;
              height: 100%;
              padding: 20px;
              background-color: #f4f4f4;
            }
            .email {
              width: 80%;
              margin: 0 auto;
              background-color: #fff;
              padding: 20px;
            }
            .email-header {
              background-color: #333;
              color: #fff;
              padding: 20px;
              text-align: center;
            }
            .email-body {
              padding: 20px;
            }
            .email-footer {
              background-color: #333;
              color: #fff;
              padding: 20px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="email">
              <div class="email-header">
                <h1>Disk Space</h1>
              </div>
              <div class="email-body">
                <pre>${text}</pre>
              </div>
              <div class="email-footer">
                <p>Amovil</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
};

const waitFor = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 600000);
  });
};
