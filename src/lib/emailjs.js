import emailjs from '@emailjs/browser'

const SERVICE_ID = 'service_hxxq1i6'
const TEMPLATE_ID = 'template_8qpa7qq'
const PUBLIC_KEY = 'tlLPvlsrbWp7LMzsq'

export const sendContactEmail = async ({ name, email, message }) => {
  return emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    { from_name: name, from_email: email, message },
    PUBLIC_KEY
  )
}
