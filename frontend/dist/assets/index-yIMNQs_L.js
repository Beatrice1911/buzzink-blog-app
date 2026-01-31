(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))a(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function o(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerPolicy&&(n.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?n.credentials="include":t.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function a(t){if(t.ep)return;t.ep=!0;const n=o(t);fetch(t.href,n)}})();const k="/api/posts",N="/api/auth",_="/api/comments",re="https://i.postimg.cc/KvF0rh0Q/custom-default-avatar.png",Z=document.body,q=document.querySelectorAll(".user-icon"),p=document.getElementById("userMenuDetails"),x=document.getElementById("authModal"),le=document.getElementById("closeModal"),S=document.getElementById("loginTab"),P=document.getElementById("registerTab"),ce=document.querySelectorAll(".write-post"),de=document.querySelector(".search-icon"),J=document.getElementById("mobileSearch"),me=document.querySelector(".menu-toggle"),ue=document.getElementById("mobileMenu"),T=document.querySelector(".logo"),ge=document.querySelector(".all-posts-btn"),fe=document.getElementById("myPosts"),he=document.getElementById("savedPosts"),ye=document.getElementById("profile-edit"),pe=document.getElementById("settings"),D=document.getElementById("themeToggle");function l(e,s="info",o=5e3){const a=document.getElementById("toast-container");if(!a)return;const t=document.createElement("div");t.className=`toast toast-${s}`;const n=document.createElement("i");s==="success"?n.className="fas fa-check-circle":s==="error"?n.className="fas fa-exclamation-circle":n.className="fas fa-info-circle",t.appendChild(n);const i=document.createElement("span");i.textContent=e,t.appendChild(i),a.appendChild(t),setTimeout(()=>{t.style.animation="slideOut 0.5s forwards",t.addEventListener("animationend",()=>t.remove())},o)}function ke(){me?.addEventListener("click",e=>{e.stopPropagation(),p.classList.contains("show")&&p.classList.remove("show"),ue.classList.toggle("active")})}function w(e){history.pushState({},"",e)}function we(){T?.addEventListener("click",()=>w("/")),ge?.addEventListener("click",()=>w("/all-posts")),fe?.addEventListener("click",()=>w("/my-posts")),ye?.addEventListener("click",()=>w("/dashboard")),he?.addEventListener("click",()=>w("/saved")),pe?.addEventListener("click",()=>w("/settings"))}function ve(){S?.addEventListener("click",()=>{v.classList.remove("hidden"),L.classList.add("hidden"),S.classList.add("active"),P.classList.remove("active")}),P?.addEventListener("click",()=>{L.classList.remove("hidden"),v.classList.add("hidden"),P.classList.add("active"),S.classList.remove("active")}),le?.addEventListener("click",()=>{x.classList.add("hidden")})}function Le(){q.forEach(e=>e?.addEventListener("click",()=>{const s=localStorage.getItem("user"),o=s?JSON.parse(s):null;o&&o.id?(p.classList.toggle("show"),x.classList.add("hidden")):(p.classList.add("hidden"),x.classList.remove("hidden"),S.classList.add("active"),P.classList.remove("active"),v.classList.remove("hidden"),L.classList.add("hidden"),v?.reset(),L?.reset())}))}function Ee(){de?.addEventListener("click",()=>{J.classList.toggle("show"),J.classList.contains("show")&&J.querySelector("input").focus()})}function be(){ce.forEach(e=>{e.addEventListener("click",s=>{const o=localStorage.getItem("user"),a=o?JSON.parse(o):null;!a||!a.id?(s.preventDefault(),x.classList.remove("hidden"),S.classList.add("active"),P.classList.remove("active"),v.classList.remove("hidden"),L.classList.add("hidden")):(localStorage.removeItem("editSlug"),window.location.href="write.html")})})}function Ie(){D?.addEventListener("change",()=>{D.checked?(root.setAttribute("data-theme","dark"),localStorage.setItem("theme","dark"),T.src="/Images/logo-dark-theme_optimized_.png"):(root.setAttribute("data-theme","light"),localStorage.setItem("theme","light"),T.src="/Images/logo_optimized.png")})}function $e(){const e=document.documentElement;localStorage.getItem("theme")==="dark"?(e.setAttribute("data-theme","dark"),D&&(D.checked=!0)):e.setAttribute("data-theme","light")}function Be(e){e==="dark"?(Z.classList.add("dark"),T.src="/Images/logo-dark-theme_optimized_.png"):(Z.classList.remove("dark"),T.src="/Images/logo_optimized.png"),localStorage.setItem("theme",e)}function Se(){ke(),ve(),Le(),Ee(),be(),we(),Ie()}async function Pe(e){const s=e.dataset.postId;if(!s)return;const o=window.location.pathname.endsWith("post.html"),a=o?document.getElementById("singlePostContainer"):e.closest(".post");if(!a)return;const t=a.querySelector(".comments-section"),n=t?.querySelector(".comments-list");!t||!n||(o||t.classList.toggle("show"),(o||t.classList.contains("show"))&&await Te(s,n))}async function Ce(e){if(e.dataset.deleting==="true")return;e.dataset.deleting="true";const s=e.dataset.commentId;if(!confirm("Are you sure you want to delete this comment?")){e.dataset.deleting="false";return}try{const a=await d(`${_}/${s}`,{method:"DELETE"}),t=await a.json();if(a.ok){const n=e.closest(".comment");n&&n.remove();let i;if(window.location.pathname.endsWith("post.html")?i=document.getElementById("singlePostContainer")?.querySelector(".comment-count"):i=e.closest(".post")?.querySelector(".comment-count"),i){const r=parseInt(i.textContent)||0;i.textContent=Math.max(0,r-1)}l("Comment deleted successfully!","success")}else throw new Error(t.message||"Delete failed")}catch(a){console.error("Error deleting comment:",a),l("Error deleting comment. Please try again.","error")}finally{e.dataset.deleting="false"}}async function Te(e,s,o=3){try{s.innerHTML='<p class="loading-comments">Loading comments...</p>';const a=await d(`${_}/post/${e}?_=${Date.now()}`);if(!a.ok)throw new Error("Failed to fetch comments");const t=await a.json();if(s.innerHTML="",t.length===0){s.innerHTML="<p class='no-comments'>No comments yet. Be the first to comment!</p>";return}const n=t.slice(0,o);if(W(n,s),t.length>o){const i=document.createElement("button");i.classList.add("view-more-btn"),i.textContent=`View all ${t.length} comments`;const r=document.createElement("div");r.classList.add("comments-scroll-container"),r.style.display="none",W(t,r);let u=!1;i.addEventListener("click",()=>{u=!u,u?(s.innerHTML="",s.appendChild(r),s.appendChild(i),r.style.display="block",i.textContent="View less comments"):(s.innerHTML="",W(n,s),i.textContent=`View all ${t.length} comments`,s.appendChild(i))}),s.appendChild(i)}}catch(a){console.error("Error fetching comments:",a),s.innerHTML="<p class='error-comments'>Failed to load comments.</p>"}}function W(e,s){const o=window.currentUser?.id||window.currentUser?._id;e.forEach(a=>{const t=document.createElement("div");t.classList.add("comment");const n=typeof a.authorId=="object"?a.authorId._id:a.authorId,i=o&&n&&n.toString()===o.toString();t.innerHTML=`
      <div class="comment-header">
        <p><strong class="comment-author" style="cursor: pointer;">${a.authorId?.name||"Anonymous"}:</strong> ${formatText(a.text)}</p>
        ${i?`<div class="comment-menu">
                  <button class="menu-btn">⋮</button>
                  <div class="menu-options hidden">
                    <button class="delete-comment-btn" data-comment-id="${a._id}">Delete</button>
                  </div>
                </div>`:""}
      </div>  
      <small>${new Date(a.createdAt).toLocaleString()}</small>
    `,s.appendChild(t),t.querySelector(".comment-author")?.addEventListener("click",()=>{window.location.href=`profile.html?id=${a.authorId?._id}`})})}async function Me(e,s,o,a){try{const t=await d(`${_}/post/${e}`,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({text:s})});if(t.ok){const n=await t.json(),i=document.createElement("div");i.classList.add("comment"),i.innerHTML=`
        <div class="comment-header">
          <p><strong>You:</strong> ${formatText(n.text)}</p>
          <div class="comment-menu">
            <button class="menu-btn">⋮</button>
            <div class="menu-options hidden">
              <button class="delete-comment-btn" data-comment-id="${n._id}">Delete</button>
            </div>
          </div>
        </div>
        <small>${new Date(n.createdAt).toLocaleString()}</small>
      `,o.prepend(i),a&&await Y(e,a),l("Comment posted successfully!","success")}else throw new Error("Failed to post comment")}catch(t){console.error("Error posting comment:",t),l("Failed to post comment","error")}}async function Y(e,s){try{const o=await d(`${_}/post/${e}`);if(!o.ok)throw new Error("Failed to fetch comment count");const t=(await o.json()).length;t===0?(s.textContent="0",s.title="No comments yet"):(s.textContent=t,s.title=`${t} comment${t>1?"s":""}`)}catch(o){console.error("Error fetching comment count:",o),s.textContent="0"}}function Ae(){document.addEventListener("submit",async e=>{const s=e.target.closest(".comment-form");if(!s)return;e.preventDefault();const o=s.querySelector(".comment-input"),a=o.value.trim();if(!a)return;let t,n,i,r;if(window.location.pathname.endsWith("post.html")?(t=document.getElementById("singlePostContainer"),n=t.querySelector(".comments-list"),i=t.querySelector(".comment-btn").dataset.postId,r=t.querySelector(".comment-count")):(t=s.closest(".post"),n=t.querySelector(".comments-list"),i=t.querySelector(".like-btn").dataset.postId,r=t.querySelector(".comment-count")),!window.currentUser){l("Please log in to comment.","error"),o.value="";return}await Me(i,a,n,r),o.value=""})}function Ue(){document.addEventListener("submit",Ae)}const Ne=document.querySelectorAll(".search");let M=[],A=1,K=1;function F(e){return e?e.startsWith("http")?e:(e.startsWith("/uploads"),"/Images/fallback.jpg"):"/Images/fallback.jpg"}function ee(e){e.innerHTML='<p style="text-align:center; color:gray; font-size: 20px; font-weight: bold;">No results found...</p>'}function je(e){e.innerHTML=`<p style="text-align:center; color:gray; font-size: 20px; font-weight: bold;">You haven't made any posts yet...</p>`}async function O(e=1,s=6){try{const a=await(await d(`${k}?page=${e}&limit=${s}`,{credentials:"include"})).json();M=Array.isArray(a.posts)?a.posts:[],A=a.currentPage??1,K=a.totalPages??1,H(),ne()}catch(o){console.error("Error fetching posts:",o),l("Something went wrong while displaying posts!","error")}}async function te(e=1,s=6){try{const o=await d(`${k}/mine?page=${e}&limit=${s}`,{credentials:"include"});if(!o.ok){const n=await o.text();throw new Error(n||"Failed to fetch your posts")}const a=await o.json();if(M=Array.isArray(a.posts)?a.posts:[],A=a.currentPage||1,K=a.totalPages||1,C("myPostsContainer"),ne(),M.length===0){const n=document.getElementById("myPostsContainer");n&&je(n)}}catch(o){console.error("Error fetching my posts:",o),l("Failed to load your posts!","error")}}function qe(e){return e.replace(/\n/g,"<br>")}function C(e,s=null){const o=window.currentUser?._id||window.currentUser?.id,a=document.getElementById(e);if(!a)return;a.innerHTML="";let t=[...M];if(e==="allPostsContainer"){const n=document.getElementById("categoryFilter");if(n){const i=n?.value;i!=="all"&&(t=t.filter(r=>r.category===i))}}if(e==="myPostsContainer"&&o&&(t=t.filter(n=>{const i=typeof n.authorId=="object"&&n.authorId!==null?n.authorId._id:n.authorId;return String(i)===String(o)})),s&&(t=t.slice(0,s)),t.length===0){ee(a);return}t.forEach(n=>{const i=document.createElement("div");i.classList.add("post");const r=n.content.length>150?n.content.substring(0,150)+"...":n.content,u=typeof n.authorId=="object"&&n.authorId!==null?n.authorId._id:n.authorId,c=typeof n.authorId=="object"&&n.authorId!==null?n.authorId.name:n.authorName||"Unknown",f=o&&String(u)===String(o);i.innerHTML=`
      ${n.image?`<a href="post.html?slug=${n.slug}">
             <img src="${F(n.image)}" alt="${n.title}" class="post-image" loading="lazy">
           </a>`:""}
        <p class="tag">${n.category}</p>
        <h2>
          <a href="post.html?slug=${n.slug}" class="post-link">${n.title}</a>
        </h2>
        <p>${r} <a href="post.html?slug=${n.slug}" class="read-more">Read more</a></p>
        <a href="profile.html?id=${u}" class="author"><em>By ${c}</em></a>
        <small>${new Date(n.date).toLocaleString()}</small>
        <br>
        <div class="post-interactions-container">
          <div class="post-interactions">
            <button class="like-btn ${n.likedByUser?"liked":""}" data-post-id="${n._id}">
              <i class="${n.likedByUser?"fa-solid":"fa-regular"} fa-heart"></i>
              <span class="like-count">${n.likesCount||0}</span>
            </button>
            <button class="comment-btn" data-post-id="${n._id}">
              <i class="fa-regular fa-comment"></i>
              <span class="comment-count">${n.commentsCount||0}</span>
            </button>
            <button class="share-btn">
              <i class="fa-solid fa-share"></i>
              <span class="share-count"></span>
            </button>
          </div>
          <span class="liked-by likes-info">No likes yet</span>
        </div>
        <div id="likesModal-${n._id}" class="likes-modal hidden slide-up">
          <div class="likes-modal-content">
            <span id="closeLikesModal-${n._id}" class="close-btn">&times;</span>
            <h3>Liked by</h3>
            <ul id="likesList-${n._id}" class="likes-list"></ul>            
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
            <button class="edit-btn btn" data-slug="${n.slug}">Edit</button>
            <button class="delete-btn btn" data-slug="${n.slug}">Delete</button>
        </div>
        `:""}
    `,a.appendChild(i);const E=i.querySelector(".post-image");E&&(E.onerror=function(){this.onerror=null,this.src="/Images/fallback.jpg"});const b=i.querySelector(".like-btn"),g=b.querySelector("i"),h=i.querySelector(".liked-by");h.dataset.postId=n._id,h.dataset.likedBy=JSON.stringify(n.likedBy||[]),n.likedBy&&n.likedBy.length>0?h.classList.remove("disabled"):h.classList.add("disabled");const R=Array.isArray(n.likes)?n.likes.map(I=>typeof I=="object"?I._id:I):[];o&&(R.includes(o)||n.likedByUser)?(b.classList.add("liked"),g.className="fa-solid fa-heart"):(b.classList.remove("liked"),g.className="fa-regular fa-heart"),!n.likedBy||n.likedBy.length===0?h.textContent="No likes yet":n.likedBy.length===1?h.textContent=`Liked by ${n.likedBy[0]}`:h.textContent=`Liked by ${n.likedBy[0]} and ${n.likedBy.length-1} others`;const j=i.querySelector(".comment-count");Y(n._id,j)})}async function xe(e){if(confirm("Are you sure you want to delete this post?"))try{const s=await d(`${k}/${e}`,{method:"DELETE",credentials:"include"});if(!s.ok){const o=await s.text();throw new Error(o||"Failed to delete post")}l("Post deleted successfully!","success"),window.location.pathname.endsWith("my-posts.html")?te(A):O(A)}catch(s){console.error("Error deleting post:",s),l("Failed to delete post!","error")}}window.location.pathname.endsWith("write.html")&&!localStorage.getItem("editSlug")&&localStorage.removeItem("editSlug");function De(e){const s=document.getElementById("post-jsonld");s&&s.remove();const o={"@context":"https://schema.org","@type":"Article",headline:e.title,description:e.content.slice(0,160),image:e.image?[e.image]:[],author:{"@type":"Person",name:e.authorName||"BuzzInk Contributor"},publisher:{"@type":"Organization",name:"BuzzInk",logo:{"@type":"ImageObject",url:"https://buzzink.onrender.com/Images/logo_optimized.png"}},datePublished:e.createdAt||e.date,dateModified:e.updatedAt||e.date,mainEntityOfPage:{"@type":"WebPage","@id":window.location.href}},a=document.createElement("script");a.type="application/ld+json",a.id="post-jsonld",a.textContent=JSON.stringify(o),document.head.appendChild(a)}async function Oe(){const s=new URLSearchParams(window.location.search).get("slug");if(s){try{let G=function(m){y.dataset.saved=m?"true":"false",y.classList.toggle("saved",m);const $=y.querySelector("i");$.classList.toggle("fa-solid",m),$.classList.toggle("fa-regular",!m)};var o=G;const a=await d(`${k}/${s}`,{credentials:"include"});if(!a.ok)throw new Error("Failed to fetch post");const t=await a.json(),n=window.currentUser?._id||window.currentUser?.id,i=typeof t.authorId=="object"&&t.authorId!==null?t.authorId._id:t.authorId,r=typeof t.authorId=="object"&&t.authorId!==null?t.authorId.name:t.authorName||"Unknown",u=n&&String(i)===String(n),c=document.getElementById("singlePostContainer");c.innerHTML=`
      ${t.image?`<img src="${F(t.image)}" alt="${t.title}" class="post-image" loading="lazy">`:""}
      <h1>${t.title}</h1>
      <p class="tag">${t.category}</p>
      <p onclick="window.location.href='profile.html?id=${i}'" style="cursor: pointer;" class="author"><em>By ${r}</em></p>
      <small>${new Date(t.date).toLocaleString()}</small>
      <div class="content">
        <p>${qe(t.content)}</p>
      </div>
      <div class="post-interactions-container">
        <div class="post-interactions">
          <button class="like-btn ${t.likedByUser?"liked":""}" data-post-id="${t._id}">
            <i class="${t.likedByUser?"fa-solid":"fa-regular"} fa-heart"></i>
            <span class="like-count">${t.likesCount||0}</span>
          </button>
          <button class="comment-btn" data-post-id="${t._id}">
            <i class="fa-regular fa-comment"></i>
            <span class="comment-count">${t.commentsCount||0}</span>
          </button>
          <button class="share-btn">
            <i class="fa-solid fa-share"></i>
            <span class="share-count"></span>
          </button>
          <span class="bookmark ${t.savedByUser?"saved":""}" data-saved="${t.savedByUser?"true":"false"}" data-slug="${t.slug}">
            <i class="${t.savedByUser?"fa-solid":"fa-regular"} fa-bookmark"></i>
          </span>
        </div>
        <span class="liked-by likes-info">No likes yet</span>
      </div>
      <div id="likesModal-${t._id}" class="likes-modal hidden slide-up">
        <div class="likes-modal-content">
          <span id="closeLikesModal-${t._id}" class="close-btn">&times;</span>
          <h3>Liked by</h3>
          <ul id="likesList-${t._id}" class="likes-list"></ul>            
        </div>
      </div>
      <div class="comments-section show">
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
      </div>`:""}
    `;const f=c.querySelector(".post-image");f&&(f.onerror=function(){this.onerror=null,this.src="/Images/fallback.jpg"});const E=c?.querySelector(".like-btn"),b=E?.querySelector("i"),g=c?.querySelector(".liked-by");g.dataset.postId=t._id,g.dataset.likedBy=JSON.stringify(t.likedBy||[]),t.likedBy&&t.likedBy.length>0?g.classList.remove("disabled"):g.classList.add("disabled");const h=Array.isArray(t.likes)?t.likes.map(m=>typeof m=="object"?m._id:m):[];n&&(h.includes(n)||t.likedByUser)?(E.classList.add("liked"),b.className="fa-solid fa-heart"):(E.classList.remove("liked"),b.className="fa-regular fa-heart"),!t.likedBy||t.likedBy.length===0?g.textContent="No likes yet":t.likedBy.length===1?g.textContent=`Liked by ${t.likedBy[0]}`:g.textContent=`Liked by ${t.likedBy[0]} and ${t.likedBy.length-1} others`;const R=c.querySelector(".comment-count");Y(t._id,R);const j=document.querySelector(".comments-section"),I=j.querySelector(".comments-list");j&&I&&await fetchComments(t._id,I,1/0);const y=c.querySelector(".bookmark");y.addEventListener("click",async()=>{const m=y.dataset.slug,$=y.dataset.saved==="true";if(!window.currentUser){l("Please log in to save posts");return}y.classList.add("clicked"),setTimeout(()=>y.classList.remove("clicked"),200);const ie=$?`/api/posts/${m}/unsave`:`/api/posts/${m}/save`;try{const st=await(await d(ie,{method:"POST",credentials:"include"})).json();G(!$),l($?"Removed from saved posts":"Post saved","success")}catch(X){console.error("Failed to toggle bookmark",X),l("Something went wrong","error")}}),De(t)}catch(a){console.error(a),document.getElementById("singlePostContainer").innerHTML="<p>Error loading post.</p>"}He(s)}}const _e=async()=>{const s=await(await d(`${k}/trending?limit=5`,{credentials:"include"})).json(),o=document.getElementById("trending-list");o.innerHTML=s.map((a,t)=>`
    <li>
      <span class="trending-rank">${["🥇","🥈","🥉"][t]||`#${t+1}`}</span>
      <a href="post.html?slug=${a.slug}" class="trending-title">${a.title}</a>
      <i class="fa-solid fa-bolt trending-icon" title="Trending now"></i>
    </li>
  `).join("")};function Fe(e){const s=document.getElementById("related-posts-container");if(!e.length){s.innerHTML="<p>No related posts found.</p>";return}s.innerHTML=e.map(o=>`
      <article class="related-post-card">
        <h4><a href="post.html?slug=${o.slug}">${o.title}</a></h4>
        <small>${o.category}</small>
      </article>
    `).join("")}const He=async e=>{try{const o=await(await d(`${k}/slug/${e}/related`,{credentials:"include"})).json();Fe(o)}catch(s){console.error("Failed to fetch related posts.",s)}},V=document.getElementById("savedPostsContainer");async function ze(){try{const e=await d(`${k}/saved/me`,{credentials:"include"});if(!e.ok)throw new Error("Failed to fetch");const s=await e.json();if(s.length===0){V.innerHTML="<p>You have no saved posts yet.</p>";return}V.innerHTML=s.map(o=>`
      <article class="post-card">
        ${o.image?`
          <img 
            src="${F(o.image)}" 
            alt="${o.title}" 
            class="post-image"
            loading="lazy"
            onclick="window.location.href='post.html?slug=${o.slug}'"
          >
        `:""}
        <div class="post-body" onclick="window.location.href='post.html?slug=${o.slug}'">
          <h2>${o.title}</h2>
          <p class="tag">${o.category}</p>
          <p class="excerpt">
            ${o.content.slice(0,150)}...
          </p>
          <div class="post-meta">
            <small>By ${o.authorId?.name||"Unknown"}</small>
            <small>${new Date(o.date).toLocaleDateString()}</small>
          </div>
        </div>
        <button 
          class="bookmark saved"
          data-slug="${o.slug}"
          title="Remove from saved"
        >
          <i class="fa-solid fa-bookmark"></i>
        </button>
      </article>
    `).join(""),document.querySelectorAll(".bookmark").forEach(o=>{o.addEventListener("click",async a=>{a.stopPropagation();const t=o.dataset.slug;try{await d(`${k}/${t}/unsave`,{method:"POST",credentials:"include"}),o.closest(".post-card").remove(),l("Removed from saved posts","success")}catch(n){console.error(n),l("Failed to remove","error")}})})}catch(e){console.error(e),V.innerHTML="<p>Error loading saved posts.</p>"}}function H(){document.getElementById("allPostsContainer")&&C("allPostsContainer"),document.getElementById("featuredPostsContainer")&&C("featuredPostsContainer",3),document.getElementById("myPostsContainer")&&C("myPostsContainer")}document.getElementById("categoryFilter")?.addEventListener("change",()=>{C("allPostsContainer")});function Re(e){const s=e.target.value.toLowerCase()||"",o=document.getElementById("allPostsContainer")?"allPostsContainer":"featuredPostsContainer",a=document.getElementById(o);if(!a)return;const t=M.filter(n=>n.title.toLowerCase().includes(s)||n.content.toLowerCase().includes(s)||n.category.toLowerCase().includes(s));if(a.innerHTML="",t.length===0){ee(a);return}t.forEach(n=>{const i=document.createElement("div");i.classList.add("post"),i.innerHTML=`
      ${n.image?`<img src="${F(n.image)}" alt="${n.title}" class="post-image" loading="lazy">`:""}
      <div class="post-content">
        <p class="tag">${n.category}</p>
        <h2>${n.title}</h2>
        <p>${n.content}</p>
        <p><em>By ${n.authorName||"Unknown"}</em></p>
        <small>${new Date(n.date).toLocaleString()}</small>
      </div>
    `,a.appendChild(i);const r=i.querySelector(".post-image");r&&(r.onerror=function(){this.onerror=null,this.src="/Images/fallback.jpg"}),i.addEventListener("click",()=>{window.location.href=`post.html?slug=${n.slug}`})}),s===""&&H()}Ne.forEach(e=>e.addEventListener("keyup",Re));function ne(){const e=document.getElementById("pagination");if(e){e.innerHTML="";for(let s=1;s<=K;s++){const o=document.createElement("button");o.textContent=s,o.className=s===A?"pg-active":"",o?.addEventListener("click",()=>O(s)),e.appendChild(o)}}}const v=document.getElementById("loginForm"),L=document.getElementById("registerForm"),Je=document.getElementById("logoutBtn");function z(e){return e?{...e,id:e.id||e._id}:null}window.currentUser=(()=>{const e=localStorage.getItem("user");return e?z(JSON.parse(e)):null})();function B(e){e?.id?q.forEach(s=>s.title=`Logged in as ${e.name}`):(q.forEach(s=>s.title="Click to Login/Register"),p?.classList.remove("show"))}async function U(e){try{const s=await d("/api/users/me",{credentials:"include"});if(!s.ok)return;e=await s.json();const o=document.querySelectorAll(".user-icon");o&&o.forEach(a=>{a.src=e.profilePhoto?.trim()?e.profilePhoto:re}),window.currentUser=e}catch(s){console.warn("Failed to load auth user:",s)}}function We(){v?.addEventListener("submit",async e=>{e.preventDefault();const s=document.getElementById("loginEmail").value,o=document.getElementById("loginPassword").value;console.log("Login Triggered");const a=await d(`${N}/login`,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({email:s,password:o})}),t=await a.json();console.log("Login response:",t),a.ok||l(`Login failed: ${t.message||"Unknown error"}`,"error");const n=z(t.user);localStorage.setItem("user",JSON.stringify(n)),window.currentUser=n,localStorage.setItem("role",n.role),n.role==="admin"&&(window.location.href="admin.html"),B(n),U(n),authModal.classList.add("hidden"),v.reset(),l(`Welcome back, ${n.name}!`,"success"),H()})}function Ve(){L?.addEventListener("submit",async e=>{e.preventDefault();const s=document.getElementById("registerName").value,o=document.getElementById("registerEmail").value,a=document.getElementById("registerPassword").value,t=await d(`${N}/register`,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({name:s,email:o,password:a})}),n=await t.json();console.log("Register response:",n),t.ok||l(`Registration failed: ${n.message||"Unknown error"}`,"error");const i=z(n.user);localStorage.setItem("user",JSON.stringify(i)),window.currentUser=i,localStorage.setItem("role",i.role),B(i),U(i),authModal.classList.add("hidden"),L.reset(),l(`Welcome, ${i.name}! Your account has been created.`,"success")})}function Ye(){Je?.addEventListener("click",()=>{se(),window.location.href="index.html"})}async function Ke(){try{const e=await d(`${N}/me`,{credentials:"include"});if(!e.ok)throw new Error("Not authenticated");const s=await e.json(),o=z(s);return localStorage.setItem("user",JSON.stringify(o)),window.currentUser=o,B(o),U(o),o}catch{return B(null),U(null),null}}async function se(e=!1){try{await fetch(`${N}/logout`,{method:"POST",credentials:"include"})}catch(s){console.warn("Logout request failed:",s)}localStorage.removeItem("user"),window.currentUser=null,B(null),e||l("You have been logged out.","info")}function Qe(){const e=document.getElementById("forgotPasswordLink"),s=document.getElementById("forgotPasswordModal"),o=document.getElementById("closeForgotModal"),a=document.getElementById("forgotPasswordForm");e&&e.addEventListener("click",t=>{t.preventDefault(),s.classList.remove("hidden")}),o&&o.addEventListener("click",()=>{s.classList.add("hidden")}),a&&a.addEventListener("submit",async t=>{t.preventDefault();const n=document.getElementById("forgotEmail").value.trim();try{const r=await(await fetch("/api/auth/forgot-password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:n})})).json();l(r.message||"Check your email for the reset link.","success"),s.classList.add("hidden")}catch(i){console.error(i),l("Failed to send reset link. Try again.","error")}})}function Ge(){We(),Ve(),Ye(),Qe()}async function d(e,s={}){let o=await fetch(e,{credentials:"include",...s});return o.status===401&&(await Xe()?o=await fetch(e,{credentials:"include",...s}):se(!0)),o}async function Xe(){try{const e=await fetch(`${N}/refresh`,{method:"POST",credentials:"include"});if(!e.ok)throw new Error("Refresh failed");const s=await e.json();return window.currentUser=s.user,B(s.user),!0}catch{return!1}}function Ze(){window.location.pathname.endsWith("post.html")&&(async()=>{const s=new URLSearchParams(window.location.search).get("slug");if(!s)return;const a=await(await d(`/api/posts/${s}`)).json();document.title=`${a.title} | BuzzInk`;const t=a.content.slice(0,160);document.getElementById("postTitle")?.setAttribute("content",a.title),document.getElementById("postDescription")?.setAttribute("content",t),document.getElementById("ogTitle")?.setAttribute("content",a.title),document.getElementById("ogDescription")?.setAttribute("content",t),document.getElementById("ogImage")?.setAttribute("content",a.image||"/Images/fallback.jpg"),document.getElementById("ogUrl")?.setAttribute("content",window.location.href),document.getElementById("twitterTitle")?.setAttribute("content",a.title),document.getElementById("twitterDescription")?.setAttribute("content",t),document.getElementById("twitterImage")?.setAttribute("content",a.image||"/Images/fallback.jpg")})()}async function et(e){const s=e.dataset.postId,o=e.querySelector("i"),a=e.querySelector(".like-count"),t=e.closest(".post-interactions-container")?.querySelector(".liked-by"),n=e.classList.contains("liked");if(!window.currentUser){l("Please log in to like or unlike posts.","error");return}try{let i;n?i=await d(`/api/posts/${s}/unlike`,{method:"POST",credentials:"include"}):i=await d(`/api/posts/${s}/like`,{method:"POST",credentials:"include"});const r=await i.json();i.ok?(n?(e.classList.remove("liked"),o.className="fa-regular fa-heart"):(e.classList.add("liked"),o.className="fa-solid fa-heart"),a.textContent=r.likes??0,t.dataset.postId=s,t.dataset.likedBy=JSON.stringify(r.likedBy||[]),r.likedBy&&r.likedBy.length>0?(t.classList.remove("disabled"),r.likedBy.length===1?t.textContent=`Liked by ${r.likedBy[0]}`:t.textContent=`Liked by ${r.likedBy[0]} and ${r.likedBy.length-1} others`):(t.classList.add("disabled"),t.textContent="No likes yet")):l(`Failed to update likes: ${r.message}`,"error")}catch(i){console.error("Like action failed:",i),l("Error updating like. Please try again.","error")}}let Q=!1;function tt(e,s){const o=document.getElementById(`likesModal-${e}`),a=document.getElementById(`likesList-${e}`);if(!o||!a)return;a.innerHTML="",s.forEach(n=>{const i=document.createElement("li");i.textContent=n,a.appendChild(i)}),o.classList.remove("hidden"),requestAnimationFrame(()=>o.classList.add("active")),Q=!0,o.querySelector(".likes-modal-content").addEventListener("click",n=>n.stopPropagation()),document.getElementById(`closeLikesModal-${e}`)?.addEventListener("click",n=>{n.stopPropagation(),oe(e)},{once:!0})}function oe(e){const s=document.getElementById(`likesModal-${e}`);s&&(s.classList.remove("active"),setTimeout(()=>{s.classList.add("hidden"),Q=!1},300))}function nt(){document.addEventListener("click",async e=>{const s=e.target.closest(".edit-btn");if(s){e.preventDefault(),e.stopPropagation(),editPost(s.dataset.slug);return}const o=e.target.closest(".delete-btn");if(o){e.preventDefault(),e.stopPropagation(),xe(o.dataset.slug);return}const a=e.target.closest(".like-btn");if(a){e.preventDefault(),et(a);return}const t=e.target.closest(".comment-btn");if(t){e.preventDefault(),Pe(t);return}const n=e.target.closest(".likes-info");if(n&&!n.classList.contains("disabled")){e.preventDefault(),e.stopPropagation();const c=n.dataset.postId,f=JSON.parse(n.dataset.likedBy||"[]");if(!c||f.length===0)return;tt(c,f);return}if(Q){const c=document.querySelector(".likes-modal.active");if(c&&!c.contains(e.target)){const f=c.id.replace("likesModal-","");oe(f)}}const i=e.target.closest(".delete-comment-btn");i&&(e.preventDefault(),e.stopPropagation(),Ce(i));const r=e.target.closest(".menu-btn"),u=e.target.closest(".menu-options");if(!r&&!u){document.querySelectorAll(".menu-options").forEach(c=>c.classList.add("hidden"));return}r&&r.nextElementSibling.classList.toggle("hidden"),p?.classList.contains("show")&&!p.contains(e.target)&&![...q].some(c=>c.contains(e.target))&&p.classList.remove("show"),mobileMenu?.classList.contains("active")&&!mobileMenu.contains(e.target)&&!menuToggle.contains(e.target)&&mobileMenu.classList.remove("active")})}document.getElementById("canonicalUrl")?.setAttribute("href",window.location.href);function ae(){const e=window.location.pathname;e==="/"||e==="/index.html"?(O(),_e()):e==="/my-posts.html"?te():e==="/post.html"?Oe():e==="/saved.html"?ze():O()}document?.addEventListener("click",e=>{const s=e.target.closest("a[data-link]");s&&(e.preventDefault(),w(s.getAttribute("href")))});document.addEventListener("DOMContentLoaded",async()=>{const e=await Ke();window.currentUser=e,await U(e),Ze(),nt(),Ge(),Se(),Ue(),$e();const s=localStorage.getItem("theme")||"light";Be(s),ae(),H()});window.addEventListener("popstate",ae);
