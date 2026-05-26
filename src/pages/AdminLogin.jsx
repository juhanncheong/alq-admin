import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, KeyRound, Database, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    if (!String(phoneNumber).trim() || !password) {
      toast.error("Phone number and password are required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL ||
          "https://shaky-emmye-jayjay122-068ebc66.koyeb.app"
        }/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phoneNumber: String(phoneNumber).trim(),
            password,
          }),
        }
      );

      let data = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      console.log("[AdminLogin] status:", res.status);
      console.log("[AdminLogin] response:", data);

      if (!res.ok) {
        throw new Error(data?.message || `Login failed (${res.status})`);
      }

      if (!data?.token) {
        throw new Error("Login succeeded but token missing");
      }

      if (data?.user?.role !== "admin") {
        throw new Error("Admin only. This account is not admin.");
      }

      localStorage.setItem("admin_token", data.token);
      console.log("[AdminLogin] saved admin_token:", data.token);

      toast.success("Login successful");
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      console.error("[AdminLogin] login error:", err);
      toast.error(err.message || "Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#0B1020]">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 left-1/2 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl sm:left-20 sm:h-[520px] sm:w-[520px] sm:translate-x-0" />
        <div className="absolute top-24 right-0 h-[300px] w-[300px] rounded-full bg-white/5 blur-3xl sm:right-24 sm:h-[520px] sm:w-[520px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.06] via-transparent to-transparent" />
      </div>

      <div className="relative flex min-h-screen w-full items-center justify-center px-3 py-5 sm:px-6 sm:py-8">
        <div className="w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative p-5 text-white sm:p-7 md:p-9">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
                  <Shield className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <div className="truncate text-[15px] font-semibold tracking-tight">
                    ALQ Admin
                  </div>
                  <div className="mt-0.5 text-xs text-white/45">
                    Internal Portal
                  </div>
                </div>
              </div>

              <p className="mt-5 max-w-md text-sm leading-relaxed text-white/70 sm:mt-6">
                Secure access for administrators only.
              </p>

              <div className="mt-5 flex flex-wrap gap-2 sm:mt-6">
                <Tag
                  icon={<KeyRound className="h-3.5 w-3.5" />}
                  text="Invite-only system"
                />
                <Tag
                  icon={<Lock className="h-3.5 w-3.5" />}
                  text="JWT secured"
                />
                <Tag
                  icon={<Database className="h-3.5 w-3.5" />}
                  text="MongoDB Atlas"
                />
              </div>

              <div className="mt-6 hidden grid-cols-1 gap-3 sm:grid sm:grid-cols-2 md:mt-8">
                <MiniCard title="Security" value="High" />
                <MiniCard title="System" value="Online" />
                <div className="sm:col-span-2">
                  <MiniCard title="Access" value="Admin-only" />
                </div>
              </div>

              <div className="mt-6 hidden text-xs text-white/30 sm:block md:mt-10">
                © {new Date().getFullYear()} Brush • Internal Admin Portal
              </div>
            </div>

            <div className="bg-white p-5 sm:p-7 md:p-9">
              <div className="mx-auto w-full max-w-md">
                <div className="text-[20px] font-semibold tracking-tight text-black">
                  Admin Login
                </div>

                <div className="mt-1 text-sm text-black/55">
                  Enter your admin phone number and password.
                </div>

                <form onSubmit={handleLogin} className="mt-6 space-y-4">
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-black/70">
                      Phone Number
                    </label>

                    <input
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g. 123456"
                      className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-base text-black outline-none transition focus:border-black/30 focus:ring-4 focus:ring-black/5"
                      autoComplete="username"
                      inputMode="tel"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-black/70">
                      Password
                    </label>

                    <div className="relative">
                      <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type={show ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 pr-16 text-base text-black outline-none transition focus:border-black/30 focus:ring-4 focus:ring-black/5 sm:pr-24"
                        autoComplete="current-password"
                      />

                      <button
                        type="button"
                        onClick={() => setShow((s) => !s)}
                        className="absolute right-2 top-1/2 inline-flex h-10 -translate-y-1/2 items-center justify-center rounded-lg border border-black/10 bg-white px-3 text-xs text-black/70 hover:bg-black/5"
                      >
                        <span className="inline-flex items-center gap-1">
                          {show ? (
                            <>
                              <EyeOff className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Hide</span>
                            </>
                          ) : (
                            <>
                              <Eye className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Show</span>
                            </>
                          )}
                        </span>
                      </button>
                    </div>

                    <div className="mt-2 text-[11px] text-black/45">
                      Only admins can access this portal.
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 min-h-12 w-full rounded-xl bg-black px-4 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Signing in..." : "Login"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Tag({ icon, text }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70">
      <span className="text-white/70">{icon}</span>
      <span className="whitespace-nowrap">{text}</span>
    </div>
  );
}

function MiniCard({ title, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-4">
      <div className="text-[11px] text-white/50">{title}</div>
      <div className="mt-1 text-sm font-semibold text-white">{value}</div>
    </div>
  );
}