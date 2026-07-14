import { useState, useRef, useEffect } from "react";

const INITIAL_USERS = [
  { id: 1, name: "Paoulo Agko", handle: "paoulo_dev", avatar: "PA", bio: "Full-stack dev. React • Node • Kotlin", followers: 412, following: 198 },
  { id: 2, name: "Maya Chen", handle: "mayabuilds", avatar: "MC", bio: "UI/UX Designer & frontend dev 🎨", followers: 891, following: 320 },
  { id: 3, name: "Remi Okafor", handle: "remi_codes", avatar: "RO", bio: "Backend engineer. Python & AWS enthusiast", followers: 233, following: 150 },
];

const INITIAL_POSTS = [
  {
    id: 1, userId: 2, content: "Just shipped a new design system from scratch. Figma → code pipeline is finally smooth 🎉", timestamp: new Date(Date.now() - 1000 * 60 * 18), likes: 24, likedBy: [], comments: [
      { id: 1, userId: 1, text: "That pipeline is a game changer. What did you use?", timestamp: new Date(Date.now() - 1000 * 60 * 10) },
    ]
  },
  {
    id: 2, userId: 3, content: "Hot take: documenting your code AS you write it saves 10x more time than doing it later. Fight me.", timestamp: new Date(Date.now() - 1000 * 60 * 55), likes: 41, likedBy: [], comments: []
  },
  {
    id: 3, userId: 1, content: "Built a welfare check Android app using Jetpack Compose and Room DB last semester. Really enjoyed pushing Kotlin to its limits — multi-role nav, shared composables, the whole stack.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), likes: 38, likedBy: [], comments: [
      { id: 2, userId: 2, text: "Compose is so good now. Did you use ViewModel for state?", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
    ]
  },
];

const CURRENT_USER = INITIAL_USERS[0];

function timeAgo(date) {
  const diff = Math.floor((Date.now() - date) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

function Avatar({ user, size = 40 }) {
  const colors = ["#6366f1", "#ec4899", "#14b8a6", "#f59e0b", "#8b5cf6"];
  const color = colors[user.id % colors.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${color}cc, ${color})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 700, fontSize: size * 0.35, color: "#fff",
      flexShrink: 0, letterSpacing: "0.5px"
    }}>
      {user.avatar}
    </div>
  );
}

