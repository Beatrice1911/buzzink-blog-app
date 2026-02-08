(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))e(o);new MutationObserver(o=>{for(const t of o)if(t.type==="childList")for(const r of t.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&e(r)}).observe(document,{childList:!0,subtree:!0});function a(o){const t={};return o.integrity&&(t.integrity=o.integrity),o.referrerPolicy&&(t.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?t.credentials="include":o.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function e(o){if(o.ep)return;o.ep=!0;const t=a(o);fetch(o.href,t)}})();const p="/api/posts",U="/api/auth",_="/api/comments",re="https://i.postimg.cc/KvF0rh0Q/custom-default-avatar.png",ie=document.body,K=document.querySelectorAll(".user-icon"),T=document.getElementById("userMenuDetails"),N=document.getElementById("authModal"),ve=document.getElementById("closeModal"),I=document.getElementById("loginTab"),P=document.getElementById("registerTab"),we=document.querySelectorAll(".write-post"),ke=document.querySelector(".search-icon"),V=document.getElementById("mobileSearch"),be=document.querySelector(".menu-toggle"),Ee=document.getElementById("mobileMenu"),M=document.querySelector(".logo"),Le=document.querySelector(".all-posts-btn"),Se=document.getElementById("myPosts"),$e=document.getElementById("savedPosts"),Ie=document.getElementById("profile-edit"),Pe=document.getElementById("settings"),j=document.getElementById("themeToggle"),D=document.documentElement;function d(s,n="info",a=5e3){const e=document.getElementById("toast-container");if(!e)return;const o=document.createElement("div");o.className=`toast toast-${n}`;const t=document.createElement("i");n==="success"?t.className="fas fa-check-circle":n==="error"?t.className="fas fa-exclamation-circle":t.className="fas fa-info-circle",o.appendChild(t);const r=document.createElement("span");r.textContent=s,o.appendChild(r),e.appendChild(o),setTimeout(()=>{o.style.animation="slideOut 0.5s forwards",o?.addEventListener("animationend",()=>o.remove())},a)}function Ce(){be?.addEventListener("click",s=>{s.stopPropagation(),T.classList.contains("show")&&T.classList.remove("show"),Ee.classList.toggle("active")})}function Be(){M?.addEventListener("click",()=>{window.location.href="index.html"}),Le?.addEventListener("click",()=>{window.location.href="all-posts.html"}),Se?.addEventListener("click",()=>{window.location.href="my-posts.html"}),Ie?.addEventListener("click",()=>{window.location.href="dashboard.html"}),$e?.addEventListener("click",()=>{window.location.href="saved.html"}),Pe?.addEventListener("click",()=>{window.location.href="settings.html"})}function Te(){I?.addEventListener("click",()=>{E.classList.remove("hidden"),L.classList.add("hidden"),I.classList.add("active"),P.classList.remove("active")}),P?.addEventListener("click",()=>{L.classList.remove("hidden"),E.classList.add("hidden"),P.classList.add("active"),I.classList.remove("active")}),ve?.addEventListener("click",()=>{N.classList.add("hidden")})}function Me(){K.forEach(s=>s?.addEventListener("click",()=>{const n=localStorage.getItem("user"),a=n?JSON.parse(n):null;a&&a.id?(T.classList.toggle("show"),N.classList.add("hidden")):(T.classList.add("hidden"),N.classList.remove("hidden"),I.classList.add("active"),P.classList.remove("active"),E.classList.remove("hidden"),L.classList.add("hidden"),E?.reset(),L?.reset())}))}function Ue(){ke?.addEventListener("click",()=>{V.classList.toggle("show"),V.classList.contains("show")&&V.querySelector("input").focus()})}function Fe(){we.forEach(s=>{s?.addEventListener("click",n=>{const a=localStorage.getItem("user"),e=a?JSON.parse(a):null;!e||!e.id?(n.preventDefault(),N.classList.remove("hidden"),I.classList.add("active"),P.classList.remove("active"),E.classList.remove("hidden"),L.classList.add("hidden")):(localStorage.removeItem("editSlug"),window.location.href="write.html")})})}function qe(){j?.addEventListener("change",()=>{j.checked?(D.setAttribute("data-theme","dark"),localStorage.setItem("theme","dark"),M.src="/Images/logo-dark-theme_optimized_.png"):(D.setAttribute("data-theme","light"),localStorage.setItem("theme","light"),M.src="/Images/logo_optimized.png")})}function Ye(){localStorage.getItem("theme")==="dark"?(D.setAttribute("data-theme","dark"),j&&(j.checked=!0)):D.setAttribute("data-theme","light"),fe()}function Ke(s){s==="dark"?(ie.classList.add("dark"),M.src="/Images/logo-dark-theme_optimized_.png"):(ie.classList.remove("dark"),M.src="/Images/logo_optimized.png"),localStorage.setItem("theme",s)}function Qe(){Ce(),Te(),Me(),Ue(),Fe(),Be(),qe()}const E=document.getElementById("loginForm"),L=document.getElementById("registerForm"),Ae=document.getElementById("logoutBtn");function J(s){return s?{...s,id:s.id||s._id}:null}window.currentUser=(()=>{const s=localStorage.getItem("user");return s?J(JSON.parse(s)):null})();function $(s){s?.id?K.forEach(n=>n.title=`Logged in as ${s.name}`):(K.forEach(n=>n.title="Click to Login/Register"),T?.classList.remove("show"))}async function O(s){try{const n=await m("/api/users/me");if(!n.ok)return;s=await n.json();const a=document.querySelectorAll(".user-icon");a&&a.forEach(o=>{o.src=s.profilePhoto?.trim()?s.profilePhoto:re});const e=document.querySelectorAll(".avatar");e&&e.forEach(o=>{o.src=s.profilePhoto?.trim()?s.profilePhoto:re}),window.currentUser=s}catch(n){console.warn("Failed to load auth user:",n)}}function xe(){E?.addEventListener("submit",async s=>{s.preventDefault();const n=document.getElementById("loginEmail").value,a=document.getElementById("loginPassword").value;console.log("Login Triggered");const e=await m(`${U}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:n,password:a})}),o=await e.json();console.log("Login response:",o),e.ok||d(`Login failed: ${o.message||"Unknown error"}`,"error");const t=J(o.user);localStorage.setItem("user",JSON.stringify(t)),window.currentUser=t,localStorage.setItem("role",t.role),t.role==="admin"&&(window.location.href="admin.html"),$(t),O(t),authModal.classList.add("hidden"),E.reset(),d(`Welcome back, ${t.name}!`,"success"),fe()})}function Ne(){L?.addEventListener("submit",async s=>{s.preventDefault();const n=document.getElementById("registerName").value,a=document.getElementById("registerEmail").value,e=document.getElementById("registerPassword").value,o=await m(`${U}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:n,email:a,password:e})}),t=await o.json();console.log("Register response:",t),o.ok||d(`Registration failed: ${t.message||"Unknown error"}`,"error");const r=J(t.user);localStorage.setItem("user",JSON.stringify(r)),window.currentUser=r,localStorage.setItem("role",r.role),$(r),O(r),authModal.classList.add("hidden"),L.reset(),d(`Welcome, ${r.name}! Your account has been created.`,"success")})}function je(){Ae?.addEventListener("click",()=>{ce(),window.location.href="index.html"})}async function Ge(){try{const s=await m(`${U}/me`);if(!s.ok)throw new Error("Not authenticated");const n=await s.json(),a=J(n);return localStorage.setItem("user",JSON.stringify(a)),window.currentUser=a,$(a),O(a),a}catch{return $(null),O(null),null}}async function ce(s=!1){try{await fetch(`${U}/logout`,{method:"POST",credentials:"include"})}catch(n){console.warn("Logout request failed:",n)}localStorage.removeItem("user"),window.currentUser=null,$(null),s||d("You have been logged out.","info")}function De(){const s=document.getElementById("forgotPasswordLink"),n=document.getElementById("forgotPasswordModal"),a=document.getElementById("closeForgotModal"),e=document.getElementById("forgotPasswordForm");s&&s?.addEventListener("click",o=>{o.preventDefault(),n.classList.remove("hidden")}),a&&a?.addEventListener("click",()=>{n.classList.add("hidden")}),e&&e?.addEventListener("submit",async o=>{o.preventDefault();const t=document.getElementById("forgotEmail").value.trim();try{const i=await(await fetch("/api/auth/forgot-password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t})})).json();d(i.message||"Check your email for the reset link.","success"),n.classList.add("hidden")}catch(r){console.error(r),d("Failed to send reset link. Try again.","error")}})}function Xe(){xe(),Ne(),je(),De()}async function m(s,n={}){let a=await fetch(s,{credentials:"include",...n});return a.status===401&&(await Oe()?a=await fetch(s,{credentials:"include",...n}):ce(!0)),a}async function Oe(){try{const s=await fetch(`${U}/refresh`,{method:"POST",credentials:"include"});if(!s.ok)throw new Error("Refresh failed");const n=await s.json();return window.currentUser=n.user,$(n.user),!0}catch{return!1}}async function Ze(s){const n=s.dataset.slug;if(!n)return;const a=window.location.pathname.endsWith("post.html"),e=a?document.getElementById("singlePostContainer"):s.closest(".post");if(!e)return;const o=e.querySelector(".comments-section"),t=o?.querySelector(".comments-list");!o||!t||(a||o.classList.toggle("show"),(a||o.classList.contains("show"))&&await de(n,t))}async function et(s){if(s.dataset.deleting==="true")return;s.dataset.deleting="true";const n=s.dataset.commentId;if(!confirm("Are you sure you want to delete this comment?")){s.dataset.deleting="false";return}try{const e=await m(`${_}/${n}`,{method:"DELETE"}),o=await e.json();if(e.ok){const t=s.closest(".comment");t&&t.remove();const i=(window.location.pathname.endsWith("post.html")?document.getElementById("singlePostContainer"):s.closest(".post"))?.querySelector(".comment-count");if(i){let l=parseInt(i.textContent)||0;l=Math.max(l-1,0),i.textContent=l,i.title=`${l} comment${l!==1?"s":""}`}d("Comment deleted successfully!","success")}else throw new Error(o.message||"Delete failed")}catch(e){console.error("Error deleting comment:",e),d("Error deleting comment. Please try again.","error")}finally{s.dataset.deleting="false"}}async function de(s,n,a=3){try{n.innerHTML='<p class="loading-comments">Loading comments...</p>';const e=await m(`${_}/post/${s}?_=${Date.now()}`);if(!e.ok)throw new Error("Failed to fetch comments");const o=await e.json();if(n.innerHTML="",o.length===0){n.innerHTML="<p class='no-comments'>No comments yet. Be the first to comment!</p>";return}const t=o.slice(0,a);if(Y(t,n),o.length>a){const r=document.createElement("button");r.classList.add("view-more-btn"),r.textContent=`View all ${o.length} comments`;const i=document.createElement("div");i.classList.add("comments-scroll-container"),i.style.display="none",Y(o,i);let l=!1;r?.addEventListener("click",()=>{l=!l,l?(n.innerHTML="",n.appendChild(i),n.appendChild(r),i.style.display="block",r.textContent="View less comments"):(n.innerHTML="",Y(t,n),r.textContent=`View all ${o.length} comments`,n.appendChild(r))}),n.appendChild(r)}}catch(e){console.error("Error fetching comments:",e),n.innerHTML="<p class='error-comments'>Failed to load comments.</p>"}}function Y(s,n){const a=window.currentUser?.id||window.currentUser?._id;s.forEach(e=>{const o=document.createElement("div");o.classList.add("comment");const t=typeof e.authorId=="object"?e.authorId._id:e.authorId,r=a&&t&&t.toString()===a.toString();o.innerHTML=`
      <div class="comment-header">
        <p><strong class="comment-author" style="cursor: pointer;">${e.authorId?.name||"Anonymous"}:</strong> ${ae(e.text)}</p>
        ${r?`<div class="comment-menu">
                  <button class="menu-btn">⋮</button>
                  <div class="menu-options hidden">
                    <button class="delete-comment-btn" data-comment-id="${e._id}">Delete</button>
                  </div>
                </div>`:""}
      </div>  
      <small title="${new Date(e.createdAt).toLocaleString()}">
        ${q(e.createdAt)}
      </small>
    `,n.appendChild(o),o.querySelector(".comment-author")?.addEventListener("click",()=>{window.location.href=`profile.html?id=${e.authorId?._id}`})})}async function He(s,n,a,e){try{const o=await m(`${_}/post/${s}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:n})});if(o.ok){const r=(await o.json()).comment,i=document.createElement("div");if(i.classList.add("comment"),i.innerHTML=`
        <div class="comment-header">
          <p><strong>You:</strong> ${ae(r.text)}</p>
          <div class="comment-menu">
            <button class="menu-btn">⋮</button>
            <div class="menu-options hidden">
              <button class="delete-comment-btn" data-comment-id="${r._id}">Delete</button>
            </div>
          </div>
        </div>
        <small title="${new Date(r.createdAt).toLocaleString()}">
        ${q(r.createdAt)}
      </small>
      `,a.prepend(i),e&&e){let l=parseInt(e.textContent)||0;e.textContent=l+1,e.title=`${l+1} comments`}d("Comment posted successfully!","success")}else throw new Error("Failed to post comment")}catch(o){console.error("Error posting comment:",o),d("Failed to post comment","error")}}async function me(s,n){try{const a=await m(`${_}/post/${s}`);if(!a.ok)throw new Error("Failed to fetch comment count");const o=(await a.json()).length;o===0?(n.textContent="0",n.title="No comments yet"):(n.textContent=o,n.title=`${o} comment${o>1?"s":""}`)}catch(a){console.error("Error fetching comment count:",a),n.textContent="0"}}async function Re(s){const n=s.target.closest(".comment-form"),a=n.querySelector(".comment-form button");if(!n)return;s.preventDefault();const e=n.querySelector(".comment-input"),o=e.value.trim();if(!o)return;let t,r,i,l;window.location.pathname.endsWith("post.html")?(t=document.getElementById("singlePostContainer"),r=t.querySelector(".comments-list"),i=t.querySelector(".comment-btn").dataset.slug,l=t.querySelector(".comment-count")):(t=n.closest(".post"),r=t.querySelector(".comments-list"),i=t.querySelector(".like-btn").dataset.slug,l=t.querySelector(".comment-count"));const c=f=>{a.disabled=f,a.innerHTML=f?'<i class="fa-solid fa-spinner fa-spin"></i>':"Comment"};try{if(c(!0),!window.currentUser){d("Please log in to comment.","error"),e.value="",c(!1);return}await He(i,o,r,l),e.value=""}catch{c(!1)}finally{c(!1)}}function tt(){document.addEventListener("submit",Re)}const G=document.querySelectorAll(".search");function X(){return[...G].find(s=>s.value.trim())?.value.trim()||""}let h={all:[],mine:[],saved:[]},b=1,u=Number(sessionStorage.getItem("postsPage"))||1,C=sessionStorage.getItem("postsCategory")||"",H=sessionStorage.getItem("postsSearch")||"";function Z(s){return s&&s.startsWith("http")?s:"/Images/fallback.jpg"}let _e,Q;function ee(s="allPostsContainer",n=6){clearTimeout(_e);const a=document.getElementById(s);if(!a)return;let e=a.previousElementSibling?.classList.contains("posts-skeleton")?a.previousElementSibling:null;e||(e=document.createElement("div"),e.className="posts-skeleton",a.before(e)),e.innerHTML="",e.classList.remove("hidden");for(let o=0;o<n;o++){let t="";s==="savedPostsContainer"?t=`
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
      `:t=`
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
      `,e.insertAdjacentHTML("beforeend",t)}}function te(){document.querySelectorAll(".posts-skeleton").forEach(s=>s.classList.add("hidden"))}function se(){clearTimeout(Q),Q=setTimeout(()=>{document.getElementById("postsLoader")?.classList.remove("hidden")},150)}function oe(){clearTimeout(Q),document.getElementById("postsLoader")?.classList.add("hidden")}function ne(){const s=new URLSearchParams(window.location.search);return{page:Number(s.get("page"))||1,category:s.get("category")||"",search:s.get("search")||""}}function F({page:s,category:n,search:a}){const e=new URL(window.location);s===1?e.searchParams.delete("page"):e.searchParams.set("page",s),n?e.searchParams.set("category",n):e.searchParams.delete("category"),a?e.searchParams.set("search",a):e.searchParams.delete("search"),window.history.pushState({},"",e)}async function st(){const s=sessionStorage.getItem("postsCategory"),n=sessionStorage.getItem("postsSearch"),a=document.getElementById("categoryFilter");a&&s&&(a.value=s),G.forEach(e=>{e.value=n||""})}async function z(s,n=6){try{const a=ne(),e=s??a.page,o=document.getElementById("categoryFilter")?.value||a.category,t=X()||a.search,r=new URLSearchParams;r.append("page",e),r.append("limit",n),o&&o!=="all"&&r.append("category",o),t&&r.append("search",t),e===1?ee("allPostsContainer",n):se();const l=await(await m(`${p}?${r.toString()}`)).json();h.all=Array.isArray(l.posts)?l.posts:[],u=l.currentPage??1,b=l.totalPages??1,C=o||"",H=t||"",F({page:u,category:o&&o!=="all"?o:"",search:t}),typeof u<"u"&&sessionStorage.setItem("postsPage",u),typeof C<"u"&&sessionStorage.setItem("postsCategory",C),sessionStorage.setItem("postsSearch",H),B("allPostsContainer"),R("allPostsContainer",u,b)}catch(a){console.error("Error fetching posts:",a),d("Something went wrong while displaying posts!","error")}finally{te(),oe()}}async function ue(s,n=6){try{const a=ne(),e=s??a.page,o=X()||a.search;a.search;const t=new URLSearchParams;t.append("page",e),t.append("limit",n),o&&t.append("search",o),e===1?ee("myPostsContainer",n):se();const r=await m(`${p}/mine?${t.toString()}`);if(!r.ok){const c=await r.text();throw new Error(c||"Failed to fetch your posts")}const i=await r.json();h.mine=Array.isArray(i.posts)?i.posts:[],u=i.currentPage||1,b=i.totalPages||1,F({page:u,search:o}),typeof u<"u"&&sessionStorage.setItem("postsPage",u),sessionStorage.setItem("postsSearch",o||""),sessionStorage.removeItem("postsCategory"),C="";const l="myPostsContainer";B(l),R(l,u,b)}catch(a){console.error("Error fetching my posts:",a),d("Failed to load your posts!","error")}finally{te(),oe()}}function q(s){const n=Math.floor((Date.now()-new Date(s))/1e3),a=[{label:"year",seconds:31536e3},{label:"month",seconds:2592e3},{label:"day",seconds:86400},{label:"hour",seconds:3600},{label:"minute",seconds:60},{label:"second",seconds:1}],e=new Intl.RelativeTimeFormat("en",{numeric:"auto"});for(const o of a){const t=Math.floor(n/o.seconds);if(t>=1)return e.format(-t,o.label)}return"Just now"}function ae(s){const n=document.createElement("div");return n.textContent=s,n.innerHTML.replace(/\n/g,"<br>")}function B(s,n=null){const a=window.currentUser?._id||window.currentUser?.id,e=document.getElementById(s);if(!e)return;e.innerHTML="";let o=[];if(s==="allPostsContainer"||s==="featuredPostsContainer"?o=[...h.all]:s==="myPostsContainer"?o=[...h.mine]:s==="savedPostsContainer"&&(o=[...h.saved]),n&&(o=o.slice(0,n)),o.length===0){s==="myPostsContainer"?e.innerHTML=`<p style="text-align:center; color:gray; font-size: 20px; font-weight: bold;">You haven't made any posts yet...</p>`:e.innerHTML='<p style="text-align:center; color:gray; font-size:20px;">No results found...</p>';return}o.forEach(t=>{const r=document.createElement("div");r.classList.add("post");const i=t.content.length>150?t.content.substring(0,150)+"...":t.content,l=typeof t.authorId=="object"&&t.authorId!==null?t.authorId._id:t.authorId,c=typeof t.authorId=="object"&&t.authorId!==null?t.authorId.name:t.authorName||"Unknown",f=a&&String(l)===String(a);r.innerHTML=`
      ${t.image?`<a href="post.html?slug=${t.slug}">
             <img src="${Z(t.image)}" alt="${t.title}" class="post-image" loading="lazy">
           </a>`:""}
        <p class="tag">${t.category}</p>
        <h2>
          <a href="post.html?slug=${t.slug}" class="post-link">${t.title}</a>
        </h2>
        <p>${i} <a href="post.html?slug=${t.slug}" class="read-more">Read more</a></p>
        <a href="profile.html?id=${l}" class="author"><em>By ${c}</em></a>
        <small title="${new Date(t.date).toLocaleString()}">
          ${q(t.date)}
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
        ${f?`
        <div class="post-actions">
            <button class="edit-btn btn" data-slug="${t.slug}">Edit</button>
            <button class="delete-btn btn" data-slug="${t.slug}">Delete</button>
        </div>
        `:""}
    `,e.appendChild(r);const v=r.querySelector(".post-image");v&&(v.onerror=function(){this.onerror=null,this.src="/Images/fallback.jpg"});const g=r.querySelector(".like-btn"),W=g.querySelector("i"),y=r.querySelector(".liked-by");y.dataset.slug=t.slug,y.dataset.likedBy=JSON.stringify(t.likedBy||[]),t.likedBy&&t.likesCount>0?y.classList.remove("disabled"):y.classList.add("disabled"),g.classList.toggle("liked",t.likedByUser),W.className=t.likedByUser?"fa-solid fa-heart":"fa-regular fa-heart",t.likesCount?t.likesCount===1?y.textContent=`Liked by ${t.likedBy[0]}`:y.textContent=`Liked by ${t.likedBy[0]} and ${t.likedBy.length-1} others`:y.textContent="No likes yet";const A=r.querySelector(".comment-count");me(t.slug,A)})}async function Je(s,n,a,e){const o=new FormData;o.append("title",s),o.append("content",n),o.append("category",a),e&&o.append("image",e);const t=await m(`${p}`,{method:"POST",body:o});if(!t.ok)throw new Error("Failed to add post");return await t.json()}async function ot(s){if(confirm("Are you sure you want to delete this post?"))try{const n=await m(`${p}/${s}`,{method:"DELETE"});if(!n.ok){const a=await n.text();throw new Error(a||"Failed to delete post")}d("Post deleted successfully!","success"),window.location.pathname.endsWith("my-posts.html")?ue(u):z(u)}catch(n){console.error("Error deleting post:",n),d("Failed to delete post!","error")}}function nt(s){s&&(localStorage.setItem("editSlug",s),window.location.href="write.html")}function at(){const s=document.getElementById("postForm"),n=document.querySelector(".add-post-btn");if(!s)return;const a=localStorage.getItem("editSlug"),e=o=>{n.disabled=o,n.innerHTML=o?'<i class="fa-solid fa-spinner fa-spin"></i> Posting...':a?"Update Post":"Add Post"};a&&a!=="null"?((async()=>{try{const o=await m(`${p}/${a}`);if(!o.ok)throw new Error("Post not found");const t=await o.json();if(document.getElementById("title").value=t.title||"",document.getElementById("content").value=t.content||"",document.getElementById("category").value=t.category||"",t.image){const r=document.getElementById("imagePreview");r.src=t.image,r.style.display="block"}}catch(o){console.error("Error loading post:",o)}})(),s.onsubmit=async function(o){o.preventDefault();const t=new FormData;t.append("title",document.getElementById("title").value),t.append("content",document.getElementById("content").value),t.append("category",document.getElementById("category").value);const r=document.getElementById("image").files[0];r&&t.append("image",r);try{e(!0);const i=await m(`${p}/${a}`,{method:"PUT",body:t});i.ok?(d("Post updated successfully!","success"),localStorage.removeItem("editSlug"),window.location.href="all-posts.html"):console.error("Update failed:",await i.text())}catch(i){console.error("Error updating post:",i),d("Failed to update post!","error")}finally{e(!1)}}):(localStorage.removeItem("editSlug"),s?.addEventListener("submit",async function(o){o.preventDefault();const t=document.getElementById("title").value,r=document.getElementById("content").value,i=document.getElementById("category").value,l=document.getElementById("image").files[0];console.log("Submitting new post:",{title:t,content:r,category:i,imageFile:l});try{e(!0);const c=await Je(t,r,i,l);console.log("Post created successfully!",c),d("Post created successfully!","success"),s.reset(),window.location.href="all-posts.html",localStorage.removeItem("editSlug")}catch(c){console.error("Error adding post:",c),d("Failed to add post!","error")}finally{e(!1)}}))}async function rt(){const n=new URLSearchParams(window.location.search).get("slug")||window.location.pathname.split("/").pop();if(n&&m(`/api/posts/${n}/view`,{method:"POST"}).catch(a=>{console.error("Failed to increment view",a)}),!!n){try{let he=function(k){w.dataset.saved=k?"true":"false",w.classList.toggle("saved",k);const S=w.querySelector("i");S.classList.toggle("fa-solid",k),S.classList.toggle("fa-regular",!k)};const a=await m(`${p}/${n}`);if(!a.ok)throw new Error("Failed to fetch post");const e=await a.json(),o=window.currentUser?._id||window.currentUser?.id,t=typeof e.authorId=="object"&&e.authorId!==null?e.authorId._id:e.authorId,r=typeof e.authorId=="object"&&e.authorId!==null?e.authorId.name:e.authorName||"Unknown",i=o&&String(t)===String(o),l=document.getElementById("singlePostContainer");l.innerHTML=`
      ${e.image?`<img src="${Z(e.image)}" alt="${e.title}" class="post-image" loading="lazy">`:""}
      <h1>${e.title}</h1>
      <p class="tag">${e.category}</p>
      <p onclick="window.location.href='profile.html?id=${t}'" style="cursor: pointer;" class="author"><em>By ${r}</em></p>
      <small title="${new Date(e.date).toLocaleString()}">
        ${q(e.date)}
      </small>
      <div class="content">
        <p>${ae(e.content)}</p>
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
      ${i?`
      <div class="post-actions">
        <button class="edit-btn btn" data-slug="${e.slug}">Edit</button>
        <button class="delete-btn btn" data-slug="${e.slug}">Delete</button>
      </div>`:""}
    `;const c=l.querySelector(".post-image");c&&(c.onerror=function(){this.onerror=null,this.src="/Images/fallback.jpg"});const f=l?.querySelector(".like-btn"),v=f?.querySelector("i"),g=l?.querySelector(".liked-by");g.dataset.slug=e.slug,g.dataset.likedBy=JSON.stringify(e.likedBy||[]),e.likedBy&&e.likedBy.length>0?g.classList.remove("disabled"):g.classList.add("disabled"),o&&e.likedByUser?(f.classList.add("liked"),v.className="fa-solid fa-heart"):(f.classList.remove("liked"),v.className="fa-regular fa-heart"),!e.likedBy||e.likedBy.length===0?g.textContent="No likes yet":e.likedBy.length===1?g.textContent=`Liked by ${e.likedBy[0]}`:g.textContent=`Liked by ${e.likedBy[0]} and ${e.likedBy.length-1} others`;const W=l.querySelector(".comment-count");me(e.slug,W);const y=document.querySelector(".comments-section"),A=y.querySelector(".comments-list");y&&A&&await de(e.slug,A,1/0);const w=l.querySelector(".bookmark");w?.addEventListener("click",async()=>{const k=w.dataset.slug,S=w.dataset.saved==="true";if(!window.currentUser){d("Please log in to save posts");return}w.classList.add("clicked"),setTimeout(()=>w.classList.remove("clicked"),200);const pe=S?`/api/posts/${k}/unsave`:`/api/posts/${k}/save`;try{const x=await m(pe,{method:"POST"}),ye=await x.json();if(!x.ok)throw new Error(ye.message||"Failed to toggle bookmark");he(!S),d(S?"Removed from saved posts":"Post saved","success")}catch(x){console.error("Failed to toggle bookmark",x),d("Something went wrong","error")}})}catch(a){console.error(a),document.getElementById("singlePostContainer").innerHTML="<p>Error loading post.</p>"}We(n)}}const it=async()=>{const n=await(await m(`${p}/trending?limit=5`)).json(),a=document.getElementById("trending-list");a.innerHTML=n.map((e,o)=>`
    <li>
      <span class="trending-rank">${["🥇","🥈","🥉"][o]||`#${o+1}`}</span>
      <a href="post.html?slug=${e.slug}" class="trending-title">${e.title}</a>
      <i class="fa-solid fa-bolt trending-icon" title="Trending now"></i>
    </li>
  `).join("")};function ze(s){const n=document.getElementById("related-posts-container");if(!s.length){n.innerHTML="<p style='margin: 0 5px;'>No related posts found.</p>";return}n.innerHTML=s.map(a=>`
      <article class="related-post-card">
        <h4><a href="post.html?slug=${a.slug}">${a.title}</a></h4>
        <small>${a.category}</small>
      </article>
    `).join("")}const We=async s=>{try{const a=await(await m(`${p}/slug/${s}/related`)).json();ze(a)}catch(n){console.error("Failed to fetch related posts.",n)}},Ve=document.getElementById("savedPostsContainer");async function ge(s,n=6){const a=Ve;try{const e=ne(),o=s??e.page,t=X()||e.search,r=new URLSearchParams;r.append("page",o),r.append("limit",n),t&&r.append("search",t),o===1?ee("savedPostsContainer",n):se();const i=await m(`${p}/saved/me?${r.toString()}`);if(!i.ok)throw new Error("Failed to fetch");const l=await i.json();if(h.saved=Array.isArray(l.posts)?l.posts:[],u=l.currentPage||1,b=l.totalPages||1,H=t||"",F({page:u,search:t}),sessionStorage.setItem("postsPage",u),sessionStorage.removeItem("postsCategory"),C="",sessionStorage.setItem("postsSearch",H),!a)return;if(h.saved.length===0){a.innerHTML="<p>You have no saved posts yet.</p>";return}a.innerHTML=h.saved.map(c=>`
      <article class="post-card">
        ${c.image?`
          <img 
            src="${Z(c.image)}" 
            alt="${c.title}" 
            class="post-image"
            loading="lazy"
            onclick="window.location.href='post.html?slug=${c.slug}'"
          >
        `:""}
        <div class="post-body" onclick="window.location.href='post.html?slug=${c.slug}'">
          <h2>${c.title}</h2>
          <p class="tag">${c.category}</p>
          <p class="excerpt">
            ${c.content.slice(0,150)}...
          </p>
          <div class="post-meta">
            <small>By ${c.authorId?.name||"Unknown"}</small>
            <small title="${new Date(c.date).toLocaleString()}">${q(c.date)}</small>
          </div>
        </div>
        <button 
          class="bookmark saved"
          data-slug="${c.slug}"
          title="Remove from saved"
        >
          <i class="fa-solid fa-bookmark"></i>
        </button>
      </article>
    `).join(""),document.querySelectorAll(".bookmark").forEach(c=>{c?.addEventListener("click",async f=>{f.stopPropagation();const v=c.dataset.slug;try{await m(`${p}/${v}/unsave`,{method:"POST"}),h.saved=h.saved.filter(g=>g.slug!==v),c.closest(".post-card").remove(),d("Removed from saved posts","success"),h.saved.length===0&&u>1?ge(u-1):R("savedPostsContainer",u,b)}catch(g){console.error(g),d("Failed to remove","error")}})}),R("savedPostsContainer",u,b)}catch(e){console.error(e),a.innerHTML="<p>Error loading saved posts.</p>"}finally{te(),oe()}}function fe(){document.getElementById("allPostsContainer")&&B("allPostsContainer"),document.getElementById("featuredPostsContainer")&&B("featuredPostsContainer",3),document.getElementById("myPostsContainer")&&B("myPostsContainer")}document.getElementById("categoryFilter")?.addEventListener("change",()=>{F({page:1}),z(1)});let le;G.forEach(s=>s?.addEventListener("keyup",()=>{clearTimeout(le),le=setTimeout(()=>{F({page:1}),z(1)},400)}));function R(s,n,a){const e=document.getElementById("pagination");if(e){e.innerHTML="";for(let o=1;o<=a;o++){const t=document.createElement("button");t.textContent=o,t.className=o===n?"pg-active":"",t?.addEventListener("click",()=>{s==="myPostsContainer"?ue(o):s==="savedPostsContainer"?ge(o):z(o)}),e.appendChild(t)}}}export{ge as A,ce as B,m as a,K as b,be as c,ot as d,nt as e,u as f,C as g,et as h,H as i,Ge as j,Xe as k,Qe as l,Ee as m,tt as n,Ye as o,Ke as p,at as q,ne as r,d as s,Ze as t,T as u,st as v,z as w,it as x,ue as y,rt as z};
