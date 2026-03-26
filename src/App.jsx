import { useState, useEffect, useRef } from "react";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxN_-YfLA-uxMDJba4lk0pwc9SOoUVbWO7-yDEWxkwHG8GaoDqUtWQH82Ybw_-8obb48w/exec";

// Star Rating Component
function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            transition: "transform 0.2s cubic-bezier(.34,1.56,.64,1)",
            transform: (hover || value) >= star ? "scale(1.15)" : "scale(1)",
          }}
          aria-label={`${star}점`}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={(hover || value) >= star ? "#6C3FC5" : "transparent"}
              stroke={(hover || value) >= star ? "#6C3FC5" : "#C4B5D9"}
              strokeWidth="1.5"
              strokeLinejoin="round"
              style={{ transition: "all 0.25s ease" }}
            />
          </svg>
        </button>
      ))}
    </div>
  );
}

// Floating particles background
function Particles() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: `${6 + Math.random() * 14}px`,
            height: `${6 + Math.random() * 14}px`,
            borderRadius: "50%",
            background: `rgba(108, 63, 197, ${0.04 + Math.random() * 0.06})`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `floatParticle ${8 + Math.random() * 12}s ease-in-out infinite`,
            animationDelay: `${-Math.random() * 10}s`,
          }}
        />
      ))}
    </div>
  );
}

const ratingLabels = ["", "아쉬워요", "보통이에요", "괜찮아요", "좋아요", "최고예요!"];

