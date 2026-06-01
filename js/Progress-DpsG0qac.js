import{_n as e,in as t,mn as n}from"../jse/index-index-CJSqDDBD.js";import{B as r,H as i,I as a,K as o,L as s,j as c,n as l}from"./use-theme-Be6GbOd5.js";import{n as u}from"./light-Cwqa8HDn.js";import{t as d}from"./format-length-CrZh-0v9.js";import{n as f}from"./replaceable-CWnZtkWy.js";import{a as p,i as m,o as h,r as g,t as _}from"./light-D1lkOMWA.js";var v={success:e(m,null),error:e(h,null),warning:e(g,null),info:e(p,null)},y=n({name:`ProgressCircle`,props:{clsPrefix:{type:String,required:!0},status:{type:String,required:!0},strokeWidth:{type:Number,required:!0},fillColor:[String,Object],railColor:String,railStyle:[String,Object],percentage:{type:Number,default:0},offsetDegree:{type:Number,default:0},showIndicator:{type:Boolean,required:!0},indicatorTextColor:String,unit:String,viewBoxWidth:{type:Number,required:!0},gapDegree:{type:Number,required:!0},gapOffsetDegree:{type:Number,default:0}},setup(n,{slots:r}){let i=t(()=>{let e=`gradient`,{fillColor:t}=n;return typeof t==`object`?`${e}-${o(JSON.stringify(t))}`:e});function a(e,t,r,a){let{gapDegree:o,viewBoxWidth:s,strokeWidth:c}=n,l=50+c/2,u=`M ${l},${l} m 0,50
      a 50,50 0 1 1 0,-100
      a 50,50 0 1 1 0,100`,d=Math.PI*2*50;return{pathString:u,pathStyle:{stroke:a===`rail`?r:typeof n.fillColor==`object`?`url(#${i.value})`:r,strokeDasharray:`${Math.min(e,100)/100*(d-o)}px ${s*8}px`,strokeDashoffset:`-${o/2}px`,transformOrigin:t?`center`:void 0,transform:t?`rotate(${t}deg)`:void 0}}}let s=()=>{let t=typeof n.fillColor==`object`,r=t?n.fillColor.stops[0]:``,a=t?n.fillColor.stops[1]:``;return t&&e(`defs`,null,e(`linearGradient`,{id:i.value,x1:`0%`,y1:`100%`,x2:`100%`,y2:`0%`},e(`stop`,{offset:`0%`,"stop-color":r}),e(`stop`,{offset:`100%`,"stop-color":a})))};return()=>{let{fillColor:t,railColor:i,strokeWidth:o,offsetDegree:c,status:l,percentage:u,showIndicator:d,indicatorTextColor:p,unit:m,gapOffsetDegree:h,clsPrefix:g}=n,{pathString:_,pathStyle:y}=a(100,0,i,`rail`),{pathString:b,pathStyle:x}=a(u,c,t,`fill`),S=100+o;return e(`div`,{class:`${g}-progress-content`,role:`none`},e(`div`,{class:`${g}-progress-graph`,"aria-hidden":!0},e(`div`,{class:`${g}-progress-graph-circle`,style:{transform:h?`rotate(${h}deg)`:void 0}},e(`svg`,{viewBox:`0 0 ${S} ${S}`},s(),e(`g`,null,e(`path`,{class:`${g}-progress-graph-circle-rail`,d:_,"stroke-width":o,"stroke-linecap":`round`,fill:`none`,style:y})),e(`g`,null,e(`path`,{class:[`${g}-progress-graph-circle-fill`,u===0&&`${g}-progress-graph-circle-fill--empty`],d:b,"stroke-width":o,"stroke-linecap":`round`,fill:`none`,style:x}))))),d?e(`div`,null,r.default?e(`div`,{class:`${g}-progress-custom-content`,role:`none`},r.default()):l===`default`?e(`div`,{class:`${g}-progress-text`,style:{color:p},role:`none`},e(`span`,{class:`${g}-progress-text__percentage`},u),e(`span`,{class:`${g}-progress-text__unit`},m)):e(`div`,{class:`${g}-progress-icon`,"aria-hidden":!0},e(f,{clsPrefix:g},{default:()=>v[l]}))):null)}}}),b={success:e(m,null),error:e(h,null),warning:e(g,null),info:e(p,null)},x=n({name:`ProgressLine`,props:{clsPrefix:{type:String,required:!0},percentage:{type:Number,default:0},railColor:String,railStyle:[String,Object],fillColor:[String,Object],status:{type:String,required:!0},indicatorPlacement:{type:String,required:!0},indicatorTextColor:String,unit:{type:String,default:`%`},processing:{type:Boolean,required:!0},showIndicator:{type:Boolean,required:!0},height:[String,Number],railBorderRadius:[String,Number],fillBorderRadius:[String,Number]},setup(n,{slots:r}){let i=t(()=>d(n.height)),a=t(()=>{var e,t;return typeof n.fillColor==`object`?`linear-gradient(to right, ${(e=n.fillColor)==null?void 0:e.stops[0]} , ${(t=n.fillColor)==null?void 0:t.stops[1]})`:n.fillColor}),o=t(()=>n.railBorderRadius===void 0?n.height===void 0?``:d(n.height,{c:.5}):d(n.railBorderRadius)),s=t(()=>n.fillBorderRadius===void 0?n.railBorderRadius===void 0?n.height===void 0?``:d(n.height,{c:.5}):d(n.railBorderRadius):d(n.fillBorderRadius));return()=>{let{indicatorPlacement:t,railColor:c,railStyle:l,percentage:u,unit:d,indicatorTextColor:p,status:m,showIndicator:h,processing:g,clsPrefix:_}=n;return e(`div`,{class:`${_}-progress-content`,role:`none`},e(`div`,{class:`${_}-progress-graph`,"aria-hidden":!0},e(`div`,{class:[`${_}-progress-graph-line`,{[`${_}-progress-graph-line--indicator-${t}`]:!0}]},e(`div`,{class:`${_}-progress-graph-line-rail`,style:[{backgroundColor:c,height:i.value,borderRadius:o.value},l]},e(`div`,{class:[`${_}-progress-graph-line-fill`,g&&`${_}-progress-graph-line-fill--processing`],style:{maxWidth:`${n.percentage}%`,background:a.value,height:i.value,lineHeight:i.value,borderRadius:s.value}},t===`inside`?e(`div`,{class:`${_}-progress-graph-line-indicator`,style:{color:p}},r.default?r.default():`${u}${d}`):null)))),h&&t===`outside`?e(`div`,null,r.default?e(`div`,{class:`${_}-progress-custom-content`,style:{color:p},role:`none`},r.default()):m===`default`?e(`div`,{role:`none`,class:`${_}-progress-icon ${_}-progress-icon--as-text`,style:{color:p}},u,d):e(`div`,{class:`${_}-progress-icon`,"aria-hidden":!0},e(f,{clsPrefix:_},{default:()=>b[m]}))):null)}}});function S(e,t,n=100){return`m ${n/2} ${n/2-e} a ${e} ${e} 0 1 1 0 ${2*e} a ${e} ${e} 0 1 1 0 -${2*e}`}var C=n({name:`ProgressMultipleCircle`,props:{clsPrefix:{type:String,required:!0},viewBoxWidth:{type:Number,required:!0},percentage:{type:Array,default:[0]},strokeWidth:{type:Number,required:!0},circleGap:{type:Number,required:!0},showIndicator:{type:Boolean,required:!0},fillColor:{type:Array,default:()=>[]},railColor:{type:Array,default:()=>[]},railStyle:{type:Array,default:()=>[]}},setup(n,{slots:r}){let i=t(()=>n.percentage.map((e,t)=>`${Math.PI*e/100*(n.viewBoxWidth/2-n.strokeWidth/2*(1+2*t)-n.circleGap*t)*2}, ${n.viewBoxWidth*8}`)),a=(t,r)=>{let i=n.fillColor[r],a=typeof i==`object`?i.stops[0]:``,o=typeof i==`object`?i.stops[1]:``;return typeof n.fillColor[r]==`object`&&e(`linearGradient`,{id:`gradient-${r}`,x1:`100%`,y1:`0%`,x2:`0%`,y2:`100%`},e(`stop`,{offset:`0%`,"stop-color":a}),e(`stop`,{offset:`100%`,"stop-color":o}))};return()=>{let{viewBoxWidth:t,strokeWidth:o,circleGap:s,showIndicator:c,fillColor:l,railColor:u,railStyle:d,percentage:f,clsPrefix:p}=n;return e(`div`,{class:`${p}-progress-content`,role:`none`},e(`div`,{class:`${p}-progress-graph`,"aria-hidden":!0},e(`div`,{class:`${p}-progress-graph-circle`},e(`svg`,{viewBox:`0 0 ${t} ${t}`},e(`defs`,null,f.map((e,t)=>a(e,t))),f.map((n,r)=>e(`g`,{key:r},e(`path`,{class:`${p}-progress-graph-circle-rail`,d:S(t/2-o/2*(1+2*r)-s*r,o,t),"stroke-width":o,"stroke-linecap":`round`,fill:`none`,style:[{strokeDashoffset:0,stroke:u[r]},d[r]]}),e(`path`,{class:[`${p}-progress-graph-circle-fill`,n===0&&`${p}-progress-graph-circle-fill--empty`],d:S(t/2-o/2*(1+2*r)-s*r,o,t),"stroke-width":o,"stroke-linecap":`round`,fill:`none`,style:{strokeDasharray:i.value[r],strokeDashoffset:0,stroke:typeof l[r]==`object`?`url(#gradient-${r})`:l[r]}})))))),c&&r.default?e(`div`,null,e(`div`,{class:`${p}-progress-text`},r.default())):null)}}}),w=a([s(`progress`,{display:`inline-block`},[s(`progress-icon`,`
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
 `)]),T=n({name:`Progress`,props:Object.assign(Object.assign({},l.props),{processing:Boolean,type:{type:String,default:`line`},gapDegree:Number,gapOffsetDegree:Number,status:{type:String,default:`default`},railColor:[String,Array],railStyle:[String,Array],color:[String,Array,Object],viewBoxWidth:{type:Number,default:100},strokeWidth:{type:Number,default:7},percentage:[Number,Array],unit:{type:String,default:`%`},showIndicator:{type:Boolean,default:!0},indicatorPosition:{type:String,default:`outside`},indicatorPlacement:{type:String,default:`outside`},indicatorTextColor:String,circleGap:{type:Number,default:1},height:Number,borderRadius:[String,Number],fillBorderRadius:[String,Number],offsetDegree:Number}),setup(e){let n=t(()=>e.indicatorPlacement||e.indicatorPosition),r=t(()=>{if(e.gapDegree||e.gapDegree===0)return e.gapDegree;if(e.type===`dashboard`)return 75}),{mergedClsPrefixRef:a,inlineThemeDisabled:o}=c(e),s=l(`Progress`,`-progress`,w,_,e,a),d=t(()=>{let{status:t}=e,{common:{cubicBezierEaseInOut:n},self:{fontSize:r,fontSizeCircle:a,railColor:o,railHeight:c,iconSizeCircle:l,iconSizeLine:u,textColorCircle:d,textColorLineInner:f,textColorLineOuter:p,lineBgProcessing:m,fontWeightCircle:h,[i(`iconColor`,t)]:g,[i(`fillColor`,t)]:_}}=s.value;return{"--n-bezier":n,"--n-fill-color":_,"--n-font-size":r,"--n-font-size-circle":a,"--n-font-weight-circle":h,"--n-icon-color":g,"--n-icon-size-circle":l,"--n-icon-size-line":u,"--n-line-bg-processing":m,"--n-rail-color":o,"--n-rail-height":c,"--n-text-color-circle":d,"--n-text-color-line-inner":f,"--n-text-color-line-outer":p}}),f=o?u(`progress`,t(()=>e.status[0]),d,e):void 0;return{mergedClsPrefix:a,mergedIndicatorPlacement:n,gapDeg:r,cssVars:o?void 0:d,themeClass:f==null?void 0:f.themeClass,onRender:f==null?void 0:f.onRender}},render(){let{type:t,cssVars:n,indicatorTextColor:r,showIndicator:i,status:a,railColor:o,railStyle:s,color:c,percentage:l,viewBoxWidth:u,strokeWidth:d,mergedIndicatorPlacement:f,unit:p,borderRadius:m,fillBorderRadius:h,height:g,processing:_,circleGap:v,mergedClsPrefix:b,gapDeg:S,gapOffsetDegree:w,themeClass:T,$slots:E,onRender:D}=this;return D==null||D(),e(`div`,{class:[T,`${b}-progress`,`${b}-progress--${t}`,`${b}-progress--${a}`],style:n,"aria-valuemax":100,"aria-valuemin":0,"aria-valuenow":l,role:t===`circle`||t===`line`||t===`dashboard`?`progressbar`:`none`},t===`circle`||t===`dashboard`?e(y,{clsPrefix:b,status:a,showIndicator:i,indicatorTextColor:r,railColor:o,fillColor:c,railStyle:s,offsetDegree:this.offsetDegree,percentage:l,viewBoxWidth:u,strokeWidth:d,gapDegree:S===void 0?t===`dashboard`?75:0:S,gapOffsetDegree:w,unit:p},E):t===`line`?e(x,{clsPrefix:b,status:a,showIndicator:i,indicatorTextColor:r,railColor:o,fillColor:c,railStyle:s,percentage:l,processing:_,indicatorPlacement:f,unit:p,fillBorderRadius:h,railBorderRadius:m,height:g},E):t===`multiple-circle`?e(C,{clsPrefix:b,strokeWidth:d,railColor:o,fillColor:c,railStyle:s,viewBoxWidth:u,percentage:l,showIndicator:i,circleGap:v},E):null)}});export{T as t};