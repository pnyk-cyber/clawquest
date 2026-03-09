import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronIcon,
  CloseIcon,
  BlockCheckIcon,
  WarningTriangleIcon,
  ExternalArrowIcon,
} from "@/components/NeuralLinkIcons";

type Phase =
  | "select"
  | "email"
  | "verify"
  | "wallet-list"
  | "wallet-connecting"
  | "wallet-sign"
  | "success"
  | "guest-confirm"
  | "guest-active";

const MOCK_WALLET = "0xC1AW...7F3B";
const MOCK_WALLETS = [
  { name: "METAMASK", id: "metamask" },
  { name: "PHANTOM", id: "phantom" },
  { name: "WALLETCONNECT", id: "walletconnect" },
];

const NeuralLink = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("select");
  const [email, setEmail] = useState("");
  const [verifyCode, setVerifyCode] = useState(["", "", "", "", "", ""]);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [shakeError, setShakeError] = useState(false);
  const [wipeTransition, setWipeTransition] = useState(false);
  const [connectProgress, setConnectProgress] = useState(0);
  const verifyRefs = useRef<(HTMLInputElement | null)[]>([]);

  const triggerError = useCallback((msg: string) => {
    setError(msg);
    setShakeError(true);
    setTimeout(() => setShakeError(false), 300);
    setTimeout(() => setError(""), 3000);
  }, []);

  const wipeToPhase = useCallback((nextPhase: Phase) => {
    setWipeTransition(true);
    setTimeout(() => {
      setPhase(nextPhase);
      setWipeTransition(false);
    }, 400);
  }, []);

  const handleEmailSubmit = useCallback(() => {
    if (!email || !email.includes("@")) {
      triggerError("INVALID");
      return;
    }
    wipeToPhase("verify");
  }, [email, triggerError, wipeToPhase]);

  const handleVerifyInput = useCallback(
    (index: number, value: string) => {
      if (!/^\d*$/.test(value)) return;
      const newCode = [...verifyCode];
      newCode[index] = value.slice(-1);
      setVerifyCode(newCode);
      if (value && index < 5) {
        verifyRefs.current[index + 1]?.focus();
      }
      if (newCode.every((c) => c !== "")) {
        setTimeout(() => wipeToPhase("success"), 600);
      }
    },
    [verifyCode, wipeToPhase]
  );

  const handleVerifyKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent) => {
      if (e.key === "Backspace" && !verifyCode[index] && index > 0) {
        verifyRefs.current[index - 1]?.focus();
      }
    },
    [verifyCode]
  );

  const handleWalletConnect = useCallback(
    (walletId: string) => {
      setSelectedWallet(walletId);
      setConnectProgress(0);
      setPhase("wallet-connecting");
    },
    []
  );

  // Progress bar for wallet connection
  useEffect(() => {
    if (phase !== "wallet-connecting") return;
    const interval = setInterval(() => {
      setConnectProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setPhase("wallet-sign"), 200);
          return 100;
        }
        return p + 2;
      });
    }, 40);
    return () => clearInterval(interval);
  }, [phase]);

  const handleComplete = useCallback(() => {
    navigate("/?linked=true");
  }, [navigate]);

  const handleGuestConfirm = useCallback(() => {
    setPhase("guest-active");
    setTimeout(() => navigate("/?mode=guest"), 1500);
  }, [navigate]);

  return (
    <div className="industimal-page fixed inset-0 z-50 overflow-hidden">
      {/* Noise texture */}
      <div className="industimal-noise" />

      {/* Wipe transition */}
      <div
        className={`industimal-wipe ${wipeTransition ? "active" : ""}`}
      />

      {/* STEP 1: SELECT METHOD */}
      {phase === "select" && (
        <div className="industimal-container animate-industimal-enter">
          <div className="industimal-content-left">
            <h1 className="industimal-header-massive">CONNECT</h1>
            <p className="industimal-subheader">Select interface method</p>

            <div className="mt-16 space-y-0">
              {/* EMAIL */}
              <button
                onClick={() => wipeToPhase("email")}
                className="industimal-method-row group"
              >
                <span className="industimal-method-name">EMAIL</span>
                <ChevronIcon className="industimal-method-arrow group-hover:translate-x-2" />
              </button>

              {/* WALLET */}
              <button
                onClick={() => wipeToPhase("wallet-list")}
                className="industimal-method-row group"
              >
                <span className="industimal-method-name">WALLET</span>
                <ChevronIcon className="industimal-method-arrow group-hover:translate-x-2" />
              </button>

              {/* GUEST */}
              <button
                onClick={() => wipeToPhase("guest-confirm")}
                className="industimal-method-row industimal-method-guest group"
              >
                <span className="industimal-method-name">GUEST</span>
                <ChevronIcon className="industimal-method-arrow group-hover:translate-x-2" />
              </button>
            </div>

            <button
              onClick={() => navigate("/")}
              className="industimal-back-link mt-12"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: EMAIL */}
      {phase === "email" && (
        <div className="industimal-container animate-industimal-enter">
          <div className="industimal-content-left">
            <h1 className="industimal-header-medium">EMAIL</h1>

            <div className="mt-12">
              <label className="industimal-label">ADDRESS</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
                className={`industimal-input ${shakeError ? "industimal-shake" : ""}`}
                autoFocus
              />
              {error && (
                <p className="industimal-error-text">{error}</p>
              )}
            </div>

            <button
              onClick={handleEmailSubmit}
              className="industimal-btn-primary mt-8"
            >
              CONTINUE
            </button>

            <button
              onClick={() => wipeToPhase("select")}
              className="industimal-back-link mt-6"
            >
              ← Return to methods
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: VERIFY */}
      {phase === "verify" && (
        <div className="industimal-container animate-industimal-enter">
          <div className="industimal-content-left">
            <h1 className="industimal-header-medium">VERIFY</h1>
            <p className="industimal-subheader mt-2">Code sent to {email}</p>

            <div className={`flex gap-4 mt-12 ${shakeError ? "industimal-shake" : ""}`}>
              {verifyCode.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { verifyRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleVerifyInput(i, e.target.value)}
                  onKeyDown={(e) => handleVerifyKeyDown(i, e)}
                  className={`industimal-verify-box ${digit ? "filled" : ""}`}
                  autoFocus={i === 0}
                />
              ))}
            </div>

            <button
              onClick={() => {
                setVerifyCode(["", "", "", "", "", ""]);
              }}
              className="industimal-resend-link mt-6"
            >
              Resend code
            </button>

            <button
              onClick={() => wipeToPhase("email")}
              className="industimal-back-link mt-4"
            >
              ← Return to email
            </button>
          </div>
        </div>
      )}

      {/* WALLET LIST */}
      {phase === "wallet-list" && (
        <div className="industimal-container animate-industimal-enter">
          <div className="industimal-content-left">
            <h1 className="industimal-header-medium">WALLET</h1>
            <p className="industimal-subheader mt-2">Select provider</p>

            <div className="mt-12 space-y-0">
              {MOCK_WALLETS.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => handleWalletConnect(wallet.id)}
                  className="industimal-method-row group"
                >
                  <span className="industimal-method-name text-lg">{wallet.name}</span>
                  <ExternalArrowIcon className="industimal-method-arrow group-hover:translate-x-2" />
                </button>
              ))}
            </div>

            <button
              onClick={() => wipeToPhase("select")}
              className="industimal-back-link mt-12"
            >
              ← Return to methods
            </button>
          </div>
        </div>
      )}

      {/* WALLET CONNECTING */}
      {phase === "wallet-connecting" && (
        <div className="industimal-container animate-industimal-enter">
          <div className="industimal-content-left">
            <h1 className="industimal-header-medium">CONNECTING</h1>
            <p className="industimal-subheader mt-2">{selectedWallet?.toUpperCase()}</p>

            <div className="mt-12">
              <div className="industimal-progress-track">
                <div
                  className="industimal-progress-bar"
                  style={{ width: `${connectProgress}%` }}
                />
              </div>
              <p className="industimal-mono-small mt-4">{connectProgress}%</p>
            </div>
          </div>
        </div>
      )}

      {/* WALLET SIGN */}
      {phase === "wallet-sign" && (
        <div className="industimal-container animate-industimal-enter">
          <div className="industimal-content-left">
            <h1 className="industimal-header-medium">CONFIRM</h1>

            <div className="industimal-terminal-block mt-12">
              <p><span className="industimal-terminal-label">ACTION</span> SIGN_MESSAGE</p>
              <p><span className="industimal-terminal-label">WALLET</span> {selectedWallet?.toUpperCase()}</p>
              <p><span className="industimal-terminal-label">HASH</span> 0x7f3b...c1aw</p>
              <p><span className="industimal-terminal-label">NONCE</span> 42</p>
            </div>

            <button
              onClick={() => wipeToPhase("success")}
              className="industimal-btn-primary mt-8"
            >
              CONFIRM
            </button>

            <button
              onClick={() => wipeToPhase("wallet-list")}
              className="industimal-back-link mt-6"
            >
              ← Cancel
            </button>
          </div>
        </div>
      )}

      {/* SUCCESS */}
      {phase === "success" && (
        <div className="industimal-container animate-industimal-enter">
          <div className="industimal-content-left">
            <h1 className="industimal-header-massive">ACCESS<br/>GRANTED</h1>

            <div className="mt-8 flex items-center gap-3">
              <BlockCheckIcon className="w-5 h-5 text-[#f0f0f0]" />
              <span className="industimal-mono-small">{MOCK_WALLET}</span>
            </div>

            <div className="industimal-status-indicator mt-6">
              <span className="industimal-status-dot" />
              <span className="industimal-mono-small">LINK ACTIVE</span>
            </div>

            <button
              onClick={handleComplete}
              className="industimal-btn-primary mt-12"
            >
              CONTINUE
            </button>
          </div>
        </div>
      )}

      {/* GUEST CONFIRM */}
      {phase === "guest-confirm" && (
        <div className="industimal-container animate-industimal-enter">
          <div className="industimal-content-left">
            <h1 className="industimal-header-medium">GUEST</h1>

            <div className="industimal-warning-block mt-12">
              <WarningTriangleIcon className="w-5 h-5 text-[#ff9500] shrink-0" />
              <div>
                <p className="industimal-warning-title">LIMITED ACCESS</p>
                <ul className="industimal-warning-list">
                  <li>Demo specimens only</li>
                  <li>No token earnings</li>
                  <li>Battle history not saved</li>
                  <li>No breeding access</li>
                </ul>
              </div>
            </div>

            <button
              onClick={handleGuestConfirm}
              className="industimal-btn-secondary mt-8"
            >
              CONTINUE AS GUEST
            </button>

            <button
              onClick={() => wipeToPhase("select")}
              className="industimal-back-link mt-6"
            >
              ← Return to methods
            </button>
          </div>
        </div>
      )}

      {/* GUEST ACTIVE */}
      {phase === "guest-active" && (
        <div className="industimal-container animate-industimal-enter">
          <div className="industimal-content-left">
            <h1 className="industimal-header-medium">LOADING</h1>
            <div className="mt-8">
              <div className="industimal-progress-track">
                <div className="industimal-progress-bar industimal-progress-animate" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NeuralLink;
