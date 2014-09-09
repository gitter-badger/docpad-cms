module.exports =
  path: '/save-form'
  transport:
    host: 'smtp.gmail.com',
    port: 465,
    secureConnection: true,
    debug: false,
    auth:
      user: 'tracerent.test@gmail.com',
      pass: 'jHjjA751'
  from: 'tracerent.test@gmail.com'
  redirect: '/'
  to: 'tracerent.test@gmail.com'
