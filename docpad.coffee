module.exports =
  port: 9070

  templateData:
    require('./lib/templateData')

  plugins:

    contactify:
      require('./lib/contactifyConfig')

    restapi:
        require('./lib/restapiConfig')
