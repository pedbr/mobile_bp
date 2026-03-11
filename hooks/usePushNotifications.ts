/**
 * Push notification permission and state hook.
 * Manages OneSignal permission, retrieves player ID, and syncs to Supabase profiles.
 */

import { useState, useEffect, useCallback } from "react";
import {
  hasPermission,
  requestPermission as requestOneSignalPermission,
  getPlayerId,
} from "@/lib/onesignal";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";

export function usePushNotifications() {
  const { user } = useAuthStore();
  const [hasPerm, setHasPerm] = useState(false);
  const [playerId, setPlayerId] = useState<string | null>(null);

  useEffect(() => {
    const check = async () => {
      const permitted = await hasPermission();
      setHasPerm(permitted);
      if (permitted) {
        const id = await getPlayerId();
        setPlayerId(id);
      }
    };
    check();
  }, []);

  const requestPermission = useCallback(async () => {
    const granted = await requestOneSignalPermission(false);
    setHasPerm(granted);
    if (!granted) return;

    const id = await getPlayerId();
    setPlayerId(id);

    if (id && user?.id) {
      await supabase
        .from("profiles")
        .update({
          onesignal_player_id: id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
    }
  }, [user?.id]);

  return {
    hasPermission: hasPerm,
    playerId,
    requestPermission,
  };
}
