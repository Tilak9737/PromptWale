"use client";

import { useState, useEffect } from "react";
import { Settings, Save, Globe, Lock, Bell, Palette, Database, Check, Shield, Zap, Loader2 } from "lucide-react";
import { getSystemSettings, updateSystemSettings } from "@/actions/settings";
import { updateAdminPassword } from "@/actions/admin";

export default function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState("general");
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Form State
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [siteName, setSiteName] = useState("PromptWale");
    const [adminEmail, setAdminEmail] = useState("admin@promptwale.com");
    const [baseUrl, setBaseUrl] = useState("https://promptwale.com");

    const [cacheCleared, setCacheCleared] = useState(false);

    // Security State
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passChanging, setPassChanging] = useState(false);

    useEffect(() => {
        getSystemSettings().then(settings => {
            setMaintenanceMode(settings.maintenanceMode);
            setSiteName(settings.siteName);
            setIsLoading(false);
        });
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        const result = await updateSystemSettings({
            maintenanceMode,
            siteName,
        });

        if (result.success) {
            setTimeout(() => setIsSaving(false), 800);
        } else {
            alert("Failed to save settings");
            setIsSaving(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) return alert("Passwords do not match!");

        setPassChanging(true);
        const res = await updateAdminPassword({ currentPassword, newPassword });

        if (res.success) {
            alert("Password updated successfully!");
            setShowPasswordModal(false);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } else {
            alert(res.error || "Failed to update password.");
        }
        setPassChanging(false);
    };

    const handleClearCache = () => {
        setCacheCleared(true);
        setTimeout(() => setCacheCleared(false), 2000);
    };

    const tabs = [
        { id: "general", label: "General Site", icon: Globe },
        { id: "security", label: "Security", icon: Lock },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "appearance", label: "Appearance", icon: Palette },
    ];

    if (isLoading) {
        return (
            <div className="h-64 flex flex-col items-center justify-center text-muted-foreground">
                <Loader2 className="animate-spin mb-2" size={32} />
                <p className="font-medium">Loading settings...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 uppercase">
                    <div className="bg-card border border-border w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                            <Lock className="text-primary" size={20} />
                            <span>Change Admin Password</span>
                        </h3>
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Current Password</label>
                                <input
                                    type="password"
                                    required
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none normal-case"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none normal-case"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Confirm New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none normal-case"
                                />
                            </div>
                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordModal(false)}
                                    className="flex-1 px-4 py-3 bg-muted border border-border rounded-xl font-bold hover:bg-muted/80 transition-colors uppercase"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={passChanging}
                                    className="flex-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 uppercase"
                                >
                                    {passChanging ? "Updating..." : "Update"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
                    <p className="text-muted-foreground">Global configuration for the PromptWale platform.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:shadow-lg transition-all min-w-[160px] disabled:opacity-50"
                >
                    {isSaving ? (
                        <Zap size={18} className="animate-pulse" />
                    ) : (
                        <Save size={18} />
                    )}
                    <span>{isSaving ? "Saving..." : "Save Settings"}</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Navigation Sidebar */}
                <div className="md:col-span-1 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-left transition-all ${activeTab === tab.id
                                ? "bg-primary text-primary-foreground shadow-md"
                                : "text-muted-foreground hover:bg-muted"
                                }`}
                        >
                            <tab.icon size={18} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Settings Form Area */}
                <div className="md:col-span-3 space-y-6">
                    {activeTab === "general" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm space-y-6">
                                <h2 className="text-lg font-bold flex items-center space-x-2">
                                    <Settings size={20} className="text-primary" />
                                    <span>General Configuration</span>
                                </h2>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold">Site Name</label>
                                        <input
                                            type="text"
                                            value={siteName}
                                            onChange={(e) => setSiteName(e.target.value)}
                                            className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold">Base URL</label>
                                        <input
                                            type="text"
                                            value={baseUrl}
                                            onChange={(e) => setBaseUrl(e.target.value)}
                                            className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold">Admin Email</label>
                                        <input
                                            type="email"
                                            value={adminEmail}
                                            onChange={(e) => setAdminEmail(e.target.value)}
                                            className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm space-y-6">
                                <h2 className="text-lg font-bold flex items-center space-x-2">
                                    <Database size={20} className="text-primary" />
                                    <span>System Maintenance</span>
                                </h2>

                                <div className="space-y-4">
                                    <div
                                        className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border ${maintenanceMode ? "bg-orange-500/10 border-orange-500/30" : "bg-muted/30 border-transparent shadow-inner"
                                            }`}
                                        onClick={() => setMaintenanceMode(!maintenanceMode)}
                                    >
                                        <div>
                                            <p className="font-bold text-sm">Maintenance Mode</p>
                                            <p className="text-xs text-muted-foreground">Temporarily disable public access</p>
                                        </div>
                                        <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${maintenanceMode ? "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" : "bg-slate-300 dark:bg-slate-700"}`}>
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${maintenanceMode ? "left-7" : "left-1"}`}></div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleClearCache}
                                        disabled={cacheCleared}
                                        className={`w-full py-3 font-bold rounded-xl border transition-all flex items-center justify-center space-x-2 ${cacheCleared
                                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                                            : "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20"
                                            }`}
                                    >
                                        {cacheCleared ? <Check size={18} /> : <Database size={18} />}
                                        <span>{cacheCleared ? "System Cache Cleared!" : "Clear System Cache"}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "security" && (
                        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <h2 className="text-lg font-bold flex items-center space-x-2">
                                <Shield size={20} className="text-primary" />
                                <span>Security Settings</span>
                            </h2>
                            <div className="p-8 border-2 border-dashed border-border rounded-2xl text-center space-y-4">
                                <Lock className="mx-auto text-muted-foreground/50" size={48} />
                                <div>
                                    <p className="font-bold">Authentication & Access</p>
                                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">Manage admin passwords, API keys, and session timeouts.</p>
                                </div>
                                <button
                                    onClick={() => setShowPasswordModal(true)}
                                    className="px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all uppercase"
                                >
                                    Configure Passwords
                                </button>
                            </div>
                        </div>
                    )}

                    {(activeTab === "notifications" || activeTab === "appearance") && (
                        <div className="bg-card border border-border/50 rounded-2xl p-12 shadow-sm text-center space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                                <Palette size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold capitalize">{activeTab} Controls</h3>
                                <p className="text-muted-foreground">Advanced {activeTab} settings are coming soon in Phase 4.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
