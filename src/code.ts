import { extractLinearGradientParamsFromTransform}  from "@figma-plugin/helpers"


function parseGradient(p) {
  console.log('I got called')
  console.log(p)
  let angle = 180 //angleBetween(gradient.from(), gradient.to())
  let type = ''
  switch (p.type) {
    case 'GRADIENT_LINEAR':
      type = "linear-gradient"
      let angleData = extractLinearGradientParamsFromTransform(18, 18,p.gradientTransform)
      console.log(angleData)
      angle = angleBetween(angleData.start, angleData.end) + 90
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

  let output = `${type}(${angle}deg, ${str.join(',')})`
  console.log(output)
  return output
}


function color255(color){
  console.log('color 255')
  return `rgba(${color.r * 255},${color.g * 255},${color.b * 255},${color.a})`
  
}


figma.showUI(__html__, {width: 600, height: 400});
updateList()

function updateList(){
  
  let paints = figma.getLocalPaintStyles()
  let myArr = []

  paints.forEach(paint => {
  


    let style = []

    let c = {'name':'','id':'','style': [],'alpha': 1}

    paint.paints.forEach(p => {
      switch(p.type) {
        case 'SOLID':
        style.push({background: `rgba(${p.color.r * 255},${p.color.g * 255},${p.color.b * 255},${p.opacity})`, opacity: 1, type: 'solid'})
        break;
        case 'IMAGE':
        break;
          default:

          style.push({background: parseGradient(p), opacity: p.opacity, type: 'gradient'})
          break;
  
      }
    })
    if(paint.paints.length == 1){
      c.alpha = paint.paints[0].opacity
    }
    c.style = style
    c.name = paint.name
    c.id = paint.id
    
    myArr.push(c)
  })
  
  figma.ui.postMessage({type: "update-list", 'dataStr': JSON.stringify(myArr), 'dataArr': myArr})

}


//Used for gradients, to know what direction they face.
function angleBetween(p1, p2) {
  let angleDeg = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]) * 180 / Math.PI;
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