function Post({ post, users, currentUser, onLike, onComment, onOpenProfile }) {
  const author = users.find(u => u.id === post.userId);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const liked = post.likedBy.includes(currentUser.id);

  return (
    <div style={{
      background: "#111318", border: "1px solid #1e2130",
      borderRadius: 16, padding: "20px 22px", marginBottom: 14,
      transition: "border-color 0.2s"
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "#2a2f47"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "#1e2130"}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div onClick={() => onOpenProfile(author)} style={{ cursor: "pointer" }}>
          <Avatar user={author} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span
              onClick={() => onOpenProfile(author)}
              style={{ fontWeight: 700, color: "#e8eaf6", fontSize: 14, cursor: "pointer" }}
              onMouseEnter={e => e.target.style.textDecoration = "underline"}
              onMouseLeave={e => e.target.style.textDecoration = "none"}
            >{author.name}</span>
            <span style={{ color: "#4a5280", fontSize: 13 }}>@{author.handle}</span>
            <span style={{ color: "#2a2f47", fontSize: 12 }}>·</span>
            <span style={{ color: "#4a5280", fontSize: 12 }}>{timeAgo(post.timestamp)}</span>
          </div>
          <p style={{ color: "#c5c9e8", fontSize: 15, lineHeight: 1.6, margin: 0, marginBottom: 14, wordBreak: "break-word" }}>
            {post.content}
          </p>
          <div style={{ display: "flex", gap: 20 }}>
            <button onClick={() => onLike(post.id)} style={{
              background: "none", border: "none", cursor: "pointer",
              color: liked ? "#ec4899" : "#4a5280", display: "flex",
              alignItems: "center", gap: 6, fontSize: 13, padding: 0,
              transition: "color 0.15s"
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {post.likes + (liked ? 1 : 0)}
            </button>
            <button onClick={() => setShowComments(!showComments)} style={{
              background: "none", border: "none", cursor: "pointer",
              color: showComments ? "#6366f1" : "#4a5280", display: "flex",
              alignItems: "center", gap: 6, fontSize: 13, padding: 0,
              transition: "color 0.15s"
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              {post.comments.length}
            </button>
          </div>

          {showComments && (
            <div style={{ marginTop: 14, borderTop: "1px solid #1a1e2e", paddingTop: 14 }}>
              {post.comments.map(c => {
                const cu = users.find(u => u.id === c.userId);
                return (
                  <div key={c.id} style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                    <Avatar user={cu} size={30} />
                    <div>
                      <span style={{ fontWeight: 600, color: "#c5c9e8", fontSize: 13 }}>{cu.name} </span>
                      <span style={{ color: "#4a5280", fontSize: 12 }}>· {timeAgo(c.timestamp)}</span>
                      <p style={{ color: "#9ba3c8", fontSize: 13, margin: "3px 0 0" }}>{c.text}</p>
                    </div>
                  </div>
                );
              })}
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <Avatar user={currentUser} size={30} />
                <input
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" && commentText.trim()) {
                      onComment(post.id, commentText.trim());
                      setCommentText("");
                    }
                  }}
                  placeholder="Add a comment…"
                  style={{
                    flex: 1, background: "#0d0f18", border: "1px solid #1e2130",
                    borderRadius: 20, padding: "7px 14px", color: "#c5c9e8",
                    fontSize: 13, outline: "none"
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ComposeBox({ currentUser, onPost }) {
  const [text, setText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const maxLen = 280;

  async function getAISuggestion() {
    setAiLoading(true);
    setAiSuggestion("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: "You are a social media post writer for developers. Write a single short, authentic, engaging post (under 200 characters) about coding, tech, or developer life. No hashtags, no emojis overload — max 1 emoji. Just the post text, nothing else.",
          messages: [{ role: "user", content: text ? `Continue or improve this draft: "${text}"` : "Write a fresh developer post" }]
        })
      });
      const data = await res.json();
      const suggestion = data.content?.[0]?.text?.trim() || "";
      setAiSuggestion(suggestion);
    } catch {
      setAiSuggestion("Couldn't reach AI — try again.");
    }
    setAiLoading(false);
  }

  return (
    <div style={{
      background: "#111318", border: "1px solid #1e2130",
      borderRadius: 16, padding: "18px 22px", marginBottom: 20
    }}>
      <div style={{ display: "flex", gap: 12 }}>
        <Avatar user={currentUser} />
        <div style={{ flex: 1 }}>
          <textarea
            value={text}
            onChange={e => setText(e.target.value.slice(0, maxLen))}
            placeholder="What's on your mind?"
            rows={3}
            style={{
              width: "100%", background: "transparent", border: "none",
              color: "#e8eaf6", fontSize: 15, resize: "none", outline: "none",
              lineHeight: 1.6, fontFamily: "inherit", boxSizing: "border-box"
            }}
          />
          {aiSuggestion && (
            <div style={{
              background: "#0d0f18", border: "1px solid #2a2f47",
              borderRadius: 10, padding: "10px 14px", marginTop: 8,
              fontSize: 14, color: "#9ba3c8", lineHeight: 1.5
            }}>
              <span style={{ color: "#6366f1", fontSize: 11, fontWeight: 700, display: "block", marginBottom: 4 }}>AI SUGGESTION</span>
              {aiSuggestion}
              <button onClick={() => { setText(aiSuggestion); setAiSuggestion(""); }} style={{
                background: "#6366f1", color: "#fff", border: "none",
                borderRadius: 20, padding: "4px 12px", fontSize: 12, cursor: "pointer",
                marginTop: 8, display: "block"
              }}>Use this</button>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, borderTop: "1px solid #1a1e2e", paddingTop: 12 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button onClick={getAISuggestion} disabled={aiLoading} style={{
                background: aiLoading ? "#1e2130" : "transparent",
                border: "1px solid #2a2f47", color: aiLoading ? "#4a5280" : "#6366f1",
                borderRadius: 20, padding: "6px 14px", fontSize: 12,
                cursor: aiLoading ? "default" : "pointer", fontWeight: 600,
                display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s"
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
                {aiLoading ? "Thinking…" : "AI Suggest"}
              </button>
              <span style={{ color: text.length > maxLen * 0.85 ? "#ec4899" : "#4a5280", fontSize: 12 }}>
                {maxLen - text.length}
              </span>
            </div>
            <button onClick={() => { if (text.trim()) { onPost(text.trim()); setText(""); setAiSuggestion(""); } }} disabled={!text.trim()} style={{
              background: text.trim() ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "#1e2130",
              color: text.trim() ? "#fff" : "#4a5280", border: "none",
              borderRadius: 20, padding: "8px 22px", fontSize: 14,
              fontWeight: 700, cursor: text.trim() ? "pointer" : "default",
              transition: "all 0.2s"
            }}>Post</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileModal({ user, posts, currentUser, onClose }) {
  const userPosts = posts.filter(p => p.userId === user.id);
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 100, backdropFilter: "blur(4px)"
    }} onClick={onClose}>
      <div style={{
        background: "#111318", border: "1px solid #1e2130", borderRadius: 20,
        width: "90%", maxWidth: 440, maxHeight: "80vh", overflow: "auto"
      }} onClick={e => e.stopPropagation()}>
        <div style={{
          height: 80, background: "linear-gradient(135deg, #1a1e3a, #0d0f18)",
          borderRadius: "20px 20px 0 0", position: "relative"
        }}>
          <button onClick={onClose} style={{
            position: "absolute", top: 12, right: 14, background: "rgba(0,0,0,0.4)",
            border: "none", color: "#9ba3c8", borderRadius: "50%", width: 30, height: 30,
            cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center"
          }}>✕</button>
        </div>
        <div style={{ padding: "0 24px 24px" }}>
          <div style={{ marginTop: -28, marginBottom: 12 }}>
            <Avatar user={user} size={56} />
          </div>
          <div style={{ fontWeight: 800, color: "#e8eaf6", fontSize: 18 }}>{user.name}</div>
          <div style={{ color: "#4a5280", fontSize: 14, marginBottom: 8 }}>@{user.handle}</div>
          <div style={{ color: "#9ba3c8", fontSize: 14, marginBottom: 16 }}>{user.bio}</div>
          <div style={{ display: "flex", gap: 24, marginBottom: 20 }}>
            <div><span style={{ fontWeight: 700, color: "#e8eaf6" }}>{user.followers}</span> <span style={{ color: "#4a5280", fontSize: 13 }}>Followers</span></div>
            <div><span style={{ fontWeight: 700, color: "#e8eaf6" }}>{user.following}</span> <span style={{ color: "#4a5280", fontSize: 13 }}>Following</span></div>
            <div><span style={{ fontWeight: 700, color: "#e8eaf6" }}>{userPosts.length}</span> <span style={{ color: "#4a5280", fontSize: 13 }}>Posts</span></div>
          </div>
          <div style={{ borderTop: "1px solid #1a1e2e", paddingTop: 16 }}>
            {userPosts.map(p => (
              <div key={p.id} style={{ marginBottom: 14, color: "#9ba3c8", fontSize: 14, lineHeight: 1.5 }}>
                <p style={{ margin: "0 0 4px" }}>{p.content}</p>
                <span style={{ color: "#2a2f47", fontSize: 12 }}>{timeAgo(p.timestamp)}</span>
              </div>
            ))}
            {userPosts.length === 0 && <p style={{ color: "#4a5280", fontSize: 14 }}>No posts yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SocialApp() {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [users] = useState(INITIAL_USERS);
  const [tab, setTab] = useState("feed");
  const [profileUser, setProfileUser] = useState(null);

  function handlePost(content) {
    setPosts([{
      id: Date.now(), userId: CURRENT_USER.id, content,
      timestamp: new Date(), likes: 0, likedBy: [], comments: []
    }, ...posts]);
  }

  function handleLike(postId) {
    setPosts(posts.map(p => {
      if (p.id !== postId) return p;
      const liked = p.likedBy.includes(CURRENT_USER.id);
      return {
        ...p,
        likedBy: liked ? p.likedBy.filter(id => id !== CURRENT_USER.id) : [...p.likedBy, CURRENT_USER.id]
      };
    }));
  }

  function handleComment(postId, text) {
    setPosts(posts.map(p => p.id !== postId ? p : {
      ...p, comments: [...p.comments, {
        id: Date.now(), userId: CURRENT_USER.id, text, timestamp: new Date()
      }]
    }));
  }

  const myPosts = posts.filter(p => p.userId === CURRENT_USER.id);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0c14", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Header */}
      <div style={{
        position: "sticky", top: 0, background: "rgba(10,12,20,0.9)",
        backdropFilter: "blur(12px)", borderBottom: "1px solid #1e2130",
        zIndex: 50, padding: "0 20px"
      }}>
        <div style={{ maxWidth: 640, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" /><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32" />
              </svg>
            </div>
            <span style={{ fontWeight: 800, color: "#e8eaf6", fontSize: 16, letterSpacing: "-0.3px" }}>devfeed</span>
          </div>
          <div style={{ display: "flex", gap: 2 }}>
            {["feed", "profile"].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                background: tab === t ? "#1a1e2e" : "transparent",
                border: "none", color: tab === t ? "#e8eaf6" : "#4a5280",
                borderRadius: 20, padding: "6px 16px", fontSize: 13,
                fontWeight: tab === t ? 700 : 400, cursor: "pointer",
                textTransform: "capitalize", transition: "all 0.15s"
              }}>{t}</button>
            ))}
          </div>
          <div onClick={() => setProfileUser(CURRENT_USER)} style={{ cursor: "pointer" }}>
            <Avatar user={CURRENT_USER} size={34} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "24px 16px" }}>
        {tab === "feed" && (
          <>
            <ComposeBox currentUser={CURRENT_USER} onPost={handlePost} />
            {posts.map(post => (
              <Post key={post.id} post={post} users={users} currentUser={CURRENT_USER}
                onLike={handleLike} onComment={handleComment} onOpenProfile={setProfileUser} />
            ))}
          </>
        )}

        {tab === "profile" && (
          <div>
            <div style={{
              background: "#111318", border: "1px solid #1e2130",
              borderRadius: 16, overflow: "hidden", marginBottom: 20
            }}>
              <div style={{ height: 90, background: "linear-gradient(135deg, #1a1e3a 0%, #0f1120 100%)" }} />
              <div style={{ padding: "0 22px 22px" }}>
                <div style={{ marginTop: -30, marginBottom: 14 }}>
                  <Avatar user={CURRENT_USER} size={60} />
                </div>
                <div style={{ fontWeight: 800, color: "#e8eaf6", fontSize: 20 }}>{CURRENT_USER.name}</div>
                <div style={{ color: "#4a5280", fontSize: 14, marginBottom: 10 }}>@{CURRENT_USER.handle}</div>
                <div style={{ color: "#9ba3c8", fontSize: 14, marginBottom: 18 }}>{CURRENT_USER.bio}</div>
                <div style={{ display: "flex", gap: 28 }}>
                  <div><span style={{ fontWeight: 700, color: "#e8eaf6", fontSize: 16 }}>{CURRENT_USER.followers}</span><br /><span style={{ color: "#4a5280", fontSize: 12 }}>Followers</span></div>
                  <div><span style={{ fontWeight: 700, color: "#e8eaf6", fontSize: 16 }}>{CURRENT_USER.following}</span><br /><span style={{ color: "#4a5280", fontSize: 12 }}>Following</span></div>
                  <div><span style={{ fontWeight: 700, color: "#e8eaf6", fontSize: 16 }}>{myPosts.length}</span><br /><span style={{ color: "#4a5280", fontSize: 12 }}>Posts</span></div>
                </div>
              </div>
            </div>
            <div style={{ color: "#4a5280", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>Your Posts</div>
            {myPosts.length === 0 && (
              <div style={{ color: "#4a5280", textAlign: "center", padding: 40, fontSize: 14 }}>
                No posts yet — go say something on the feed!
              </div>
            )}
            {myPosts.map(post => (
              <Post key={post.id} post={post} users={users} currentUser={CURRENT_USER}
                onLike={handleLike} onComment={handleComment} onOpenProfile={setProfileUser} />
            ))}
          </div>
        )}
      </div>

      {profileUser && (
        <ProfileModal user={profileUser} posts={posts} currentUser={CURRENT_USER} onClose={() => setProfileUser(null)} />
      )}
    </div>
  );
}
