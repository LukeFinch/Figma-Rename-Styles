import { extractLinearGradientParamsFromTransform}  from "@figma-plugin/helpers"


export function rgbaString(color: RGBA){
 	return `rgba(${color.r * 255},${color.g * 255},${color.b * 255},${color.a})` as string
}

export function parseGradient(p: GradientPaint) {

    let angle = 180 //angleBetween(gradient.from(), gradient.to())
    let type = ''
    switch (p.type) {
      case 'GRADIENT_LINEAR':
        type = "linear-gradient"
        let angleData = extractLinearGradientParamsFromTransform(18, 18,p.gradientTransform)
  
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
    stops.forEach((stop: ColorStop) => {
      //We wanted to have gradients be made up of two tokens, but alpha values made things awkard.
      // let colorToken = colorPalette.getKeyByValue(`${MSColorToRGBA(stop.color())}`)
      // str.push(` ${colorToken} ${(stop.position().toFixed(4)*100)}%`)
  
      str.push(`${rgbaString(stop.color)} ${((stop.position)*100).toFixed(4)}%`)
  
  
    })
  
    let output = `${type}(${angle}deg, ${str.join(',')})`
  
    return output
  }

  function angleBetween(p1: Array<number>, p2: Array<number>) {
    let angleDeg = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]) * 180 / Math.PI;
    return Math.round(angleDeg) as number
  }


export function mapOrder(array: Array<any>, order:Array<any>, key: any) {

    array.sort(function (a, b) {
    
      var A = key === undefined ? a : a[key];
      var B = key === undefined ? b : b[key]
      
      
      if (order.indexOf(A) > order.indexOf(B)) {
        return 1;
      } else {
        return -1;
      }
    });

    return array;
  }