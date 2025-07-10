import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useRutas = (estado = "") =>
  useQuery({
    queryKey: ["rutas", estado],
    queryFn: async () => {
      const url = estado
        ? `http://localhost:3000/api/routes?status=${estado}`
        : "http://localhost:3000/api/routes";
      const { data } = await axios.get(url);
      /*  Ͱ  aseguramos array ───────────────────── */
      return Array.isArray(data) ? data : [];
    },
  });
