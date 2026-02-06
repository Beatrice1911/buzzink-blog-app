(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))e(s);new MutationObserver(s=>{for(const t of s)if(t.type==="childList")for(const r of t.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&e(r)}).observe(document,{childList:!0,subtree:!0});function a(s){const t={};return s.integrity&&(t.integrity=s.integrity),s.referrerPolicy&&(t.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?t.credentials="include":s.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function e(s){if(s.ep)return;s.ep=!0;const t=a(s);fetch(s.href,t)}})();const p="/api/posts",M="/api/auth",R="/api/comments",oe="https://i.postimg.cc/KvF0rh0Q/custom-default-avatar.png",ne=document.body,Y=document.querySelectorAll(".user-icon"),C=document.getElementById("userMenuDetails"),j=document.getElementById("authModal"),ue=document.getElementById("closeModal"),$=document.getElementById("loginTab"),P=document.getElementById("registerTab"),ge=document.querySelectorAll(".write-post"),fe=document.querySelector(".search-icon"),W=document.getElementById("mobileSearch"),he=document.querySelector(".menu-toggle"),ye=document.getElementById("mobileMenu"),T=document.querySelector(".logo"),pe=document.querySelector(".all-posts-btn"),ve=document.getElementById("myPosts"),we=document.getElementById("savedPosts"),ke=document.getElementById("profile-edit"),be=document.getElementById("settings"),D=document.getElementById("themeToggle"),O=document.documentElement;function d(o,n="info",a=5e3){const e=document.getElementById("toast-container");if(!e)return;const s=document.createElement("div");s.className=`toast toast-${n}`;const t=document.createElement("i");n==="success"?t.className="fas fa-check-circle":n==="error"?t.className="fas fa-exclamation-circle":t.className="fas fa-info-circle",s.appendChild(t);const r=document.createElement("span");r.textContent=o,s.appendChild(r),e.appendChild(s),setTimeout(()=>{s.style.animation="slideOut 0.5s forwards",s?.addEventListener("animationend",()=>s.remove())},a)}function Ee(){he?.addEventListener("click",o=>{o.stopPropagation(),C.classList.contains("show")&&C.classList.remove("show"),ye.classList.toggle("active")})}function Le(){T?.addEventListener("click",()=>{window.location.href="index.html"}),pe?.addEventListener("click",()=>{window.location.href="all-posts.html"}),ve?.addEventListener("click",()=>{window.location.href="my-posts.html"}),ke?.addEventListener("click",()=>{window.location.href="dashboard.html"}),we?.addEventListener("click",()=>{window.location.href="saved.html"}),be?.addEventListener("click",()=>{window.location.href="settings.html"})}function Se(){$?.addEventListener("click",()=>{b.classList.remove("hidden"),E.classList.add("hidden"),$.classList.add("active"),P.classList.remove("active")}),P?.addEventListener("click",()=>{E.classList.remove("hidden"),b.classList.add("hidden"),P.classList.add("active"),$.classList.remove("active")}),ue?.addEventListener("click",()=>{j.classList.add("hidden")})}function Ie(){Y.forEach(o=>o?.addEventListener("click",()=>{const n=localStorage.getItem("user"),a=n?JSON.parse(n):null;a&&a.id?(C.classList.toggle("show"),j.classList.add("hidden")):(C.classList.add("hidden"),j.classList.remove("hidden"),$.classList.add("active"),P.classList.remove("active"),b.classList.remove("hidden"),E.classList.add("hidden"),b?.reset(),E?.reset())}))}function $e(){fe?.addEventListener("click",()=>{W.classList.toggle("show"),W.classList.contains("show")&&W.querySelector("input").focus()})}function Pe(){ge.forEach(o=>{o?.addEventListener("click",n=>{const a=localStorage.getItem("user"),e=a?JSON.parse(a):null;!e||!e.id?(n.preventDefault(),j.classList.remove("hidden"),$.classList.add("active"),P.classList.remove("active"),b.classList.remove("hidden"),E.classList.add("hidden")):(localStorage.removeItem("editSlug"),window.location.href="write.html")})})}function Be(){D?.addEventListener("change",()=>{D.checked?(O.setAttribute("data-theme","dark"),localStorage.setItem("theme","dark"),T.src="/Images/logo-dark-theme_optimized_.png"):(O.setAttribute("data-theme","light"),localStorage.setItem("theme","light"),T.src="/Images/logo_optimized.png")})}function Je(){localStorage.getItem("theme")==="dark"?(O.setAttribute("data-theme","dark"),D&&(D.checked=!0)):O.setAttribute("data-theme","light")}function ze(o){o==="dark"?(ne.classList.add("dark"),T.src="/Images/logo-dark-theme_optimized_.png"):(ne.classList.remove("dark"),T.src="/Images/logo_optimized.png"),localStorage.setItem("theme",o)}function We(){Ee(),Se(),Ie(),$e(),Pe(),Le(),Be()}const b=document.getElementById("loginForm"),E=document.getElementById("registerForm"),Ce=document.getElementById("logoutBtn");function J(o){return o?{...o,id:o.id||o._id}:null}window.currentUser=(()=>{const o=localStorage.getItem("user");return o?J(JSON.parse(o)):null})();function S(o){o?.id?Y.forEach(n=>n.title=`Logged in as ${o.name}`):(Y.forEach(n=>n.title="Click to Login/Register"),C?.classList.remove("show"))}async function H(o){try{const n=await m("/api/users/me");if(!n.ok)return;o=await n.json();const a=document.querySelectorAll(".user-icon");a&&a.forEach(s=>{s.src=o.profilePhoto?.trim()?o.profilePhoto:oe});const e=document.querySelectorAll(".avatar");e&&e.forEach(s=>{s.src=o.profilePhoto?.trim()?o.profilePhoto:oe}),window.currentUser=o}catch(n){console.warn("Failed to load auth user:",n)}}function Te(){b?.addEventListener("submit",async o=>{o.preventDefault();const n=document.getElementById("loginEmail").value,a=document.getElementById("loginPassword").value;console.log("Login Triggered");const e=await m(`${M}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:n,password:a})}),s=await e.json();console.log("Login response:",s),e.ok||d(`Login failed: ${s.message||"Unknown error"}`,"error");const t=J(s.user);localStorage.setItem("user",JSON.stringify(t)),window.currentUser=t,localStorage.setItem("role",t.role),t.role==="admin"&&(window.location.href="admin.html"),S(t),H(t),authModal.classList.add("hidden"),b.reset(),d(`Welcome back, ${t.name}!`,"success"),Re()})}function Me(){E?.addEventListener("submit",async o=>{o.preventDefault();const n=document.getElementById("registerName").value,a=document.getElementById("registerEmail").value,e=document.getElementById("registerPassword").value,s=await m(`${M}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:n,email:a,password:e})}),t=await s.json();console.log("Register response:",t),s.ok||d(`Registration failed: ${t.message||"Unknown error"}`,"error");const r=J(t.user);localStorage.setItem("user",JSON.stringify(r)),window.currentUser=r,localStorage.setItem("role",r.role),S(r),H(r),authModal.classList.add("hidden"),E.reset(),d(`Welcome, ${r.name}! Your account has been created.`,"success")})}function Ue(){Ce?.addEventListener("click",()=>{ae(),window.location.href="index.html"})}async function Ve(){try{const o=await m(`${M}/me`);if(!o.ok)throw new Error("Not authenticated");const n=await o.json(),a=J(n);return localStorage.setItem("user",JSON.stringify(a)),window.currentUser=a,S(a),H(a),a}catch{return S(null),H(null),null}}async function ae(o=!1){try{await fetch(`${M}/logout`,{method:"POST",credentials:"include"})}catch(n){console.warn("Logout request failed:",n)}localStorage.removeItem("user"),window.currentUser=null,S(null),o||d("You have been logged out.","info")}function Ae(){const o=document.getElementById("forgotPasswordLink"),n=document.getElementById("forgotPasswordModal"),a=document.getElementById("closeForgotModal"),e=document.getElementById("forgotPasswordForm");o&&o?.addEventListener("click",s=>{s.preventDefault(),n.classList.remove("hidden")}),a&&a?.addEventListener("click",()=>{n.classList.add("hidden")}),e&&e?.addEventListener("submit",async s=>{s.preventDefault();const t=document.getElementById("forgotEmail").value.trim();try{const l=await(await fetch("/api/auth/forgot-password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t})})).json();d(l.message||"Check your email for the reset link.","success"),n.classList.add("hidden")}catch(r){console.error(r),d("Failed to send reset link. Try again.","error")}})}function Ye(){Te(),Me(),Ue(),Ae()}async function m(o,n={}){let a=await fetch(o,{credentials:"include",...n});return a.status===401&&(await qe()?a=await fetch(o,{credentials:"include",...n}):ae(!0)),a}async function qe(){try{const o=await fetch(`${M}/refresh`,{method:"POST",credentials:"include"});if(!o.ok)throw new Error("Refresh failed");const n=await o.json();return window.currentUser=n.user,S(n.user),!0}catch{return!1}}async function Ke(o){const n=o.dataset.slug;if(!n)return;const a=window.location.pathname.endsWith("post.html"),e=a?document.getElementById("singlePostContainer"):o.closest(".post");if(!e)return;const s=e.querySelector(".comments-section"),t=s?.querySelector(".comments-list");!s||!t||(a||s.classList.toggle("show"),(a||s.classList.contains("show"))&&await re(n,t))}async function Qe(o){if(o.dataset.deleting==="true")return;o.dataset.deleting="true";const n=o.dataset.commentId;if(!confirm("Are you sure you want to delete this comment?")){o.dataset.deleting="false";return}try{const e=await m(`${R}/${n}`,{method:"DELETE"}),s=await e.json();if(e.ok){const t=o.closest(".comment");t&&t.remove();const l=(window.location.pathname.endsWith("post.html")?document.getElementById("singlePostContainer"):o.closest(".post"))?.querySelector(".comment-count");if(l){let i=parseInt(l.textContent)||0;i=Math.max(i-1,0),l.textContent=i,l.title=`${i} comment${i!==1?"s":""}`}d("Comment deleted successfully!","success")}else throw new Error(s.message||"Delete failed")}catch(e){console.error("Error deleting comment:",e),d("Error deleting comment. Please try again.","error")}finally{o.dataset.deleting="false"}}async function re(o,n,a=3){try{n.innerHTML='<p class="loading-comments">Loading comments...</p>';const e=await m(`${R}/post/${o}?_=${Date.now()}`);if(!e.ok)throw new Error("Failed to fetch comments");const s=await e.json();if(n.innerHTML="",s.length===0){n.innerHTML="<p class='no-comments'>No comments yet. Be the first to comment!</p>";return}const t=s.slice(0,a);if(V(t,n),s.length>a){const r=document.createElement("button");r.classList.add("view-more-btn"),r.textContent=`View all ${s.length} comments`;const l=document.createElement("div");l.classList.add("comments-scroll-container"),l.style.display="none",V(s,l);let i=!1;r?.addEventListener("click",()=>{i=!i,i?(n.innerHTML="",n.appendChild(l),n.appendChild(r),l.style.display="block",r.textContent="View less comments"):(n.innerHTML="",V(t,n),r.textContent=`View all ${s.length} comments`,n.appendChild(r))}),n.appendChild(r)}}catch(e){console.error("Error fetching comments:",e),n.innerHTML="<p class='error-comments'>Failed to load comments.</p>"}}function V(o,n){const a=window.currentUser?.id||window.currentUser?._id;o.forEach(e=>{const s=document.createElement("div");s.classList.add("comment");const t=typeof e.authorId=="object"?e.authorId._id:e.authorId,r=a&&t&&t.toString()===a.toString();s.innerHTML=`
      <div class="comment-header">
        <p><strong class="comment-author" style="cursor: pointer;">${e.authorId?.name||"Anonymous"}:</strong> ${te(e.text)}</p>
        ${r?`<div class="comment-menu">
                  <button class="menu-btn">⋮</button>
                  <div class="menu-options hidden">
                    <button class="delete-comment-btn" data-comment-id="${e._id}">Delete</button>
                  </div>
                </div>`:""}
      </div>  
      <small title="${new Date(e.createdAt).toLocaleString()}">
        ${A(e.createdAt)}
      </small>
    `,n.appendChild(s),s.querySelector(".comment-author")?.addEventListener("click",()=>{window.location.href=`profile.html?id=${e.authorId?._id}`})})}async function Fe(o,n,a,e){try{const s=await m(`${R}/post/${o}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:n})});if(s.ok){const r=(await s.json()).comment,l=document.createElement("div");if(l.classList.add("comment"),l.innerHTML=`
        <div class="comment-header">
          <p><strong>You:</strong> ${te(r.text)}</p>
          <div class="comment-menu">
            <button class="menu-btn">⋮</button>
            <div class="menu-options hidden">
              <button class="delete-comment-btn" data-comment-id="${r._id}">Delete</button>
            </div>
          </div>
        </div>
        <small title="${new Date(r.createdAt).toLocaleString()}">
        ${A(r.createdAt)}
      </small>
      `,a.prepend(l),e&&e){let i=parseInt(e.textContent)||0;e.textContent=i+1,e.title=`${i+1} comments`}d("Comment posted successfully!","success")}else throw new Error("Failed to post comment")}catch(s){console.error("Error posting comment:",s),d("Failed to post comment","error")}}async function ie(o,n){try{const a=await m(`${R}/post/${o}`);if(!a.ok)throw new Error("Failed to fetch comment count");const s=(await a.json()).length;s===0?(n.textContent="0",n.title="No comments yet"):(n.textContent=s,n.title=`${s} comment${s>1?"s":""}`)}catch(a){console.error("Error fetching comment count:",a),n.textContent="0"}}async function xe(o){const n=o.target.closest(".comment-form"),a=n.querySelector(".comment-form button");if(!n)return;o.preventDefault();const e=n.querySelector(".comment-input"),s=e.value.trim();if(!s)return;let t,r,l,i;window.location.pathname.endsWith("post.html")?(t=document.getElementById("singlePostContainer"),r=t.querySelector(".comments-list"),l=t.querySelector(".comment-btn").dataset.slug,i=t.querySelector(".comment-count")):(t=n.closest(".post"),r=t.querySelector(".comments-list"),l=t.querySelector(".like-btn").dataset.slug,i=t.querySelector(".comment-count"));const c=u=>{a.disabled=u,a.innerHTML=u?'<i class="fa-solid fa-spinner fa-spin"></i>':"Comment"};try{if(c(!0),!window.currentUser){d("Please log in to comment.","error"),e.value="",c(!1);return}await Fe(l,s,r,i),e.value=""}catch{c(!1)}finally{c(!1)}}function Ge(){document.addEventListener("submit",xe)}const Ne=document.querySelectorAll(".search");let w={all:[],mine:[],saved:[]},I=1,g=Number(sessionStorage.getItem("postsPage"))||1,Xe=sessionStorage.getItem("postsCategory")||"",Ze=sessionStorage.getItem("postsSearch")||"";function K(o){return o&&o.startsWith("http")?o:"/Images/fallback.jpg"}let _;function Q(o="allPostsContainer",n=6){clearTimeout(_);const a=document.getElementById("postsSkeleton");if(a){a.innerHTML="",a.classList.remove("hidden");for(let e=0;e<n;e++){let s="";o==="savedPostsContainer"?s=`
        <article class="post-card skeleton">
          <div class="skeleton-img"></div>
          <div class="post-body">
            <div class="skeleton-title"></div>
            <div class="skeleton-tag"></div>
            <div class="skeleton-excerpt"></div>
            <div class="post-meta">
              <div class="skeleton-meta-line"></div>
            </div>
          </div>
          <div class="skeleton-bookmark"></div>
        </article>
      `:s=`
        <div class="post skeleton">
          <div class="skeleton-img"></div>
          <p class="skeleton-tag"></p>
          <h2 class="skeleton-title"></h2>
          <p class="skeleton-excerpt"></p>
          <a href="#" class="skeleton-author"></a>
          <small class="skeleton-date"></small>
          <div class="post-interactions-container">
            <div class="post-interactions">
              <button class="skeleton-btn like-btn"></button>
              <button class="skeleton-btn comment-btn"></button>
              <button class="skeleton-btn share-btn"></button>
            </div>
            <span class="liked-by likes-info skeleton"></span>
          </div>
          <div class="comments-section skeleton"></div>
          <div class="post-actions skeleton"></div>
        </div>
      `,a.insertAdjacentHTML("beforeend",s)}}}function G(){document.getElementById("postsSkeleton")?.classList.add("hidden")}function X(){clearTimeout(_),_=setTimeout(()=>{document.getElementById("postsLoader")?.classList.remove("hidden")},150)}function Z(){clearTimeout(_),document.getElementById("postsLoader")?.classList.add("hidden")}function U(o){const n=new URL(window.location);o===1?n.searchParams.delete("page"):n.searchParams.set("page",o);const a=sessionStorage.getItem("postsCategory"),e=sessionStorage.getItem("postsSearch");a?n.searchParams.set("category",a):n.searchParams.delete("category"),e?n.searchParams.set("search",e):n.searchParams.delete("search"),window.history.pushState({},"",n)}function ee(){const o=new URLSearchParams(window.location.search);return Number(o.get("page"))||1}async function et(){const o=sessionStorage.getItem("postsCategory"),n=sessionStorage.getItem("postsSearch"),a=document.getElementById("categoryFilter");a&&o&&(a.value=o),document.querySelectorAll(".search").forEach(s=>{n&&(s.value=n)})}async function z(o,n=6){try{const a=o??ee(),e=document.getElementById("categoryFilter")?.value,s=document.querySelectorAll(".search"),t=new URLSearchParams;t.append("page",a),t.append("limit",n),e&&e!=="all"&&t.append("category",e),s.forEach(c=>{if(c){const u=c.value.trim();u&&t.append("search",u)}}),a===1?Q("allPostsContainer",n):X();const l=await(await m(`${p}?${t.toString()}`)).json();w.all=Array.isArray(l.posts)?l.posts:[],g=l.currentPage??1,I=l.totalPages??1,U(g),typeof g<"u"&&sessionStorage.setItem("postsPage",g),sessionStorage.setItem("postsCategory",e&&e!=="all"?e:"");const i=[...s].find(c=>c.value.trim())?.value.trim()||"";sessionStorage.setItem("postsSearch",i),B("allPostsContainer"),se("allPostsContainer",g,I)}catch(a){console.error("Error fetching posts:",a),d("Something went wrong while displaying posts!","error")}finally{G(),Z()}}async function le(o,n=6){try{const a=o??ee(),e=document.querySelectorAll(".search"),s=new URLSearchParams;s.append("page",a),s.append("limit",n),e.forEach(c=>{if(c){const u=c.value.trim();u&&s.append("search",u)}}),a===1?Q("myPostsContainer",n):X();const t=await m(`${p}/mine?${s.toString()}`);if(!t.ok){const c=await t.text();throw new Error(c||"Failed to fetch your posts")}const r=await t.json();w.mine=Array.isArray(r.posts)?r.posts:[],g=r.currentPage||1,I=r.totalPages||1,U(g),sessionStorage.setItem("postsPage",g);const l=[...e].find(c=>c.value.trim())?.value.trim()||"";sessionStorage.setItem("postsSearch",l);const i="myPostsContainer";B("myPostsContainer"),se(i,g,I)}catch(a){console.error("Error fetching my posts:",a),d("Failed to load your posts!","error")}finally{G(),Z()}}function A(o){const n=Math.floor((Date.now()-new Date(o))/1e3),a=[{label:"year",seconds:31536e3},{label:"month",seconds:2592e3},{label:"day",seconds:86400},{label:"hour",seconds:3600},{label:"minute",seconds:60},{label:"second",seconds:1}],e=new Intl.RelativeTimeFormat("en",{numeric:"auto"});for(const s of a){const t=Math.floor(n/s.seconds);if(t>=1)return e.format(-t,s.label)}return"Just now"}function te(o){return o.replace(/\n/g,"<br>")}function B(o,n=null){const a=window.currentUser?._id||window.currentUser?.id,e=document.getElementById(o);if(!e)return;e.innerHTML="";let s=[];if(o==="allPostsContainer"||o==="featuredPostsContainer"?s=[...w.all]:o==="myPostsContainer"?s=[...w.mine]:o==="savedPostsContainer"&&(s=[...w.saved]),n&&(s=s.slice(0,n)),s.length===0){o==="myPostsContainer"?e.innerHTML=`<p style="text-align:center; color:gray; font-size: 20px; font-weight: bold;">You haven't made any posts yet...</p>`:e.innerHTML='<p style="text-align:center; color:gray; font-size:20px;">No results found...</p>';return}s.forEach(t=>{const r=document.createElement("div");r.classList.add("post");const l=t.content.length>150?t.content.substring(0,150)+"...":t.content,i=typeof t.authorId=="object"&&t.authorId!==null?t.authorId._id:t.authorId,c=typeof t.authorId=="object"&&t.authorId!==null?t.authorId.name:t.authorName||"Unknown",u=a&&String(i)===String(a);r.innerHTML=`
      ${t.image?`<a href="post.html?slug=${t.slug}">
             <img src="${K(t.image)}" alt="${t.title}" class="post-image" loading="lazy">
           </a>`:""}
        <p class="tag">${t.category}</p>
        <h2>
          <a href="post.html?slug=${t.slug}" class="post-link">${t.title}</a>
        </h2>
        <p>${l} <a href="post.html?slug=${t.slug}" class="read-more">Read more</a></p>
        <a href="profile.html?id=${i}" class="author"><em>By ${c}</em></a>
        <small title="${new Date(t.date).toLocaleString()}">
          ${A(t.date)}
        </small>
        <br>
        <div class="post-interactions-container">
          <div class="post-interactions">
            <button class="like-btn ${t.likedByUser?"liked":""}" data-slug="${t.slug}">
              <i class="${t.likedByUser?"fa-solid":"fa-regular"} fa-heart"></i>
              <span class="like-count">${t.likesCount||0}</span>
            </button>
            <button class="comment-btn" data-slug="${t.slug}">
              <i class="fa-regular fa-comment"></i>
              <span class="comment-count">${t.commentsCount||0}</span>
            </button>
            <button class="share-btn" data-slug="${t.slug}">
              <i class="fa-solid fa-share"></i>
              <span class="share-count">${t.shares}</span>
            </button>
          </div>
          <span class="liked-by likes-info">No likes yet</span>
        </div>
        <div id="likesModal-${t.slug}" class="likes-modal hidden slide-up">
          <div class="likes-modal-content">
            <span id="closeLikesModal-${t.slug}" class="close-btn">&times;</span>
            <h3>Liked by</h3>
            <ul id="likesList-${t.slug}" class="likes-list"></ul>            
          </div>
        </div>
        <div class="comments-section">
          <form class="comment-form">
            <input type="text" class="comment-input" placeholder="Write a comment..." required />
            <button type="submit">Comment</button>
          </form>
          <div class="comments-list"></div>
        </div>
        ${u?`
        <div class="post-actions">
            <button class="edit-btn btn" data-slug="${t.slug}">Edit</button>
            <button class="delete-btn btn" data-slug="${t.slug}">Delete</button>
        </div>
        `:""}
    `,e.appendChild(r);const k=r.querySelector(".post-image");k&&(k.onerror=function(){this.onerror=null,this.src="/Images/fallback.jpg"});const h=r.querySelector(".like-btn"),q=h.querySelector("i"),v=r.querySelector(".liked-by");v.dataset.slug=t.slug,v.dataset.likedBy=JSON.stringify(t.likedBy||[]),t.likedBy&&t.likedBy.length>0?v.classList.remove("disabled"):v.classList.add("disabled");const F=Array.isArray(t.likes)?t.likes.map(f=>typeof f=="object"?f._id:f):[];a&&(F.includes(a)||t.likedByUser)?(h.classList.add("liked"),q.className="fa-solid fa-heart"):(h.classList.remove("liked"),q.className="fa-regular fa-heart"),!t.likedBy||t.likedBy.length===0?v.textContent="No likes yet":t.likedBy.length===1?v.textContent=`Liked by ${t.likedBy[0]}`:v.textContent=`Liked by ${t.likedBy[0]} and ${t.likedBy.length-1} others`;const x=r.querySelector(".comment-count");ie(t.slug,x)})}async function je(o,n,a,e){const s=new FormData;s.append("title",o),s.append("content",n),s.append("category",a),e&&s.append("image",e);const t=await m(`${p}`,{method:"POST",body:s});if(!t.ok)throw new Error("Failed to add post");return await t.json()}async function tt(o){if(confirm("Are you sure you want to delete this post?"))try{const n=await m(`${p}/${o}`,{method:"DELETE"});if(!n.ok){const a=await n.text();throw new Error(a||"Failed to delete post")}d("Post deleted successfully!","success"),window.location.pathname.endsWith("my-posts.html")?le(g):z(g)}catch(n){console.error("Error deleting post:",n),d("Failed to delete post!","error")}}function st(o){o&&(localStorage.setItem("editSlug",o),window.location.href="write.html")}function ot(){const o=document.getElementById("postForm"),n=document.querySelector(".add-post-btn");if(!o)return;const a=localStorage.getItem("editSlug"),e=s=>{n.disabled=s,n.innerHTML=s?'<i class="fa-solid fa-spinner fa-spin"></i> Posting...':a?"Update Post":"Add Post"};a&&a!=="null"?((async()=>{try{const s=await m(`${p}/${a}`);if(!s.ok)throw new Error("Post not found");const t=await s.json();if(document.getElementById("title").value=t.title||"",document.getElementById("content").value=t.content||"",document.getElementById("category").value=t.category||"",t.image){const r=document.getElementById("imagePreview");r.src=t.image,r.style.display="block"}}catch(s){console.error("Error loading post:",s)}})(),o.onsubmit=async function(s){s.preventDefault();const t=new FormData;t.append("title",document.getElementById("title").value),t.append("content",document.getElementById("content").value),t.append("category",document.getElementById("category").value);const r=document.getElementById("image").files[0];r&&t.append("image",r);try{e(!0);const l=await m(`${p}/${a}`,{method:"PUT",body:t});l.ok?(d("Post updated successfully!","success"),localStorage.removeItem("editSlug"),window.location.href="all-posts.html"):console.error("Update failed:",await l.text())}catch(l){console.error("Error updating post:",l),d("Failed to update post!","error")}finally{e(!1)}}):(localStorage.removeItem("editSlug"),o?.addEventListener("submit",async function(s){s.preventDefault();const t=document.getElementById("title").value,r=document.getElementById("content").value,l=document.getElementById("category").value,i=document.getElementById("image").files[0];console.log("Submitting new post:",{title:t,content:r,category:l,imageFile:i});try{e(!0);const c=await je(t,r,l,i);console.log("Post created successfully!",c),d("Post created successfully!","success"),o.reset(),window.location.href="all-posts.html",localStorage.removeItem("editSlug")}catch(c){console.error("Error adding post:",c),d("Failed to add post!","error")}finally{e(!1)}}))}async function nt(){const n=new URLSearchParams(window.location.search).get("slug")||window.location.pathname.split("/").pop();if(n&&m(`/api/posts/${n}/view`,{method:"POST"}).catch(a=>{console.error("Failed to increment view",a)}),!!n){try{let ce=function(y){f.dataset.saved=y?"true":"false",f.classList.toggle("saved",y);const L=f.querySelector("i");L.classList.toggle("fa-solid",y),L.classList.toggle("fa-regular",!y)};const a=await m(`${p}/${n}`);if(!a.ok)throw new Error("Failed to fetch post");const e=await a.json(),s=window.currentUser?._id||window.currentUser?.id,t=typeof e.authorId=="object"&&e.authorId!==null?e.authorId._id:e.authorId,r=typeof e.authorId=="object"&&e.authorId!==null?e.authorId.name:e.authorName||"Unknown",l=s&&String(t)===String(s),i=document.getElementById("singlePostContainer");i.innerHTML=`
      ${e.image?`<img src="${K(e.image)}" alt="${e.title}" class="post-image" loading="lazy">`:""}
      <h1>${e.title}</h1>
      <p class="tag">${e.category}</p>
      <p onclick="window.location.href='profile.html?id=${t}'" style="cursor: pointer;" class="author"><em>By ${r}</em></p>
      <small title="${new Date(e.date).toLocaleString()}">
        ${A(e.date)}
      </small>
      <div class="content">
        <p>${te(e.content)}</p>
      </div>
      <div class="post-interactions-container">
        <div class="post-interactions">
          <button class="like-btn ${e.likedByUser?"liked":""}" data-slug="${e.slug}">
            <i class="${e.likedByUser?"fa-solid":"fa-regular"} fa-heart"></i>
            <span class="like-count">${e.likesCount||0}</span>
          </button>
          <button class="comment-btn" data-slug="${e.slug}">
            <i class="fa-regular fa-comment"></i>
            <span class="comment-count">${e.commentsCount||0}</span>
          </button>
          <button class="share-btn" data-slug="${e.slug}">
            <i class="fa-solid fa-share"></i>
            <span class="share-count">${e.shares}</span>
          </button>
          <span class="bookmark ${e.savedByUser?"saved":""}" data-saved="${e.savedByUser?"true":"false"}" data-slug="${e.slug}">
            <i class="${e.savedByUser?"fa-solid":"fa-regular"} fa-bookmark"></i>
          </span>
        </div>
        <span class="liked-by likes-info">No likes yet</span>
      </div>
      <div id="likesModal-${e.slug}" class="likes-modal hidden slide-up">
        <div class="likes-modal-content">
          <span id="closeLikesModal-${e.slug}" class="close-btn">&times;</span>
          <h3>Liked by</h3>
          <ul id="likesList-${e.slug}" class="likes-list"></ul>            
        </div>
      </div>
      <div class="comments-section show">
        <form class="comment-form">
          <input type="text" class="comment-input" placeholder="Write a comment..." required />
          <button type="submit">Comment</button>
        </form>
        <div class="comments-list"></div>
      </div>
      ${l?`
      <div class="post-actions">
        <button class="edit-btn btn" data-slug="${e.slug}">Edit</button>
        <button class="delete-btn btn" data-slug="${e.slug}">Delete</button>
      </div>`:""}
    `;const c=i.querySelector(".post-image");c&&(c.onerror=function(){this.onerror=null,this.src="/Images/fallback.jpg"});const u=i?.querySelector(".like-btn"),k=u?.querySelector("i"),h=i?.querySelector(".liked-by");h.dataset.slug=e.slug,h.dataset.likedBy=JSON.stringify(e.likedBy||[]),e.likedBy&&e.likedBy.length>0?h.classList.remove("disabled"):h.classList.add("disabled");const q=Array.isArray(e.likes)?e.likes.map(y=>typeof y=="object"?y._id:y):[];s&&(q.includes(s)||e.likedByUser)?(u.classList.add("liked"),k.className="fa-solid fa-heart"):(u.classList.remove("liked"),k.className="fa-regular fa-heart"),!e.likedBy||e.likedBy.length===0?h.textContent="No likes yet":e.likedBy.length===1?h.textContent=`Liked by ${e.likedBy[0]}`:h.textContent=`Liked by ${e.likedBy[0]} and ${e.likedBy.length-1} others`;const v=i.querySelector(".comment-count");ie(e.slug,v);const F=document.querySelector(".comments-section"),x=F.querySelector(".comments-list");F&&x&&await re(e.slug,x,1/0);const f=i.querySelector(".bookmark");f?.addEventListener("click",async()=>{const y=f.dataset.slug,L=f.dataset.saved==="true";if(!window.currentUser){d("Please log in to save posts");return}f.classList.add("clicked"),setTimeout(()=>f.classList.remove("clicked"),200);const de=L?`/api/posts/${y}/unsave`:`/api/posts/${y}/save`;try{const N=await m(de,{method:"POST"}),me=await N.json();if(!N.ok)throw new Error(me.message||"Failed to toggle bookmark");ce(!L),d(L?"Removed from saved posts":"Post saved","success")}catch(N){console.error("Failed to toggle bookmark",N),d("Something went wrong","error")}})}catch(a){console.error(a),document.getElementById("singlePostContainer").innerHTML="<p>Error loading post.</p>"}Oe(n)}}const at=async()=>{const n=await(await m(`${p}/trending?limit=5`)).json(),a=document.getElementById("trending-list");a.innerHTML=n.map((e,s)=>`
    <li>
      <span class="trending-rank">${["🥇","🥈","🥉"][s]||`#${s+1}`}</span>
      <a href="post.html?slug=${e.slug}" class="trending-title">${e.title}</a>
      <i class="fa-solid fa-bolt trending-icon" title="Trending now"></i>
    </li>
  `).join("")};function De(o){const n=document.getElementById("related-posts-container");if(!o.length){n.innerHTML="<p style='margin: 0 5px;'>No related posts found.</p>";return}n.innerHTML=o.map(a=>`
      <article class="related-post-card">
        <h4><a href="post.html?slug=${a.slug}">${a.title}</a></h4>
        <small>${a.category}</small>
      </article>
    `).join("")}const Oe=async o=>{try{const a=await(await m(`${p}/slug/${o}/related`)).json();De(a)}catch(n){console.error("Failed to fetch related posts.",n)}},He=document.getElementById("savedPostsContainer");async function _e(o,n=6){try{const a=o??ee(),e=document.querySelectorAll(".search"),s=new URLSearchParams;s.append("page",a),s.append("limit",n),e.forEach(i=>{if(i){const c=i.value.trim();c&&s.append("search",c)}}),a===1?Q("savedPostsContainer",n):X();const t=await m(`${p}/saved/me?${s.toString()}`);if(!t.ok)throw new Error("Failed to fetch");const r=await t.json();w.saved=Array.isArray(r.posts)?r.posts:[],g=r.currentPage||1,I=r.totalPages||1,U(g),sessionStorage.setItem("postsPage",g);const l=He;if(!l)return;if(w.saved.length===0){l.innerHTML="<p>You have no saved posts yet.</p>";return}l.innerHTML=w.saved.map(i=>`
      <article class="post-card">
        ${i.image?`
          <img 
            src="${K(i.image)}" 
            alt="${i.title}" 
            class="post-image"
            loading="lazy"
            onclick="window.location.href='post.html?slug=${i.slug}'"
          >
        `:""}
        <div class="post-body" onclick="window.location.href='post.html?slug=${i.slug}'">
          <h2>${i.title}</h2>
          <p class="tag">${i.category}</p>
          <p class="excerpt">
            ${i.content.slice(0,150)}...
          </p>
          <div class="post-meta">
            <small>By ${i.authorId?.name||"Unknown"}</small>
            <small title="${new Date(i.date).toLocaleString()}">${A(i.date)}</small>
          </div>
        </div>
        <button 
          class="bookmark saved"
          data-slug="${i.slug}"
          title="Remove from saved"
        >
          <i class="fa-solid fa-bookmark"></i>
        </button>
      </article>
    `).join(""),document.querySelectorAll(".bookmark").forEach(i=>{i?.addEventListener("click",async c=>{c.stopPropagation();const u=i.dataset.slug;try{await m(`${p}/${u}/unsave`,{method:"POST"}),i.closest(".post-card").remove(),d("Removed from saved posts","success")}catch(k){console.error(k),d("Failed to remove","error")}})}),se("savedPostsContainer",g,I)}catch(a){console.error(a),container.innerHTML="<p>Error loading saved posts.</p>"}finally{G(),Z()}}function Re(){document.getElementById("allPostsContainer")&&B("allPostsContainer"),document.getElementById("featuredPostsContainer")&&B("featuredPostsContainer",3),document.getElementById("myPostsContainer")&&B("myPostsContainer")}document.getElementById("categoryFilter")?.addEventListener("change",()=>{U(1),z(1)});Ne.forEach(o=>o?.addEventListener("keyup",()=>{U(1),z(1)}));function se(o,n,a){const e=document.getElementById("pagination");if(e){e.innerHTML="";for(let s=1;s<=a;s++){const t=document.createElement("button");t.textContent=s,t.className=s===n?"pg-active":"",t?.addEventListener("click",()=>{o==="myPostsContainer"?le(s):o==="savedPostsContainer"?_e(s):z(s)}),e.appendChild(t)}}}export{nt as A,_e as B,ae as C,m as a,Y as b,he as c,tt as d,st as e,g as f,Xe as g,Qe as h,Ze as i,Ve as j,Ye as k,We as l,ye as m,Ge as n,Je as o,ze as p,ot as q,Re as r,d as s,Ke as t,C as u,et as v,z as w,ee as x,at as y,le as z};
