import{cn as e,fr as t,sr as n,vn as r,xn as i}from"../jse/index-index-BAw-JkTf.js";import{B as a,H as o,L as s,R as c,U as l,V as u,j as d,n as f}from"./use-theme-BFEHYfe_.js";import{i as p,t as m}from"./css-J8kWNEuy.js";import{n as h}from"./light-CkO-oKDR.js";import{t as g}from"./use-merged-state-Cub8xlhi.js";import{n as _,t as v}from"./icon-switch.cssr-kQJb_mb4.js";import{o as y,r as b,s as x,t as S}from"./use-form-item-B-TFSOGS.js";import{t as C}from"./Loading-DeiSx5C-.js";import{t as w}from"./light-0PSnmhpD.js";var T=c(`switch`,`
 height: var(--n-height);
 min-width: var(--n-width);
 vertical-align: middle;
 user-select: none;
 -webkit-user-select: none;
 display: inline-flex;
 outline: none;
 justify-content: center;
 align-items: center;
`,[a(`children-placeholder`,`
 height: var(--n-rail-height);
 display: flex;
 flex-direction: column;
 overflow: hidden;
 pointer-events: none;
 visibility: hidden;
 `),a(`rail-placeholder`,`
 display: flex;
 flex-wrap: none;
 `),a(`button-placeholder`,`
 width: calc(1.75 * var(--n-rail-height));
 height: var(--n-rail-height);
 `),c(`base-loading`,`
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translateX(-50%) translateY(-50%);
 font-size: calc(var(--n-button-width) - 4px);
 color: var(--n-loading-color);
 transition: color .3s var(--n-bezier);
 `,[v({left:`50%`,top:`50%`,originalTransform:`translateX(-50%) translateY(-50%)`})]),a(`checked, unchecked`,`
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
 box-sizing: border-box;
 position: absolute;
 white-space: nowrap;
 top: 0;
 bottom: 0;
 display: flex;
 align-items: center;
 line-height: 1;
 `),a(`checked`,`
 right: 0;
 padding-right: calc(1.25 * var(--n-rail-height) - var(--n-offset));
 `),a(`unchecked`,`
 left: 0;
 justify-content: flex-end;
 padding-left: calc(1.25 * var(--n-rail-height) - var(--n-offset));
 `),s(`&:focus`,[a(`rail`,`
 box-shadow: var(--n-box-shadow-focus);
 `)]),u(`round`,[a(`rail`,`border-radius: calc(var(--n-rail-height) / 2);`,[a(`button`,`border-radius: calc(var(--n-button-height) / 2);`)])]),o(`disabled`,[o(`icon`,[u(`rubber-band`,[u(`pressed`,[a(`rail`,[a(`button`,`max-width: var(--n-button-width-pressed);`)])]),a(`rail`,[s(`&:active`,[a(`button`,`max-width: var(--n-button-width-pressed);`)])]),u(`active`,[u(`pressed`,[a(`rail`,[a(`button`,`left: calc(100% - var(--n-offset) - var(--n-button-width-pressed));`)])]),a(`rail`,[s(`&:active`,[a(`button`,`left: calc(100% - var(--n-offset) - var(--n-button-width-pressed));`)])])])])])]),u(`active`,[a(`rail`,[a(`button`,`left: calc(100% - var(--n-button-width) - var(--n-offset))`)])]),a(`rail`,`
 overflow: hidden;
 height: var(--n-rail-height);
 min-width: var(--n-rail-width);
 border-radius: var(--n-rail-border-radius);
 cursor: pointer;
 position: relative;
 transition:
 opacity .3s var(--n-bezier),
 background .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 background-color: var(--n-rail-color);
 `,[a(`button-icon`,`
 color: var(--n-icon-color);
 transition: color .3s var(--n-bezier);
 font-size: calc(var(--n-button-height) - 4px);
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 display: flex;
 justify-content: center;
 align-items: center;
 line-height: 1;
 `,[v()]),a(`button`,`
 align-items: center; 
 top: var(--n-offset);
 left: var(--n-offset);
 height: var(--n-button-height);
 width: var(--n-button-width-pressed);
 max-width: var(--n-button-width);
 border-radius: var(--n-button-border-radius);
 background-color: var(--n-button-color);
 box-shadow: var(--n-button-box-shadow);
 box-sizing: border-box;
 cursor: inherit;
 content: "";
 position: absolute;
 transition:
 background-color .3s var(--n-bezier),
 left .3s var(--n-bezier),
 opacity .3s var(--n-bezier),
 max-width .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 `)]),u(`active`,[a(`rail`,`background-color: var(--n-rail-color-active);`)]),u(`loading`,[a(`rail`,`
 cursor: wait;
 `)]),u(`disabled`,[a(`rail`,`
 cursor: not-allowed;
 opacity: .5;
 `)])]),E=Object.assign(Object.assign({},f.props),{size:String,value:{type:[String,Number,Boolean],default:void 0},loading:Boolean,defaultValue:{type:[String,Number,Boolean],default:!1},disabled:{type:Boolean,default:void 0},round:{type:Boolean,default:!0},"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array],checkedValue:{type:[String,Number,Boolean],default:!0},uncheckedValue:{type:[String,Number,Boolean],default:!1},railStyle:Function,rubberBand:{type:Boolean,default:!0},spinProps:Object,onChange:[Function,Array]}),D,O=r({name:`Switch`,props:E,slots:Object,setup(r){D===void 0&&(D=typeof CSS<`u`?CSS.supports===void 0?!1:CSS.supports(`width`,`max(1px)`):!0);let{mergedClsPrefixRef:i,inlineThemeDisabled:a,mergedComponentPropsRef:o}=d(r),s=f(`Switch`,`-switch`,T,w,r,i),c=S(r,{mergedSize(e){var t,n;return r.size===void 0?e?e.mergedSize.value:((n=(t=o==null?void 0:o.value)==null?void 0:t.Switch)==null?void 0:n.size)||`medium`:r.size}}),{mergedSizeRef:u,mergedDisabledRef:_}=c,v=n(r.defaultValue),y=g(t(r,`value`),v),b=e(()=>y.value===r.checkedValue),C=n(!1),E=n(!1),O=e(()=>{let{railStyle:e}=r;if(e)return e({focused:E.value,checked:b.value})});function k(e){let{"onUpdate:value":t,onChange:n,onUpdateValue:i}=r,{nTriggerFormInput:a,nTriggerFormChange:o}=c;t&&x(t,e),i&&x(i,e),n&&x(n,e),v.value=e,a(),o()}function A(){let{nTriggerFormFocus:e}=c;e()}function j(){let{nTriggerFormBlur:e}=c;e()}function M(){r.loading||_.value||(y.value===r.checkedValue?k(r.uncheckedValue):k(r.checkedValue))}function N(){E.value=!0,A()}function P(){E.value=!1,j(),C.value=!1}function F(e){r.loading||_.value||e.key===` `&&(y.value===r.checkedValue?k(r.uncheckedValue):k(r.checkedValue),C.value=!1)}function I(e){r.loading||_.value||e.key===` `&&(e.preventDefault(),C.value=!0)}let L=e(()=>{let{value:e}=u,{self:{opacityDisabled:t,railColor:n,railColorActive:r,buttonBoxShadow:i,buttonColor:a,boxShadowFocus:o,loadingColor:c,textColor:d,iconColor:f,[l(`buttonHeight`,e)]:h,[l(`buttonWidth`,e)]:g,[l(`buttonWidthPressed`,e)]:_,[l(`railHeight`,e)]:v,[l(`railWidth`,e)]:y,[l(`railBorderRadius`,e)]:b,[l(`buttonBorderRadius`,e)]:x},common:{cubicBezierEaseInOut:S}}=s.value,C,w,T;return D?(C=`calc((${v} - ${h}) / 2)`,w=`max(${v}, ${h})`,T=`max(${y}, calc(${y} + ${h} - ${v}))`):(C=p((m(v)-m(h))/2),w=p(Math.max(m(v),m(h))),T=m(v)>m(h)?y:p(m(y)+m(h)-m(v))),{"--n-bezier":S,"--n-button-border-radius":x,"--n-button-box-shadow":i,"--n-button-color":a,"--n-button-width":g,"--n-button-width-pressed":_,"--n-button-height":h,"--n-height":w,"--n-offset":C,"--n-opacity-disabled":t,"--n-rail-border-radius":b,"--n-rail-color":n,"--n-rail-color-active":r,"--n-rail-height":v,"--n-rail-width":y,"--n-width":T,"--n-box-shadow-focus":o,"--n-loading-color":c,"--n-text-color":d,"--n-icon-color":f}}),R=a?h(`switch`,e(()=>u.value[0]),L,r):void 0;return{handleClick:M,handleBlur:P,handleFocus:N,handleKeyup:F,handleKeydown:I,mergedRailStyle:O,pressed:C,mergedClsPrefix:i,mergedValue:y,checked:b,mergedDisabled:_,cssVars:a?void 0:L,themeClass:R==null?void 0:R.themeClass,onRender:R==null?void 0:R.onRender}},render(){let{mergedClsPrefix:e,mergedDisabled:t,checked:n,mergedRailStyle:r,onRender:a,$slots:o}=this;a==null||a();let{checked:s,unchecked:c,icon:l,"checked-icon":u,"unchecked-icon":d}=o,f=!(b(l)&&b(u)&&b(d));return i(`div`,{role:`switch`,"aria-checked":n,class:[`${e}-switch`,this.themeClass,f&&`${e}-switch--icon`,n&&`${e}-switch--active`,t&&`${e}-switch--disabled`,this.round&&`${e}-switch--round`,this.loading&&`${e}-switch--loading`,this.pressed&&`${e}-switch--pressed`,this.rubberBand&&`${e}-switch--rubber-band`],tabindex:this.mergedDisabled?void 0:0,style:this.cssVars,onClick:this.handleClick,onFocus:this.handleFocus,onBlur:this.handleBlur,onKeyup:this.handleKeyup,onKeydown:this.handleKeydown},i(`div`,{class:`${e}-switch__rail`,"aria-hidden":`true`,style:r},y(s,t=>y(c,n=>t||n?i(`div`,{"aria-hidden":!0,class:`${e}-switch__children-placeholder`},i(`div`,{class:`${e}-switch__rail-placeholder`},i(`div`,{class:`${e}-switch__button-placeholder`}),t),i(`div`,{class:`${e}-switch__rail-placeholder`},i(`div`,{class:`${e}-switch__button-placeholder`}),n)):null)),i(`div`,{class:`${e}-switch__button`},y(l,t=>y(u,n=>y(d,r=>i(_,null,{default:()=>this.loading?i(C,Object.assign({key:`loading`,clsPrefix:e,strokeWidth:20},this.spinProps)):this.checked&&(n||t)?i(`div`,{class:`${e}-switch__button-icon`,key:n?`checked-icon`:`icon`},n||t):!this.checked&&(r||t)?i(`div`,{class:`${e}-switch__button-icon`,key:r?`unchecked-icon`:`icon`},r||t):null})))),y(s,t=>t&&i(`div`,{key:`checked`,class:`${e}-switch__checked`},t)),y(c,t=>t&&i(`div`,{key:`unchecked`,class:`${e}-switch__unchecked`},t)))))}});export{O as NSwitch};