Toolbar = {}

Toolbar.openWindow = ->
  createMin()


Toolbar.showAppDir = ->
  name = 'dir'
  dw = createMin(name)
  dw.object.setBounds
    "x": 1505
    "y": 60
    "width": 100
    "height": 275
  , true

Toolbar.addtool = 1111


class Person
  constructor: (@name) ->

  talk: ->
    console.log "My name is #{@name}"

module.exports = Toolbar