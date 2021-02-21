var slides_home = document.getElementById("slides_home");
var height = window.getComputedStyle(slides_home).height
var width = window.getComputedStyle(slides_home).width;
let hIndex = height.lastIndexOf("px");
let wIndex = width.lastIndexOf("px");

WIDGET = {
  CONFIG: {
    "layout": 1,
    "width": width.slice(0, wIndex),
    "height": height.slice(0, hIndex),
    "background": 1,
    "dataColor": "FFFFFF",
    "borderRadius": 2,
    "key": "26a8da3e8fd546369a7f23083e6d32e7"
  }
}

// function updateWIDGET() {
//   var slides_home = document.getElementById("slides_home");
//   var height = window.getComputedStyle(slides_home).height
//   var width = window.getComputedStyle(slides_home).width;
//   let hIndex = height.lastIndexOf("px");
//   let wIndex = width.lastIndexOf("px");
//   widget = {
//     CONFIG: {
//       "layout": 1,
//       "width": width.slice(0, wIndex),
//       "height": height.slice(0, hIndex),
//       "background": 1,
//       "dataColor": "FFFFFF",
//       "borderRadius": 2,
//       "key": "26a8da3e8fd546369a7f23083e6d32e7"
//     }
//   }
//   this.WIDGET =widget;
//   console.log("widget: ",this.WIDGET);
// }


