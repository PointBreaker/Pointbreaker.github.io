import{Jn as e,Ln as t,Nn as n,On as r,Yn as i,cn as a,fr as o,jn as s,rn as c,sr as l,vn as u,xn as d,zn as f}from"../jse/index-index-Cl1C_WCY.js";import{B as p,H as m,I as h,L as g,N as _,P as v,V as y,j as b,n as x,z as S}from"./use-theme-Ci7blqdd.js";import{t as C}from"./use-rtl-CLDqHb9p.js";import{n as w,r as T}from"./Follower-DDX742nS.js";import{d as E,p as D,s as O}from"./Scrollbar-ByqJHQ9h.js";import{r as ee}from"./css-DRwjkmbb.js";import{n as k}from"./light-DdCbxRQ1.js";import{t as A}from"./Popover-BUawPS-t.js";import{t as j}from"./color-to-class-yln-7uuY.js";import{o as M,s as N}from"./use-form-item-CBY5PTF0.js";import{a as P,c as F,r as te,s as I,t as ne}from"./light-DEliVcUA.js";import{t as L}from"./use-locale-DRJI-Ovg.js";import{t as re}from"./Suffix-D24jH_HB.js";var R=`v-hidden`,ie=w(`[v-hidden]`,{display:`none!important`}),z=u({name:`Overflow`,props:{getCounter:Function,getTail:Function,updateCounter:Function,onUpdateCount:Function,onUpdateOverflow:Function},setup(e,{slots:t}){let r=l(null),i=l(null);function a(n){let{value:a}=r,{getCounter:o,getTail:s}=e,c;if(c=o===void 0?i.value:o(),!a||!c)return;c.hasAttribute(R)&&c.removeAttribute(R);let{children:l}=a;if(n.showAllItemsBeforeCalculate)for(let e of l)e.hasAttribute(R)&&e.removeAttribute(R);let u=a.offsetWidth,d=[],f=t.tail?s==null?void 0:s():null,p=f?f.offsetWidth:0,m=!1,h=a.children.length-+!!t.tail;for(let t=0;t<h-1;++t){if(t<0)continue;let n=l[t];if(m){n.hasAttribute(R)||n.setAttribute(R,``);continue}else n.hasAttribute(R)&&n.removeAttribute(R);let r=n.offsetWidth;if(p+=r,d[t]=r,p>u){let{updateCounter:n}=e;for(let r=t;r>=0;--r){let i=h-1-r;n===void 0?c.textContent=`${i}`:n(i);let a=c.offsetWidth;if(p-=d[r],p+a<=u||r===0){m=!0,t=r-1,f&&(t===-1?(f.style.maxWidth=`${u-a}px`,f.style.boxSizing=`border-box`):f.style.maxWidth=``);let{onUpdateCount:n}=e;n&&n(i);break}}}}let{onUpdateOverflow:g}=e;m?g!==void 0&&g(!0):(g!==void 0&&g(!1),c.setAttribute(R,``))}let o=_();return ie.mount({id:`vueuc/overflow`,head:!0,anchorMetaName:T,ssr:o}),n(()=>a({showAllItemsBeforeCalculate:!1})),{selfRef:r,counterRef:i,sync:a}},render(){let{$slots:e}=this;return r(()=>this.sync({showAllItemsBeforeCalculate:!1})),d(`div`,{class:`v-overflow`,ref:`selfRef`},[f(e,`default`),e.counter?e.counter():d(`span`,{style:{display:`inline-block`},ref:`counterRef`}),e.tail?e.tail():null])}});function ae(t,r){r&&(n(()=>{let{value:e}=t;e&&D.registerHandler(e,r)}),e(t,(e,t)=>{t&&D.unregisterHandler(t)},{deep:!1}),s(()=>{let{value:e}=t;e&&D.unregisterHandler(e)}))}function B(e){switch(typeof e){case`string`:return e||void 0;case`number`:return String(e);default:return}}var oe=u({name:`Empty`,render(){return d(`svg`,{viewBox:`0 0 28 28`,fill:`none`,xmlns:`http://www.w3.org/2000/svg`},d(`path`,{d:`M26 7.5C26 11.0899 23.0899 14 19.5 14C15.9101 14 13 11.0899 13 7.5C13 3.91015 15.9101 1 19.5 1C23.0899 1 26 3.91015 26 7.5ZM16.8536 4.14645C16.6583 3.95118 16.3417 3.95118 16.1464 4.14645C15.9512 4.34171 15.9512 4.65829 16.1464 4.85355L18.7929 7.5L16.1464 10.1464C15.9512 10.3417 15.9512 10.6583 16.1464 10.8536C16.3417 11.0488 16.6583 11.0488 16.8536 10.8536L19.5 8.20711L22.1464 10.8536C22.3417 11.0488 22.6583 11.0488 22.8536 10.8536C23.0488 10.6583 23.0488 10.3417 22.8536 10.1464L20.2071 7.5L22.8536 4.85355C23.0488 4.65829 23.0488 4.34171 22.8536 4.14645C22.6583 3.95118 22.3417 3.95118 22.1464 4.14645L19.5 6.79289L16.8536 4.14645Z`,fill:`currentColor`}),d(`path`,{d:`M25 22.75V12.5991C24.5572 13.0765 24.053 13.4961 23.5 13.8454V16H17.5L17.3982 16.0068C17.0322 16.0565 16.75 16.3703 16.75 16.75C16.75 18.2688 15.5188 19.5 14 19.5C12.4812 19.5 11.25 18.2688 11.25 16.75L11.2432 16.6482C11.1935 16.2822 10.8797 16 10.5 16H4.5V7.25C4.5 6.2835 5.2835 5.5 6.25 5.5H12.2696C12.4146 4.97463 12.6153 4.47237 12.865 4H6.25C4.45507 4 3 5.45507 3 7.25V22.75C3 24.5449 4.45507 26 6.25 26H21.75C23.5449 26 25 24.5449 25 22.75ZM4.5 22.75V17.5H9.81597L9.85751 17.7041C10.2905 19.5919 11.9808 21 14 21L14.215 20.9947C16.2095 20.8953 17.842 19.4209 18.184 17.5H23.5V22.75C23.5 23.7165 22.7165 24.5 21.75 24.5H6.25C5.2835 24.5 4.5 23.7165 4.5 22.75Z`,fill:`currentColor`}))}});function V(e){return Array.isArray(e)?e:[e]}var H={STOP:`STOP`};function U(e,t){let n=t(e);e.children!==void 0&&n!==H.STOP&&e.children.forEach(e=>U(e,t))}function W(e,t={}){let{preserveGroup:n=!1}=t,r=[],i=n?e=>{e.isLeaf||(r.push(e.key),a(e.children))}:e=>{e.isLeaf||(e.isGroup||r.push(e.key),a(e.children))};function a(e){e.forEach(i)}return a(e),r}function G(e,t){let{isLeaf:n}=e;return n===void 0?!t(e):n}function K(e){return e.children}function se(e){return e.key}function q(){return!1}function ce(e,t){let{isLeaf:n}=e;return!(n===!1&&!Array.isArray(t(e)))}function le(e){return e.disabled===!0}function ue(e,t){return e.isLeaf===!1&&!Array.isArray(t(e))}function J(e){var t;return e==null?[]:Array.isArray(e)?e:(t=e.checkedKeys)==null?[]:t}function Y(e){var t;return e==null||Array.isArray(e)||(t=e.indeterminateKeys)==null?[]:t}function de(e,t){let n=new Set(e);return t.forEach(e=>{n.has(e)||n.add(e)}),Array.from(n)}function fe(e,t){let n=new Set(e);return t.forEach(e=>{n.has(e)&&n.delete(e)}),Array.from(n)}function pe(e){return(e==null?void 0:e.type)===`group`}function me(e){let t=new Map;return e.forEach((e,n)=>{t.set(e.key,n)}),e=>{var n;return(n=t.get(e))==null?null:n}}var he=class extends Error{constructor(){super(),this.message=`SubtreeNotLoadedError: checking a subtree whose required nodes are not fully loaded.`}};function ge(e,t,n,r){return Q(t.concat(e),n,r,!1)}function _e(e,t){let n=new Set;return e.forEach(e=>{let r=t.treeNodeMap.get(e);if(r!==void 0){let e=r.parent;for(;e!==null&&!(e.disabled||n.has(e.key));)n.add(e.key),e=e.parent}}),n}function X(e,t,n,r){let i=Q(t,n,r,!1),a=Q(e,n,r,!0),o=_e(e,n),s=[];return i.forEach(e=>{(a.has(e)||o.has(e))&&s.push(e)}),s.forEach(e=>i.delete(e)),i}function Z(e,t){let{checkedKeys:n,keysToCheck:r,keysToUncheck:i,indeterminateKeys:a,cascade:o,leafOnly:s,checkStrategy:c,allowNotLoaded:l}=e;if(!o)return r===void 0?i===void 0?{checkedKeys:Array.from(n),indeterminateKeys:Array.from(a)}:{checkedKeys:fe(n,i),indeterminateKeys:Array.from(a)}:{checkedKeys:de(n,r),indeterminateKeys:Array.from(a)};let{levelTreeNodeMap:u}=t,d;d=i===void 0?r===void 0?Q(n,t,l,!1):ge(r,n,t,l):X(i,n,t,l);let f=c===`parent`,p=c===`child`||s,m=d,h=new Set,g=Math.max.apply(null,Array.from(u.keys()));for(let e=g;e>=0;--e){let t=e===0,n=u.get(e);for(let e of n){if(e.isLeaf)continue;let{key:n,shallowLoaded:r}=e;if(p&&r&&e.children.forEach(e=>{!e.disabled&&!e.isLeaf&&e.shallowLoaded&&m.has(e.key)&&m.delete(e.key)}),e.disabled||!r)continue;let i=!0,a=!1,o=!0;for(let t of e.children){let e=t.key;if(!t.disabled){if(o&&(o=!1),m.has(e))a=!0;else if(h.has(e)){a=!0,i=!1;break}else if(i=!1,a)break}}i&&!o?(f&&e.children.forEach(e=>{!e.disabled&&m.has(e.key)&&m.delete(e.key)}),m.add(n)):a&&h.add(n),t&&p&&m.has(n)&&m.delete(n)}}return{checkedKeys:Array.from(m),indeterminateKeys:Array.from(h)}}function Q(e,t,n,r){let{treeNodeMap:i,getChildren:a}=t,o=new Set,s=new Set(e);return e.forEach(e=>{let t=i.get(e);t!==void 0&&U(t,e=>{if(e.disabled)return H.STOP;let{key:t}=e;if(!o.has(t)&&(o.add(t),s.add(t),ue(e.rawNode,a))){if(r)return H.STOP;if(!n)throw new he}})}),s}function ve(e,{includeGroup:t=!1,includeSelf:n=!0},r){var i;let a=r.treeNodeMap,o=e==null||(i=a.get(e))==null?null:i,s={keyPath:[],treeNodePath:[],treeNode:o};if(o!=null&&o.ignored)return s.treeNode=null,s;for(;o;)!o.ignored&&(t||!o.isGroup)&&s.treeNodePath.push(o),o=o.parent;return s.treeNodePath.reverse(),n||s.treeNodePath.pop(),s.keyPath=s.treeNodePath.map(e=>e.key),s}function ye(e){if(e.length===0)return null;let t=e[0];return t.isGroup||t.ignored||t.disabled?t.getNext():t}function be(e,t){let n=e.siblings,r=n.length,{index:i}=e;return t?n[(i+1)%r]:i===n.length-1?null:n[i+1]}function xe(e,t,{loop:n=!1,includeDisabled:r=!1}={}){let i=t===`prev`?$:be,a={reverse:t===`prev`},o=!1,s=null;function c(t){if(t!==null){if(t===e){if(!o)o=!0;else if(!e.disabled&&!e.isGroup){s=e;return}}else if((!t.disabled||r)&&!t.ignored&&!t.isGroup){s=t;return}if(t.isGroup){let e=Ce(t,a);e===null?c(i(t,n)):s=e}else{let e=i(t,!1);if(e!==null)c(e);else{let e=Se(t);e!=null&&e.isGroup?c(i(e,n)):n&&c(i(t,!0))}}}}return c(e),s}function $(e,t){let n=e.siblings,r=n.length,{index:i}=e;return t?n[(i-1+r)%r]:i===0?null:n[i-1]}function Se(e){return e.parent}function Ce(e,t={}){let{reverse:n=!1}=t,{children:r}=e;if(r){let{length:e}=r,i=n?e-1:0,a=n?-1:e,o=n?-1:1;for(let e=i;e!==a;e+=o){let n=r[e];if(!n.disabled&&!n.ignored)if(n.isGroup){let e=Ce(n,t);if(e!==null)return e}else return n}}return null}var we={getChild(){return this.ignored?null:Ce(this)},getParent(){let{parent:e}=this;return e!=null&&e.isGroup?e.getParent():e},getNext(e={}){return xe(this,`next`,e)},getPrev(e={}){return xe(this,`prev`,e)}};function Te(e,t){let n=t?new Set(t):void 0,r=[];function i(e){e.forEach(e=>{r.push(e),!(e.isLeaf||!e.children||e.ignored)&&(e.isGroup||n===void 0||n.has(e.key))&&i(e.children)})}return i(e),r}function Ee(e,t){let n=e.key;for(;t;){if(t.key===n)return!0;t=t.parent}return!1}function De(e,t,n,r,i,a=null,o=0){let s=[];return e.forEach((c,l)=>{var u;let d=Object.create(r);if(d.rawNode=c,d.siblings=s,d.level=o,d.index=l,d.isFirstChild=l===0,d.isLastChild=l+1===e.length,d.parent=a,!d.ignored){let e=i(c);Array.isArray(e)&&(d.children=De(e,t,n,r,i,d,o+1))}s.push(d),t.set(d.key,d),n.has(o)||n.set(o,[]),(u=n.get(o))==null||u.push(d)}),s}function Oe(e,t={}){var n;let r=new Map,i=new Map,{getDisabled:a=le,getIgnored:o=q,getIsGroup:s=pe,getKey:c=se}=t,l=(n=t.getChildren)==null?K:n,u=t.ignoreEmptyChildren?e=>{let t=l(e);return Array.isArray(t)?t.length?t:null:t}:l,d=De(e,r,i,Object.assign({get key(){return c(this.rawNode)},get disabled(){return a(this.rawNode)},get isGroup(){return s(this.rawNode)},get isLeaf(){return G(this.rawNode,u)},get shallowLoaded(){return ce(this.rawNode,u)},get ignored(){return o(this.rawNode)},contains(e){return Ee(this,e)}},we),u);function f(e){if(e==null)return null;let t=r.get(e);return t&&!t.isGroup&&!t.ignored?t:null}function p(e){if(e==null)return null;let t=r.get(e);return t&&!t.ignored?t:null}function m(e,t){let n=p(e);return n?n.getPrev(t):null}function h(e,t){let n=p(e);return n?n.getNext(t):null}function g(e){let t=p(e);return t?t.getParent():null}function _(e){let t=p(e);return t?t.getChild():null}let v={treeNodes:d,treeNodeMap:r,levelTreeNodeMap:i,maxLevel:Math.max(...i.keys()),getChildren:u,getFlattenedNodes(e){return Te(d,e)},getNode:f,getPrev:m,getNext:h,getParent:g,getChild:_,getFirstAvailableNode(){return ye(d)},getPath(e,t={}){return ve(e,t,v)},getCheckedKeys(e,t={}){let{cascade:n=!0,leafOnly:r=!1,checkStrategy:i=`all`,allowNotLoaded:a=!1}=t;return Z({checkedKeys:J(e),indeterminateKeys:Y(e),cascade:n,leafOnly:r,checkStrategy:i,allowNotLoaded:a},v)},check(e,t,n={}){let{cascade:r=!0,leafOnly:i=!1,checkStrategy:a=`all`,allowNotLoaded:o=!1}=n;return Z({checkedKeys:J(t),indeterminateKeys:Y(t),keysToCheck:e==null?[]:V(e),cascade:r,leafOnly:i,checkStrategy:a,allowNotLoaded:o},v)},uncheck(e,t,n={}){let{cascade:r=!0,leafOnly:i=!1,checkStrategy:a=`all`,allowNotLoaded:o=!1}=n;return Z({checkedKeys:J(t),indeterminateKeys:Y(t),keysToUncheck:e==null?[]:V(e),cascade:r,leafOnly:i,checkStrategy:a,allowNotLoaded:o},v)},getNonLeafKeys(e={}){return W(d,e)}};return v}var ke=g(`empty`,`
 display: flex;
 flex-direction: column;
 align-items: center;
 font-size: var(--n-font-size);
`,[S(`icon`,`
 width: var(--n-icon-size);
 height: var(--n-icon-size);
 font-size: var(--n-icon-size);
 line-height: var(--n-icon-size);
 color: var(--n-icon-color);
 transition:
 color .3s var(--n-bezier);
 `,[h(`+`,[S(`description`,`
 margin-top: 8px;
 `)])]),S(`description`,`
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
 `),S(`extra`,`
 text-align: center;
 transition: color .3s var(--n-bezier);
 margin-top: 12px;
 color: var(--n-extra-text-color);
 `)]),Ae=u({name:`Empty`,props:Object.assign(Object.assign({},x.props),{description:String,showDescription:{type:Boolean,default:!0},showIcon:{type:Boolean,default:!0},size:{type:String,default:`medium`},renderIcon:Function}),slots:Object,setup(e){let{mergedClsPrefixRef:t,inlineThemeDisabled:n,mergedComponentPropsRef:r}=b(e),i=x(`Empty`,`-empty`,ke,P,e,t),{localeRef:o}=L(`Empty`),s=a(()=>{var t,n,i;return(t=e.description)==null?(i=(n=r==null?void 0:r.value)==null?void 0:n.Empty)==null?void 0:i.description:t}),c=a(()=>{var e,t;return((t=(e=r==null?void 0:r.value)==null?void 0:e.Empty)==null?void 0:t.renderIcon)||(()=>d(oe,null))}),l=a(()=>{let{size:t}=e,{common:{cubicBezierEaseInOut:n},self:{[m(`iconSize`,t)]:r,[m(`fontSize`,t)]:a,textColor:o,iconColor:s,extraTextColor:c}}=i.value;return{"--n-icon-size":r,"--n-font-size":a,"--n-bezier":n,"--n-text-color":o,"--n-icon-color":s,"--n-extra-text-color":c}}),u=n?k(`empty`,a(()=>{let t=``,{size:n}=e;return t+=n[0],t}),l,e):void 0;return{mergedClsPrefix:t,mergedRenderIcon:c,localizedDescription:a(()=>s.value||o.value.description),cssVars:n?void 0:l,themeClass:u==null?void 0:u.themeClass,onRender:u==null?void 0:u.onRender}},render(){let{$slots:e,mergedClsPrefix:t,onRender:n}=this;return n==null||n(),d(`div`,{class:[`${t}-empty`,this.themeClass],style:this.cssVars},this.showIcon?d(`div`,{class:`${t}-empty__icon`},e.icon?e.icon():d(O,{clsPrefix:t},{default:this.mergedRenderIcon})):null,this.showDescription?d(`div`,{class:`${t}-empty__description`},e.default?e.default():this.localizedDescription):null,e.extra?d(`div`,{class:`${t}-empty__extra`},e.extra()):null)}}),je={color:Object,type:{type:String,default:`default`},round:Boolean,size:String,closable:Boolean,disabled:{type:Boolean,default:void 0}},Me=g(`tag`,`
 --n-close-margin: var(--n-close-margin-top) var(--n-close-margin-right) var(--n-close-margin-bottom) var(--n-close-margin-left);
 white-space: nowrap;
 position: relative;
 box-sizing: border-box;
 cursor: default;
 display: inline-flex;
 align-items: center;
 flex-wrap: nowrap;
 padding: var(--n-padding);
 border-radius: var(--n-border-radius);
 color: var(--n-text-color);
 background-color: var(--n-color);
 transition: 
 border-color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 opacity .3s var(--n-bezier);
 line-height: 1;
 height: var(--n-height);
 font-size: var(--n-font-size);
`,[p(`strong`,`
 font-weight: var(--n-font-weight-strong);
 `),S(`border`,`
 pointer-events: none;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 border-radius: inherit;
 border: var(--n-border);
 transition: border-color .3s var(--n-bezier);
 `),S(`icon`,`
 display: flex;
 margin: 0 4px 0 0;
 color: var(--n-text-color);
 transition: color .3s var(--n-bezier);
 font-size: var(--n-avatar-size-override);
 `),S(`avatar`,`
 display: flex;
 margin: 0 6px 0 0;
 `),S(`close`,`
 margin: var(--n-close-margin);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `),p(`round`,`
 padding: 0 calc(var(--n-height) / 3);
 border-radius: calc(var(--n-height) / 2);
 `,[S(`icon`,`
 margin: 0 4px 0 calc((var(--n-height) - 8px) / -2);
 `),S(`avatar`,`
 margin: 0 6px 0 calc((var(--n-height) - 8px) / -2);
 `),p(`closable`,`
 padding: 0 calc(var(--n-height) / 4) 0 calc(var(--n-height) / 3);
 `)]),p(`icon, avatar`,[p(`round`,`
 padding: 0 calc(var(--n-height) / 3) 0 calc(var(--n-height) / 2);
 `)]),p(`disabled`,`
 cursor: not-allowed !important;
 opacity: var(--n-opacity-disabled);
 `),p(`checkable`,`
 cursor: pointer;
 box-shadow: none;
 color: var(--n-text-color-checkable);
 background-color: var(--n-color-checkable);
 `,[y(`disabled`,[h(`&:hover`,`background-color: var(--n-color-hover-checkable);`,[y(`checked`,`color: var(--n-text-color-hover-checkable);`)]),h(`&:active`,`background-color: var(--n-color-pressed-checkable);`,[y(`checked`,`color: var(--n-text-color-pressed-checkable);`)])]),p(`checked`,`
 color: var(--n-text-color-checked);
 background-color: var(--n-color-checked);
 `,[y(`disabled`,[h(`&:hover`,`background-color: var(--n-color-checked-hover);`),h(`&:active`,`background-color: var(--n-color-checked-pressed);`)])])])]),Ne=Object.assign(Object.assign(Object.assign({},x.props),je),{bordered:{type:Boolean,default:void 0},checked:Boolean,checkable:Boolean,strong:Boolean,triggerClickOnClose:Boolean,onClose:[Array,Function],onMouseenter:Function,onMouseleave:Function,"onUpdate:checked":Function,onUpdateChecked:Function,internalCloseFocusable:{type:Boolean,default:!0},internalCloseIsButtonTag:{type:Boolean,default:!0},onCheckedChange:Function}),Pe=v(`n-tag`),Fe=u({name:`Tag`,props:Ne,slots:Object,setup(e){let n=l(null),{mergedBorderedRef:r,mergedClsPrefixRef:i,inlineThemeDisabled:s,mergedRtlRef:c,mergedComponentPropsRef:u}=b(e),d=a(()=>{var t,n;return e.size||((n=(t=u==null?void 0:u.value)==null?void 0:t.Tag)==null?void 0:n.size)||`medium`}),f=x(`Tag`,`-tag`,Me,te,e,i);t(Pe,{roundRef:o(e,`round`)});function p(){if(!e.disabled&&e.checkable){let{checked:t,onCheckedChange:n,onUpdateChecked:r,"onUpdate:checked":i}=e;r&&r(!t),i&&i(!t),n&&n(!t)}}function h(t){if(e.triggerClickOnClose||t.stopPropagation(),!e.disabled){let{onClose:n}=e;n&&N(n,t)}}let g={setTextContent(e){let{value:t}=n;t&&(t.textContent=e)}},_=C(`Tag`,c,i),v=a(()=>{let{type:t,color:{color:n,textColor:i}={}}=e,a=d.value,{common:{cubicBezierEaseInOut:o},self:{padding:s,closeMargin:c,borderRadius:l,opacityDisabled:u,textColorCheckable:p,textColorHoverCheckable:h,textColorPressedCheckable:g,textColorChecked:_,colorCheckable:v,colorHoverCheckable:y,colorPressedCheckable:b,colorChecked:x,colorCheckedHover:S,colorCheckedPressed:C,closeBorderRadius:w,fontWeightStrong:T,[m(`colorBordered`,t)]:E,[m(`closeSize`,a)]:D,[m(`closeIconSize`,a)]:O,[m(`fontSize`,a)]:k,[m(`height`,a)]:A,[m(`color`,t)]:j,[m(`textColor`,t)]:M,[m(`border`,t)]:N,[m(`closeIconColor`,t)]:P,[m(`closeIconColorHover`,t)]:F,[m(`closeIconColorPressed`,t)]:te,[m(`closeColorHover`,t)]:I,[m(`closeColorPressed`,t)]:ne}}=f.value,L=ee(c);return{"--n-font-weight-strong":T,"--n-avatar-size-override":`calc(${A} - 8px)`,"--n-bezier":o,"--n-border-radius":l,"--n-border":N,"--n-close-icon-size":O,"--n-close-color-pressed":ne,"--n-close-color-hover":I,"--n-close-border-radius":w,"--n-close-icon-color":P,"--n-close-icon-color-hover":F,"--n-close-icon-color-pressed":te,"--n-close-icon-color-disabled":P,"--n-close-margin-top":L.top,"--n-close-margin-right":L.right,"--n-close-margin-bottom":L.bottom,"--n-close-margin-left":L.left,"--n-close-size":D,"--n-color":n||(r.value?E:j),"--n-color-checkable":v,"--n-color-checked":x,"--n-color-checked-hover":S,"--n-color-checked-pressed":C,"--n-color-hover-checkable":y,"--n-color-pressed-checkable":b,"--n-font-size":k,"--n-height":A,"--n-opacity-disabled":u,"--n-padding":s,"--n-text-color":i||M,"--n-text-color-checkable":p,"--n-text-color-checked":_,"--n-text-color-hover-checkable":h,"--n-text-color-pressed-checkable":g}}),y=s?k(`tag`,a(()=>{let t=``,{type:n,color:{color:i,textColor:a}={}}=e;return t+=n[0],t+=d.value[0],i&&(t+=`a${j(i)}`),a&&(t+=`b${j(a)}`),r.value&&(t+=`c`),t}),v,e):void 0;return Object.assign(Object.assign({},g),{rtlEnabled:_,mergedClsPrefix:i,contentRef:n,mergedBordered:r,handleClick:p,handleCloseClick:h,cssVars:s?void 0:v,themeClass:y==null?void 0:y.themeClass,onRender:y==null?void 0:y.onRender})},render(){var e,t;let{mergedClsPrefix:n,rtlEnabled:r,closable:i,color:{borderColor:a}={},round:o,onRender:s,$slots:c}=this;s==null||s();let l=M(c.avatar,e=>e&&d(`div`,{class:`${n}-tag__avatar`},e)),u=M(c.icon,e=>e&&d(`div`,{class:`${n}-tag__icon`},e));return d(`div`,{class:[`${n}-tag`,this.themeClass,{[`${n}-tag--rtl`]:r,[`${n}-tag--strong`]:this.strong,[`${n}-tag--disabled`]:this.disabled,[`${n}-tag--checkable`]:this.checkable,[`${n}-tag--checked`]:this.checkable&&this.checked,[`${n}-tag--round`]:o,[`${n}-tag--avatar`]:l,[`${n}-tag--icon`]:u,[`${n}-tag--closable`]:i}],style:this.cssVars,onClick:this.handleClick,onMouseenter:this.onMouseenter,onMouseleave:this.onMouseleave},u||l,d(`span`,{class:`${n}-tag__content`,ref:`contentRef`},(t=(e=this.$slots).default)==null?void 0:t.call(e)),!this.checkable&&i?d(I,{clsPrefix:n,class:`${n}-tag__close`,disabled:this.disabled,onClick:this.handleCloseClick,focusable:this.internalCloseFocusable,round:o,isButtonTag:this.internalCloseIsButtonTag,absolute:!0}):null,!this.checkable&&this.mergedBordered?d(`div`,{class:`${n}-tag__border`,style:{borderColor:a}}):null)}}),Ie=h([g(`base-selection`,`
 --n-padding-single: var(--n-padding-single-top) var(--n-padding-single-right) var(--n-padding-single-bottom) var(--n-padding-single-left);
 --n-padding-multiple: var(--n-padding-multiple-top) var(--n-padding-multiple-right) var(--n-padding-multiple-bottom) var(--n-padding-multiple-left);
 position: relative;
 z-index: auto;
 box-shadow: none;
 width: 100%;
 max-width: 100%;
 display: inline-block;
 vertical-align: bottom;
 border-radius: var(--n-border-radius);
 min-height: var(--n-height);
 line-height: 1.5;
 font-size: var(--n-font-size);
 `,[g(`base-loading`,`
 color: var(--n-loading-color);
 `),g(`base-selection-tags`,`min-height: var(--n-height);`),S(`border, state-border`,`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 pointer-events: none;
 border: var(--n-border);
 border-radius: inherit;
 transition:
 box-shadow .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `),S(`state-border`,`
 z-index: 1;
 border-color: #0000;
 `),g(`base-suffix`,`
 cursor: pointer;
 position: absolute;
 top: 50%;
 transform: translateY(-50%);
 right: 10px;
 `,[S(`arrow`,`
 font-size: var(--n-arrow-size);
 color: var(--n-arrow-color);
 transition: color .3s var(--n-bezier);
 `)]),g(`base-selection-overlay`,`
 display: flex;
 align-items: center;
 white-space: nowrap;
 pointer-events: none;
 position: absolute;
 top: 0;
 right: 0;
 bottom: 0;
 left: 0;
 padding: var(--n-padding-single);
 transition: color .3s var(--n-bezier);
 `,[S(`wrapper`,`
 flex-basis: 0;
 flex-grow: 1;
 overflow: hidden;
 text-overflow: ellipsis;
 `)]),g(`base-selection-placeholder`,`
 color: var(--n-placeholder-color);
 `,[S(`inner`,`
 max-width: 100%;
 overflow: hidden;
 `)]),g(`base-selection-tags`,`
 cursor: pointer;
 outline: none;
 box-sizing: border-box;
 position: relative;
 z-index: auto;
 display: flex;
 padding: var(--n-padding-multiple);
 flex-wrap: wrap;
 align-items: center;
 width: 100%;
 vertical-align: bottom;
 background-color: var(--n-color);
 border-radius: inherit;
 transition:
 color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `),g(`base-selection-label`,`
 height: var(--n-height);
 display: inline-flex;
 width: 100%;
 vertical-align: bottom;
 cursor: pointer;
 outline: none;
 z-index: auto;
 box-sizing: border-box;
 position: relative;
 transition:
 color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 border-radius: inherit;
 background-color: var(--n-color);
 align-items: center;
 `,[g(`base-selection-input`,`
 font-size: inherit;
 line-height: inherit;
 outline: none;
 cursor: pointer;
 box-sizing: border-box;
 border:none;
 width: 100%;
 padding: var(--n-padding-single);
 background-color: #0000;
 color: var(--n-text-color);
 transition: color .3s var(--n-bezier);
 caret-color: var(--n-caret-color);
 `,[S(`content`,`
 text-overflow: ellipsis;
 overflow: hidden;
 white-space: nowrap; 
 `)]),S(`render-label`,`
 color: var(--n-text-color);
 `)]),y(`disabled`,[h(`&:hover`,[S(`state-border`,`
 box-shadow: var(--n-box-shadow-hover);
 border: var(--n-border-hover);
 `)]),p(`focus`,[S(`state-border`,`
 box-shadow: var(--n-box-shadow-focus);
 border: var(--n-border-focus);
 `)]),p(`active`,[S(`state-border`,`
 box-shadow: var(--n-box-shadow-active);
 border: var(--n-border-active);
 `),g(`base-selection-label`,`background-color: var(--n-color-active);`),g(`base-selection-tags`,`background-color: var(--n-color-active);`)])]),p(`disabled`,`cursor: not-allowed;`,[S(`arrow`,`
 color: var(--n-arrow-color-disabled);
 `),g(`base-selection-label`,`
 cursor: not-allowed;
 background-color: var(--n-color-disabled);
 `,[g(`base-selection-input`,`
 cursor: not-allowed;
 color: var(--n-text-color-disabled);
 `),S(`render-label`,`
 color: var(--n-text-color-disabled);
 `)]),g(`base-selection-tags`,`
 cursor: not-allowed;
 background-color: var(--n-color-disabled);
 `),g(`base-selection-placeholder`,`
 cursor: not-allowed;
 color: var(--n-placeholder-color-disabled);
 `)]),g(`base-selection-input-tag`,`
 height: calc(var(--n-height) - 6px);
 line-height: calc(var(--n-height) - 6px);
 outline: none;
 display: none;
 position: relative;
 margin-bottom: 3px;
 max-width: 100%;
 vertical-align: bottom;
 `,[S(`input`,`
 font-size: inherit;
 font-family: inherit;
 min-width: 1px;
 padding: 0;
 background-color: #0000;
 outline: none;
 border: none;
 max-width: 100%;
 overflow: hidden;
 width: 1em;
 line-height: inherit;
 cursor: pointer;
 color: var(--n-text-color);
 caret-color: var(--n-caret-color);
 `),S(`mirror`,`
 position: absolute;
 left: 0;
 top: 0;
 white-space: pre;
 visibility: hidden;
 user-select: none;
 -webkit-user-select: none;
 opacity: 0;
 `)]),[`warning`,`error`].map(e=>p(`${e}-status`,[S(`state-border`,`border: var(--n-border-${e});`),y(`disabled`,[h(`&:hover`,[S(`state-border`,`
 box-shadow: var(--n-box-shadow-hover-${e});
 border: var(--n-border-hover-${e});
 `)]),p(`active`,[S(`state-border`,`
 box-shadow: var(--n-box-shadow-active-${e});
 border: var(--n-border-active-${e});
 `),g(`base-selection-label`,`background-color: var(--n-color-active-${e});`),g(`base-selection-tags`,`background-color: var(--n-color-active-${e});`)]),p(`focus`,[S(`state-border`,`
 box-shadow: var(--n-box-shadow-focus-${e});
 border: var(--n-border-focus-${e});
 `)])])]))]),g(`base-selection-popover`,`
 margin-bottom: -3px;
 display: flex;
 flex-wrap: wrap;
 margin-right: -8px;
 `),g(`base-selection-tag-wrapper`,`
 max-width: 100%;
 display: inline-flex;
 padding: 0 7px 3px 0;
 `,[h(`&:last-child`,`padding-right: 0;`),g(`tag`,`
 font-size: 14px;
 max-width: 100%;
 `,[S(`content`,`
 line-height: 1.25;
 text-overflow: ellipsis;
 overflow: hidden;
 `)])])]),Le=u({name:`InternalSelection`,props:Object.assign(Object.assign({},x.props),{clsPrefix:{type:String,required:!0},bordered:{type:Boolean,default:void 0},active:Boolean,pattern:{type:String,default:``},placeholder:String,selectedOption:{type:Object,default:null},selectedOptions:{type:Array,default:null},labelField:{type:String,default:`label`},valueField:{type:String,default:`value`},multiple:Boolean,filterable:Boolean,clearable:Boolean,disabled:Boolean,size:{type:String,default:`medium`},loading:Boolean,autofocus:Boolean,showArrow:{type:Boolean,default:!0},inputProps:Object,focused:Boolean,renderTag:Function,onKeydown:Function,onClick:Function,onBlur:Function,onFocus:Function,onDeleteOption:Function,maxTagCount:[String,Number],ellipsisTagPopoverProps:Object,onClear:Function,onPatternInput:Function,onPatternFocus:Function,onPatternBlur:Function,renderLabel:Function,status:String,inlineThemeDisabled:Boolean,ignoreComposition:{type:Boolean,default:!0},onResize:Function}),setup(t){let{mergedClsPrefixRef:s,mergedRtlRef:c}=b(t),u=C(`InternalSelection`,c,s),d=l(null),f=l(null),p=l(null),h=l(null),g=l(null),_=l(null),v=l(null),y=l(null),S=l(null),w=l(null),T=l(!1),E=l(!1),D=l(!1),O=x(`InternalSelection`,`-internal-selection`,Ie,ne,t,o(t,`clsPrefix`)),A=a(()=>t.clearable&&!t.disabled&&(D.value||t.active)),j=a(()=>t.selectedOption?t.renderTag?t.renderTag({option:t.selectedOption,handleClose:()=>{}}):t.renderLabel?t.renderLabel(t.selectedOption,!0):F(t.selectedOption[t.labelField],t.selectedOption,!0):t.placeholder),M=a(()=>{let e=t.selectedOption;if(e)return e[t.labelField]}),N=a(()=>t.multiple?!!(Array.isArray(t.selectedOptions)&&t.selectedOptions.length):t.selectedOption!==null);function P(){var e;let{value:n}=d;if(n){let{value:r}=f;r&&(r.style.width=`${n.offsetWidth}px`,t.maxTagCount!==`responsive`&&((e=S.value)==null||e.sync({showAllItemsBeforeCalculate:!1})))}}function te(){let{value:e}=w;e&&(e.style.display=`none`)}function I(){let{value:e}=w;e&&(e.style.display=`inline-block`)}e(o(t,`active`),e=>{e||te()}),e(o(t,`pattern`),()=>{t.multiple&&r(P)});function L(e){let{onFocus:n}=t;n&&n(e)}function re(e){let{onBlur:n}=t;n&&n(e)}function R(e){let{onDeleteOption:n}=t;n&&n(e)}function ie(e){let{onClear:n}=t;n&&n(e)}function z(e){let{onPatternInput:n}=t;n&&n(e)}function B(e){var t;(!e.relatedTarget||!((t=p.value)!=null&&t.contains(e.relatedTarget)))&&L(e)}function oe(e){var t;(t=p.value)!=null&&t.contains(e.relatedTarget)||re(e)}function V(e){ie(e)}function H(){D.value=!0}function U(){D.value=!1}function W(e){!t.active||!t.filterable||e.target!==f.value&&e.preventDefault()}function G(e){R(e)}let K=l(!1);function se(e){if(e.key===`Backspace`&&!K.value&&!t.pattern.length){let{selectedOptions:e}=t;e!=null&&e.length&&G(e[e.length-1])}}let q=null;function ce(e){let{value:n}=d;n&&(n.textContent=e.target.value,P()),t.ignoreComposition&&K.value?q=e:z(e)}function le(){K.value=!0}function ue(){K.value=!1,t.ignoreComposition&&z(q),q=null}function J(e){var n;E.value=!0,(n=t.onPatternFocus)==null||n.call(t,e)}function Y(e){var n;E.value=!1,(n=t.onPatternBlur)==null||n.call(t,e)}function de(){var e,n;if(t.filterable)E.value=!1,(e=_.value)==null||e.blur(),(n=f.value)==null||n.blur();else if(t.multiple){let{value:e}=h;e==null||e.blur()}else{let{value:e}=g;e==null||e.blur()}}function fe(){var e,n,r;t.filterable?(E.value=!1,(e=_.value)==null||e.focus()):t.multiple?(n=h.value)==null||n.focus():(r=g.value)==null||r.focus()}function pe(){let{value:e}=f;e&&(I(),e.focus())}function me(){let{value:e}=f;e&&e.blur()}function he(e){let{value:t}=v;t&&t.setTextContent(`+${e}`)}function ge(){let{value:e}=y;return e}function _e(){return f.value}let X=null;function Z(){X!==null&&window.clearTimeout(X)}function Q(){t.active||(Z(),X=window.setTimeout(()=>{N.value&&(T.value=!0)},100))}function ve(){Z()}function ye(e){e||(Z(),T.value=!1)}e(N,e=>{e||(T.value=!1)}),n(()=>{i(()=>{let e=_.value;e&&(t.disabled?e.removeAttribute(`tabindex`):e.tabIndex=E.value?-1:0)})}),ae(p,t.onResize);let{inlineThemeDisabled:be}=t,xe=a(()=>{let{size:e}=t,{common:{cubicBezierEaseInOut:n},self:{fontWeight:r,borderRadius:i,color:a,placeholderColor:o,textColor:s,paddingSingle:c,paddingMultiple:l,caretColor:u,colorDisabled:d,textColorDisabled:f,placeholderColorDisabled:p,colorActive:h,boxShadowFocus:g,boxShadowActive:_,boxShadowHover:v,border:y,borderFocus:b,borderHover:x,borderActive:S,arrowColor:C,arrowColorDisabled:w,loadingColor:T,colorActiveWarning:E,boxShadowFocusWarning:D,boxShadowActiveWarning:k,boxShadowHoverWarning:A,borderWarning:j,borderFocusWarning:M,borderHoverWarning:N,borderActiveWarning:P,colorActiveError:F,boxShadowFocusError:te,boxShadowActiveError:I,boxShadowHoverError:ne,borderError:L,borderFocusError:re,borderHoverError:R,borderActiveError:ie,clearColor:z,clearColorHover:ae,clearColorPressed:B,clearSize:oe,arrowSize:V,[m(`height`,e)]:H,[m(`fontSize`,e)]:U}}=O.value,W=ee(c),G=ee(l);return{"--n-bezier":n,"--n-border":y,"--n-border-active":S,"--n-border-focus":b,"--n-border-hover":x,"--n-border-radius":i,"--n-box-shadow-active":_,"--n-box-shadow-focus":g,"--n-box-shadow-hover":v,"--n-caret-color":u,"--n-color":a,"--n-color-active":h,"--n-color-disabled":d,"--n-font-size":U,"--n-height":H,"--n-padding-single-top":W.top,"--n-padding-multiple-top":G.top,"--n-padding-single-right":W.right,"--n-padding-multiple-right":G.right,"--n-padding-single-left":W.left,"--n-padding-multiple-left":G.left,"--n-padding-single-bottom":W.bottom,"--n-padding-multiple-bottom":G.bottom,"--n-placeholder-color":o,"--n-placeholder-color-disabled":p,"--n-text-color":s,"--n-text-color-disabled":f,"--n-arrow-color":C,"--n-arrow-color-disabled":w,"--n-loading-color":T,"--n-color-active-warning":E,"--n-box-shadow-focus-warning":D,"--n-box-shadow-active-warning":k,"--n-box-shadow-hover-warning":A,"--n-border-warning":j,"--n-border-focus-warning":M,"--n-border-hover-warning":N,"--n-border-active-warning":P,"--n-color-active-error":F,"--n-box-shadow-focus-error":te,"--n-box-shadow-active-error":I,"--n-box-shadow-hover-error":ne,"--n-border-error":L,"--n-border-focus-error":re,"--n-border-hover-error":R,"--n-border-active-error":ie,"--n-clear-size":oe,"--n-clear-color":z,"--n-clear-color-hover":ae,"--n-clear-color-pressed":B,"--n-arrow-size":V,"--n-font-weight":r}}),$=be?k(`internal-selection`,a(()=>t.size[0]),xe,t):void 0;return{mergedTheme:O,mergedClearable:A,mergedClsPrefix:s,rtlEnabled:u,patternInputFocused:E,filterablePlaceholder:j,label:M,selected:N,showTagsPanel:T,isComposing:K,counterRef:v,counterWrapperRef:y,patternInputMirrorRef:d,patternInputRef:f,selfRef:p,multipleElRef:h,singleElRef:g,patternInputWrapperRef:_,overflowRef:S,inputTagElRef:w,handleMouseDown:W,handleFocusin:B,handleClear:V,handleMouseEnter:H,handleMouseLeave:U,handleDeleteOption:G,handlePatternKeyDown:se,handlePatternInputInput:ce,handlePatternInputBlur:Y,handlePatternInputFocus:J,handleMouseEnterCounter:Q,handleMouseLeaveCounter:ve,handleFocusout:oe,handleCompositionEnd:ue,handleCompositionStart:le,onPopoverUpdateShow:ye,focus:fe,focusInput:pe,blur:de,blurInput:me,updateCounter:he,getCounter:ge,getTail:_e,renderLabel:t.renderLabel,cssVars:be?void 0:xe,themeClass:$==null?void 0:$.themeClass,onRender:$==null?void 0:$.onRender}},render(){let{status:e,multiple:t,size:n,disabled:r,filterable:i,maxTagCount:a,bordered:o,clsPrefix:s,ellipsisTagPopoverProps:l,onRender:u,renderTag:f,renderLabel:p}=this;u==null||u();let m=a===`responsive`,h=typeof a==`number`,g=m||h,_=d(E,null,{default:()=>d(re,{clsPrefix:s,loading:this.loading,showArrow:this.showArrow,showClear:this.mergedClearable&&this.selected,onClear:this.handleClear},{default:()=>{var e,t;return(t=(e=this.$slots).arrow)==null?void 0:t.call(e)}})}),v;if(t){let{labelField:e}=this,t=t=>d(`div`,{class:`${s}-base-selection-tag-wrapper`,key:t.value},f?f({option:t,handleClose:()=>{this.handleDeleteOption(t)}}):d(Fe,{size:n,closable:!t.disabled,disabled:r,onClose:()=>{this.handleDeleteOption(t)},internalCloseIsButtonTag:!1,internalCloseFocusable:!1},{default:()=>p?p(t,!0):F(t[e],t,!0)})),o=()=>(h?this.selectedOptions.slice(0,a):this.selectedOptions).map(t),u=i?d(`div`,{class:`${s}-base-selection-input-tag`,ref:`inputTagElRef`,key:`__input-tag__`},d(`input`,Object.assign({},this.inputProps,{ref:`patternInputRef`,tabindex:-1,disabled:r,value:this.pattern,autofocus:this.autofocus,class:`${s}-base-selection-input-tag__input`,onBlur:this.handlePatternInputBlur,onFocus:this.handlePatternInputFocus,onKeydown:this.handlePatternKeyDown,onInput:this.handlePatternInputInput,onCompositionstart:this.handleCompositionStart,onCompositionend:this.handleCompositionEnd})),d(`span`,{ref:`patternInputMirrorRef`,class:`${s}-base-selection-input-tag__mirror`},this.pattern)):null,y=m?()=>d(`div`,{class:`${s}-base-selection-tag-wrapper`,ref:`counterWrapperRef`},d(Fe,{size:n,ref:`counterRef`,onMouseenter:this.handleMouseEnterCounter,onMouseleave:this.handleMouseLeaveCounter,disabled:r})):void 0,b;if(h){let e=this.selectedOptions.length-a;e>0&&(b=d(`div`,{class:`${s}-base-selection-tag-wrapper`,key:`__counter__`},d(Fe,{size:n,ref:`counterRef`,onMouseenter:this.handleMouseEnterCounter,disabled:r},{default:()=>`+${e}`})))}let x=m?i?d(z,{ref:`overflowRef`,updateCounter:this.updateCounter,getCounter:this.getCounter,getTail:this.getTail,style:{width:`100%`,display:`flex`,overflow:`hidden`}},{default:o,counter:y,tail:()=>u}):d(z,{ref:`overflowRef`,updateCounter:this.updateCounter,getCounter:this.getCounter,style:{width:`100%`,display:`flex`,overflow:`hidden`}},{default:o,counter:y}):h&&b?o().concat(b):o(),S=g?()=>d(`div`,{class:`${s}-base-selection-popover`},m?o():this.selectedOptions.map(t)):void 0,C=g?Object.assign({show:this.showTagsPanel,trigger:`hover`,overlap:!0,placement:`top`,width:`trigger`,onUpdateShow:this.onPopoverUpdateShow,theme:this.mergedTheme.peers.Popover,themeOverrides:this.mergedTheme.peerOverrides.Popover},l):null,w=!this.selected&&(!this.active||!this.pattern&&!this.isComposing)?d(`div`,{class:`${s}-base-selection-placeholder ${s}-base-selection-overlay`},d(`div`,{class:`${s}-base-selection-placeholder__inner`},this.placeholder)):null,T=i?d(`div`,{ref:`patternInputWrapperRef`,class:`${s}-base-selection-tags`},x,m?null:u,_):d(`div`,{ref:`multipleElRef`,class:`${s}-base-selection-tags`,tabindex:r?void 0:0},x,_);v=d(c,null,g?d(A,Object.assign({},C,{scrollable:!0,style:`max-height: calc(var(--v-target-height) * 6.6);`}),{trigger:()=>T,default:S}):T,w)}else if(i){let e=this.pattern||this.isComposing,t=this.active?!e:!this.selected,n=this.active?!1:this.selected;v=d(`div`,{ref:`patternInputWrapperRef`,class:`${s}-base-selection-label`,title:this.patternInputFocused?void 0:B(this.label)},d(`input`,Object.assign({},this.inputProps,{ref:`patternInputRef`,class:`${s}-base-selection-input`,value:this.active?this.pattern:``,placeholder:``,readonly:r,disabled:r,tabindex:-1,autofocus:this.autofocus,onFocus:this.handlePatternInputFocus,onBlur:this.handlePatternInputBlur,onInput:this.handlePatternInputInput,onCompositionstart:this.handleCompositionStart,onCompositionend:this.handleCompositionEnd})),n?d(`div`,{class:`${s}-base-selection-label__render-label ${s}-base-selection-overlay`,key:`input`},d(`div`,{class:`${s}-base-selection-overlay__wrapper`},f?f({option:this.selectedOption,handleClose:()=>{}}):p?p(this.selectedOption,!0):F(this.label,this.selectedOption,!0))):null,t?d(`div`,{class:`${s}-base-selection-placeholder ${s}-base-selection-overlay`,key:`placeholder`},d(`div`,{class:`${s}-base-selection-overlay__wrapper`},this.filterablePlaceholder)):null,_)}else v=d(`div`,{ref:`singleElRef`,class:`${s}-base-selection-label`,tabindex:this.disabled?void 0:0},this.label===void 0?d(`div`,{class:`${s}-base-selection-placeholder ${s}-base-selection-overlay`,key:`placeholder`},d(`div`,{class:`${s}-base-selection-placeholder__inner`},this.placeholder)):d(`div`,{class:`${s}-base-selection-input`,title:B(this.label),key:`input`},d(`div`,{class:`${s}-base-selection-input__content`},f?f({option:this.selectedOption,handleClose:()=>{}}):p?p(this.selectedOption,!0):F(this.label,this.selectedOption,!0))),_);return d(`div`,{ref:`selfRef`,class:[`${s}-base-selection`,this.rtlEnabled&&`${s}-base-selection--rtl`,this.themeClass,e&&`${s}-base-selection--${e}-status`,{[`${s}-base-selection--active`]:this.active,[`${s}-base-selection--selected`]:this.selected||this.active&&this.pattern,[`${s}-base-selection--disabled`]:this.disabled,[`${s}-base-selection--multiple`]:this.multiple,[`${s}-base-selection--focus`]:this.focused}],style:this.cssVars,onClick:this.onClick,onMouseenter:this.handleMouseEnter,onMouseleave:this.handleMouseLeave,onKeydown:this.onKeydown,onFocusin:this.handleFocusin,onFocusout:this.handleFocusout,onMousedown:this.handleMouseDown},v,o?d(`div`,{class:`${s}-base-selection__border`}):null,o?d(`div`,{class:`${s}-base-selection__state-border`}):null)}});export{me as a,Te as i,Ae as n,ae as o,Oe as r,Le as t};