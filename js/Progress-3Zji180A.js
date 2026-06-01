import{an as e,hn as t,vn as n}from"../jse/index-index-BlqVogMI.js";import{B as r,H as i,I as a,K as o,L as s,j as c,n as l}from"./use-theme-D15e9Ar2.js";import{n as u}from"./light-DfadGUf5.js";import{t as d}from"./format-length-CrZh-0v9.js";import{n as f}from"./replaceable-B2XtOq5U.js";import{a as p,i as m,o as h,r as g,t as _}from"./light-jKXGywj1.js";var v={success:n(m,null),error:n(h,null),warning:n(g,null),info:n(p,null)},y=t({name:`ProgressCircle`,props:{clsPrefix:{type:String,required:!0},status:{type:String,required:!0},strokeWidth:{type:Number,required:!0},fillColor:[String,Object],railColor:String,railStyle:[String,Object],percentage:{type:Number,default:0},offsetDegree:{type:Number,default:0},showIndicator:{type:Boolean,required:!0},indicatorTextColor:String,unit:String,viewBoxWidth:{type:Number,required:!0},gapDegree:{type:Number,required:!0},gapOffsetDegree:{type:Number,default:0}},setup(t,{slots:r}){let i=e(()=>{let e=`gradient`,{fillColor:n}=t;return typeof n==`object`?`${e}-${o(JSON.stringify(n))}`:e});function a(e,n,r,a){let{gapDegree:o,viewBoxWidth:s,strokeWidth:c}=t,l=50+c/2,u=`M ${l},${l} m 0,50
      a 50,50 0 1 1 0,-100
      a 50,50 0 1 1 0,100`,d=Math.PI*2*50;return{pathString:u,pathStyle:{stroke:a===`rail`?r:typeof t.fillColor==`object`?`url(#${i.value})`:r,strokeDasharray:`${Math.min(e,100)/100*(d-o)}px ${s*8}px`,strokeDashoffset:`-${o/2}px`,transformOrigin:n?`center`:void 0,transform:n?`rotate(${n}deg)`:void 0}}}let s=()=>{let e=typeof t.fillColor==`object`,r=e?t.fillColor.stops[0]:``,a=e?t.fillColor.stops[1]:``;return e&&n(`defs`,null,n(`linearGradient`,{id:i.value,x1:`0%`,y1:`100%`,x2:`100%`,y2:`0%`},n(`stop`,{offset:`0%`,"stop-color":r}),n(`stop`,{offset:`100%`,"stop-color":a})))};return()=>{let{fillColor:e,railColor:i,strokeWidth:o,offsetDegree:c,status:l,percentage:u,showIndicator:d,indicatorTextColor:p,unit:m,gapOffsetDegree:h,clsPrefix:g}=t,{pathString:_,pathStyle:y}=a(100,0,i,`rail`),{pathString:b,pathStyle:x}=a(u,c,e,`fill`),S=100+o;return n(`div`,{class:`${g}-progress-content`,role:`none`},n(`div`,{class:`${g}-progress-graph`,"aria-hidden":!0},n(`div`,{class:`${g}-progress-graph-circle`,style:{transform:h?`rotate(${h}deg)`:void 0}},n(`svg`,{viewBox:`0 0 ${S} ${S}`},s(),n(`g`,null,n(`path`,{class:`${g}-progress-graph-circle-rail`,d:_,"stroke-width":o,"stroke-linecap":`round`,fill:`none`,style:y})),n(`g`,null,n(`path`,{class:[`${g}-progress-graph-circle-fill`,u===0&&`${g}-progress-graph-circle-fill--empty`],d:b,"stroke-width":o,"stroke-linecap":`round`,fill:`none`,style:x}))))),d?n(`div`,null,r.default?n(`div`,{class:`${g}-progress-custom-content`,role:`none`},r.default()):l===`default`?n(`div`,{class:`${g}-progress-text`,style:{color:p},role:`none`},n(`span`,{class:`${g}-progress-text__percentage`},u),n(`span`,{class:`${g}-progress-text__unit`},m)):n(`div`,{class:`${g}-progress-icon`,"aria-hidden":!0},n(f,{clsPrefix:g},{default:()=>v[l]}))):null)}}}),b={success:n(m,null),error:n(h,null),warning:n(g,null),info:n(p,null)},x=t({name:`ProgressLine`,props:{clsPrefix:{type:String,required:!0},percentage:{type:Number,default:0},railColor:String,railStyle:[String,Object],fillColor:[String,Object],status:{type:String,required:!0},indicatorPlacement:{type:String,required:!0},indicatorTextColor:String,unit:{type:String,default:`%`},processing:{type:Boolean,required:!0},showIndicator:{type:Boolean,required:!0},height:[String,Number],railBorderRadius:[String,Number],fillBorderRadius:[String,Number]},setup(t,{slots:r}){let i=e(()=>d(t.height)),a=e(()=>{var e,n;return typeof t.fillColor==`object`?`linear-gradient(to right, ${(e=t.fillColor)==null?void 0:e.stops[0]} , ${(n=t.fillColor)==null?void 0:n.stops[1]})`:t.fillColor}),o=e(()=>t.railBorderRadius===void 0?t.height===void 0?``:d(t.height,{c:.5}):d(t.railBorderRadius)),s=e(()=>t.fillBorderRadius===void 0?t.railBorderRadius===void 0?t.height===void 0?``:d(t.height,{c:.5}):d(t.railBorderRadius):d(t.fillBorderRadius));return()=>{let{indicatorPlacement:e,railColor:c,railStyle:l,percentage:u,unit:d,indicatorTextColor:p,status:m,showIndicator:h,processing:g,clsPrefix:_}=t;return n(`div`,{class:`${_}-progress-content`,role:`none`},n(`div`,{class:`${_}-progress-graph`,"aria-hidden":!0},n(`div`,{class:[`${_}-progress-graph-line`,{[`${_}-progress-graph-line--indicator-${e}`]:!0}]},n(`div`,{class:`${_}-progress-graph-line-rail`,style:[{backgroundColor:c,height:i.value,borderRadius:o.value},l]},n(`div`,{class:[`${_}-progress-graph-line-fill`,g&&`${_}-progress-graph-line-fill--processing`],style:{maxWidth:`${t.percentage}%`,background:a.value,height:i.value,lineHeight:i.value,borderRadius:s.value}},e===`inside`?n(`div`,{class:`${_}-progress-graph-line-indicator`,style:{color:p}},r.default?r.default():`${u}${d}`):null)))),h&&e===`outside`?n(`div`,null,r.default?n(`div`,{class:`${_}-progress-custom-content`,style:{color:p},role:`none`},r.default()):m===`default`?n(`div`,{role:`none`,class:`${_}-progress-icon ${_}-progress-icon--as-text`,style:{color:p}},u,d):n(`div`,{class:`${_}-progress-icon`,"aria-hidden":!0},n(f,{clsPrefix:_},{default:()=>b[m]}))):null)}}});function S(e,t,n=100){return`m ${n/2} ${n/2-e} a ${e} ${e} 0 1 1 0 ${2*e} a ${e} ${e} 0 1 1 0 -${2*e}`}var C=t({name:`ProgressMultipleCircle`,props:{clsPrefix:{type:String,required:!0},viewBoxWidth:{type:Number,required:!0},percentage:{type:Array,default:[0]},strokeWidth:{type:Number,required:!0},circleGap:{type:Number,required:!0},showIndicator:{type:Boolean,required:!0},fillColor:{type:Array,default:()=>[]},railColor:{type:Array,default:()=>[]},railStyle:{type:Array,default:()=>[]}},setup(t,{slots:r}){let i=e(()=>t.percentage.map((e,n)=>`${Math.PI*e/100*(t.viewBoxWidth/2-t.strokeWidth/2*(1+2*n)-t.circleGap*n)*2}, ${t.viewBoxWidth*8}`)),a=(e,r)=>{let i=t.fillColor[r],a=typeof i==`object`?i.stops[0]:``,o=typeof i==`object`?i.stops[1]:``;return typeof t.fillColor[r]==`object`&&n(`linearGradient`,{id:`gradient-${r}`,x1:`100%`,y1:`0%`,x2:`0%`,y2:`100%`},n(`stop`,{offset:`0%`,"stop-color":a}),n(`stop`,{offset:`100%`,"stop-color":o}))};return()=>{let{viewBoxWidth:e,strokeWidth:o,circleGap:s,showIndicator:c,fillColor:l,railColor:u,railStyle:d,percentage:f,clsPrefix:p}=t;return n(`div`,{class:`${p}-progress-content`,role:`none`},n(`div`,{class:`${p}-progress-graph`,"aria-hidden":!0},n(`div`,{class:`${p}-progress-graph-circle`},n(`svg`,{viewBox:`0 0 ${e} ${e}`},n(`defs`,null,f.map((e,t)=>a(e,t))),f.map((t,r)=>n(`g`,{key:r},n(`path`,{class:`${p}-progress-graph-circle-rail`,d:S(e/2-o/2*(1+2*r)-s*r,o,e),"stroke-width":o,"stroke-linecap":`round`,fill:`none`,style:[{strokeDashoffset:0,stroke:u[r]},d[r]]}),n(`path`,{class:[`${p}-progress-graph-circle-fill`,t===0&&`${p}-progress-graph-circle-fill--empty`],d:S(e/2-o/2*(1+2*r)-s*r,o,e),"stroke-width":o,"stroke-linecap":`round`,fill:`none`,style:{strokeDasharray:i.value[r],strokeDashoffset:0,stroke:typeof l[r]==`object`?`url(#gradient-${r})`:l[r]}})))))),c&&r.default?n(`div`,null,n(`div`,{class:`${p}-progress-text`},r.default())):null)}}}),w=a([s(`progress`,{display:`inline-block`},[s(`progress-icon`,`
 color: var(--n-icon-color);
 transition: color .3s var(--n-bezier);
 `),r(`line`,`
 width: 100%;
 display: block;
 `,[s(`progress-content`,`
 display: flex;
 align-items: center;
 `,[s(`progress-graph`,{flex:1})]),s(`progress-custom-content`,{marginLeft:`14px`}),s(`progress-icon`,`
 width: 30px;
 padding-left: 14px;
 height: var(--n-icon-size-line);
 line-height: var(--n-icon-size-line);
 font-size: var(--n-icon-size-line);
 `,[r(`as-text`,`
 color: var(--n-text-color-line-outer);
 text-align: center;
 width: 40px;
 font-size: var(--n-font-size);
 padding-left: 4px;
 transition: color .3s var(--n-bezier);
 `)])]),r(`circle, dashboard`,{width:`120px`},[s(`progress-custom-content`,`
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 display: flex;
 align-items: center;
 justify-content: center;
 `),s(`progress-text`,`
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 display: flex;
 align-items: center;
 color: inherit;
 font-size: var(--n-font-size-circle);
 color: var(--n-text-color-circle);
 font-weight: var(--n-font-weight-circle);
 transition: color .3s var(--n-bezier);
 white-space: nowrap;
 `),s(`progress-icon`,`
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 display: flex;
 align-items: center;
 color: var(--n-icon-color);
 font-size: var(--n-icon-size-circle);
 `)]),r(`multiple-circle`,`
 width: 200px;
 color: inherit;
 `,[s(`progress-text`,`
 font-weight: var(--n-font-weight-circle);
 color: var(--n-text-color-circle);
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 display: flex;
 align-items: center;
 justify-content: center;
 transition: color .3s var(--n-bezier);
 `)]),s(`progress-content`,{position:`relative`}),s(`progress-graph`,{position:`relative`},[s(`progress-graph-circle`,[a(`svg`,{verticalAlign:`bottom`}),s(`progress-graph-circle-fill`,`
 stroke: var(--n-fill-color);
 transition:
 opacity .3s var(--n-bezier),
 stroke .3s var(--n-bezier),
 stroke-dasharray .3s var(--n-bezier);
 `,[r(`empty`,{opacity:0})]),s(`progress-graph-circle-rail`,`
 transition: stroke .3s var(--n-bezier);
 overflow: hidden;
 stroke: var(--n-rail-color);
 `)]),s(`progress-graph-line`,[r(`indicator-inside`,[s(`progress-graph-line-rail`,`
 height: 16px;
 line-height: 16px;
 border-radius: 10px;
 `,[s(`progress-graph-line-fill`,`
 height: inherit;
 border-radius: 10px;
 `),s(`progress-graph-line-indicator`,`
 background: #0000;
 white-space: nowrap;
 text-align: right;
 margin-left: 14px;
 margin-right: 14px;
 height: inherit;
 font-size: 12px;
 color: var(--n-text-color-line-inner);
 transition: color .3s var(--n-bezier);
 `)])]),r(`indicator-inside-label`,`
 height: 16px;
 display: flex;
 align-items: center;
 `,[s(`progress-graph-line-rail`,`
 flex: 1;
 transition: background-color .3s var(--n-bezier);
 `),s(`progress-graph-line-indicator`,`
 background: var(--n-fill-color);
 font-size: 12px;
 transform: translateZ(0);
 display: flex;
 vertical-align: middle;
 height: 16px;
 line-height: 16px;
 padding: 0 10px;
 border-radius: 10px;
 position: absolute;
 white-space: nowrap;
 color: var(--n-text-color-line-inner);
 transition:
 right .2s var(--n-bezier),
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `)]),s(`progress-graph-line-rail`,`
 position: relative;
 overflow: hidden;
 height: var(--n-rail-height);
 border-radius: 5px;
 background-color: var(--n-rail-color);
 transition: background-color .3s var(--n-bezier);
 `,[s(`progress-graph-line-fill`,`
 background: var(--n-fill-color);
 position: relative;
 border-radius: 5px;
 height: inherit;
 width: 100%;
 max-width: 0%;
 transition:
 background-color .3s var(--n-bezier),
 max-width .2s var(--n-bezier);
 `,[r(`processing`,[a(`&::after`,`
 content: "";
 background-image: var(--n-line-bg-processing);
 animation: progress-processing-animation 2s var(--n-bezier) infinite;
 `)])])])])])]),a(`@keyframes progress-processing-animation`,`
 0% {
 position: absolute;
 left: 0;
 top: 0;
 bottom: 0;
 right: 100%;
 opacity: 1;
 }
 66% {
 position: absolute;
 left: 0;
 top: 0;
 bottom: 0;
 right: 0;
 opacity: 0;
 }
 100% {
 position: absolute;
 left: 0;
 top: 0;
 bottom: 0;
 right: 0;
 opacity: 0;
 }
 `)]),T=t({name:`Progress`,props:Object.assign(Object.assign({},l.props),{processing:Boolean,type:{type:String,default:`line`},gapDegree:Number,gapOffsetDegree:Number,status:{type:String,default:`default`},railColor:[String,Array],railStyle:[String,Array],color:[String,Array,Object],viewBoxWidth:{type:Number,default:100},strokeWidth:{type:Number,default:7},percentage:[Number,Array],unit:{type:String,default:`%`},showIndicator:{type:Boolean,default:!0},indicatorPosition:{type:String,default:`outside`},indicatorPlacement:{type:String,default:`outside`},indicatorTextColor:String,circleGap:{type:Number,default:1},height:Number,borderRadius:[String,Number],fillBorderRadius:[String,Number],offsetDegree:Number}),setup(t){let n=e(()=>t.indicatorPlacement||t.indicatorPosition),r=e(()=>{if(t.gapDegree||t.gapDegree===0)return t.gapDegree;if(t.type===`dashboard`)return 75}),{mergedClsPrefixRef:a,inlineThemeDisabled:o}=c(t),s=l(`Progress`,`-progress`,w,_,t,a),d=e(()=>{let{status:e}=t,{common:{cubicBezierEaseInOut:n},self:{fontSize:r,fontSizeCircle:a,railColor:o,railHeight:c,iconSizeCircle:l,iconSizeLine:u,textColorCircle:d,textColorLineInner:f,textColorLineOuter:p,lineBgProcessing:m,fontWeightCircle:h,[i(`iconColor`,e)]:g,[i(`fillColor`,e)]:_}}=s.value;return{"--n-bezier":n,"--n-fill-color":_,"--n-font-size":r,"--n-font-size-circle":a,"--n-font-weight-circle":h,"--n-icon-color":g,"--n-icon-size-circle":l,"--n-icon-size-line":u,"--n-line-bg-processing":m,"--n-rail-color":o,"--n-rail-height":c,"--n-text-color-circle":d,"--n-text-color-line-inner":f,"--n-text-color-line-outer":p}}),f=o?u(`progress`,e(()=>t.status[0]),d,t):void 0;return{mergedClsPrefix:a,mergedIndicatorPlacement:n,gapDeg:r,cssVars:o?void 0:d,themeClass:f==null?void 0:f.themeClass,onRender:f==null?void 0:f.onRender}},render(){let{type:e,cssVars:t,indicatorTextColor:r,showIndicator:i,status:a,railColor:o,railStyle:s,color:c,percentage:l,viewBoxWidth:u,strokeWidth:d,mergedIndicatorPlacement:f,unit:p,borderRadius:m,fillBorderRadius:h,height:g,processing:_,circleGap:v,mergedClsPrefix:b,gapDeg:S,gapOffsetDegree:w,themeClass:T,$slots:E,onRender:D}=this;return D==null||D(),n(`div`,{class:[T,`${b}-progress`,`${b}-progress--${e}`,`${b}-progress--${a}`],style:t,"aria-valuemax":100,"aria-valuemin":0,"aria-valuenow":l,role:e===`circle`||e===`line`||e===`dashboard`?`progressbar`:`none`},e===`circle`||e===`dashboard`?n(y,{clsPrefix:b,status:a,showIndicator:i,indicatorTextColor:r,railColor:o,fillColor:c,railStyle:s,offsetDegree:this.offsetDegree,percentage:l,viewBoxWidth:u,strokeWidth:d,gapDegree:S===void 0?e===`dashboard`?75:0:S,gapOffsetDegree:w,unit:p},E):e===`line`?n(x,{clsPrefix:b,status:a,showIndicator:i,indicatorTextColor:r,railColor:o,fillColor:c,railStyle:s,percentage:l,processing:_,indicatorPlacement:f,unit:p,fillBorderRadius:h,railBorderRadius:m,height:g},E):e===`multiple-circle`?n(C,{clsPrefix:b,strokeWidth:d,railColor:o,fillColor:c,railStyle:s,viewBoxWidth:u,percentage:l,showIndicator:i,circleGap:v},E):null)}});export{T as t};