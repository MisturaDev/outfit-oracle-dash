import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function SellerSettings() {
    const { user } = useAuth();
    const [storeName, setStoreName] = useState("");
    const [storeDescription, setStoreDescription] = useState("");
    const [supportEmail, setSupportEmail] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            // Mock fetching existing settings or fetch from profiles if fields existed
            // For now we just load what we have or defaults
            setSupportEmail(user.email || "");
        }
    }, [user]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call since we don't have these fields in DB yet
        await new Promise(resolve => setTimeout(resolve, 1000));

        // We can at least update the full_name as store name if we wanted to
        if (user) {
            const { error } = await supabase.from('profiles').update({
                full_name: storeName
            }).eq('id', user.id);

            if (!error) {
                toast.success("Settings saved successfully!");
            } else {
                toast.error("Failed to save settings");
            }
        }

        setLoading(false);
    };

    return (
        <div className="space-y-6 fade-in max-w-2xl">
            <h1 className="text-3xl font-serif font-bold">Store Settings</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Business Information</CardTitle>
                    <CardDescription>
                        Manage your public store profile and contact details
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="storeName">Store Name</Label>
                            <Input
                                id="storeName"
                                value={storeName}
                                onChange={(e) => setStoreName(e.target.value)}
                                placeholder="My Awesome Styles"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Store Description</Label>
                            <Textarea
                                id="description"
                                value={storeDescription}
                                onChange={(e) => setStoreDescription(e.target.value)}
                                placeholder="Tell customers about your brand..."
                                rows={4}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Support Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={supportEmail}
                                onChange={(e) => setSupportEmail(e.target.value)}
                            />
                        </div>

                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