export default function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [issueLabel, setIssueLabel] = useState("");
  const [showQR, setShowQR] = useState(false);
  const formRef = useRef(null);

  const KAKAOPAY_URL = "https://qr.kakaopay.com/Ej9EHUpMj";

  const handleCoffee = () => {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      window.open(KAKAOPAY_URL, "_blank");
    } else {
      setShowQR(true);
    }
  };

  useEffect(() => {
    // Auto-detect current month for issue label
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    setIssueLabel(`${year}년 ${month}월호`);
    setTimeout(() => setFadeIn(true), 100);
  }, []);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSending(true);

    const payload = {
      timestamp: new Date().toISOString(),
      issue: issueLabel,
      rating,
      ratingLabel: ratingLabels[rating],
      comment: comment.trim(),
    };

    try {
      // Google Apps Script 연동
      if (GOOGLE_SCRIPT_URL) {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      // 데모 모드일 때도 성공 처리
      console.log("Feedback submitted:", payload);
      setSubmitted(true);
    } catch (err) {
      console.error("Submit error:", err);
      alert("전송 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&family=Playfair+Display:wght@600;700&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: 'Noto Sans KR', sans-serif;
          background: #FAFAFA;
          min-height: 100vh;
          color: #2D2240;
        }

        @keyframes floatParticle {
          0%, 100% { transform: translateY(0) translateX(0); }
          33% { transform: translateY(-20px) translateX(10px); }
          66% { transform: translateY(10px) translateX(-15px); }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes checkDraw {
          from { stroke-dashoffset: 48; }
          to { stroke-dashoffset: 0; }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .card {
          background: white;
          border-radius: 0 0 20px 20px;
          box-shadow: 0 4px 32px rgba(108, 63, 197, 0.06), 0 1px 4px rgba(0,0,0,0.04);
          border: 1px solid rgba(108, 63, 197, 0.08);
          border-top: none;
          max-width: 440px;
          width: 100%;
          margin: 0 auto;
          overflow: hidden;
          position: relative;
          z-index: 1;
        }

        .submit-btn {
          width: 100%;
          padding: 16px;
          border: none;
          border-radius: 14px;
          font-family: 'Noto Sans KR', sans-serif;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(.34,1.56,.64,1);
          letter-spacing: 0.02em;
        }

        .submit-btn:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(108, 63, 197, 0.25);
        }

        .submit-btn:active {
          transform: translateY(0);
        }

        textarea {
          width: 100%;
          border: 1.5px solid #E8E0F0;
          border-radius: 14px;
          padding: 16px;
          font-family: 'Noto Sans KR', sans-serif;
          font-size: 14px;
          line-height: 1.7;
          resize: vertical;
          min-height: 120px;
          transition: border-color 0.3s, box-shadow 0.3s;
          background: #FCFAFF;
          color: #2D2240;
          outline: none;
        }

        textarea:focus {
          border-color: #6C3FC5;
          box-shadow: 0 0 0 3px rgba(108, 63, 197, 0.1);
        }

        textarea::placeholder {
          color: #B0A3C4;
        }

        .rating-label {
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 500;
          color: #6C3FC5;
          transition: opacity 0.3s;
        }

        .issue-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(108, 63, 197, 0.08);
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          color: #6C3FC5;
        }

        .coffee-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 28px;
          border-radius: 14px;
          background: linear-gradient(135deg, #FFF8E7, #FFF1CC);
          border: 1.5px solid #E8D5A0;
          color: #8B6914;
          font-family: 'Noto Sans KR', sans-serif;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(.34,1.56,.64,1);
          cursor: pointer;
        }

        .coffee-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(212, 168, 83, 0.2);
          background: linear-gradient(135deg, #FFF1CC, #FFE9AA);
        }

        .coffee-btn:active {
          transform: translateY(0);
        }

        .qr-overlay {
          position: fixed;
          inset: 0;
          background: rgba(45, 34, 64, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 20px;
        }

        .qr-modal {
          background: white;
          border-radius: 20px;
          padding: 36px 32px 28px;
          text-align: center;
          position: relative;
          box-shadow: 0 20px 60px rgba(108, 63, 197, 0.15);
          max-width: 320px;
          width: 100%;
        }
      `}</style>

      <Particles />

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Banner Image */}
        <div
          style={{
            maxWidth: "440px",
            width: "100%",
            margin: "0 auto 0",
            borderRadius: "20px 20px 0 0",
            overflow: "hidden",
            opacity: fadeIn ? 1 : 0,
            transform: fadeIn ? "translateY(0)" : "translateY(16px)",
            transition: "all 0.6s cubic-bezier(.22,1,.36,1)",
            position: "relative",
            zIndex: 1,
          }}
        >
          <img
            src="/banner.png"
            alt="월간 퍼플랩"
            style={{
              width: "100%",
              display: "block",
            }}
          />
        </div>

        {!submitted ? (
          <div
            className="card"
            ref={formRef}
            style={{
              opacity: fadeIn ? 1 : 0,
              transform: fadeIn ? "translateY(0)" : "translateY(24px)",
              transition: "all 0.7s cubic-bezier(.22,1,.36,1) 0.15s",
            }}
          >
            <div style={{ padding: "36px 32px 32px" }}>
              {/* Issue Tag */}
              <div style={{ textAlign: "center", marginBottom: "28px" }}>
                <span className="issue-tag">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6C3FC5" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  {issueLabel} 피드백
                </span>
              </div>

              {/* Rating Section */}
              <div style={{ marginBottom: "32px" }}>
                <p
                  style={{
                    textAlign: "center",
                    fontSize: "15px",
                    fontWeight: 500,
                    color: "#4A3D5E",
                    marginBottom: "16px",
                  }}
                >
                  이번 뉴스레터는 어떠셨나요?
                </p>
                <StarRating value={rating} onChange={setRating} />
                <div className="rating-label" style={{ marginTop: "8px" }}>
                  {rating > 0 ? ratingLabels[rating] : "\u00A0"}
                </div>
              </div>

              {/* Divider */}
              <div
                style={{
                  height: "1px",
                  background: "linear-gradient(90deg, transparent, #E8E0F0, transparent)",
                  margin: "0 0 28px",
                }}
              />

              {/* Comment Section */}
              <div style={{ marginBottom: "28px" }}>
                <p
                  style={{
                    fontSize: "15px",
                    fontWeight: 500,
                    color: "#4A3D5E",
                    marginBottom: "12px",
                  }}
                >
                  의견을 들려주세요
                  <span style={{ fontSize: "12px", fontWeight: 400, color: "#B0A3C4", marginLeft: "8px" }}>
                    선택사항
                  </span>
                </p>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="유익했던 내용, 다뤄줬으면 하는 주제, 개선사항 등 자유롭게 남겨주세요."
                  maxLength={500}
                />
                <div
                  style={{
                    textAlign: "right",
                    fontSize: "12px",
                    color: "#B0A3C4",
                    marginTop: "6px",
                  }}
                >
                  {comment.length}/500
                </div>
              </div>

              {/* Submit Button */}
              <button
                className="submit-btn"
                disabled={rating === 0 || sending}
                onClick={handleSubmit}
                style={{
                  background: rating > 0
                    ? "linear-gradient(135deg, #6C3FC5, #8B5FD6)"
                    : "#E8E0F0",
                  color: rating > 0 ? "white" : "#B0A3C4",
                  opacity: sending ? 0.7 : 1,
                }}
              >
                {sending ? "전송 중..." : "피드백 보내기"}
              </button>

              <p
                style={{
                  textAlign: "center",
                  fontSize: "12px",
                  color: "#C4B5D9",
                  marginTop: "16px",
                  lineHeight: 1.5,
                }}
              >
                익명으로 수집되며, 더 나은 뉴스레터를 만드는 데 활용됩니다.
              </p>

              {/* Coffee Gift Section */}
              <div
                style={{
                  marginTop: "28px",
                  borderTop: "1px dashed #E8E0F0",
                  paddingTop: "24px",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontSize: "13px",
                    color: "#9B85B5",
                    marginBottom: "14px",
                    lineHeight: 1.6,
                  }}
                >
                  뉴스레터가 도움이 되셨다면,
                  <br />
                  작성자에게 커피 한 잔을 선물해 주세요 ☕
                </p>
                <button
                  type="button"
                  onClick={handleCoffee}
                  className="coffee-btn"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                    <path
                      d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"
                      stroke="#D4A853"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  커피 선물하기
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Success State */
          <div
            className="card"
            style={{
              animation: "scaleIn 0.5s cubic-bezier(.22,1,.36,1)",
            }}
          >
            <div
              style={{
                padding: "48px 32px",
                textAlign: "center",
              }}
            >
              {/* Check Circle */}
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #6C3FC5, #8B5FD6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                  animation: "pulse 2s ease-in-out infinite",
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <polyline
                    points="6,12 10,16 18,8"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="48"
                    style={{ animation: "checkDraw 0.6s ease 0.3s both" }}
                  />
                </svg>
              </div>

              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#2D2240",
                  marginBottom: "12px",
                }}
              >
                감사합니다!
              </h2>
              <p
                style={{
                  fontSize: "14px",
                  color: "#7A6B8F",
                  lineHeight: 1.7,
                }}
              >
                소중한 피드백이 전달되었어요.
                <br />
                더 좋은 뉴스레터로 돌아올게요 ✨
              </p>

              {/* Coffee Gift in Success */}
              <div
                style={{
                  margin: "28px 0",
                  padding: "20px",
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, #FFFCF2, #FFF8E7)",
                  border: "1px solid #F0E4C0",
                }}
              >
                <p
                  style={{
                    fontSize: "13px",
                    color: "#8B6914",
                    marginBottom: "14px",
                    lineHeight: 1.6,
                  }}
                >
                  작성자에게 커피 한 잔의 응원을 보내보세요 ☕
                </p>
                <button
                  type="button"
                  onClick={handleCoffee}
                  className="coffee-btn"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                    <path
                      d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"
                      stroke="#D4A853"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  카카오페이로 커피 선물하기
                </button>
              </div>

              <button
                className="submit-btn"
                onClick={() => {
                  setSubmitted(false);
                  setRating(0);
                  setComment("");
                }}
                style={{
                  marginTop: "28px",
                  background: "rgba(108, 63, 197, 0.08)",
                  color: "#6C3FC5",
                }}
              >
                다시 작성하기
              </button>
            </div>
          </div>
        )}

        {/* QR Code Modal */}
        {showQR && (
          <div
            className="qr-overlay"
            onClick={() => setShowQR(false)}
          >
            <div
              className="qr-modal"
              onClick={(e) => e.stopPropagation()}
              style={{ animation: "scaleIn 0.3s cubic-bezier(.22,1,.36,1)" }}
            >
              <button
                onClick={() => setShowQR(false)}
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#9B85B5",
                  fontSize: "20px",
                  padding: "4px 8px",
                }}
              >
                ✕
              </button>
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#2D2240",
                  marginBottom: "6px",
                }}
              >
                커피 선물하기 ☕
              </p>
              <p
                style={{
                  fontSize: "13px",
                  color: "#9B85B5",
                  marginBottom: "20px",
                  lineHeight: 1.5,
                }}
              >
                카카오페이 앱으로 QR코드를 스캔해 주세요
              </p>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent("https://qr.kakaopay.com/Ej9EHUpMj")}`}
                alt="카카오페이 QR코드"
                style={{
                  width: "200px",
                  height: "200px",
                  borderRadius: "12px",
                  border: "1px solid #E8E0F0",
                }}
              />
              <p
                style={{
                  fontSize: "11px",
                  color: "#C4B5D9",
                  marginTop: "16px",
                }}
              >
                감사한 마음은 금액과 상관없이 큰 힘이 됩니다
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            marginTop: "32px",
            textAlign: "center",
            opacity: fadeIn ? 1 : 0,
            transition: "opacity 0.6s ease 0.4s",
          }}
        >
          <p style={{ fontSize: "12px", color: "#B0A3C4" }}>
            © 퍼포먼스플러스랩 · Performance Plus Lab
          </p>
        </div>
      </div>
    </>
  );
}
