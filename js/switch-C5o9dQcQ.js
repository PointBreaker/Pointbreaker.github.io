import{_n as e,cr as t,in as n,mn as r,rr as i}from"../jse/index-index-DFxUuOiR.js";import{B as a,H as o,I as s,L as c,V as l,j as u,n as d,z as f}from"./use-theme-DYmMCFiI.js";import{i as p,t as m}from"./css-DJYWK7bq.js";import{n as h}from"./light-BeGsVN-u.js";import{t as g}from"./use-merged-state-MUEv9gbJ.js";import{n as _,t as v}from"./icon-switch.cssr-orhniUkG.js";import{o as y,r as b,s as x,t as S}from"./use-form-item-BpI6_yZJ.js";import{t as C}from"./Loading-Ct7poOYL.js";import{t as w}from"./light-DUGX4ZN7.js";var T=c(`switch`,`
 height: var(--n-height);
 min-width: var(--n-width);
 vertical-align: middle;
 user-select: none;
 -webkit-user-select: none;
 display: inline-flex;
 outline: none;
 justify-content: center;
 align-items: center;
`,[f(`children-placeholder`,`
 height: var(--n-rail-height);
 display: flex;
 flex-direction: column;
 overflow: hidden;
 pointer-events: none;
 visibility: hidden;
 `),f(`rail-placeholder`,`
 display: flex;
 flex-wrap: none;
 `),f(`button-placeholder`,`
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
 `,[v({left:`50%`,top:`50%`,originalTransform:`translateX(-50%) translateY(-50%)`})]),f(`checked, unchecked`,`
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
 `),f(`checked`,`
 right: 0;
 padding-right: calc(1.25 * var(--n-rail-height) - var(--n-offset));
 `),f(`unchecked`,`
 left: 0;
 justify-content: flex-end;
 padding-left: calc(1.25 * var(--n-rail-height) - var(--n-offset));
 `),s(`&:focus`,[f(`rail`,`
 box-shadow: var(--n-box-shadow-focus);
 `)]),a(`round`,[f(`rail`,`border-radius: calc(var(--n-rail-height) / 2);`,[f(`button`,`border-radius: calc(var(--n-button-height) / 2);`)])]),l(`disabled`,[l(`icon`,[a(`rubber-band`,[a(`pressed`,[f(`rail`,[f(`button`,`max-width: var(--n-button-width-pressed);`)])]),f(`rail`,[s(`&:active`,[f(`button`,`max-width: var(--n-button-width-pressed);`)])]),a(`active`,[a(`pressed`,[f(`rail`,[f(`button`,`left: calc(100% - var(--n-offset) - var(--n-button-width-pressed));`)])]),f(`rail`,[s(`&:active`,[f(`button`,`left: calc(100% - var(--n-offset) - var(--n-button-width-pressed));`)])])])])])]),a(`active`,[f(`rail`,[f(`button`,`left: calc(100% - var(--n-button-width) - var(--n-offset))`)])]),f(`rail`,`
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
 `,[f(`button-icon`,`
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
 `,[v()]),f(`button`,`
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
 `)]),a(`active`,[f(`rail`,`background-color: var(--n-rail-color-active);`)]),a(`loading`,[f(`rail`,`
 cursor: wait;
 `)]),a(`disabled`,[f(`rail`,`
 cursor: not-allowed;
 opacity: .5;
 `)])]),E=Object.assign(Object.assign({},d.props),{size:String,value:{type:[String,Number,Boolean],default:void 0},loading:Boolean,defaultValue:{type:[String,Number,Boolean],default:!1},disabled:{type:Boolean,default:void 0},round:{type:Boolean,default:!0},"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array],checkedValue:{type:[String,Number,Boolean],default:!0},uncheckedValue:{type:[String,Number,Boolean],default:!1},railStyle:Function,rubberBand:{type:Boolean,default:!0},spinProps:Object,onChange:[Function,Array]}),D,O=r({name:`Switch`,props:E,slots:Object,setup(e){D===void 0&&(D=typeof CSS<`u`?CSS.supports===void 0?!1:CSS.supports(`width`,`max(1px)`):!0);let{mergedClsPrefixRef:r,inlineThemeDisabled:a,mergedComponentPropsRef:s}=u(e),c=d(`Switch`,`-switch`,T,w,e,r),l=S(e,{mergedSize(t){var n,r;return e.size===void 0?t?t.mergedSize.value:((r=(n=s==null?void 0:s.value)==null?void 0:n.Switch)==null?void 0:r.size)||`medium`:e.size}}),{mergedSizeRef:f,mergedDisabledRef:_}=l,v=i(e.defaultValue),y=g(t(e,`value`),v),b=n(()=>y.value===e.checkedValue),C=i(!1),E=i(!1),O=n(()=>{let{railStyle:t}=e;if(t)return t({focused:E.value,checked:b.value})});function k(t){let{"onUpdate:value":n,onChange:r,onUpdateValue:i}=e,{nTriggerFormInput:a,nTriggerFormChange:o}=l;n&&x(n,t),i&&x(i,t),r&&x(r,t),v.value=t,a(),o()}function A(){let{nTriggerFormFocus:e}=l;e()}function j(){let{nTriggerFormBlur:e}=l;e()}function M(){e.loading||_.value||(y.value===e.checkedValue?k(e.uncheckedValue):k(e.checkedValue))}function N(){E.value=!0,A()}function P(){E.value=!1,j(),C.value=!1}function F(t){e.loading||_.value||t.key===` `&&(y.value===e.checkedValue?k(e.uncheckedValue):k(e.checkedValue),C.value=!1)}function I(t){e.loading||_.value||t.key===` `&&(t.preventDefault(),C.value=!0)}let L=n(()=>{let{value:e}=f,{self:{opacityDisabled:t,railColor:n,railColorActive:r,buttonBoxShadow:i,buttonColor:a,boxShadowFocus:s,loadingColor:l,textColor:u,iconColor:d,[o(`buttonHeight`,e)]:h,[o(`buttonWidth`,e)]:g,[o(`buttonWidthPressed`,e)]:_,[o(`railHeight`,e)]:v,[o(`railWidth`,e)]:y,[o(`railBorderRadius`,e)]:b,[o(`buttonBorderRadius`,e)]:x},common:{cubicBezierEaseInOut:S}}=c.value,C,w,T;return D?(C=`calc((${v} - ${h}) / 2)`,w=`max(${v}, ${h})`,T=`max(${y}, calc(${y} + ${h} - ${v}))`):(C=p((m(v)-m(h))/2),w=p(Math.max(m(v),m(h))),T=m(v)>m(h)?y:p(m(y)+m(h)-m(v))),{"--n-bezier":S,"--n-button-border-radius":x,"--n-button-box-shadow":i,"--n-button-color":a,"--n-button-width":g,"--n-button-width-pressed":_,"--n-button-height":h,"--n-height":w,"--n-offset":C,"--n-opacity-disabled":t,"--n-rail-border-radius":b,"--n-rail-color":n,"--n-rail-color-active":r,"--n-rail-height":v,"--n-rail-width":y,"--n-width":T,"--n-box-shadow-focus":s,"--n-loading-color":l,"--n-text-color":u,"--n-icon-color":d}}),R=a?h(`switch`,n(()=>f.value[0]),L,e):void 0;return{handleClick:M,handleBlur:P,handleFocus:N,handleKeyup:F,handleKeydown:I,mergedRailStyle:O,pressed:C,mergedClsPrefix:r,mergedValue:y,checked:b,mergedDisabled:_,cssVars:a?void 0:L,themeClass:R==null?void 0:R.themeClass,onRender:R==null?void 0:R.onRender}},render(){let{mergedClsPrefix:t,mergedDisabled:n,checked:r,mergedRailStyle:i,onRender:a,$slots:o}=this;a==null||a();let{checked:s,unchecked:c,icon:l,"checked-icon":u,"unchecked-icon":d}=o,f=!(b(l)&&b(u)&&b(d));return e(`div`,{role:`switch`,"aria-checked":r,class:[`${t}-switch`,this.themeClass,f&&`${t}-switch--icon`,r&&`${t}-switch--active`,n&&`${t}-switch--disabled`,this.round&&`${t}-switch--round`,this.loading&&`${t}-switch--loading`,this.pressed&&`${t}-switch--pressed`,this.rubberBand&&`${t}-switch--rubber-band`],tabindex:this.mergedDisabled?void 0:0,style:this.cssVars,onClick:this.handleClick,onFocus:this.handleFocus,onBlur:this.handleBlur,onKeyup:this.handleKeyup,onKeydown:this.handleKeydown},e(`div`,{class:`${t}-switch__rail`,"aria-hidden":`true`,style:i},y(s,n=>y(c,r=>n||r?e(`div`,{"aria-hidden":!0,class:`${t}-switch__children-placeholder`},e(`div`,{class:`${t}-switch__rail-placeholder`},e(`div`,{class:`${t}-switch__button-placeholder`}),n),e(`div`,{class:`${t}-switch__rail-placeholder`},e(`div`,{class:`${t}-switch__button-placeholder`}),r)):null)),e(`div`,{class:`${t}-switch__button`},y(l,n=>y(u,r=>y(d,i=>e(_,null,{default:()=>this.loading?e(C,Object.assign({key:`loading`,clsPrefix:t,strokeWidth:20},this.spinProps)):this.checked&&(r||n)?e(`div`,{class:`${t}-switch__button-icon`,key:r?`checked-icon`:`icon`},r||n):!this.checked&&(i||n)?e(`div`,{class:`${t}-switch__button-icon`,key:i?`unchecked-icon`:`icon`},i||n):null})))),y(s,n=>n&&e(`div`,{key:`checked`,class:`${t}-switch__checked`},n)),y(c,n=>n&&e(`div`,{key:`unchecked`,class:`${t}-switch__unchecked`},n)))))}});export{O as NSwitch};