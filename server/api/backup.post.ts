import nodemailer from 'nodemailer'
import ejs from 'ejs'
import dayjs from 'dayjs'

import { EMAIL_TEMPLATE } from '~/constants/email'

const config = useRuntimeConfig()

const sendBackupEmail = async (username: string, to: string, blob?: Blob) => {
  // email auth account info
  const passport = {
    user: config.public.EMAIL_USER,
    pass: config.public.EMAIL_PASSWORD
  }

  // create email transport
  const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
      ciphers: 'SSLv3'
    },
    auth: passport,
    connectionTimeout: 300000,
    greetingTimeout: 300000
  })

  // verify connection configuration
  transporter.verify(function (error, success) {
    if (error) {
      console.log(error)
    } else {
      console.log('Server is ready to take our messages')
    }
  })

  const attachments = [
    {
      filename: 'logo.png',
      path: 'https://www.onetab.group/favicon-light.png',
      cid: 'logo'
    },
    {
      filename: 'preview.png',
      path: 'https://www.onetab.group/preview.png',
      cid: 'preview'
    },
    {
      filename: `one-tab-group.${dayjs().format('YYYY.MM.DD.HH:mm:ss')}.json`,
      content: blob
    }
  ]

  // use ejs as the template
  const template = ejs.compile(EMAIL_TEMPLATE, 'utf8')

  const templateParams = {
    name: 'onetab.group',
    href: 'https://onetab.group',
    bio: 'Your all-in-one tab/tab group manager for Chrome.',
    creatorDesc:
      'is a chrome extension that allows you to manage your tabs & tab groups in one place. One-click to aggregate all tabs & tab groups into one session. ',
    cids: attachments
      .filter((item) => item.cid !== null)
      .map((v) => `cid:${v.cid}`)
  }

  // generate html buffer
  const html = template(templateParams)

  const mailOptions = {
    from: config.public.EMAIL_USER,
    to: to,
    cc: '',
    bcc: '',
    subject: `Hi, ${username}, your one tab group backup is ready!`,
    html,
    attachments
  }

  // send mail with defined transport object
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error)
      }
      resolve(info.messageId)
    })
  })
}

export default defineEventHandler(async (event): Promise<any> => {
  const { username, to, blob } = await useBody(event)
  const data = await sendBackupEmail(username, to, blob)
  return {
    data
  }
})