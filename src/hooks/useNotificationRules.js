// src/hooks/useNotificationRules.js

import { useCallback, useEffect, useState } from "react";

import notificationRuleService from "../services/notificationRuleService";

export default function useNotificationRules() {
  const [rules, setRules] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  // ==================================================
  // Load Rules
  // ==================================================

  const fetchRules = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data =
        await notificationRuleService.getRules();

      setRules(data);
    } catch (err) {
      setError(
        err?.message ||
          "Gagal memuat aturan notifikasi."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================================================
  // Create
  // ==================================================

  const createRule = useCallback(
    async (rule) => {
      try {
        const newRule =
          await notificationRuleService.createRule(
            rule
          );

        setRules((prev) => [newRule, ...prev]);

        return newRule;
      } catch (err) {
        setError(
          err?.message ||
            "Gagal menambahkan aturan."
        );

        throw err;
      }
    },
    []
  );

  // ==================================================
  // Update
  // ==================================================

  const updateRule = useCallback(
    async (id, payload) => {
      try {
        const updatedRule =
          await notificationRuleService.updateRule(
            id,
            payload
          );

        setRules((prev) =>
          prev.map((rule) =>
            rule.id === id ? updatedRule : rule
          )
        );

        return updatedRule;
      } catch (err) {
        setError(
          err?.message ||
            "Gagal memperbarui aturan."
        );

        throw err;
      }
    },
    []
  );

  // ==================================================
  // Delete
  // ==================================================

  const deleteRule = useCallback(async (id) => {
    try {
      await notificationRuleService.deleteRule(id);

      setRules((prev) =>
        prev.filter((rule) => rule.id !== id)
      );
    } catch (err) {
      setError(
        err?.message ||
          "Gagal menghapus aturan."
      );

      throw err;
    }
  }, []);

  // ==================================================
  // Toggle Enabled
  // ==================================================

  const toggleRule = useCallback(async (id) => {
    try {
      const updated =
        await notificationRuleService.toggleRule(
          id
        );

      setRules((prev) =>
        prev.map((rule) =>
          rule.id === id ? updated : rule
        )
      );

      return updated;
    } catch (err) {
      setError(
        err?.message ||
          "Gagal mengubah status aturan."
      );

      throw err;
    }
  }, []);

  // ==================================================
  // Duplicate
  // ==================================================

  const duplicateRule = useCallback(
    async (id) => {
      try {
        const duplicated =
          await notificationRuleService.duplicateRule(
            id
          );

        setRules((prev) => [
          duplicated,
          ...prev,
        ]);

        return duplicated;
      } catch (err) {
        setError(
          err?.message ||
            "Gagal menduplikasi aturan."
        );

        throw err;
      }
    },
    []
  );

  // ==================================================
  // Initial Load
  // ==================================================

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  return {
    rules,

    loading,

    error,

    refresh: fetchRules,

    createRule,

    updateRule,

    deleteRule,

    toggleRule,

    duplicateRule,
  };
}