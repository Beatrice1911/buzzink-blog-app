(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))e(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&e(o)}).observe(document,{childList:!0,subtree:!0});function a(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function e(n){if(n.ep)return;n.ep=!0;const r=a(n);fetch(n.href,r)}})();const h="/api/posts",M="/api/auth",_="/api/comments",G="https://i.postimg.cc/KvF0rh0Q/custom-default-avatar.png",X=document.body,V=document.querySelectorAll(".user-icon"),T=document.getElementById("userMenuDetails"),N=document.getElementById("authModal"),ae=document.getElementById("closeModal"),P=document.getElementById("loginTab"),B=document.getElementById("registerTab"),re=document.querySelectorAll(".write-post"),ie=document.querySelector(".search-icon"),J=document.getElementById("mobileSearch"),le=document.querySelector(".menu-toggle"),ce=document.getElementById("mobileMenu"),A=document.querySelector(".logo"),de=document.querySelector(".all-posts-btn"),me=document.getElementById("myPosts"),ue=document.getElementById("savedPosts"),ge=document.getElementById("profile-edit"),fe=document.getElementById("settings"),D=document.getElementById("themeToggle"),O=document.documentElement;function c(t,s="info",a=5e3){const e=document.getElementById("toast-container");if(!e)return;const n=document.createElement("div");n.className=`toast toast-${s}`;const r=document.createElement("i");s==="success"?r.className="fas fa-check-circle":s==="error"?r.className="fas fa-exclamation-circle":r.className="fas fa-info-circle",n.appendChild(r);const o=document.createElement("span");o.textContent=t,n.appendChild(o),e.appendChild(n),setTimeout(()=>{n.style.animation="slideOut 0.5s forwards",n?.addEventListener("animationend",()=>n.remove())},a)}function he(){le?.addEventListener("click",t=>{t.stopPropagation(),T.classList.contains("show")&&T.classList.remove("show"),ce.classList.toggle("active")})}function ye(){A?.addEventListener("click",()=>{window.location.href="index.html"}),de?.addEventListener("click",()=>{window.location.href="all-posts.html"}),me?.addEventListener("click",()=>{window.location.href="my-posts.html"}),ge?.addEventListener("click",()=>{window.location.href="dashboard.html"}),ue?.addEventListener("click",()=>{window.location.href="saved.html"}),fe?.addEventListener("click",()=>{window.location.href="settings.html"})}function pe(){P?.addEventListener("click",()=>{k.classList.remove("hidden"),b.classList.add("hidden"),P.classList.add("active"),B.classList.remove("active")}),B?.addEventListener("click",()=>{b.classList.remove("hidden"),k.classList.add("hidden"),B.classList.add("active"),P.classList.remove("active")}),ae?.addEventListener("click",()=>{N.classList.add("hidden")})}function we(){V.forEach(t=>t?.addEventListener("click",()=>{const s=localStorage.getItem("user"),a=s?JSON.parse(s):null;a&&a.id?(T.classList.toggle("show"),N.classList.add("hidden")):(T.classList.add("hidden"),N.classList.remove("hidden"),P.classList.add("active"),B.classList.remove("active"),k.classList.remove("hidden"),b.classList.add("hidden"),k?.reset(),b?.reset())}))}function ve(){ie?.addEventListener("click",()=>{J.classList.toggle("show"),J.classList.contains("show")&&J.querySelector("input").focus()})}function ke(){re.forEach(t=>{t?.addEventListener("click",s=>{const a=localStorage.getItem("user"),e=a?JSON.parse(a):null;!e||!e.id?(s.preventDefault(),N.classList.remove("hidden"),P.classList.add("active"),B.classList.remove("active"),k.classList.remove("hidden"),b.classList.add("hidden")):(localStorage.removeItem("editSlug"),window.location.href="write.html")})})}function be(){D?.addEventListener("change",()=>{D.checked?(O.setAttribute("data-theme","dark"),localStorage.setItem("theme","dark"),A.src="/Images/logo-dark-theme_optimized_.png"):(O.setAttribute("data-theme","light"),localStorage.setItem("theme","light"),A.src="/Images/logo_optimized.png")})}function Oe(){localStorage.getItem("theme")==="dark"?(O.setAttribute("data-theme","dark"),D&&(D.checked=!0)):O.setAttribute("data-theme","light")}function He(t){t==="dark"?(X.classList.add("dark"),A.src="/Images/logo-dark-theme_optimized_.png"):(X.classList.remove("dark"),A.src="/Images/logo_optimized.png"),localStorage.setItem("theme",t)}function _e(){he(),pe(),we(),ve(),ke(),ye(),be()}async function ze(t){const s=t.dataset.slug;if(!s)return;const a=window.location.pathname.endsWith("post.html"),e=a?document.getElementById("singlePostContainer"):t.closest(".post");if(!e)return;const n=e.querySelector(".comments-section"),r=n?.querySelector(".comments-list");!n||!r||(a||n.classList.toggle("show"),(a||n.classList.contains("show"))&&await Z(s,r))}async function Re(t){if(t.dataset.deleting==="true")return;t.dataset.deleting="true";const s=t.dataset.commentId;if(!confirm("Are you sure you want to delete this comment?")){t.dataset.deleting="false";return}try{const e=await m(`${_}/${s}`,{method:"DELETE"}),n=await e.json();if(e.ok){const r=t.closest(".comment");r&&r.remove();const i=(window.location.pathname.endsWith("post.html")?document.getElementById("singlePostContainer"):t.closest(".post"))?.querySelector(".comment-count");if(i){let l=parseInt(i.textContent)||0;l=Math.max(l-1,0),i.textContent=l,i.title=`${l} comment${l!==1?"s":""}`}c("Comment deleted successfully!","success")}else throw new Error(n.message||"Delete failed")}catch(e){console.error("Error deleting comment:",e),c("Error deleting comment. Please try again.","error")}finally{t.dataset.deleting="false"}}async function Z(t,s,a=3){try{s.innerHTML='<p class="loading-comments">Loading comments...</p>';const e=await m(`${_}/post/${t}?_=${Date.now()}`);if(!e.ok)throw new Error("Failed to fetch comments");const n=await e.json();if(s.innerHTML="",n.length===0){s.innerHTML="<p class='no-comments'>No comments yet. Be the first to comment!</p>";return}const r=n.slice(0,a);if(W(r,s),n.length>a){const o=document.createElement("button");o.classList.add("view-more-btn"),o.textContent=`View all ${n.length} comments`;const i=document.createElement("div");i.classList.add("comments-scroll-container"),i.style.display="none",W(n,i);let l=!1;o?.addEventListener("click",()=>{l=!l,l?(s.innerHTML="",s.appendChild(i),s.appendChild(o),i.style.display="block",o.textContent="View less comments"):(s.innerHTML="",W(r,s),o.textContent=`View all ${n.length} comments`,s.appendChild(o))}),s.appendChild(o)}}catch(e){console.error("Error fetching comments:",e),s.innerHTML="<p class='error-comments'>Failed to load comments.</p>"}}function W(t,s){const a=window.currentUser?.id||window.currentUser?._id;t.forEach(e=>{const n=document.createElement("div");n.classList.add("comment");const r=typeof e.authorId=="object"?e.authorId._id:e.authorId,o=a&&r&&r.toString()===a.toString();n.innerHTML=`
      <div class="comment-header">
        <p><strong class="comment-author" style="cursor: pointer;">${e.authorId?.name||"Anonymous"}:</strong> ${K(e.text)}</p>
        ${o?`<div class="comment-menu">
                  <button class="menu-btn">⋮</button>
                  <div class="menu-options hidden">
                    <button class="delete-comment-btn" data-comment-id="${e._id}">Delete</button>
                  </div>
                </div>`:""}
      </div>  
      <small title="${new Date(e.createdAt).toLocaleString()}">
        ${U(e.createdAt)}
      </small>
    `,s.appendChild(n),n.querySelector(".comment-author")?.addEventListener("click",()=>{window.location.href=`profile.html?id=${e.authorId?._id}`})})}async function Ee(t,s,a,e){try{const n=await m(`${_}/post/${t}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:s})});if(n.ok){const o=(await n.json()).comment,i=document.createElement("div");if(i.classList.add("comment"),i.innerHTML=`
        <div class="comment-header">
          <p><strong>You:</strong> ${K(o.text)}</p>
          <div class="comment-menu">
            <button class="menu-btn">⋮</button>
            <div class="menu-options hidden">
              <button class="delete-comment-btn" data-comment-id="${o._id}">Delete</button>
            </div>
          </div>
        </div>
        <small title="${new Date(o.createdAt).toLocaleString()}">
        ${U(o.createdAt)}
      </small>
      `,a.prepend(i),e&&e){let l=parseInt(e.textContent)||0;e.textContent=l+1,e.title=`${l+1} comments`}c("Comment posted successfully!","success")}else throw new Error("Failed to post comment")}catch(n){console.error("Error posting comment:",n),c("Failed to post comment","error")}}async function ee(t,s){try{const a=await m(`${_}/post/${t}`);if(!a.ok)throw new Error("Failed to fetch comment count");const n=(await a.json()).length;n===0?(s.textContent="0",s.title="No comments yet"):(s.textContent=n,s.title=`${n} comment${n>1?"s":""}`)}catch(a){console.error("Error fetching comment count:",a),s.textContent="0"}}async function Ie(t){const s=t.target.closest(".comment-form"),a=s.querySelector(".comment-form button");if(!s)return;t.preventDefault();const e=s.querySelector(".comment-input"),n=e.value.trim();if(!n)return;let r,o,i,l;window.location.pathname.endsWith("post.html")?(r=document.getElementById("singlePostContainer"),o=r.querySelector(".comments-list"),i=r.querySelector(".comment-btn").dataset.slug,l=r.querySelector(".comment-count")):(r=s.closest(".post"),o=r.querySelector(".comments-list"),i=r.querySelector(".like-btn").dataset.slug,l=r.querySelector(".comment-count"));const d=g=>{a.disabled=g,a.innerHTML=g?'<i class="fa-solid fa-spinner fa-spin"></i>':"Comment"};try{if(d(!0),!window.currentUser){c("Please log in to comment.","error"),e.value="",d(!1);return}await Ee(i,n,o,l),e.value=""}catch{d(!1)}finally{d(!1)}}function Je(){document.addEventListener("submit",Ie)}const Le=document.querySelectorAll(".search");let v={all:[],mine:[],saved:[]},I=1,u=Number(sessionStorage.getItem("postsPage"))||1,We=sessionStorage.getItem("postsCategory")||"";sessionStorage.getItem("postsSearch");function Y(t){return t&&t.startsWith("http")?t:"/Images/fallback.jpg"}function $e(t){t.innerHTML=`<p style="text-align:center; color:gray; font-size: 20px; font-weight: bold;">You haven't made any posts yet...</p>`}async function z(t=1,s=6){try{const a=document.getElementById("categoryFilter")?.value,e=document.querySelectorAll(".search"),n=new URLSearchParams;n.append("page",t),n.append("limit",s),a&&a!=="all"&&n.append("category",a),e.forEach(l=>{if(l){const d=l.value.trim();d&&n.append("search",d)}});const o=await(await m(`${h}?${n.toString()}`)).json();v.all=Array.isArray(o.posts)?o.posts:[],u=o.currentPage??1,I=o.totalPages??1,typeof u<"u"&&sessionStorage.setItem("postsPage",u),sessionStorage.setItem("postsCategory",a&&a!=="all"?a:"");const i=[...e].find(l=>l.value.trim())?.value.trim()||"";sessionStorage.setItem("postsSearch",i),C("allPostsContainer"),Q("allPostsContainer",u,I)}catch(a){console.error("Error fetching posts:",a),c("Something went wrong while displaying posts!","error")}}async function te(t=1,s=6){try{const a=document.querySelectorAll(".search"),e=new URLSearchParams;e.append("page",t),e.append("limit",s),a.forEach(l=>{if(l){const d=l.value.trim();d&&e.append("search",d)}});const n=await m(`${h}/mine?${e.toString()}`);if(!n.ok){const l=await n.text();throw new Error(l||"Failed to fetch your posts")}const r=await n.json();v.mine=Array.isArray(r.posts)?r.posts:[],u=r.currentPage||1,I=r.totalPages||1,sessionStorage.setItem("postsPage",u);const o=[...a].find(l=>l.value.trim())?.value.trim()||"";sessionStorage.setItem("postsSearch",o);const i="myPostsContainer";if(C("myPostsContainer",null,"You haven't made any posts yet..."),Q(i,u,I),v.mine.length===0){const l=document.getElementById("myPostsContainer");l&&$e(l)}}catch(a){console.error("Error fetching my posts:",a),c("Failed to load your posts!","error")}}function U(t){const s=Math.floor((Date.now()-new Date(t))/1e3),a=[{label:"year",seconds:31536e3},{label:"month",seconds:2592e3},{label:"day",seconds:86400},{label:"hour",seconds:3600},{label:"minute",seconds:60},{label:"second",seconds:1}],e=new Intl.RelativeTimeFormat("en",{numeric:"auto"});for(const n of a){const r=Math.floor(s/n.seconds);if(r>=1)return e.format(-r,n.label)}return"Just now"}function K(t){return t.replace(/\n/g,"<br>")}function C(t,s=null,a=null){const e=window.currentUser?._id||window.currentUser?.id,n=document.getElementById(t);if(!n)return;n.innerHTML="";let r=[];if(t==="allPostsContainer"||t==="featuredPostsContainer"?r=[...v.all]:t==="myPostsContainer"?r=[...v.mine]:t==="savedPostsContainer"&&(r=[...v.saved]),s&&(r=r.slice(0,s)),r.length===0){n.innerHTML=a??'<p style="text-align:center; color:gray; font-size:20px;">No results found...</p>';return}r.forEach(o=>{const i=document.createElement("div");i.classList.add("post");const l=o.content.length>150?o.content.substring(0,150)+"...":o.content,d=typeof o.authorId=="object"&&o.authorId!==null?o.authorId._id:o.authorId,g=typeof o.authorId=="object"&&o.authorId!==null?o.authorId.name:o.authorName||"Unknown",q=e&&String(d)===String(e);i.innerHTML=`
      ${o.image?`<a href="post.html?slug=${o.slug}">
             <img src="${Y(o.image)}" alt="${o.title}" class="post-image" loading="lazy">
           </a>`:""}
        <p class="tag">${o.category}</p>
        <h2>
          <a href="post.html?slug=${o.slug}" class="post-link">${o.title}</a>
        </h2>
        <p>${l} <a href="post.html?slug=${o.slug}" class="read-more">Read more</a></p>
        <a href="profile.html?id=${d}" class="author"><em>By ${g}</em></a>
        <small title="${new Date(o.date).toLocaleString()}">
          ${U(o.date)}
        </small>
        <br>
        <div class="post-interactions-container">
          <div class="post-interactions">
            <button class="like-btn ${o.likedByUser?"liked":""}" data-slug="${o.slug}">
              <i class="${o.likedByUser?"fa-solid":"fa-regular"} fa-heart"></i>
              <span class="like-count">${o.likesCount||0}</span>
            </button>
            <button class="comment-btn" data-slug="${o.slug}">
              <i class="fa-regular fa-comment"></i>
              <span class="comment-count">${o.commentsCount||0}</span>
            </button>
            <button class="share-btn" data-slug="${o.slug}">
              <i class="fa-solid fa-share"></i>
              <span class="share-count">${o.shares}</span>
            </button>
          </div>
          <span class="liked-by likes-info">No likes yet</span>
        </div>
        <div id="likesModal-${o.slug}" class="likes-modal hidden slide-up">
          <div class="likes-modal-content">
            <span id="closeLikesModal-${o.slug}" class="close-btn">&times;</span>
            <h3>Liked by</h3>
            <ul id="likesList-${o.slug}" class="likes-list"></ul>            
          </div>
        </div>
        <div class="comments-section">
          <form class="comment-form">
            <input type="text" class="comment-input" placeholder="Write a comment..." required />
            <button type="submit">Comment</button>
          </form>
          <div class="comments-list"></div>
        </div>
        ${q?`
        <div class="post-actions">
            <button class="edit-btn btn" data-slug="${o.slug}">Edit</button>
            <button class="delete-btn btn" data-slug="${o.slug}">Delete</button>
        </div>
        `:""}
    `,n.appendChild(i);const y=i.querySelector(".post-image");y&&(y.onerror=function(){this.onerror=null,this.src="/Images/fallback.jpg"});const $=i.querySelector(".like-btn"),j=$.querySelector("i"),p=i.querySelector(".liked-by");p.dataset.slug=o.slug,p.dataset.likedBy=JSON.stringify(o.likedBy||[]),o.likedBy&&o.likedBy.length>0?p.classList.remove("disabled"):p.classList.add("disabled");const F=Array.isArray(o.likes)?o.likes.map(S=>typeof S=="object"?S._id:S):[];e&&(F.includes(e)||o.likedByUser)?($.classList.add("liked"),j.className="fa-solid fa-heart"):($.classList.remove("liked"),j.className="fa-regular fa-heart"),!o.likedBy||o.likedBy.length===0?p.textContent="No likes yet":o.likedBy.length===1?p.textContent=`Liked by ${o.likedBy[0]}`:p.textContent=`Liked by ${o.likedBy[0]} and ${o.likedBy.length-1} others`;const w=i.querySelector(".comment-count");ee(o.slug,w)})}async function Se(t,s,a,e){const n=new FormData;n.append("title",t),n.append("content",s),n.append("category",a),e&&n.append("image",e);const r=await m(`${h}`,{method:"POST",body:n});if(!r.ok)throw new Error("Failed to add post");return await r.json()}async function Ve(t){if(confirm("Are you sure you want to delete this post?"))try{const s=await m(`${h}/${t}`,{method:"DELETE"});if(!s.ok){const a=await s.text();throw new Error(a||"Failed to delete post")}c("Post deleted successfully!","success"),window.location.pathname.endsWith("my-posts.html")?te(u):z(u)}catch(s){console.error("Error deleting post:",s),c("Failed to delete post!","error")}}function Ye(t){t&&(localStorage.setItem("editSlug",t),window.location.href="write.html")}function Ke(){const t=document.getElementById("postForm"),s=document.querySelector(".add-post-btn");if(!t)return;const a=localStorage.getItem("editSlug"),e=n=>{s.disabled=n,s.innerHTML=n?'<i class="fa-solid fa-spinner fa-spin"></i> Posting...':a?"Update Post":"Add Post"};a&&a!=="null"?((async()=>{try{const n=await m(`${h}/${a}`);if(!n.ok)throw new Error("Post not found");const r=await n.json();if(document.getElementById("title").value=r.title||"",document.getElementById("content").value=r.content||"",document.getElementById("category").value=r.category||"",r.image){const o=document.getElementById("imagePreview");o.src=r.image,o.style.display="block"}}catch(n){console.error("Error loading post:",n)}})(),t.onsubmit=async function(n){n.preventDefault();const r=new FormData;r.append("title",document.getElementById("title").value),r.append("content",document.getElementById("content").value),r.append("category",document.getElementById("category").value);const o=document.getElementById("image").files[0];o&&r.append("image",o);try{e(!0);const i=await m(`${h}/${a}`,{method:"PUT",body:r});i.ok?(c("Post updated successfully!","success"),localStorage.removeItem("editSlug"),window.location.href="all-posts.html"):console.error("Update failed:",await i.text())}catch(i){console.error("Error updating post:",i),c("Failed to update post!","error")}finally{e(!1)}}):(localStorage.removeItem("editSlug"),t?.addEventListener("submit",async function(n){n.preventDefault();const r=document.getElementById("title").value,o=document.getElementById("content").value,i=document.getElementById("category").value,l=document.getElementById("image").files[0];console.log("Submitting new post:",{title:r,content:o,category:i,imageFile:l});try{e(!0);const d=await Se(r,o,i,l);console.log("Post created successfully!",d),c("Post created successfully!","success"),t.reset(),window.location.href="all-posts.html",localStorage.removeItem("editSlug")}catch(d){console.error("Error adding post:",d),c("Failed to add post!","error")}finally{e(!1)}}))}function Pe(t){const s=document.getElementById("post-jsonld");s&&s.remove();const a={"@context":"https://schema.org","@type":"Article",headline:t.title,description:t.content.slice(0,160),image:t.image?[t.image]:[],author:{"@type":"Person",name:t.authorName||"BuzzInk Contributor"},publisher:{"@type":"Organization",name:"BuzzInk",logo:{"@type":"ImageObject",url:"https://buzzink.onrender.com/Images/logo_optimized.png"}},datePublished:t.createdAt||t.date,dateModified:t.updatedAt||t.date,mainEntityOfPage:{"@type":"WebPage","@id":window.location.href}},e=document.createElement("script");e.type="application/ld+json",e.id="post-jsonld",e.textContent=JSON.stringify(a),document.head.appendChild(e)}function Be(t){document.title=`${t.title} - BuzzInk`;const s=t.content.slice(0,160);document.getElementById("postTitle")?.setAttribute("content",t.title),document.getElementById("postDescription")?.setAttribute("content",s),document.getElementById("ogTitle")?.setAttribute("content",t.title),document.getElementById("ogDescription")?.setAttribute("content",s),document.getElementById("ogImage")?.setAttribute("content",t.image||"/Images/fallback.jpg"),document.getElementById("ogUrl")?.setAttribute("content",window.location.href),document.getElementById("twitterTitle")?.setAttribute("content",t.title),document.getElementById("twitterDescription")?.setAttribute("content",s),document.getElementById("twitterImage")?.setAttribute("content",t.image||"/Images/fallback.jpg"),Pe(t)}async function Qe(){const s=new URLSearchParams(window.location.search).get("slug")||window.location.pathname.split("/").pop();if(s&&m(`/api/posts/${s}/view`,{method:"POST"}).catch(a=>{console.error("Failed to increment view",a)}),!!s){try{let S=function(f){w.dataset.saved=f?"true":"false",w.classList.toggle("saved",f);const E=w.querySelector("i");E.classList.toggle("fa-solid",f),E.classList.toggle("fa-regular",!f)};const a=await m(`${h}/${s}`);if(!a.ok)throw new Error("Failed to fetch post");const e=await a.json(),n=window.currentUser?._id||window.currentUser?.id,r=typeof e.authorId=="object"&&e.authorId!==null?e.authorId._id:e.authorId,o=typeof e.authorId=="object"&&e.authorId!==null?e.authorId.name:e.authorName||"Unknown",i=n&&String(r)===String(n),l=document.getElementById("singlePostContainer");l.innerHTML=`
      ${e.image?`<img src="${Y(e.image)}" alt="${e.title}" class="post-image" loading="lazy">`:""}
      <h1>${e.title}</h1>
      <p class="tag">${e.category}</p>
      <p onclick="window.location.href='profile.html?id=${r}'" style="cursor: pointer;" class="author"><em>By ${o}</em></p>
      <small title="${new Date(e.date).toLocaleString()}">
        ${U(e.date)}
      </small>
      <div class="content">
        <p>${K(e.content)}</p>
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
    `;const d=l.querySelector(".post-image");d&&(d.onerror=function(){this.onerror=null,this.src="/Images/fallback.jpg"});const g=l?.querySelector(".like-btn"),q=g?.querySelector("i"),y=l?.querySelector(".liked-by");y.dataset.slug=e.slug,y.dataset.likedBy=JSON.stringify(e.likedBy||[]),e.likedBy&&e.likedBy.length>0?y.classList.remove("disabled"):y.classList.add("disabled");const $=Array.isArray(e.likes)?e.likes.map(f=>typeof f=="object"?f._id:f):[];n&&($.includes(n)||e.likedByUser)?(g.classList.add("liked"),q.className="fa-solid fa-heart"):(g.classList.remove("liked"),q.className="fa-regular fa-heart"),!e.likedBy||e.likedBy.length===0?y.textContent="No likes yet":e.likedBy.length===1?y.textContent=`Liked by ${e.likedBy[0]}`:y.textContent=`Liked by ${e.likedBy[0]} and ${e.likedBy.length-1} others`;const j=l.querySelector(".comment-count");ee(e.slug,j);const p=document.querySelector(".comments-section"),F=p.querySelector(".comments-list");p&&F&&await Z(e.slug,F,1/0);const w=l.querySelector(".bookmark");w?.addEventListener("click",async()=>{const f=w.dataset.slug,E=w.dataset.saved==="true";if(!window.currentUser){c("Please log in to save posts");return}w.classList.add("clicked"),setTimeout(()=>w.classList.remove("clicked"),200);const se=E?`/api/posts/${f}/unsave`:`/api/posts/${f}/save`;try{const x=await m(se,{method:"POST"}),oe=await x.json();if(!x.ok)throw new Error(oe.message||"Failed to toggle bookmark");S(!E),c(E?"Removed from saved posts":"Post saved","success")}catch(x){console.error("Failed to toggle bookmark",x),c("Something went wrong","error")}}),Be(e)}catch(a){console.error(a),document.getElementById("singlePostContainer").innerHTML="<p>Error loading post.</p>"}Te(s)}}const Ge=async()=>{const s=await(await m(`${h}/trending?limit=5`)).json(),a=document.getElementById("trending-list");a.innerHTML=s.map((e,n)=>`
    <li>
      <span class="trending-rank">${["🥇","🥈","🥉"][n]||`#${n+1}`}</span>
      <a href="post.html?slug=${e.slug}" class="trending-title">${e.title}</a>
      <i class="fa-solid fa-bolt trending-icon" title="Trending now"></i>
    </li>
  `).join("")};function Ce(t){const s=document.getElementById("related-posts-container");if(!t.length){s.innerHTML="<p style='margin: 0 5px;'>No related posts found.</p>";return}s.innerHTML=t.map(a=>`
      <article class="related-post-card">
        <h4><a href="post.html?slug=${a.slug}">${a.title}</a></h4>
        <small>${a.category}</small>
      </article>
    `).join("")}const Te=async t=>{try{const a=await(await m(`${h}/slug/${t}/related`)).json();Ce(a)}catch(s){console.error("Failed to fetch related posts.",s)}},Ae=document.getElementById("savedPostsContainer");async function Me(t=1,s=6){try{const a=document.querySelectorAll(".search"),e=new URLSearchParams;e.append("page",t),e.append("limit",s),a.forEach(i=>{if(i){const l=i.value.trim();l&&e.append("search",l)}});const n=await m(`${h}/saved/me?${e.toString()}`);if(!n.ok)throw new Error("Failed to fetch");const r=await n.json();v.saved=Array.isArray(r.posts)?r.posts:[],u=r.currentPage||1,I=r.totalPages||1,sessionStorage.setItem("postsPage",u);const o=Ae;if(!o)return;if(v.saved.length===0){o.innerHTML="<p>You have no saved posts yet.</p>";return}o.innerHTML=v.saved.map(i=>`
      <article class="post-card">
        ${i.image?`
          <img 
            src="${Y(i.image)}" 
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
            <small title="${new Date(i.date).toLocaleString()}">${U(i.date)}</small>
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
    `).join(""),document.querySelectorAll(".bookmark").forEach(i=>{i?.addEventListener("click",async l=>{l.stopPropagation();const d=i.dataset.slug;try{await m(`${h}/${d}/unsave`,{method:"POST"}),i.closest(".post-card").remove(),c("Removed from saved posts","success")}catch(g){console.error(g),c("Failed to remove","error")}})}),Q("savedPostsContainer",u,I)}catch(a){console.error(a),container.innerHTML="<p>Error loading saved posts.</p>"}}function Ue(){document.getElementById("allPostsContainer")&&C("allPostsContainer"),document.getElementById("featuredPostsContainer")&&C("featuredPostsContainer",3),document.getElementById("myPostsContainer")&&C("myPostsContainer",null,"You haven't made any posts yet...")}document.getElementById("categoryFilter")?.addEventListener("change",()=>z(1));Le.forEach(t=>t?.addEventListener("keyup",()=>z(1)));function Q(t,s,a){const e=document.getElementById("pagination");if(e){e.innerHTML="";for(let n=1;n<=a;n++){const r=document.createElement("button");r.textContent=n,r.className=n===s?"pg-active":"",r?.addEventListener("click",()=>{t==="myPostsContainer"?te(n):t==="savedPostsContainer"?Me(n):z(n)}),e.appendChild(r)}}}const k=document.getElementById("loginForm"),b=document.getElementById("registerForm"),qe=document.getElementById("logoutBtn");function R(t){return t?{...t,id:t.id||t._id}:null}window.currentUser=(()=>{const t=localStorage.getItem("user");return t?R(JSON.parse(t)):null})();function L(t){t?.id?V.forEach(s=>s.title=`Logged in as ${t.name}`):(V.forEach(s=>s.title="Click to Login/Register"),T?.classList.remove("show"))}async function H(t){try{const s=await m("/api/users/me");if(!s.ok)return;t=await s.json();const a=document.querySelectorAll(".user-icon");a&&a.forEach(n=>{n.src=t.profilePhoto?.trim()?t.profilePhoto:G});const e=document.querySelectorAll(".avatar");e&&e.forEach(n=>{n.src=t.profilePhoto?.trim()?t.profilePhoto:G}),window.currentUser=t}catch(s){console.warn("Failed to load auth user:",s)}}function je(){k?.addEventListener("submit",async t=>{t.preventDefault();const s=document.getElementById("loginEmail").value,a=document.getElementById("loginPassword").value;console.log("Login Triggered");const e=await m(`${M}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:s,password:a})}),n=await e.json();console.log("Login response:",n),e.ok||c(`Login failed: ${n.message||"Unknown error"}`,"error");const r=R(n.user);localStorage.setItem("user",JSON.stringify(r)),window.currentUser=r,localStorage.setItem("role",r.role),r.role==="admin"&&(window.location.href="admin.html"),L(r),H(r),authModal.classList.add("hidden"),k.reset(),c(`Welcome back, ${r.name}!`,"success"),Ue()})}function Fe(){b?.addEventListener("submit",async t=>{t.preventDefault();const s=document.getElementById("registerName").value,a=document.getElementById("registerEmail").value,e=document.getElementById("registerPassword").value,n=await m(`${M}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:s,email:a,password:e})}),r=await n.json();console.log("Register response:",r),n.ok||c(`Registration failed: ${r.message||"Unknown error"}`,"error");const o=R(r.user);localStorage.setItem("user",JSON.stringify(o)),window.currentUser=o,localStorage.setItem("role",o.role),L(o),H(o),authModal.classList.add("hidden"),b.reset(),c(`Welcome, ${o.name}! Your account has been created.`,"success")})}function xe(){qe?.addEventListener("click",()=>{ne(),window.location.href="index.html"})}async function Xe(){try{const t=await m(`${M}/me`);if(!t.ok)throw new Error("Not authenticated");const s=await t.json(),a=R(s);return localStorage.setItem("user",JSON.stringify(a)),window.currentUser=a,L(a),H(a),a}catch{return L(null),H(null),null}}async function ne(t=!1){try{await fetch(`${M}/logout`,{method:"POST",credentials:"include"})}catch(s){console.warn("Logout request failed:",s)}localStorage.removeItem("user"),window.currentUser=null,L(null),t||c("You have been logged out.","info")}function Ne(){const t=document.getElementById("forgotPasswordLink"),s=document.getElementById("forgotPasswordModal"),a=document.getElementById("closeForgotModal"),e=document.getElementById("forgotPasswordForm");t&&t?.addEventListener("click",n=>{n.preventDefault(),s.classList.remove("hidden")}),a&&a?.addEventListener("click",()=>{s.classList.add("hidden")}),e&&e?.addEventListener("submit",async n=>{n.preventDefault();const r=document.getElementById("forgotEmail").value.trim();try{const i=await(await fetch("/api/auth/forgot-password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:r})})).json();c(i.message||"Check your email for the reset link.","success"),s.classList.add("hidden")}catch(o){console.error(o),c("Failed to send reset link. Try again.","error")}})}function Ze(){je(),Fe(),xe(),Ne()}async function m(t,s={}){let a=await fetch(t,{credentials:"include",...s});return a.status===401&&(await De()?a=await fetch(t,{credentials:"include",...s}):ne(!0)),a}async function De(){try{const t=await fetch(`${M}/refresh`,{method:"POST",credentials:"include"});if(!t.ok)throw new Error("Refresh failed");const s=await t.json();return window.currentUser=s.user,L(s.user),!0}catch{return!1}}export{m as a,V as b,le as c,Ve as d,Ye as e,We as f,Xe as g,Re as h,Ze as i,_e as j,Je as k,Oe as l,ce as m,He as n,Ke as o,z as p,Ge as q,Ue as r,c as s,ze as t,T as u,te as v,Qe as w,Me as x,ne as y};
