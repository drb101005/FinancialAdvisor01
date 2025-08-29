import React, { useEffect, useMemo, useState } from "react";
import api from "../api/apiClient";

const Card = ({ children, className = "" }) => (
  <div className={`bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl ${className}`}>
    {children}
  </div>
);

export default function InvestmentProfile() {
  const [profile, setProfile] = useState(null);
  const [traitsJson, setTraitsJson] = useState("{}");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/profile/");
      setProfile(data);
      setTraitsJson(JSON.stringify(data.traits ?? {}, null, 2));
      setErr("");
    } catch {
      setErr("Failed to load profile.");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const prettyType = useMemo(() => profile?.profile_type || "—", [profile]);

  const handleSave = async () => {
    setSaving(true);
    setErr("");
    try {
      let traitsParsed = {};
      try {
        traitsParsed = JSON.parse(traitsJson || "{}");
      } catch {
        setErr("Traits JSON is invalid.");
        setSaving(false);
        return;
      }
      const { data } = await api.post("/profile/update/", { traits: traitsParsed });
      setProfile(data);
    } catch {
      setErr("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen px-4 md:px-8 py-10 text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
          Investment Profile
        </h1>

        {err && <Card className="text-red-300">{err}</Card>}

        {profile && (
          <>
            <Card className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="text-sm text-gray-300 mb-2">Traits (JSON)</div>
                <textarea
                  rows={14}
                  value={traitsJson}
                  onChange={(e) => setTraitsJson(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gray-600 text-white font-mono text-sm focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                />
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="mt-4 w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Traits"}
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-gray-300 text-sm">Profile Type</div>
                  <div className="text-xl font-semibold">{prettyType}</div>
                </div>
                <div>
                  <div className="text-gray-300 text-sm">Created</div>
                  <div>{new Date(profile.created_at).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-300 text-sm">Updated</div>
                  <div>{new Date(profile.updated_at).toLocaleString()}</div>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
