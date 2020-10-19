function parseGradient(p) {
  console.log('I got called')
  console.log(p)
  let angle = 180 //angleBetween(gradient.from(), gradient.to())
  let type = ''
  switch (p.type) {
    case 'GRADIENT_LINEAR':
      type = "linear-gradient"
      break;
    case 'GRADIENT_RADIAL':
      type = "radial-gradient"
      break;
    case 'GRADIENT_ANGULAR':
      type = "angular-gradient"
      break;
  }

  let stops = p.gradientStops
  let str = []
  stops.forEach(stop => {
    //We wanted to have gradients be made up of two tokens, but alpha values made things awkard.
    // let colorToken = colorPalette.getKeyByValue(`${MSColorToRGBA(stop.color())}`)
    // str.push(` ${colorToken} ${(stop.position().toFixed(4)*100)}%`)

    str.push(`${color255(stop.color)} ${(stop.position.toFixed(4)*100)}%`)


  })

  let output = `${type}(${angle}deg,${str.join(',')})`
  console.log(output)
  return output
}


function color255(color){
  console.log('color 255')
  
  return color.a ? `rgba(${color.r * 255},${color.g * 255},${color.b * 255},${color.a * 255})` :  `rgb(${color.r * 255},${color.g * 255},${color.b * 255})`
  
}


figma.showUI(__html__, {width: 600, height: 400});
updateList()

function updateList(){
  
  let paints = figma.getLocalPaintStyles()
  let myArr = []

  paints.forEach(paint => {
  


    let style = []
    paint.paints.forEach(p => {
      switch(p.type) {
        case 'SOLID':
        style.push(`rgba(${p.color.r * 255},${p.color.g * 255},${p.color.b * 255},${p.opacity})`)
        break;
        case 'IMAGE':
        break;
          default:
          style.push(parseGradient(p))
          break;
  
      }
    })
     let c = {'name':'','id':'','style': ''}
    c.style = style.join(',')
    c.name = paint.name
    c.id = paint.id
    myArr.push(c)
  })
  
  figma.ui.postMessage(JSON.stringify(myArr))

}


//Used for gradients, to know what direction they face.
function angleBetween(p1, p2) {
  let angleDeg = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
  return Math.round(angleDeg)
}

figma.ui.onmessage = msg => {
  if(msg.type === 'refresh-list'){
    updateList()
  }
if (msg.type === 'rename-color') {  
  let dat = JSON.parse(msg.data)
  let p = figma.getLocalPaintStyles().find(paint => paint.id == dat.id)

  p != undefined ? p.name = dat.name : null;

  updateList()
}
  if(msg.type === 'cancel'){
    figma.closePlugin();
  }
}