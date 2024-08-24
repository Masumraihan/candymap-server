import nodemailer from "nodemailer";
//import config from "../config";

export const sendMail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    //secure: config.NODE_ENV !== "development",
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: "masumraihan3667@gmail.com",
      pass: "lesa itqt nlqw emxr",
    },
  });

  // send mail with defined transport object
  await transporter.sendMail({
    from: "masumraihan3667@gmail.com", // sender address
    to, // list of receivers
    subject: "Reset your email within 10 minutes", // Subject line
    text: "reset your email within 10 minutes", // plain text body
    html, //"<b>Hello world?</b>", // html body
  });
};
