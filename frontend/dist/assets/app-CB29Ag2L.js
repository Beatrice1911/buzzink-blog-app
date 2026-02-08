(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))t(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&t(r)}).observe(document,{childList:!0,subtree:!0});function a(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function t(s){if(s.ep)return;s.ep=!0;const n=a(s);fetch(s.href,n)}})();const p="/api/posts",q="/api/auth",J="/api/comments",ce="https://i.postimg.cc/KvF0rh0Q/custom-default-avatar.png",de=document.body,O=document.querySelectorAll(".user-icon"),w=document.getElementById("userMenuDetails"),H=document.getElementById("authModal"),Ee=document.getElementById("closeModal"),T=document.getElementById("loginTab"),M=document.getElementById("registerTab"),Se=document.querySelectorAll(".write-post"),$e=document.querySelector(".search-icon"),G=document.getElementById("mobileSearch"),ge=document.querySelector(".menu-toggle"),j=document.getElementById("mobileMenu"),U=document.querySelector(".logo"),Ie=document.querySelector(".all-posts-btn"),Pe=document.getElementById("myPosts"),Be=document.getElementById("savedPosts"),Ce=document.getElementById("profile-edit"),Te=document.getElementById("settings"),R=document.getElementById("themeToggle"),_=document.documentElement;function d(e,o="info",a=5e3){const t=document.getElementById("toast-container");if(!t)return;const s=document.createElement("div");s.className=`toast toast-${o}`;const n=document.createElement("i");o==="success"?n.className="fas fa-check-circle":o==="error"?n.className="fas fa-exclamation-circle":n.className="fas fa-info-circle",s.appendChild(n);const r=document.createElement("span");r.textContent=e,s.appendChild(r),t.appendChild(s),setTimeout(()=>{s.style.animation="slideOut 0.5s forwards",s?.addEventListener("animationend",()=>s.remove())},a)}function Me(){ge?.addEventListener("click",e=>{e.stopPropagation(),w.classList.contains("show")&&w.classList.remove("show"),j.classList.toggle("active")})}function Ue(){U?.addEventListener("click",()=>{window.location.href="index.html"}),Ie?.addEventListener("click",()=>{window.location.href="all-posts.html"}),Pe?.addEventListener("click",()=>{window.location.href="my-posts.html"}),Ce?.addEventListener("click",()=>{window.location.href="dashboard.html"}),Be?.addEventListener("click",()=>{window.location.href="saved.html"}),Te?.addEventListener("click",()=>{window.location.href="settings.html"})}function qe(){T?.addEventListener("click",()=>{E.classList.remove("hidden"),S.classList.add("hidden"),T.classList.add("active"),M.classList.remove("active")}),M?.addEventListener("click",()=>{S.classList.remove("hidden"),E.classList.add("hidden"),M.classList.add("active"),T.classList.remove("active")}),Ee?.addEventListener("click",()=>{H.classList.add("hidden")})}function Fe(){O.forEach(e=>e?.addEventListener("click",()=>{const o=localStorage.getItem("user"),a=o?JSON.parse(o):null;a&&a.id?(w.classList.toggle("show"),H.classList.add("hidden")):(w.classList.add("hidden"),H.classList.remove("hidden"),T.classList.add("active"),M.classList.remove("active"),E.classList.remove("hidden"),S.classList.add("hidden"),E?.reset(),S?.reset())}))}function Ae(){$e?.addEventListener("click",()=>{G.classList.toggle("show"),G.classList.contains("show")&&G.querySelector("input").focus()})}function xe(){Se.forEach(e=>{e?.addEventListener("click",o=>{const a=localStorage.getItem("user"),t=a?JSON.parse(a):null;!t||!t.id?(o.preventDefault(),H.classList.remove("hidden"),T.classList.add("active"),M.classList.remove("active"),E.classList.remove("hidden"),S.classList.add("hidden")):(localStorage.removeItem("editSlug"),window.location.href="write.html")})})}function Ne(){R?.addEventListener("change",()=>{R.checked?(_.setAttribute("data-theme","dark"),localStorage.setItem("theme","dark"),U.src="/Images/logo-dark-theme_optimized_.png"):(_.setAttribute("data-theme","light"),localStorage.setItem("theme","light"),U.src="/Images/logo_optimized.png")})}function De(){localStorage.getItem("theme")==="dark"?(_.setAttribute("data-theme","dark"),R&&(R.checked=!0)):_.setAttribute("data-theme","light")}function fe(e){e==="dark"?(de.classList.add("dark"),U.src="/Images/logo-dark-theme_optimized_.png"):(de.classList.remove("dark"),U.src="/Images/logo_optimized.png"),localStorage.setItem("theme",e)}function he(){Me(),qe(),Fe(),Ae(),xe(),Ue(),Ne()}let je,Z;function N(e="allPostsContainer",o=6){clearTimeout(je);const a=document.getElementById(e);if(!a)return;let t=a.previousElementSibling?.classList.contains("skeleton-wrapper")?a.previousElementSibling:null;t||(t=document.createElement("div"),t.className="skeleton-wrapper",a.before(t)),t.innerHTML="",t.classList.remove("hidden");for(let s=0;s<o;s++){let n="";e==="savedPostsContainer"?n=`
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
      `:n=`
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
      `,t.insertAdjacentHTML("beforeend",n)}}function V(){const e=document.querySelector(".posts-container");document.querySelectorAll(".skeleton-wrapper").forEach(o=>{o.classList.add("hide"),setTimeout(()=>o.remove(),e.classList.add("show"),300)})}function te(){clearTimeout(Z),Z=setTimeout(()=>{document.getElementById("postsLoader")?.classList.remove("hidden")},150)}function se(){clearTimeout(Z),document.getElementById("postsLoader")?.classList.add("hidden")}const E=document.getElementById("loginForm"),S=document.getElementById("registerForm"),Oe=document.getElementById("logoutBtn");function Y(e){return e?{...e,id:e.id||e._id}:null}window.currentUser=(()=>{const e=localStorage.getItem("user");return e?Y(JSON.parse(e)):null})();function P(e){e?.id?O.forEach(o=>o.title=`Logged in as ${e.name}`):(O.forEach(o=>o.title="Click to Login/Register"),w?.classList.remove("show"))}async function W(e){try{const o=await u("/api/users/me");if(!o.ok)return;e=await o.json();const a=document.querySelectorAll(".user-icon");a&&a.forEach(s=>{s.src=e.profilePhoto?.trim()?e.profilePhoto:ce});const t=document.querySelectorAll(".avatar");t&&t.forEach(s=>{s.src=e.profilePhoto?.trim()?e.profilePhoto:ce}),window.currentUser=e}catch(o){console.warn("Failed to load auth user:",o)}}function He(){E?.addEventListener("submit",async e=>{e.preventDefault();const o=document.getElementById("loginEmail").value,a=document.getElementById("loginPassword").value;console.log("Login Triggered");const t=await u(`${q}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:o,password:a})}),s=await t.json();console.log("Login response:",s),t.ok||d(`Login failed: ${s.message||"Unknown error"}`,"error");const n=Y(s.user);localStorage.setItem("user",JSON.stringify(n)),window.currentUser=n,localStorage.setItem("role",n.role),n.role==="admin"&&(window.location.href="admin.html"),P(n),W(n),authModal.classList.add("hidden"),E.reset(),d(`Welcome back, ${n.name}!`,"success"),Q()})}function Re(){S?.addEventListener("submit",async e=>{e.preventDefault();const o=document.getElementById("registerName").value,a=document.getElementById("registerEmail").value,t=document.getElementById("registerPassword").value,s=await u(`${q}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:o,email:a,password:t})}),n=await s.json();console.log("Register response:",n),s.ok||d(`Registration failed: ${n.message||"Unknown error"}`,"error");const r=Y(n.user);localStorage.setItem("user",JSON.stringify(r)),window.currentUser=r,localStorage.setItem("role",r.role),P(r),W(r),authModal.classList.add("hidden"),S.reset(),d(`Welcome, ${r.name}! Your account has been created.`,"success"),Q()})}function _e(){Oe?.addEventListener("click",()=>{pe(),window.location.href="index.html"})}async function We(){try{const e=await u(`${q}/me`);if(!e.ok)throw new Error("Not authenticated");const o=await e.json(),a=Y(o);return localStorage.setItem("user",JSON.stringify(a)),window.currentUser=a,P(a),W(a),a}catch{return P(null),W(null),null}}async function pe(e=!1){try{await fetch(`${q}/logout`,{method:"POST",credentials:"include"})}catch(o){console.warn("Logout request failed:",o)}localStorage.removeItem("user"),window.currentUser=null,P(null),e||d("You have been logged out.","info")}function ze(){const e=document.getElementById("forgotPasswordLink"),o=document.getElementById("forgotPasswordModal"),a=document.getElementById("closeForgotModal"),t=document.getElementById("forgotPasswordForm");e&&e?.addEventListener("click",s=>{s.preventDefault(),o.classList.remove("hidden")}),a&&a?.addEventListener("click",()=>{o.classList.add("hidden")}),t&&t?.addEventListener("submit",async s=>{s.preventDefault();const n=document.getElementById("forgotEmail").value.trim();try{const i=await(await fetch("/api/auth/forgot-password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:n})})).json();d(i.message||"Check your email for the reset link.","success"),o.classList.add("hidden")}catch(r){console.error(r),d("Failed to send reset link. Try again.","error")}})}function Je(){He(),Re(),_e(),ze()}async function u(e,o={}){let a=await fetch(e,{credentials:"include",...o});return a.status===401&&(await Ve()?a=await fetch(e,{credentials:"include",...o}):pe(!0)),a}async function Ve(){try{const e=await fetch(`${q}/refresh`,{method:"POST",credentials:"include"});if(!e.ok)throw new Error("Refresh failed");const o=await e.json();return window.currentUser=o.user,P(o.user),!0}catch{return!1}}async function Ye(e){const o=e.dataset.slug;if(!o)return;const a=window.location.pathname.endsWith("post.html"),t=a?document.getElementById("singlePostContainer"):e.closest(".post");if(!t)return;const s=t.querySelector(".comments-section"),n=s?.querySelector(".comments-list");!s||!n||(a||s.classList.toggle("show"),(a||s.classList.contains("show"))&&await ye(o,n))}async function Ke(e){if(e.dataset.deleting==="true")return;e.dataset.deleting="true";const o=e.dataset.commentId;if(!confirm("Are you sure you want to delete this comment?")){e.dataset.deleting="false";return}try{const t=await u(`${J}/${o}`,{method:"DELETE"}),s=await t.json();if(t.ok){const n=e.closest(".comment");n&&n.remove();const i=(window.location.pathname.endsWith("post.html")?document.getElementById("singlePostContainer"):e.closest(".post"))?.querySelector(".comment-count");if(i){let l=parseInt(i.textContent)||0;l=Math.max(l-1,0),i.textContent=l,i.title=`${l} comment${l!==1?"s":""}`}d("Comment deleted successfully!","success")}else throw new Error(s.message||"Delete failed")}catch(t){console.error("Error deleting comment:",t),d("Error deleting comment. Please try again.","error")}finally{e.dataset.deleting="false"}}async function ye(e,o,a=3){try{o.innerHTML='<p class="loading-comments">Loading comments...</p>';const t=await u(`${J}/post/${e}?_=${Date.now()}`);if(!t.ok)throw new Error("Failed to fetch comments");const s=await t.json();if(o.innerHTML="",s.length===0){o.innerHTML="<p class='no-comments'>No comments yet. Be the first to comment!</p>";return}const n=s.slice(0,a);if(X(n,o),s.length>a){const r=document.createElement("button");r.classList.add("view-more-btn"),r.textContent=`View all ${s.length} comments`;const i=document.createElement("div");i.classList.add("comments-scroll-container"),i.style.display="none",X(s,i);let l=!1;r?.addEventListener("click",()=>{l=!l,l?(o.innerHTML="",o.appendChild(i),o.appendChild(r),i.style.display="block",r.textContent="View less comments"):(o.innerHTML="",X(n,o),r.textContent=`View all ${s.length} comments`,o.appendChild(r))}),o.appendChild(r)}}catch(t){console.error("Error fetching comments:",t),o.innerHTML="<p class='error-comments'>Failed to load comments.</p>"}}function X(e,o){const a=window.currentUser?.id||window.currentUser?._id;e.forEach(t=>{const s=document.createElement("div");s.classList.add("comment");const n=typeof t.authorId=="object"?t.authorId._id:t.authorId,r=a&&n&&n.toString()===a.toString();s.innerHTML=`
      <div class="comment-header">
        <p><strong class="comment-author" style="cursor: pointer;">${t.authorId?.name||"Anonymous"}:</strong> ${re(t.text)}</p>
        ${r?`<div class="comment-menu">
                  <button class="menu-btn">⋮</button>
                  <div class="menu-options hidden">
                    <button class="delete-comment-btn" data-comment-id="${t._id}">Delete</button>
                  </div>
                </div>`:""}
      </div>  
      <small title="${new Date(t.createdAt).toLocaleString()}">
        ${F(t.createdAt)}
      </small>
    `,o.appendChild(s),s.querySelector(".comment-author")?.addEventListener("click",()=>{window.location.href=`profile.html?id=${t.authorId?._id}`})})}async function Qe(e,o,a,t){try{const s=await u(`${J}/post/${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:o})});if(s.ok){const r=(await s.json()).comment,i=document.createElement("div");if(i.classList.add("comment"),i.innerHTML=`
        <div class="comment-header">
          <p><strong>You:</strong> ${re(r.text)}</p>
          <div class="comment-menu">
            <button class="menu-btn">⋮</button>
            <div class="menu-options hidden">
              <button class="delete-comment-btn" data-comment-id="${r._id}">Delete</button>
            </div>
          </div>
        </div>
        <small title="${new Date(r.createdAt).toLocaleString()}">
        ${F(r.createdAt)}
      </small>
      `,a.prepend(i),t&&t){let l=parseInt(t.textContent)||0;t.textContent=l+1,t.title=`${l+1} comments`}d("Comment posted successfully!","success")}else throw new Error("Failed to post comment")}catch(s){console.error("Error posting comment:",s),d("Failed to post comment","error")}}async function ve(e,o){try{const a=await u(`${J}/post/${e}`);if(!a.ok)throw new Error("Failed to fetch comment count");const s=(await a.json()).length;s===0?(o.textContent="0",o.title="No comments yet"):(o.textContent=s,o.title=`${s} comment${s>1?"s":""}`)}catch(a){console.error("Error fetching comment count:",a),o.textContent="0"}}async function Ge(e){const o=e.target.closest(".comment-form"),a=o.querySelector(".comment-form button");if(!o)return;e.preventDefault();const t=o.querySelector(".comment-input"),s=t.value.trim();if(!s)return;let n,r,i,l;window.location.pathname.endsWith("post.html")?(n=document.getElementById("singlePostContainer"),r=n.querySelector(".comments-list"),i=n.querySelector(".comment-btn").dataset.slug,l=n.querySelector(".comment-count")):(n=o.closest(".post"),r=n.querySelector(".comments-list"),i=n.querySelector(".like-btn").dataset.slug,l=n.querySelector(".comment-count"));const c=h=>{a.disabled=h,a.innerHTML=h?'<i class="fa-solid fa-spinner fa-spin"></i>':"Comment"};try{if(c(!0),!window.currentUser){d("Please log in to comment.","error"),t.value="",c(!1);return}await Qe(i,s,r,l),t.value=""}catch{c(!1)}finally{c(!1)}}function Xe(){document.addEventListener("submit",Ge)}const oe=document.querySelectorAll(".search");function K(){return[...oe].find(e=>e.value.trim())?.value.trim()||""}let f={all:[],featured:[],mine:[],saved:[]},b=1;function ne(e){return e&&e.startsWith("http")?e:"/Images/fallback.jpg"}function k(){const e=new URLSearchParams(window.location.search);return{page:Number(e.get("page"))||1,category:e.get("category")||"",search:e.get("search")||""}}function $({page:e,category:o,search:a},{replace:t=!1}={}){const s=new URL(window.location);e===1?s.searchParams.delete("page"):s.searchParams.set("page",e),o?s.searchParams.set("category",o):s.searchParams.delete("category"),a?s.searchParams.set("search",a):s.searchParams.delete("search"),t?history.replaceState({page:e,category:o,search:a},"",s):history.pushState({page:e,category:o,search:a},"",s)}function D(){const{category:e,search:o}=k(),a=document.getElementById("categoryFilter");a&&(a.value=e||"all"),oe.forEach(t=>{t.value=o||""})}async function B(e,o=6){try{const a=k(),t=e??a.page,s=document.getElementById("categoryFilter")?.value||a.category,n=K()||a.search;$({page:t,category:s!=="all"?s:"",search:n},{replace:!0});const r=new URLSearchParams({page:t,limit:o});s&&s!=="all"&&r.append("category",s),n&&r.append("search",n),t!==1&&te();const l=await(await u(`${p}?${r.toString()}`)).json();f.all=Array.isArray(l.posts)?l.posts:[],b=l.totalPages??1,ie("allPostsContainer"),z("allPostsContainer",t,b)}catch(a){console.error("Error fetching posts:",a),d("Something went wrong while displaying posts!","error")}finally{V(),se()}}async function we(e=3){try{const o=k(),a=K()||o.search;$({search:a},{replace:!0});const t=new URLSearchParams({limit:e});a&&t.append("search",a);const n=await(await u(`${p}?${t.toString()}`)).json();f.featured=Array.isArray(n.posts)?n.posts:[],ie("featuredPostsContainer",e)}catch(o){console.error("Failed to load featured posts",o)}finally{V()}}async function ae(e,o=6){try{const a=k(),t=e??a.page,s=K()||a.search;$({page:t,search:s},{replace:!0});const n=new URLSearchParams({page:t,limit:o});s&&n.append("search",s),t!==1&&te();const r=await u(`${p}/mine?${n.toString()}`);if(!r.ok){const l=await r.text();throw new Error(l||"Failed to fetch your posts")}const i=await r.json();f.mine=Array.isArray(i.posts)?i.posts:[],b=i.totalPages||1,ie("myPostsContainer"),z("myPostsContainer",t,b)}catch(a){console.error("Error fetching my posts:",a),d("Failed to load your posts!","error")}finally{V(),se()}}function F(e){const o=Math.floor((Date.now()-new Date(e))/1e3),a=[{label:"year",seconds:31536e3},{label:"month",seconds:2592e3},{label:"day",seconds:86400},{label:"hour",seconds:3600},{label:"minute",seconds:60},{label:"second",seconds:1}],t=new Intl.RelativeTimeFormat("en",{numeric:"auto"});for(const s of a){const n=Math.floor(o/s.seconds);if(n>=1)return t.format(-n,s.label)}return"Just now"}function re(e){const o=document.createElement("div");return o.textContent=e,o.innerHTML.replace(/\n/g,"<br>")}function ie(e,o=null){const a=window.currentUser?._id||window.currentUser?.id,t=document.getElementById(e);if(!t)return;t.innerHTML="";let s=[];if(e==="allPostsContainer"?s=[...f.all]:e==="featuredPostsContainer"?s=[...f.featured]:e==="myPostsContainer"?s=[...f.mine]:e==="savedPostsContainer"&&(s=[...f.saved]),o&&(s=s.slice(0,o)),s.length===0){e==="myPostsContainer"?t.innerHTML=`<p style="text-align:center; color:gray; font-size: 20px; font-weight: bold;">You haven't made any posts yet...</p>`:t.innerHTML='<p style="text-align:center; color:gray; font-size:20px;">No results found...</p>';return}s.forEach(n=>{const r=document.createElement("div");r.classList.add("post");const i=n.content.length>150?n.content.substring(0,150)+"...":n.content,l=typeof n.authorId=="object"&&n.authorId!==null?n.authorId._id:n.authorId,c=typeof n.authorId=="object"&&n.authorId!==null?n.authorId.name:n.authorName||"Unknown",h=a&&String(l)===String(a);r.innerHTML=`
      ${n.image?`<a href="post.html?slug=${n.slug}">
             <img src="${ne(n.image)}" alt="${n.title}" class="post-image" loading="lazy">
           </a>`:""}
        <p class="tag">${n.category}</p>
        <h2>
          <a href="post.html?slug=${n.slug}" class="post-link">${n.title}</a>
        </h2>
        <p>${i} <a href="post.html?slug=${n.slug}" class="read-more">Read more</a></p>
        <a href="profile.html?id=${l}" class="author"><em>By ${c}</em></a>
        <small title="${new Date(n.date).toLocaleString()}">
          ${F(n.date)}
        </small>
        <br>
        <div class="post-interactions-container">
          <div class="post-interactions">
            <button class="like-btn ${n.likedByUser?"liked":""}" data-slug="${n.slug}">
              <i class="${n.likedByUser?"fa-solid":"fa-regular"} fa-heart"></i>
              <span class="like-count">${n.likesCount||0}</span>
            </button>
            <button class="comment-btn" data-slug="${n.slug}">
              <i class="fa-regular fa-comment"></i>
              <span class="comment-count">${n.commentsCount||0}</span>
            </button>
            <button class="share-btn" data-slug="${n.slug}">
              <i class="fa-solid fa-share"></i>
              <span class="share-count">${n.shares}</span>
            </button>
          </div>
          <span class="liked-by likes-info">No likes yet</span>
        </div>
        <div id="likesModal-${n.slug}" class="likes-modal hidden slide-up">
          <div class="likes-modal-content">
            <h3>Liked by</h3>
            <ul id="likesList-${n.slug}" class="likes-list"></ul>            
          </div>
        </div>
        <div class="comments-section">
          <form class="comment-form">
            <input type="text" class="comment-input" placeholder="Write a comment..." required />
            <button type="submit">Comment</button>
          </form>
          <div class="comments-list"></div>
        </div>
        ${h?`
        <div class="post-actions">
            <button class="edit-btn btn" data-slug="${n.slug}">Edit</button>
            <button class="delete-btn btn" data-slug="${n.slug}">Delete</button>
        </div>
        `:""}
    `,t.appendChild(r);const m=r.querySelector(".post-image");m&&(m.onerror=function(){this.onerror=null,this.src="/Images/fallback.jpg"});const g=r.querySelector(".like-btn"),C=g.querySelector("i"),y=r.querySelector(".liked-by");y.dataset.slug=n.slug,y.dataset.likedBy=JSON.stringify(n.likedBy||[]),g.classList.toggle("liked",n.likedByUser),C.className=n.likedByUser?"fa-solid fa-heart":"fa-regular fa-heart",n.likesCount?(y.textContent=n.likesCount===1?`Liked by ${n.likedBy[0]}`:`Liked by ${n.likedBy[0]} and ${n.likedBy.length-1} others`,y.classList.remove("disabled")):(y.textContent="No likes yet",y.classList.add("disabled"));const A=r.querySelector(".comment-count");ve(n.slug,A)})}async function Ze(e,o,a,t){const s=new FormData;s.append("title",e),s.append("content",o),s.append("category",a),t&&s.append("image",t);const n=await u(`${p}`,{method:"POST",body:s});if(!n.ok)throw new Error("Failed to add post");return await n.json()}async function et(e){if(confirm("Are you sure you want to delete this post?"))try{const o=await u(`${p}/${e}`,{method:"DELETE"});if(!o.ok){const t=await o.text();throw new Error(t||"Failed to delete post")}d("Post deleted successfully!","success");const{page:a}=k();window.location.pathname.endsWith("my-posts.html")?ae(a):B(a)}catch(o){console.error("Error deleting post:",o),d("Failed to delete post!","error")}}function tt(e){e&&(localStorage.setItem("editSlug",e),window.location.href="write.html")}function st(){const e=document.getElementById("postForm"),o=document.querySelector(".add-post-btn");if(!e)return;const a=localStorage.getItem("editSlug"),t=s=>{o.disabled=s,o.innerHTML=s?'<i class="fa-solid fa-spinner fa-spin"></i> Posting...':a?"Update Post":"Add Post"};a&&a!=="null"?((async()=>{try{const s=await u(`${p}/${a}`);if(!s.ok)throw new Error("Post not found");const n=await s.json();if(document.getElementById("title").value=n.title||"",document.getElementById("content").value=n.content||"",document.getElementById("category").value=n.category||"",n.image){const r=document.getElementById("imagePreview");r.src=n.image,r.style.display="block"}}catch(s){console.error("Error loading post:",s)}})(),e.onsubmit=async function(s){s.preventDefault();const n=new FormData;n.append("title",document.getElementById("title").value),n.append("content",document.getElementById("content").value),n.append("category",document.getElementById("category").value);const r=document.getElementById("image").files[0];r&&n.append("image",r);try{t(!0);const i=await u(`${p}/${a}`,{method:"PUT",body:n});i.ok?(d("Post updated successfully!","success"),localStorage.removeItem("editSlug"),window.location.href="all-posts.html"):console.error("Update failed:",await i.text())}catch(i){console.error("Error updating post:",i),d("Failed to update post!","error")}finally{t(!1)}}):(localStorage.removeItem("editSlug"),e?.addEventListener("submit",async function(s){s.preventDefault();const n=document.getElementById("title").value,r=document.getElementById("content").value,i=document.getElementById("category").value,l=document.getElementById("image").files[0];console.log("Submitting new post:",{title:n,content:r,category:i,imageFile:l});try{t(!0);const c=await Ze(n,r,i,l);console.log("Post created successfully!",c),d("Post created successfully!","success"),e.reset(),window.location.href="all-posts.html",localStorage.removeItem("editSlug")}catch(c){console.error("Error adding post:",c),d("Failed to add post!","error")}finally{t(!1)}}))}async function ue(){const o=new URLSearchParams(window.location.search).get("slug")||window.location.pathname.split("/").pop();if(o&&u(`/api/posts/${o}/view`,{method:"POST"}).catch(a=>{console.error("Failed to increment view",a)}),!!o){try{let ke=function(L){v.dataset.saved=L?"true":"false",v.classList.toggle("saved",L);const I=v.querySelector("i");I.classList.toggle("fa-solid",L),I.classList.toggle("fa-regular",!L)};const a=await u(`${p}/${o}`);if(!a.ok)throw new Error("Failed to fetch post");const t=await a.json(),s=window.currentUser?._id||window.currentUser?.id,n=typeof t.authorId=="object"&&t.authorId!==null?t.authorId._id:t.authorId,r=typeof t.authorId=="object"&&t.authorId!==null?t.authorId.name:t.authorName||"Unknown",i=s&&String(n)===String(s),l=document.getElementById("singlePostContainer");l.innerHTML=`
      ${t.image?`<img src="${ne(t.image)}" alt="${t.title}" class="post-image" loading="lazy">`:""}
      <h1>${t.title}</h1>
      <p class="tag">${t.category}</p>
      <p onclick="window.location.href='profile.html?id=${n}'" style="cursor: pointer;" class="author"><em>By ${r}</em></p>
      <small title="${new Date(t.date).toLocaleString()}">
        ${F(t.date)}
      </small>
      <div class="content">
        <p>${re(t.content)}</p>
      </div>
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
          <span class="bookmark ${t.savedByUser?"saved":""}" data-saved="${t.savedByUser?"true":"false"}" data-slug="${t.slug}">
            <i class="${t.savedByUser?"fa-solid":"fa-regular"} fa-bookmark"></i>
          </span>
        </div>
        <span class="liked-by likes-info">No likes yet</span>
      </div>
      <div id="likesModal-${t.slug}" class="likes-modal hidden slide-up">
        <div class="likes-modal-content">
          <h3>Liked by</h3>
          <ul id="likesList-${t.slug}" class="likes-list"></ul>            
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
        <button class="edit-btn btn" data-slug="${t.slug}">Edit</button>
        <button class="delete-btn btn" data-slug="${t.slug}">Delete</button>
      </div>`:""}
    `;const c=l.querySelector(".post-image");c&&(c.onerror=function(){this.onerror=null,this.src="/Images/fallback.jpg"});const h=l?.querySelector(".like-btn"),m=h?.querySelector("i"),g=l?.querySelector(".liked-by");g.dataset.slug=t.slug,g.dataset.likedBy=JSON.stringify(t.likedBy||[]),h.classList.toggle("liked",t.likedByUser),m.className=t.likedByUser?"fa-solid fa-heart":"fa-regular fa-heart",t.likesCount?(g.textContent=t.likesCount===1?`Liked by ${t.likedBy[0]}`:`Liked by ${t.likedBy[0]} and ${t.likedBy.length-1} others`,g.classList.remove("disabled")):(g.textContent="No likes yet",g.classList.add("disabled"));const C=l.querySelector(".comment-count");ve(t.slug,C);const y=document.querySelector(".comments-section"),A=y.querySelector(".comments-list");y&&A&&await ye(t.slug,A,1/0);const v=l.querySelector(".bookmark");v?.addEventListener("click",async()=>{const L=v.dataset.slug,I=v.dataset.saved==="true";if(!window.currentUser){d("Please log in to save posts");return}v.classList.add("clicked"),setTimeout(()=>v.classList.remove("clicked"),200);const Le=I?`/api/posts/${L}/unsave`:`/api/posts/${L}/save`;try{const x=await u(Le,{method:"POST"}),be=await x.json();if(!x.ok)throw new Error(be.message||"Failed to toggle bookmark");ke(!I),d(I?"Removed from saved posts":"Post saved","success")}catch(x){console.error("Failed to toggle bookmark",x),d("Something went wrong","error")}})}catch(a){console.error(a),document.getElementById("singlePostContainer").innerHTML="<p>Error loading post.</p>"}at(o)}}const ot=async()=>{const o=await(await u(`${p}/trending?limit=5`)).json(),a=document.getElementById("trending-list");a.innerHTML=o.map((t,s)=>`
    <li>
      <span class="trending-rank">${["🥇","🥈","🥉"][s]||`#${s+1}`}</span>
      <a href="post.html?slug=${t.slug}" class="trending-title">${t.title}</a>
      <i class="fa-solid fa-bolt trending-icon" title="Trending now"></i>
    </li>
  `).join("")};function nt(e){const o=document.getElementById("related-posts-container");if(!e.length){o.innerHTML="<p style='margin: 0 5px;'>No related posts found.</p>";return}o.innerHTML=e.map(a=>`
      <article class="related-post-card">
        <h4><a href="post.html?slug=${a.slug}">${a.title}</a></h4>
        <small>${a.category}</small>
      </article>
    `).join("")}const at=async e=>{try{const a=await(await u(`${p}/slug/${e}/related`)).json();nt(a)}catch(o){console.error("Failed to fetch related posts.",o)}},rt=document.getElementById("savedPostsContainer");async function le(e,o=6){const a=rt;try{const t=k(),s=e??t.page,n=K()||t.search;$({page:s,search:n},{replace:!0});const r=new URLSearchParams({page:s,limit:o});n&&r.append("search",n),s!==1&&te();const i=await u(`${p}/saved/me?${r.toString()}`);if(!i.ok)throw new Error("Failed to fetch");const l=await i.json();if(f.saved=Array.isArray(l.posts)?l.posts:[],b=l.totalPages||1,!a)return;if(f.saved.length===0){a.innerHTML="<p>You have no saved posts yet.</p>";return}a.innerHTML=f.saved.map(c=>`
      <article class="post-card">
        ${c.image?`
          <img 
            src="${ne(c.image)}" 
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
            <small title="${new Date(c.date).toLocaleString()}">${F(c.date)}</small>
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
    `).join(""),document.querySelectorAll(".bookmark").forEach(c=>{c?.addEventListener("click",async h=>{h.stopPropagation();const m=c.dataset.slug;try{await u(`${p}/${m}/unsave`,{method:"POST"}),f.saved=f.saved.filter(C=>C.slug!==m),c.closest(".post-card").remove(),d("Removed from saved posts","success");const{page:g}=k();f.saved.length===0&&g>1?le(g-1):z("savedPostsContainer",g,b)}catch(g){console.error(g),d("Failed to remove","error")}})}),z("savedPostsContainer",s,b)}catch(t){console.error(t),a.innerHTML="<p>Error loading saved posts.</p>"}finally{V(),se()}}document.getElementById("categoryFilter")?.addEventListener("change",()=>{$({page:1}),B(1)});let me;oe.forEach(e=>e?.addEventListener("keyup",()=>{clearTimeout(me),me=setTimeout(()=>{$({page:1}),we(),B(1),ae(1),le(1)},400)}));function z(e,o,a){const t=document.getElementById("pagination");if(t){t.innerHTML="";for(let s=1;s<=a;s++){const n=document.createElement("button");n.textContent=s,n.className=s===o?"pg-active":"",n?.addEventListener("click",async()=>{$({page:s}),B(s)}),t.appendChild(n)}}}async function it(e){const o=e.dataset.slug,a=e.querySelector("i"),t=e.querySelector(".like-count"),s=e.closest(".post-interactions-container")?.querySelector(".liked-by");if(!window.currentUser){d("Please log in to like or unlike posts.","error");return}const n=e.classList.contains("liked");try{const r=await u(`/api/posts/${o}/${n?"unlike":"like"}`,{method:"POST"}),i=await r.json();if(r.ok){e.classList.toggle("liked",!n),a.className=n?"fa-regular fa-heart":"fa-solid fa-heart";const l=i.likesCount??i.likes??0;t.textContent=l,s&&(l?(s.textContent=l===1?"1 like":`${l} likes`,s.classList.remove("disabled")):(s.textContent="No likes yet",s.classList.add("disabled")),Array.isArray(i.likedBy)&&(s.dataset.slug=o,s.dataset.likedBy=JSON.stringify(i.likedBy)))}else d(`Failed to update likes: ${i.message}`,"error")}catch(r){console.error("Like action failed:",r),d("Error updating like. Please try again.","error")}}const lt=async e=>{const o=e.dataset.slug,a=`${window.location.origin}/post/${o}`,t=`shared_${o}`;try{navigator.share?await navigator.share({title:"BuzzInk",text:"Check out this post on BuzzInk",url:a}):(await navigator.clipboard.writeText(a),d("Link copied to clipboard!","success")),sessionStorage.getItem(t)||(sessionStorage.setItem(t,"true"),u(`/api/posts/${o}/share`,{method:"POST"}).catch(()=>{}));const s=e.querySelector(".share-count");s&&(s.textContent=Number(s.textContent)+1)}catch(s){d("Failed to share post. Please try again.","error"),console.error("Share cancelled or failed",s)}};let ee=!1;async function ct(e){if(ee)return;const o=encodeURIComponent(e),a=document.getElementById(`likesModal-${o}`),t=document.getElementById(`likesList-${o}`);if(!(!a||!t)&&!a.classList.contains("active")){ee=!0,a.classList.remove("hidden"),requestAnimationFrame(()=>a.classList.add("active")),t.innerHTML="<li>Loading...</li>";try{const n=await(await u(`/api/posts/${e}/likes`)).json();if(t.innerHTML="",!Array.isArray(n.users)||n.users.length===0){t.innerHTML="<li>No likes yet</li>";return}n.users.forEach(r=>{const i=document.createElement("li");i.textContent=r,t.appendChild(i)})}catch(s){t.innerHTML="<li>Failed to load likes</li>",console.error("Failed to fetch likes:",s)}}}function dt(e){const o=encodeURIComponent(e),a=document.getElementById(`likesModal-${o}`);a&&(ee=!1,a.classList.remove("active"),setTimeout(()=>{a.classList.add("hidden")},300))}function ut(){document.addEventListener("click",async e=>{const o=e.target.closest(".edit-btn");if(o){e.preventDefault(),e.stopPropagation(),tt(o.dataset.slug);return}const a=e.target.closest(".delete-btn");if(a){e.preventDefault(),e.stopPropagation(),et(a.dataset.slug);return}const t=e.target.closest(".like-btn");if(t){e.preventDefault(),it(t);return}const s=e.target.closest(".comment-btn");if(s){e.preventDefault(),Ye(s);return}const n=e.target.closest(".share-btn");if(n){e.preventDefault(),lt(n);return}const r=e.target.closest(".likes-info");if(r&&!r.classList.contains("disabled")){e.preventDefault(),e.stopPropagation();const m=r.dataset.slug;if(!m)return;ct(m);return}const i=document.querySelector(".likes-modal.active");if(i&&!i.contains(e.target)){const m=i.id.replace("likesModal-","");dt(m)}const l=e.target.closest(".delete-comment-btn");l&&(e.preventDefault(),e.stopPropagation(),Ke(l));const c=e.target.closest(".menu-btn"),h=e.target.closest(".menu-options");!c&&!h&&document.querySelectorAll(".menu-options").forEach(m=>m.classList.add("hidden")),c&&c.nextElementSibling.classList.toggle("hidden"),w?.classList.contains("show")&&!w.contains(e.target)&&![...O].some(m=>m.contains(e.target))&&w.classList.remove("show"),j?.classList.contains("active")&&!j.contains(e.target)&&!ge.contains(e.target)&&j.classList.remove("active")})}document.getElementById("canonicalUrl")?.setAttribute("href",window.location.href);"scrollRestoration"in history&&(history.scrollRestoration="manual");function mt(){const e=`scroll:${window.location.pathname}${window.location.search}`,o=sessionStorage.getItem(e);o!==null&&(window.scrollTo(0,Number(o)),sessionStorage.removeItem(e))}async function Q(){const e=window.location.pathname,{page:o}=k();e==="/"||e.endsWith("index.html")?(D(),N("featuredPostsContainer",3),await we(),await B(o),await ot()):e.endsWith("my-posts.html")?(D(),N("myPostsContainer",6),await ae(o)):e.endsWith("post.html")?await ue():e.endsWith("saved.html")?(D(),N("savedPostsContainer",6),await le(o)):e.startsWith("/post/")?ue():(D(),N(),await B(o)),mt()}document.addEventListener("DOMContentLoaded",async()=>{const e=await We();window.currentUser=e,Je(),he(),ut(),Xe(),De();const o=localStorage.getItem("theme")||"light";fe(o),await Q(),window.location.pathname.endsWith("write.html")&&!localStorage.getItem("editSlug")&&localStorage.removeItem("editSlug"),st()});window.addEventListener("pageshow",e=>{if(e.persisted){const o=localStorage.getItem("theme")||"light";fe(o),he()}});window.addEventListener("popstate",()=>{Q()});export{u as a,pe as l,d as s};
