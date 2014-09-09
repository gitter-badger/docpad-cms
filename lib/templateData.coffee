module.exports =
  getMenus: (menuLevel) ->
    if not menuLevel
      menuLevel = 'Top menu'
    filter =
      type: 'menu'
      parent: menuLevel
    @getDatabase().findAll(filter).sortArray(name: 1)

  getCurrentMenu: (documentUrl) ->
    if not documentUrl
      return null
    filter =
      type: 'menu'
      href: documentUrl
    menu = @getDatabase().findOne(filter)
    if not menu
      return null
    return menu.toJSON()

  getTopSubMenu: (documentUrl) ->
    if not documentUrl
      return {}
    menu = @getDatabase().findOne({type: 'menu', href: documentUrl})
    if menu && !(menu.meta.attributes.parent is 'Top menu')
      menu = @getDatabase().findOne({type: 'menu', title: menu.meta.attributes.parent})

    if not menu
      return null
    return menu.toJSON()

  getBreadCrumbs: (documentUrl) ->
    if not documentUrl
      return []

    result =[{l:'/',t:'Home'}]
    menu = @getDatabase().findOne({type: 'menu', href: documentUrl})

    if menu
      result.splice(1, 0, {l:menu.meta.attributes.href,t:menu.meta.attributes.title})
      menu = @getDatabase().findOne({type: 'menu', title: menu.meta.attributes.parent})

    if menu
      result.splice(1, 0, {l:menu.meta.attributes.href,t:menu.meta.attributes.title})
      menu = @getDatabase().findOne({type: 'menu', title: menu.meta.attributes.parent})

    return result

  getPages: ->
    filter =
      type: 'page'
      visibility: 'Visible'
    @getDatabase().findAll(filter).sortArray(name: 1)

  getNews: (newsStatus) ->
    if not newsStatus
      newsStatus = 'Active'
    filter =
      type: 'news'
      visibility: 'Visible'
      status: newsStatus
    @getDatabase().findAll(filter).sortArray(name: 1)

  getBlocks: (blockType) ->
    if not blockType
      blockType = 'Home'
    filter =
      type: 'block'
      visibility: 'Visible'
      blockType: blockType
    @getDatabase().findAll(filter).sortArray(name: 0)

  getForm: require('./templateFn/getForm')

  renderForm: require('./templateFn/renderForm')

  getParams: require('./templateFn/getParams')

  getPageThumbnail: require('./templateFn/getPageThumbnail')

  getVacancies: require('./templateFn/getVacancies')
