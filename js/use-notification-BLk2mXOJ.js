import{Cn as e,Jt as t,Ln as n,Nn as r,On as i,Yn as a,an as o,ar as s,cn as c,rn as l,sr as u,vn as d,xn as f}from"../jse/index-index-BHFl5ucv.js";import{B as p,F as m,G as h,I as g,L as _,R as v,U as y,V as b,W as x,j as S,n as C,t as w}from"./use-theme-CyruTHxB.js";import{t as T}from"./use-rtl-OOd9Wb_S.js";import{r as E,s as D,t as O}from"./Scrollbar-CfYwE2mA.js";import{r as k}from"./css-gsm8E4xx.js";import{i as A,n as j,t as M}from"./light-SqGhou5A.js";import{t as N}from"./misc-C8nDILnr.js";import{n as P,o as F,s as I}from"./use-form-item-gM3fExEf.js";import{t as ee}from"./keep-CXGmI7FH.js";import{n as L,t as te}from"./omit-CQXmLG6F.js";import{n as R,t as z}from"./Close-CWXeQxvJ.js";import{i as B,n as V,r as H,t as ne}from"./Warning-DvByo4S7.js";var re={paddingSmall:`12px 16px 12px`,paddingMedium:`19px 24px 20px`,paddingLarge:`23px 32px 24px`,paddingHuge:`27px 40px 28px`,titleFontSizeSmall:`16px`,titleFontSizeMedium:`18px`,titleFontSizeLarge:`18px`,titleFontSizeHuge:`18px`,closeIconSize:`18px`,closeSize:`22px`};function U(e){let{primaryColor:t,borderRadius:n,lineHeight:r,fontSize:i,cardColor:a,textColor2:o,textColor1:s,dividerColor:c,fontWeightStrong:l,closeIconColor:u,closeIconColorHover:d,closeIconColorPressed:f,closeColorHover:p,closeColorPressed:m,modalColor:h,boxShadow1:g,popoverColor:_,actionColor:v}=e;return Object.assign(Object.assign({},re),{lineHeight:r,color:a,colorModal:h,colorPopover:_,colorTarget:t,colorEmbedded:v,colorEmbeddedModal:v,colorEmbeddedPopover:v,textColor:o,titleTextColor:s,borderColor:c,actionColor:v,titleFontWeight:l,closeColorHover:p,closeColorPressed:m,closeBorderRadius:n,closeIconColor:u,closeIconColorHover:d,closeIconColorPressed:f,fontSizeSmall:i,fontSizeMedium:i,fontSizeLarge:i,fontSizeHuge:i,boxShadow:g,borderRadius:n})}var W={name:`Card`,common:M,self:U},G=v(`card-content`,`
 flex: 1;
 min-width: 0;
 box-sizing: border-box;
 padding: 0 var(--n-padding-left) var(--n-padding-bottom) var(--n-padding-left);
 font-size: var(--n-font-size);
`),ie=_([v(`card`,`
 font-size: var(--n-font-size);
 line-height: var(--n-line-height);
 display: flex;
 flex-direction: column;
 width: 100%;
 box-sizing: border-box;
 position: relative;
 border-radius: var(--n-border-radius);
 background-color: var(--n-color);
 color: var(--n-text-color);
 word-break: break-word;
 transition: 
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `,[g({background:`var(--n-color-modal)`}),b(`hoverable`,[_(`&:hover`,`box-shadow: var(--n-box-shadow);`)]),b(`content-segmented`,[_(`>`,[v(`card-content`,`
 padding-top: var(--n-padding-bottom);
 `),p(`content-scrollbar`,[_(`>`,[v(`scrollbar-container`,[_(`>`,[v(`card-content`,`
 padding-top: var(--n-padding-bottom);
 `)])])])])])]),b(`content-soft-segmented`,[_(`>`,[v(`card-content`,`
 margin: 0 var(--n-padding-left);
 padding: var(--n-padding-bottom) 0;
 `),p(`content-scrollbar`,[_(`>`,[v(`scrollbar-container`,[_(`>`,[v(`card-content`,`
 margin: 0 var(--n-padding-left);
 padding: var(--n-padding-bottom) 0;
 `)])])])])])]),b(`footer-segmented`,[_(`>`,[p(`footer`,`
 padding-top: var(--n-padding-bottom);
 `)])]),b(`footer-soft-segmented`,[_(`>`,[p(`footer`,`
 padding: var(--n-padding-bottom) 0;
 margin: 0 var(--n-padding-left);
 `)])]),_(`>`,[v(`card-header`,`
 box-sizing: border-box;
 display: flex;
 align-items: center;
 font-size: var(--n-title-font-size);
 padding:
 var(--n-padding-top)
 var(--n-padding-left)
 var(--n-padding-bottom)
 var(--n-padding-left);
 `,[p(`main`,`
 font-weight: var(--n-title-font-weight);
 transition: color .3s var(--n-bezier);
 flex: 1;
 min-width: 0;
 color: var(--n-title-text-color);
 `),p(`extra`,`
 display: flex;
 align-items: center;
 font-size: var(--n-font-size);
 font-weight: 400;
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
 `),p(`close`,`
 margin: 0 0 0 8px;
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `)]),p(`action`,`
 box-sizing: border-box;
 transition:
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 background-clip: padding-box;
 background-color: var(--n-action-color);
 `),G,v(`card-content`,[_(`&:first-child`,`
 padding-top: var(--n-padding-bottom);
 `)]),p(`content-scrollbar`,`
 display: flex;
 flex-direction: column;
 `,[_(`>`,[v(`scrollbar-container`,[_(`>`,[G])])]),_(`&:first-child >`,[v(`scrollbar-container`,[_(`>`,[v(`card-content`,`
 padding-top: var(--n-padding-bottom);
 `)])])])]),p(`footer`,`
 box-sizing: border-box;
 padding: 0 var(--n-padding-left) var(--n-padding-bottom) var(--n-padding-left);
 font-size: var(--n-font-size);
 `,[_(`&:first-child`,`
 padding-top: var(--n-padding-bottom);
 `)]),p(`action`,`
 background-color: var(--n-action-color);
 padding: var(--n-padding-bottom) var(--n-padding-left);
 border-bottom-left-radius: var(--n-border-radius);
 border-bottom-right-radius: var(--n-border-radius);
 `)]),v(`card-cover`,`
 overflow: hidden;
 width: 100%;
 border-radius: var(--n-border-radius) var(--n-border-radius) 0 0;
 `,[_(`img`,`
 display: block;
 width: 100%;
 `)]),b(`bordered`,`
 border: 1px solid var(--n-border-color);
 `,[_(`&:target`,`border-color: var(--n-color-target);`)]),b(`action-segmented`,[_(`>`,[p(`action`,[_(`&:not(:first-child)`,`
 border-top: 1px solid var(--n-border-color);
 `)])])]),b(`content-segmented, content-soft-segmented`,[_(`>`,[v(`card-content`,`
 transition: border-color 0.3s var(--n-bezier);
 `,[_(`&:not(:first-child)`,`
 border-top: 1px solid var(--n-border-color);
 `)]),p(`content-scrollbar`,`
 transition: border-color 0.3s var(--n-bezier);
 `,[_(`&:not(:first-child)`,`
 border-top: 1px solid var(--n-border-color);
 `)])])]),b(`footer-segmented, footer-soft-segmented`,[_(`>`,[p(`footer`,`
 transition: border-color 0.3s var(--n-bezier);
 `,[_(`&:not(:first-child)`,`
 border-top: 1px solid var(--n-border-color);
 `)])])]),b(`embedded`,`
 background-color: var(--n-color-embedded);
 `)]),x(v(`card`,`
 background: var(--n-color-modal);
 `,[b(`embedded`,`
 background-color: var(--n-color-embedded-modal);
 `)])),h(v(`card`,`
 background: var(--n-color-popover);
 `,[b(`embedded`,`
 background-color: var(--n-color-embedded-popover);
 `)]))]),K={title:[String,Function],contentClass:String,contentStyle:[Object,String],contentScrollable:Boolean,headerClass:String,headerStyle:[Object,String],headerExtraClass:String,headerExtraStyle:[Object,String],footerClass:String,footerStyle:[Object,String],embedded:Boolean,segmented:{type:[Boolean,Object],default:!1},size:String,bordered:{type:Boolean,default:!0},closable:Boolean,hoverable:Boolean,role:String,onClose:[Function,Array],tag:{type:String,default:`div`},cover:Function,content:[String,Function],footer:Function,action:Function,headerExtra:Function,closeFocusable:Boolean},ae=L(K),oe=d({name:`Card`,props:Object.assign(Object.assign({},C.props),K),slots:Object,setup(e){let t=()=>{let{onClose:t}=e;t&&I(t)},{inlineThemeDisabled:n,mergedClsPrefixRef:r,mergedRtlRef:i,mergedComponentPropsRef:a}=S(e),o=C(`Card`,`-card`,ie,W,e,r),s=T(`Card`,i,r),l=c(()=>{var t,n;return e.size||((n=(t=a==null?void 0:a.value)==null?void 0:t.Card)==null?void 0:n.size)||`medium`}),u=c(()=>{let e=l.value,{self:{color:t,colorModal:n,colorTarget:r,textColor:i,titleTextColor:a,titleFontWeight:s,borderColor:c,actionColor:u,borderRadius:d,lineHeight:f,closeIconColor:p,closeIconColorHover:m,closeIconColorPressed:h,closeColorHover:g,closeColorPressed:_,closeBorderRadius:v,closeIconSize:b,closeSize:x,boxShadow:S,colorPopover:C,colorEmbedded:w,colorEmbeddedModal:T,colorEmbeddedPopover:E,[y(`padding`,e)]:D,[y(`fontSize`,e)]:O,[y(`titleFontSize`,e)]:A},common:{cubicBezierEaseInOut:j}}=o.value,{top:M,left:N,bottom:P}=k(D);return{"--n-bezier":j,"--n-border-radius":d,"--n-color":t,"--n-color-modal":n,"--n-color-popover":C,"--n-color-embedded":w,"--n-color-embedded-modal":T,"--n-color-embedded-popover":E,"--n-color-target":r,"--n-text-color":i,"--n-line-height":f,"--n-action-color":u,"--n-title-text-color":a,"--n-title-font-weight":s,"--n-close-icon-color":p,"--n-close-icon-color-hover":m,"--n-close-icon-color-pressed":h,"--n-close-color-hover":g,"--n-close-color-pressed":_,"--n-border-color":c,"--n-box-shadow":S,"--n-padding-top":M,"--n-padding-bottom":P,"--n-padding-left":N,"--n-font-size":O,"--n-title-font-size":A,"--n-close-size":x,"--n-close-icon-size":b,"--n-close-border-radius":v}}),d=n?j(`card`,c(()=>l.value[0]),u,e):void 0;return{rtlEnabled:s,mergedClsPrefix:r,mergedTheme:o,handleCloseClick:t,cssVars:n?void 0:u,themeClass:d==null?void 0:d.themeClass,onRender:d==null?void 0:d.onRender}},render(){let{segmented:e,bordered:t,hoverable:n,mergedClsPrefix:r,rtlEnabled:i,onRender:a,embedded:o,tag:s,$slots:c}=this;return a==null||a(),f(s,{class:[`${r}-card`,this.themeClass,o&&`${r}-card--embedded`,{[`${r}-card--rtl`]:i,[`${r}-card--content-scrollable`]:this.contentScrollable,[`${r}-card--content${typeof e!=`boolean`&&e.content===`soft`?`-soft`:``}-segmented`]:e===!0||e!==!1&&e.content,[`${r}-card--footer${typeof e!=`boolean`&&e.footer===`soft`?`-soft`:``}-segmented`]:e===!0||e!==!1&&e.footer,[`${r}-card--action-segmented`]:e===!0||e!==!1&&e.action,[`${r}-card--bordered`]:t,[`${r}-card--hoverable`]:n}],style:this.cssVars,role:this.role},F(c.cover,e=>{let t=this.cover?P([this.cover()]):e;return t&&f(`div`,{class:`${r}-card-cover`,role:`none`},t)}),F(c.header,e=>{let{title:t}=this,n=t?P(typeof t==`function`?[t()]:[t]):e;return n||this.closable?f(`div`,{class:[`${r}-card-header`,this.headerClass],style:this.headerStyle,role:`heading`},f(`div`,{class:`${r}-card-header__main`,role:`heading`},n),F(c[`header-extra`],e=>{let t=this.headerExtra?P([this.headerExtra()]):e;return t&&f(`div`,{class:[`${r}-card-header__extra`,this.headerExtraClass],style:this.headerExtraStyle},t)}),this.closable&&f(z,{clsPrefix:r,class:`${r}-card-header__close`,onClick:this.handleCloseClick,focusable:this.closeFocusable,absolute:!0})):null}),F(c.default,e=>{let{content:t}=this,n=t?P(typeof t==`function`?[t()]:[t]):e;return n?this.contentScrollable?f(O,{class:`${r}-card__content-scrollbar`,contentClass:[`${r}-card-content`,this.contentClass],contentStyle:this.contentStyle},n):f(`div`,{class:[`${r}-card-content`,this.contentClass],style:this.contentStyle,role:`none`},n):null}),F(c.footer,e=>{let t=this.footer?P([this.footer()]):e;return t&&f(`div`,{class:[`${r}-card__footer`,this.footerClass],style:this.footerStyle,role:`none`},t)}),F(c.action,e=>{let t=this.action?P([this.action()]):e;return t&&f(`div`,{class:`${r}-card__action`,role:`none`},t)}))}}),q=m(`n-message-api`),se=m(`n-message-provider`);function ce(){let t=e(q,null);return t===null&&A(`use-message`,"No outer <n-message-provider /> founded. See prerequisite in https://www.naiveui.com/en-US/os-theme/components/message for more details. If you want to use `useMessage` outside setup, please check https://www.naiveui.com/zh-CN/os-theme/components/message#Q-&-A."),t}var le={closeMargin:`16px 12px`,closeSize:`20px`,closeIconSize:`16px`,width:`365px`,padding:`16px`,titleFontSize:`16px`,metaFontSize:`12px`,descriptionFontSize:`12px`};function J(e){let{textColor2:t,successColor:n,infoColor:r,warningColor:i,errorColor:a,popoverColor:o,closeIconColor:s,closeIconColorHover:c,closeIconColorPressed:l,closeColorHover:u,closeColorPressed:d,textColor1:f,textColor3:p,borderRadius:m,fontWeightStrong:h,boxShadow2:g,lineHeight:_,fontSize:v}=e;return Object.assign(Object.assign({},le),{borderRadius:m,lineHeight:_,fontSize:v,headerFontWeight:h,iconColor:t,iconColorSuccess:n,iconColorInfo:r,iconColorWarning:i,iconColorError:a,color:o,textColor:t,closeIconColor:s,closeIconColorHover:c,closeIconColorPressed:l,closeBorderRadius:m,closeColorHover:u,closeColorPressed:d,headerTextColor:f,descriptionTextColor:p,actionTextColor:t,boxShadow:g})}var Y=w({name:`Notification`,common:M,peers:{Scrollbar:E},self:J}),X=m(`n-notification-provider`),ue=d({name:`NotificationContainer`,props:{scrollable:{type:Boolean,required:!0},placement:{type:String,required:!0}},setup(){let{mergedThemeRef:t,mergedClsPrefixRef:n,wipTransitionCountRef:r}=e(X),i=u(null);return a(()=>{var e,t;r.value>0?(e=i==null?void 0:i.value)==null||e.classList.add(`transitioning`):(t=i==null?void 0:i.value)==null||t.classList.remove(`transitioning`)}),{selfRef:i,mergedTheme:t,mergedClsPrefix:n,transitioning:r}},render(){let{$slots:e,scrollable:t,mergedClsPrefix:n,mergedTheme:r,placement:i}=this;return f(`div`,{ref:`selfRef`,class:[`${n}-notification-container`,t&&`${n}-notification-container--scrollable`,`${n}-notification-container--${i}`]},t?f(O,{theme:r.peers.Scrollbar,themeOverrides:r.peerOverrides.Scrollbar,contentStyle:{overflow:`hidden`}},e):e)}}),de={info:()=>f(H,null),success:()=>f(V,null),warning:()=>f(ne,null),error:()=>f(B,null),default:()=>null},Z={closable:{type:Boolean,default:!0},type:{type:String,default:`default`},avatar:Function,title:[String,Function],description:[String,Function],content:[String,Function],meta:[String,Function],action:[String,Function],onClose:{type:Function,required:!0},keepAliveOnHover:Boolean,onMouseenter:Function,onMouseleave:Function},fe=L(Z),pe=d({name:`Notification`,props:Z,setup(t){let{mergedClsPrefixRef:n,mergedThemeRef:r,props:i}=e(X),{inlineThemeDisabled:a,mergedRtlRef:o}=S(),s=T(`Notification`,o,n),l=c(()=>{let{type:e}=t,{self:{color:n,textColor:i,closeIconColor:a,closeIconColorHover:o,closeIconColorPressed:s,headerTextColor:c,descriptionTextColor:l,actionTextColor:u,borderRadius:d,headerFontWeight:f,boxShadow:p,lineHeight:m,fontSize:h,closeMargin:g,closeSize:_,width:v,padding:b,closeIconSize:x,closeBorderRadius:S,closeColorHover:C,closeColorPressed:w,titleFontSize:T,metaFontSize:E,descriptionFontSize:D,[y(`iconColor`,e)]:O},common:{cubicBezierEaseOut:A,cubicBezierEaseIn:j,cubicBezierEaseInOut:M}}=r.value,{left:N,right:P,top:F,bottom:I}=k(b);return{"--n-color":n,"--n-font-size":h,"--n-text-color":i,"--n-description-text-color":l,"--n-action-text-color":u,"--n-title-text-color":c,"--n-title-font-weight":f,"--n-bezier":M,"--n-bezier-ease-out":A,"--n-bezier-ease-in":j,"--n-border-radius":d,"--n-box-shadow":p,"--n-close-border-radius":S,"--n-close-color-hover":C,"--n-close-color-pressed":w,"--n-close-icon-color":a,"--n-close-icon-color-hover":o,"--n-close-icon-color-pressed":s,"--n-line-height":m,"--n-icon-color":O,"--n-close-margin":g,"--n-close-size":_,"--n-close-icon-size":x,"--n-width":v,"--n-padding-left":N,"--n-padding-right":P,"--n-padding-top":F,"--n-padding-bottom":I,"--n-title-font-size":T,"--n-meta-font-size":E,"--n-description-font-size":D}}),u=a?j(`notification`,c(()=>t.type[0]),l,i):void 0;return{mergedClsPrefix:n,showAvatar:c(()=>t.avatar||t.type!==`default`),handleCloseClick(){t.onClose()},rtlEnabled:s,cssVars:a?void 0:l,themeClass:u==null?void 0:u.themeClass,onRender:u==null?void 0:u.onRender}},render(){var e;let{mergedClsPrefix:t}=this;return(e=this.onRender)==null||e.call(this),f(`div`,{class:[`${t}-notification-wrapper`,this.themeClass],onMouseenter:this.onMouseenter,onMouseleave:this.onMouseleave,style:this.cssVars},f(`div`,{class:[`${t}-notification`,this.rtlEnabled&&`${t}-notification--rtl`,this.themeClass,{[`${t}-notification--closable`]:this.closable,[`${t}-notification--show-avatar`]:this.showAvatar}],style:this.cssVars},this.showAvatar?f(`div`,{class:`${t}-notification__avatar`},this.avatar?R(this.avatar):this.type===`default`?null:f(D,{clsPrefix:t},{default:()=>de[this.type]()})):null,this.closable?f(z,{clsPrefix:t,class:`${t}-notification__close`,onClick:this.handleCloseClick}):null,f(`div`,{ref:`bodyRef`,class:`${t}-notification-main`},this.title?f(`div`,{class:`${t}-notification-main__header`},R(this.title)):null,this.description?f(`div`,{class:`${t}-notification-main__description`},R(this.description)):null,this.content?f(`pre`,{class:`${t}-notification-main__content`},R(this.content)):null,this.meta||this.action?f(`div`,{class:`${t}-notification-main-footer`},this.meta?f(`div`,{class:`${t}-notification-main-footer__meta`},R(this.meta)):null,this.action?f(`div`,{class:`${t}-notification-main-footer__action`},R(this.action)):null):null)))}}),me=Object.assign(Object.assign({},Z),{duration:Number,onClose:Function,onLeave:Function,onAfterEnter:Function,onAfterLeave:Function,onHide:Function,onAfterShow:Function,onAfterHide:Function}),he=d({name:`NotificationEnvironment`,props:Object.assign(Object.assign({},me),{internalKey:{type:String,required:!0},onInternalAfterLeave:{type:Function,required:!0}}),setup(t){let{wipTransitionCountRef:n}=e(X),a=u(!0),o=null;function s(){a.value=!1,o&&window.clearTimeout(o)}function c(e){n.value++,i(()=>{e.style.height=`${e.offsetHeight}px`,e.style.maxHeight=`0`,e.style.transition=`none`,e.offsetHeight,e.style.transition=``,e.style.maxHeight=e.style.height})}function l(e){n.value--,e.style.height=``,e.style.maxHeight=``;let{onAfterEnter:r,onAfterShow:i}=t;r&&r(),i&&i()}function d(e){n.value++,e.style.maxHeight=`${e.offsetHeight}px`,e.style.height=`${e.offsetHeight}px`,e.offsetHeight}function f(e){let{onHide:n}=t;n&&n(),e.style.maxHeight=`0`,e.offsetHeight}function p(){n.value--;let{onAfterLeave:e,onInternalAfterLeave:r,onAfterHide:i,internalKey:a}=t;e&&e(),r(a),i&&i()}function m(){let{duration:e}=t;e&&(o=window.setTimeout(s,e))}function h(e){e.currentTarget===e.target&&o!==null&&(window.clearTimeout(o),o=null)}function g(e){e.currentTarget===e.target&&m()}function _(){let{onClose:e}=t;e?Promise.resolve(e()).then(e=>{e!==!1&&s()}):s()}return r(()=>{t.duration&&(o=window.setTimeout(s,t.duration))}),{show:a,hide:s,handleClose:_,handleAfterLeave:p,handleLeave:f,handleBeforeLeave:d,handleAfterEnter:l,handleBeforeEnter:c,handleMouseenter:h,handleMouseleave:g}},render(){return f(t,{name:`notification-transition`,appear:!0,onBeforeEnter:this.handleBeforeEnter,onAfterEnter:this.handleAfterEnter,onBeforeLeave:this.handleBeforeLeave,onLeave:this.handleLeave,onAfterLeave:this.handleAfterLeave},{default:()=>this.show?f(pe,Object.assign({},ee(this.$props,fe),{onClose:this.handleClose,onMouseenter:this.duration&&this.keepAliveOnHover?this.handleMouseenter:void 0,onMouseleave:this.duration&&this.keepAliveOnHover?this.handleMouseleave:void 0})):null})}}),ge=_([v(`notification-container`,`
 z-index: 4000;
 position: fixed;
 overflow: visible;
 display: flex;
 flex-direction: column;
 align-items: flex-end;
 `,[_(`>`,[v(`scrollbar`,`
 width: initial;
 overflow: visible;
 height: -moz-fit-content !important;
 height: fit-content !important;
 max-height: 100vh !important;
 `,[_(`>`,[v(`scrollbar-container`,`
 height: -moz-fit-content !important;
 height: fit-content !important;
 max-height: 100vh !important;
 `,[v(`scrollbar-content`,`
 padding-top: 12px;
 padding-bottom: 33px;
 `)])])])]),b(`top, top-right, top-left`,`
 top: 12px;
 `,[_(`&.transitioning >`,[v(`scrollbar`,[_(`>`,[v(`scrollbar-container`,`
 min-height: 100vh !important;
 `)])])])]),b(`bottom, bottom-right, bottom-left`,`
 bottom: 12px;
 `,[_(`>`,[v(`scrollbar`,[_(`>`,[v(`scrollbar-container`,[v(`scrollbar-content`,`
 padding-bottom: 12px;
 `)])])])]),v(`notification-wrapper`,`
 display: flex;
 align-items: flex-end;
 margin-bottom: 0;
 margin-top: 12px;
 `)]),b(`top, bottom`,`
 left: 50%;
 transform: translateX(-50%);
 `,[v(`notification-wrapper`,[_(`&.notification-transition-enter-from, &.notification-transition-leave-to`,`
 transform: scale(0.85);
 `),_(`&.notification-transition-leave-from, &.notification-transition-enter-to`,`
 transform: scale(1);
 `)])]),b(`top`,[v(`notification-wrapper`,`
 transform-origin: top center;
 `)]),b(`bottom`,[v(`notification-wrapper`,`
 transform-origin: bottom center;
 `)]),b(`top-right, bottom-right`,[v(`notification`,`
 margin-left: 28px;
 margin-right: 16px;
 `)]),b(`top-left, bottom-left`,[v(`notification`,`
 margin-left: 16px;
 margin-right: 28px;
 `)]),b(`top-right`,`
 right: 0;
 `,[Q(`top-right`)]),b(`top-left`,`
 left: 0;
 `,[Q(`top-left`)]),b(`bottom-right`,`
 right: 0;
 `,[Q(`bottom-right`)]),b(`bottom-left`,`
 left: 0;
 `,[Q(`bottom-left`)]),b(`scrollable`,[b(`top-right`,`
 top: 0;
 `),b(`top-left`,`
 top: 0;
 `),b(`bottom-right`,`
 bottom: 0;
 `),b(`bottom-left`,`
 bottom: 0;
 `)]),v(`notification-wrapper`,`
 margin-bottom: 12px;
 `,[_(`&.notification-transition-enter-from, &.notification-transition-leave-to`,`
 opacity: 0;
 margin-top: 0 !important;
 margin-bottom: 0 !important;
 `),_(`&.notification-transition-leave-from, &.notification-transition-enter-to`,`
 opacity: 1;
 `),_(`&.notification-transition-leave-active`,`
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier),
 opacity .3s var(--n-bezier),
 transform .3s var(--n-bezier-ease-in),
 max-height .3s var(--n-bezier),
 margin-top .3s linear,
 margin-bottom .3s linear,
 box-shadow .3s var(--n-bezier);
 `),_(`&.notification-transition-enter-active`,`
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier),
 opacity .3s var(--n-bezier),
 transform .3s var(--n-bezier-ease-out),
 max-height .3s var(--n-bezier),
 margin-top .3s linear,
 margin-bottom .3s linear,
 box-shadow .3s var(--n-bezier);
 `)]),v(`notification`,`
 background-color: var(--n-color);
 color: var(--n-text-color);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier),
 opacity .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 font-family: inherit;
 font-size: var(--n-font-size);
 font-weight: 400;
 position: relative;
 display: flex;
 overflow: hidden;
 flex-shrink: 0;
 padding-left: var(--n-padding-left);
 padding-right: var(--n-padding-right);
 width: var(--n-width);
 max-width: calc(100vw - 16px - 16px);
 border-radius: var(--n-border-radius);
 box-shadow: var(--n-box-shadow);
 box-sizing: border-box;
 opacity: 1;
 `,[p(`avatar`,[v(`icon`,`
 color: var(--n-icon-color);
 `),v(`base-icon`,`
 color: var(--n-icon-color);
 `)]),b(`show-avatar`,[v(`notification-main`,`
 margin-left: 40px;
 width: calc(100% - 40px); 
 `)]),b(`closable`,[v(`notification-main`,[_(`> *:first-child`,`
 padding-right: 20px;
 `)]),p(`close`,`
 position: absolute;
 top: 0;
 right: 0;
 margin: var(--n-close-margin);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `)]),p(`avatar`,`
 position: absolute;
 top: var(--n-padding-top);
 left: var(--n-padding-left);
 width: 28px;
 height: 28px;
 font-size: 28px;
 display: flex;
 align-items: center;
 justify-content: center;
 `,[v(`icon`,`transition: color .3s var(--n-bezier);`)]),v(`notification-main`,`
 padding-top: var(--n-padding-top);
 padding-bottom: var(--n-padding-bottom);
 box-sizing: border-box;
 display: flex;
 flex-direction: column;
 margin-left: 8px;
 width: calc(100% - 8px);
 `,[v(`notification-main-footer`,`
 display: flex;
 align-items: center;
 justify-content: space-between;
 margin-top: 12px;
 `,[p(`meta`,`
 font-size: var(--n-meta-font-size);
 transition: color .3s var(--n-bezier-ease-out);
 color: var(--n-description-text-color);
 `),p(`action`,`
 cursor: pointer;
 transition: color .3s var(--n-bezier-ease-out);
 color: var(--n-action-text-color);
 `)]),p(`header`,`
 font-weight: var(--n-title-font-weight);
 font-size: var(--n-title-font-size);
 transition: color .3s var(--n-bezier-ease-out);
 color: var(--n-title-text-color);
 `),p(`description`,`
 margin-top: 8px;
 font-size: var(--n-description-font-size);
 white-space: pre-wrap;
 word-wrap: break-word;
 transition: color .3s var(--n-bezier-ease-out);
 color: var(--n-description-text-color);
 `),p(`content`,`
 line-height: var(--n-line-height);
 margin: 12px 0 0 0;
 font-family: inherit;
 white-space: pre-wrap;
 word-wrap: break-word;
 transition: color .3s var(--n-bezier-ease-out);
 color: var(--n-text-color);
 `,[_(`&:first-child`,`margin: 0;`)])])])])]);function Q(e){return v(`notification-wrapper`,[_(`&.notification-transition-enter-from, &.notification-transition-leave-to`,`
 transform: translate(${e.split(`-`)[1]===`left`?`calc(-100%)`:`calc(100%)`}, 0);
 `),_(`&.notification-transition-leave-from, &.notification-transition-enter-to`,`
 transform: translate(0, 0);
 `)])}var $=m(`n-notification-api`),_e=d({name:`NotificationProvider`,props:Object.assign(Object.assign({},C.props),{containerClass:String,containerStyle:[String,Object],to:[String,Object],scrollable:{type:Boolean,default:!0},max:Number,placement:{type:String,default:`top-right`},keepAliveOnHover:Boolean}),setup(e){let{mergedClsPrefixRef:t}=S(e),r=u([]),i={},a=new Set;function o(t){let n=N(),o=()=>{a.add(n),i[n]&&i[n].hide()},c=s(Object.assign(Object.assign({},t),{key:n,destroy:o,hide:o,deactivate:o})),{max:l}=e;if(l&&r.value.length-a.size>=l){let e=!1,t=0;for(let n of r.value){if(!a.has(n.key)){i[n.key]&&(n.destroy(),e=!0);break}t++}e||r.value.splice(t,1)}return r.value.push(c),c}let c=[`info`,`success`,`warning`,`error`].map(e=>t=>o(Object.assign(Object.assign({},t),{type:e})));function l(e){a.delete(e),r.value.splice(r.value.findIndex(t=>t.key===e),1)}let d=C(`Notification`,`-notification`,ge,Y,e,t),f={create:o,info:c[0],success:c[1],warning:c[2],error:c[3],open:m,destroyAll:h},p=u(0);n($,f),n(X,{props:e,mergedClsPrefixRef:t,mergedThemeRef:d,wipTransitionCountRef:p});function m(e){return o(e)}function h(){Object.values(r.value).forEach(e=>{e.hide()})}return Object.assign({mergedClsPrefix:t,notificationList:r,notificationRefs:i,handleAfterLeave:l},f)},render(){var e,t,n;let{placement:r}=this;return f(l,null,(t=(e=this.$slots).default)==null?void 0:t.call(e),this.notificationList.length?f(o,{to:(n=this.to)==null?`body`:n},f(ue,{class:this.containerClass,style:this.containerStyle,scrollable:this.scrollable&&r!==`top`&&r!==`bottom`,placement:r},{default:()=>this.notificationList.map(e=>f(he,Object.assign({ref:t=>{let n=e.key;t===null?delete this.notificationRefs[n]:this.notificationRefs[n]=t}},te(e,[`destroy`,`hide`,`deactivate`]),{internalKey:e.key,onInternalAfterLeave:this.handleAfterLeave,keepAliveOnHover:e.keepAliveOnHover===void 0?this.keepAliveOnHover:e.keepAliveOnHover})))})):null)}});function ve(){let t=e($,null);return t===null&&A(`use-notification`,"No outer `n-notification-provider` found."),t}export{ce as a,oe as c,W as d,U as f,J as i,ae as l,_e as n,q as o,Y as r,se as s,ve as t,K as u};